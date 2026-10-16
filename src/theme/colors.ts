/**
 * Medical Design System - Color Palette
 *
 * Designed for clinical safety, clarity, and modern digital healthcare.
 * Core Palette: White, Cold Gray, Dark Blue, Toned Green.
 */

export const colors = {
  // Pure white for crisp contrast and sterile clarity
  white: '#FFFFFF',

  // Cold Gray: Calm, neutral clinical backgrounds, borders, and muted elements
  coldGray: {
    50: '#F8FAFC',   // Screen background (crisp clinical slate-50)
    100: '#F1F5F9',  // Card and container surface
    150: '#EAEEF3',  // Subtle hover / pressed states
    200: '#E2E8F0',  // Standard thin outline border
    300: '#CBD5E1',  // Emphasized outline / disabled borders
    400: '#94A3B8',  // Secondary icons / placeholder text
    500: '#64748B',  // Helper text and descriptions
    600: '#475569',  // Readable secondary body text
    700: '#334155',  // Prominent metadata
  },

  // Dark Blue: Medical authority, security, primary typography & brand action
  darkBlue: {
    950: '#07162C',  // Deepest clinical navy
    900: '#0B2347',  // Primary headlines and text
    800: '#0F3260',  // Card titles and bold elements
    700: '#16437D',  // Brand dark accent
    600: '#1D63ED',  // Primary action blue (microphone circle button)
    500: '#2563EB',  // Interactive blue highlight
    400: '#60A5FA',  // AI accent glow / light lines
    100: '#EFF6FF',  // Soft blue surface tint
    50: '#F5F9FF',   // Subtle blue glow ring
  },

  // Toned Green: Medical safety, health reassurance, verified status
  tonedGreen: {
    900: '#0F3E2E',  // Dark green safe text
    800: '#165B42',  // Strong safe badge text
    700: '#1B7354',  // Toned medical green accent
    600: '#238A66',  // Active safe indicator
    500: '#2FA87E',  // Live status dot
    300: '#8CE0C1',  // Subtle green outline
    200: '#B9EED9',  // Thin green outline
    100: '#DCF6EC',  // Safe badge surface
    50: '#F0FAF6',   // Safe card background tint
  },

  // Translucent overlays for geometric depth without heavy shadows
  overlay: {
    blueSubtle: 'rgba(29, 99, 237, 0.08)',
    blueRing: 'rgba(29, 99, 237, 0.16)',
    blueOuterRing: 'rgba(29, 99, 237, 0.06)',
    greenSubtle: 'rgba(35, 138, 102, 0.10)',
    darkOutline: 'rgba(11, 35, 71, 0.08)',
  },
} as const;

export type Colors = typeof colors;
