'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  ReactFlow,
  ReactFlowProvider,
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
import { ChevronDown, PanelLeft, Pause, Play, RotateCcw, Trash2 } from 'lucide-react';
import '@xyflow/react/dist/style.css';

import { computeOpenings } from '@/components/studio/control';
import { buildExample, type ExampleKind } from '@/components/studio/example';
import { componentBox, getComponent, isBufferId, isHeatPumpId, resolvePorts } from '@/components/studio/registry';
import { SNAP, createPlacedPart, droppedPartId, markPartDropped } from '@/components/studio/place';
import { T_ROOM, chargeBuffer } from '@/components/studio/simulation';
import { simulate } from '@/components/studio/simulation';
import { validateConnection } from '@/components/studio/validation';
import { resetDistances, setEdgeSpeeds, stopClock } from '@/components/studio/clock';
import { messageOf, useStudioCopy } from '@/components/studio/copy';
import { hydronicNodeTypes, type HydronicFlowNode } from '@/components/studio/HydronicNode';
import { StudioBackground } from '@/components/studio/StudioBackground';
import { hydronicEdgeTypes } from '@/components/studio/HydronicEdge';
import { Library } from '@/components/studio/Library';
import { PropertiesPanel, SimChip } from '@/components/studio/PropertiesPanel';
import { StudioViewContext } from '@/components/studio/viewContext';
import type { StudioNodeData } from '@/components/studio/flowTypes';
import type { GraphEdge, GraphNode } from '@/components/studio/types';
import { cn } from '@/lib/utils';

const fitPadding = { top: '132px', right: 0.05, bottom: '72px', left: 0.04 } as const;

type Phase = 'idle' | 'running' | 'paused';
type MobilePanel = 'library' | 'canvas' | 'props';

function ExamplesMenu({ onPick }: { onPick: (kind: ExampleKind) => void }) {
  const text = useStudioCopy();
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && (ref.current?.contains(target) || menuRef.current?.contains(target))) return;
      setOpen(false);
    };
    const id = window.setTimeout(() => window.addEventListener('pointerdown', close), 0);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('pointerdown', close);
    };
  }, [open]);
  const items: { kind: ExampleKind; label: string }[] = [
    { kind: 'direct', label: text.exampleDirect },
    { kind: 'buffer', label: text.exampleBuffer },
    { kind: 'control', label: text.exampleControl },
    { kind: 'mix', label: text.exampleMix },
  ];
  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          const rect = ref.current?.getBoundingClientRect();
          if (rect) setBox({ x: rect.left, y: rect.bottom });
          setOpen((current) => !current);
        }}
        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white font-medium hover:bg-slate-50"
      >
        {text.examples}
        <ChevronDown className="h-3.5 w-3.5" aria-hidden />
      </button>
      {open && box && typeof document !== 'undefined' ? createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed z-50 min-w-44 rounded-md border border-slate-200 bg-white py-1 shadow-md"
          style={{ left: box.x, top: box.y + 4 }}
        >
          {items.map((item) => (
            <button
              key={item.kind}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onPick(item.kind);
              }}
              className="block w-full px-3 py-1.5 text-left text-xs font-medium text-slate-800 hover:bg-slate-50"
            >
              {item.label}
            </button>
          ))}
        </div>,
        document.body,
      ) : null}
    </div>
  );
}

function toGraph(nodes: Node[], edges: Edge[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  return {
    nodes: nodes.map((node) => {
      const data = node.data as StudioNodeData;
      return { id: node.id, componentId: data.componentId, params: data.params ?? {} };
    }),
    edges: edges.flatMap((edge) => (
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
  const [tankC, setTankC] = useState<number | null>(null);
  const [present, setPresent] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [coarse, setCoarse] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef({ nodes, edges });
  const rejectRef = useRef<string | null>(null);
  const heldRef = useRef<Record<string, number>>({});
  const resultRef = useRef<ReturnType<typeof simulate> | null>(null);
  const seq = useRef(1);
  const { screenToFlowPosition, fitView, deleteElements, setViewport } = useReactFlow();
  const updateInternals = useUpdateNodeInternals();
  graphRef.current = { nodes, edges };

  const graph = useMemo(() => toGraph(nodes, edges), [nodes, edges]);
  const openings = useMemo(
    () => computeOpenings({ nodes: graph.nodes, edges: graph.edges, held: heldRef.current, result: resultRef.current }),
    [graph],
  );
  const result = useMemo(
    () => simulate(graph.nodes, graph.edges, openings, tankC == null ? {} : { tankC }),
    [graph, openings, tankC],
  );
  const showThermo = phase !== 'idle';
  const running = phase === 'running';
  const toggleThreeWay = useCallback((id: string) => {
    setNodes((current) => current.map((node) => {
      const selected = node.id === id;
      if (!selected) return node.selected ? { ...node, selected: false } : node;
      if (node.data.componentId !== 'valve-3way') return { ...node, selected: true };
      const linked = edges.some((edge) => edge.type === 'signal' && edge.target === id);
      const live = (resultRef.current?.nodes[id]?.opening ?? 0) >= 0.5 ? 1 : 0;
      return {
        ...node,
        selected: true,
        data: {
          ...node.data,
          params: {
            ...node.data.params,
            manualPort: live === 1 ? 0 : 1,
            controlMode: linked ? 1 : (node.data.params.controlMode ?? 0),
          },
        },
      };
    }));
  }, [edges, setNodes]);
  const toggleTwoWay = useCallback((id: string) => {
    setNodes((current) => current.map((node) => {
      const selected = node.id === id;
      if (!selected) return node.selected ? { ...node, selected: false } : node;
      if (node.data.componentId !== 'valve') return { ...node, selected: true };
      const linked = edges.some((edge) => edge.type === 'signal' && edge.target === id);
      const liveOpen = (resultRef.current?.nodes[id]?.opening ?? 1) >= 0.05;
      return {
        ...node,
        selected: true,
        data: {
          ...node.data,
          params: {
            ...node.data.params,
            manualOpen: liveOpen ? 0 : 1,
            controlMode: linked ? 1 : (node.data.params.controlMode ?? 0),
          },
        },
      };
    }));
  }, [edges, setNodes]);
  const view = useMemo(() => ({ showThermo, result, toggleThreeWay, toggleTwoWay }), [showThermo, result, toggleThreeWay, toggleTwoWay]);
  const selectedEdge = edges.find((edge) => edge.selected) ?? null;
  const selected = selectedEdge ? null : (nodes.find((node) => node.selected) ?? null);

  useEffect(() => {
    const speeds = new Map<string, number>();
    if (running) {
      for (const [id, edge] of Object.entries(result.edges)) {
        if (edge.flowLph > 1) speeds.set(id, 24 + 140 * Math.min(edge.flowLph / 700, 1.8));
      }
    }
    setEdgeSpeeds(speeds, running);
  }, [running, result]);

  useEffect(() => {
    heldRef.current = openings;
    resultRef.current = result;
  }, [openings, result]);

  useEffect(() => {
    if (phase === 'idle') {
      heldRef.current = {};
      setTankC(null);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'running' || !result.primaryIdle) return;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.2, (now - last) / 1000);
      last = now;
      const hp = graphRef.current.nodes.find((node) => isHeatPumpId(node.data.componentId));
      const tank = graphRef.current.nodes.find((node) => isBufferId(node.data.componentId));
      setTankC((current) => chargeBuffer(
        current ?? T_ROOM,
        hp?.data.params.setpoint ?? 45,
        resultRef.current?.primaryFlowLph ?? 0,
        hp?.data.params.capacity ?? 12,
        tank?.data.params.volume ?? 200,
        dt,
      ));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, result.primaryIdle]);

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    const apply = () => setCoarse(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const width = window.innerWidth;
    const zoom = width < 800 ? 1 : Math.min(1.65, Math.max(1.25, width / 1200));
    void setViewport({ x: 40, y: 24, zoom });
  }, [setViewport]);

  useEffect(() => {
    const onFull = () => requestAnimationFrame(() => fitView({ padding: fitPadding, duration: 180 }));
    document.addEventListener('fullscreenchange', onFull);
    return () => document.removeEventListener('fullscreenchange', onFull);
  }, [fitView]);

  useEffect(() => () => stopClock(), []);

  const addPart = useCallback((componentId: string, x: number, y: number) => {
    const placed = createPlacedPart(componentId, x, y, seq.current);
    if (!placed) return;
    seq.current += 1;
    const node: HydronicFlowNode = {
      id: placed.id,
      type: 'hydronic',
      position: { x: placed.x, y: placed.y },
      data: { componentId: placed.componentId, params: placed.params, rotation: 0, size: { width: placed.width, height: placed.height } },
      style: { width: placed.width, height: placed.height },
      className: 'overflow-visible',
    };
    setNodes((current) => current.concat(node));
  }, [setNodes]);

  const allowPartDrop = useCallback((event: DragEvent) => {
    const types = event.dataTransfer?.types;
    const list = types ? Array.from(types) : [];
    if (list.length && !list.includes('application/x-ecotek-part') && !list.includes('text/plain')) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: DragEvent) => {
    event.preventDefault();
    const componentId = droppedPartId(event.dataTransfer);
    if (!componentId) return;
    const point = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    addPart(componentId, point.x, point.y);
    markPartDropped();
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
    const sourceNode = graphRef.current.nodes.find((node) => node.id === connection.source);
    const sourceDef = sourceNode ? getComponent(sourceNode.data.componentId) : undefined;
    const sourcePort = sourceDef ? resolvePorts(sourceDef, sourceNode?.data.params).find((port) => port.id === connection.sourceHandle) : undefined;
    const signal = sourcePort?.terminal === 'signal';
    setEdges((current) => addEdge({ ...connection, id: `e-${crypto.randomUUID()}`, type: signal ? 'signal' : 'hydronic' }, current));
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
      const box = componentBox(def, node.params);
      return {
        id: node.id,
        type: 'hydronic' as const,
        position: { x: node.x, y: node.y },
        data: { componentId: node.componentId, params: node.params, rotation: 0, size: { width: box.width, height: box.height } },
        style: { width: box.width, height: box.height },
        className: 'overflow-visible',
      };
    }));
    setEdges(example.edges.map((edge) => ({ ...edge, type: edge.kind === 'signal' ? 'signal' as const : 'hydronic' as const })));
    heldRef.current = {};
    setPhase('idle');
    setHint(null);
    setArmed(null);
    resetDistances();
    requestAnimationFrame(() => fitView({ padding: fitPadding, duration: 280 }));
  }, [fitView, setEdges, setNodes]);

  const rotate = useCallback((id: string) => {
    setNodes((current) => current.map((node) => {
      if (node.id !== id) return node;
      const def = getComponent(node.data.componentId);
      if (!def?.rotatable) return node;
      const rotation = (node.data.rotation + 90) % 360;
      const turned = rotation === 90 || rotation === 270;
      const canonical = node.data.size ?? { width: def.width, height: def.height };
      return {
        ...node,
        data: { ...node.data, rotation },
        style: { width: turned ? canonical.height : canonical.width, height: turned ? canonical.width : canonical.height },
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

  const clearSelection = useCallback(() => {
    setNodes((current) => current.map((node) => (node.selected ? { ...node, selected: false } : node)));
    setEdges((current) => current.map((edge) => (edge.selected ? { ...edge, selected: false } : edge)));
    if (window.matchMedia('(max-width: 1023px)').matches) setPanel('canvas');
  }, [setEdges, setNodes]);

  const showPropsOnPhone = useCallback(() => {
    if (window.matchMedia('(max-width: 1023px)').matches) setPanel('props');
  }, []);

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
  const inspectorOpen = Boolean(selected || selectedEdge);
  // Selection and library toggles must not move the viewport. fitView stays
  // explicit (loading an example, entering fullscreen), never automatic.

  return (
    <StudioViewContext.Provider value={view}>
      <div ref={shellRef} data-present={present ? 'true' : 'false'} className="studio-root flex h-full min-h-0 flex-col bg-white text-slate-900">
        <div className="studio-toolbar flex shrink-0 items-center gap-1 overflow-x-auto border-b border-slate-200 bg-white px-2 py-1">
          <button
            type="button"
            aria-pressed={libraryOpen}
            aria-label={libraryOpen ? text.hideLibrary : text.showLibrary}
            onClick={() => setLibraryOpen((current) => !current)}
            className="hidden shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 lg:inline-flex"
          >
            <PanelLeft className="h-3.5 w-3.5" aria-hidden />
          </button>
          <p className="mr-1 hidden shrink-0 text-xs font-semibold sm:block">{text.title}</p>
          <button type="button" onClick={() => setPhase('running')} aria-pressed={running} className={cn('inline-flex shrink-0 items-center gap-1 rounded-md font-medium text-white', running ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700')}>
            <Play className="h-3.5 w-3.5" aria-hidden /> {text.run}
          </button>
          <button type="button" onClick={() => setPhase((current) => (current === 'running' ? 'paused' : current))} className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white font-medium hover:bg-slate-50">
            <Pause className="h-3.5 w-3.5" aria-hidden /> {text.pause}
          </button>
          <button type="button" onClick={() => { setPhase('idle'); resetDistances(); }} className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white font-medium hover:bg-slate-50">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> {text.reset}
          </button>
          <ExamplesMenu onPick={loadExample} />
          <button type="button" onClick={() => { setNodes([]); setEdges([]); setPhase('idle'); setHint(null); resetDistances(); }} className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white font-medium hover:bg-slate-50">
            <Trash2 className="h-3.5 w-3.5" aria-hidden /> {text.clear}
          </button>
          <button
            type="button"
            aria-pressed={present}
            onClick={() => setPresent((current) => !current)}
            className="shrink-0 rounded-md border border-slate-200 bg-white font-medium hover:bg-slate-50"
          >{text.present}</button>
          <button
            type="button"
            onClick={() => {
              const shell = shellRef.current;
              if (!shell) return;
              if (document.fullscreenElement) void document.exitFullscreen();
              else void shell.requestFullscreen();
            }}
            className="shrink-0 rounded-md border border-slate-200 bg-white font-medium hover:bg-slate-50"
          >{text.fullscreen}</button>
          <p className="ml-auto hidden shrink-0 text-[11px] text-slate-400 xl:block">{text.disclaimer}</p>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className={cn('min-h-0', panel === 'library' ? 'flex w-full' : 'hidden', libraryOpen ? 'lg:flex lg:w-auto' : 'lg:hidden')}>
            <Library
              armedId={armed}
              onArm={(id) => {
                setArmed((current) => (current === id ? null : id));
                if (window.matchMedia('(max-width: 1023px)').matches) setPanel('canvas');
              }}
              onPlace={(id, clientX, clientY) => {
                const point = screenToFlowPosition({ x: clientX, y: clientY });
                addPart(id, point.x, point.y);
                setArmed(null);
              }}
            />
          </div>

          <div
            data-studio-canvas
            className={cn('studio-canvas relative min-h-0 min-w-0 flex-1 touch-none', panel === 'canvas' ? 'flex' : 'hidden', 'lg:flex')}
            onDragEnter={allowPartDrop}
            onDragOver={allowPartDrop}
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
              connectionRadius={present || coarse ? 44 : 32}
              snapToGrid
              snapGrid={[SNAP, SNAP]}
              fitView={false}
              defaultViewport={{ x: 40, y: 24, zoom: 1.25 }}
              minZoom={0.25}
              maxZoom={2.2}
              panOnScroll
              panOnDrag
              zoomOnPinch
              preventScrolling
              selectionOnDrag={false}
              deleteKeyCode={['Backspace', 'Delete']}
              proOptions={{ hideAttribution: false }}
              colorMode="light"
              className="studio-flow"
              onPaneClick={(event) => {
                if (armed) {
                  const point = screenToFlowPosition({ x: event.clientX, y: event.clientY });
                  addPart(armed, point.x, point.y);
                  setArmed(null);
                  return;
                }
                if (window.matchMedia('(max-width: 1023px)').matches) setPanel('canvas');
              }}
              onNodeClick={showPropsOnPhone}
              onEdgeClick={showPropsOnPhone}
            >
              <StudioBackground />
              <Controls showInteractive={false} position="bottom-left" />
            </ReactFlow>

            {nodes.length === 0 ? (
              <div className="pointer-events-none absolute inset-0 grid place-items-center p-4">
                <div className="max-w-xs rounded-lg border border-slate-200 bg-white/95 px-4 py-3 text-center shadow-sm">
                  <p className="text-sm font-semibold">{text.emptyTitle}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{text.emptyBody}</p>
                </div>
              </div>
            ) : (
              <SimChip result={result} showThermo={showThermo} />
            )}

            {armed ? (
              <div className="absolute left-1/2 top-2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1 text-xs shadow-sm">
                <span>{text.armed}</span>
                <button type="button" onClick={() => setArmed(null)} className="font-medium text-blue-700">{text.cancel}</button>
              </div>
            ) : null}

            {status ? (
              <div className="pointer-events-none absolute inset-x-3 top-2 z-10 flex justify-center" aria-live="polite">
                <p className={cn(
                  'pointer-events-auto max-w-md rounded-md border px-2.5 py-1 text-xs leading-4 shadow-sm',
                  hint || issue ? 'border-amber-200 bg-amber-50 text-amber-950' : 'border-slate-200 bg-white/95 text-slate-600',
                  armed && 'mt-8',
                )}>{status}</p>
              </div>
            ) : null}
          </div>

          {inspectorOpen || panel === 'props' ? (
          <div className={cn('min-h-0', panel === 'props' ? 'flex w-full' : 'hidden', inspectorOpen ? 'lg:flex lg:w-auto' : 'lg:hidden')}>
            <PropertiesPanel
              selected={selected}
              selectedEdge={selectedEdge}
              result={result}
              showThermo={showThermo}
              signalLinked={Boolean(selected && edges.some((edge) => edge.type === 'signal' && edge.target === selected.id))}
              onParam={(id, key, value) => {
                setNodes((current) => current.map((node) => {
                  if (node.id !== id) return node;
                  const params = { ...node.data.params, [key]: value };
                  const linked = edges.some((edge) => edge.type === 'signal' && edge.target === id);
                  if (key === 'manualPort' && node.data.componentId === 'valve-3way' && linked) {
                    params.controlMode = 1;
                  }
                  if (key === 'manualOpen' && node.data.componentId === 'valve' && linked) {
                    params.controlMode = 1;
                  }
                  // Only a branch-count change alters geometry; every other param
                  // leaves the visual size (including direct-resize overrides) alone.
                  const def = getComponent(node.data.componentId);
                  const box = key === 'branches' && def ? componentBox(def, params) : null;
                  return {
                    ...node,
                    data: box ? { ...node.data, params, size: { width: box.width, height: box.height } } : { ...node.data, params },
                    style: box ? { width: box.width, height: box.height } : node.style,
                  };
                }));
                if (key === 'branches') {
                  const node = nodes.find((item) => item.id === id);
                  const def = node ? getComponent(node.data.componentId) : undefined;
                  if (!node || !def) return;
                  const ports = new Set(resolvePorts(def, { ...node.data.params, branches: value }).map((port) => port.id));
                  setEdges((current) => current.filter((edge) => {
                    if (edge.source === id && edge.sourceHandle && !ports.has(edge.sourceHandle)) return false;
                    if (edge.target === id && edge.targetHandle && !ports.has(edge.targetHandle)) return false;
                    return true;
                  }));
                }
              }}
              onRotate={rotate}
              onReversePump={reversePump}
              onRemove={(id) => { void deleteElements({ nodes: [{ id }] }); }}
              onRemoveEdge={(id) => { void deleteElements({ edges: [{ id }] }); }}
              onClose={clearSelection}
            />
          </div>
          ) : null}
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
              className={cn('py-2 text-xs font-medium', panel === id ? 'text-blue-700' : 'text-slate-500')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </StudioViewContext.Provider>
  );
}
