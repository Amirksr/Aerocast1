"use client";

import Link from "next/link";
import { CloudOff, Home } from "lucide-react";
import { useT } from "@/components/language-provider";

export default function NotFound() {
  const t = useT();
  return (
    <div className="container-page flex min-h-screen flex-col items-center justify-center pt-28 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-sky-400 text-white shadow-glow">
        <CloudOff size={36} />
      </span>
      <h1 className="mt-8 font-display text-6xl font-bold">{t("notFound.title")}</h1>
      <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
        {t("notFound.desc")}
      </p>
      <Link href="/" className="btn-primary mt-8">
        <Home size={18} /> {t("notFound.back")}
      </Link>
    </div>
  );
}
