'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import {
  AlertTriangle,
  BookOpen,
  Clock,
  LifeBuoy,
  Loader2,
  LockOpen,
  Menu,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  Power,
  RotateCcw,
  Send,
  Thermometer,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SUPPORT_PHONE = '+383 44 914 480';

const WELCOME_MESSAGE =
  "Përshëndetje! 👋 Jam asistenti virtual i ECOTEK. Si mund t'ju ndihmoj me pompën tuaj termike?";

const WELCOME_SUB =
  'Mund t’ju ndihmoj me ndezjen e pompës, timerin, kodet e gabimit, mënyrat e funksionimit dhe ekranin / kontrolluesin.';

const QUICK_PROMPTS = [
  { icon: Power, label: 'Si ta ndez pompën termike?' },
  { icon: AlertTriangle, label: 'Pse s’po ndizet pompa termike?' },
  { icon: Clock, label: 'Si ta ndaloj timerin?' },
  { icon: Clock, label: 'Si ta aktivizoj timerin?' },
  { icon: LockOpen, label: 'Si ta zhbllokoj ekranin?' },
  { icon: Thermometer, label: 'Si ta ndryshoj temperaturën?' },
  { icon: MessageCircle, label: 'Çfarë do të thotë kodi i gabimit?' },
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
  /** Local photo attached by the user (object URL, shown in the user bubble). */
  userImage?: string;
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
          <li key={i} className="flex gap-2.5 text-[14.5px] leading-relaxed sm:text-[15px]">
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
        <strong key={i} className="font-semibold text-slate-900">
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
          <p key={`p-${key++}`} className="my-1.5 text-[14.5px] leading-relaxed text-slate-700 sm:text-[15px]">
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attachPreview, setAttachPreview] = useState<string | null>(null);
  const [attachName, setAttachName] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 250);
  }, [autoFocus]);

  // Revoke object URLs when they are replaced or the chat resets.
  useEffect(() => {
    return () => {
      if (attachPreview?.startsWith('blob:')) URL.revokeObjectURL(attachPreview);
    };
  }, [attachPreview]);

  const resetChat = useCallback(() => {
    setMessages([{ role: 'assistant', content: WELCOME_MESSAGE }]);
    setInput('');
    if (attachPreview?.startsWith('blob:')) URL.revokeObjectURL(attachPreview);
    setAttachPreview(null);
    setAttachName('');
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [attachPreview]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if ((!question && !attachPreview) || loading) return;
      const finalText =
        question ||
        'Ju lutem shikoni foton e ekranit të kontrolluesit — çfarë duhet të bëj?';
      const userImage = attachPreview ?? undefined;
      const next = [...messages, { role: 'user' as const, content: finalText, ...(userImage ? { userImage } : {}) }];
      setMessages(next);
      setInput('');
      setAttachPreview(null);
      setAttachName('');
      setSidebarOpen(false);
      setLoading(true);
      try {
        // Icon/mode questions get BOTH photos (screen icons + bottom buttons);
        // other button questions get just the bottom-buttons photo.
        const iconTopic = isIconTopic(finalText);
        const buttonTopic = isButtonTopic(finalText);
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
    [loading, messages, attachPreview]
  );

  const pickImage = useCallback(() => fileRef.current?.click(), []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setAttachPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
    setAttachName(file.name);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const clearAttachment = useCallback(() => {
    setAttachPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return null;
    });
    setAttachName('');
  }, []);

  const started = messages.some((m) => m.role === 'user') || loading;

  const sidebar = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pb-2 pt-6">
        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-blue-600 shadow-sm">
          <Image src="/logo-white.png" alt="ECOTEK" width={28} height={28} className="h-7 w-7 object-contain" unoptimized />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-bold tracking-tight text-slate-900">ECOTEK</p>
          <p className="text-xs text-slate-500">Asistenti virtual</p>
        </div>
      </div>

      {/* New chat */}
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={resetChat}
          className="flex w-full items-center gap-2 rounded-xl bg-blue-50 px-3.5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Biseda e re
        </button>
      </div>

      {/* Nav */}
      <nav aria-label="Navigimi i asistentit" className="space-y-1 px-4 pt-5">
        <button
          type="button"
          onClick={() => void send('Çfarë mund të bëni për mua?')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <LifeBuoy className="h-[18px] w-[18px] shrink-0 text-slate-400" aria-hidden="true" />
          Ndihmë
        </button>
        <button
          type="button"
          onClick={() => void send('Si ta përdor kontrolluesin e pompës termike?')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <BookOpen className="h-[18px] w-[18px] shrink-0 text-slate-400" aria-hidden="true" />
          Manuale / Udhëzime
        </button>
        <button
          type="button"
          onClick={() => void send('Si mund ta kontaktoj ECOTEK?')}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <Phone className="h-[18px] w-[18px] shrink-0 text-slate-400" aria-hidden="true" />
          Kontakto
        </button>
      </nav>

      <div className="flex-1" />

      {/* Support card */}
      <div className="px-4 pb-3">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-600 to-teal-500 p-4 text-white shadow-md">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-white/10"
          />
          <p className="relative text-sm font-semibold leading-snug">
            Keni nevojë për ndihmë me pompën termike?
          </p>
          <p className="relative mt-1 text-xs leading-relaxed text-blue-100">
            Kontaktoni ekipin tonë për ndihmë të shpejtë.
          </p>
          <button
            type="button"
            onClick={() => void send('Dua të flas me ekipin e ECOTEK — si mund t’i kontaktoj?')}
            className="relative mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-[13px] font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-white"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            Na kontaktoni
          </button>
          <p className="relative mt-2 text-center text-[11px] font-medium tracking-wide text-blue-100">
            {SUPPORT_PHONE}
          </p>
        </div>
      </div>

      {/* Bottom utility */}
      <div className="border-t border-slate-100 px-4 py-3">
        <button
          type="button"
          onClick={resetChat}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <RotateCcw className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          Pastro bisedën
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        'relative flex overflow-hidden rounded-[24px] border border-slate-200/80 bg-[#eef1f5] shadow-[0_20px_60px_-20px_rgba(15,40,80,0.25)]',
        className
      )}
    >
      {/* Desktop sidebar */}
      <aside className="hidden w-[264px] shrink-0 border-r border-slate-200/70 bg-white/90 md:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition-opacity md:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl transition-transform duration-300 md:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex justify-end px-3 pt-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Mbyll menunë"
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1">{sidebar}</div>
        </div>
      </aside>

      {/* Main chat column */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#f6f8fa]">
        {/* Header */}
        {showHeader && (
          <header className="flex items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Hap menunë"
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-600 md:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 shadow-sm">
              <Image src="/logo-white.png" alt="ECOTEK" width={26} height={26} className="h-6 w-6 object-contain" unoptimized />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[15px] font-bold text-slate-900 sm:text-base">
                Asistenti ECOTEK
              </h2>
              <p className="flex items-center gap-1.5 truncate text-xs text-slate-500 sm:text-[13px]">
                <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                Asistent virtual për pompa termike
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                aria-label="Fillo bisedë të re"
                title="Fillo bisedë të re"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <RotateCcw className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Më shumë opsione"
                title="Më shumë opsione"
                onClick={() => setSidebarOpen(true)}
                className="hidden rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600 sm:block md:hidden"
              >
                <MoreVertical className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Mbyll dritaren e bisedës"
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          </header>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          aria-live="polite"
          className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10"
        >
          {!started ? (
            <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center py-8 text-center">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
                <Image src="/logo-white.png" alt="ECOTEK" width={36} height={36} className="h-9 w-9 object-contain" unoptimized />
              </span>
              <h3 className="mt-5 max-w-md text-balance text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                {WELCOME_MESSAGE}
              </h3>
              <p className="mt-3 max-w-md text-balance text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                {WELCOME_SUB}
              </p>
              <div className="mt-7 flex w-full flex-wrap items-center justify-center gap-2">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => void send(p.label)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <p.icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl space-y-5">
              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[88%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-white shadow-md shadow-blue-600/20 sm:max-w-[75%]">
                      {m.userImage && (
                        <span className="mb-2 block overflow-hidden rounded-xl">
                          <img
                            src={m.userImage}
                            alt="Foto e bashkangjitur nga klienti"
                            className="h-auto w-full max-w-[320px]"
                            loading="lazy"
                          />
                        </span>
                      )}
                      <p className="text-[14.5px] leading-relaxed sm:text-[15px]">{m.content}</p>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 shadow-sm">
                      <Image src="/logo-white.png" alt="ECOTEK" width={22} height={22} className="h-5 w-5 object-contain" unoptimized />
                    </span>
                    <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
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
                          <span className="block bg-slate-50 px-2 py-1 text-center text-xs text-slate-500">
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
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 shadow-sm">
                    <Image src="/logo-white.png" alt="ECOTEK" width={22} height={22} className="h-5 w-5 object-contain" unoptimized />
                  </span>
                  <div
                    className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-slate-200/80 bg-white px-4 py-3 shadow-sm"
                    role="status"
                    aria-label="Asistenti po shkruan"
                  >
                    <span className="flex items-center gap-1" aria-hidden="true">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
                    </span>
                    <span className="text-[13px] text-slate-500">Po kërkoj në manuale…</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Prompt chips (after chat starts) */}
        {started && (
          <div className="border-t border-slate-200/60 bg-[#f6f8fa] px-4 pt-3 sm:px-6 lg:px-10">
            <div className="mx-auto flex w-full max-w-3xl gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => void send(p.label)}
                  disabled={loading}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-50 sm:shrink"
                >
                  <p.icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <div className="bg-[#f6f8fa] px-4 pb-4 pt-2 sm:px-6 sm:pb-5 lg:px-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="mx-auto w-full max-w-3xl"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_24px_-12px_rgba(15,40,80,0.25)] transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
              {/* Image preview */}
              {attachPreview && (
                <div className="flex items-center gap-3 px-2 pb-2 pt-1">
                  <span className="relative block h-14 w-14 overflow-hidden rounded-xl border border-slate-200">
                    <img src={attachPreview} alt="Parapamje e fotos" className="h-full w-full object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs text-slate-500">
                    {attachName || 'Foto e bashkangjitur'}
                  </span>
                  <button
                    type="button"
                    onClick={clearAttachment}
                    aria-label="Hiq foton e bashkangjitur"
                    className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onFileChange}
                  aria-label="Bashkangjit foto"
                />
                <button
                  type="button"
                  onClick={pickImage}
                  aria-label="Bashkangjit një foto të ekranit"
                  title="Bashkangjit foto (p.sh. gabimi në ekran)"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <Paperclip className="h-5 w-5" aria-hidden="true" />
                </button>
                <label htmlFor={inputId} className="sr-only">
                  Shkruani pyetjen tuaj
                </label>
                <input
                  id={inputId}
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pyetni për timerin, kodet e gabimeve, ekranin…"
                  maxLength={500}
                  autoComplete="off"
                  className="h-11 min-w-0 flex-1 bg-transparent text-[14.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none sm:text-[15px]"
                />
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && !attachPreview)}
                  aria-label="Dërgo pyetjen"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <Send className="h-[18px] w-[18px]" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] leading-relaxed text-slate-400">
              Përgjigjet bazohen në manualet zyrtare të ECOTEK, në shqip.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
