/**
 * Design Tokens System (2025)
 *
 * Provides a centralized source of truth for:
 * - Fluid typography with CSS clamp()
 * - 8px grid spacing system
 * - Color tokens for dark mode
 * - Design system utilities
 */

// 8px Grid Spacing System
// All spacing follows 8px base unit for perfect alignment
export const spacing = {
  0: '0',
  0.5: '4px',   // 0.5 * 8px
  1: '8px',     // 1 * 8px
  1.5: '12px',  // 1.5 * 8px
  2: '16px',    // 2 * 8px
  2.5: '20px',  // 2.5 * 8px
  3: '24px',    // 3 * 8px
  3.5: '28px',  // 3.5 * 8px
  4: '32px',    // 4 * 8px
  5: '40px',    // 5 * 8px
  6: '48px',    // 6 * 8px
  7: '56px',    // 7 * 8px
  8: '64px',    // 8 * 8px
  9: '72px',    // 9 * 8px
  10: '80px',   // 10 * 8px
  11: '88px',   // 11 * 8px
  12: '96px',   // 12 * 8px
  14: '112px',  // 14 * 8px
  16: '128px',  // 16 * 8px
  20: '160px',  // 20 * 8px
  24: '192px',  // 24 * 8px
  28: '224px',  // 28 * 8px
  32: '256px',  // 32 * 8px
  36: '288px',  // 36 * 8px
  40: '320px',  // 40 * 8px
  44: '352px',  // 44 * 8px
  48: '384px',  // 48 * 8px
  52: '416px',  // 52 * 8px
  56: '448px',  // 56 * 8px
  60: '480px',  // 60 * 8px
  64: '512px',  // 64 * 8px
  72: '576px',  // 72 * 8px
  80: '640px',  // 80 * 8px
  96: '768px',  // 96 * 8px
} as const;

// Fluid Typography System using CSS clamp()
// Combines viewport units with rem for accessibility
// Format: clamp(min, preferred, max)
export const fluidType = {
  // Display text (hero sections, large headings)
  display: {
    xl: 'clamp(3rem, 5vw + 1rem, 6rem)',      // 48px -> 96px
    lg: 'clamp(2.5rem, 4vw + 1rem, 5rem)',    // 40px -> 80px
    md: 'clamp(2rem, 3.5vw + 1rem, 4rem)',    // 32px -> 64px
    sm: 'clamp(1.75rem, 3vw + 1rem, 3.5rem)', // 28px -> 56px
  },

  // Headings (article titles, section headers)
  heading: {
    h1: 'clamp(2rem, 2.5vw + 1rem, 3rem)',    // 32px -> 48px
    h2: 'clamp(1.75rem, 2vw + 1rem, 2.5rem)', // 28px -> 40px
    h3: 'clamp(1.5rem, 1.5vw + 1rem, 2rem)',  // 24px -> 32px
    h4: 'clamp(1.25rem, 1vw + 1rem, 1.75rem)', // 20px -> 28px
    h5: 'clamp(1.125rem, 0.5vw + 1rem, 1.5rem)', // 18px -> 24px
    h6: 'clamp(1rem, 0.25vw + 1rem, 1.25rem)', // 16px -> 20px
  },

  // Body text (should use traditional responsive typography)
  // Kept simple with minimal scaling for readability
  body: {
    xl: 'clamp(1.125rem, 0.5vw + 1rem, 1.25rem)', // 18px -> 20px
    lg: 'clamp(1rem, 0.25vw + 0.9rem, 1.125rem)', // 16px -> 18px
    base: '1rem',                                   // 16px (static)
    sm: '0.875rem',                                 // 14px (static)
    xs: '0.75rem',                                  // 12px (static)
  },
} as const;

// Line Heights for optimal readability
export const lineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
} as const;

// Letter Spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Font Weights
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// Border Radius (follows 8px grid)
export const borderRadius = {
  none: '0',
  sm: '4px',
  base: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  full: '9999px',
} as const;

// Z-Index Scale
export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
} as const;

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Helper function to apply fluid typography
export function getFluidType(type: keyof typeof fluidType, size: string) {
  const typeScale = fluidType[type];
  return typeScale[size as keyof typeof typeScale] || fluidType.body.base;
}

// Helper function to get spacing value
export function getSpacing(value: keyof typeof spacing) {
  return spacing[value] || spacing[0];
}

// Type exports for TypeScript
export type Spacing = keyof typeof spacing;
export type FluidTypeScale = keyof typeof fluidType;
export type LineHeight = keyof typeof lineHeight;
export type LetterSpacing = keyof typeof letterSpacing;
export type FontWeight = keyof typeof fontWeight;
export type BorderRadius = keyof typeof borderRadius;
export type ZIndex = keyof typeof zIndex;
export type Breakpoint = keyof typeof breakpoints;
