'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChatPanel from '@/components/chat/ChatPanel';
import SupportTabs, { type SupportTab } from '@/components/tutorials/SupportTabs';
import VideoCenter from '@/components/tutorials/VideoCenter';
import { cn } from '@/lib/utils';

/** Online indicator driven by real browser connectivity state. */
function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);
  return online;
}

/**
 * Unified ECOTEK Support experience: shared header + Asistenti AI /
 * Video Udhëzime toggle. The chatbot stays mounted when switching tabs
 * so the conversation is never reset; only its visibility toggles.
 */
export default function SupportExperience() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<SupportTab>(
    searchParams.get('tab') === 'video' ? 'video' : 'chat'
  );
  const online = useOnlineStatus();
  const isChat = tab === 'chat';

  const handleTab = useCallback(
    (next: SupportTab) => {
      setTab(next);
      router.replace(next === 'video' ? '/asistenti?tab=video' : '/asistenti', {
        scroll: false,
      });
    },
    [router]
  );

  // Stay in sync with the URL (chatbot deep links, back/forward navigation).
  useEffect(() => {
    setTab(searchParams.get('tab') === 'video' ? 'video' : 'chat');
  }, [searchParams]);

  return (
    <section
      aria-label="Mbështetja ECOTEK"
      className={cn(
        'mx-auto w-full bg-[#f6f8fa]',
        // Chat tab: exact viewport-height app surface (messages scroll inside).
        // Video tab: normal page flow so the gallery scrolls naturally.
        isChat &&
          'flex h-dvh flex-col overflow-hidden md:h-[calc(100dvh-160px)] md:min-h-[560px]'
      )}
    >
      {/* Shared compact support header */}
      <div
        className={cn(
          'shrink-0',
          isChat ? 'px-4 pt-4 sm:pt-5 md:px-7 md:pt-6 lg:px-11' : 'px-4 pt-6 sm:px-6 md:pt-8 lg:px-8'
        )}
      >
        <div className={cn('w-full', !isChat && 'mx-auto max-w-7xl')}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600 sm:text-xs">
            ECOTEK Support
          </p>
          <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-[28px]">
            Asistenti Virtual i ECOTEK
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-slate-500 sm:text-sm">
            <span
              className={cn(
                'inline-block h-2 w-2 shrink-0 rounded-full',
                online ? 'bg-emerald-500' : 'bg-slate-400'
              )}
              aria-hidden="true"
            />
            {online
              ? 'Online — përgjigjet në shqip, nga manualet zyrtare'
              : 'Jeni offline — kontrolloni lidhjen me internetin'}
          </p>
        </div>
      </div>

      {/* Two-option toggle */}
      <div className={cn('shrink-0 px-4 pb-3 pt-3 sm:px-6 md:px-7 md:pb-4 lg:px-11', !isChat && 'mx-auto w-full max-w-7xl lg:px-8')}>
        <SupportTabs value={tab} onChange={handleTab} />
      </div>

      {/*
        Both panels stay mounted — `hidden` only toggles visibility, so the
        chatbot conversation (and its state) survives tab switches with no
        extra API calls. The video player mounts only inside the overlay.
      */}
      <div className={cn('flex min-h-0 flex-1 flex-col md:px-6 md:pb-6 lg:px-10', !isChat && 'hidden')}>
        <ChatPanel
          autoFocus={isChat}
          showHeader
          className="h-full min-h-0 w-full rounded-none border-0 shadow-none md:rounded-[24px] md:border md:border-slate-200/80 md:shadow-[0_20px_60px_-20px_rgba(15,40,80,0.25)]"
        />
      </div>
      <div className={cn('mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 md:pb-14 lg:px-8', isChat && 'hidden')}>
        <VideoCenter />
      </div>
    </section>
  );
}
