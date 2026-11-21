import { getComponent, isBufferId, isHeatPumpId, resolvePorts } from '@/components/studio/registry';
import { simTankC, sondeCommand, sondeTankOf } from '@/components/studio/control';
import { clamp } from '@/components/studio/temperature';
import type {
  ComponentDef,
  EdgeSim,
  GraphEdge,
  GraphNode,
  NodeSim,
  SimIssue,
  SimResult,
} from '@/components/studio/types';

/**
 * Steady-state teaching model.
 *
 * Q = m·cp·ΔT with cp = 4.186 kJ/kg·K and ρ ≈ 0.997 kg/L.
 * Parallel branches share the loop flow equally (not by demand). A hotter
 * demand on one branch therefore makes a larger temperature drop.
 * The buffer is one fully mixed volume: the primary loop (heat pump) and the
 * secondary loop (heat users) exchange heat only, not water.
 * Primary flow comes from a circulation pump on that loop, or from the heat
 * pump's internal circulator when no dedicated pump is present. Secondary
 * flow comes only from a circulation pump on the user side. Several pumps in
 * series use the smaller flow.
 */

export const WATER_CP = 4.186;
export const WATER_RHO = 0.997;
export const T_ROOM = 20;
export const T_FLOOR = 16;
export const PUMP_NOMINAL_LPH = 1800;
export const INTERNAL_NOMINAL_LPH = 1500;

const SEC_OUT = ['sec-out-1', 'sec-out-2', 'sec-out-3', 'sec-out-4'];

interface Pipe {
  edgeId: string;
  fromNode: string;
  fromPort: string;
  toNode: string;
  toPort: string;
}

interface TracedPath {
  pipes: Pipe[];
  pumps: { nodeId: string; reversed: boolean }[];
  consumers: string[];
  buffers: { nodeId: string; via: 'primary' | 'secondary' }[];
  flowLph: number;
  /** 0 blocks the branch. 1 is fully open. */
  gain: number;
  relief: boolean;
}

interface DEdge extends Pipe {
  flowLph: number;
  temp: number;
}

type ExtractMode = 'nominal' | 'ratio';

interface PropResult {
  edgeTemp: Record<string, number>;
  consumer: Record<string, NodeSim>;
  pass: Record<string, NodeSim>;
  inlets: Record<string, { port: string; t: number; flowLph: number }[]>;
  hpReturn: number | null;
  qOut: number;
}

function emptyResult(): SimResult {
  return {
    ok: false,
    mode: 'empty',
    issues: [],
    edges: {},
    nodes: {},
    supplyC: null,
    returnC: null,
    dtC: null,
    primaryFlowLph: 0,
    secondaryFlowLph: 0,
    deliveredKw: 0,
    demandKw: 0,
    limited: false,
    tankC: null,
    primaryIdle: false,
  };
}

function lphToKgs(lph: number): number {
  return Math.max(lph, 0) / 3600 * WATER_RHO;
}

function extractHeat(qNom: number, tIn: number, flowLph: number, mode: ExtractMode, tSet: number) {
  const m = lphToKgs(flowLph);
  if (m < 1e-6 || qNom <= 0 || tIn <= T_FLOOR) return { q: 0, tOut: tIn, dt: 0 };
  const water = m * WATER_CP * Math.max(tIn - T_FLOOR, 0);
  let q = qNom;
  if (mode === 'ratio') {
    const span = Math.max(tSet - T_ROOM, 8);
    q = qNom * clamp((tIn - T_ROOM) / span, 0, 1);
  }
  q = Math.min(Math.max(q, 0), water);
  const dt = q / (m * WATER_CP);
  return { q, tOut: tIn - dt, dt };
}

function pumpLph(node: GraphNode | undefined, gates: Record<string, number> = {}): number {
  if (!node) return 0;
  if (gates[node.id] !== undefined && gates[node.id] < 0.5) return 0;
  return PUMP_NOMINAL_LPH * clamp(node.params.speed ?? 0, 0, 100) / 100;
}

export interface SimOptions {
  /** Buffer temperature while a primary-only loop is charging, °C. */
  tankC?: number;
  /**
   * Heat-pump warm-up state: the actual supply temperature the heat pump can
   * currently deliver (°C). The simulated supply ramps from the mid-20s warm
   * start toward the configured setpoint instead of jumping there at startup.
   * Omit to solve at the full setpoint (steady-state fixtures and tests).
   */
  hpSupplyC?: number;
}

/**
 * Warm-start supply the heat pump can actually deliver when simulation
 * starts, before it ramps toward its setpoint. T_ROOM + 5 lands in the
 * mid-20s, matching the long-standing buffer-only warm-up look.
 */
export const HP_WARM_START_C = T_ROOM + 5;

/** Classroom clock: a 200 L tank on a 12 kW heat pump approaches the setpoint in well under a minute. */
export const TEACHING_TIME = 48;

export function chargeBuffer(tankC: number, setpoint: number, flowLph: number, capacityKw: number, volumeL: number, dtSec: number): number {
  const flow = lphToKgs(flowLph);
  const heat = Math.min(Math.max(capacityKw, 0), flow * WATER_CP * Math.max(setpoint - tankC, 0));
  const mass = Math.max(volumeL, 1) * WATER_RHO;
  const rise = mass * WATER_CP > 0 ? (heat * TEACHING_TIME * Math.max(dtSec, 0)) / (mass * WATER_CP) : 0;
  return clamp(tankC + rise, T_ROOM, setpoint);
}

export function simulate(nodes: GraphNode[], edges: GraphEdge[], openings: Record<string, number> = {}, options: SimOptions = {}): SimResult {
  const result = emptyResult();
  const issues: SimIssue[] = [];
  const add = (level: SimIssue['level'], code: string) => {
    if (!issues.some((issue) => issue.code === code)) issues.push({ level, code });
  };

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
  const hp = nodes.find((node) => isHeatPumpId(node.componentId));
  const buffer = nodes.find((node) => isBufferId(node.componentId));

  if (nodes.filter((node) => isHeatPumpId(node.componentId)).length > 1) add('info', 'one-heat-pump');
  if (nodes.filter((node) => isBufferId(node.componentId)).length > 1) add('info', 'one-buffer');
  if (!nodes.some((node) => getComponent(node.componentId)?.category === 'consumer')) add('info', 'no-consumer');

  if (!hp) {
    if (nodes.length) add('info', 'no-heat-pump');
    result.issues = issues;
    result.mode = nodes.length ? 'incomplete' : 'empty';
    return result;
  }
  const hpId = hp.id;

  const links = new Map<string, { edgeId: string; nodeId: string; portId: string }>();
  for (const edge of edges) {
    // Control and measurement links carry no water and never join the traces.
    if (edge.kind === 'signal' || edge.kind === 'sense') continue;
    if (!edge.sourceHandle || !edge.targetHandle) continue;
    const forward = { edgeId: edge.id, nodeId: edge.target, portId: edge.targetHandle };
    const back = { edgeId: edge.id, nodeId: edge.source, portId: edge.sourceHandle };
    links.set(`${edge.source}:${edge.sourceHandle}`, forward);
    links.set(`${edge.target}:${edge.targetHandle}`, back);
  }

  const defOf = (nodeId: string): ComponentDef | undefined => {
    const node = nodeById.get(nodeId);
    return node ? getComponent(node.componentId) : undefined;
  };

  function openingOf(nodeId: string): number {
    if (openings[nodeId] !== undefined) return clamp(openings[nodeId], 0, 1);
    const node = nodeById.get(nodeId);
    if (!node) return 1;
    if (node.componentId === 'mixer') return clamp((node.params.mix ?? 50) / 100, 0, 1);
    if (node.componentId === 'valve-3way') return (node.params.manualPort ?? 0) >= 0.5 ? 1 : 0;
    if (node.componentId === 'valve') return clamp((node.params.opening ?? 100) / 100, 0, 1);
    if (node.componentId === 'relief') return 0;
    return 1;
  }

  /** Where water may leave, and the gain applied to that branch. */
  function leaveOptions(nodeId: string, enterPort: string, gain: number): { port: string; gain: number }[] {
    const def = defOf(nodeId);
    if (!def) return [];
    const open = (port: string, nextGain: number) => (nextGain > 0.02 ? [{ port, gain: nextGain }] : []);
    if (isHeatPumpId(def.id)) return [];
    if (isBufferId(def.id)) return enterPort === 'pri-in' ? [{ port: 'pri-out', gain }] : [];
    if (def.category === 'consumer') return enterPort === 'supply-in' ? [{ port: 'return-out', gain }] : [];
    if (def.id === 'pump' || def.id === 'air-vent') {
      return def.ports.filter((port) => port.id !== enterPort && port.terminal !== 'signal').map((port) => ({ port: port.id, gain }));
    }
    if (def.id === 'check') return enterPort === 'in' ? [{ port: 'out', gain }] : [];
    // A two-way valve is an inline gate: water may enter at either side and
    // leaves at the other with the opening applied. Closed blocks both
    // directions; open passes through normally.
    if (def.id === 'valve') {
      const gate = gain * openingOf(nodeId);
      if (enterPort === 'in') return [{ port: 'out', gain: gate }];
      if (enterPort === 'out') return [{ port: 'in', gain: gate }];
      return [];
    }
    if (def.id === 'relief') return enterPort === 'in' ? open('out', gain * openingOf(nodeId)) : [];
    if (def.id === 'valve-3way') {
      const diverted = openingOf(nodeId) >= 0.5;
      const active = diverted ? 'b' : 'a';
      if (enterPort === 'ab') return [{ port: active, gain }];
      if (enterPort === active) return [{ port: 'ab', gain }];
      return [];
    }
    if (def.id === 'mixer') {
      const hot = openingOf(nodeId);
      if (enterPort === 'h') return open('out', gain * hot);
      if (enterPort === 'c') return open('out', gain * (1 - hot));
      return [];
    }
    if (def.id === 'manifold-supply' || def.id === 'manifold-return') {
      const node = nodeById.get(nodeId);
      return resolvePorts(def, node?.params)
        .map((port) => port.id)
        .filter((id) => id !== enterPort && links.has(`${nodeId}:${id}`))
        .map((port) => ({ port, gain }));
    }
    if (def.id === 'tee' || def.id === 'junction') {
      const node = nodeById.get(nodeId);
      return resolvePorts(def, node?.params)
        .map((port) => port.id)
        .filter((id) => id !== enterPort && links.has(`${nodeId}:${id}`))
        .map((port) => ({ port, gain }));
    }
    return [];
  }

  function trace(startNode: string, startPort: string, isGoal: (nodeId: string, portId: string) => boolean): TracedPath[] {
    const results: TracedPath[] = [];
    interface Frame {
      nodeId: string;
      portId: string;
      pipes: Pipe[];
      pumps: TracedPath['pumps'];
      consumers: string[];
      buffers: TracedPath['buffers'];
      usedEdges: Set<string>;
      usedNodes: Set<string>;
      gain: number;
      relief: boolean;
    }
    const stack: Frame[] = [{
      nodeId: startNode,
      portId: startPort,
      pipes: [],
      pumps: [],
      consumers: [],
      buffers: [],
      usedEdges: new Set(),
      usedNodes: new Set([startNode]),
      gain: 1,
      relief: false,
    }];

    while (stack.length && results.length < 16) {
      const frame = stack.pop()!;
      if (frame.pipes.length > 18) continue;
      const link = links.get(`${frame.nodeId}:${frame.portId}`);
      if (!link || frame.usedEdges.has(link.edgeId)) continue;
      const usedEdges = new Set(frame.usedEdges);
      usedEdges.add(link.edgeId);
      const pipes = [...frame.pipes, {
        edgeId: link.edgeId,
        fromNode: frame.nodeId,
        fromPort: frame.portId,
        toNode: link.nodeId,
        toPort: link.portId,
      }];
      if (isGoal(link.nodeId, link.portId)) {
        results.push({
          pipes,
          pumps: frame.pumps,
          consumers: frame.consumers,
          buffers: frame.buffers,
          flowLph: 0,
          gain: frame.gain,
          relief: frame.relief,
        });
        continue;
      }
      if (pipes.length > 18) continue;
      const def = defOf(link.nodeId);
      if (!def) continue;
      // A tee, junction, manifold, or air vent is only a fitting. The same
      // body may carry cold water into a mixer and, later on that path, carry
      // the mixed return onward. Devices still cannot be revisited.
      const fitting = def.id === 'tee' || def.id === 'junction' || def.id === 'manifold-supply' || def.id === 'manifold-return' || def.id === 'air-vent';
      if (!fitting && frame.usedNodes.has(link.nodeId)) continue;
      const pumps = frame.pumps.slice();
      const consumers = frame.consumers.slice();
      const buffers = frame.buffers.slice();
      let relief = frame.relief;
      if (def.id === 'pump') pumps.push({ nodeId: link.nodeId, reversed: link.portId === 'out' });
      else if (def.category === 'consumer') consumers.push(link.nodeId);
      else if (isBufferId(def.id)) {
        buffers.push({ nodeId: link.nodeId, via: link.portId.startsWith('pri') ? 'primary' : 'secondary' });
      } else if (def.id === 'relief') relief = true;
      const usedNodes = new Set(frame.usedNodes);
      if (!fitting) usedNodes.add(link.nodeId);
      for (const leave of leaveOptions(link.nodeId, link.portId, frame.gain)) {
        stack.push({
          nodeId: link.nodeId,
          portId: leave.port,
          pipes,
          pumps: pumps.slice(),
          consumers: consumers.slice(),
          buffers: buffers.slice(),
          usedEdges: new Set(usedEdges),
          usedNodes: new Set(usedNodes),
          gain: leave.gain,
          relief,
        });
      }
    }
    return results;
  }

  function shareFlow(paths: TracedPath[], total: number, codes: string[], emptyCode: string) {
    if (total <= 0) {
      for (const path of paths) path.flowLph = 0;
      codes.push(emptyCode);
      return;
    }
    const sumGain = paths.reduce((sum, path) => sum + path.gain, 0);
    if (sumGain <= 1e-6) {
      for (const path of paths) path.flowLph = 0;
      codes.push('valves-closed');
      return;
    }
    for (const path of paths) path.flowLph = total * (path.gain / sumGain);
  }

  function assignFlows(paths: TracedPath[], fallbackLph: number, emptyCode: string): string[] {
    const codes: string[] = [];
    const n = paths.length;
    if (!n) return codes;
    const pumpIds = new Set<string>();
    for (const path of paths) for (const pump of path.pumps) pumpIds.add(pump.nodeId);

    const meta = (id: string) => {
      let reversed = false;
      for (const path of paths) {
        const found = path.pumps.find((pump) => pump.nodeId === id);
        if (found?.reversed) reversed = true;
      }
      return { reversed, lph: pumpLph(nodeById.get(id), openings) };
    };

    const trunk = [...pumpIds].filter((id) => paths.every((path) => path.pumps.some((pump) => pump.nodeId === id)));
    if (trunk.length) {
      const pumps = trunk.map(meta);
      if (pumps.some((pump) => pump.reversed)) {
        codes.push('reversed-pump');
        return codes;
      }
      const total = Math.min(...pumps.map((pump) => pump.lph));
      shareFlow(paths, total, codes, emptyCode);
      return codes;
    }

    if (pumpIds.size === 0) {
      shareFlow(paths, fallbackLph, codes, emptyCode);
      return codes;
    }

    const flows = paths.map((path) => {
      if (!path.pumps.length) return 0;
      if (path.pumps.some((pump) => pump.reversed)) {
        codes.push('reversed-pump');
        return 0;
      }
      return Math.min(...path.pumps.map((pump) => pumpLph(nodeById.get(pump.nodeId), openings))) * path.gain;
    });
    for (let iter = 0; iter < 6; iter++) {
      for (const id of pumpIds) {
        const idxs = paths
          .map((path, index) => (path.pumps.some((pump) => pump.nodeId === id) ? index : -1))
          .filter((index) => index >= 0);
        const sum = idxs.reduce((total, index) => total + flows[index], 0);
        const limit = pumpLph(nodeById.get(id), openings);
        if (sum > limit + 1e-6 && sum > 0) {
          const scale = limit / sum;
          for (const index of idxs) flows[index] *= scale;
        }
      }
    }
    paths.forEach((path, index) => { path.flowLph = flows[index]; });
    if (flows.every((flow) => flow <= 0) && !codes.includes('reversed-pump')) {
      codes.push(emptyCode);
    }
    return codes;
  }

  const fromHp = trace(hp.id, 'supply-out', (nodeId, portId) => nodeId === hp.id && portId === 'return-in');
  for (const path of fromHp) {
    if (!path.consumers.length && !path.buffers.length && !path.relief) add('warn', 'short');
  }

  const primaryPaths = buffer
    ? fromHp.filter((path) => path.buffers.some((item) => item.nodeId === buffer.id && item.via === 'primary'))
    : [];
  const directPaths = fromHp.filter((path) => path.consumers.length > 0 && path.buffers.length === 0);

  const secondaryPaths: TracedPath[] = [];
  if (buffer) {
    for (const port of SEC_OUT) {
      if (!links.has(`${buffer.id}:${port}`)) continue;
      const found = trace(buffer.id, port, (nodeId, portId) => nodeId === buffer.id && portId.startsWith('sec-in'));
      for (const path of found) {
        if (path.consumers.length) secondaryPaths.push(path);
        else add('warn', 'short');
      }
    }
  }

  const secondaryAttached = buffer
    ? [...SEC_OUT, 'sec-in-1', 'sec-in-2'].some((port) => links.has(`${buffer.id}:${port}`))
    : false;
  if (buffer) {
    if (!primaryPaths.length) add('warn', 'open-primary');
    if (secondaryAttached && !secondaryPaths.length) add('warn', 'open-secondary');
  } else if (!directPaths.length) {
    add('warn', 'open-circuit');
  }

  // A buffer primary loop no longer suppresses direct consumer loops: both may
  // run in parallel (e.g. a buffer branch beside a floor-heating branch on a
  // shared supply/return header). Relief bypasses ride with direct loops.
  const activePrimary = buffer && primaryPaths.length ? primaryPaths : [];
  const activeDirect = directPaths;
  const reliefPaths = fromHp.filter((path) => path.relief && path.consumers.length === 0 && path.buffers.length === 0);
  const directBundle = [...activeDirect, ...(!buffer || activeDirect.length ? reliefPaths : [])];
  const internalLph = internalFlow(hp, openings);
  for (const code of assignFlows(activePrimary, internalLph, 'no-flow')) add('warn', code);
  for (const code of assignFlows(directBundle, internalLph, 'no-flow')) add('warn', code);
  for (const code of assignFlows(secondaryPaths, 0, 'need-secondary-pump')) add('warn', code);

  // Parallel primary + direct loops share one circulator. When no dedicated
  // pump drives either loop, both were assigned the full internal flow;
  // rescale to the circulator capacity so branches share it equally.
  // Dedicated-pump loops keep their assigned flows (existing semantics).
  if (activePrimary.length > 0 && directBundle.length > 0 && internalLph > 0
    && [...activePrimary, ...directBundle].every((path) => path.pumps.length === 0)) {
    const total = activePrimary.reduce((sum, path) => sum + path.flowLph, 0)
      + directBundle.reduce((sum, path) => sum + path.flowLph, 0);
    if (total > 0) {
      const k = internalLph / total;
      for (const path of [...activePrimary, ...directBundle]) path.flowLph *= k;
    }
  }

  const primaryFlow = activePrimary.reduce((sum, path) => sum + path.flowLph, 0);
  const directFlow = directBundle.reduce((sum, path) => sum + path.flowLph, 0);
  let secondaryFlow = secondaryPaths.reduce((sum, path) => sum + path.flowLph, 0);
  const sourcePaths = [...activePrimary, ...directBundle];
  const sourceFlow = primaryFlow + directFlow;

  const served = new Set<string>();
  // Consumers riding the primary loop (only possible since the left side was
  // opened) are served like any other consumer.
  const primaryConsumers = activePrimary.filter((path) => path.consumers.length > 0);
  const consumerPaths = [...(activePrimary.length ? secondaryPaths : []), ...activeDirect, ...primaryConsumers];
  for (const path of consumerPaths) {
    if (path.gain <= 1e-6) continue;
    for (const id of path.consumers) served.add(id);
  }
  let demandKw = 0;
  for (const id of served) demandKw += nodeById.get(id)?.params.demand ?? 0;

  const dEdges = mergeEdges([...sourcePaths, ...(activePrimary.length ? secondaryPaths : [])]);
  applyInjection(dEdges);
  if (buffer) {
    // A direct mixer tap leaves the buffer through a cold inlet; no existing
    // topology does that, so counting it only affects the tap case.
    const leaving = dEdges
      .filter((edge) => edge.fromNode === buffer.id && (edge.fromPort.startsWith('sec-out') || edge.fromPort.startsWith('sec-in')))
      .reduce((sum, edge) => sum + edge.flowLph, 0);
    if (leaving > 1 && leaving + 1 < secondaryFlow) secondaryFlow = leaving;
  }
  const qCap = hp.params.capacity ?? 12;
  const tSetFull = hp.params.setpoint ?? 45;
  // Warm-up cap: while the heat pump is still heating up, the whole solve
  // (supply target, buffer clamp, consumer extraction curve) uses the live
  // deliverable temperature instead of the configured setpoint. The panel
  // readings and the pipe water colors therefore share one underlying value.
  const tSet = options.hpSupplyC == null
    ? tSetFull
    : Math.min(tSetFull, Math.max(options.hpSupplyC, T_ROOM));
  const mSource = lphToKgs(sourceFlow);

  const nodeSims: Record<string, NodeSim> = {};
  let tSup = tSet;
  let tRet = tSet;
  let tTank: number | null = null;
  let qHp = 0;
  let prop = emptyProp();

  // Direct consumer loops beside a buffer primary loop share the supply and
  // their returns join the heat-pump return; consumers riding the primary
  // loop itself are served the same way. The heat-pump return is the mixed
  // return in those cases, not the tank temperature.
  const parallelDirect = Boolean(buffer && activePrimary.length && activeDirect.length);
  const primaryUsers = activePrimary.some((path) => path.consumers.length > 0);
  const mixedReturn = parallelDirect || primaryUsers;
  const primaryIdle = Boolean(buffer && activePrimary.length && secondaryFlow <= 1 && sourceFlow > 1 && !parallelDirect);
  if (sourceFlow > 1 && (activeDirect.length || (activePrimary.length && (secondaryFlow > 1 || primaryIdle || parallelDirect || primaryUsers)))) {
    if (buffer && activePrimary.length && (secondaryFlow > 1 || parallelDirect || primaryUsers)) {
      const solved = solveBuffer();
      tTank = solved.tTank;
      tSup = solved.tSup;
      tRet = mixedReturn ? (solved.prop.hpReturn ?? solved.tTank) : solved.tTank;
      qHp = solved.qHp;
      prop = solved.prop;
    } else if (primaryIdle && buffer) {
      const solved = solvePrimaryIdle(options.tankC ?? T_ROOM);
      tTank = solved.tTank;
      tSup = solved.tSup;
      tRet = solved.tRet;
      qHp = solved.qHp;
      prop = solved.prop;
    } else if (activeDirect.length) {
      const solved = solveDirect();
      tSup = solved.tSup;
      tRet = solved.tRet;
      qHp = solved.qHp;
      prop = solved.prop;
    }
  }
  if (openings[hp.id] !== undefined && openings[hp.id] < 0.5) {
    qHp = 0;
    const coast = buffer && tTank != null ? tTank : tRet;
    tSup = coast;
    tRet = coast;
    if (sourceFlow > 1) prop = propagate(coast, buffer ? coast : null, 'nominal');
  }
  // The buffer hydraulically separates the two loops: the secondary (user)
  // side has its own pump and must keep circulating tank water even when the
  // primary (source) side is blocked. Without this, a closed primary valve or
  // a stopped primary pump leaves sourceFlow at 0, so no propagation runs and
  // the healthy secondary loop wrongly shows no flow or temperature.
  if (buffer && activePrimary.length && secondaryFlow > 1 && primaryFlow <= 1) {
    const tank = clamp(options.tankC ?? T_ROOM, T_ROOM, tSet);
    tTank = tank;
    tSup = tank;
    tRet = tank;
    qHp = 0;
    prop = propagate(tank, tank, 'nominal');
  }

  const delivered = prop.qOut;
  const limited = qCap + 0.2 < demandKw && delivered >= qCap - 0.25 && delivered + 0.3 < demandKw;
  const flowLimited = !limited && demandKw > 0.4 && delivered + 0.45 < demandKw && sourceFlow > 1;
  if (limited) add('warn', 'capacity-limited');
  if (flowLimited) add('info', 'flow-limited');

  Object.assign(nodeSims, prop.consumer, prop.pass);
  nodeSims[hp.id] = {
    tIn: sourceFlow > 1 ? tRet : 0,
    tOut: sourceFlow > 1 ? tSup : 0,
    flowLph: sourceFlow,
    qKw: sourceFlow > 1 ? qHp : 0,
    dt: sourceFlow > 1 ? tSup - tRet : 0,
  };
  if (buffer && tTank != null) {
    const priIn = prop.inlets[buffer.id]?.find((inlet) => inlet.port === 'pri-in');
    const litres = buffer.params.volume ?? 200;
    nodeSims[buffer.id] = {
      tIn: priIn?.t ?? tSup,
      tOut: tTank,
      flowLph: primaryFlow,
      qKw: qHp,
      dt: tSup - tTank,
      tankC: tTank,
      storedKwh: litres * WATER_RHO * WATER_CP * Math.max(tTank - T_ROOM, 0) / 3600,
    };
  }

  // Tank sondes publish their measurement for the inspector and the canvas
  // label. A sonde with no sense link, or whose tank has no solved state,
  // gets no entry, which the UI reads as disconnected.
  for (const node of nodes) {
    if (node.componentId !== 'tank-sonde') continue;
    const tankId = sondeTankOf(node, edges);
    if (!tankId) continue;
    const measured = simTankC(nodeSims, nodes, tankId);
    if (measured == null || !Number.isFinite(measured)) continue;
    const command = sondeCommand(node, edges, (id) => simTankC(nodeSims, nodes, id)) ?? 0;
    nodeSims[node.id] = { tIn: measured, tOut: measured, flowLph: 0, qKw: 0, dt: 0, opening: command };
  }

  const edgeSims: Record<string, EdgeSim> = {};
  for (const edge of dEdges) {
    if (!Number.isFinite(edge.temp)) continue;
    const visualEnd = visualTarget(edge, nodeSims);
    const rf = edgeById.get(edge.edgeId);
    if (!rf) continue;
    const forward = rf.source === edge.fromNode && rf.sourceHandle === edge.fromPort;
    edgeSims[edge.edgeId] = {
      flowLph: edge.flowLph,
      tSource: forward ? edge.temp : visualEnd,
      tTarget: forward ? visualEnd : edge.temp,
      flowFromSource: forward,
    };
  }

  const usersRunning = served.size > 0 && Object.keys(prop.consumer).length > 0
    && (buffer
      ? (secondaryFlow > 1 && primaryPaths.length > 0) || parallelDirect || primaryUsers
      : directPaths.length > 0);
  // Secondary-only circulation (primary blocked, secondary flowing) is a valid
  // running state even though the heat-pump source flow is 0.
  const secondaryOnly = Boolean(buffer && secondaryFlow > 1 && primaryFlow <= 1 && Object.keys(prop.consumer).length > 0);
  const ok = (sourceFlow > 1 && (usersRunning || primaryIdle)) || secondaryOnly;

  for (const node of nodes) {
    const commanded = node.componentId === 'pump' || isHeatPumpId(node.componentId) ? openings[node.id] : undefined;
    const isValve = node.componentId === 'valve' || node.componentId === 'valve-3way' || node.componentId === 'relief' || node.componentId === 'mixer';
    if (commanded === undefined && !isValve) continue;
    const position = commanded ?? openingOf(node.id);
    const prior = nodeSims[node.id];
    nodeSims[node.id] = prior
      ? { ...prior, opening: position }
      : { tIn: 0, tOut: 0, flowLph: 0, qKw: 0, dt: 0, opening: position };
  }

  return {
    ok,
    mode: buffer && primaryPaths.length ? 'buffered' : activeDirect.length ? 'direct' : 'incomplete',
    issues,
    edges: edgeSims,
    nodes: nodeSims,
    supplyC: sourceFlow > 1 || secondaryOnly ? tSup : null,
    returnC: sourceFlow > 1 || secondaryOnly ? tRet : null,
    dtC: sourceFlow > 1 || secondaryOnly ? tSup - tRet : null,
    primaryFlowLph: buffer ? primaryFlow : directFlow,
    secondaryFlowLph: secondaryFlow,
    deliveredKw: delivered,
    demandKw,
    limited,
    tankC: tTank,
    primaryIdle,
  };

  /**
   * Classic mixing loop: the mixer feeds a pump and a heat user, and that
   * user's return splits. One branch comes back to the cold inlet; the other
   * returns to the buffer (or the heat pump). The pump drives the whole loop.
   * Hot share s draws s·Q from the source and recirculates (1-s)·Q.
   *
   * The same loop also works when the cold inlet is tapped straight from a
   * buffer cold inlet instead of the recirculated return: the hot header
   * supplies s·Q, the tap supplies (1-s)·Q of tank water, and the full loop
   * flow Q returns to the buffer. Without this, that valid tap edge is never
   * traversed and shows no flow. See directBufferTap.
   */
  function applyInjection(edges: DEdge[]) {
    for (const node of nodes) {
      if (node.componentId !== 'mixer') continue;
      const share = openingOf(node.id);
      const cycles = trace(node.id, 'out', (id, port) => id === node.id && port === 'c')
        .filter((path) => path.consumers.length > 0 && path.pipes.length > 1);
      for (const cycle of cycles) {
        const loop = describeInjection(node.id, cycle);
        if (!loop) continue;
        const injectFlow = loop.pumpFlow * share;
        const recircFlow = loop.pumpFlow * (1 - share);
        setLoopFlow(edges, loop.injectEdges, injectFlow);
        setLoopFlow(edges, loop.returnEdges, injectFlow);
        setLoopFlow(edges, loop.fullEdges, loop.pumpFlow);
        setLoopFlow(edges, loop.recircEdges, recircFlow);
        break;
      }
      const tapLoop = directBufferTap(node.id);
      if (!tapLoop) continue;
      setLoopFlow(edges, tapLoop.inject, tapLoop.pumpFlow * share);
      setLoopFlow(edges, [tapLoop.tap], tapLoop.pumpFlow * (1 - share));
      setLoopFlow(edges, tapLoop.loop, tapLoop.pumpFlow);
    }
  }

  /**
   * Mixer cold inlet tapped directly from a buffer cold inlet. The tap edge
   * can never be traversed by the source/secondary traces (a trace may arrive
   * at a buffer port but only leaves it via pri-in → pri-out), so without
   * this the connection validates yet carries no flow. Returns null for any
   * ambiguous feed (e.g. a second route into the cold inlet), leaving the
   * existing behavior untouched.
   */
  function directBufferTap(mixerId: string): {
    inject: Pipe[];
    tap: Pipe;
    loop: Pipe[];
    pumpFlow: number;
  } | null {
    if (!buffer) return null;
    let tap: Pipe | null = null;
    for (const port of ['sec-in-1', 'sec-in-2']) {
      const peer = links.get(`${buffer.id}:${port}`);
      if (peer && peer.nodeId === mixerId && peer.portId === 'c') {
        tap = { edgeId: peer.edgeId, fromNode: buffer.id, fromPort: port, toNode: mixerId, toPort: 'c' };
        break;
      }
    }
    if (!tap) return null;
    let inject: TracedPath | undefined;
    for (const port of SEC_OUT) {
      if (!links.has(`${buffer.id}:${port}`)) continue;
      inject = trace(buffer.id, port, (id, portId) => id === mixerId && portId === 'h')
        .find((path) => !path.pipes.some((pipe) => pipe.fromNode === mixerId && pipe.fromPort === 'out'));
      if (inject) break;
    }
    if (!inject) return null;
    const loop = trace(mixerId, 'out', (id, portId) => id === buffer.id && portId.startsWith('sec-in'))
      .filter((path) => path.consumers.length > 0 && path.pipes.length > 0)
      .find((path) => {
        if (path.pumps.length === 0 || path.pumps.some((pump) => pump.reversed)) return false;
        return Math.min(...path.pumps.map((pump) => pumpLph(nodeById.get(pump.nodeId), openings))) > 1;
      });
    if (!loop) return null;
    const sources: { node: string; port: string }[] = [{ node: hpId, port: 'supply-out' }];
    for (const port of SEC_OUT) {
      if (links.has(`${buffer.id}:${port}`)) sources.push({ node: buffer.id, port });
    }
    for (const source of sources) {
      if (trace(source.node, source.port, (id, portId) => id === mixerId && portId === 'c').length > 0) return null;
    }
    const pumpFlow = Math.min(...loop.pumps.map((pump) => pumpLph(nodeById.get(pump.nodeId), openings)));
    return { inject: inject.pipes, tap, loop: loop.pipes, pumpFlow };
  }

  function describeInjection(mixerId: string, cycle: TracedPath): {
    pumpFlow: number;
    fullEdges: Pipe[];
    recircEdges: Pipe[];
    injectEdges: Pipe[];
    returnEdges: Pipe[];
  } | null {
    const pipes = cycle.pipes;
    let splitAt = -1;
    let returnPath: TracedPath | null = null;
    for (let i = 0; i < pipes.length - 1; i += 1) {
      const nodeId = pipes[i].toNode;
      const def = defOf(nodeId);
      if (!def) continue;
      const fitting = def.id === 'tee' || def.id === 'junction' || def.id === 'manifold-supply' || def.id === 'manifold-return';
      if (!fitting || pipes[i + 1].fromNode !== nodeId) continue;
      const entry = pipes[i].toPort;
      const exit = pipes[i + 1].fromPort;
      const ports = resolvePorts(def, nodeById.get(nodeId)?.params).map((port) => port.id);
      for (const port of ports) {
        if (port === entry || port === exit || !links.has(`${nodeId}:${port}`)) continue;
        const side = trace(nodeId, port, (id, portId) =>
          (buffer != null && id === buffer.id && portId.startsWith('sec-in'))
          || (id === hpId && portId === 'return-in'),
        ).find((path) =>
          path.pipes.length > 0
          && !path.consumers.some((id) => cycle.consumers.includes(id))
          && !path.pipes.some((pipe) => pipe.fromNode === mixerId || pipe.toNode === mixerId));
        if (side) {
          splitAt = i;
          returnPath = side;
          break;
        }
      }
      if (splitAt >= 0) break;
    }
    if (splitAt < 0 || !returnPath) return null;

    const dest = returnPath.pipes[returnPath.pipes.length - 1];
    const sourceIsBuffer = Boolean(buffer && dest.toNode === buffer.id && dest.toPort.startsWith('sec-in'));
    const sourceIsHp = dest.toNode === hpId && dest.toPort === 'return-in';
    if (!sourceIsBuffer && !sourceIsHp) return null;

    let inject: TracedPath | undefined;
    if (sourceIsBuffer && buffer) {
      for (const port of SEC_OUT) {
        if (!links.has(`${buffer.id}:${port}`)) continue;
        inject = trace(buffer.id, port, (id, portId) => id === mixerId && portId === 'h')
          .find((path) => !path.pipes.some((pipe) => pipe.fromNode === mixerId && pipe.fromPort === 'out'));
        if (inject) break;
      }
    } else {
      inject = trace(hpId, 'supply-out', (id, portId) => id === mixerId && portId === 'h')
        .find((path) => !path.pipes.some((pipe) => pipe.fromNode === mixerId && pipe.fromPort === 'out'));
    }
    if (!inject) return null;

    const outEdge = pipes[0]?.edgeId;
    const sources: { node: string; port: string }[] = [{ node: hpId, port: 'supply-out' }];
    if (buffer) {
      for (const port of SEC_OUT) {
        if (links.has(`${buffer.id}:${port}`)) sources.push({ node: buffer.id, port });
      }
    }
    for (const source of sources) {
      const leak = trace(source.node, source.port, (id, portId) => id === mixerId && portId === 'c')
        .some((path) => !path.pipes.some((pipe) => pipe.edgeId === outEdge));
      if (leak) return null;
    }

    const fullEdges = pipes.slice(0, splitAt + 1);
    const fullNodes = new Set(fullEdges.map((pipe) => pipe.toNode));
    const pumpIds = cycle.pumps
      .filter((pump) => !pump.reversed && fullNodes.has(pump.nodeId))
      .map((pump) => pump.nodeId);
    if (!pumpIds.length) return null;
    const pumpFlow = Math.min(...pumpIds.map((id) => pumpLph(nodeById.get(id), openings)));
    if (pumpFlow <= 1) return null;

    return {
      pumpFlow,
      fullEdges,
      recircEdges: pipes.slice(splitAt + 1),
      injectEdges: inject.pipes,
      returnEdges: returnPath.pipes,
    };
  }

  function setLoopFlow(edges: DEdge[], pipes: Pipe[], flow: number) {
    for (const pipe of pipes) {
      const existing = edges.find((edge) => edge.edgeId === pipe.edgeId);
      if (flow <= 1) {
        if (existing) existing.flowLph = 0;
        continue;
      }
      if (existing) {
        existing.flowLph = flow;
        existing.fromNode = pipe.fromNode;
        existing.fromPort = pipe.fromPort;
        existing.toNode = pipe.toNode;
        existing.toPort = pipe.toPort;
      } else {
        edges.push({ ...pipe, flowLph: flow, temp: Number.NaN });
      }
    }
  }

  function solvePrimaryIdle(tankC: number): { tTank: number; tSup: number; tRet: number; qHp: number; prop: PropResult } {
    const tank = clamp(tankC, T_ROOM, tSet);
    const heat = Math.min(qCap, mSource * WATER_CP * Math.max(tSet - tank, 0));
    const supply = mSource > 1e-6 ? tank + heat / (mSource * WATER_CP) : tank;
    return { tTank: tank, tSup: supply, tRet: tank, qHp: heat, prop: propagate(supply, tank, 'nominal') };
  }

  function solveDirect(): { tSup: number; tRet: number; qHp: number; prop: PropResult } {
    const nominal = propagate(tSet, null, 'nominal');
    if (nominal.qOut <= qCap + 0.08 && nominal.hpReturn != null) {
      return { tSup: tSet, tRet: nominal.hpReturn, qHp: nominal.qOut, prop: nominal };
    }
    let lo = T_ROOM + 1;
    let hi = tSet;
    let best = propagate(tSet, null, 'ratio');
    for (let i = 0; i < 28; i++) {
      const mid = (lo + hi) / 2;
      const sample = propagate(mid, null, 'ratio');
      best = sample;
      const tReturn = sample.hpReturn ?? mid;
      const lift = mSource * WATER_CP * Math.max(tSet - tReturn, 0);
      const heat = Math.min(qCap, lift);
      const ideal = mSource > 1e-6 ? tReturn + heat / (mSource * WATER_CP) : tSet;
      if (mid > ideal) hi = mid;
      else lo = mid;
    }
    const tReturn = best.hpReturn ?? lo;
    const heat = Math.min(qCap, mSource * WATER_CP * Math.max(tSet - tReturn, 0));
    const supply = mSource > 1e-6 ? tReturn + heat / (mSource * WATER_CP) : tSet;
    const propFinal = propagate(supply, null, 'ratio');
    return { tSup: supply, tRet: propFinal.hpReturn ?? tReturn, qHp: heat, prop: propFinal };
  }

  function solveBuffer(): { tTank: number; tSup: number; qHp: number; prop: PropResult } {
    const mP = lphToKgs(primaryFlow);
    let tank = tSet - Math.min(demandKw, qCap) / Math.max(mP * WATER_CP, 0.2);
    tank = clamp(tank, T_ROOM + 2, tSet);
    let settled: PropResult | null = null;
    for (let i = 0; i < 10; i++) {
      const supply = tank + Math.min(qCap, mP * WATER_CP * Math.max(tSet - tank, 0)) / Math.max(mP * WATER_CP, 1e-6);
      const sample = propagate(Math.min(supply, tSet), tank, 'nominal');
      if (sample.qOut <= qCap + 0.08) {
        const next = clamp(tSet - sample.qOut / Math.max(mP * WATER_CP, 1e-6), T_ROOM + 1, tSet);
        settled = sample;
        if (Math.abs(next - tank) < 0.05) {
          tank = next;
          break;
        }
        tank = next;
        settled = null;
      } else {
        settled = null;
        break;
      }
    }
    if (settled && settled.qOut <= qCap + 0.08) {
      const heat = settled.qOut;
      const supply = Math.min(tSet, tank + heat / Math.max(mP * WATER_CP, 1e-6));
      const propFinal = propagate(supply, tank, 'nominal');
      return { tTank: tank, tSup: supply, qHp: heat, prop: propFinal };
    }

    let lo = T_ROOM + 1;
    let hi = tSet;
    let bestTank = (lo + hi) / 2;
    for (let i = 0; i < 28; i++) {
      const mid = (lo + hi) / 2;
      const qHpMid = Math.min(qCap, mP * WATER_CP * Math.max(tSet - mid, 0));
      const supply = mP > 1e-6 ? mid + qHpMid / (mP * WATER_CP) : mid;
      const sample = propagate(supply, mid, 'ratio');
      if (qHpMid > sample.qOut) lo = mid;
      else hi = mid;
      bestTank = mid;
    }
    const heat = Math.min(qCap, mP * WATER_CP * Math.max(tSet - bestTank, 0));
    const supply = mP > 1e-6 ? bestTank + heat / (mP * WATER_CP) : bestTank;
    return { tTank: bestTank, tSup: supply, qHp: heat, prop: propagate(supply, bestTank, 'ratio') };
  }

  function propagate(tSup: number, tTankValue: number | null, mode: ExtractMode): PropResult {
    const prop: PropResult = { edgeTemp: {}, consumer: {}, pass: {}, inlets: {}, hpReturn: null, qOut: 0 };
    for (const edge of dEdges) edge.temp = Number.NaN;

    const mix = (incoming: DEdge[]) => {
      let mass = 0;
      let heat = 0;
      let flow = 0;
      for (const edge of incoming) {
        const m = lphToKgs(edge.flowLph);
        mass += m;
        heat += m * edge.temp;
        flow += edge.flowLph;
      }
      return { t: mass > 0 ? heat / mass : incoming[0]?.temp ?? tSup, flow };
    };

    const writePort = (nodeId: string, portId: string, temp: number): boolean => {
      let changed = false;
      for (const edge of dEdges) {
        if (edge.fromNode !== nodeId || edge.fromPort !== portId) continue;
        if (!Number.isFinite(edge.temp) || Math.abs(edge.temp - temp) > 0.02) {
          edge.temp = temp;
          changed = true;
        }
      }
      return changed;
    };

    if (Number.isFinite(tSup)) writePort(hpId, 'supply-out', tSup);
    if (buffer && tTankValue != null) {
      for (const port of ['pri-out', ...SEC_OUT]) writePort(buffer.id, port, tTankValue);
      // A mixer cold inlet tapped straight from a buffer cold inlet draws
      // tank water. No existing topology leaves the buffer through a cold
      // inlet, so this is a no-op unless directBufferTap assigned such flow.
      for (const edge of dEdges) {
        if (edge.fromNode === buffer.id && edge.fromPort.startsWith('sec-in')) {
          writePort(buffer.id, edge.fromPort, tTankValue);
        }
      }
    }

    // A fitting can feed the mixer and also receive the mixer's downstream return.
    // An injection loop is the same kind of cycle: the cold inlet is the
    // radiator return, which depends on the mixed outlet. Temperatures are
    // relaxed, with the mixer outlet damped, until that fixed point settles.
    const mixerHold = new Map<string, number>();
    for (let pass = 0; pass < 48; pass += 1) {
      let changed = false;
      prop.qOut = 0;
      prop.consumer = {};
      prop.pass = {};
      prop.inlets = {};
      prop.hpReturn = null;
      for (const node of nodes) {
        const def = getComponent(node.componentId);
        if (!def) continue;
        const incoming = dEdges.filter((edge) => edge.toNode === node.id && Number.isFinite(edge.temp));
        if (!incoming.length) continue;
        prop.inlets[node.id] = incoming.map((edge) => ({ port: edge.toPort, t: edge.temp, flowLph: edge.flowLph }));
        if (isHeatPumpId(def.id)) {
          prop.hpReturn = mix(incoming).t;
          continue;
        }
        if (isBufferId(def.id)) continue;
        if (def.category === 'consumer') {
          const inlet = incoming.filter((edge) => edge.toPort === 'supply-in');
          if (!inlet.length) continue;
          const mixed = mix(inlet);
          const heat = extractHeat(node.params.demand ?? 0, mixed.t, mixed.flow, mode, tSet);
          prop.qOut += heat.q;
          prop.consumer[node.id] = {
            tIn: mixed.t, tOut: heat.tOut, flowLph: mixed.flow, qKw: heat.q, dt: heat.dt,
          };
          if (writePort(node.id, 'return-out', heat.tOut)) changed = true;
          continue;
        }
        const mixed = mix(incoming);
        let leaving = mixed.t;
        if (def.id === 'mixer') {
          const prev = mixerHold.get(node.id);
          if (prev !== undefined && Number.isFinite(prev)) leaving = prev + 0.6 * (mixed.t - prev);
          mixerHold.set(node.id, leaving);
        }
        prop.pass[node.id] = {
          tIn: def.id === 'mixer' ? leaving : mixed.t,
          tOut: def.id === 'mixer' ? leaving : mixed.t,
          flowLph: mixed.flow,
          qKw: 0,
          dt: 0,
        };
        const ports = new Set(dEdges.filter((edge) => edge.fromNode === node.id).map((edge) => edge.fromPort));
        for (const port of ports) {
          if (writePort(node.id, port, leaving)) changed = true;
        }
        if (def.id === 'mixer' && Math.abs(mixed.t - leaving) > 0.04) changed = true;
      }
      if (!changed) break;
    }

    for (const edge of dEdges) {
      if (Number.isFinite(edge.temp)) prop.edgeTemp[edge.edgeId] = edge.temp;
    }
    return prop;
  }

  function visualTarget(edge: DEdge, sims: Record<string, NodeSim>): number {
    const target = sims[edge.toNode];
    const def = defOf(edge.toNode);
    if (!target || !def) return edge.temp;
    // The inlet pipe keeps the supply temperature: demand cools only the water
    // leaving the user (return-out already carries tOut). Cooling the inlet
    // edge here made higher demand wrongly turn the inlet bluer.
    if (def.category === 'consumer') return edge.temp;
    if (isBufferId(def.id) && edge.toPort === 'pri-in' && target.tankC != null) {
      return edge.temp + (target.tankC - edge.temp) * 0.55;
    }
    if (isBufferId(def.id) && edge.toPort.startsWith('sec-in') && target.tankC != null) {
      return edge.temp + (target.tankC - edge.temp) * 0.3;
    }
    return edge.temp;
  }
}

function internalFlow(hp: GraphNode, gates: Record<string, number> = {}): number {
  if (gates[hp.id] !== undefined && gates[hp.id] < 0.5) return 0;
  if ((hp.params.internalPump ?? 1) < 0.5) return 0;
  return INTERNAL_NOMINAL_LPH * clamp(hp.params.internalSpeed ?? 100, 0, 100) / 100;
}

function mergeEdges(paths: TracedPath[]): DEdge[] {
  const merged = new Map<string, DEdge>();
  for (const path of paths) {
    if (path.flowLph <= 0) continue;
    for (const pipe of path.pipes) {
      const prev = merged.get(pipe.edgeId);
      if (!prev) {
        merged.set(pipe.edgeId, { ...pipe, flowLph: path.flowLph, temp: Number.NaN });
      } else if (prev.fromNode === pipe.fromNode && prev.fromPort === pipe.fromPort) {
        prev.flowLph += path.flowLph;
      }
    }
  }
  return [...merged.values()];
}

function emptyProp(): PropResult {
  return { edgeTemp: {}, consumer: {}, pass: {}, inlets: {}, hpReturn: null, qOut: 0 };
}
