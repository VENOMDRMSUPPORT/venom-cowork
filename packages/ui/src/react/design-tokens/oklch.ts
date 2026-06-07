/**
 * OKLCH Color Utilities for VenomCowork Design System
 * Perceptually uniform color space for predictable, harmonious palettes
 */

import type { OKLCHColor, ColorHarmonyRule, ColorScale } from './types.js';

/** Convert OKLCH to CSS string */
export function oklchToString(color: OKLCHColor): string {
  const { l, c, h, alpha } = color;
  const hue = h ?? 0;
  const chroma = c ?? 0;
  if (alpha !== undefined && alpha < 1) {
    return `oklch(${(l * 100).toFixed(2)}% ${chroma.toFixed(4)} ${hue.toFixed(1)} / ${alpha})`;
  }
  return `oklch(${(l * 100).toFixed(2)}% ${chroma.toFixed(4)} ${hue.toFixed(1)})`;
}

/** Parse OKLCH string back to object */
export function parseOklch(str: string): OKLCHColor | null {
  const match = str.match(
    /oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/,
  );
  if (!match) return null;
  return {
    l: parseFloat(match[1]!) / 100,
    c: parseFloat(match[2]!),
    h: parseFloat(match[3]!),
    alpha: match[4] ? parseFloat(match[4]) : undefined,
  };
}

/** Lighten an OKLCH color */
export function lighten(color: OKLCHColor, amount: number): OKLCHColor {
  return {
    ...color,
    l: Math.min(1, color.l + amount),
  };
}

/** Darken an OKLCH color */
export function darken(color: OKLCHColor, amount: number): OKLCHColor {
  return {
    ...color,
    l: Math.max(0, color.l - amount),
  };
}

/** Increase chroma (saturation) */
export function saturate(color: OKLCHColor, amount: number): OKLCHColor {
  return {
    ...color,
    c: Math.min(0.4, color.c + amount),
  };
}

/** Decrease chroma */
export function desaturate(color: OKLCHColor, amount: number): OKLCHColor {
  return {
    ...color,
    c: Math.max(0, color.c - amount),
  };
}

/** Rotate hue */
export function rotateHue(color: OKLCHColor, degrees: number): OKLCHColor {
  return {
    ...color,
    h: ((color.h ?? 0) + degrees + 360) % 360,
  };
}

/** Set alpha channel */
export function withAlpha(color: OKLCHColor, alpha: number): OKLCHColor {
  return { ...color, alpha };
}

/**
 * Generate a full 11-step color scale from a base OKLCH color.
 * Scale ranges from very light (50) to very dark (950).
 */
export function generateColorScale(base: OKLCHColor): ColorScale {
  const hue = base.h ?? 0;
  const chroma = base.c ?? 0.05;

  return {
    50: oklchToString({ l: 0.97, c: chroma * 0.2, h: hue }),
    100: oklchToString({ l: 0.93, c: chroma * 0.3, h: hue }),
    200: oklchToString({ l: 0.87, c: chroma * 0.4, h: hue }),
    300: oklchToString({ l: 0.78, c: chroma * 0.55, h: hue }),
    400: oklchToString({ l: 0.68, c: chroma * 0.7, h: hue }),
    500: oklchToString({ l: 0.58, c: chroma * 0.85, h: hue }),
    600: oklchToString({ l: 0.50, c: chroma, h: hue }),
    700: oklchToString({ l: 0.42, c: chroma * 0.95, h: hue }),
    800: oklchToString({ l: 0.35, c: chroma * 0.85, h: hue }),
    900: oklchToString({ l: 0.28, c: chroma * 0.7, h: hue }),
    950: oklchToString({ l: 0.20, c: chroma * 0.55, h: hue }),
  };
}

/**
 * Generate color harmony based on a rule.
 * Returns array of OKLCH colors following the harmony type.
 */
export function generateHarmony(
  base: OKLCHColor,
  rule: ColorHarmonyRule,
): OKLCHColor[] {
  const { type, baseHue } = rule;
  const hue = baseHue ?? base.h ?? 0;
  const l = base.l;
  const c = base.c ?? 0.08;

  switch (type) {
    case 'complementary':
      return [
        { l, c, h: hue },
        { l, c, h: (hue + 180) % 360 },
      ];

    case 'analogous':
      return [
        { l, c, h: (hue - 30 + 360) % 360 },
        { l, c, h: hue },
        { l, c, h: (hue + 30) % 360 },
      ];

    case 'triadic':
      return [
        { l, c, h: hue },
        { l, c, h: (hue + 120) % 360 },
        { l, c, h: (hue + 240) % 360 },
      ];

    case 'split-complementary':
      return [
        { l, c, h: hue },
        { l, c, h: (hue + 150) % 360 },
        { l, c, h: (hue + 210) % 360 },
      ];

    case 'monochrome':
      return [
        { l: 0.95, c: c * 0.2, h: hue },
        { l: 0.80, c: c * 0.4, h: hue },
        { l: 0.60, c: c * 0.8, h: hue },
        { l: 0.40, c: c * 1.0, h: hue },
        { l: 0.25, c: c * 0.7, h: hue },
      ];

    case 'high-contrast':
      return [
        { l: 0.98, c: 0.01, h: hue },
        { l: 0.15, c: 0.02, h: hue },
        { l, c: c * 1.5, h: hue },
      ];

    default:
      return [{ l, c, h: hue }];
  }
}

/**
 * Compute relative luminance from OKLCH for WCAG contrast.
 * Returns a value between 0 and 1.
 */
export function luminance(color: OKLCHColor): number {
  return color.l;
}

/**
 * Calculate contrast ratio between two colors.
 * Returns value between 1 and 21.
 */
export function contrastRatio(a: OKLCHColor, b: OKLCHColor): number {
  const l1 = Math.max(luminance(a), luminance(b));
  const l2 = Math.min(luminance(a), luminance(b));
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Check WCAG compliance level for a text/background pair.
 */
export function wcagCompliance(
  textColor: OKLCHColor,
  bgColor: OKLCHColor,
): { ratio: number; aa: boolean; aaa: boolean; aaLarge: boolean } {
  const ratio = contrastRatio(textColor, bgColor);
  return {
    ratio,
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
  };
}

/**
 * Ensure a color meets minimum contrast ratio against a background.
 * Adjusts lightness if needed.
 */
export function ensureContrast(
  foreground: OKLCHColor,
  background: OKLCHColor,
  minRatio: number = 4.5,
): OKLCHColor {
  const current = contrastRatio(foreground, background);
  if (current >= minRatio) return foreground;

  // Try darkening first
  for (let step = 0.01; step <= 0.3; step += 0.01) {
    const darker = darken(foreground, step);
    if (contrastRatio(darker, background) >= minRatio) return darker;
  }

  // Try lightening
  for (let step = 0.01; step <= 0.3; step += 0.01) {
    const lighter = lighten(foreground, step);
    if (contrastRatio(lighter, background) >= minRatio) return lighter;
  }

  return foreground;
}