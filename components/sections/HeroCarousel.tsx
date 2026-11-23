'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Icons for buttons

// Define the type for a single slide item
interface SlideItem {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

// Define the props for the HeroCarousel component
interface HeroCarouselProps {
  slides: SlideItem[];
}

const AUTOPLAY_MS = 6000;
const FADE_MS = 800;

/**
 * Smooth crossfade hero.
 *
 * Previous implementation rendered ONLY the active slide inside a single
 * AnimatePresence motion.div with x: ±1000 spring + opacity exit. That caused:
 *  1. Black flash — the exiting slide faded/moved out and exposed the
 *     section's `bg-black` before the entering slide arrived.
 *  2. Fully black slides — the entering slide's <Image> had never been
 *     fetched (only `priority` on slide 0), so Next.js fetched it on demand
 *     while the old slide was already gone.
 *  3. Fragile stacking — the image wrapper used `z-[-1]`, pushing it behind
 *     the section background in some stacking contexts.
 *
 * This version keeps ALL slide images mounted and stacked. The background
 * crossfades with a pure CSS opacity transition (no exit unmount, no x
 * slide on the image layer), preloads every image up front, and only flips
 * the visible layer once the target image has actually decoded — so there
 * is never an empty/black frame. Text content gets a small separate
 * fade/rise animation keyed by index.
 */
const HeroCarousel = ({ slides }: HeroCarouselProps) => {
  const [index, setIndex] = useState(0);
  // The slide whose background is actually shown. Lags behind `index` until
  // the target image has loaded, preventing any black frame.
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = slides.length;
  const active = slides[index];

  const markLoaded = useCallback((src: string) => {
    setLoaded((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  // Preload every hero image once, up front, so clicking "next" never
  // triggers a cold network fetch. Native Image() warms the browser cache;
  // next/image `eager` below warms the optimizer for the rendered sizes.
  useEffect(() => {
    slides.forEach((s) => {
      const img = new window.Image();
      img.src = s.image;
      img.onload = () => markLoaded(s.image);
      img.onerror = () => markLoaded(s.image); // don't block nav on a bad file
    });
  }, [slides, markLoaded]);

  // Flip the visible background as soon as the requested slide is ready.
  useEffect(() => {
    if (loaded.has(slides[index].image)) {
      setVisibleIndex(index);
    }
  }, [index, loaded, slides]);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % count) + count) % count);
    },
    [count]
  );

  const paginate = useCallback(
    (dir: number) => {
      setIndex((prev) => ((prev + dir) % count + count) % count);
    },
    [count]
  );

  // Auto-advance (resets on manual nav, pauses on hover/focus).
  useEffect(() => {
    if (paused || count <= 1) return;
    const t = setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, count, paginate]);

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950"
      style={{ height: '100vh' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) < 40) return;
        paginate(dx < 0 ? 1 : -1);
      }}
    >
      {/* Background layers — all mounted, crossfade via opacity. No unmount,
          so there is never an empty frame between slides. */}
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, i) => {
          const isVisible = i === visibleIndex;
          const isRequested = i === index;
          return (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity ease-in-out"
              style={{
                transitionDuration: `${FADE_MS}ms`,
                opacity: isVisible ? 1 : 0,
                zIndex: isVisible ? 1 : 0,
                // Keep the incoming layer on top while fading in so the old
                // image never peeks through mid-transition.
                ...(isRequested && !isVisible
                  ? { zIndex: 2, opacity: 0 }
                  : undefined),
                pointerEvents: 'none',
              }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                quality={80}
                priority={i < 2}
                loading="eager"
                fetchPriority={i === 0 ? 'high' : 'auto'}
                draggable={false}
                className="object-cover"
                onLoad={() => markLoaded(slide.image)}
              />
            </div>
          );
        })}
        {/* Readability gradient — also guarantees the hero never looks
            "broken black" even before the first image decodes. */}
        <div
          className="absolute inset-0 z-[3] bg-gradient-to-r from-black/70 via-black/35 to-black/10"
          aria-hidden="true"
        />
      </div>

      {/* Content — small fade/rise per slide, independent of the bg crossfade */}
      <div className="relative z-[4] h-full flex flex-col justify-center items-start container mx-auto px-4 md:px-6">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {active.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                {active.description}
              </p>
              <div>
                <Button asChild size="lg" className="bg-transparent hover:bg-white/10 text-white border border-white">
                  <Link href={active.buttonLink}>{active.buttonText}</Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Prev/Next Buttons */}
      <button
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
        onClick={() => paginate(-1)}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
        onClick={() => paginate(1)}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Navigation */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === index ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
