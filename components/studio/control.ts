/**
 * Valve and mixer positions for one simulation step.
 *
 * A dashed signal carries a binary divert command, the same split between
 * water pipes and signal wires as FluidLab (MIT License, Copyright (c) 2026
 * Andre Paquette, https://github.com/thepacket/fluidlab, src/model/control.ts).
 * This studio does not model a warming room. Ambient and room setpoint are
 * two numbers the visitor sets.
 *
 * Three-way precedence (still 100% to one port, never a mix):
 * 1. Thermostat connected and controlMode is Auto: ambient above the room
 *    setpoint sends every drop to port B, otherwise every drop to port A.
 * 2. controlMode is Manual: the A/B toggle decides, even if a thermostat is connected.
 * 3. No thermostat signal: the toggle decides, and Auto has nothing to follow.
 *
 * A mixer stores its hot share here (0 = all cold, 1 = all hot). It has no signal.
 */
import { getComponent } from '@/components/studio/registry';
import { clamp } from '@/components/studio/temperature';
import type { GraphEdge, GraphNode, SimResult } from '@/components/studio/types';

export interface ControlInput {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Kept so a relief valve can read the last supply temperature. */
  result?: SimResult | null;
  /** Previous relief position, so it does not chatter around the limit. */
  held: Record<string, number>;
}

function signalEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.filter((edge) => edge.kind === 'signal');
}

function openingParam(node: GraphNode): number {
  return clamp((node.params.opening ?? 100) / 100, 0, 1);
}

/** 0 means three-way port A (default). 1 means port B (diverted). */
export function computeOpenings(input: ControlInput): Record<string, number> {
  const { nodes, edges, held, result } = input;
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const openings: Record<string, number> = {};
  const wires = signalEdges(edges);

  for (const node of nodes) {
    const def = getComponent(node.componentId);
    if (!def) continue;
    if (def.id === 'valve') {
      openings[node.id] = openingParam(node);
    } else if (def.id === 'valve-3way') {
      const manual = (node.params.manualPort ?? 0) >= 0.5 ? 1 : 0;
      const wire = wires.find((edge) => edge.target === node.id && edge.targetHandle === 'ctl');
      const thermo = wire ? byId.get(wire.source) : undefined;
      const linked = Boolean(thermo && thermo.componentId === 'thermostat');
      const auto = (node.params.controlMode ?? 0) < 0.5;
      if (!linked || !auto) {
        openings[node.id] = manual;
        continue;
      }
      const ambient = thermo?.params.ambient ?? 16;
      const setpoint = thermo?.params.roomSet ?? 21;
      openings[node.id] = ambient > setpoint ? 1 : 0;
    } else if (def.id === 'mixer') {
      openings[node.id] = clamp((node.params.mix ?? 50) / 100, 0, 1);
    } else if (def.id === 'pump') {
      const wire = wires.find((edge) => edge.target === node.id && edge.targetHandle === 'ctl');
      const thermo = wire ? byId.get(wire.source) : undefined;
      if (!thermo || thermo.componentId !== 'thermostat') continue;
      const ambient = thermo.params.ambient ?? 16;
      const setpoint = thermo.params.roomSet ?? 21;
      // Same comparison as the three-way valve. Above the setpoint the pump stops.
      openings[node.id] = ambient > setpoint ? 0 : 1;
    } else if (def.id === 'relief') {
      const inlet = result?.nodes[node.id]?.tIn ?? result?.supplyC ?? 0;
      const limit = node.params.limitC ?? 75;
      const wasOpen = (held[node.id] ?? 0) >= 0.5;
      openings[node.id] = inlet >= limit || (wasOpen && inlet >= limit - 3) ? 1 : 0;
    }
  }
  return openings;
}
