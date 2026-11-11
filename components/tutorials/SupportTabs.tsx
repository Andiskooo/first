'use client';

import { Bot, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SupportTab = 'chat' | 'video';

interface Props {
  value: SupportTab;
  onChange: (tab: SupportTab) => void;
}

const ITEMS = [
  { id: 'chat', label: 'Asistenti AI', Icon: Bot },
  { id: 'video', label: 'Video Udhëzime', Icon: PlayCircle },
] as const;

/**
 * Segmented two-option toggle for the unified Support page.
 * Controlled — switching tabs never unmounts remounts the page,
 * so the chatbot conversation is preserved.
 */
export default function SupportTabs({ value, onChange }: Props) {
  return (
    <nav aria-label="Mbështetja ECOTEK" className="mx-auto w-full max-w-3xl">
      <div
        role="tablist"
        aria-label="Zgjidh llojin e ndihmës"
        className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm"
      >
        {ITEMS.map(({ id, label, Icon }) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(id)}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-blue-600',
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
