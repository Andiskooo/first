'use client';

import Image from 'next/image';
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
      <div className="relative h-full w-full">
        <Image
          src={def.asset}
          alt=""
          fill
          sizes="220px"
          draggable={false}
          className="pointer-events-none select-none object-contain"
        />
      </div>
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
      {def.symbol === 'junction' ? <JunctionBody def={def} active={active} hot={hot} /> : null}
      {def.symbol === 'manifold-supply' || def.symbol === 'manifold-return' ? <ManifoldBody def={def} wash={wash} active={active} /> : null}
      {def.symbol === 'valve' ? <ValveBody def={def} active={active} hot={hot} /> : null}
      {def.symbol === 'valve-3way' ? <ThreeWayBody def={def} active={active} hot={hot} /> : null}
      {def.symbol === 'mixer' ? <MixerBody def={def} active={active} hot={hot} /> : null}
      {def.symbol === 'relief' ? <ReliefBody def={def} active={active} hot={hot} /> : null}
      {def.symbol === 'air-vent' ? <AirVentBody def={def} /> : null}
      {def.symbol === 'check' ? <CheckBody def={def} active={active} hot={hot} /> : null}
      {def.symbol === 'thermostat' ? <ThermostatBody def={def} /> : null}
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

export function portColor(side: PortDef['side'] | 'mixed' | 'signal'): string {
  if (side === 'supply') return '#ef4444';
  if (side === 'return') return '#2563eb';
  if (side === 'mixed') return '#d97706';
  if (side === 'signal') return '#7c3aed';
  return '#64748b';
}

function JunctionBody({ def, active, hot }: { def: ComponentDef; active: boolean; hot: string }) {
  const c = def.width / 2;
  return <circle cx={c} cy={c} r={8} fill={active ? hot : '#ffffff'} stroke="#0f172a" strokeWidth={2.2} />;
}

function ManifoldBody({ def, wash, active }: { def: ComponentDef; wash: string; active: boolean }) {
  return (
    <>
      <rect x={10} y={18} width={def.width - 20} height={def.height - 36} rx={def.height / 2} fill="#ffffff" stroke="#0f172a" strokeWidth={2.2} />
      {active ? <rect x={10} y={18} width={def.width - 20} height={def.height - 36} rx={def.height / 2} fill={wash} opacity={0.8} /> : null}
    </>
  );
}

function ValveBody({ def, active, hot }: { def: ComponentDef; active: boolean; hot: string }) {
  const y = def.height * 0.62;
  const mid = def.width / 2;
  return (
    <>
      <path d={`M 16 ${y - 16} L ${mid} ${y} L 16 ${y + 16} Z`} fill={active ? hot : '#ffffff'} stroke="#0f172a" strokeWidth={2} />
      <path d={`M ${def.width - 16} ${y - 16} L ${mid} ${y} L ${def.width - 16} ${y + 16} Z`} fill={active ? hot : '#ffffff'} stroke="#0f172a" strokeWidth={2} />
    </>
  );
}

function ThreeWayBody({ def, active, hot }: { def: ComponentDef; active: boolean; hot: string }) {
  const y = def.height * 0.46;
  const mid = def.width / 2;
  return (
    <>
      <path d={`M 14 ${y - 14} L ${mid} ${y} L 14 ${y + 14} Z`} fill={active ? hot : '#ffffff'} stroke="#0f172a" strokeWidth={2} />
      <path d={`M ${def.width - 14} ${y - 14} L ${mid} ${y} L ${def.width - 14} ${y + 14} Z`} fill={active ? hot : '#ffffff'} stroke="#0f172a" strokeWidth={2} />
      <path d={`M ${mid - 14} ${def.height - 12} L ${mid} ${y} L ${mid + 14} ${def.height - 12} Z`} fill={active ? hot : '#ffffff'} stroke="#0f172a" strokeWidth={2} />
    </>
  );
}

function MixerBody({ def, active, hot }: { def: ComponentDef; active: boolean; hot: string }) {
  const mid = def.width / 2;
  const cy = def.height / 2;
  const fill = active ? hot : '#ffffff';
  return (
    <>
      <path d={`M 18 ${cy - 30} L ${mid - 2} ${cy - 2} L 18 ${cy - 8} Z`} fill={fill} stroke="#b91c1c" strokeWidth={2} />
      <path d={`M 18 ${cy + 8} L ${mid - 2} ${cy + 2} L 18 ${cy + 30} Z`} fill="#ffffff" stroke="#1d4ed8" strokeWidth={2} />
      <path d={`M ${def.width - 16} ${cy - 16} L ${mid + 4} ${cy} L ${def.width - 16} ${cy + 16} Z`} fill={fill} stroke="#0f172a" strokeWidth={2} />
      <circle cx={mid} cy={cy} r={11} fill="#ffffff" stroke="#0f172a" strokeWidth={1.6} />
      <text x={mid} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0f172a" fontFamily="ui-sans-serif, system-ui, sans-serif">M</text>
    </>
  );
}

function ReliefBody({ def, active, hot }: { def: ComponentDef; active: boolean; hot: string }) {
  const y = def.height * 0.55;
  const mid = def.width / 2;
  return (
    <>
      <path d={`M 16 ${y - 14} L ${mid} ${y} L 16 ${y + 14} Z`} fill="#ffffff" stroke="#0f172a" strokeWidth={2} />
      <path d={`M ${def.width - 16} ${y - 14} L ${mid} ${y} L ${def.width - 16} ${y + 14} Z`} fill={active ? hot : '#ffffff'} stroke="#0f172a" strokeWidth={2} />
      <path d={`M ${mid} ${y} V 8`} stroke="#0f172a" strokeWidth={2} />
      <path d={`M ${mid - 8} 14 H ${mid + 8}`} stroke="#0f172a" strokeWidth={2} strokeLinecap="round" />
    </>
  );
}

function AirVentBody({ def }: { def: ComponentDef }) {
  const c = def.width / 2;
  return (
    <>
      <circle cx={c} cy={28} r={14} fill="#ffffff" stroke="#0f172a" strokeWidth={2} />
      <path d={`M ${c} 34 V 18 M ${c - 5} 24 l 5 -6 5 6`} fill="none" stroke="#0f172a" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M 16 ${def.height * 0.72} H ${def.width - 16}`} stroke="#0f172a" strokeWidth={2.2} strokeLinecap="round" />
    </>
  );
}

function CheckBody({ def, active, hot }: { def: ComponentDef; active: boolean; hot: string }) {
  const y = def.height / 2;
  const mid = def.width / 2;
  return (
    <>
      <circle cx={mid} cy={y} r={18} fill={active ? hot : '#ffffff'} stroke="#0f172a" strokeWidth={2} />
      <path d={`M ${mid - 8} ${y - 7} L ${mid + 9} ${y} L ${mid - 8} ${y + 7} Z`} fill="#0f172a" />
    </>
  );
}

function ThermostatBody({ def }: { def: ComponentDef }) {
  const c = def.width / 2;
  return (
    <>
      <rect x={8} y={6} width={def.width - 16} height={def.height - 20} rx={12} fill="#ffffff" stroke="#0f172a" strokeWidth={2} />
      <circle cx={c} cy={40} r={18} fill="#ffffff" stroke="#0f172a" strokeWidth={1.8} />
      <path d={`M ${c} 40 l 10 -8`} stroke="#7c3aed" strokeWidth={2} strokeLinecap="round" />
      <circle cx={c} cy={40} r={2.2} fill="#7c3aed" />
    </>
  );
}
