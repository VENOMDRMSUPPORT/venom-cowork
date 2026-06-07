/**
 * VenomCowork Design Token System
 *
 * OKLCH-based professional theme engine with unconventional aesthetic presets.
 * Each preset is a complete, self-contained design system with:
 * - Named aesthetic direction
 * - One unforgettable signature element
 * - Explicit anti-pattern avoided
 * - Full OKLCH color scales
 * - Typography system
 * - Spacing, radius, shadows, motion tokens
 */

// Types
export type {
  ColorScale,
  SemanticColors,
  TypographyTokens,
  SpacingTokens,
  RadiusTokens,
  ShadowTokens,
  MotionTokens,
  BreakpointTokens,
  ZIndexTokens,
  DesignTokens,
  ThemePreset,
  OKLCHColor,
  ColorHarmonyRule,
} from './types.js';

// OKLCH Utilities
export {
  oklchToString,
  parseOklch,
  lighten,
  darken,
  saturate,
  desaturate,
  rotateHue,
  withAlpha,
  generateColorScale,
  generateHarmony,
  luminance,
  contrastRatio,
  wcagCompliance,
  ensureContrast,
} from './oklch.js';

// Theme Presets
export {
  themePresets,
  getThemePreset,
  listThemePresets,
  obsidianNoir,
  arcticBloom,
  industrialBrutalist,
  twilightEditorial,
  neonDepth,
} from './presets.js';

// CSS Generation
export {
  generateCSSVariables,
  generateBreakpointMediaQueries,
  generateDarkModeOverride,
  generateCompleteStylesheet,
  generateTailwindConfig,
} from './css-generator.js';