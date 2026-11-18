/**
 * Thermostat commands for motorized valves.
 *
 * A dashed signal carries a 0..1 command from a room thermostat to a valve,
 * the same split between water pipes and signal wires as FluidLab
 * (MIT License, Copyright (c) 2026 Andre Paquette,
 * https://github.com/thepacket/fluidlab, src/model/control.ts).
 * The room balance and the valve laws below are written for this studio.
 */
import { getComponent, resolvePorts } from '@/components/studio/registry';
import { clamp } from '@/components/studio/temperature';
import type { GraphEdge, GraphNode, SimResult } from '@/components/studio/types';

/** Seconds. Fast on purpose so a room can be seen warming and cooling. */
export const ROOM_TAU = 8;
/** kW of heat that raises the room 1 K above ambient at steady state. */
export const ROOM_LOSS = 0.22;
const HYSTERESIS = 0.5;

export interface ControlInput {
  nodes: GraphNode[];
  edges: GraphEdge[];
  /** Room temperature by thermostat id. Missing rooms start at ambient. */
  rooms: Record<string, number>;
  /** Previous on/off position, so the contact holds inside the deadband. */
  held: Record<string, number>;
  /** Last hydraulic result, used for relief temperature and room heat. */
  result?: SimResult | null;
}

function pipeEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.filter((edge) => edge.kind !== 'signal');
}

function signalEdges(edges: GraphEdge[]): GraphEdge[] {
  return edges.filter((edge) => edge.kind === 'signal');
}

function openingParam(node: GraphNode): number {
  return clamp((node.params.opening ?? 100) / 100, 0, 1);
}

/** Consumers whose supply is downstream of a valve. */
export function consumersDownstream(valveId: string, nodes: GraphNode[], edges: GraphEdge[]): string[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const links = new Map<string, { nodeId: string; portId: string }[]>();
  for (const edge of pipeEdges(edges)) {
    const forward = `${edge.source}:${edge.sourceHandle}`;
    const back = `${edge.target}:${edge.targetHandle}`;
    links.set(forward, [...(links.get(forward) ?? []), { nodeId: edge.target, portId: edge.targetHandle }]);
    links.set(back, [...(links.get(back) ?? []), { nodeId: edge.source, portId: edge.sourceHandle }]);
  }
  const valve = byId.get(valveId);
  const def = valve ? getComponent(valve.componentId) : undefined;
  if (!def) return [];
  const starts = def.id === 'valve-3way' ? ['a', 'b', 'ab'] : ['out'];
  const found = new Set<string>();
  const seen = new Set<string>([valveId]);
  const queue = starts.map((port) => ({ nodeId: valveId, portId: port }));
  let guard = 0;
  while (queue.length && guard++ < 40) {
    const current = queue.shift()!;
    for (const next of links.get(`${current.nodeId}:${current.portId}`) ?? []) {
      if (seen.has(next.nodeId)) continue;
      const nextDef = getComponent(byId.get(next.nodeId)?.componentId ?? '');
      if (!nextDef) continue;
      if (nextDef.category === 'consumer') {
        found.add(next.nodeId);
        seen.add(next.nodeId);
        continue;
      }
      seen.add(next.nodeId);
      for (const port of resolvePorts(nextDef, byId.get(next.nodeId)?.params ?? {})) {
        if (port.terminal === 'signal') continue;
        if (port.id === next.portId) continue;
        queue.push({ nodeId: next.nodeId, portId: port.id });
      }
    }
  }
  return [...found];
}

function heatOf(ids: string[], result?: SimResult | null): number {
  if (!result) return 0;
  return ids.reduce((sum, id) => sum + (result.nodes[id]?.qKw ?? 0), 0);
}

/** 0..1 position of every valve, after thermostat and relief rules. */
export function computeOpenings(input: ControlInput): Record<string, number> {
  const { nodes, edges, rooms, held, result } = input;
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const openings: Record<string, number> = {};
  const wires = signalEdges(edges);

  for (const node of nodes) {
    const def = getComponent(node.componentId);
    if (!def) continue;
    if (def.id === 'valve' || def.id === 'valve-3way') {
      const manual = openingParam(node);
      const motor = (node.params.motorized ?? 0) >= 0.5;
      const wire = wires.find((edge) => edge.target === node.id && edge.targetHandle === 'ctl');
      const thermo = wire ? byId.get(wire.source) : undefined;
      if (!motor || !thermo || thermo.componentId !== 'thermostat') {
        openings[node.id] = manual;
        continue;
      }
      const ambient = thermo.params.ambient ?? 16;
      const room = rooms[thermo.id] ?? ambient;
      const setpoint = thermo.params.roomSet ?? 21;
      const modulating = (node.params.behavior ?? 0) >= 0.5;
      if (modulating) {
        openings[node.id] = clamp((setpoint - room + 0.4) / 2, 0, 1);
      } else {
        let on = (held[node.id] ?? (room < setpoint ? 1 : 0)) >= 0.5;
        if (room <= setpoint - HYSTERESIS) on = true;
        else if (room >= setpoint + HYSTERESIS) on = false;
        openings[node.id] = on ? 1 : 0;
      }
    } else if (def.id === 'relief') {
      const inlet = result?.nodes[node.id]?.tIn ?? result?.supplyC ?? 0;
      const limit = node.params.limitC ?? 75;
      const wasOpen = (held[node.id] ?? 0) >= 0.5;
      const open = inlet >= limit || (wasOpen && inlet >= limit - 3);
      openings[node.id] = open ? 1 : 0;
    }
  }
  return openings;
}

/** Move each room toward the balance set by the emitters behind its valves. */
export function stepRooms(input: ControlInput, dt: number): Record<string, number> {
  const next: Record<string, number> = {};
  for (const node of input.nodes) {
    if (node.componentId !== 'thermostat') continue;
    const ambient = node.params.ambient ?? 16;
    const current = input.rooms[node.id] ?? ambient;
    const valves = signalEdges(input.edges)
      .filter((edge) => edge.source === node.id && edge.sourceHandle === 'sig')
      .map((edge) => edge.target);
    const served = new Set<string>();
    for (const valveId of valves) {
      for (const consumer of consumersDownstream(valveId, input.nodes, input.edges)) served.add(consumer);
    }
    const q = heatOf([...served], input.result);
    const balance = ambient + q / ROOM_LOSS;
    const step = 1 - Math.exp(-Math.max(dt, 0) / ROOM_TAU);
    next[node.id] = clamp(current + (balance - current) * step, 5, 40);
  }
  return next;
}
