"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  CloudRain,
  Cloud,
  Share2,
  Check,
  ArrowUp,
  MapPin,
} from "lucide-react";
import type { WeatherResult } from "@/lib/weather";
import { WeatherIcon } from "./weather-icon";
import { FavoriteButton } from "./favorite-button";
import { WeatherBackground } from "./weather-background";
import { useT, useLang } from "./language-provider";
import {
  cn,
  dayLabel,
  fullDateLabel,
  hourLabel,
  describeVisibility,
  uvLabel,
  comfortLabel,
  compass,
} from "@/lib/utils";

interface WeatherDashboardProps {
  data: WeatherResult;
  unit?: "c" | "f";
}

function uvText(uv: number, t: (k: string) => string) {
  const key = uv <= 2 ? "low" : uv <= 5 ? "moderate" : uv <= 7 ? "high" : uv <= 10 ? "veryHigh" : "extreme";
  return t(`dashboard.${key}`);
}

function aqiText(label: string | null, t: (k: string) => string) {
  if (!label) return null;
  const map: Record<string, string> = {
    Good: "good", Fair: "fair", Moderate: "moderate",
    Poor: "poor", "Very Poor": "veryPoor", Hazardous: "hazardous",
  };
  return t(`dashboard.${map[label] ?? "moderate"}`);
}

export function WeatherDashboard({ data, unit = "c" }: WeatherDashboardProps) {
  const { place, current, hourly, daily } = data;
  const [shared, setShared] = useState(false);
  const t = useT();
  const lang = useLang();
  const locale = lang === "fa" ? "fa-IR" : "en-US";

  const convert = (c: number) =>
    unit === "c" ? c : Math.round((c * 9) / 5 + 32);

  const weatherName = (code: number) => t(`weather.${code}`) || code;

  function share() {
    const text = `It's ${convert(current.temperature)}° and ${weatherName(
      current.weatherCode
    ).toLowerCase()} in ${place.name}. Check the full forecast on AeroCast.`;
    if (navigator.share) {
      navigator.share({ title: "AeroCast", text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      });
    }
  }

  const today = daily[0];
  const metrics = [
    { icon: Droplets, label: t("dashboard.humidity"), value: `${current.humidity}%`, hint: t(`dashboard.${comfortLabel(100 - Math.abs(50 - current.humidity)).toLowerCase()}`) },
    {
      icon: Wind,
      label: t("dashboard.wind"),
      value: `${current.windSpeed} km/h`,
      hint: `${compass(current.windDirection)} · ${current.windDirection}°`,
    },
    { icon: Gauge, label: t("dashboard.pressure"), value: `${current.pressure}`, hint: "hPa" },
    { icon: Eye, label: t("dashboard.visibility"), value: `${current.visibility} km`, hint: t(`dashboard.${describeVisibility(current.visibility).toLowerCase()}`) },
    { icon: Sun, label: t("dashboard.uv"), value: `${current.uvIndex}`, hint: uvText(current.uvIndex, t) },
    { icon: CloudRain, label: t("dashboard.rain"), value: `${current.precipitation} mm`, hint: current.precipitation > 0 ? t("dashboard.now") : "—" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card relative overflow-hidden p-0 shadow-card"
    >
      <div className="relative isolate overflow-hidden border-b border-slate-200/60 dark:border-white/10">
        <WeatherBackground theme={current.theme} isDay={current.isDay} />
        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-300">
                <MapPin size={16} className="text-brand-500" />
                <span className="truncate">
                  {place.name}
                  {place.admin1 ? `, ${place.admin1}` : ""}
                </span>
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                {place.country || "—"}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {fullDateLabel(new Date(), locale)} · {weatherName(current.weatherCode)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton place={place} />
              <button
                onClick={share}
                aria-label={t("dashboard.share")}
                className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white/70 text-slate-500 transition-colors hover:text-brand-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white"
              >
                {shared ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              <WeatherIcon theme={current.theme} isDay={current.isDay} size={92} />
              <div>
                <div className="flex items-start font-display text-7xl font-bold leading-none tracking-tighter">
                  {convert(current.temperature)}
                  <span className="mt-1 text-3xl text-slate-400">°{unit.toUpperCase()}</span>
                </div>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  {t("dashboard.feelsLike")}{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {convert(current.apparentTemperature)}°{unit.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
            {today && (
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="text-slate-400">{t("dashboard.min")}</p>
                  <p className="font-display text-xl font-bold">
                    {convert(today.tempMin)}°
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400">{t("dashboard.max")}</p>
                  <p className="font-display text-xl font-bold">
                    {convert(today.tempMax)}°
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden bg-slate-200/50 sm:grid-cols-3 lg:grid-cols-6 dark:bg-white/5">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
            className="group bg-white/80 p-5 transition-colors hover:bg-white dark:bg-slate-900/60 dark:hover:bg-slate-900"
          >
            <div className="flex items-center gap-2 text-slate-400">
              <m.icon size={16} className="text-brand-500" />
              <span className="text-xs font-medium uppercase tracking-wide">
                {m.label}
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-bold">{m.value}</p>
            <p className="mt-0.5 text-xs text-slate-400">{m.hint}</p>
          </motion.div>
        ))}
      </div>

      {current.aqiLabel && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/60 bg-gradient-to-r from-emerald-50/70 to-sky-50/70 px-6 py-4 dark:border-white/10 dark:from-emerald-500/5 dark:to-sky-500/5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm dark:bg-white/10">
              <Gauge size={16} className="text-emerald-500" />
            </span>
            <div>
              <p className="text-sm font-semibold">{t("dashboard.airQuality")}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("dashboard.pm25")} {current.pm25 ?? "n/a"}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "chip text-sm font-semibold",
              current.aqi! <= 20 && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
              current.aqi! > 20 && current.aqi! <= 60 && "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
              current.aqi! > 60 && "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
            )}
          >
            {aqiText(current.aqiLabel, t)}
          </span>
        </div>
      )}

      <div className="p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <Cloud size={18} className="text-brand-500" />
          <h3 className="font-semibold">{t("dashboard.hourly")}</h3>
          <span className="text-xs text-slate-400">· {t("dashboard.next24")}</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {hourly.map((h, i) => (
            <motion.div
              key={h.time}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.02 * i }}
              className="flex min-w-[72px] flex-col items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5"
            >
              <span className="text-xs font-medium text-slate-400">
                {i === 0 ? t("common.now") : hourLabel(h.time, locale)}
              </span>
              <WeatherIcon theme={h.theme} size={30} animated={i < 6} />
              <span className="font-display text-lg font-bold">
                {convert(h.temperature)}°
              </span>
              {h.precipitationProbability > 0 && (
                <span className="text-[10px] text-sky-500">
                  {h.precipitationProbability}%
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200/60 p-6 sm:p-8 dark:border-white/10">
        <div className="mb-4 flex items-center gap-2">
          <CloudRain size={18} className="text-brand-500" />
          <h3 className="font-semibold">{t("dashboard.daily")}</h3>
        </div>
        <div className="divide-y divide-slate-200/60 dark:divide-white/5">
          {daily.map((d, i) => (
            <motion.div
              key={d.date}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
              className="flex items-center gap-4 py-3"
            >
              <span className="w-14 text-sm font-medium">
                {i === 0 ? t("common.now") : dayLabel(d.date, locale)}
              </span>
              <WeatherIcon theme={d.theme} size={32} animated={false} />
              <span className="hidden flex-1 truncate text-xs text-slate-400 sm:block">
                {weatherName(d.weatherCode)}
              </span>
              <div className="flex flex-1 items-center gap-2 sm:max-w-[160px]">
                <span className="text-xs text-slate-400">{d.precipitationProbability}%</span>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-400 to-sky-400"
                    style={{ width: `${d.precipitationProbability}%` }}
                  />
                </div>
              </div>
              <span className="w-10 text-right text-sm text-slate-400">
                {convert(d.tempMin)}°
              </span>
              <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-slate-200 sm:block dark:bg-white/10">
                <div className="h-full bg-gradient-to-r from-amber-300 to-rose-400" style={{ width: "70%" }} />
              </div>
              <span className="w-10 text-right font-display font-bold">
                {convert(d.tempMax)}°
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200/60 px-6 py-4 text-xs text-slate-400 dark:border-white/10">
        <span>{t("dashboard.updated")} {new Date(data.fetchedAt).toLocaleTimeString(locale)}</span>
        <span className="flex items-center gap-1">
          <ArrowUp size={12} /> {t("dashboard.cached")}
        </span>
      </div>
    </motion.div>
  );
}
