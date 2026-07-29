"use client";

import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselSlide {
  src: string;
  alt: string;
  caption: string;
}

interface ClimateCarouselProps {
  slides: CarouselSlide[];
}

const SWIPE_THRESHOLD = 60; // px of drag before we treat it as a swipe

export function ClimateCarousel({ slides }: ClimateCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = (next: number) => {
    const clamped = (next + slides.length) % slides.length;
    setDirection(next > index ? 1 : -1);
    setIndex(clamped);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      go(index + 1);
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      go(index - 1);
    }
  };

  const slide = slides[index];

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-[2rem] shadow-card">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <img
            src={slide.src}
            alt={slide.alt}
            draggable={false}
            className="img-tinted h-full w-full object-cover"
          />
          <div className="img-tint" aria-hidden />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-14">
            <p className="text-lg font-semibold text-white">{slide.caption}</p>
          </div>
        </motion.div>
      </AnimatePresence>

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
