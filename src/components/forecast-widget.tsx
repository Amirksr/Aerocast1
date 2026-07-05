"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MapPin, AlertTriangle, ThermometerSnowflake, ThermometerSun } from "lucide-react";
import type { GeoPlace, WeatherResult } from "@/lib/weather";
import { SearchBar } from "./search-bar";
import { WeatherDashboard } from "./weather-dashboard";
import { useT } from "./language-provider";
import { cn } from "@/lib/utils";

interface CityOption {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

function DashboardSkeleton() {
  return (
    <div className="card overflow-hidden p-0 shadow-card">
      <div className="skeleton h-56 w-full" />
      <div className="grid grid-cols-2 gap-px bg-slate-200/50 sm:grid-cols-3 lg:grid-cols-6 dark:bg-white/5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-28 bg-white/80 dark:bg-slate-900/60" />
        ))}
      </div>
      <div className="space-y-3 p-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function ForecastWidget() {
  const [data, setData] = useState<WeatherResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"c" | "f">("c");
  const [cities, setCities] = useState<CityOption[]>([]);
  const t = useT();

  useEffect(() => {
    fetch("/api/popular")
      .then((r) => r.json())
      .then((d) => setCities(d.cities ?? []))
      .catch(() => {});
  }, []);

  const load = useCallback(async (place: GeoPlace, label?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        lat: String(place.latitude),
        lon: String(place.longitude),
        name: place.name,
      });
      if (place.admin1) params.set("admin1", place.admin1);
      if (place.country) params.set("country", place.country);
      if (place.country_code) params.set("cc", place.country_code);

      const res = await fetch(`/api/weather?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load forecast.");
      setData(json as WeatherResult);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load a sensible default on first mount.
  useEffect(() => {
    load({ id: 0, name: "Tehran", latitude: 35.6944, longitude: 51.4215, country: "Iran", admin1: "Tehran" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <SearchBar onSelect={(p) => load(p)} loading={loading} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setUnit("c")}
            className={cn(
              "flex items-center gap-1 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
              unit === "c"
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-slate-200 bg-white/70 text-slate-500 dark:border-white/10 dark:bg-white/5"
            )}
          >
            <ThermometerSnowflake size={16} /> °C
          </button>
          <button
            onClick={() => setUnit("f")}
            className={cn(
              "flex items-center gap-1 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
              unit === "f"
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-slate-200 bg-white/70 text-slate-500 dark:border-white/10 dark:bg-white/5"
            )}
          >
            <ThermometerSun size={16} /> °F
          </button>
        </div>
      </div>

        {cities.length > 0 && !data && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">{t("forecast.popular")}</span>
          {cities.slice(0, 6).map((c) => (
            <button
              key={c.name}
              onClick={() =>
                load({ id: 0, name: c.name, latitude: c.latitude, longitude: c.longitude, country: c.country, admin1: c.admin1 })
              }
              className="chip transition-colors hover:border-brand-400 hover:text-brand-600"
            >
              <MapPin size={12} /> {c.name}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300"
          >
            <AlertTriangle size={18} />
            {error}
          </motion.div>
        )}

        {loading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
              <Loader2 size={16} className="animate-spin" /> Fetching the latest forecast…
            </div>
            <DashboardSkeleton />
          </motion.div>
        )}

        {data && !loading && (
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <WeatherDashboard data={data} unit={unit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
