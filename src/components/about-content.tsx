"use client";

import { motion } from "framer-motion";
import {
  Target,
  Heart,
  Zap,
  Globe2,
  ShieldCheck,
  Users,
  Rocket,
  Database,
  Palette,
  Wind,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { RevealGroup, Reveal } from "@/components/motion-primitives";
import { TeamCard } from "@/components/team-card";
import { useI18n } from "@/components/language-provider";
import { T } from "@/components/t";

const VALUE_ICONS: Record<string, any> = {
  accuracy: Target,
  fast: Zap,
  detail: Heart,
  privacy: ShieldCheck,
  everyone: Globe2,
  community: Users,
};

const VALUE_ORDER = ["accuracy", "fast", "detail", "privacy", "everyone", "community"];

const STACK_ORDER = ["next", "tailwind", "framer", "mongo", "openmeteo", "themes"];

const TEAM_GRADIENTS = [
  "from-brand-500 to-sky-400",
  "from-emerald-400 to-teal-400",
  "from-rose-400 to-orange-400",
  "from-violet-400 to-indigo-400",
];

export function AboutContent() {
  const { t, dict } = useI18n();
  const values = dict.about.values as Record<string, { title: string; desc: string }>;
  const timeline = dict.about.timeline as Array<{ year: string; title: string; desc: string }>;
  const stack = dict.about.stack as Record<string, { name: string; desc: string }>;
  const team = dict.about.team as Array<{ name: string; role: string }>;

  return (
    <div className="pb-20 pt-28 sm:pt-36">
      {/* Hero */}
      <section className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="chip"><T k="about.heroBadge" /></span>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="gradient-text">{t("about.heroTitle")}</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            {t("about.heroDesc")}
          </p>
        </div>
      </section>

      {/* Hero banner */}
      <section className="container-page mt-12">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-card">
            <img
              src="/images/aerial-clouds.jpg"
              alt="Aerial view of sunrise over a sea of clouds"
              className="img-tinted h-64 w-full object-cover sm:h-80"
            />
            <div className="img-tint" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="container-page py-20">
        <SectionHeading eyebrow={t("about.valuesEyebrow")} title={t("about.valuesTitle")} />
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUE_ORDER.map((key, i) => {
            const Icon = VALUE_ICONS[key];
            return (
              <Reveal key={key} delay={i * 0.05} className="rounded-3xl border border-slate-200/70 bg-white/60 p-6 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-400 text-white shadow-glow">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">{values[key].title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{values[key].desc}</p>
              </Reveal>
            );
          })}
        </RevealGroup>
      </section>

      {/* Timeline */}
      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow={t("about.journeyEyebrow")}
              title={t("about.journeyTitle")}
              description={t("about.journeyDesc")}
            />
          </div>
          <div className="relative border-l border-slate-200 pl-8 dark:border-white/10">
            {timeline.map((tm, i) => (
              <Reveal key={tm.year} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[41px] grid h-6 w-6 place-items-center rounded-full border-2 border-brand-500 bg-white dark:bg-slate-950">
                  <span className="h-2 w-2 rounded-full bg-brand-500" />
                </span>
                <span className="font-display text-sm font-bold text-brand-500">{tm.year}</span>
                <h3 className="mt-1 font-display text-xl font-bold">{tm.title}</h3>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {tm.desc}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="container-page py-20">
        <SectionHeading
          eyebrow={t("about.stackEyebrow")}
          title={t("about.stackTitle")}
          description={t("about.stackDesc")}
        />
        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STACK_ORDER.map((key, i) => (
            <Reveal key={key} delay={i * 0.05} className="flex items-start gap-4 rounded-3xl border border-slate-200/70 bg-white/60 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-card dark:border-white/10 dark:bg-slate-900/40">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-300">
                <StackIcon name={key} />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold">{stack[key].name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stack[key].desc}</p>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </section>

      {/* Team */}
      <section className="container-page py-20">
        <Reveal className="relative mb-12 overflow-hidden rounded-[2.5rem] shadow-card">
          <img
            src="/images/team.jpg"
            alt="The AeroCast meteorology and engineering team at work"
            className="img-tinted h-56 w-full object-cover sm:h-72"
          />
          <div className="img-tint" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="font-display text-2xl font-bold">{t("about.crewTitle")}</p>
            <p className="mt-1 max-w-md text-sm text-white/85">{t("about.crewSub")}</p>
          </div>
        </Reveal>
        <RevealGroup className="mt-0 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.06}>
              <TeamCard name={m.name} role={m.role} gradient={TEAM_GRADIENTS[i % TEAM_GRADIENTS.length]} />
            </Reveal>
          ))}
        </RevealGroup>

        <Reveal className="mx-auto mt-16 max-w-2xl text-center">
          <div className="rounded-[2rem] bg-gradient-to-br from-brand-600 to-sky-600 p-10 text-white shadow-glow">
            <Rocket className="mx-auto h-10 w-10" />
            <h3 className="mt-4 font-display text-2xl font-bold">
              {t("about.joinTitle")}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-brand-100">
              {t("about.joinDesc")}
            </p>
            <a
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
            >
              {t("about.join")}
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function StackIcon({ name }: { name: string }) {
  const map: Record<string, any> = {
    next: Wind,
    tailwind: Palette,
    framer: Zap,
    mongo: Database,
    openmeteo: Globe2,
    themes: ShieldCheck,
  };
  const Icon = map[name] || Wind;
  return <Icon size={22} />;
}
