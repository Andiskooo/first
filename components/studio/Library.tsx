'use client';

import { useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { CATEGORY_ORDER, componentsByCategory } from '@/components/studio/registry';
import { ComponentArt } from '@/components/studio/symbols';
import { useStudioCopy } from '@/components/studio/copy';
import type { ComponentDef } from '@/components/studio/types';
import { cn } from '@/lib/utils';

export function Library({
  armedId,
  onArm,
}: {
  armedId: string | null;
  onArm: (componentId: string) => void;
}) {
  const text = useStudioCopy();
  const { locale } = useLanguage();
  const [query, setQuery] = useState('');
  const dragged = useRef(false);
  const needle = query.trim().toLowerCase();

  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-white lg:w-[272px] lg:border-r lg:border-slate-200">
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
                    onDragStart={() => { dragged.current = true; }}
                    onClick={() => {
                      if (dragged.current) {
                        dragged.current = false;
                        return;
                      }
                      onArm(item.id);
                    }}
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
    </aside>
  );
}

function PartCard({
  item,
  name,
  armed,
  onClick,
  onDragStart,
}: {
  item: ComponentDef;
  name: string;
  armed: boolean;
  onClick: () => void;
  onDragStart: () => void;
}) {
  return (
    <button
      type="button"
      draggable
      onClick={onClick}
      onDragStart={(event) => {
        onDragStart();
        event.dataTransfer.setData('application/x-ecotek-part', item.id);
        event.dataTransfer.setData('text/plain', item.id);
        event.dataTransfer.effectAllowed = 'move';
      }}
      className={cn(
        'flex flex-col items-center rounded-xl border bg-white px-2 py-2 text-center transition hover:border-slate-400',
        armed ? 'border-blue-600 ring-2 ring-blue-600' : 'border-slate-200',
      )}
      aria-pressed={armed}
    >
      <span className="flex h-16 w-full items-center justify-center">
        <span className="relative block h-14 w-full">
          <ComponentArt def={item} />
        </span>
      </span>
      <span className="mt-1 line-clamp-2 text-xs font-medium leading-4 text-slate-800">{name}</span>
      <span className="mt-0.5 text-[10px] font-semibold tracking-wide text-slate-400">{item.code}</span>
    </button>
  );
}
