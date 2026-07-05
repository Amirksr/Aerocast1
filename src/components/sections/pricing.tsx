"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { SectionHeading } from "../section-heading";
import { RevealGroup, Reveal } from "../motion-primitives";
import { useI18n } from "../language-provider";
import { cn } from "@/lib/utils";

const PLAN_KEYS = ["free", "pro", "business"] as const;

export function Pricing() {
  const { t, dict } = useI18n();
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="container-page py-24 sm:py-32">
      <SectionHeading
        eyebrow={t("pricing.eyebrow")}
        title={
          <>
            {t("pricing.title").split(" ")[0]}{" "}
            <span className="gradient-text">
              {t("pricing.title").split(" ").slice(1).join(" ")}
            </span>
          </>
        }
        description={t("pricing.desc")}
      />

      <div className="mt-8 flex items-center justify-center gap-3">
        <span className={cn("text-sm", !annual ? "font-semibold" : "text-slate-400")}>
          {t("pricing.monthly")}
        </span>
        <button
          onClick={() => setAnnual((a) => !a)}
          aria-label="Toggle annual billing"
          className="relative h-7 w-14 rounded-full bg-slate-200 p-1 transition-colors dark:bg-white/10"
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={cn(
              "block h-5 w-5 rounded-full bg-brand-500 shadow",
              annual ? "ml-auto" : ""
            )}
          />
        </button>
        <span className={cn("text-sm", annual ? "font-semibold" : "text-slate-400")}>
          {t("pricing.annual")} <span className="text-emerald-500">{t("pricing.save")}</span>
        </span>
      </div>

      <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-3">
        {PLAN_KEYS.map((key, i) => {
          const plan = dict.pricing.plans[key] as {
            name: string;
            tagline: string;
            cta: string;
            features: string[];
          };
          const monthly = key === "free" ? 0 : key === "pro" ? 6 : 29;
          const display = annual ? Math.round(monthly * 0.8) : monthly;
          const highlight = key === "pro";
          return (
            <Reveal key={key} delay={i * 0.08} className="relative">
              <div
                className={cn(
                  "flex h-full flex-col rounded-3xl p-8 transition-all duration-300",
                  highlight
                    ? "bg-gradient-to-b from-brand-600 to-brand-700 text-white shadow-glow ring-1 ring-brand-400/40"
                    : "border border-slate-200/70 bg-white/60 backdrop-blur-xl hover:-translate-y-1 hover:shadow-card dark:border-white/10 dark:bg-slate-900/40"
                )}
              >
                {highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-bold text-brand-600 shadow-md">
                    <Sparkles size={12} className="mr-1 inline" /> {t("pricing.popular")}
                  </span>
                )}
                <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                <p className={cn("mt-1 text-sm", highlight ? "text-brand-100" : "text-slate-400")}>
                  {plan.tagline}
                </p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-5xl font-bold">${display}</span>
                  <span className={cn("mb-1.5 text-sm", highlight ? "text-brand-100" : "text-slate-400")}>
                    /mo{annual && display > 0 ? ", billed yearly" : ""}
                  </span>
                </div>
                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check
                        size={18}
                        className={cn("mt-0.5 shrink-0", highlight ? "text-white" : "text-brand-500")}
                      />
                      <span className={highlight ? "text-brand-50" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    "mt-8 w-full rounded-full py-3 text-sm font-semibold transition-all",
                    highlight ? "bg-white text-brand-600 hover:bg-brand-50" : "btn-primary"
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            </Reveal>
          );
        })}
      </RevealGroup>
    </section>
  );
}
