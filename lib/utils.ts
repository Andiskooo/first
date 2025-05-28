import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a relative URL to an absolute URL
 */
export function absoluteUrl(path: string): string {
  // If the path is already an absolute URL, return it as is
  if (path.startsWith('http')) {
    return path
  }
  
  // Get the base URL from environment variable or use a default
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ecotek.al'
  
  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  
  return `${baseUrl}${normalizedPath}`
}
