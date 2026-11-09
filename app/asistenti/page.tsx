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
    <section className="mx-auto flex min-h-[calc(100vh-200px)] w-full max-w-3xl flex-col px-4 py-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-blue-600">
          <Image src="/logo-white.png" alt="ECOTEK" width={30} height={30} className="h-8 w-8 object-contain" unoptimized />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Asistenti Virtual i ECOTEK</h1>
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
            Online — përgjigjet në shqip, nga manualet zyrtare
          </p>
        </div>
      </div>
      <ChatPanel
        autoFocus
        showHeader={false}
        className="h-[min(70vh,680px)] rounded-2xl border border-slate-200 shadow-xl"
      />
    </section>
  );
}
