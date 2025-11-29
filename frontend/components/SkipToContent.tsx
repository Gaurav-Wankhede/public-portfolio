'use client';

/**
 * Skip to Content Link
 * Allows keyboard users to skip navigation and jump directly to main content
 * WCAG 2.1 Level A requirement (2.4.1 Bypass Blocks)
 */
export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50
                 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground
                 focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2
                 focus:ring-primary focus:ring-offset-2"
    >
      Skip to main content
    </a>
  );
}
