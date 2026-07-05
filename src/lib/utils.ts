import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names while resolving Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a temperature value with optional unit. */
export function formatTemp(value: number, unit: "c" | "f" = "c") {
  const rounded = Math.round(value);
  return `${rounded}°${unit === "c" ? "C" : "F"}`;
}

/** Format a number with metric suffix for compact UI (e.g. 12 km/h). */
export function formatWind(value: number) {
  return `${Math.round(value)} km/h`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Friendly weekday label from ISO date (YYYY-MM-DD) or Date. */
export function dayLabel(input: string | Date, locale = "en-US") {
  const d = typeof input === "string" ? new Date(`${input}T00:00:00`) : input;
  return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(d);
}

export function fullDateLabel(input: string | Date, locale = "en-US") {
  const d = typeof input === "string" ? new Date(`${input}T00:00:00`) : input;
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(d);
}

/** Localised clock label (e.g. "2 PM" / "۱۴") from an ISO timestamp. */
export function hourLabel(iso: string, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(new Date(iso));
}

/** Convert km visibility to human description. */
export function describeVisibility(km: number) {
  if (km >= 10) return "Excellent";
  if (km >= 6) return "Good";
  if (km >= 2) return "Moderate";
  return "Poor";
}

/** Compose a relative UV risk label. */
export function uvLabel(uv: number) {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}

/** Convert a 0-100 comfort score to a label. */
export function comfortLabel(score: number) {
  if (score >= 80) return "Ideal";
  if (score >= 60) return "Pleasant";
  if (score >= 40) return "Fair";
  return "Uncomfortable";
}

/** Map a wind direction in degrees to a 16-point compass label. */
export function compass(deg: number) {
  const dirs = [
    "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
  ];
  return dirs[Math.round(deg / 22.5) % 16];
}
