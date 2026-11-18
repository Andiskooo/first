import { defaultParams, getComponent } from '@/components/studio/registry';
import type { GraphEdge, GraphNode } from '@/components/studio/types';

export type ExampleKind = 'direct' | 'buffer' | 'control';

export interface PlacedNode extends GraphNode {
  x: number;
  y: number;
  rotation: number;
}

function place(
  id: string,
  componentId: string,
  x: number,
  y: number,
  params: Record<string, number> = {},
): PlacedNode {
  const def = getComponent(componentId);
  if (!def) throw new Error(`Unknown component ${componentId}`);
  return {
    id,
    componentId,
    x,
    y,
    rotation: 0,
    params: { ...defaultParams(def), ...params },
  };
}

function edge(id: string, source: string, sourceHandle: string, target: string, targetHandle: string, kind: GraphEdge['kind'] = 'pipe'): GraphEdge {
  return { id, source, target, sourceHandle, targetHandle, kind };
}

/** Closed heat-pump → pump → two parallel consumers circuit. */
function directExample(): { nodes: PlacedNode[]; edges: GraphEdge[] } {
  return {
    nodes: [
      place('hp', 'heat-pump', 40, 180, { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 }),
      place('p', 'pump', 300, 172, { speed: 80 }),
      place('ts', 'tee', 470, 186),
      place('hk', 'radiator', 680, 80, { demand: 4 }),
      place('fbh', 'underfloor', 680, 340, { demand: 3 }),
      place('tr', 'tee', 470, 400),
    ],
    edges: [
      edge('e-hp-p', 'hp', 'supply-out', 'p', 'in'),
      edge('e-p-ts', 'p', 'out', 'ts', 'a'),
      edge('e-ts-hk', 'ts', 'b', 'hk', 'supply-in'),
      edge('e-ts-fbh', 'ts', 'c', 'fbh', 'supply-in'),
      edge('e-hk-tr', 'hk', 'return-out', 'tr', 'b'),
      edge('e-fbh-tr', 'fbh', 'return-out', 'tr', 'c'),
      edge('e-tr-hp', 'tr', 'a', 'hp', 'return-in'),
    ],
  };
}

/**
 * Heat pump and primary pump on the left of a buffer, circulation pump and
 * two consumers on the right. One mixed tank couples the loops.
 */
function bufferExample(): { nodes: PlacedNode[]; edges: GraphEdge[] } {
  return {
    nodes: [
      place('hp', 'heat-pump', 40, 188, { capacity: 12, setpoint: 45, internalPump: 1, internalSpeed: 100 }),
      place('p1', 'pump', 290, 168, { speed: 70 }),
      place('ps', 'buffer-tank', 470, 80, { volume: 200 }),
      place('p2', 'pump', 760, 70, { speed: 55 }),
      place('ts', 'tee', 940, 84),
      place('hk', 'radiator', 1160, 20, { demand: 5 }),
      place('fbh', 'underfloor', 1160, 300, { demand: 3 }),
      place('tr', 'tee', 940, 390),
    ],
    edges: [
      edge('e-hp-p1', 'hp', 'supply-out', 'p1', 'in'),
      edge('e-p1-ps', 'p1', 'out', 'ps', 'pri-in'),
      edge('e-ps-hp', 'ps', 'pri-out', 'hp', 'return-in'),
      edge('e-ps-p2', 'ps', 'sec-out-1', 'p2', 'in'),
      edge('e-p2-ts', 'p2', 'out', 'ts', 'a'),
      edge('e-ts-hk', 'ts', 'b', 'hk', 'supply-in'),
      edge('e-ts-fbh', 'ts', 'c', 'fbh', 'supply-in'),
      edge('e-hk-tr', 'hk', 'return-out', 'tr', 'b'),
      edge('e-fbh-tr', 'fbh', 'return-out', 'tr', 'c'),
      edge('e-tr-ps', 'tr', 'a', 'ps', 'sec-in-1'),
    ],
  };
}

/** One three-way valve. The thermostat sends all flow to A, or to B when ambient is above the setpoint. */
function controlExample(): { nodes: PlacedNode[]; edges: GraphEdge[] } {
  return {
    nodes: [
      place('hp', 'heat-pump', 20, 160, { capacity: 12, setpoint: 45, internalPump: 0, internalSpeed: 0 }),
      place('p', 'pump', 280, 190, { speed: 70 }),
      place('rt', 'thermostat', 430, 20, { roomSet: 21, ambient: 16 }),
      place('v3', 'valve-3way', 460, 150),
      place('hk', 'radiator', 700, 60, { demand: 4 }),
      place('fbh', 'underfloor', 700, 300, { demand: 3 }),
      place('tr', 'tee', 480, 430),
    ],
    edges: [
      edge('e-hp-p', 'hp', 'supply-out', 'p', 'in'),
      edge('e-p-v3', 'p', 'out', 'v3', 'ab'),
      edge('e-v3-hk', 'v3', 'a', 'hk', 'supply-in'),
      edge('e-v3-fbh', 'v3', 'b', 'fbh', 'supply-in'),
      edge('e-hk-tr', 'hk', 'return-out', 'tr', 'b'),
      edge('e-fbh-tr', 'fbh', 'return-out', 'tr', 'c'),
      edge('e-tr-hp', 'tr', 'a', 'hp', 'return-in'),
      edge('s-rt', 'rt', 'sig', 'v3', 'ctl', 'signal'),
    ],
  };
}

export function buildExample(kind: ExampleKind): { nodes: PlacedNode[]; edges: GraphEdge[] } {
  if (kind === 'buffer') return bufferExample();
  if (kind === 'control') return controlExample();
  return directExample();
}
