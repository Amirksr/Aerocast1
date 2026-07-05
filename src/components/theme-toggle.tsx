"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-slate-200 bg-white/70 text-slate-700 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mounted ? (isDark ? "moon" : "sun") : "placeholder"}
          initial={{ y: 18, opacity: 0, rotate: -30 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -18, opacity: 0, rotate: 30 }}
          transition={{ duration: 0.25 }}
          className="absolute"
        >
          {mounted && isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
