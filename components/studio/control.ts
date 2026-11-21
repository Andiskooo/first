/**
 * Valve and mixer positions for one simulation step.
 *
 * A dashed signal carries a binary divert command, the same split between
 * water pipes and signal wires as FluidLab (MIT License, Copyright (c) 2026
 * Andre Paquette, https://github.com/thepacket/fluidlab, src/model/control.ts).
 * This studio does not model a warming room. A thermostat without a green
 * measurement link compares ambient and room setpoint, two numbers the
 * visitor sets. With a green link from a heating consumer it compares that
 * consumer's simulated zone temperature to the room setpoint instead.
 * A tank sonde compares its tank temperature to its own target.
 *
 * Three-way precedence (still 100% to one port, never a mix):
 * 1. Any tank sonde connected: the valve is sensor-locked AUTO regardless of
 *    controlMode. A stale manualPort can never override a sonde command, and
 *    the hydraulic outlet seeds to port A (never to the stored manual port).
 * 2. Thermostat connected (and no sonde) and controlMode is Auto: above the
 *    room setpoint every drop goes to port B, otherwise every drop goes to
 *    port A.
 * 3. One tank sonde and locked AUTO: at/above its target every drop goes
 *    to port B, otherwise to port A (identical on either purple input).
 * 4. Two tank sondes and locked AUTO: only the sonde measuring the
 *    currently active hydraulic branch may command a switch, giving an
 *    automatic A -> B -> A cycle. Branch membership comes from the hydraulic
 *    pipe graph (which consumer hangs off port `a` vs `b`), never from which
 *    purple wire (ctl vs ctl2) delivered the signal, so swapped purple plugs
 *    behave identically.
 * 5. controlMode is Manual (no sonde): the A/B toggle decides, even with a
 *    thermostat signal connected.
 * 6. No signal: the A/B toggle decides (the app hands manual control back
 *    from the preserved outlet when the last purple wire is removed).
 *
 * A mixer stores its hot share here (0 = all cold, 1 = all hot). It has no signal.
 *
 * Two-way precedence:
 * 1. Thermostat or sonde connected and controlMode is Auto: above the
 *    setpoint the valve closes, otherwise it stays at its opening percentage.
 * 2. controlMode is Manual: the Open/Closed toggle decides, even with a signal.
 * 3. No signal: the toggle and the opening percentage both apply. The toggle
 *    defaults to open, so an existing opening setting is unchanged.
 *
 * A circulation pump runs at its speed slider when no command is connected
 * (default ON). A thermostat stops it above the room setpoint (with a short
 * OFF hold so the 0 C reset cannot restart it in the same update). A tank
 * sonde measuring a buffer holds it OFF until the buffer reaches target,
 * then runs it; a sonde on any other heat user keeps the legacy run-while-
 * cold behavior.
 */
import { getComponent, isBufferId, isHeatPumpId, isHeatingConsumerId, isSondeTargetId } from '@/components/studio/registry';
import { clamp } from '@/components/studio/temperature';
import type { GraphEdge, GraphNode, NodeSim, SimResult } from '@/components/studio/types';

/**
 * Control-signal vocabulary (internal): sondes publish a level against their
 * own target and actuators interpret it.
 * - HEATING_DEMAND: measured body is below target, the branch needs heat.
 * - TARGET_REACHED: measured body is at or above target.
 * - NO_DEMAND: heating demand has ended (thermostat satisfied).
 * A buffer-controlled pump treats TARGET_REACHED as ON; a three-way valve
 * treats it as "leave the completed branch".
 */
export const HEATING_DEMAND = 0;
export const TARGET_REACHED = 1;

/** Hysteresis below a buffer target before a buffer-driven pump drops out. */
export const BUFFER_RESTART_DROP = 2;

/** Thermostat pump minimum OFF time, in simulation updates, after a target shutdown. */
const PUMP_OFF_HOLD_UPDATES = 1;
const pumpOffHold = new Map<string, number>();

/** Clear latched control memory (pump OFF holds). Call when simulation resets. */
export function resetControlState(): void {
  pumpOffHold.clear();
}

/**
 * Minimum sustained heat-pump OFF time (wall ms) before an ON edge counts as
 * a genuine thermostat restart. A target-temperature shutdown is followed by
 * the instant 0 C reset of the just-stopped branch, so the very next
 * evaluation already calls for heat again: that micro-OFF (about a frame)
 * must not wipe the warm-up ramp, or rapidly auto-cycling systems reset to
 * HP_WARM_START_C faster than the gradual increase can climb and the supply
 * pins near 25 C forever. Genuine user-driven OFF periods (seconds or more)
 * still reset exactly as before.
 */
export const HP_RESTART_DEBOUNCE_MS = 1000;

/**
 * True only for a genuine thermostat OFF→ON restart: a completed 0→1 gate
 * edge whose OFF side lasted at least HP_RESTART_DEBOUNCE_MS. The very first
 * ON (no previous gate), a sustained ON, and micro-OFF blips all return
 * false so the in-progress warm-up ramp survives them.
 */
export function isGenuineHpRestart(
  prevGate: number | undefined,
  gate: number | undefined,
  offMs: number,
): boolean {
  if (prevGate === undefined || gate === undefined) return false;
  if (!(prevGate < 0.5 && gate >= 0.5)) return false;
  return offMs >= HP_RESTART_DEBOUNCE_MS;
}

export interface ControlInput {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Kept so a relief valve can read the last supply temperature. */
  result?: SimResult | null;
  /** Previous relief position, so it does not chatter around the limit. */
  held: Record<string, number>;
  /**
   * Live body/zone temperatures (°C) by node id, advanced with simulation
   * time. Sensors prefer these; without them they fall back to the solved
   * hydraulic state, so unconnected or idle diagrams behave exactly as before.
   */
  temps?: Record<string, number>;
}

function signalEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.filter((edge) => edge.kind === 'signal');
}

function openingParam(node: GraphNode): number {
  return clamp((node.params.opening ?? 100) / 100, 0, 1);
}

/**
 * Reads a heat user's simulated body temperature: the mixed volume for a
 * buffer, the coil average for a DHW tank, or the live zone value for a
 * radiator / floor / fan coil. Null when the body has no solved state.
 */
export function simTankC(sims: Record<string, NodeSim>, nodes: GraphNode[], tankId: string): number | null {
  const sim = sims[tankId];
  if (!sim) return null;
  const node = nodes.find((item) => item.id === tankId);
  if (!node) return null;
  if (isBufferId(node.componentId)) return sim.tankC ?? null;
  if (node.componentId === 'dhw-tank') {
    if (Number.isFinite(sim.tIn) && Number.isFinite(sim.tOut)) return (sim.tIn + sim.tOut) / 2;
    return Number.isFinite(sim.tIn) ? sim.tIn : null;
  }
  if (isHeatingConsumerId(node.componentId)) {
    if (sim.roomC != null && Number.isFinite(sim.roomC)) return sim.roomC;
    if (Number.isFinite(sim.tIn) && Number.isFinite(sim.tOut)) return (sim.tIn + sim.tOut) / 2;
    return Number.isFinite(sim.tIn) ? sim.tIn : null;
  }
  return null;
}

/**
 * The tank a sonde measures, from its green `sense` link. Null when the
 * sonde is disconnected. Either drag direction lands on the same tank.
 */
export function sondeTankOf(sonde: GraphNode | undefined, edges: GraphEdge[]): string | null {
  if (!sonde || sonde.componentId !== 'tank-sonde') return null;
  const link = edges.find((edge) => edge.kind === 'sense' && (
    (edge.source === sonde.id && edge.sourceHandle === 'sense') ||
    (edge.target === sonde.id && edge.targetHandle === 'sense')
  ));
  if (!link) return null;
  return link.source === sonde.id ? link.target : link.source;
}

/**
 * The heating consumer a room thermostat measures, from its green `sense`
 * link. Null when disconnected. Either drag direction lands on the consumer.
 */
export function thermostatZoneOf(
  thermo: GraphNode | undefined,
  nodes: GraphNode[],
  edges: GraphEdge[],
): string | null {
  if (!thermo || thermo.componentId !== 'thermostat') return null;
  const link = edges.find((edge) => edge.kind === 'sense' && (
    (edge.source === thermo.id && edge.sourceHandle === 'sense') ||
    (edge.target === thermo.id && edge.targetHandle === 'sense')
  ));
  if (!link) return null;
  const peerId = link.source === thermo.id ? link.target : link.source;
  const peer = nodes.find((item) => item.id === peerId);
  if (!peer || !isHeatingConsumerId(peer.componentId)) return null;
  return peerId;
}

/**
 * Tank-sonde call for heat: true while the measured tank temperature sits
 * below the sonde target, false once it reaches it, null when the sonde
 * reads no tank so the caller falls back to manual behavior.
 */
export function sondeHeatRequired(
  sonde: GraphNode | undefined,
  edges: GraphEdge[],
  measuredOf: (tankId: string) => number | null | undefined,
): boolean | null {
  const command = sondeCommand(sonde, edges, measuredOf);
  if (command == null) return null;
  return command < 0.5;
}

/**
 * Tank-sonde divert command for a three-way valve. Returns 1 (alternative
 * port B) once the measured tank temperature reaches the sonde target, 0
 * (default port A) below it, and null when the sonde reads no tank —
 * disconnected, or the tank has no simulated temperature yet — so the caller
 * can fall back to the manual toggle instead of guessing.
 */
export function sondeCommand(
  sonde: GraphNode | undefined,
  edges: GraphEdge[],
  measuredOf: (tankId: string) => number | null | undefined,
): number | null {
  if (!sonde || sonde.componentId !== 'tank-sonde') return null;
  const tankId = sondeTankOf(sonde, edges);
  if (!tankId) return null;
  const measured = measuredOf(tankId);
  if (measured == null || !Number.isFinite(measured)) return null;
  return measured >= (sonde.params.tankSet ?? 45) ? 1 : 0;
}

/**
 * Which hydraulic branch of a three-way valve a tank sonde guards, resolved
 * from the water-pipe graph instead of the purple wire it arrived on. Returns
 * 'A' when the sonde's measured tank is reachable from port `a`, 'B' when it
 * is reachable from port `b`, 'both' when reachable from either side (shared
 * water), and 'none' when it guards an upstream tank or nothing reachable.
 */
function guardBranchOf(
  valveId: string,
  sonde: GraphNode,
  nodes: GraphNode[],
  edges: GraphEdge[],
): 'A' | 'B' | 'both' | 'none' {
  const tankId = sondeTankOf(sonde, edges);
  if (!tankId) return 'none';
  const aSet = branchReach(valveId, 'a', nodes, edges);
  const bSet = branchReach(valveId, 'b', nodes, edges);
  const inA = aSet.has(tankId);
  const inB = bSet.has(tankId);
  if (inA && inB) return 'both';
  if (inA) return 'A';
  if (inB) return 'B';
  return 'none';
}

/**
 * Water-side consumers/tanks reachable from one hydraulic port of a node,
 * following pipe edges only (signal/sense links carry no water). Traversal
 * passes through inline connectors (pumps, tees, junctions, manifolds,
 * two-way valves, checks, vents) and stops at heat users, tanks, sources,
 * buffers, mixers, and other divert bodies, so the two outlet branches of a
 * three-way valve stay separated at their shared return join.
 */
function branchReach(
  nodeId: string,
  portId: string,
  nodes: GraphNode[],
  edges: GraphEdge[],
): Set<string> {
  const found = new Set<string>();
  const peers = new Map<string, { nodeId: string; portId: string }>();
  for (const edge of edges) {
    if (edge.kind === 'signal' || edge.kind === 'sense') continue;
    if (!edge.sourceHandle || !edge.targetHandle) continue;
    peers.set(`${edge.source}:${edge.sourceHandle}`, { nodeId: edge.target, portId: edge.targetHandle });
    peers.set(`${edge.target}:${edge.targetHandle}`, { nodeId: edge.source, portId: edge.sourceHandle });
  }
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const start = peers.get(`${nodeId}:${portId}`);
  if (!start) return found;
  const PASS_THROUGH = new Set(['pump', 'tee', 'junction', 'manifold-supply', 'manifold-return', 'valve', 'check', 'air-vent']);
  const seen = new Set<string>();
  const queue: { nodeId: string; portId: string }[] = [start];
  while (queue.length) {
    const current = queue.pop()!;
    const key = `${current.nodeId}:${current.portId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const node = byId.get(current.nodeId);
    if (!node) continue;
    if (isSondeTargetId(node.componentId)) {
      found.add(node.id);
      continue;
    }
    const def = getComponent(node.componentId);
    if (!def) continue;
    if (!PASS_THROUGH.has(def.id)) continue;
    for (const port of def.ports) {
      if (port.terminal === 'signal' || port.terminal === 'sense') continue;
      if (port.id === current.portId) continue;
      const next = peers.get(`${node.id}:${port.id}`);
      if (next) queue.push(next);
    }
  }
  return found;
}

/** 0 means three-way port A (default). 1 means port B (diverted). */
export function computeOpenings(input: ControlInput): Record<string, number> {
  const { nodes, edges, held, result, temps } = input;
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const openings: Record<string, number> = {};
  const wires = signalEdges(edges);
  // Sensor readings prefer live body/zone temperatures and fall back to the
  // solved hydraulic state, so idle diagrams behave exactly as before.
  const measuredOf = (tankId: string) => temps?.[tankId] ?? simTankC(result?.nodes ?? {}, nodes, tankId);
  const sensedTempOf = (src: GraphNode | undefined): number | undefined => {
    if (!src || src.componentId !== 'thermostat') return undefined;
    const zoneId = thermostatZoneOf(src, nodes, edges);
    const zone = zoneId ? temps?.[zoneId] : undefined;
    return zone != null && Number.isFinite(zone) ? zone : undefined;
  };

  for (const node of nodes) {
    const def = getComponent(node.componentId);
    if (!def) continue;
    if (def.id === 'valve') {
      const fraction = openingParam(node);
      const manualOpen = (node.params.manualOpen ?? 1) >= 0.5;
      const wire = wires.find((edge) => edge.target === node.id && edge.targetHandle === 'ctl');
      const src = wire ? byId.get(wire.source) : undefined;
      const auto = (node.params.controlMode ?? 0) < 0.5;
      // A tank sonde holds the valve open while the tank still needs heat
      // and shuts it at the target. A missing measurement keeps the toggle.
      if (src?.componentId === 'tank-sonde' && auto) {
        const need = sondeHeatRequired(src, edges, measuredOf);
        openings[node.id] = need == null ? (manualOpen ? fraction : 0) : (need ? fraction : 0);
        continue;
      }
      const linked = Boolean(src && src.componentId === 'thermostat');
      if (linked && auto) {
        const temp = sensedTempOf(src) ?? src?.params.ambient ?? 16;
        const setpoint = src?.params.roomSet ?? 21;
        openings[node.id] = temp > setpoint ? 0 : fraction;
        continue;
      }
      openings[node.id] = manualOpen ? fraction : 0;
    } else if (def.id === 'valve-3way') {
      const manual = (node.params.manualPort ?? 0) >= 0.5 ? 1 : 0;
      const wireA = wires.find((edge) => edge.target === node.id && edge.targetHandle === 'ctl');
      const wireB = wires.find((edge) => edge.target === node.id && (edge.targetHandle === 'ctl2' || edge.targetHandle === 'ctlB'));
      const srcA = wireA ? byId.get(wireA.source) : undefined;
      const srcB = wireB ? byId.get(wireB.source) : undefined;
      const sondes = [srcA, srcB].filter((src): src is GraphNode => src?.componentId === 'tank-sonde');
      // Any tank sonde on either purple input sensor-locks the valve into
      // AUTO: controlMode/manualPort are ignored, and the outlet seeds to
      // port A (held memory afterwards, never the stored manual port).
      const locked = sondes.length > 0;
      const auto = locked || (node.params.controlMode ?? 0) < 0.5;
      if (!auto || (!locked && !srcA && !srcB)) {
        openings[node.id] = manual;
        continue;
      }
      // A thermostat keeps the legacy divert choice when no sonde is present.
      // Sondes take precedence when both command the valve.
      const thermo = srcA?.componentId === 'thermostat' ? srcA : srcB?.componentId === 'thermostat' ? srcB : undefined;
      if (thermo && !locked) {
        const temp = sensedTempOf(thermo) ?? thermo.params.ambient ?? 16;
        const setpoint = thermo.params.roomSet ?? 21;
        openings[node.id] = temp > setpoint ? 1 : 0;
        continue;
      }
      if (!locked) {
        openings[node.id] = manual;
        continue;
      }
      // Active-port memory. Seeded to A on the first sensor-locked update and
      // committed afterwards, so AUTO never re-forces A once B is active.
      const active = held[node.id] !== undefined ? (held[node.id] >= 0.5 ? 1 : 0) : 0;
      // Single-sonde fallback: at or above target take port B, otherwise
      // port A. Identical on ctl and ctl2. A missing measurement holds the
      // active outlet instead of jumping to a stale manual port.
      if (sondes.length === 1) {
        const cmd = sondeCommand(sondes[0], edges, measuredOf);
        openings[node.id] = cmd ?? active;
        continue;
      }
      // Dual-sonde arbitration: only the sonde(s) measuring the currently
      // active hydraulic branch may command a switch. Branch membership is
      // resolved from the hydraulic pipe graph (port `a` vs `b` reach), never
      // from which purple wire delivered the signal, so swapped purple plugs
      // behave identically. The inactive branch being below target is normal
      // and never triggers a switch; a missing measurement holds the outlet.
      const guards = sondes.map((sonde) => ({
        sonde,
        cmd: sondeCommand(sonde, edges, measuredOf),
        branch: guardBranchOf(node.id, sonde, nodes, edges),
      }));
      const aGuard = guards.find((entry) => entry.branch === 'A');
      const bGuard = guards.find((entry) => entry.branch === 'B' && entry !== aGuard);
      if (aGuard && bGuard) {
        if (active < 0.5) {
          const cmd = aGuard.cmd;
          openings[node.id] = cmd == null ? active : (cmd >= 0.5 ? TARGET_REACHED : HEATING_DEMAND);
        } else {
          const cmd = bGuard.cmd;
          // On the B branch, reaching target means return to A (0); still
          // heating holds B (1).
          openings[node.id] = cmd == null ? active : (cmd >= 0.5 ? 0 : 1);
        }
        continue;
      }
      // Ambiguous branch mapping (shared/upstream tanks): any at-target
      // command toggles to the opposite outlet. Exactly one transition per
      // update; a clear/missing command holds the outlet so a stale hot
      // reading cannot bounce the valve back immediately.
      const anyHot = guards.some((entry) => entry.cmd != null && entry.cmd >= 0.5);
      if (!anyHot) {
        openings[node.id] = active;
        continue;
      }
      openings[node.id] = active < 0.5 ? TARGET_REACHED : HEATING_DEMAND;
    } else if (def.id === 'mixer') {
      openings[node.id] = clamp((node.params.mix ?? 50) / 100, 0, 1);
    } else if (def.id === 'pump' || isHeatPumpId(def.id)) {
      const wire = wires.find((edge) => edge.target === node.id && edge.targetHandle === 'ctl');
      const src = wire ? byId.get(wire.source) : undefined;
      // No command wire: the pump runs at its speed slider (default ON).
      // Falling through without an entry keeps the hydraulic gate open.
      if (!src) continue;
      // A tank sonde measuring a BUFFER inverts the legacy sense: the
      // secondary pump stays OFF while the buffer is cold and turns ON only
      // once the buffer reaches its target. The primary heat-pump-to-buffer
      // circuit is evaluated independently, so a stopped secondary pump
      // never blocks the buffer from heating. Other sonde targets keep the
      // legacy "run while heat is required" behavior. The heat pump itself
      // listens to a thermostat only.
      if (src.componentId === 'tank-sonde') {
        if (isHeatPumpId(def.id)) continue;
        const tankId = sondeTankOf(src, edges);
        const peer = tankId ? byId.get(tankId) : undefined;
        const measured = tankId ? measuredOf(tankId) : undefined;
        if (tankId == null || measured == null || !Number.isFinite(measured)) continue;
        const target = src.params.tankSet ?? 45;
        if (peer && isBufferId(peer.componentId)) {
          const prev = held[node.id];
          if (measured >= target) {
            openings[node.id] = 1;
          } else if (measured < target - BUFFER_RESTART_DROP) {
            openings[node.id] = 0;
          } else {
            openings[node.id] = prev !== undefined ? (prev >= 0.5 ? 1 : 0) : 0;
          }
        } else {
          const need = sondeHeatRequired(src, edges, measuredOf);
          if (need != null) openings[node.id] = need ? 1 : 0;
        }
        continue;
      }
      if (src.componentId !== 'thermostat') continue;
      const temp = sensedTempOf(src) ?? src.params.ambient ?? 16;
      const setpoint = src.params.roomSet ?? 21;
      // Same comparison as the three-way valve. Above the setpoint the pump
      // stops. A minimum OFF hold of one simulation update follows a
      // target-temperature shutdown, so the instant 0 C reset of the
      // just-stopped branch cannot re-start the pump in the same update.
      const want = temp > setpoint ? 0 : 1;
      const prev = held[node.id];
      if (want < 0.5) {
        pumpOffHold.set(node.id, PUMP_OFF_HOLD_UPDATES);
        openings[node.id] = 0;
      } else {
        const remaining = pumpOffHold.get(node.id) ?? 0;
        if (prev !== undefined && prev < 0.5 && remaining > 0) {
          pumpOffHold.set(node.id, remaining - 1);
          openings[node.id] = 0;
        } else {
          pumpOffHold.delete(node.id);
          openings[node.id] = 1;
        }
      }
    } else if (def.id === 'relief') {
      const inlet = result?.nodes[node.id]?.tIn ?? result?.supplyC ?? 0;
      const limit = node.params.limitC ?? 75;
      const wasOpen = (held[node.id] ?? 0) >= 0.5;
      openings[node.id] = inlet >= limit || (wasOpen && inlet >= limit - 3) ? 1 : 0;
    }
  }
  return openings;
}
