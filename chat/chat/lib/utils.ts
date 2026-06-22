import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date | string | number) {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: 'numeric' }).format(d)
}

export function formatDate(date: Date | string | number) {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(d)
}
