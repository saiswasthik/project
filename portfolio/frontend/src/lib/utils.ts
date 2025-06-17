import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for merging class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
