"use client";

import { motion } from "framer-motion";
import {
  Satellite,
  Smartphone,
  ShieldCheck,
  Bell,
  Globe2,
  LineChart,
  CloudSun,
  Accessibility,
} from "lucide-react";
import { SectionHeading } from "../section-heading";
import { RevealGroup, Reveal } from "../motion-primitives";
import { useT } from "../language-provider";

const FEATURE_KEYS = [
  "hyperlocal",
  "satellite",
  "alerts",
  "hourly",
  "anywhere",
  "privacy",
  "accessible",
  "mobile",
] as const;

const ICONS = {
  hyperlocal: CloudSun,
  satellite: Satellite,
  alerts: Bell,
  hourly: LineChart,
  anywhere: Globe2,
  privacy: ShieldCheck,
  accessible: Accessibility,
  mobile: Smartphone,
};

export function Features() {
  const t = useT();
  const titleWords = t("features.title").split(" ");
  return (
    <section id="features" className="container-page py-24 sm:py-32">
      <SectionHeading
        eyebrow={t("features.eyebrow")}
        title={
          <>
            {titleWords[0]}{" "}
            <span className="gradient-text">{titleWords.slice(1).join(" ")}</span>
          </>
        }
        description={t("features.desc")}
      />

      <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURE_KEYS.map((key) => {
          const Icon = ICONS[key];
          return (
            <Reveal
              key={key}
              as="div"
              className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-card dark:border-white/10 dark:bg-slate-900/40"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl transition-opacity group-hover:opacity-100 opacity-0" />
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-400 text-white shadow-glow">
                <Icon size={22} />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold">
                {t(`features.items.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {t(`features.items.${key}.desc`)}
              </p>
            </Reveal>
          );
        })}
      </RevealGroup>
    </section>
  );
}
