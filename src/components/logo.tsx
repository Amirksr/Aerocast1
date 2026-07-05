"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wind } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)}>
      <span className="relative grid h-10 w-10 place-items-center">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-sky-400 shadow-glow"
          animate={{ rotate: [0, 6, 0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <Wind className="relative h-5 w-5 text-white" strokeWidth={2.4} />
      </span>
      <span className="text-lg font-bold tracking-tight">
        Aero<span className="gradient-text">Cast</span>
      </span>
    </Link>
  );
}
