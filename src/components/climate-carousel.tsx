"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselSlide {
  src: string;
  alt: string;
  caption: string;
}

interface ClimateCarouselProps {
  slides: CarouselSlide[];
  /** Autoplay interval in ms. Set to 0 to disable autoplay. */
  autoplayMs?: number;
}

const SWIPE_THRESHOLD = 40; // px of drag before we treat it as a swipe

export function ClimateCarousel({ slides, autoplayMs = 4500 }: ClimateCarouselProps) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);

  const paused = hovering || dragging;

  const go = (next: number) => setIndex((next + slides.length) % slides.length);

  useEffect(() => {
    if (!autoplayMs || paused || slides.length <= 1) return;
    const id = setInterval(() => go(index + 1), autoplayMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, autoplayMs, slides.length]);

  function handleStart(clientX: number) {
    startX.current = clientX;
    setDragging(true);
  }

  function handleEnd(clientX: number) {
    setDragging(false);
    if (startX.current === null) return;
    const delta = clientX - startX.current;
    startX.current = null;
    if (delta < -SWIPE_THRESHOLD) go(index + 1);
    else if (delta > SWIPE_THRESHOLD) go(index - 1);
  }

  const slide = slides[index];

  return (
    <div
      className="relative h-full w-full select-none overflow-hidden rounded-[2rem] shadow-card"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseUp={(e) => handleEnd(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
        className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      >
        <AnimatePresence mode="sync">
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-5 pt-14">
          <p className="text-lg font-semibold text-white">{slide.caption}</p>
        </div>
      </div>

      {/* Prev / next controls */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/50"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/50"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
