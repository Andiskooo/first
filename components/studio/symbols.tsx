'use client';

import { useId } from 'react';
import type { ComponentDef, PortDef } from '@/components/studio/types';
import { temperatureColor } from '@/components/studio/temperature';

function stubs(def: ComponentDef) {
  return def.ports.map((port) => {
    const x = port.x * def.width;
    const y = port.y * def.height;
    const dx = def.width / 2 - x;
    const dy = def.height / 2 - y;
    const mag = Math.hypot(dx, dy) || 1;
    const len = 18;
    const color = port.side === 'supply' ? '#ef4444' : port.side === 'return' ? '#2563eb' : '#64748b';
    return (
      <line
        key={port.id}
        x1={x}
        y1={y}
        x2={x + (dx / mag) * len}
        y2={y + (dy / mag) * len}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
      />
    );
  });
}

export function ComponentArt({
  def,
  tIn,
  tOut,
  active = false,
}: {
  def: ComponentDef;
  tIn?: number;
  tOut?: number;
  active?: boolean;
}) {
  if (def.asset) {
    return (
      // The heat pump artwork is a swappable file. next/image does not render SVG
      // without extra config, and a photo dropped in later should keep its own size.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={def.asset} alt="" draggable={false} className="pointer-events-none h-full w-full select-none object-contain" />
    );
  }
  return <SymbolGraphic def={def} tIn={tIn} tOut={tOut} active={active} />;
}

function SymbolGraphic({
  def,
  tIn,
  tOut,
  active,
}: {
  def: ComponentDef;
  tIn?: number;
  tOut?: number;
  active: boolean;
}) {
  const gid = useId().replace(/:/g, '');
  const hot = temperatureColor(tIn ?? 42);
  const cold = temperatureColor(tOut ?? tIn ?? 32);
  const wash = active ? `url(#${gid})` : '#ffffff';

  return (
    <svg viewBox={`0 0 ${def.width} ${def.height}`} width="100%" height="100%" aria-hidden className="overflow-visible">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={hot} />
          <stop offset="100%" stopColor={cold} />
        </linearGradient>
      </defs>
      {def.symbol === 'buffer' ? <BufferBody def={def} wash={wash} active={active} /> : null}
      {def.symbol === 'radiator' ? <RadiatorBody def={def} wash={wash} active={active} /> : null}
      {def.symbol === 'underfloor' ? <FloorBody def={def} wash={wash} active={active} /> : null}
      {def.symbol === 'fancoil' ? <FanCoilBody def={def} wash={wash} active={active} /> : null}
      {def.symbol === 'dhw' ? <DhwBody def={def} wash={wash} active={active} /> : null}
      {def.symbol === 'pump' ? <PumpBody def={def} active={active} hot={hot} /> : null}
      {def.symbol === 'tee' ? <TeeBody def={def} active={active} hot={hot} /> : null}
      {def.symbol === 'heat-pump' ? <HeatPumpFallback def={def} /> : null}
      {stubs(def)}
    </svg>
  );
}

function BufferBody({ def, wash, active }: { def: ComponentDef; wash: string; active: boolean }) {
  const x = 18;
  const y = 10;
  const w = def.width - 36;
  const h = def.height - 20;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={w / 2} fill="#ffffff" stroke="#0f172a" strokeWidth={2.2} />
      {active ? <rect x={x} y={y} width={w} height={h} rx={w / 2} fill={wash} opacity={0.72} /> : null}
      <rect x={x} y={y} width={w} height={h} rx={w / 2} fill="none" stroke="#0f172a" strokeWidth={2.2} />
    </>
  );
}

function RadiatorBody({ def, wash, active }: { def: ComponentDef; wash: string; active: boolean }) {
  const x = 22;
  const y = 14;
  const w = def.width - 36;
  const h = def.height - 28;
  const bars = [0.18, 0.36, 0.5, 0.64, 0.82];
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#ffffff" stroke="#0f172a" strokeWidth={2.2} />
      {active ? <rect x={x} y={y} width={w} height={h} rx={6} fill={wash} opacity={0.8} /> : null}
      {bars.map((u) => (
        <line key={u} x1={x + w * u} y1={y + 6} x2={x + w * u} y2={y + h - 6} stroke="#0f172a" strokeWidth={1.6} />
      ))}
    </>
  );
}

function FloorBody({ def, wash, active }: { def: ComponentDef; wash: string; active: boolean }) {
  const x = 22;
  const y = 14;
  const w = def.width - 36;
  const h = def.height - 28;
  const d = `M ${x + 10} ${y + 12} H ${x + w - 12} V ${y + h / 2} H ${x + 14} V ${y + h - 12} H ${x + w - 12}`;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#ffffff" stroke="#0f172a" strokeWidth={2.2} />
      {active ? <rect x={x} y={y} width={w} height={h} rx={6} fill={wash} opacity={0.45} /> : null}
      <path d={d} fill="none" stroke={active ? '#0f172a' : '#0f172a'} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
    </>
  );
}

function FanCoilBody({ def, wash, active }: { def: ComponentDef; wash: string; active: boolean }) {
  const x = 22;
  const y = 14;
  const w = def.width - 36;
  const h = def.height - 28;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={6} fill="#ffffff" stroke="#0f172a" strokeWidth={2.2} />
      {active ? <rect x={x} y={y} width={w} height={h} rx={6} fill={wash} opacity={0.55} /> : null}
      <circle cx={x + w * 0.68} cy={y + h / 2} r={14} fill="#ffffff" stroke="#0f172a" strokeWidth={1.8} />
      <path d={`M ${x + w * 0.68} ${y + h / 2} v -10 M ${x + w * 0.68} ${y + h / 2} l 8 6 M ${x + w * 0.68} ${y + h / 2} l -8 6`} stroke="#0f172a" strokeWidth={1.6} strokeLinecap="round" />
      <path d={`M ${x + 12} ${y + 16} c 6 5 8 5 14 0 s 8-5 14 0 M ${x + 12} ${y + h / 2} c 6 5 8 5 14 0 s 8-5 14 0 M ${x + 12} ${y + h - 16} c 6 5 8 5 14 0 s 8-5 14 0`} fill="none" stroke="#0f172a" strokeWidth={1.5} strokeLinecap="round" />
    </>
  );
}

function DhwBody({ def, wash, active }: { def: ComponentDef; wash: string; active: boolean }) {
  const x = 22;
  const y = 8;
  const w = def.width - 36;
  const h = def.height - 16;
  const cx = x + w / 2;
  const coil = `M ${cx} ${y + 28} 
    c 14 0 14 10 0 10 s -14 10 0 10 
    s 14 10 0 10 s -14 10 0 10 
    s 14 10 0 10`;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={w / 2} fill="#ffffff" stroke="#0f172a" strokeWidth={2.2} />
      {active ? <rect x={x} y={y} width={w} height={h} rx={w / 2} fill={wash} opacity={0.45} /> : null}
      <path d={coil} fill="none" stroke="#0f172a" strokeWidth={1.7} strokeLinecap="round" />
    </>
  );
}

function PumpBody({ def, active, hot }: { def: ComponentDef; active: boolean; hot: string }) {
  const c = def.width / 2;
  const r = def.width / 2 - 16;
  return (
    <>
      <circle cx={c} cy={c} r={r} fill={active ? hot : '#ffffff'} stroke="#0f172a" strokeWidth={2.2} />
      <path d={`M ${c - 8} ${c - 12} L ${c + 14} ${c} L ${c - 8} ${c + 12} Z`} fill="#0f172a" />
    </>
  );
}

function TeeBody({ def, active, hot }: { def: ComponentDef; active: boolean; hot: string }) {
  const c = def.width / 2;
  return <circle cx={c} cy={def.height / 2} r={7} fill={active ? hot : '#ffffff'} stroke="#0f172a" strokeWidth={2} />;
}

function HeatPumpFallback({ def }: { def: ComponentDef }) {
  return (
    <rect x={8} y={10} width={def.width - 28} height={def.height - 20} rx={10} fill="#ffffff" stroke="#0f172a" strokeWidth={2} />
  );
}

export function portColor(side: PortDef['side'] | 'mixed'): string {
  if (side === 'supply') return '#ef4444';
  if (side === 'return') return '#2563eb';
  if (side === 'mixed') return '#d97706';
  return '#64748b';
}
