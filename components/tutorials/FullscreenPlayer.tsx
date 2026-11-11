'use client';

import { useEffect, useRef } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { X } from 'lucide-react';
import type { TutorialOrientation } from '@/lib/tutorials';

interface Props {
  playbackId: string;
  title: string;
  orientation: TutorialOrientation;
  onClose: () => void;
}

/**
 * Immersive fullscreen viewing experience: black viewport overlay with
 * nothing but the video and a close button. Mounted only while open,
 * unmounted on close (playback + audio fully stop).
 *
 * Sizing follows the video's orientation (see `.tuto-player-*` in
 * globals.css): 9:16 phone videos fill the height, 16:9 videos fill the
 * width — never cropped, never stretched.
 */
export default function FullscreenPlayer({ playbackId, title, orientation, onClose }: Props) {
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
      {/* Video — as large as possible without cropping. */}
      <div className={orientation === 'portrait' ? 'tuto-player-portrait' : 'tuto-player-landscape'}>
        <MuxPlayer
          playbackId={playbackId}
          metadata={{ video_title: title }}
          accentColor="#ffffff"
          autoPlay
          className="block h-full w-full"
          style={{ height: '100%', width: '100%' }}
        />
      </div>

      {/* The only chrome: a small unobtrusive close button (safe-area aware). */}
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Mbyll videon"
        className="absolute top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))] flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
