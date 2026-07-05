"use client";

import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  type LucideProps,
} from "lucide-react";
import type { WeatherTheme } from "@/lib/weather";
import type { ComponentType } from "react";

type IconComponent = ComponentType<LucideProps>;

interface WeatherIconProps {
  theme: WeatherTheme;
  isDay?: boolean;
  size?: number;
  className?: string;
  animated?: boolean;
}

export function WeatherIcon({
  theme,
  isDay = true,
  size = 56,
  className,
  animated = true,
}: WeatherIconProps) {
  let Icon: IconComponent;
  switch (theme) {
    case "clear":
      Icon = isDay ? Sun : Moon;
      break;
    case "partly":
      Icon = isDay ? CloudSun : CloudMoon;
      break;
    case "cloudy":
      Icon = Cloud;
      break;
    case "fog":
      Icon = CloudFog;
      break;
    case "drizzle":
      Icon = CloudDrizzle;
      break;
    case "rain":
      Icon = CloudRain;
      break;
    case "snow":
      Icon = Snowflake;
      break;
    case "thunder":
      Icon = CloudLightning;
      break;
    default:
      Icon = CloudSun;
  }

  const iconColor =
    theme === "clear" && isDay
      ? "#fbbf24"
      : theme === "thunder"
      ? "#a78bfa"
      : theme === "snow"
      ? "#7dd3fc"
      : theme === "rain" || theme === "drizzle"
      ? "#38bdf8"
      : "#94a3b8";

  return (
    <motion.div
      className={className}
      initial={animated ? { scale: 0.6, opacity: 0, rotate: -12 } : false}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 14 }}
      style={{ width: size, height: size }}
    >
      <motion.div
        animate={
          animated
            ? {
                y: [0, -6, 0],
                rotate: theme === "clear" ? [0, 8, 0, -8, 0] : [0, 0, 0],
              }
            : undefined
        }
        transition={{
          duration: theme === "clear" ? 9 : 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon
          size={size}
          color={iconColor}
          strokeWidth={1.6}
          className="drop-shadow-[0_6px_18px_rgba(56,189,248,0.35)]"
        />
      </motion.div>
    </motion.div>
  );
}
