"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, Check, AlertCircle } from "lucide-react";
import { useT } from "../language-provider";

export function Newsletter() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tags: ["landing"] }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMsg(data.error || t("newsletter.error"));
        return;
      }
      setStatus("success");
      setMsg(
        data.status === "exists" ? t("newsletter.exists") : t("newsletter.success")
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMsg(t("newsletter.errorNet"));
    }
  }

  return (
    <section className="container-page py-12 sm:py-16">
      <div className="relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center text-white shadow-glow sm:px-16">
        <img
          src="/images/storm.jpg"
          alt=""
          aria-hidden
          className="img-tinted absolute inset-0 h-full w-full object-cover"
        />
        <div className="img-tint" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700/90 via-brand-600/85 to-sky-700/90" />
        <div className="aurora left-10 top-10 h-64 w-64 bg-white/20" />
        <div className="aurora right-10 bottom-10 h-64 w-64 bg-sky-300/30" />

        <div className="relative">
          <motion.span
            className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/15 backdrop-blur"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Mail size={26} />
          </motion.span>
          <h2 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
            {t("newsletter.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            {t("newsletter.desc")}
          </p>

          <form
            onSubmit={submit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="h-12 flex-1 rounded-full border border-white/20 bg-white/15 px-5 text-white outline-none placeholder:text-brand-200 backdrop-blur focus:border-white"
              aria-label={t("newsletter.placeholder")}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn h-12 bg-white text-brand-600 hover:bg-brand-50 disabled:opacity-60"
            >
              {status === "loading" ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                t("newsletter.subscribe")
              )}
            </button>
          </form>

          <div className="mt-3 h-5 text-sm">
            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.p
                  key="ok"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-1.5 text-emerald-200"
                >
                  <Check size={16} /> {msg}
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  key="err"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-1.5 text-rose-200"
                >
                  <AlertCircle size={16} /> {msg}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
