"use client";

import { useMemo } from "react";

interface WeatherBackgroundProps {
  theme: WeatherTheme;
  isDay?: boolean;
  /** Tint strength for the gradient overlay. */
  intensity?: number;
}

// Theme palettes (day / night) — used for the gradient wash behind content.
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

function useParticles(theme: WeatherTheme, isDay: boolean) {
  return useMemo(() => {
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const count =
      theme === "rain" || theme === "thunder"
        ? 60
        : theme === "snow"
        ? 40
        : theme === "cloudy" || theme === "fog"
        ? 3
        : 0;

    const rain = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: rand(0, 100),
      dur: rand(0.5, 1.1),
      delay: rand(0, 2),
      height: rand(50, 90),
    }));

    const snow = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: rand(0, 100),
      dur: rand(6, 12),
      delay: rand(0, 6),
      size: rand(3, 7),
    }));

    const clouds = [1, 2, 3];

    const stars =
      !isDay && (theme === "clear" || theme === "partly")
        ? Array.from({ length: 36 }).map((_, i) => ({
            id: i,
            left: rand(0, 100),
            top: rand(0, 70),
            dur: rand(2, 5),
            delay: rand(0, 3),
          }))
        : [];

    return { rain, snow, clouds, stars };
  }, [theme, isDay]);
}

export function WeatherBackground({
  theme,
  isDay = true,
  intensity = 1,
}: WeatherBackgroundProps) {
  const palette = PALETTES[theme][isDay ? "day" : "night"];
  const { rain, snow, clouds, stars } = useParticles(theme, isDay);

  return (
    <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
      {/* Base gradient wash */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `linear-gradient(160deg, ${palette[0]}, ${palette[1]} 55%, ${palette[2]})`,
          opacity: 0.16 * intensity,
        }}
      />

      <div className="weather-canvas">
        {/* Stars at night */}
        {stars.map((s) => (
          <span
            key={`star-${s.id}`}
            className="star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}

        {/* Sun during day for clear/partly */}
        {(theme === "clear" || theme === "partly") && isDay && (
          <div className="sun-core animate-pulse" />
        )}

        {/* Clouds */}
        {clouds.map((c) => (
          <span key={`cloud-${c}`} className={`cloud c${c}`} />
        ))}

        {/* Rain */}
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

        {/* Lightning flash for storms */}
        {theme === "thunder" && (
          <span className="lightning absolute inset-0" />
        )}
      </div>
    </div>
  );
}
