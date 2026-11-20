'use client';

import { useContext, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { getSmoothStepPath, type Edge, type EdgeProps } from '@xyflow/react';
import { edgeDistance, subscribeClock } from '@/components/studio/clock';
import { temperatureColor } from '@/components/studio/temperature';
import { StudioViewContext } from '@/components/studio/viewContext';

export type HydronicFlowEdge = Edge<{ label?: string }, 'hydronic'>;

function useEdgeDistance(id: string): number {
  return useSyncExternalStore(subscribeClock, () => edgeDistance(id), () => 0);
}

export function HydronicEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps<HydronicFlowEdge>) {
  const view = useContext(StudioViewContext);
  const sim = view.showThermo ? view.result?.edges[id] : undefined;
  const distance = useEdgeDistance(id);
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);
  const [d] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 12,
  });

  useLayoutEffect(() => {
    setLength(pathRef.current?.getTotalLength() ?? 0);
  }, [d]);

  const casing = selected ? 8 : 6.2;
  const bore = selected ? 3.6 : 3.2;
  const thermo = Boolean(sim);
  const particles = thermo && sim && sim.flowLph > 1 && length > 8 ? particlePoints(pathRef.current, length, distance, sim) : [];

  return (
    <>
      <path ref={pathRef} d={d} fill="none" stroke="transparent" strokeWidth={18} />
      {selected ? <path d={d} fill="none" stroke="#2563eb" strokeWidth={12} strokeLinecap="round" opacity={0.35} /> : null}
      <path d={d} fill="none" stroke="#0f172a" strokeWidth={casing} strokeLinecap="round" strokeLinejoin="round" />
      {thermo && sim && length > 0 ? (
        <ColoredBore d={d} length={length} tSource={sim.tSource} tTarget={sim.tTarget} width={bore} />
      ) : (
        <path d={d} fill="none" stroke="#94a3b8" strokeWidth={bore} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {particles.map((point, index) => (
        <circle key={index} cx={point.x} cy={point.y} r={4.2} fill={point.color} stroke="#ffffff" strokeWidth={1.4} />
      ))}
    </>
  );
}

function ColoredBore({
  d,
  length,
  tSource,
  tTarget,
  width,
}: {
  d: string;
  length: number;
  tSource: number;
  tTarget: number;
  width: number;
}) {
  if (Math.abs(tSource - tTarget) < 0.4) {
    return <path d={d} fill="none" stroke={temperatureColor((tSource + tTarget) / 2)} strokeWidth={width} strokeLinecap="round" />;
  }
  // The temperature gradient reuses the exact rendered pipe path `d`: every
  // slice is a dash window onto the same geometry, so the coloured bore (and
  // the particles, which ride getPointAtLength on this path) follow every
  // 90-degree bend instead of cutting chords across corners. Slice count
  // scales with path length so long multi-bend pipes keep smooth gradients.
  const steps = Math.max(12, Math.min(72, Math.ceil(length / 16)));
  const seg = length / steps;
  const slices = [];
  for (let i = 0; i < steps; i++) {
    const temp = tSource + ((tTarget - tSource) * (i + 0.5)) / steps;
    slices.push(
      <path
        key={i}
        d={d}
        fill="none"
        stroke={temperatureColor(temp)}
        strokeWidth={width}
        strokeLinecap="butt"
        strokeDasharray={`${seg + 0.75} ${length}`}
        strokeDashoffset={-(i * seg)}
      />,
    );
  }
  return <>{slices}</>;
}

function particlePoints(
  path: SVGPathElement | null,
  length: number,
  distance: number,
  sim: { tSource: number; tTarget: number; flowFromSource: boolean },
) {
  if (!path) return [];
  const count = Math.max(2, Math.min(5, Math.round(length / 90)));
  const points = [];
  for (let i = 0; i < count; i++) {
    const along = (distance + (i * length) / count) % length;
    const fromStart = sim.flowFromSource ? along : length - along;
    const point = path.getPointAtLength(fromStart);
    const temp = sim.tSource + (sim.tTarget - sim.tSource) * (fromStart / length);
    points.push({ x: point.x, y: point.y, color: temperatureColor(temp) });
  }
  return points;
}

export function SignalEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps<HydronicFlowEdge>) {
  const [d] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 10, offset: 24,
  });
  return (
    <>
      <path d={d} fill="none" stroke="transparent" strokeWidth={16} />
      {selected ? <path d={d} fill="none" stroke="#7c3aed" strokeWidth={8} opacity={0.25} /> : null}
      <path d={d} fill="none" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6 5" strokeLinecap="round" />
      <circle cx={targetX} cy={targetY} r={3.5} fill="#7c3aed" />
    </>
  );
}

/**
 * Green tank-measurement link. Same dashed command style as the purple
 * signal, in measurement green, so the two never read as water pipes.
 */
export function SenseEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps<HydronicFlowEdge>) {
  const [d] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, borderRadius: 10, offset: 24,
  });
  return (
    <>
      <path d={d} fill="none" stroke="transparent" strokeWidth={16} />
      {selected ? <path d={d} fill="none" stroke="#16a34a" strokeWidth={8} opacity={0.25} /> : null}
      <path d={d} fill="none" stroke="#16a34a" strokeWidth={2} strokeDasharray="6 5" strokeLinecap="round" />
      <circle cx={targetX} cy={targetY} r={3.5} fill="#16a34a" />
    </>
  );
}

export const hydronicEdgeTypes = { hydronic: HydronicEdge, signal: SignalEdge, sense: SenseEdge };
