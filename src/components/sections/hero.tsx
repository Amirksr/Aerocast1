"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, PlayCircle, MapPin, CloudRain } from "lucide-react";
import { ClimateCarousel } from "../climate-carousel";
import { Reveal } from "../motion-primitives";
import { useT } from "../language-provider";

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

        {/* Climate photo carousel */}
        <div className="relative mx-auto h-[420px] w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="absolute inset-0"
          >
            <ClimateCarousel
              slides={[
                { src: "/images/hero-sky.jpg", alt: t("hero.zoneDesert"), caption: t("hero.zoneDesert") },
                { src: "/images/storm.jpg", alt: t("hero.zoneTropical"), caption: t("hero.zoneTropical") },
                { src: "/images/aerial-clouds.jpg", alt: t("hero.zoneTemperate"), caption: t("hero.zoneTemperate") },
                { src: "/images/snow.jpg", alt: t("hero.zoneArctic"), caption: t("hero.zoneArctic") },
              ]}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
