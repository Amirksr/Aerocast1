"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionHeading } from "../section-heading";
import { Reveal } from "../motion-primitives";
import { useI18n } from "../language-provider";

function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={i * 0.05} className="border-b border-slate-200/70 dark:border-white/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-medium sm:text-lg">{q}</span>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors ${
            open
              ? "border-brand-500 bg-brand-500 text-white"
              : "border-slate-200 text-slate-400 dark:border-white/10"
          }`}
        >
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-12 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  );
}

export function Faq() {
  const { t, dict } = useI18n();
  const items = dict.faq.items as Array<{ q: string; a: string }>;
  return (
    <section id="faq" className="container-page py-24 sm:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            eyebrow={t("faq.eyebrow")}
            title={
              <>
                {t("faq.title").split(" ")[0]}{" "}
                <span className="gradient-text">
                  {t("faq.title").split(" ").slice(1).join(" ")}
                </span>
              </>
            }
            description={t("faq.desc")}
          />
        </div>
        <div>
          {items.map((f, i) => (
            <FaqItem key={f.q} {...f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
