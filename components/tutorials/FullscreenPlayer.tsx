'use client';

import { useEffect, useRef } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { X } from 'lucide-react';

interface Props {
  playbackId: string;
  title: string;
  onClose: () => void;
}

/**
 * Immersive fullscreen viewing experience: black viewport overlay with
 * nothing but the video and a close button. Mounted only while open,
 * unmounted on close (playback + audio fully stop).
 */
export default function FullscreenPlayer({ playbackId, title, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus the close button for keyboard users; Escape closes.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      {/* Video — as large as possible without cropping (16:9 fit). */}
      <div className="w-[min(100vw,177.78vh)]">
        <MuxPlayer
          playbackId={playbackId}
          metadata={{ video_title: title }}
          accentColor="#ffffff"
          autoPlay
          className="block aspect-video w-full"
          style={{ aspectRatio: '16 / 9', width: '100%' }}
        />
      </div>

      {/* The only chrome: a small unobtrusive close button. */}
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Mbyll videon"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
