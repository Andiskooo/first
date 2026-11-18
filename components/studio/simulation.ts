import { getComponent } from '@/components/studio/registry';
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

function pumpLph(node: GraphNode | undefined): number {
  if (!node) return 0;
  return PUMP_NOMINAL_LPH * clamp(node.params.speed ?? 0, 0, 100) / 100;
}

export function simulate(nodes: GraphNode[], edges: GraphEdge[]): SimResult {
  const result = emptyResult();
  const issues: SimIssue[] = [];
  const add = (level: SimIssue['level'], code: string) => {
    if (!issues.some((issue) => issue.code === code)) issues.push({ level, code });
  };

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
  const hp = nodes.find((node) => node.componentId === 'heat-pump');
  const buffer = nodes.find((node) => node.componentId === 'buffer-tank');

  if (nodes.filter((node) => node.componentId === 'heat-pump').length > 1) add('info', 'one-heat-pump');
  if (nodes.filter((node) => node.componentId === 'buffer-tank').length > 1) add('info', 'one-buffer');
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

  function internalLeaves(nodeId: string, enterPort: string): string[] {
    const def = defOf(nodeId);
    if (!def) return [];
    if (def.id === 'heat-pump') return [];
    if (def.id === 'buffer-tank') return enterPort === 'pri-in' ? ['pri-out'] : [];
    if (def.category === 'consumer') return enterPort === 'supply-in' ? ['return-out'] : [];
    if (def.id === 'pump') return def.ports.map((port) => port.id).filter((id) => id !== enterPort);
    if (def.id === 'tee') {
      return def.ports
        .map((port) => port.id)
        .filter((id) => id !== enterPort && links.has(`${nodeId}:${id}`));
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
    }];

    while (stack.length && results.length < 8) {
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
        });
        continue;
      }
      if (frame.usedNodes.has(link.nodeId) || pipes.length > 18) continue;
      const def = defOf(link.nodeId);
      if (!def) continue;
      const pumps = frame.pumps.slice();
      const consumers = frame.consumers.slice();
      const buffers = frame.buffers.slice();
      if (def.id === 'pump') pumps.push({ nodeId: link.nodeId, reversed: link.portId === 'out' });
      else if (def.category === 'consumer') consumers.push(link.nodeId);
      else if (def.id === 'buffer-tank') {
        buffers.push({ nodeId: link.nodeId, via: link.portId.startsWith('pri') ? 'primary' : 'secondary' });
      }
      const usedNodes = new Set(frame.usedNodes);
      usedNodes.add(link.nodeId);
      for (const leave of internalLeaves(link.nodeId, link.portId)) {
        stack.push({
          nodeId: link.nodeId,
          portId: leave,
          pipes,
          pumps: pumps.slice(),
          consumers: consumers.slice(),
          buffers: buffers.slice(),
          usedEdges: new Set(usedEdges),
          usedNodes: new Set(usedNodes),
        });
      }
    }
    return results;
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
      return { reversed, lph: pumpLph(nodeById.get(id)) };
    };

    const trunk = [...pumpIds].filter((id) => paths.every((path) => path.pumps.some((pump) => pump.nodeId === id)));
    if (trunk.length) {
      const pumps = trunk.map(meta);
      if (pumps.some((pump) => pump.reversed)) {
        codes.push('reversed-pump');
        return codes;
      }
      const total = Math.min(...pumps.map((pump) => pump.lph));
      const share = total / n;
      for (const path of paths) path.flowLph = share;
      if (total <= 0) codes.push(emptyCode);
      return codes;
    }

    if (pumpIds.size === 0) {
      if (fallbackLph <= 0) codes.push(emptyCode);
      const share = fallbackLph / n;
      for (const path of paths) path.flowLph = share;
      return codes;
    }

    const flows = paths.map((path) => {
      if (!path.pumps.length) return 0;
      if (path.pumps.some((pump) => pump.reversed)) {
        codes.push('reversed-pump');
        return 0;
      }
      return Math.min(...path.pumps.map((pump) => pumpLph(nodeById.get(pump.nodeId))));
    });
    for (let iter = 0; iter < 6; iter++) {
      for (const id of pumpIds) {
        const idxs = paths
          .map((path, index) => (path.pumps.some((pump) => pump.nodeId === id) ? index : -1))
          .filter((index) => index >= 0);
        const sum = idxs.reduce((total, index) => total + flows[index], 0);
        const limit = pumpLph(nodeById.get(id));
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
    if (!path.consumers.length && !path.buffers.length) add('warn', 'short');
  }

  const primaryPaths = buffer
    ? fromHp.filter((path) => path.buffers.some((item) => item.nodeId === buffer.id && item.via === 'primary'))
    : [];
  const directPaths = fromHp.filter((path) => path.consumers.length > 0 && path.buffers.length === 0);
  const useDirect = !buffer || primaryPaths.length === 0;
  if (buffer && primaryPaths.length && directPaths.length) add('warn', 'bypass');

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

  if (buffer) {
    if (!primaryPaths.length) add('warn', 'open-primary');
    if (!secondaryPaths.length) add('warn', 'open-secondary');
  } else if (!directPaths.length) {
    add('warn', 'open-circuit');
  }

  const activePrimary = buffer && primaryPaths.length ? primaryPaths : [];
  const activeDirect = useDirect ? directPaths : [];
  const internalLph = internalFlow(hp);
  for (const code of assignFlows(activePrimary, internalLph, 'no-flow')) add('warn', code);
  for (const code of assignFlows(activeDirect, internalLph, 'no-flow')) add('warn', code);
  for (const code of assignFlows(secondaryPaths, 0, 'need-secondary-pump')) add('warn', code);

  const primaryFlow = activePrimary.reduce((sum, path) => sum + path.flowLph, 0);
  const directFlow = activeDirect.reduce((sum, path) => sum + path.flowLph, 0);
  const secondaryFlow = secondaryPaths.reduce((sum, path) => sum + path.flowLph, 0);
  const sourcePaths = activePrimary.length ? activePrimary : activeDirect;
  const sourceFlow = activePrimary.length ? primaryFlow : directFlow;

  const served = new Set<string>();
  const consumerPaths = activePrimary.length ? secondaryPaths : activeDirect;
  for (const path of consumerPaths) for (const id of path.consumers) served.add(id);
  let demandKw = 0;
  for (const id of served) demandKw += nodeById.get(id)?.params.demand ?? 0;

  const dEdges = mergeEdges([...sourcePaths, ...(activePrimary.length ? secondaryPaths : [])]);
  const qCap = hp.params.capacity ?? 12;
  const tSet = hp.params.setpoint ?? 45;
  const mSource = lphToKgs(sourceFlow);

  const nodeSims: Record<string, NodeSim> = {};
  let tSup = tSet;
  let tRet = tSet;
  let tTank: number | null = null;
  let qHp = 0;
  let prop = emptyProp();

  if (sourceFlow > 1 && (activeDirect.length || (activePrimary.length && secondaryFlow > 1))) {
    if (buffer && activePrimary.length) {
      const solved = solveBuffer();
      tTank = solved.tTank;
      tSup = solved.tSup;
      tRet = solved.tTank;
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

  const delivered = prop.qOut;
  const limited = qCap + 0.2 < demandKw && delivered >= qCap - 0.25 && delivered + 0.3 < demandKw;
  const flowLimited = !limited && demandKw > 0.4 && delivered + 0.45 < demandKw && sourceFlow > 1;
  if (limited) add('warn', 'capacity-limited');
  if (flowLimited) add('info', 'flow-limited');

  Object.assign(nodeSims, prop.consumer, prop.pass);
  nodeSims[hp.id] = {
    tIn: tRet,
    tOut: tSup,
    flowLph: sourceFlow,
    qKw: qHp,
    dt: tSup - tRet,
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

  const ok = served.size > 0 && delivered >= 0 && sourceFlow > 1 && Object.keys(prop.consumer).length > 0
    && (buffer ? secondaryFlow > 1 && primaryPaths.length > 0 : directPaths.length > 0);

  return {
    ok,
    mode: buffer && primaryPaths.length ? 'buffered' : activeDirect.length ? 'direct' : 'incomplete',
    issues,
    edges: edgeSims,
    nodes: nodeSims,
    supplyC: sourceFlow > 1 ? tSup : null,
    returnC: sourceFlow > 1 ? tRet : null,
    dtC: sourceFlow > 1 ? tSup - tRet : null,
    primaryFlowLph: buffer ? primaryFlow : directFlow,
    secondaryFlowLph: secondaryFlow,
    deliveredKw: delivered,
    demandKw,
    limited,
    tankC: tTank,
  };

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
    const temps = new Map<string, number>();
    const sent = new Set<string>();
    const expected: Record<string, number> = {};
    const got: Record<string, number> = {};
    for (const edge of dEdges) expected[edge.toNode] = (expected[edge.toNode] ?? 0) + 1;

    const emit = (nodeId: string, portId: string, temp: number) => {
      const key = `${nodeId}:${portId}`;
      if (temps.has(key)) return;
      temps.set(key, temp);
      for (const edge of dEdges) {
        if (edge.fromNode !== nodeId || edge.fromPort !== portId || sent.has(edge.edgeId)) continue;
        sent.add(edge.edgeId);
        edge.temp = temp;
        prop.edgeTemp[edge.edgeId] = temp;
        got[edge.toNode] = (got[edge.toNode] ?? 0) + 1;
        if (got[edge.toNode] === expected[edge.toNode]) resolve(edge.toNode);
      }
    };

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

    function resolve(nodeId: string) {
      const node = nodeById.get(nodeId);
      const def = node ? getComponent(node.componentId) : undefined;
      if (!node || !def) return;
      const incoming = dEdges.filter((edge) => edge.toNode === nodeId && Number.isFinite(edge.temp));
      prop.inlets[nodeId] = incoming.map((edge) => ({ port: edge.toPort, t: edge.temp, flowLph: edge.flowLph }));
      if (def.id === 'heat-pump') {
        prop.hpReturn = mix(incoming).t;
        return;
      }
      if (def.id === 'buffer-tank') return;
      if (def.category === 'consumer') {
        const inlet = incoming.filter((edge) => edge.toPort === 'supply-in');
        const mixed = inlet.length ? mix(inlet) : { t: tTankValue ?? tSup, flow: 0 };
        const heat = extractHeat(node.params.demand ?? 0, mixed.t, mixed.flow, mode, tSet);
        prop.qOut += heat.q;
        prop.consumer[nodeId] = {
          tIn: mixed.t, tOut: heat.tOut, flowLph: mixed.flow, qKw: heat.q, dt: heat.dt,
        };
        emit(nodeId, 'return-out', heat.tOut);
        return;
      }
      const mixed = incoming.length ? mix(incoming) : { t: tSup, flow: 0 };
      prop.pass[nodeId] = {
        tIn: mixed.t, tOut: mixed.t, flowLph: mixed.flow, qKw: 0, dt: 0,
      };
      const ports = new Set(dEdges.filter((edge) => edge.fromNode === nodeId).map((edge) => edge.fromPort));
      for (const port of ports) emit(nodeId, port, mixed.t);
    }

    if (Number.isFinite(tSup)) emit(hpId, 'supply-out', tSup);
    if (buffer && tTankValue != null) {
      for (const port of ['pri-out', ...SEC_OUT]) emit(buffer.id, port, tTankValue);
    }
    return prop;
  }

  function visualTarget(edge: DEdge, sims: Record<string, NodeSim>): number {
    const target = sims[edge.toNode];
    const def = defOf(edge.toNode);
    if (!target || !def) return edge.temp;
    if (def.category === 'consumer') return edge.temp - 0.62 * target.dt;
    if (def.id === 'buffer-tank' && edge.toPort === 'pri-in' && target.tankC != null) {
      return edge.temp + (target.tankC - edge.temp) * 0.55;
    }
    if (def.id === 'buffer-tank' && edge.toPort.startsWith('sec-in') && target.tankC != null) {
      return edge.temp + (target.tankC - edge.temp) * 0.3;
    }
    return edge.temp;
  }
}

function internalFlow(hp: GraphNode): number {
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
