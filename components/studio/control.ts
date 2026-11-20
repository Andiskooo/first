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
 * 1. Thermostat or sonde connected and controlMode is Auto: above the
 *    setpoint (room or tank target) every drop goes to port B, otherwise
 *    every drop goes to port A.
 * 2. controlMode is Manual: the A/B toggle decides, even with a signal connected.
 * 3. No signal: the toggle decides, and Auto has nothing to follow.
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
 * A circulation pump runs at its speed slider until a connected thermostat
 * or sonde reports its setpoint reached, then it stops. With no signal the
 * pump is only the speed slider.
 */
import { getComponent, isBufferId, isHeatPumpId, isHeatingConsumerId } from '@/components/studio/registry';
import { clamp } from '@/components/studio/temperature';
import type { GraphEdge, GraphNode, NodeSim, SimResult } from '@/components/studio/types';

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
 * Reads a tank's simulated water temperature: the mixed volume for a buffer,
 * the coil average for a DHW tank. Null when the tank has no solved state.
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
      const wire = wires.find((edge) => edge.target === node.id && edge.targetHandle === 'ctl');
      const src = wire ? byId.get(wire.source) : undefined;
      const auto = (node.params.controlMode ?? 0) < 0.5;
      // A tank sonde commands the same divert choice as a thermostat: at or
      // above its target the valve takes the alternative port B, otherwise
      // the default port A. A missing measurement falls back to the toggle.
      if (src?.componentId === 'tank-sonde' && auto) {
        openings[node.id] = sondeCommand(src, edges, measuredOf) ?? manual;
        continue;
      }
      const linked = Boolean(src && src.componentId === 'thermostat');
      if (!linked || !auto) {
        openings[node.id] = manual;
        continue;
      }
      const temp = sensedTempOf(src) ?? src?.params.ambient ?? 16;
      const setpoint = src?.params.roomSet ?? 21;
      openings[node.id] = temp > setpoint ? 1 : 0;
    } else if (def.id === 'mixer') {
      openings[node.id] = clamp((node.params.mix ?? 50) / 100, 0, 1);
    } else if (def.id === 'pump' || isHeatPumpId(def.id)) {
      const wire = wires.find((edge) => edge.target === node.id && edge.targetHandle === 'ctl');
      const src = wire ? byId.get(wire.source) : undefined;
      // A tank sonde runs the pump while the tank still needs heat. The
      // heat pump itself listens to a thermostat only.
      if (src?.componentId === 'tank-sonde') {
        if (!isHeatPumpId(def.id)) {
          const need = sondeHeatRequired(src, edges, measuredOf);
          if (need != null) openings[node.id] = need ? 1 : 0;
        }
        continue;
      }
      if (!src || src.componentId !== 'thermostat') continue;
      const temp = sensedTempOf(src) ?? src.params.ambient ?? 16;
      const setpoint = src.params.roomSet ?? 21;
      // Same comparison as the three-way valve. Above the setpoint the pump stops.
      openings[node.id] = temp > setpoint ? 0 : 1;
    } else if (def.id === 'relief') {
      const inlet = result?.nodes[node.id]?.tIn ?? result?.supplyC ?? 0;
      const limit = node.params.limitC ?? 75;
      const wasOpen = (held[node.id] ?? 0) >= 0.5;
      openings[node.id] = inlet >= limit || (wasOpen && inlet >= limit - 3) ? 1 : 0;
    }
  }
  return openings;
}
