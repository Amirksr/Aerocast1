"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, MapPin, Loader2, Plus, Star, X, Search as SearchIcon } from "lucide-react";
import type { GeoPlace, WeatherResult } from "@/lib/weather";
import { SearchBar } from "./search-bar";
import { WeatherIcon } from "./weather-icon";
import { WeatherDashboard } from "./weather-dashboard";
import { useT } from "./language-provider";

interface FavItem {
  _id: string | number;
  name: string;
  admin1?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
}

export function FavoritesManager() {
  const [favorites, setFavorites] = useState<FavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [active, setActive] = useState<WeatherResult | null>(null);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [busyId, setBusyId] = useState<string | number | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const t = useT();

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      if (!res.ok) {
        setLoadError(data?.error || t("favorites.loadError"));
        setFavorites([]);
        return;
      }
      setLoadError(null);
      setFavorites(data.favorites ?? []);
    } catch {
      setLoadError(t("favorites.loadError"));
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const loadWeather = useCallback(async (fav: FavItem) => {
    setActiveId(fav._id);
    setActive(null);
    const params = new URLSearchParams({
      lat: String(fav.latitude),
      lon: String(fav.longitude),
      name: fav.name,
    });
    if (fav.admin1) params.set("admin1", fav.admin1);
    if (fav.country) params.set("country", fav.country);
    try {
      const res = await fetch(`/api/weather?${params.toString()}`);
      const json = await res.json();
      if (res.ok) setActive(json as WeatherResult);
    } catch {
      /* ignore */
    }
  }, []);

  async function addFavorite(place: GeoPlace) {
    setAdding(true);
    setAddError(null);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: place.id,
          name: place.name,
          admin1: place.admin1,
          country: place.country,
          countryCode: place.country_code,
          latitude: place.latitude,
          longitude: place.longitude,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setAddError(data?.error || t("favorites.addError"));
        return;
      }
      await loadFavorites();
      if (data?.favorite) loadWeather(data.favorite);
    } catch {
      setAddError(t("favorites.addError"));
    } finally {
      setAdding(false);
    }
  }

  async function removeFavorite(id: string | number) {
    setBusyId(id);
    try {
      await fetch(`/api/favorites?id=${id}`, { method: "DELETE" });
      if (activeId === id) {
        setActive(null);
        setActiveId(null);
      }
      await loadFavorites();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-10">
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="relative">
              <button
                onClick={() => {
                  setActive(null);
                  setActiveId(null);
                }}
                className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-slate-500 backdrop-blur hover:text-rose-500 dark:bg-white/10 dark:text-slate-300"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <WeatherDashboard data={active} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card relative z-10 p-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Plus size={16} className="text-brand-500" /> {t("favorites.addTitle")}
        </div>
        <SearchBar onSelect={addFavorite} loading={adding} />
        {addError && (
          <p className="mt-3 text-sm text-rose-500" role="alert">
            {addError}
          </p>
        )}
      </div>

      <div>
        <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-bold">
          <Star size={20} className="text-brand-500" /> {t("favorites.saved")}
        </h2>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-3xl" />
            ))}
          </div>
        ) : loadError ? (
          <div className="card flex flex-col items-center gap-3 py-16 text-center">
            <p className="font-semibold text-rose-500" role="alert">
              {loadError}
            </p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 py-16 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-500 dark:bg-white/5">
              <MapPin size={28} />
            </span>
            <p className="font-semibold">{t("favorites.noFavTitle")}</p>
            <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {t("favorites.noFavDesc")}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {favorites.map((fav) => (
                <motion.div
                  key={fav._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/70 bg-white/60 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-card dark:border-white/10 dark:bg-slate-900/40"
                  onClick={() => loadWeather(fav)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(fav._id);
                    }}
                    disabled={busyId === fav._id}
                    aria-label="Remove favourite"
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-slate-400 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100 dark:hover:bg-rose-500/10 disabled:opacity-50"
                  >
                    {busyId === fav._id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MapPin size={14} /> {fav.country || fav.countryCode || "—"}
                  </div>
                  <p className="mt-1 font-display text-lg font-bold">{fav.name}</p>
                  <p className="truncate text-xs text-slate-400">{fav.admin1 || "Saved location"}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-brand-600 dark:text-brand-300">
                    <SearchIcon size={13} /> {t("favorites.view")}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
