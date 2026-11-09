'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  Clock,
  Loader2,
  LockOpen,
  Send,
  Thermometer,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SUPPORT_PHONE = '+383 44 914 480';

const WELCOME_MESSAGE =
  "Përshëndetje! 👋 Jam asistenti virtual i ECOTEK. Si mund t'ju ndihmoj me pompën tuaj termike?";

const SUGGESTED_QUESTIONS = [
  'Si ta zhbllokoj ekranin?',
  'Si ta ndryshoj temperaturën?',
  'Si ta aktivizoj timerin?',
  'Çfarë do të thotë kodi i gabimit?',
];

// Template questions for the landing hero (icon + full question).
const HERO_OPTIONS = [
  { icon: LockOpen, question: 'Si ta zhbllokoj ekranin?' },
  { icon: Thermometer, question: 'Si ta ndryshoj temperaturën?' },
  { icon: Clock, question: 'Si ta aktivizoj timerin?' },
  { icon: AlertTriangle, question: 'Çfarë do të thotë kodi i gabimit?' },
];

export interface ChatImage {
  src: string;
  caption: string;
}

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
  /** Local controller/screen photos shown under button- or icon-related answers. */
  images?: ChatImage[];
}

// Photos of the ECOTEK controller (user-provided) in public/images/:
// - ecotek-controller.png: bottom buttons, rendered under button answers.
// - ecotek-screen-icons.png: full screen icons, rendered under mode/icon answers.
const CONTROLLER_IMAGE = '/images/ecotek-controller.png';
const SCREEN_ICONS_IMAGE = '/images/ecotek-screen-icons.png';
const SCREEN_ICONS_CAPTION = 'Ekrani ECOTEK — ikonat dhe modalitetet';

// Button/controller topics trigger the controller photo under the answer.
function isButtonTopic(text: string): boolean {
  const q = text.toLowerCase().replace(/ë/g, 'e').replace(/ç/g, 'c');
  return /buton|button|ekran|zhbllok|bllok|ky[cç]|timer|tajmer|modalitet|menyra|temperatur|mode|ndez|fik|simbol|shigjet|clock|ora|power/.test(q);
}

// Mode/screen-icon topics trigger the screen-icons photo under the answer.
function isIconTopic(text: string): boolean {
  const q = text.toLowerCase().replace(/ë/g, 'e').replace(/ç/g, 'c');
  return /ikon|modalitet|menyra|modus|diell|bore|bor[aë]|dush|ngrohje|ftohje|heating|cooling|dhw|sanitar|dysheme|floor/.test(q);
}

// Minimal safe formatter: paragraphs + numbered steps + **bold**.
function renderFormatted(text: string) {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let steps: string[] = [];
  let key = 0;

  const flushSteps = () => {
    if (steps.length === 0) return;
    blocks.push(
      <ol key={`steps-${key++}`} className="my-3 space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed sm:text-base">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {i + 1}
            </span>
            <span className="flex-1">{renderInline(s.replace(/^\d+[.)]\s*/, ''))}</span>
          </li>
        ))}
      </ol>
    );
    steps = [];
  };

  const renderInline = (line: string): React.ReactNode => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**') && p.length > 4 ? (
        <strong key={i} className="font-semibold">
          {p.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{p.replace(/\*\*/g, '')}</span>
      )
    );
  };

  for (const raw of lines) {
    const line = raw.trim();
    // Markdown images — only local /images/ paths are rendered (safety).
    const img = line.match(/^!\[([^\]]*)\]\((\/images\/[^)\s]+)\)$/);
    if (img) {
      flushSteps();
      blocks.push(
        <span key={`img-${key++}`} className="my-2 block overflow-hidden rounded-xl border border-slate-200">
          <img
            src={img[2]}
            alt={img[1] || 'Kontrolluesi ECOTEK'}
            className="h-auto w-full"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).closest('span')?.remove();
            }}
          />
        </span>
      );
    } else if (/^\d+[.)]\s+/.test(line)) {
      steps.push(line);
    } else {
      flushSteps();
      if (line) {
        blocks.push(
          <p key={`p-${key++}`} className="my-1.5 text-[15px] leading-relaxed sm:text-base">
            {renderInline(line)}
          </p>
        );
      }
    }
  }
  flushSteps();
  return blocks;
}

interface ChatPanelProps {
  /** When provided, a close (X) button is shown in the header. */
  onClose?: () => void;
  /** Extra classes for the panel container (size/position). */
  className?: string;
  /** Focus the input on mount. */
  autoFocus?: boolean;
  /** Show the blue branding header (default true). */
  showHeader?: boolean;
}

export default function ChatPanel({ onClose, className, autoFocus, showHeader = true }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: 'assistant', content: WELCOME_MESSAGE }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 250);
  }, [autoFocus]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || loading) return;
      setShowSuggestions(false);
      const next = [...messages, { role: 'user' as const, content: question }];
      setMessages(next);
      setInput('');
      setLoading(true);
      try {
      // Icon/mode questions get BOTH photos (screen icons + bottom buttons);
      // other button questions get just the bottom-buttons photo.
      const iconTopic = isIconTopic(question);
      const buttonTopic = isButtonTopic(question);
      const images: ChatImage[] = [];
      if (iconTopic) {
        images.push({ src: SCREEN_ICONS_IMAGE, caption: SCREEN_ICONS_CAPTION });
        images.push({ src: CONTROLLER_IMAGE, caption: 'Kontrolluesi ECOTEK — pamja e butonave' });
      } else if (buttonTopic) {
        images.push({ src: CONTROLLER_IMAGE, caption: 'Kontrolluesi ECOTEK — pamja e butonave' });
      }
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json().catch(() => null);
      const answer: string =
        data?.answer ||
        `Ndodhi një gabim. Ju lutem provoni përsëri ose na kontaktoni në ${SUPPORT_PHONE}.`;
      setMessages((prev) => [...prev, { role: 'assistant', content: answer, ...(images.length > 0 ? { images } : {}) }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Nuk u lidha dot me serverin. Ju lutem provoni përsëri ose na kontaktoni në ${SUPPORT_PHONE}.`,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages]
  );

  const started = messages.some((m) => m.role === 'user') || loading;

  // Minimal landing hero (ChatGPT-style): greeting, input bar,
  // template questions as option rows. Shown until chat starts.
  if (!started) {
    return (
      <div className={cn('flex flex-col items-center justify-center bg-white px-4 py-14 sm:py-20', className)}>
        <h2 className="text-center text-2xl font-medium text-slate-900 sm:text-3xl">
          Përshëndetje. Gati për të filluar?
        </h2>

        {/* Input bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="mt-8 flex w-full max-w-2xl items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 shadow-sm focus-within:border-blue-500"
        >
          <label htmlFor={inputId} className="sr-only">
            Shkruani pyetjen tuaj
          </label>
          <input
            id={inputId}
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pyesni asistentin ECOTEK…"
            maxLength={500}
            autoComplete="off"
            className="h-10 flex-1 bg-transparent text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-base"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Dërgo pyetjen"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        {/* Template questions as option rows */}
        <div className="mt-6 w-full max-w-2xl">
          {HERO_OPTIONS.map((o) => (
            <button
              key={o.question}
              type="button"
              onClick={() => void send(o.question)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] text-slate-600 hover:bg-slate-100 sm:text-base"
            >
              <o.icon className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
              {o.question}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col overflow-hidden bg-white', className)}>
      {/* Header */}
      {showHeader && (
      <div className="flex items-center gap-3 bg-blue-600 px-4 py-3 text-white">
        <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white">
          <Image src="/logo.png" alt="ECOTEK" width={28} height={28} className="h-7 w-7 object-contain" unoptimized />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">Asistenti ECOTEK</p>
          <p className="flex items-center gap-1.5 text-xs text-blue-100">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" aria-hidden="true" />
            Online — përgjigjet në shqip
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Mbyll dritaren e bisedës"
            className="rounded-full p-1.5 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
      )}

      {/* Messages — ChatGPT-style: plain full-width assistant rows, bubbled user rows */}
      <div ref={scrollRef} aria-live="polite" className="flex-1 space-y-6 overflow-y-auto bg-white px-4 py-6 sm:px-8">
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-2.5 text-[15px] leading-relaxed text-white shadow-sm sm:text-base">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={i} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600">
                <Image src="/logo-white.png" alt="ECOTEK" width={22} height={22} className="h-5 w-5 object-contain" unoptimized />
              </span>
              <div className="min-w-0 flex-1 text-slate-800">
                {renderFormatted(m.content)}
                {m.images?.map((img) => (
                  <span key={img.src} className="my-3 block max-w-xl overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={img.src}
                      alt={img.caption}
                      className="h-auto w-full"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).closest('span')?.remove();
                      }}
                    />
                    <span className="block bg-slate-100 px-2 py-1 text-center text-xs text-slate-500">
                      {img.caption}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )
        )}
        {loading && (
          <div className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600">
              <Image src="/logo-white.png" alt="ECOTEK" width={22} height={22} className="h-5 w-5 object-contain" unoptimized />
            </span>
            <div className="flex items-center gap-2 py-1">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" aria-hidden="true" />
              <span className="text-[15px] text-slate-500">Po kërkoj në manuale…</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 border-t border-slate-100 bg-white px-4 pt-3 sm:px-8">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => void send(q)}
              className="rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex items-center gap-3 bg-white p-4 sm:px-8"
      >
        <label htmlFor={inputId} className="sr-only">
          Shkruani pyetjen tuaj
        </label>
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Shkruani pyetjen…"
          maxLength={500}
          autoComplete="off"
          className="h-12 flex-1 rounded-2xl border border-slate-300 bg-slate-50 px-4 text-[15px] text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-600 focus:outline-none sm:text-base"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Dërgo pyetjen"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </form>
    </div>
  );
}
