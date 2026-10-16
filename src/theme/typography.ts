import { Platform, TextStyle } from 'react-native';

/**
 * Medical Design System - Neutral Typography
 *
 * Utilizes crisp, clean, neutral system fonts to ensure high legibility,
 * calm confidence, and clinical professionalism.
 */

const neutralFontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  default: 'System',
});

export const typography = {
  fontFamily: neutralFontFamily,

  sizes: {
    micro: 11,
    caption: 13,
    bodySm: 14,
    body: 15,
    bodyLg: 16,
    subheading: 18,
    titleSm: 20,
    title: 24,
    titleLg: 28,
    display: 34,
  },

  weights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semiBold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },

  lineHeights: {
    tight: 1.15,
    normal: 1.35,
    relaxed: 1.5,
    loose: 1.6,
  },

  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    caps: 1.0,
  },
} as const;

export type Typography = typeof typography;
