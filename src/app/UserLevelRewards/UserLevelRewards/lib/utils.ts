import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format large numbers with commas
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

// Calculate percentage with optional min/max bounds
export function calculatePercentage(current: number, total: number, min = 0, max = 100): number {
  const percentage = Math.round((current / total) * 100)
  return Math.min(Math.max(percentage, min), max)
}

