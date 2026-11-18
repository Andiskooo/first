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
  const thermostatLinked = (def.id === 'valve-3way' || def.id === 'valve') && graphEdges.some((edge) => edge.kind === 'signal' && edge.target === id && edge.targetHandle === 'ctl');
  const manualMode = (def.id === 'valve-3way' || def.id === 'valve') && (!thermostatLinked || (data.params?.controlMode ?? 0) >= 0.5);
  const zoneOpen = def.id === 'valve' && (opening != null ? opening >= 0.05 : (data.params?.manualOpen ?? 1) >= 0.5);
  const livePortB = def.id === 'valve-3way' && (opening != null ? opening >= 0.5 : (data.params?.manualPort ?? 0) >= 0.5);
  const pumpLinked = (def.id === 'pump' || def.id === 'heat-pump') && graphEdges.some((edge) => edge.kind === 'signal' && edge.target === id && edge.targetHandle === 'ctl');
  const pumpOn = (opening ?? 1) >= 0.5;

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
      {def.id === 'valve-3way' ? (
        <button
          type="button"
          data-valve-toggle={livePortB ? 'B' : 'A'}
          aria-label={text.togglePort}
          className="nodrag nopan absolute left-1/2 top-[46%] z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold leading-none text-violet-800 shadow-sm"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            view.toggleThreeWay(id);
          }}
        >
          {livePortB ? 'B' : 'A'}
        </button>
      ) : null}
      {def.id === 'valve' ? (
        <button
          type="button"
          data-valve-toggle={zoneOpen ? 'open' : 'closed'}
          aria-label={zoneOpen ? text.open : text.closed}
          className="nodrag nopan absolute left-1/2 top-[62%] z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-300 bg-white px-1.5 py-0.5 text-[10px] font-semibold leading-none text-violet-800 shadow-sm"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            view.toggleTwoWay(id);
          }}
        >
          {zoneOpen ? text.open : text.closed}
        </button>
      ) : null}
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
            className={port.terminal === 'signal' ? 'studio-port studio-port-signal !border-2 !border-white' : 'studio-port !border-2 !border-white'}
            style={{
              ...place.style,
              borderRadius: port.terminal === 'signal' ? 2 : 999,
              background: portColor(tint),
              transform: 'translate(-50%, -50%)',
              boxShadow: def.id === 'valve-3way' && port.id === (opening != null && opening >= 0.5 ? 'b' : 'a')
                ? '0 0 0 3px #7c3aed'
                : !used && port.required ? '0 0 0 3px #fbbf24' : '0 0 0 1px rgba(15,23,42,0.28)',
              zIndex: 6,
            }}
          />
        );
      })}
      <div className="studio-node-label pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] leading-4 shadow-sm">
        <span className="font-semibold text-slate-900">{def.code}</span>
        <span className="text-slate-500"> {def.name[locale]}</span>
        {def.id === 'valve-3way' ? (
          <span className="ml-1 font-semibold text-violet-700">
            {manualMode ? text.modeManual : text.modeAuto}
            {' · '}
            {livePortB ? text.portB : text.portA}
          </span>
        ) : def.id === 'valve' ? (
          <span className={cn('ml-1 font-semibold', zoneOpen ? 'text-violet-700' : 'text-slate-400')}>
            {thermostatLinked ? `${manualMode ? text.modeManual : text.modeAuto} · ` : ''}
            {zoneOpen ? text.open : text.closed}
            {opening != null && opening >= 0.05 && opening <= 0.95 ? ` · ${Math.round(opening * 100)}%` : ''}
          </span>
        ) : (def.id === 'pump' || def.id === 'heat-pump') && pumpLinked ? (
          <span className={cn('ml-1 font-semibold', pumpOn ? 'text-violet-700' : 'text-slate-400')}>
            {pumpOn ? text.pumpOn : text.pumpOff}
          </span>
        ) : def.id === 'mixer' ? (
          <span className="ml-1 font-semibold text-orange-700">
            {Math.round((data.params?.mix ?? (opening != null ? opening * 100 : 50)))}% {text.hot}
            {view.showThermo && sim && Number.isFinite(sim.tOut) ? ` · ${Math.round(sim.tOut)}°C` : ''}
          </span>
        ) : opening != null ? (
          <span className={cn('ml-1 font-semibold', opening < 0.05 ? 'text-slate-400' : 'text-violet-700')}>
            {opening < 0.05 ? text.closed : opening > 0.95 ? text.open : `${Math.round(opening * 100)}%`}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export const hydronicNodeTypes = { hydronic: HydronicNode };
