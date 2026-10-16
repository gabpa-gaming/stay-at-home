import { colors } from './colors';
import { typography } from './typography';
import { geometry } from './geometry';

export const theme = {
  colors,
  typography,
  geometry,
} as const;

export type Theme = typeof theme;
