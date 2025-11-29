import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates an SEO-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns A lowercase string with spaces converted to hyphens, special characters removed
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()                     // Convert to lowercase
    .trim()                            // Remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, '')         // Remove special characters
    .replace(/\s+/g, '-')             // Replace spaces with hyphens
    .replace(/-+/g, '-')              // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');         // Remove leading/trailing hyphens
}
