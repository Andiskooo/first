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
import { ChevronDown, PanelLeft, Pause, Play, RotateCcw, Save, Trash2 } from 'lucide-react';
import '@xyflow/react/dist/style.css';

import { computeOpenings, isGenuineHpRestart, resetControlState, sondeCommand, sondeTankOf, thermostatZoneOf } from '@/components/studio/control';
import { buildExample, type ExampleKind } from '@/components/studio/example';
import {
  deleteSavedSystem,
  getSavedSystem,
  listSavedSystems,
  saveSystem,
  validateSavedSystem,
  type SavedSystem,
} from '@/components/studio/savedSystems';
import { componentBox, getComponent, isBufferId, isHeatPumpId, isHeatingConsumerId, resolvePorts } from '@/components/studio/registry';
import { SNAP, createPlacedPart, droppedPartId, markPartDropped } from '@/components/studio/place';
import { HP_WARM_START_C, T_ROOM, WATER_CP, WATER_RHO, chargeBuffer } from '@/components/studio/simulation';
import { simulate } from '@/components/studio/simulation';
import { THERMAL_HEAT_RATE, advanceThermal, isThermalNode } from '@/components/studio/thermal';
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

function ExamplesMenu({ onPick, saved, onPickSaved, onDeleteSaved }: {
  onPick: (kind: ExampleKind) => void;
  saved: SavedSystem[];
  onPickSaved: (id: string) => void;
  onDeleteSaved: (id: string) => void;
}) {
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
          <div role="separator" className="mx-2 my-1 border-t border-slate-200" />
          <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{text.savedSystems}</p>
          {saved.length === 0 ? (
            <p className="px-3 pb-1.5 text-xs text-slate-400">{text.noSavedSystems}</p>
          ) : saved.map((item) => (
            <div key={item.id} className="group flex items-center gap-1 px-1.5 py-0.5 hover:bg-slate-50">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onPickSaved(item.id);
                }}
                className="min-w-0 flex-1 truncate rounded px-1.5 py-1 text-left text-xs font-medium text-slate-800"
                title={item.name}
              >
                {item.name}
              </button>
              <button
                type="button"
                aria-label={`${text.deleteSaved}: ${item.name}`}
                onClick={() => onDeleteSaved(item.id)}
                className="shrink-0 rounded px-1.5 py-1 text-xs text-slate-400 hover:bg-red-50 hover:text-red-700"
              >
                ×
              </button>
            </div>
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
          kind: edge.type === 'signal' ? 'signal' as const : edge.type === 'sense' ? 'sense' as const : 'pipe' as const,
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
  /** Heat-pump warm-up state (°C deliverable supply). Null = steady-state solve at setpoint. */
  const [hpSupplyC, setHpSupplyC] = useState<number | null>(null);
  /** Live body/zone temperatures (°C) by node id, advanced with simulation time while running. */
  const [thermal, setThermal] = useState<Record<string, number>>({});
  const [present, setPresent] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [coarse, setCoarse] = useState(false);
  const [saved, setSaved] = useState<SavedSystem[]>(() => listSavedSystems());
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef({ nodes, edges });
  const rejectRef = useRef<string | null>(null);
  const heldRef = useRef<Record<string, number>>({});
  const resultRef = useRef<ReturnType<typeof simulate> | null>(null);
  /**
   * Last genuinely solved heat-pump supply/return. Pump state changes leave
   * the solver with no flow (null supply, 0° node temps); this hold keeps the
   * displayed temperatures continuous across those transitions instead of
   * flashing the startup values. Written only from real solves, never read
   * back into the simulation.
   */
  const heldSupplyRef = useRef<{ s: number; r: number } | null>(null);
  /**
   * Last mixed-tank temperature from a non-idle solve. Seeds primary-idle
   * charging when a secondary pump stops, so the hot tank (not T_ROOM) is
   * the restart point. Null on fresh starts, preserving the mid-20s warm-up.
   */
  const prevTankRef = useRef<number | null>(null);
  /**
   * Last heat-pump gate (1 = running, 0 = thermostat-held OFF, undefined =
   * uncontrolled). Detects a genuine thermostat OFF→ON transition so the
   * warm-up restarts exactly once per restart, never on repeated ONs.
   */
  const prevHpGateRef = useRef<number | undefined>(undefined);
  /**
   * Wall-clock ms when the heat-pump gate last went OFF (null = currently
   * ON or never OFF). Lets the restart detector tell genuine user-driven
   * OFF periods apart from single-evaluation micro-OFFs, so chatter never
   * wipes the warm-up ramp.
   */
  const hpOffSinceRef = useRef<number | null>(null);
  /** Previous per-valve sonde lock, to seed manual params when a lock releases. */
  const sondeLockRef = useRef<Record<string, boolean>>({});
  const seq = useRef(1);
  const { screenToFlowPosition, fitView, deleteElements, setViewport } = useReactFlow();
  const updateInternals = useUpdateNodeInternals();
  graphRef.current = { nodes, edges };

  const graph = useMemo(() => toGraph(nodes, edges), [nodes, edges]);
  const { openings, result } = useMemo(() => {
    const opts: { tankC?: number; hpSupplyC?: number } = {};
    // Prefer live charging progress; otherwise reseed idle charging from the
    // last drawn-down tank so the first idle render is already continuous.
    if (tankC != null) opts.tankC = tankC;
    else if (prevTankRef.current != null) opts.tankC = prevTankRef.current;
    if (hpSupplyC != null) opts.hpSupplyC = hpSupplyC;
    const input = { nodes: graph.nodes, edges: graph.edges, held: heldRef.current, temps: thermal };
    const first = computeOpenings({ ...input, result: resultRef.current });
    const solved = simulate(graph.nodes, graph.edges, first, opts);
    // Second pass lets tank-sonde (and relief) commands react to the fresh
    // tank temperatures within the same render instead of lagging one edit
    // behind. Two fixed passes cannot oscillate; a render only re-runs this
    // when the graph, the charging tank, or a live temperature changes.
    const second = computeOpenings({ ...input, result: solved });
    if (Object.keys(second).some((id) => second[id] !== first[id])) {
      return { openings: second, result: simulate(graph.nodes, graph.edges, second, opts) };
    }
    return { openings: first, result: solved };
  }, [graph, tankC, hpSupplyC, thermal]);
  // The inspector, canvas labels, and sensors all read this copy: hydraulic
  // water temperatures stay solver-owned, while tank body, heating-zone, and
  // measured values come from the live thermal layer.
  const displayResult = useMemo(() => {
    // Continuity hold: with no circulation the solver yields null supply and
    // 0° heat-pump temps. Display the last solved values instead so a pump
    // ON→OFF transition never flashes the mid-20s startup look. Real solves
    // always take precedence when flow exists.
    const held = heldSupplyRef.current;
    const holdHp = held != null && (result.supplyC == null || result.returnC == null);
    if (!Object.keys(thermal).length) {
      if (!holdHp) return result;
      const outNodes = { ...result.nodes };
      const hpNode = graph.nodes.find((node) => isHeatPumpId(node.componentId));
      if (hpNode && outNodes[hpNode.id] && !(outNodes[hpNode.id].flowLph > 1)) {
        outNodes[hpNode.id] = { ...outNodes[hpNode.id], tIn: held.r, tOut: held.s, dt: held.s - held.r };
      }
      return { ...result, nodes: outNodes, supplyC: held.s, returnC: held.r, dtC: held.s - held.r };
    }
    const outNodes = { ...result.nodes };
    if (holdHp) {
      const hpNode = graph.nodes.find((node) => isHeatPumpId(node.componentId));
      if (hpNode && outNodes[hpNode.id] && !(outNodes[hpNode.id].flowLph > 1)) {
        outNodes[hpNode.id] = { ...outNodes[hpNode.id], tIn: held.r, tOut: held.s, dt: held.s - held.r };
      }
    }
    for (const node of graph.nodes) {
      const live = thermal[node.id];
      if (live == null || !Number.isFinite(live)) continue;
      const prior = outNodes[node.id];
      if (isBufferId(node.componentId)) {
        const volume = node.params.volume ?? 200;
        outNodes[node.id] = {
          tIn: prior?.tIn ?? live,
          tOut: prior?.tOut ?? live,
          flowLph: prior?.flowLph ?? 0,
          qKw: prior?.qKw ?? 0,
          dt: 0,
          tankC: live,
          storedKwh: volume * WATER_RHO * WATER_CP * Math.max(live - T_ROOM, 0) / 3600,
        };
      } else if (node.componentId === 'dhw-tank' || isHeatingConsumerId(node.componentId)) {
        outNodes[node.id] = {
          tIn: prior?.tIn ?? live,
          tOut: prior?.tOut ?? live,
          flowLph: prior?.flowLph ?? 0,
          qKw: prior?.qKw ?? 0,
          dt: prior?.dt ?? 0,
          roomC: live,
        };
      } else if (node.componentId === 'thermostat') {
        const zoneId = thermostatZoneOf(node, graph.nodes, graph.edges);
        const zone = zoneId ? thermal[zoneId] : undefined;
        if (zone != null && Number.isFinite(zone)) {
          outNodes[node.id] = {
            tIn: prior?.tIn ?? 0,
            tOut: prior?.tOut ?? 0,
            flowLph: 0,
            qKw: 0,
            dt: 0,
            roomC: zone,
          };
        }
      } else if (node.componentId === 'tank-sonde') {
        const tankId = sondeTankOf(node, graph.edges);
        const measured = tankId ? thermal[tankId] : undefined;
        if (measured != null && Number.isFinite(measured)) {
          outNodes[node.id] = {
            tIn: measured,
            tOut: measured,
            flowLph: 0,
            qKw: 0,
            dt: 0,
            opening: sondeCommand(node, graph.edges, (id) => thermal[id]) ?? prior?.opening ?? 0,
          };
        }
      }
    }
    if (holdHp) return { ...result, nodes: outNodes, supplyC: held.s, returnC: held.r, dtC: held.s - held.r };
    return { ...result, nodes: outNodes };
  }, [result, thermal, graph]);
  const showThermo = phase !== 'idle';
  const running = phase === 'running';
  const toggleThreeWay = useCallback((id: string) => {
    setNodes((current) => current.map((node) => {
      const selected = node.id === id;
      if (!selected) return node.selected ? { ...node, selected: false } : node;
      if (node.data.componentId !== 'valve-3way') return { ...node, selected: true };
      // A sensor-locked valve (any tank sonde on a purple input) cannot be
      // manually overridden: canvas taps only select it.
      const sondeLocked = edges.some((edge) => {
        if (edge.type !== 'signal' || edge.target !== id) return false;
        const peerId = edge.source === id ? edge.target : edge.source;
        const peer = current.find((item) => item.id === peerId);
        return peer?.data.componentId === 'tank-sonde';
      });
      if (sondeLocked) return { ...node, selected: true };
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
  const view = useMemo(() => ({ showThermo, result: displayResult, toggleThreeWay, toggleTwoWay }), [showThermo, displayResult, toggleThreeWay, toggleTwoWay]);
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
    // Track only genuine solves; the display hold never feeds back in.
    if (result.supplyC != null && result.returnC != null) {
      heldSupplyRef.current = { s: result.supplyC, r: result.returnC };
    }
    // Last mixed-tank temperature solved while consumers were drawing (not
    // primary-idle). A secondary-pump stop reseeds idle charging from the
    // hot tank instead of T_ROOM, so supply stays continuous.
    if (!result.primaryIdle && result.tankC != null) {
      prevTankRef.current = result.tankC;
    }
    // A heat-pump gate entry exists only with a thermostat wire (control.ts
    // skips sondes for heat pumps). A 0→1 edge after a sustained OFF is a
    // genuine thermostat-controlled restart: restart the warm-up like a
    // fresh startup (same values, same mechanisms). Micro-OFF blips from the
    // instant 0 C reset are ignored so the in-progress ramp survives rapid
    // auto-cycling. Circulation-pump, valve, and sonde changes never touch
    // this gate, and repeated ONs see a previous ON and do nothing.
    const rfNodes = graphRef.current.nodes;
    const hpId = rfNodes.find((node) => isHeatPumpId(node.data.componentId))?.id;
    const hpControlled = hpId != null
      && graphRef.current.edges.some((edge) => edge.type === 'signal' && edge.target === hpId);
    const hpGate = hpControlled && hpId != null ? openings[hpId] : undefined;
    const prevHpGate = prevHpGateRef.current;
    prevHpGateRef.current = hpGate;
    // Track how long the gate has been OFF (wall time between committed
    // evaluations). A micro-OFF from the instant 0 C reset lasts about a
    // frame; only a sustained OFF arms a genuine restart.
    if (hpGate !== undefined && hpGate < 0.5) {
      if (hpOffSinceRef.current == null) hpOffSinceRef.current = performance.now();
    } else if (hpGate !== undefined && hpGate >= 0.5) {
      const offMs = hpOffSinceRef.current == null ? Number.POSITIVE_INFINITY : performance.now() - hpOffSinceRef.current;
      hpOffSinceRef.current = null;
      if (!isGenuineHpRestart(prevHpGate, hpGate, offMs)) return;
      setHpSupplyC(HP_WARM_START_C);
      setTankC(null);
      heldSupplyRef.current = null;
      prevTankRef.current = null;
      // Restart the displayed buffer body like a fresh run (unseeded, so the
      // thermal layer reseeds from zero); heat-consumer bodies are untouched.
      const bufferIds = new Set(
        rfNodes.filter((node) => isBufferId(node.data.componentId)).map((node) => node.id),
      );
      if (bufferIds.size) {
        setThermal((current) => {
          let next: Record<string, number> | null = null;
          for (const id of bufferIds) {
            if (!(id in current)) continue;
            if (!next) next = { ...current };
            delete next[id];
          }
          return next ?? current;
        });
      }
    }
  }, [openings, result]);

  useEffect(() => {
    if (phase === 'idle') {
      heldRef.current = {};
      heldSupplyRef.current = null;
      prevTankRef.current = null;
      prevHpGateRef.current = undefined;
      hpOffSinceRef.current = null;
      sondeLockRef.current = {};
      resetControlState();
      setTankC(null);
      setHpSupplyC(null);
      setThermal({});
    }
  }, [phase]);

  // When the last purple sonde command leaves a three-way valve, hand manual
  // control back from the preserved hydraulic outlet: the stored manual port
  // adopts the last committed opening so the valve does not jump.
  useEffect(() => {
    const locks: Record<string, boolean> = {};
    for (const node of nodes) {
      if (node.data.componentId !== 'valve-3way') continue;
      locks[node.id] = edges.some((edge) => {
        if (edge.type !== 'signal' || edge.target !== node.id) return false;
        const peerId = edge.source === node.id ? edge.target : edge.source;
        return nodes.some((item) => item.id === peerId && item.data.componentId === 'tank-sonde');
      });
    }
    const prev = sondeLockRef.current;
    const released = Object.keys(locks).filter((id) => prev[id] && !locks[id]);
    sondeLockRef.current = locks;
    if (!released.length) return;
    const heldNow = { ...heldRef.current };
    setNodes((current) => current.map((node) => {
      if (!released.includes(node.id)) return node;
      const keep = heldNow[node.id] !== undefined ? (heldNow[node.id] >= 0.5 ? 1 : 0) : (node.data.params.manualPort ?? 0);
      return {
        ...node,
        data: { ...node.data, params: { ...node.data.params, manualPort: keep, controlMode: 1 } },
      };
    }));
  }, [nodes, edges, setNodes]);

  // Heating dynamics run on simulation time: each frame advances live tank
  // and zone temperatures from the latest hydraulic flows, and ramps the
  // heat-pump deliverable supply from its mid-20s warm start toward the
  // configured setpoint at the shared heating rate — but only while water
  // actually circulates through the heat pump. A pump OFF→ON transition
  // therefore resumes from the frozen ramp value instead of jumping to the
  // setpoint, and the display hold above covers the ON→OFF direction. No
  // flow means body temperatures reset; the heat-pump ramp only ever climbs
  // while circulating. Control decisions re-solve from the same render
  // through the openings memo above.
  useEffect(() => {
    if (phase !== 'running') return;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.5, (now - last) / 1000);
      last = now;
      const solved = resultRef.current;
      if (solved) {
        const flat = graphRef.current.nodes.map((node) => ({
          id: node.id,
          componentId: node.data.componentId,
          params: node.data.params ?? {},
        }));
        setThermal((current) => advanceThermal(current, flat, solved, dt));
        // Frozen while the heat pump sees no flow: time alone must not warm
        // the deliverable supply, or the next pump start would jump.
        if (solved.supplyC == null) return;
        const hp = graphRef.current.nodes.find((node) => isHeatPumpId(node.data.componentId));
        const target = hp?.data.params.setpoint ?? 45;
        setHpSupplyC((current) => Math.min(target, (current ?? HP_WARM_START_C) + THERMAL_HEAT_RATE * dt));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
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
        // Reseed from the last drawn-down tank when idle begins mid-run;
        // fresh starts still begin at T_ROOM for the mid-20s warm-up.
        current ?? prevTankRef.current ?? T_ROOM,
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
    // A tank sonde taking command of a three-way valve sensor-locks it into
    // AUTO with Port A as the initial outlet.
    const targetPeer = graphRef.current.nodes.find((node) => node.id === connection.target);
    const sourcePeer = graphRef.current.nodes.find((node) => node.id === connection.source);
    const sondeTakesValve = targetPeer?.data.componentId === 'valve-3way'
      && sourcePeer?.data.componentId === 'tank-sonde';
    if (sondeTakesValve && connection.target) {
      const valveId = connection.target;
      // Entering sensor-locked AUTO: drop any stale manual-B outlet memory so
      // the valve seeds to Port A on the next evaluation (never forced after).
      delete heldRef.current[valveId];
      setNodes((current) => current.map((node) => (
        node.id === valveId
          ? { ...node, data: { ...node.data, params: { ...node.data.params, controlMode: 0, manualPort: 0 } } }
          : node
      )));
    }
    const endTerminal = (id: string | null | undefined, handle: string | null | undefined) => {
      const peer = graphRef.current.nodes.find((node) => node.id === id);
      const def = peer ? getComponent(peer.data.componentId) : undefined;
      return def ? resolvePorts(def, peer?.data.params).find((port) => port.id === handle)?.terminal : undefined;
    };
    const fromTerminal = endTerminal(connection.source, connection.sourceHandle);
    const toTerminal = endTerminal(connection.target, connection.targetHandle);
    const kind = (fromTerminal === 'sense' || toTerminal === 'sense')
      ? 'sense'
      : (fromTerminal === 'signal' || toTerminal === 'signal') ? 'signal' : 'hydronic';
    setEdges((current) => addEdge({ ...connection, id: `e-${crypto.randomUUID()}`, type: kind }, current));
  }, [setEdges, setNodes]);

  const onConnectEnd: OnConnectEnd = useCallback(() => {
    if (rejectRef.current) {
      setHint(rejectRef.current);
      rejectRef.current = null;
    }
  }, []);

  const applySystem = useCallback((systemNodes: SavedSystem['nodes'], systemEdges: SavedSystem['edges']) => {
    seq.current = 40 + systemNodes.length + systemEdges.length;
    setNodes(systemNodes.map((node) => {
      const def = getComponent(node.componentId);
      const fallback = def ? componentBox(def, node.params) : { width: 120, height: 96 };
      const box = node.size ?? fallback;
      return {
        id: node.id,
        type: 'hydronic' as const,
        position: { x: node.x, y: node.y },
        data: {
          componentId: node.componentId,
          params: { ...node.params },
          rotation: node.rotation ?? 0,
          size: { ...box },
        },
        style: { width: box.width, height: box.height },
        className: 'overflow-visible',
      };
    }));
    setEdges(systemEdges.map((edge) => ({ ...edge, type: edge.kind === 'signal' ? 'signal' as const : edge.kind === 'sense' ? 'sense' as const : 'hydronic' as const })));
    heldRef.current = {};
    setPhase('idle');
    setHpSupplyC(null);
    setHint(null);
    setArmed(null);
    resetDistances();
    requestAnimationFrame(() => fitView({ padding: fitPadding, duration: 280 }));
  }, [fitView, setEdges, setNodes]);

  const loadSaved = useCallback((id: string) => {
    const system = getSavedSystem(id);
    if (!system) {
      setHint('corrupt-system');
      return;
    }
    const verdict = validateSavedSystem(system);
    if (!verdict.ok) {
      setHint(verdict.code);
      return;
    }
    applySystem(system.nodes, system.edges);
  }, [applySystem]);

  const deleteSaved = useCallback((id: string) => {
    try {
      deleteSavedSystem(id);
    } catch {
      setHint('storage-failed');
      return;
    }
    setSaved(listSavedSystems());
  }, []);

  const confirmSave = useCallback(() => {
    if (saving) return;
    if (!saveName.trim()) {
      setSaveError('name-required');
      return;
    }
    if (nodes.length === 0) {
      setSaveError('empty-canvas');
      return;
    }
    setSaving(true);
    try {
      const payload = nodes.map((node) => ({
        id: node.id,
        componentId: node.data.componentId,
        params: { ...(node.data.params ?? {}) },
        x: node.position.x,
        y: node.position.y,
        rotation: node.data.rotation ?? 0,
        size: node.data.size ? { ...node.data.size } : undefined,
      }));
      const payloadEdges = edges.flatMap((edge) => (
        edge.sourceHandle && edge.targetHandle
          ? [{
            id: edge.id,
            source: edge.source,
            target: edge.target,
            sourceHandle: edge.sourceHandle,
            targetHandle: edge.targetHandle,
            kind: edge.type === 'signal' ? 'signal' as const : edge.type === 'sense' ? 'sense' as const : 'pipe' as const,
          }]
          : []
      ));
      saveSystem(saveName, payload, payloadEdges);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'storage-failed');
      setSaving(false);
      return;
    }
    setSaving(false);
    setSaved(listSavedSystems());
    setSaveOpen(false);
    setSaveName('');
    setSaveError(null);
  }, [edges, nodes, saveName, saving]);

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
    setEdges(example.edges.map((edge) => ({ ...edge, type: edge.kind === 'signal' ? 'signal' as const : edge.kind === 'sense' ? 'sense' as const : 'hydronic' as const })));
    heldRef.current = {};
    setPhase('idle');
    setHpSupplyC(null);
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
          <button type="button" onClick={() => {
            // Fresh-start initialization (once, never per update): seed every
            // thermal body to 0 C so the first sensor evaluation reads cold
            // bodies and a sensor-locked valve seeds Port A. Without this the
            // first pass falls back to hot supply-water temperatures and
            // latches Port B before any heating cycle exists. Resume-from-pause
            // keeps live bodies untouched.
            if (phase === 'idle') {
              const seeds: Record<string, number> = {};
              for (const node of graphRef.current.nodes) {
                if (isThermalNode(node.data.componentId)) seeds[node.id] = 0;
              }
              setThermal(seeds);
            }
            setHpSupplyC((current) => current ?? HP_WARM_START_C);
            setPhase('running');
          }} aria-pressed={running} className={cn('inline-flex shrink-0 items-center gap-1 rounded-md font-medium text-white', running ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700')}>
            <Play className="h-3.5 w-3.5" aria-hidden /> {text.run}
          </button>
          <button type="button" onClick={() => setPhase((current) => (current === 'running' ? 'paused' : current))} className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white font-medium hover:bg-slate-50">
            <Pause className="h-3.5 w-3.5" aria-hidden /> {text.pause}
          </button>
          <button type="button" onClick={() => { setPhase('idle'); resetDistances(); }} className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white font-medium hover:bg-slate-50">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> {text.reset}
          </button>
          <ExamplesMenu onPick={loadExample} saved={saved} onPickSaved={loadSaved} onDeleteSaved={deleteSaved} />
          <button type="button" onClick={() => { setNodes([]); setEdges([]); setPhase('idle'); setHpSupplyC(null); setHint(null); resetDistances(); }} className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white font-medium hover:bg-slate-50">
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
          <button
            type="button"
            onClick={() => {
              setSaveError(null);
              setSaveName('');
              setSaveOpen(true);
            }}
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white font-medium hover:bg-slate-50"
          >
            <Save className="h-3.5 w-3.5" aria-hidden /> {text.save}
          </button>
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
              <SimChip result={displayResult} showThermo={showThermo} />
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
              result={displayResult}
              showThermo={showThermo}
              signalLinked={Boolean(selected && edges.some((edge) => edge.type === 'signal' && edge.target === selected.id))}
              sondeLocked={Boolean(selected && selected.data.componentId === 'valve-3way' && edges.some((edge) => {
                if (edge.type !== 'signal' || edge.target !== selected.id) return false;
                const peerId = edge.source === selected.id ? edge.target : edge.source;
                return nodes.some((item) => item.id === peerId && item.data.componentId === 'tank-sonde');
              }))}
              senseLinked={Boolean(selected && edges.some((edge) => edge.type === 'sense' && (edge.source === selected.id || edge.target === selected.id)))}
              controlOutLinked={Boolean(selected && selected.data.componentId === 'tank-sonde' && edges.some((edge) => edge.type === 'signal' && edge.source === selected.id))}
              onParam={(id, key, value) => {
                setNodes((current) => current.map((node) => {
                  if (node.id !== id) return node;
                  // A sensor-locked three-way valve ignores manual outlet and
                  // manual-mode writes; AUTO stays in charge while a sonde
                  // drives either purple input.
                  if (node.data.componentId === 'valve-3way' && (key === 'manualPort' || (key === 'controlMode' && value !== 0))) {
                    const locked = edges.some((edge) => {
                      if (edge.type !== 'signal' || edge.target !== id) return false;
                      const peerId = edge.source === id ? edge.target : edge.source;
                      return current.some((item) => item.id === peerId && item.data.componentId === 'tank-sonde');
                    });
                    if (locked) return node;
                  }
                  // Entering Automatic mode: drop any stale manual-B outlet memory
                  // so the valve seeds to Port A on the next evaluation. The
                  // seed applies once (held re-commits afterwards), so later
                  // valid signals still switch A->B->A normally.
                  if (key === 'controlMode' && value === 0 && node.data.componentId === 'valve-3way'
                    && (node.data.params.controlMode ?? 0) !== 0) {
                    delete heldRef.current[id];
                  }
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
        {saveOpen && typeof document !== 'undefined' ? createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={text.saveTitle}
            className="fixed inset-0 z-[90] grid place-items-center bg-slate-900/40 p-4"
            onPointerDown={(event) => {
              if (event.target === event.currentTarget && !saving) setSaveOpen(false);
            }}
          >
            <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
              <h2 className="text-sm font-semibold text-slate-900">{text.saveTitle}</h2>
              <label className="mt-3 block text-xs font-medium text-slate-700">
                {text.saveName}
                <input
                  value={saveName}
                  onChange={(event) => {
                    setSaveName(event.target.value);
                    if (saveError) setSaveError(null);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      confirmSave();
                    }
                  }}
                  placeholder={text.savePlaceholder}
                  autoFocus
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-500"
                />
              </label>
              {saveError ? (
                <p className="mt-2 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-800" aria-live="polite">
                  {messageOf(text, saveError)}
                </p>
              ) : null}
              <p className="mt-2 text-[11px] leading-4 text-slate-400">{text.saveLocalNote}</p>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setSaveOpen(false)}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium hover:bg-slate-50 disabled:opacity-50"
                >
                  {text.cancel}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={confirmSave}
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {text.save}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        ) : null}
      </div>
    </StudioViewContext.Provider>
  );
}
