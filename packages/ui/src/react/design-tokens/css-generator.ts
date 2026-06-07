/**
 * CSS Variable Generator for VenomCowork Design System
 * Generates CSS custom properties from theme presets with dark/light mode support
 */

import type { ThemePreset, DesignTokens } from './types.js';

/**
 * Generate a complete CSS custom properties block from a theme preset.
 * Includes all token categories: colors, typography, spacing, radius, shadows, motion, breakpoints, zIndex.
 */
export function generateCSSVariables(preset: ThemePreset): string {
  const lines: string[] = [];
  const tokens = preset.tokens;

  lines.push(`/* VenomCowork Design Tokens — ${preset.displayName} */`);
  lines.push(`/* ${preset.aestheticDirection} */`);
  lines.push('');
  lines.push(':root {');
  lines.push('  /* ─── Colors ───────────────────────────────────── */');

  // Colors
  const colorEntries = Object.entries(tokens.colors);
  for (const [key, value] of colorEntries) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --color-${cssKey}: ${value};`);
  }

  // Color scales
  lines.push('');
  lines.push('  /* ─── Color Scales ────────────────────────────── */');
  const scaleNames = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const;
  for (const scaleName of scaleNames) {
    const scale = tokens.colorScales[scaleName];
    lines.push(`  /* ${scaleName} */`);
    for (const [step, value] of Object.entries(scale)) {
      lines.push(`  --color-${scaleName}-${step}: ${value};`);
    }
    lines.push('');
  }

  // Typography
  lines.push('  /* ─── Typography ──────────────────────────────── */');
  const typoEntries = Object.entries(tokens.typography);
  for (const [key, value] of typoEntries) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --font-${cssKey}: ${value};`);
  }

  // Spacing
  lines.push('');
  lines.push('  /* ─── Spacing ─────────────────────────────────── */');
  const spacingEntries = Object.entries(tokens.spacing);
  for (const [key, value] of spacingEntries) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --${cssKey}: ${value};`);
  }

  // Radius
  lines.push('');
  lines.push('  /* ─── Border Radius ───────────────────────────── */');
  const radiusEntries = Object.entries(tokens.radius);
  for (const [key, value] of radiusEntries) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --${cssKey}: ${value};`);
  }

  // Shadows
  lines.push('');
  lines.push('  /* ─── Shadows ─────────────────────────────────── */');
  const shadowEntries = Object.entries(tokens.shadows);
  for (const [key, value] of shadowEntries) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --${cssKey}: ${value};`);
  }

  // Motion
  lines.push('');
  lines.push('  /* ─── Motion ──────────────────────────────────── */');
  const motionEntries = Object.entries(tokens.motion);
  for (const [key, value] of motionEntries) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --${cssKey}: ${value};`);
  }

  // Breakpoints (as CSS custom properties for JS consumption)
  lines.push('');
  lines.push('  /* ─── Breakpoints (for JS/media query use) ────── */');
  const bpEntries = Object.entries(tokens.breakpoints);
  for (const [key, value] of bpEntries) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --${cssKey}: ${value};`);
  }

  // Z-Index
  lines.push('');
  lines.push('  /* ─── Z-Index ─────────────────────────────────── */');
  const zEntries = Object.entries(tokens.zIndex);
  for (const [key, value] of zEntries) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`  --${cssKey}: ${value};`);
  }

  lines.push('}');

  return lines.join('\n');
}

/**
 * Generate media queries for responsive breakpoints.
 */
export function generateBreakpointMediaQueries(tokens: DesignTokens): string {
  const lines: string[] = [];
  lines.push('/* Responsive Breakpoints */');

  for (const [key, value] of Object.entries(tokens.breakpoints)) {
    const bpName = key.replace(/^bp/, '').toLowerCase();
    lines.push(`@media (min-width: ${value}) {`);
    lines.push(`  /* ${bpName} breakpoint */`);
    lines.push('}');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generate a dark mode variant by inverting light/dark values.
 * Useful for themes that need automatic dark mode.
 */
export function generateDarkModeOverride(preset: ThemePreset): string {
  const lines: string[] = [];
  lines.push(`/* Dark Mode Override for ${preset.displayName} */`);
  lines.push('@media (prefers-color-scheme: dark) {');
  lines.push(':root {');

  // For dark mode, we mainly swap bg and text inverses
  const { colors } = preset.tokens;
  const darkSwaps: [string, string][] = [
    ['--color-bg', colors.textInverse],
    ['--color-bg-secondary', colors.textInverse],
    ['--color-bg-inverse', colors.bg],
    ['--color-text', colors.bgInverse],
    ['--color-text-inverse', colors.bg],
  ];

  for (const [cssVar, value] of darkSwaps) {
    lines.push(`  ${cssVar}: ${value};`);
  }

  lines.push('}');
  lines.push('}');
  return lines.join('\n');
}

/**
 * Generate a complete stylesheet from a theme preset.
 * This is the main entry point for generating CSS from a preset.
 */
export function generateCompleteStylesheet(preset: ThemePreset): string {
  const sections: string[] = [];

  sections.push(`/**`);
  sections.push(` * VenomCowork — ${preset.displayName}`);
  sections.push(` * ${preset.description}`);
  sections.push(` *`);
  sections.push(` * Aesthetic: ${preset.aestheticDirection}`);
  sections.push(` * Signature: ${preset.unforgettableElement}`);
  sections.push(` * Anti-pattern: ${preset.antiPattern}`);
  sections.push(` */`);
  sections.push('');

  sections.push(generateCSSVariables(preset));
  sections.push('');
  sections.push(generateBreakpointMediaQueries(preset.tokens));

  return sections.join('\n');
}

/**
 * Generate Tailwind CSS theme extension from a preset.
 * For projects using Tailwind CSS.
 */
export function generateTailwindConfig(preset: ThemePreset): Record<string, unknown> {
  const config: Record<string, unknown> = {
    theme: {
      extend: {
        colors: {} as Record<string, string>,
        fontFamily: {} as Record<string, string[]>,
        spacing: {} as Record<string, string>,
        borderRadius: {} as Record<string, string>,
        boxShadow: {} as Record<string, string>,
        transitionDuration: {} as Record<string, string>,
        transitionTimingFunction: {} as Record<string, string>,
      },
    },
  };

  const theme = config.theme as { extend: Record<string, unknown> };

  // Colors
  const colorMap: Record<string, string> = {};
  for (const [key, value] of Object.entries(preset.tokens.colors)) {
    const tailwindKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    colorMap[tailwindKey] = value;
  }
  theme.extend.colors = colorMap;

  // Font families
  theme.extend.fontFamily = {
    sans: preset.tokens.typography.fontSans.split(',').map((f) => f.trim().replace(/"/g, '')),
    mono: preset.tokens.typography.fontMono.split(',').map((f) => f.trim().replace(/"/g, '')),
    display: preset.tokens.typography.fontDisplay.split(',').map((f) => f.trim().replace(/"/g, '')),
  };

  // Border radius
  const radiusMap: Record<string, string> = {};
  for (const [key, value] of Object.entries(preset.tokens.radius)) {
    const tailwindKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    radiusMap[tailwindKey] = value;
  }
  theme.extend.borderRadius = radiusMap;

  // Shadows
  const shadowMap: Record<string, string> = {};
  for (const [key, value] of Object.entries(preset.tokens.shadows)) {
    const tailwindKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    shadowMap[tailwindKey] = value;
  }
  theme.extend.boxShadow = shadowMap;

  // Motion
  const durationMap: Record<string, string> = {};
  for (const [key, value] of Object.entries(preset.tokens.motion)) {
    if (key.startsWith('duration')) {
      const tailwindKey = key.replace('duration', '').toLowerCase();
      durationMap[tailwindKey] = value;
    }
  }
  theme.extend.transitionDuration = durationMap;

  const easingMap: Record<string, string> = {};
  for (const [key, value] of Object.entries(preset.tokens.motion)) {
    if (key.startsWith('easing')) {
      const tailwindKey = key.replace('easing', '').toLowerCase();
      easingMap[tailwindKey] = value;
    }
  }
  theme.extend.transitionTimingFunction = easingMap;

  return config;
}