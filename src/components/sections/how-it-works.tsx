"use client";

import { motion } from "framer-motion";
import { Search, Database, Sparkles, BellRing } from "lucide-react";
import { SectionHeading } from "../section-heading";
import { Reveal } from "../motion-primitives";
import { useT } from "../language-provider";

const STEPS = [
  { icon: Search, key: "search" },
  { icon: Database, key: "data" },
  { icon: Sparkles, key: "ai" },
  { icon: BellRing, key: "alerts" },
] as const;

export function HowItWorks() {
  const t = useT();
  return (
    <section className="container-page py-24 sm:py-32">
      <SectionHeading
        eyebrow={t("how.eyebrow")}
        title={
          <>
            {t("how.title").split(" ")[0]}{" "}
            <span className="gradient-text">
              {t("how.title").split(" ").slice(1).join(" ")}
            </span>
          </>
        }
        description={t("how.desc")}
      />

      <div className="relative mt-16">
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent lg:block dark:via-brand-700" />
        <div className="grid gap-10 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.08} className="relative">
              <div className="flex flex-col items-start">
                <div className="relative">
                  <motion.span
                    className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-400 text-white shadow-glow"
                    initial={{ rotate: -6, scale: 0.8 }}
                    whileInView={{ rotate: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  >
                    <s.icon size={26} />
                  </motion.span>
                  <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-bold text-brand-600 shadow-md dark:bg-slate-800 dark:text-brand-300">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-lg font-bold">
                  {t(`how.steps.${s.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {t(`how.steps.${s.key}.desc`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
