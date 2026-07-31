"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, LocateFixed, Loader2, X } from "lucide-react";
import type { GeoPlace } from "@/lib/weather";
import { useT, useLang } from "./language-provider";

interface SearchBarProps {
  onSelect: (place: GeoPlace) => void;
  loading?: boolean;
  initialQuery?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  onSelect,
  loading,
  initialQuery = "",
  autoFocus,
}: SearchBarProps) {
  const t = useT();
  const lang = useLang();
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<GeoPlace[]>([]);
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [locating, setLocating] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout>>();
  // Set right before we programmatically change `query` after a selection,
  // so the query-change effect below doesn't immediately re-run a search
  // and pop the dropdown back open.
  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setFetching(true);
    try {
      const res = await fetch(
        `/api/geocode?q=${encodeURIComponent(q)}&lang=${lang}`
      );
      const data = await res.json();
      setResults(data.results ?? []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setFetching(false);
    }
  }, [lang]);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => runSearch(query), 280);
    return () => clearTimeout(debounce.current);
  }, [query, runSearch]);

  function select(place: GeoPlace) {
    skipNextSearchRef.current = true;
    setQuery(`${place.name}${place.admin1 ? `, ${place.admin1}` : ""}`);
    setResults([]);
    setOpen(false);
    onSelect(place);
  }

  function useMyLocation() {
    setLocating(true);
    if (!navigator.geolocation) {
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `/api/geocode?q=${latitude.toFixed(2)},${longitude.toFixed(2)}&lang=${lang}`
          );
          const data = await res.json();
          const place =
            data.results?.[0] ??
            ({
              id: 0,
              name: "My location",
              latitude,
              longitude,
            } as GeoPlace);
          select(place);
        } catch {
          /* ignore */
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="glass-strong flex items-center gap-2 rounded-full p-2 shadow-card">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-white/10 dark:text-brand-300">
          <Search size={20} />
        </span>
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder={t("search.placeholder")}
          className="min-w-0 flex-1 bg-transparent px-1 py-2 text-base outline-none placeholder:text-slate-400"
          aria-label="Search location"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            aria-label={t("search.clear")}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        )}
        <button
          onClick={useMyLocation}
          aria-label={t("search.useLocation")}
          className="hidden h-10 w-10 place-items-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 sm:grid dark:hover:bg-white/10"
        >
          {locating ? <Loader2 size={18} className="animate-spin" /> : <LocateFixed size={18} />}
        </button>
        <button
          onClick={() => results[0] && select(results[0])}
          disabled={loading || (!query && !open)}
            className="btn-primary h-11 px-5"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
            <span className="hidden sm:inline">{loading ? t("common.loading") : t("search.forecast")}</span>
          </button>
      </div>

      <AnimatePresence>
        {open && (results.length > 0 || fetching) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="glass-strong absolute z-30 mt-2 w-full overflow-hidden rounded-3xl p-2 shadow-card"
          >
            {fetching && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-400">
                <Loader2 size={16} className="animate-spin" /> {t("search.searching")}
              </div>
            )}
            {results.map((place, i) => (
              <button
                key={`${place.id}-${i}`}
                onClick={() => select(place)}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-brand-50 dark:hover:bg-white/5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600 dark:bg-white/10 dark:text-brand-300">
                  <MapPin size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{place.name}</span>
                  <span className="block truncate text-xs text-slate-400">
                    {[place.admin1, place.country].filter(Boolean).join(", ")}
                  </span>
                </span>
              </button>
            ))}
            {!fetching && results.length === 0 && query.length >= 2 && (
              <div className="px-4 py-6 text-center text-sm text-slate-400">
                {t("search.noMatch").replace("{q}", query)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
