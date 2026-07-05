"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, PlayCircle, MapPin, CloudRain } from "lucide-react";
import { WeatherIcon } from "../weather-icon";
import { Reveal } from "../motion-primitives";
import { useT } from "../language-provider";

const floatVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 + i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

export function Hero() {
  const t = useT();

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/images/hero-sky.jpg"
          alt=""
          aria-hidden
          className="img-tinted absolute inset-0 h-full w-full object-cover opacity-[0.10] dark:opacity-[0.16]"
        />
        <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-brand-500/20 blur-[100px]" />
        <div className="absolute right-1/4 top-40 h-96 w-96 rounded-full bg-sky-500/20 blur-[100px]" />
        <div className="absolute inset-0 bg-grid-light bg-[size:38px_38px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] dark:opacity-40" />
      </div>

      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="chip w-fit"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {t("hero.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {t("hero.titleA")} <br />
            <span className="gradient-text">{t("hero.titleB")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-slate-500 dark:text-slate-400"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="#forecast" className="btn-primary group">
              {t("hero.ctaPrimary")}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#features" className="btn-ghost">
              <PlayCircle size={18} /> {t("hero.ctaSecondary")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500 dark:text-slate-400"
          >
            <span className="flex items-center gap-1.5">
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </span>
              {t("hero.reviews")}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={15} className="text-brand-500" /> {t("hero.locations")}
            </span>
            <span className="flex items-center gap-1.5">
              <CloudRain size={15} className="text-brand-500" /> {t("hero.uptime")}
            </span>
          </motion.div>
        </div>

        {/* Animated preview mockup */}
        <div className="relative mx-auto h-[420px] w-full max-w-md">
          {/* real photo accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 7 }}
            animate={{ opacity: 1, scale: 1, rotate: 4 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="absolute -bottom-10 -right-6 z-0 hidden h-44 w-60 overflow-hidden rounded-3xl border border-white/50 shadow-card sm:block"
          >
            <img
              src="/images/sunrise.jpg"
              alt="Sunrise over Lake Tahoe"
              className="img-tinted h-full w-full object-cover"
            />
            <div className="img-tint" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-xs font-medium text-white">
              Sunrise · Lake Tahoe
            </div>
          </motion.div>

          {/* main card */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-strong absolute inset-0 z-10 rounded-[2rem] p-7 shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{t("hero.previewCity")}</p>
                <p className="font-display text-xl font-bold">{t("hero.previewDay")}</p>
              </div>
              <WeatherIcon theme="clear" size={64} />
            </div>
            <div className="mt-4 flex items-end gap-1">
              <span className="font-display text-7xl font-bold leading-none">28°</span>
              <span className="mb-2 text-slate-400">{t("hero.previewFeels")}</span>
            </div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t("hero.previewHumidity")}</div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { l: "Wind", v: "12 km/h" },
                { l: "UV", v: "High" },
                { l: "Rain", v: "0 mm" },
              ].map((m) => (
                <div key={m.l} className="rounded-2xl bg-white/60 p-3 text-center dark:bg-white/5">
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">{m.l}</p>
                  <p className="mt-1 text-sm font-semibold">{m.v}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              {[
                { d: "Mon", t: "Sunny", temp: "31°", theme: "clear" as const },
                { d: "Tue", t: "Partly", temp: "27°", theme: "partly" as const },
                { d: "Wed", t: "Rain", temp: "22°", theme: "rain" as const },
              ].map((r) => (
                <div key={r.d} className="flex items-center justify-between rounded-xl bg-white/50 px-3 py-2 dark:bg-white/5">
                  <span className="text-sm font-medium">{r.d}</span>
                  <WeatherIcon theme={r.theme} size={22} animated={false} />
                  <span className="text-sm font-semibold">{r.temp}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* floating chips */}
          <motion.div
            custom={1}
            variants={floatVariants}
            initial="hidden"
            animate="show"
            className="absolute -left-6 top-10 rounded-2xl glass-strong px-4 py-3 shadow-card"
          >
              <div className="flex items-center gap-2">
                <span className="text-amber-400">⚠</span>
                <div>
                  <p className="text-xs font-semibold">{t("hero.alertTitle")}</p>
                  <p className="text-[11px] text-slate-400">{t("hero.alertSub")}</p>
                </div>
              </div>
          </motion.div>

          <motion.div
            custom={2}
            variants={floatVariants}
            initial="hidden"
            animate="show"
            className="absolute -right-5 bottom-12 rounded-2xl glass-strong px-4 py-3 shadow-card"
          >
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-emerald-400/20 grid place-items-center text-emerald-500">AQI</span>
              <div>
                <p className="text-xs font-semibold">{t("hero.aqiTitle")}</p>
                <p className="text-[11px] text-slate-400">{t("hero.aqiSub")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
