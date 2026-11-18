import { getComponent, resolvePorts } from '@/components/studio/registry';
import type { GraphEdge, GraphNode, PortTerminal } from '@/components/studio/types';

export interface ConnectionEnd {
  nodeId: string;
  portId: string;
  terminal: PortTerminal;
}

const SUPPLY = new Set<PortTerminal>([
  'hp-supply',
  'buffer-primary-in',
  'buffer-secondary-out',
  'consumer-supply',
  'header-supply',
  'relief-in',
]);

const RETURN = new Set<PortTerminal>([
  'hp-return',
  'buffer-primary-out',
  'buffer-secondary-in',
  'consumer-return',
  'header-return',
  'relief-out',
]);

export type CircuitTint = 'supply' | 'return' | 'neutral' | 'mixed';

interface Endpoint {
  nodeId: string;
  portId: string;
}

function has(list: ConnectionEnd[], terminal: PortTerminal): boolean {
  return list.some((item) => item.terminal === terminal);
}

function linkMap(edges: GraphEdge[]): Map<string, Endpoint & { edgeId: string }> {
  const map = new Map<string, Endpoint & { edgeId: string }>();
  for (const edge of edges) {
    if (edge.kind === 'signal') continue;
    if (!edge.sourceHandle || !edge.targetHandle) continue;
    map.set(`${edge.source}:${edge.sourceHandle}`, { nodeId: edge.target, portId: edge.targetHandle, edgeId: edge.id });
    map.set(`${edge.target}:${edge.targetHandle}`, { nodeId: edge.source, portId: edge.sourceHandle, edgeId: edge.id });
  }
  return map;
}

/** Terminals reachable through pumps and tees. Devices are not crossed. */
export function floodTerminals(nodes: GraphNode[], edges: GraphEdge[], origin: Endpoint): ConnectionEnd[] {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const links = linkMap(edges);
  const hits: ConnectionEnd[] = [];
  const seen = new Set<string>();
  const queue: Endpoint[] = [origin];

  while (queue.length) {
    const current = queue.pop()!;
    const key = `${current.nodeId}:${current.portId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const node = nodeById.get(current.nodeId);
    const def = node ? getComponent(node.componentId) : undefined;
    const port = def && node ? resolvePorts(def, node.params).find((item) => item.id === current.portId) : undefined;
    if (!node || !def || !port) continue;
    // A three-way valve and a mixer keep each water port on its own circuit,
    // so hot and cold (or supply and return) can land on the same body.
    if (def.id === 'mixer' || (def.id === 'valve-3way' && port.id !== 'ctl')) {
      const link = links.get(key);
      if (link) queue.push({ nodeId: link.nodeId, portId: link.portId });
      continue;
    }
    if (port.terminal !== 'passive') {
      hits.push({ nodeId: current.nodeId, portId: current.portId, terminal: port.terminal });
      continue;
    }
    for (const other of resolvePorts(def, node.params)) {
      if (other.id !== current.portId) queue.push({ nodeId: current.nodeId, portId: other.id });
    }
    const link = links.get(key);
    if (link) queue.push({ nodeId: link.nodeId, portId: link.portId });
  }
  return hits;
}

function diagnose(ends: ConnectionEnd[]): string | null {
  const primary = has(ends, 'buffer-primary-in') || has(ends, 'buffer-primary-out');
  const secondary = has(ends, 'buffer-secondary-out') || has(ends, 'buffer-secondary-in');
  const heatPump = has(ends, 'hp-supply') || has(ends, 'hp-return');
  const consumer = has(ends, 'consumer-supply') || has(ends, 'consumer-return');

  if (primary && (consumer || secondary)) return 'user-on-source-side';
  if (secondary && (heatPump || primary)) return 'source-on-user-side';
  if (has(ends, 'buffer-primary-in') && has(ends, 'hp-return')) return 'buffer-inlet-hp-supply';
  if (has(ends, 'buffer-primary-out') && has(ends, 'hp-supply')) return 'buffer-outlet-hp-return';
  if (has(ends, 'buffer-secondary-out') && has(ends, 'consumer-return')) return 'buffer-outlet-consumer-supply';
  if (has(ends, 'buffer-secondary-in') && has(ends, 'consumer-supply')) return 'buffer-inlet-consumer-return';

  const supply = ends.some((item) => SUPPLY.has(item.terminal));
  const ret = ends.some((item) => RETURN.has(item.terminal));
  if (supply && ret) return 'supply-return-short';
  return null;
}

export function portOccupied(edges: GraphEdge[], nodeId: string, portId: string, nodes: GraphNode[] = []): boolean {
  const node = nodes.find((item) => item.id === nodeId);
  // One thermostat can command a two-way valve, a three-way valve, a pump, and a heat pump together.
  if (node?.componentId === 'thermostat' && portId === 'sig') return false;
  return edges.some((edge) =>
    (edge.source === nodeId && edge.sourceHandle === portId) ||
    (edge.target === nodeId && edge.targetHandle === portId));
}

export function validateConnection(
  nodes: GraphNode[],
  edges: GraphEdge[],
  source: string,
  sourceHandle: string | null | undefined,
  target: string,
  targetHandle: string | null | undefined,
): { ok: true } | { ok: false; code: string } {
  if (!sourceHandle || !targetHandle) return { ok: false, code: 'missing-port' };
  if (source === target) return { ok: false, code: 'same-node' };
  if (portOccupied(edges, source, sourceHandle, nodes) || portOccupied(edges, target, targetHandle, nodes)) {
    return { ok: false, code: 'port-used' };
  }
  const sourceNode = nodes.find((node) => node.id === source);
  const targetNode = nodes.find((node) => node.id === target);
  if (!sourceNode || !targetNode) return { ok: false, code: 'missing-port' };
  const sourceDef = getComponent(sourceNode.componentId);
  const targetDef = getComponent(targetNode.componentId);
  const sourcePort = sourceDef ? resolvePorts(sourceDef, sourceNode.params).find((port) => port.id === sourceHandle) : undefined;
  const targetPort = targetDef ? resolvePorts(targetDef, targetNode.params).find((port) => port.id === targetHandle) : undefined;
  if (!sourcePort || !targetPort) return { ok: false, code: 'missing-port' };
  if (sourcePort.terminal === 'signal' || targetPort.terminal === 'signal') {
    if (sourceDef?.id === 'mixer' || targetDef?.id === 'mixer') return { ok: false, code: 'mixer-manual' };
    const fromThermo = sourceDef?.id === 'thermostat' && sourcePort.id === 'sig';
    const toValve = targetDef?.id === 'valve-3way' && targetPort.id === 'ctl';
    const toZone = targetDef?.id === 'valve' && targetPort.id === 'ctl';
    const toPump = targetDef?.id === 'pump' && targetPort.id === 'ctl';
    const toHeatPump = targetDef?.id === 'heat-pump' && targetPort.id === 'ctl';
    if (!fromThermo || (!toValve && !toZone && !toPump && !toHeatPump)) return { ok: false, code: 'signal-pair' };
    return { ok: true };
  }
  const combined = [
    ...floodTerminals(nodes, edges, { nodeId: source, portId: sourceHandle }),
    ...floodTerminals(nodes, edges, { nodeId: target, portId: targetHandle }),
  ];
  const code = diagnose(combined);
  if (code) return { ok: false, code };
  return { ok: true };
}

export function portTint(nodes: GraphNode[], edges: GraphEdge[], nodeId: string, portId: string): CircuitTint {
  const node = nodes.find((item) => item.id === nodeId);
  const def = node ? getComponent(node.componentId) : undefined;
  const port = def && node ? resolvePorts(def, node.params).find((item) => item.id === portId) : undefined;
  if (!port) return 'neutral';
  if (port.side === 'supply') return 'supply';
  if (port.side === 'return') return 'return';
  const hits = floodTerminals(nodes, edges, { nodeId, portId });
  const supply = hits.some((item) => SUPPLY.has(item.terminal));
  const ret = hits.some((item) => RETURN.has(item.terminal));
  if (supply && ret) return 'mixed';
  if (supply) return 'supply';
  if (ret) return 'return';
  return 'neutral';
}
