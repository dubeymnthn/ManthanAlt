import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTimeIST(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatDateRange(start: string, end: string): string {
  if (start === end) return start;
  return `${start} — ${end}`;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
