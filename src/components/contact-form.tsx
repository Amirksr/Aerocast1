"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, CheckCircle2, AlertCircle, User, Mail, MessageSquare } from "lucide-react";
import { useT } from "./language-provider";

const TOPICS = [
  { value: "general", key: "general" },
  { value: "support", key: "support" },
  { value: "billing", key: "billing" },
  { value: "partnership", key: "partnership" },
  { value: "feedback", key: "feedback" },
] as const;

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30 dark:border-white/10 dark:bg-white/5";

export function ContactForm() {
  const t = useT();
  const [form, setForm] = useState({ name: "", email: "", topic: "general", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMsg(data.error || t("contactForm.error"));
        return;
      }
      setStatus("success");
      setMsg(t("contactForm.success"));
      setForm({ name: "", email: "", topic: "general", message: "" });
    } catch {
      setStatus("error");
      setMsg(t("contactForm.errorNet"));
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <User size={14} /> {t("contactForm.name")}
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder={t("contactForm.namePh")}
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Mail size={14} /> {t("contactForm.email")}
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder={t("contactForm.emailPh")}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">
          {t("contactForm.topic")}
        </label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((topic) => (
            <button
              type="button"
              key={topic.value}
              onClick={() => update("topic", topic.value)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                form.topic === topic.value
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-slate-200 bg-white/70 text-slate-500 hover:border-brand-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              }`}
            >
              {t(`contactForm.topics.${topic.key}`)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <MessageSquare size={14} /> {t("contactForm.message")}
        </label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder={t("contactForm.messagePh")}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status === "loading"} className="btn-primary w-full sm:w-auto">
          {status === "loading" ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              {t("contactForm.send")} <Send size={16} />
            </>
          )}
        </button>

        <div className="h-5 text-sm">
          <AnimatePresence mode="wait">
            {status === "success" && (
              <motion.p
                key="ok"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-1.5 text-emerald-500"
              >
                <CheckCircle2 size={16} /> {msg}
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                key="err"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-1.5 text-rose-500"
              >
                <AlertCircle size={16} /> {msg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}
