"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import type { GeoPlace } from "@/lib/weather";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  place: GeoPlace;
  className?: string;
}

export function FavoriteButton({ place, className }: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: place.id,
          name: place.name,
          admin1: place.admin1,
          country: place.country,
          countryCode: place.country_code,
          latitude: place.latitude,
          longitude: place.longitude,
        }),
      });
      if (res.ok) {
        const next = !saved;
        setSaved(next);
        if (next) {
          setBurst(true);
          setTimeout(() => setBurst(false), 700);
        }
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      className={cn(
        "relative grid h-11 w-11 place-items-center rounded-full border transition-colors",
        saved
          ? "border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-500/30 dark:bg-rose-500/10"
          : "border-slate-200 bg-white/70 text-slate-500 hover:text-rose-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
        className
      )}
    >
      <motion.span
        animate={saved ? { scale: [1, 1.35, 1] } : {}}
        transition={{ duration: 0.4 }}
      >
        <Heart size={19} fill={saved ? "currentColor" : "none"} />
      </motion.span>
      <AnimatePresence>
        {burst && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-rose-400"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i / 6) * Math.PI * 2) * 18,
                  y: Math.sin((i / 6) * Math.PI * 2) * 18,
                  opacity: 0,
                  scale: 0.4,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </button>
  );
}
