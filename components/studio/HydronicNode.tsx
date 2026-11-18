'use client';

import { useContext } from 'react';
import { Handle, useStore, type Node, type NodeProps } from '@xyflow/react';
import { useLanguage } from '@/components/LanguageProvider';
import { componentBox, getComponent, resolvePorts } from '@/components/studio/registry';
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
      ? [{
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        kind: edge.type === 'signal' ? 'signal' as const : 'pipe' as const,
      }]
      : []
  ));
  const sim = view.result?.nodes[id];
  const showState = view.showThermo || def.id === 'thermostat' || def.category === 'valve';
  const rotation = data.rotation ?? 0;
  const box = componentBox(def, data.params);
  const ports = resolvePorts(def, data.params);
  const drawn = { ...def, width: box.width, height: box.height, ports };
  const opening = sim?.opening;

  return (
    <div className="relative h-full w-full overflow-visible">
      <div
        className={cn(
          'absolute left-1/2 top-1/2',
          selected && 'rounded-md ring-2 ring-blue-600 ring-offset-2',
        )}
        style={{ width: box.width, height: box.height, transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
      >
        <ComponentArt def={drawn} tIn={sim?.roomC ?? sim?.tIn} tOut={sim?.tOut} active={Boolean(showState && sim)} />
      </div>
      {ports.map((port) => {
        const place = portPlacement(box.width, box.height, port.x, port.y, rotation);
        const tint = port.terminal === 'signal' ? 'signal' as const : portTint(graphNodes, graphEdges, id, port.id);
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
              width: port.terminal === 'signal' ? 11 : 14,
              height: port.terminal === 'signal' ? 11 : 14,
              borderRadius: port.terminal === 'signal' ? 2 : 999,
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
        {opening != null ? (
          <span className={cn('ml-1 font-semibold', opening < 0.05 ? 'text-slate-400' : 'text-violet-700')}>
            {opening < 0.05 ? text.closed : opening > 0.95 ? text.open : `${Math.round(opening * 100)}%`}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export const hydronicNodeTypes = { hydronic: HydronicNode };
