'use client';

import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { CATEGORY_ORDER, componentsByCategory } from '@/components/studio/registry';
import { pointerGesture } from '@/components/studio/place';
import { ComponentArt } from '@/components/studio/symbols';
import { useStudioCopy } from '@/components/studio/copy';
import type { ComponentDef } from '@/components/studio/types';
import { cn } from '@/lib/utils';

export function Library({
  armedId,
  onArm,
  onPlace,
}: {
  armedId: string | null;
  onArm: (componentId: string) => void;
  /** Client coordinates. The canvas converts them with screenToFlowPosition. */
  onPlace: (componentId: string, clientX: number, clientY: number) => void;
}) {
  const text = useStudioCopy();
  const { locale } = useLanguage();
  const [query, setQuery] = useState('');
  const [ghost, setGhost] = useState<{ name: string; code: string; x: number; y: number } | null>(null);
  const needle = query.trim().toLowerCase();

  return (
    <aside className="studio-library flex h-full min-h-0 w-full flex-col bg-white lg:w-[272px] lg:border-r lg:border-slate-200">
      <div className="border-b border-slate-200 p-3">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={text.search}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
            aria-label={text.search}
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {CATEGORY_ORDER.map((category) => {
          const items = componentsByCategory(category).filter((item) => {
            if (!needle) return true;
            return [item.code, item.name[locale], item.blurb[locale], item.id].join(' ').toLowerCase().includes(needle);
          });
          if (!items.length) return null;
          return (
            <section key={category} className="mb-4">
              <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{text.categories[category]}</h2>
              <div className="grid grid-cols-2 gap-2">
                {items.map((item) => (
                  <PartCard
                    key={item.id}
                    item={item}
                    name={item.name[locale]}
                    armed={armedId === item.id}
                    onArm={() => onArm(item.id)}
                    onPlace={(x, y) => onPlace(item.id, x, y)}
                    onGhost={(point) => setGhost(point ? { name: item.name[locale], code: item.code, ...point } : null)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <div className="flex items-center gap-4 border-t border-slate-200 px-4 py-3 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />{text.legendSupply}</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-600" />{text.legendReturn}</span>
      </div>
      {ghost && typeof document !== 'undefined' ? createPortal(
        <div
          data-part-ghost
          className="pointer-events-none fixed z-[80] flex items-center gap-2 rounded-xl border border-slate-300 bg-white/95 px-3 py-2 text-xs font-medium text-slate-800 shadow-lg"
          style={{ left: ghost.x + 14, top: ghost.y + 14 }}
        >
          <span className="font-semibold tracking-wide text-slate-400">{ghost.code}</span>
          {ghost.name}
        </div>,
        document.body,
      ) : null}
    </aside>
  );
}

function releaseOverCanvas(x: number, y: number): boolean {
  const canvas = document.querySelector('[data-studio-canvas]');
  if (!canvas) return false;
  const rect = canvas.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function PartCard({
  item,
  name,
  armed,
  onArm,
  onPlace,
  onGhost,
}: {
  item: ComponentDef;
  name: string;
  armed: boolean;
  onArm: () => void;
  onPlace: (clientX: number, clientY: number) => void;
  onGhost: (point: { x: number; y: number } | null) => void;
}) {
  const gesture = useRef<{ pointerId: number; x: number; y: number; moved: boolean } | null>(null);
  const swallowClick = useRef(false);

  return (
    <button
      type="button"
      data-part-card={item.id}
      aria-pressed={armed}
      style={{ touchAction: 'none' }}
      onPointerDown={(event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        gesture.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
      }}
      onPointerMove={(event) => {
        const current = gesture.current;
        if (!current || event.pointerId !== current.pointerId) return;
        if (!current.moved && pointerGesture(event.clientX - current.x, event.clientY - current.y) === 'tap') return;
        current.moved = true;
        onGhost({ x: event.clientX, y: event.clientY });
      }}
      onPointerUp={(event) => {
        const current = gesture.current;
        gesture.current = null;
        onGhost(null);
        if (!current || event.pointerId !== current.pointerId) return;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        if (!current.moved) return;
        swallowClick.current = true;
        if (releaseOverCanvas(event.clientX, event.clientY)) onPlace(event.clientX, event.clientY);
      }}
      onPointerCancel={() => {
        gesture.current = null;
        onGhost(null);
      }}
      onClick={() => {
        if (swallowClick.current) {
          swallowClick.current = false;
          return;
        }
        onArm();
      }}
      className={cn(
        'flex touch-none select-none flex-col items-center rounded-xl border bg-white px-2 py-2 text-center transition hover:border-slate-400',
        armed ? 'border-blue-600 ring-2 ring-blue-600' : 'border-slate-200',
      )}
    >
      <span className="pointer-events-none flex h-16 w-full items-center justify-center">
        <span className="relative block h-14 w-full">
          <ComponentArt def={item} />
        </span>
      </span>
      <span className="mt-1 line-clamp-2 text-xs font-medium leading-4 text-slate-800">{name}</span>
      <span className="mt-0.5 text-[10px] font-semibold tracking-wide text-slate-400">{item.code}</span>
    </button>
  );
}
