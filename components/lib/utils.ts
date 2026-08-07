import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatPercentage(value: number) {
  return `${value >= 0 ? "+" : ""}${value}%`
}

export function classNames(...inputs: string[]) {
  return inputs.filter(Boolean).join(" ")
}