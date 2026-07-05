"use client";

import { useT } from "@/components/language-provider";

export default function Loading() {
  const t = useT();
  return (
    <div className="container-page flex min-h-screen flex-col items-center justify-center gap-6 pt-28">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-3 w-3 animate-bounce rounded-full bg-brand-500"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
      <p className="text-sm text-slate-400">{t("loading")}</p>
    </div>
  );
}
