"use client";

import { cn } from "@/lib/utils";

/**
 * Skip Navigation Component
 * WCAG 2.2 Success Criterion 2.4.1 (Bypass Blocks) - Level A
 *
 * Allows keyboard users to skip repetitive navigation and jump directly to main content.
 * Visible only when focused via keyboard.
 *
 * @example
 * // In root layout
 * <SkipNav />
 * <Header />
 * <main id="main-content">
 *   {children}
 * </main>
 */
export function SkipNav() {
  return (
    <a
      href="#main-content"
      className={cn(
        // Screen reader only by default
        "sr-only",
        // Visible when focused
        "focus:not-sr-only",
        // Positioning
        "focus:fixed focus:top-4 focus:left-4 focus:z-50",
        // Styling
        "px-6 py-3 rounded-lg",
        "bg-blue-600 text-white font-medium",
        "shadow-lg",
        // Focus ring
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600",
        // Animation
        "transition-all duration-200"
      )}
    >
      Skip to main content
    </a>
  );
}

/**
 * Skip to Navigation
 * For users who want to jump to navigation from content
 */
export function SkipToNav() {
  return (
    <a
      href="#main-navigation"
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4 focus:z-50",
        "px-6 py-3 rounded-lg",
        "bg-gray-800 text-white font-medium",
        "shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
      )}
    >
      Skip to navigation
    </a>
  );
}
