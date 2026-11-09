import Image from 'next/image';
import ChatPanel from '@/components/chat/ChatPanel';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata(
  'Asistenti Virtual',
  'Bisedoni me asistencën virtual të ECOTEK për pompën tuaj termike — zhbllokimi i ekranit, temperatura, timerat, modalitetet dhe kodet e gabimit, në shqip.',
  '/asistenti'
);

export default function AsistentiPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-4xl flex-col px-4 py-6 sm:py-8">
      <div className="mb-5 flex items-center gap-3 px-1 sm:px-2">
        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-600">
          <Image src="/logo-white.png" alt="ECOTEK" width={32} height={32} className="h-9 w-9 object-contain" unoptimized />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Asistenti Virtual i ECOTEK</h1>
          <p className="flex items-center gap-1.5 text-[15px] text-slate-500">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
            Online — përgjigjet në shqip, nga manualet zyrtare
          </p>
        </div>
      </div>
      <ChatPanel
        autoFocus
        showHeader={false}
        className="h-[min(75vh,760px)] rounded-2xl border border-slate-200 shadow-xl"
      />
    </section>
  );
}
