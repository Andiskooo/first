'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  ConnectionLineType,
  ConnectionMode,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useUpdateNodeInternals,
  type Connection,
  type Edge,
  type Node,
  type OnConnectEnd,
} from '@xyflow/react';
import { Pause, Play, RotateCcw, Trash2 } from 'lucide-react';
import '@xyflow/react/dist/style.css';

import { buildExample, type ExampleKind } from '@/components/studio/example';
import { defaultParams, getComponent } from '@/components/studio/registry';
import { simulate } from '@/components/studio/simulation';
import { validateConnection } from '@/components/studio/validation';
import { resetDistances, setEdgeSpeeds, stopClock } from '@/components/studio/clock';
import { messageOf, useStudioCopy } from '@/components/studio/copy';
import { hydronicNodeTypes, type HydronicFlowNode } from '@/components/studio/HydronicNode';
import { hydronicEdgeTypes } from '@/components/studio/HydronicEdge';
import { Library } from '@/components/studio/Library';
import { PropertiesPanel } from '@/components/studio/PropertiesPanel';
import { StudioViewContext } from '@/components/studio/viewContext';
import type { StudioNodeData } from '@/components/studio/flowTypes';
import type { GraphEdge, GraphNode } from '@/components/studio/types';
import { cn } from '@/lib/utils';

type Phase = 'idle' | 'running' | 'paused';
type MobilePanel = 'library' | 'canvas' | 'props';

const SNAP = 20;

function toGraph(nodes: Node[], edges: Edge[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  return {
    nodes: nodes.map((node) => {
      const data = node.data as StudioNodeData;
      return { id: node.id, componentId: data.componentId, params: data.params ?? {} };
    }),
    edges: edges.flatMap((edge) => (
      edge.sourceHandle && edge.targetHandle
        ? [{ id: edge.id, source: edge.source, target: edge.target, sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle }]
        : []
    )),
  };
}

export default function StudioApp() {
  return (
    <ReactFlowProvider>
      <StudioShell />
    </ReactFlowProvider>
  );
}

function StudioShell() {
  const text = useStudioCopy();
  const [nodes, setNodes, onNodesChange] = useNodesState<HydronicFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [panel, setPanel] = useState<MobilePanel>('canvas');
  const [armed, setArmed] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const graphRef = useRef({ nodes, edges });
  const rejectRef = useRef<string | null>(null);
  const seq = useRef(1);
  const { screenToFlowPosition, fitView, deleteElements } = useReactFlow();
  const updateInternals = useUpdateNodeInternals();
  graphRef.current = { nodes, edges };

  const result = useMemo(
    () => simulate(toGraph(nodes, edges).nodes, toGraph(nodes, edges).edges),
    [nodes, edges],
  );
  const showThermo = phase !== 'idle';
  const running = phase === 'running';
  const view = useMemo(() => ({ showThermo, result }), [showThermo, result]);
  const selected = nodes.find((node) => node.selected) ?? null;

  useEffect(() => {
    const speeds = new Map<string, number>();
    if (running) {
      for (const [id, edge] of Object.entries(result.edges)) {
        if (edge.flowLph > 1) speeds.set(id, 24 + 140 * Math.min(edge.flowLph / 700, 1.8));
      }
    }
    setEdgeSpeeds(speeds, running);
  }, [running, result]);

  useEffect(() => () => stopClock(), []);

  const addPart = useCallback((componentId: string, x: number, y: number) => {
    const def = getComponent(componentId);
    if (!def) return;
    const position = {
      x: Math.round((x - def.width / 2) / SNAP) * SNAP,
      y: Math.round((y - def.height / 2) / SNAP) * SNAP,
    };
    const id = `${def.code}-${seq.current++}`;
    const node: HydronicFlowNode = {
      id,
      type: 'hydronic',
      position,
      data: { componentId, params: defaultParams(def), rotation: 0 },
      style: { width: def.width, height: def.height },
      className: 'overflow-visible',
    };
    setNodes((current) => current.concat(node));
  }, [setNodes]);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    const componentId = event.dataTransfer.getData('application/x-ecotek-part') || event.dataTransfer.getData('text/plain');
    if (!componentId || !getComponent(componentId)) return;
    const point = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    addPart(componentId, point.x, point.y);
    setArmed(null);
  }, [addPart, screenToFlowPosition]);

  const isValid = useCallback((connection: Connection | Edge) => {
    const graph = toGraph(graphRef.current.nodes, graphRef.current.edges);
    const verdict = validateConnection(
      graph.nodes,
      graph.edges,
      connection.source ?? '',
      connection.sourceHandle,
      connection.target ?? '',
      connection.targetHandle,
    );
    rejectRef.current = verdict.ok ? null : verdict.code;
    return verdict.ok;
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    const graph = toGraph(graphRef.current.nodes, graphRef.current.edges);
    const verdict = validateConnection(
      graph.nodes,
      graph.edges,
      connection.source ?? '',
      connection.sourceHandle,
      connection.target ?? '',
      connection.targetHandle,
    );
    if (!verdict.ok) {
      setHint(verdict.code);
      return;
    }
    setHint(null);
    setEdges((current) => addEdge({ ...connection, id: `e-${crypto.randomUUID()}`, type: 'hydronic' }, current));
  }, [setEdges]);

  const onConnectEnd: OnConnectEnd = useCallback(() => {
    if (rejectRef.current) {
      setHint(rejectRef.current);
      rejectRef.current = null;
    }
  }, []);

  const loadExample = useCallback((kind: ExampleKind) => {
    const example = buildExample(kind);
    seq.current = 40;
    setNodes(example.nodes.map((node) => {
      const def = getComponent(node.componentId)!;
      return {
        id: node.id,
        type: 'hydronic' as const,
        position: { x: node.x, y: node.y },
        data: { componentId: node.componentId, params: node.params, rotation: 0 },
        style: { width: def.width, height: def.height },
        className: 'overflow-visible',
      };
    }));
    setEdges(example.edges.map((edge) => ({ ...edge, type: 'hydronic' as const })));
    setPhase('idle');
    setHint(null);
    setArmed(null);
    resetDistances();
    requestAnimationFrame(() => fitView({ padding: 0.16, duration: 280 }));
  }, [fitView, setEdges, setNodes]);

  const rotate = useCallback((id: string) => {
    setNodes((current) => current.map((node) => {
      if (node.id !== id) return node;
      const def = getComponent(node.data.componentId);
      if (!def?.rotatable) return node;
      const rotation = (node.data.rotation + 90) % 360;
      const turned = rotation === 90 || rotation === 270;
      return {
        ...node,
        data: { ...node.data, rotation },
        style: { width: turned ? def.height : def.width, height: turned ? def.width : def.height },
      };
    }));
    requestAnimationFrame(() => updateInternals(id));
  }, [setNodes, updateInternals]);

  const reversePump = useCallback((id: string) => {
    const swap = (handle: string | null | undefined) => (handle === 'in' ? 'out' : handle === 'out' ? 'in' : handle);
    setEdges((current) => current.map((edge) => {
      if (edge.source === id) return { ...edge, sourceHandle: swap(edge.sourceHandle) };
      if (edge.target === id) return { ...edge, targetHandle: swap(edge.targetHandle) };
      return edge;
    }));
  }, [setEdges]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) return;
      if (event.key === 'Escape') setArmed(null);
      if ((event.key === 'r' || event.key === 'R') && selected && getComponent(selected.data.componentId)?.rotatable) {
        event.preventDefault();
        rotate(selected.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [rotate, selected]);

  const issue = result.issues.find((item) => item.level === 'warn' || item.level === 'error')
    ?? result.issues.find((item) => item.level === 'info');
  const status = nodes.length === 0
    ? null
    : hint
      ? messageOf(text, hint)
      : issue
        ? messageOf(text, issue.code)
        : result.ok && showThermo
          ? null
          : text.startHint;

  return (
    <StudioViewContext.Provider value={view}>
      <div className="flex h-full min-h-0 flex-col bg-[#f4f1ec] text-slate-900">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2">
          <p className="mr-1 text-sm font-semibold">{text.title}</p>
          <button type="button" onClick={() => setPhase('running')} aria-pressed={running} className={cn('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white', running ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700')}>
            <Play className="h-4 w-4" aria-hidden /> {text.run}
          </button>
          <button type="button" onClick={() => setPhase((current) => (current === 'running' ? 'paused' : current))} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50">
            <Pause className="h-4 w-4" aria-hidden /> {text.pause}
          </button>
          <button type="button" onClick={() => { setPhase('idle'); resetDistances(); }} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50">
            <RotateCcw className="h-4 w-4" aria-hidden /> {text.reset}
          </button>
          <span className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />
          <button type="button" onClick={() => loadExample('direct')} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50">{text.exampleDirect}</button>
          <button type="button" onClick={() => loadExample('buffer')} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50">{text.exampleBuffer}</button>
          <button type="button" onClick={() => { setNodes([]); setEdges([]); setPhase('idle'); setHint(null); resetDistances(); }} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-50">
            <Trash2 className="h-4 w-4" aria-hidden /> {text.clear}
          </button>
          <p className="ml-auto hidden text-xs text-slate-500 xl:block">{text.disclaimer}</p>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className={cn('min-h-0', panel === 'library' ? 'flex w-full' : 'hidden', 'lg:flex lg:w-auto')}>
            <Library
              armedId={armed}
              onArm={(id) => {
                setArmed((current) => (current === id ? null : id));
                if (window.matchMedia('(max-width: 1023px)').matches) setPanel('canvas');
              }}
            />
          </div>

          <div
            className={cn('relative min-h-0 min-w-0 flex-1', panel === 'canvas' ? 'flex' : 'hidden', 'lg:flex')}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onConnectEnd={onConnectEnd}
              isValidConnection={isValid}
              nodeTypes={hydronicNodeTypes}
              edgeTypes={hydronicEdgeTypes}
              connectionMode={ConnectionMode.Loose}
              connectionLineType={ConnectionLineType.SmoothStep}
              connectionRadius={28}
              snapToGrid
              snapGrid={[SNAP, SNAP]}
              fitView={false}
              minZoom={0.25}
              maxZoom={2}
              panOnScroll
              selectionOnDrag={false}
              deleteKeyCode={['Backspace', 'Delete']}
              proOptions={{ hideAttribution: false }}
              colorMode="light"
              className="studio-flow"
              onPaneClick={(event) => {
                if (!armed) return;
                const point = screenToFlowPosition({ x: event.clientX, y: event.clientY });
                addPart(armed, point.x, point.y);
                setArmed(null);
              }}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#d6d3d1" />
              <Controls showInteractive={false} position="bottom-left" />
            </ReactFlow>

            {nodes.length === 0 ? (
              <div className="pointer-events-none absolute inset-0 grid place-items-center p-6">
                <div className="max-w-sm rounded-2xl border border-slate-200 bg-white/95 px-6 py-5 text-center shadow-sm">
                  <p className="font-semibold">{text.emptyTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text.emptyBody}</p>
                </div>
              </div>
            ) : null}

            {armed ? (
              <div className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm shadow-sm">
                <span>{text.armed}</span>
                <button type="button" onClick={() => setArmed(null)} className="font-medium text-blue-700">{text.cancel}</button>
              </div>
            ) : null}

            {status ? (
              <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex justify-center" aria-live="polite">
                <p className={cn(
                  'pointer-events-auto max-w-xl rounded-xl border px-3 py-2 text-sm shadow-sm',
                  hint || issue ? 'border-amber-200 bg-amber-50 text-amber-950' : 'border-slate-200 bg-white/95 text-slate-600',
                  armed && 'mt-12',
                )}>{status}</p>
              </div>
            ) : null}
          </div>

          <div className={cn('min-h-0', panel === 'props' ? 'flex w-full' : 'hidden', 'lg:flex lg:w-auto')}>
            <PropertiesPanel
              selected={selected}
              result={result}
              showThermo={showThermo}
              onParam={(id, key, value) => {
                setNodes((current) => current.map((node) => (
                  node.id === id
                    ? { ...node, data: { ...node.data, params: { ...node.data.params, [key]: value } } }
                    : node
                )));
              }}
              onRotate={rotate}
              onReversePump={reversePump}
              onRemove={(id) => { void deleteElements({ nodes: [{ id }] }); }}
            />
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-3 border-t border-slate-200 bg-white lg:hidden">
          {([
            ['library', text.library],
            ['canvas', text.canvas],
            ['props', text.properties],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPanel(id)}
              aria-pressed={panel === id}
              className={cn('py-3 text-sm font-medium', panel === id ? 'text-blue-700' : 'text-slate-500')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </StudioViewContext.Provider>
  );
}
