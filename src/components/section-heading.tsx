"use client";

import { motion } from "framer-motion";
import { Reveal } from "./motion-primitives";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="chip mx-auto w-fit">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-brand-500"
              animate={{ scale: [1, 1.6, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className={cn("font-display text-3xl font-bold tracking-tight sm:text-4xl")}>
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p className="text-base leading-relaxed text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
