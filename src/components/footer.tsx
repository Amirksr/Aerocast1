"use client";

import Link from "next/link";
import { Wind, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Logo } from "./logo";
import { useT } from "./language-provider";

export function Footer() {
  const t = useT();

  const COLUMNS = [
    {
      title: t("footer.product"),
      links: [
        { label: t("footer.links.weatherSearch"), href: "/#forecast" },
        { label: t("footer.links.features"), href: "/#features" },
        { label: t("footer.links.pricing"), href: "/#pricing" },
        { label: t("footer.links.favorites"), href: "/favorites" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.links.about"), href: "/about" },
        { label: t("footer.links.contact"), href: "/contact" },
        { label: t("footer.links.careers"), href: "/about" },
        { label: t("footer.links.blog"), href: "/about" },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { label: t("footer.links.apiDocs"), href: "/contact" },
        { label: t("footer.links.status"), href: "/#stats" },
        { label: t("footer.links.changelog"), href: "/about" },
        { label: t("footer.links.support"), href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="relative mt-24 border-t border-slate-200/70 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {t("footer.desc")}
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social link"
                  className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-slate-400"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-200/70 pt-8 sm:flex-row dark:border-white/10">
          <p className="text-xs text-slate-400">{t("footer.rights")}</p>
          <div className="flex items-center gap-5 text-xs text-slate-400">
            <Link href="#" className="hover:text-slate-600 dark:hover:text-white">
              {t("footer.privacy")}
            </Link>
            <Link href="#" className="hover:text-slate-600 dark:hover:text-white">
              {t("footer.terms")}
            </Link>
            <Link href="#" className="hover:text-slate-600 dark:hover:text-white">
              {t("footer.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
