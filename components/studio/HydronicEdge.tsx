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

  const casing = selected ? 7.4 : 6.2;
  const bore = selected ? 3.6 : 3.2;
  const thermo = Boolean(sim);
  const particles = thermo && sim && sim.flowLph > 1 && length > 8 ? particlePoints(pathRef.current, length, distance, sim) : [];

  return (
    <>
      <path ref={pathRef} d={d} fill="none" stroke="transparent" strokeWidth={18} />
      <path d={d} fill="none" stroke="#0f172a" strokeWidth={casing} strokeLinecap="round" strokeLinejoin="round" />
      {thermo && sim && length > 0 ? (
        <ColoredBore d={d} length={length} path={pathRef.current} tSource={sim.tSource} tTarget={sim.tTarget} width={bore} />
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
  path,
  tSource,
  tTarget,
  width,
}: {
  d: string;
  length: number;
  path: SVGPathElement | null;
  tSource: number;
  tTarget: number;
  width: number;
}) {
  if (!path || Math.abs(tSource - tTarget) < 0.4) {
    return <path d={d} fill="none" stroke={temperatureColor((tSource + tTarget) / 2)} strokeWidth={width} strokeLinecap="round" />;
  }
  const steps = 12;
  const lines = [];
  for (let i = 0; i < steps; i++) {
    const a = path.getPointAtLength((length * i) / steps);
    const b = path.getPointAtLength((length * (i + 1)) / steps);
    const temp = tSource + ((tTarget - tSource) * (i + 0.5)) / steps;
    lines.push(
      <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={temperatureColor(temp)} strokeWidth={width} strokeLinecap="round" />,
    );
  }
  return <>{lines}</>;
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

export const hydronicEdgeTypes = { hydronic: HydronicEdge };
