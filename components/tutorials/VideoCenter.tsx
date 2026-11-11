'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { thumbnailUrl, tutorials } from '@/lib/tutorials';

// The player (and its Mux stream) mounts only while a video is open.
const FullscreenPlayer = dynamic(
  () => import('@/components/tutorials/FullscreenPlayer'),
  { ssr: false }
);

export default function VideoCenter() {
  const [openId, setOpenId] = useState<string | null>(null);
  const openRef = useRef<string | null>(null);
  const pushedRef = useRef(false);
  const nativeFsRef = useRef(false);
  const searchParams = useSearchParams();

  const openVideo = useCallback((id: string) => {
    openRef.current = id;
    setOpenId(id);
    // Freeze the grid behind the overlay (scroll position is preserved).
    document.body.style.overflow = 'hidden';
    // Native fullscreen, invoked directly from the user's click gesture.
    // Where unsupported (e.g. iPhone Safari) the fixed overlay already
    // covers the viewport, so this is a progressive enhancement.
    try {
      const p = document.documentElement.requestFullscreen?.();
      if (p && typeof (p as Promise<void>).then === 'function') {
        (p as Promise<void>)
          .then(() => {
            nativeFsRef.current = true;
          })
          .catch(() => {
            nativeFsRef.current = false;
          });
      }
    } catch {
      nativeFsRef.current = false;
    }
    // Let the browser back button close the video instead of leaving.
    try {
      history.pushState({ ecotekVideo: id }, '');
      pushedRef.current = true;
    } catch {
      pushedRef.current = false;
    }
  }, []);

  const closeVideo = useCallback((fromPopstate = false) => {
    if (openRef.current === null) return;
    openRef.current = null;
    setOpenId(null);
    document.body.style.overflow = '';
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    nativeFsRef.current = false;
    if (!fromPopstate && pushedRef.current) {
      pushedRef.current = false;
      history.back();
    }
  }, []);

  // Back navigation closes the overlay; a native-fullscreen exit
  // (e.g. Escape in fullscreen) returns to the grid as well.
  useEffect(() => {
    const onPopstate = () => {
      if (openRef.current !== null) {
        pushedRef.current = false;
        closeVideo(true);
      }
    };
    const onFsChange = () => {
      if (!document.fullscreenElement && nativeFsRef.current) {
        nativeFsRef.current = false;
        closeVideo();
      }
    };
    window.addEventListener('popstate', onPopstate);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => {
      window.removeEventListener('popstate', onPopstate);
      document.removeEventListener('fullscreenchange', onFsChange);
    };
  }, [closeVideo]);

  // Safety: never leave the body locked or audio playing.
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Deep link (e.g. from a chatbot video recommendation): open the exact
  // video in the fullscreen player when ?video=<id> is present.
  useEffect(() => {
    const vid = searchParams.get('video');
    if (vid && vid !== openRef.current && tutorials.some((t) => t.id === vid)) {
      openVideo(vid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const openTutorial = openId ? tutorials.find((t) => t.id === openId) : undefined;

  return (
    <>
      <ul aria-label="Video udhëzime" className="grid list-none grid-cols-2 gap-x-4 gap-y-7 p-0 md:grid-cols-3 lg:grid-cols-4">
        {tutorials.map((t, i) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => openVideo(t.id)}
              aria-label={`Shiko videon: ${t.title}`}
              className="group block w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 rounded-lg"
            >
              <span className="relative block aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={thumbnailUrl(t.playbackId, 640)}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading={i < 4 ? 'eager' : 'lazy'}
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-slate-900/0 transition group-hover:bg-slate-900/15">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-md transition group-hover:scale-105">
                    <Play className="ml-0.5 h-5 w-5 fill-slate-900 text-slate-900" aria-hidden="true" />
                  </span>
                </span>
              </span>
              <span className="mt-2 line-clamp-2 block text-[13px] font-normal leading-snug text-slate-700">
                {t.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {openTutorial && (
        <FullscreenPlayer
          playbackId={openTutorial.playbackId}
          title={openTutorial.title}
          onClose={() => closeVideo()}
        />
      )}
    </>
  );
}
