"use client";

import { motion } from "framer-motion";

interface TeamCardProps {
  name: string;
  role: string;
  gradient: string;
}

export function TeamCard({ name, role, gradient }: TeamCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/60 text-center backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/40"
    >
      <div className={`relative h-40 bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 bg-grid-light bg-[size:24px_24px] opacity-30" />
      </div>
      <div className="px-5 pb-6">
        <span
          className={`mx-auto -mt-10 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${gradient} text-2xl font-bold text-white shadow-card ring-4 ring-white dark:ring-slate-900`}
        >
          {name.split(" ").map((n) => n[0]).join("")}
        </span>
        <h3 className="mt-4 font-display text-lg font-bold">{name}</h3>
        <p className="text-sm text-slate-400">{role}</p>
      </div>
    </motion.div>
  );
}
