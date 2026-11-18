'use client';

import { useContext } from 'react';
import { Handle, useStore, type Node, type NodeProps } from '@xyflow/react';
import { useLanguage } from '@/components/LanguageProvider';
import { getComponent } from '@/components/studio/registry';
import { portPlacement } from '@/components/studio/geometry';
import { ComponentArt, portColor } from '@/components/studio/symbols';
import { useStudioCopy } from '@/components/studio/copy';
import { portTint } from '@/components/studio/validation';
import { StudioViewContext } from '@/components/studio/viewContext';
import type { StudioNodeData } from '@/components/studio/flowTypes';
import type { GraphEdge, GraphNode } from '@/components/studio/types';
import { cn } from '@/lib/utils';

export type HydronicFlowNode = Node<StudioNodeData, 'hydronic'>;

export function HydronicNode({ id, data, selected }: NodeProps<HydronicFlowNode>) {
  const def = getComponent(data.componentId);
  const { locale } = useLanguage();
  const text = useStudioCopy();
  const view = useContext(StudioViewContext);
  const rfNodes = useStore((state) => state.nodes);
  const rfEdges = useStore((state) => state.edges);
  if (!def) return null;

  const graphNodes: GraphNode[] = rfNodes.map((node) => {
    const nodeData = node.data as StudioNodeData;
    return { id: node.id, componentId: nodeData.componentId, params: nodeData.params ?? {} };
  });
  const graphEdges: GraphEdge[] = rfEdges.flatMap((edge) => (
    edge.sourceHandle && edge.targetHandle
      ? [{ id: edge.id, source: edge.source, target: edge.target, sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle }]
      : []
  ));
  const sim = view.showThermo ? view.result?.nodes[id] : undefined;
  const rotation = data.rotation ?? 0;

  return (
    <div className="relative h-full w-full overflow-visible">
      <div
        className={cn(
          'absolute left-1/2 top-1/2',
          selected && 'rounded-md ring-2 ring-blue-600 ring-offset-2',
        )}
        style={{ width: def.width, height: def.height, transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
      >
        <ComponentArt def={def} tIn={sim?.tIn} tOut={sim?.tOut} active={Boolean(sim)} />
      </div>
      {def.ports.map((port) => {
        const place = portPlacement(def.width, def.height, port.x, port.y, rotation);
        const tint = portTint(graphNodes, graphEdges, id, port.id);
        const used = graphEdges.some((edge) =>
          (edge.source === id && edge.sourceHandle === port.id) ||
          (edge.target === id && edge.targetHandle === port.id));
        const title = text.ports[port.terminal] ?? port.id;
        return (
          <Handle
            key={port.id}
            id={port.id}
            type={port.direction === 'in' ? 'target' : 'source'}
            position={place.position}
            title={title}
            isConnectable
            className="!border-2 !border-white"
            style={{
              ...place.style,
              width: 14,
              height: 14,
              background: portColor(tint),
              transform: 'translate(-50%, -50%)',
              boxShadow: !used && port.required ? '0 0 0 3px #fbbf24' : '0 0 0 1px rgba(15,23,42,0.28)',
              zIndex: 6,
            }}
          />
        );
      })}
      <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] leading-4 shadow-sm">
        <span className="font-semibold text-slate-900">{def.code}</span>
        <span className="text-slate-500"> {def.name[locale]}</span>
      </div>
    </div>
  );
}

export const hydronicNodeTypes = { hydronic: HydronicNode };
