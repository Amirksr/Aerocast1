"use client";

import { useMemo } from "react";
import type { WeatherTheme } from "@/lib/weather";

interface WeatherBackgroundProps {
  theme: WeatherTheme;
  isDay?: boolean;
  /** Tint strength for the gradient overlay. */
  intensity?: number;
}

// Theme palettes (day / night) — this gradient wash is the only thing that
// conveys day vs. night and general "mood" of the sky. It's a static tint,
// not an animation, so it can never look inconsistent with reality.
const PALETTES: Record<
  WeatherTheme,
  { day: [string, string, string]; night: [string, string, string] }
> = {
  clear: { day: ["#7dd3fc", "#bae6fd", "#e0f2fe"], night: ["#0c1a3a", "#16224a", "#1e293b"] },
  partly: { day: ["#7dd3fc", "#bcd9ff", "#eef6ff"], night: ["#0c1a3a", "#172554", "#1e293b"] },
  cloudy: { day: ["#94a3b8", "#cbd5e1", "#e2e8f0"], night: ["#0f172a", "#1e293b", "#334155"] },
  fog: { day: ["#cbd5e1", "#e2e8f0", "#f1f5f9"], night: ["#1e293b", "#334155", "#475569"] },
  drizzle: { day: ["#38bdf8", "#7dd3fc", "#bae6fd"], night: ["#0c1a3a", "#13325c", "#1e293b"] },
  rain: { day: ["#0284c7", "#0ea5e9", "#38bdf8"], night: ["#0a1228", "#0c1a3a", "#102a4c"] },
  snow: { day: ["#bae6fd", "#e0f2fe", "#f0f9ff"], night: ["#0f172a", "#1e3a5f", "#2a3f5f"] },
  thunder: { day: ["#1e293b", "#334155", "#4c1d95"], night: ["#020617", "#0c0a1f", "#1e1b4b"] },
};

// Only these themes get a moving-particle animation. Everything else
// (clear, partly, cloudy, fog) is represented solely by the static gradient
// above — no decorative stars/sun-pulse/clouds that could look disconnected
// from the actual condition.
const RAIN_THEMES: WeatherTheme[] = ["rain", "drizzle", "thunder"];

function useParticles(theme: WeatherTheme) {
  return useMemo(() => {
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const rainCount = RAIN_THEMES.includes(theme) ? 60 : 0;
    const rain = Array.from({ length: rainCount }).map((_, i) => ({
      id: i,
      left: rand(0, 100),
      dur: rand(0.5, 1.1),
      delay: rand(0, 2),
      height: rand(50, 90),
    }));

    const snowCount = theme === "snow" ? 40 : 0;
    const snow = Array.from({ length: snowCount }).map((_, i) => ({
      id: i,
      left: rand(0, 100),
      dur: rand(6, 12),
      delay: rand(0, 6),
      size: rand(3, 7),
    }));

    return { rain, snow };
  }, [theme]);
}

export function WeatherBackground({
  theme,
  isDay = true,
  intensity = 1,
}: WeatherBackgroundProps) {
  const palette = PALETTES[theme][isDay ? "day" : "night"];
  const { rain, snow } = useParticles(theme);

  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      {/* Base gradient wash — the only day/night + mood signal, and it's static. */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `linear-gradient(160deg, ${palette[0]}, ${palette[1]} 55%, ${palette[2]})`,
          opacity: 0.16 * intensity,
        }}
      />

      <div className="weather-canvas">
        {/* Rain (also used for drizzle and thunderstorms) */}
        {rain.map((r) => (
          <span
            key={`rain-${r.id}`}
            className="rain"
            style={{
              left: `${r.left}%`,
              height: `${r.height}px`,
              animationDuration: `${r.dur}s`,
              animationDelay: `${r.delay}s`,
            }}
          />
        ))}

        {/* Snow */}
        {snow.map((s) => (
          <span
            key={`snow-${s.id}`}
            className="snow"
            style={{
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        {/* Lightning flash — only during thunderstorms, alongside the rain above. */}
        {theme === "thunder" && <span className="lightning absolute inset-0" />}
      </div>
    </div>
  );
}
