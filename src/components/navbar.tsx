"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, CloudSun } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LangToggle } from "./lang-toggle";
import { useT } from "./language-provider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useT();

  const NAV_LINKS = [
    { href: "/", label: t("nav.home") },
    { href: "/#features", label: t("nav.features") },
    { href: "/#forecast", label: t("nav.forecast") },
    { href: "/favorites", label: t("nav.favorites") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70"
          : "bg-transparent"
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between py-3">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand-600 dark:text-slate-300 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <LangToggle />
          <ThemeToggle />
          <Link href="/contact" className="btn-primary hidden sm:inline-flex">
            {t("nav.getStarted")}
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setOpen((s) => !s)}
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5 lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-slate-200/60 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                >
                  <CloudSun size={16} className="text-brand-500" />
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" className="btn-primary mt-2 w-full">
                {t("nav.getStarted")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
