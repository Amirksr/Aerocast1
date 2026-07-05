"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useT } from "../language-provider";

function Counter({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1600, bounce: 0 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => {
    return spring.on("change", (v) => {
      // Compact formatting for large numbers (e.g. 2.48M).
      if (value >= 1_000_000) setDisplay(`${(v / 1_000_000).toFixed(2)}M`);
      else if (value >= 1_000) setDisplay(`${(v / 1_000).toFixed(0)}K`);
      else setDisplay(`${Math.round(v)}`);
    });
  }, [spring, value]);

  return (
    <div className="relative text-center">
      <div className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        <motion.span ref={ref}>{display}</motion.span>
        {suffix && <span className="text-brand-500">{suffix}</span>}
      </div>
      <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

export function Stats() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const t = useT();

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const items = [
    { key: "forecasts", label: t("stats.forecasts"), value: stats?.forecasts ?? 2480000 },
    { key: "cities", label: t("stats.cities"), value: stats?.cities ?? 198000 },
    { key: "subscribers", label: t("stats.subscribers"), value: stats?.subscribers ?? 124000 },
    { key: "uptime", label: t("stats.uptime"), value: stats?.uptime ?? 99.98, suffix: "%", raw: true },
  ];

  return (
    <section id="stats" className="relative overflow-hidden py-20">
      <div className="aurora left-1/4 top-0 h-72 w-72 bg-brand-500/30" />
      <div className="aurora right-1/4 bottom-0 h-72 w-72 bg-sky-500/30" />
      <div className="container-page relative">
        <div className="glass-strong mx-auto max-w-5xl rounded-[2rem] px-8 py-12 shadow-card">
          <div className="mb-10 flex items-center justify-center gap-2 text-sm font-medium text-brand-600 dark:text-brand-300">
            <TrendingUp size={18} />
            {t("stats.trusted")}
          </div>
          <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
            {items.map((it) =>
              it.raw ? (
                <div key={it.key} className="text-center">
                  <div className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                    {(it.value as number).toFixed(2)}
                    <span className="text-brand-500">%</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {it.label}
                  </p>
                </div>
              ) : (
                <Counter key={it.key} value={it.value as number} label={it.label} />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
