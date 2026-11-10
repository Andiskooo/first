import ChatPanel from '@/components/chat/ChatPanel';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'Asistenti Virtual',
  'Bisedoni me asistencën virtual të ECOTEK për pompën tuaj termike — zhbllokimi i ekranit, temperatura, timerat, modalitetet dhe kodet e gabimit, në shqip.',
  '/asistenti'
);

export default function AsistentiPage() {
  return (
    <section
      aria-label="Asistenti virtual i ECOTEK"
      className="mx-auto flex h-full w-full flex-col overflow-hidden bg-[#f6f8fa] md:h-[calc(100dvh-160px)] md:min-h-[560px] md:px-6 md:py-6 lg:px-10"
    >
      {/* Page heading: desktop only — on mobile the chat header is the title,
          so this would waste fullscreen space and duplicate branding. */}
      <div className="hidden shrink-0 px-1 pb-4 sm:pb-5 md:block">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
          ECOTEK Support
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Asistenti Virtual i ECOTEK
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 sm:text-[15px]">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Online — përgjigjet në shqip, nga manualet zyrtare
        </p>
      </div>
      <ChatPanel
        autoFocus
        showHeader
        className="h-full min-h-0 w-full rounded-none border-0 shadow-none md:h-auto md:min-h-0 md:flex-1 md:rounded-[24px] md:border md:border-slate-200/80 md:shadow-[0_20px_60px_-20px_rgba(15,40,80,0.25)]"
      />
    </section>
  );
}
