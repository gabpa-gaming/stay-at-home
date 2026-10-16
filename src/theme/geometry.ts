/**
 * Medical Design System - Geometrical Tokens
 *
 * Strict geometric rules with thin outlines to deliver
 * a modern, trustworthy, high-precision aesthetic.
 */

export const geometry = {
  // Thin outlines: subtle, clean, non-obtrusive
  borderWidths: {
    hairline: 0.5,
    thin: 1.0,
    accent: 1.5,
    medium: 2.0,
  },

  // Geometric radii: controlled corners with exact geometric feel
  radii: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    circle: 9999,
    pill: 9999,
  },

  // Standard geometric spacing scale
  spacing: {
    0: 0,
    2: 2,
    4: 4,
    6: 6,
    8: 8,
    10: 10,
    12: 12,
    14: 14,
    16: 16,
    20: 20,
    24: 24,
    32: 32,
    40: 40,
    48: 48,
    64: 64,
  },
} as const;

export type Geometry = typeof geometry;
