"use client";

import { useI18n } from "./language-provider";
import { Languages } from "lucide-react";

export function LangToggle() {
  const { lang, toggle } = useI18n();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle language"
      className="flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
    >
      <Languages size={16} className="text-brand-500" />
      <span>{lang === "fa" ? "EN" : "فا"}</span>
    </button>
  );
}
