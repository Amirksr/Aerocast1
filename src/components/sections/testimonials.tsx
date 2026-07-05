"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "../section-heading";
import { RevealGroup, Reveal } from "../motion-primitives";
import { useI18n } from "../language-provider";

const GRADIENTS = [
  "from-rose-400 to-orange-400",
  "from-brand-500 to-sky-400",
  "from-emerald-400 to-teal-400",
  "from-amber-400 to-pink-400",
  "from-violet-400 to-indigo-400",
  "from-cyan-400 to-blue-400",
];

export function Testimonials() {
  const { t, dict } = useI18n();
  const items = dict.testimonials.items as Array<{
    quote: string;
    name: string;
    role: string;
  }>;

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow={t("testimonials.eyebrow")}
          title={
            <>
              {t("testimonials.title").split(" ")[0]}{" "}
              <span className="gradient-text">
                {t("testimonials.title").split(" ").slice(1).join(" ")}
              </span>
            </>
          }
          description={t("testimonials.desc")}
        />

        <RevealGroup className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {items.map((tt, i) => (
            <Reveal key={tt.name} className="break-inside-avoid">
              <figure className="relative rounded-3xl border border-slate-200/70 bg-white/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-card dark:border-white/10 dark:bg-slate-900/40">
                <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-500/15" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  “{tt.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} text-sm font-bold text-white`}
                  >
                    {tt.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{tt.name}</p>
                    <p className="text-xs text-slate-400">{tt.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
