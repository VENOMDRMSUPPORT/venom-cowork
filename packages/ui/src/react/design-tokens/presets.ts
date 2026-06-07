/**
 * VenomCowork Theme Presets — Unconventional, Professional Aesthetics
 *
 * Each preset has:
 * - Named aesthetic direction
 * - One unforgettable signature element
 * - Explicit anti-pattern avoided
 * - Full OKLCH-based token set
 */

import type { ThemePreset, DesignTokens, ColorHarmonyRule } from './types.js';
import {
  oklchToString,
  generateColorScale,
  generateHarmony,
  ensureContrast,
} from './oklch.js';

// ─── Base utility ──────────────────────────────────────────────────────────────

function buildTokenBlock(partial: Partial<DesignTokens>): DesignTokens {
  return {
    colors: partial.colors!,
    colorScales: partial.colorScales!,
    typography: partial.typography!,
    spacing: partial.spacing!,
    radius: partial.radius!,
    shadows: partial.shadows!,
    motion: partial.motion!,
    breakpoints: partial.breakpoints!,
    zIndex: partial.zIndex!,
  };
}

const defaultSpacing = {
  space0: '0',
  space1: '0.25rem',
  space2: '0.5rem',
  space3: '0.75rem',
  space4: '1rem',
  space5: '1.25rem',
  space6: '1.5rem',
  space8: '2rem',
  space10: '2.5rem',
  space12: '3rem',
  space16: '4rem',
  space20: '5rem',
  space24: '6rem',
  space32: '8rem',
};

const defaultBreakpoints = {
  bpSm: '640px',
  bpMd: '768px',
  bpLg: '1024px',
  bpXl: '1280px',
  bp2xl: '1536px',
};

const defaultZIndex = {
  zHide: '-1',
  zBase: '0',
  zDropdown: '1000',
  zSticky: '1100',
  zModal: '1300',
  zPopover: '1400',
  zTooltip: '1500',
  zToast: '1600',
};

// ─── Theme 1: Obsidian Noir ────────────────────────────────────────────────────
// Aesthetic: Cinematic dark luxury with warm amber accents
// Unforgettable: Amber glow that pulses subtly on interactive elements
// Anti-pattern: Generic dark mode with blue/purple accents

function obsidianNoir(): ThemePreset {
  const amber = { l: 0.75, c: 0.18, h: 65 } as const;
  const slate = { l: 0.25, c: 0.015, h: 260 } as const;

  const accentScale = generateColorScale(amber);
  const neutralScale = generateColorScale(slate);

  const colors = {
    bg: oklchToString({ l: 0.12, c: 0.015, h: 260 }),
    bgSecondary: oklchToString({ l: 0.16, c: 0.018, h: 260 }),
    bgTeritary: oklchToString({ l: 0.20, c: 0.02, h: 260 }),
    bgInverse: oklchToString({ l: 0.95, c: 0.01, h: 260 }),

    surface: oklchToString({ l: 0.18, c: 0.02, h: 260 }),
    surfaceHover: oklchToString({ l: 0.22, c: 0.025, h: 260 }),
    surfaceActive: oklchToString({ l: 0.26, c: 0.03, h: 260 }),
    surfaceBorder: oklchToString({ l: 0.28, c: 0.02, h: 260 }),

    text: oklchToString({ l: 0.95, c: 0.01, h: 260 }),
    textMuted: oklchToString({ l: 0.70, c: 0.02, h: 260 }),
    textSubtle: oklchToString({ l: 0.55, c: 0.015, h: 260 }),
    textInverse: oklchToString({ l: 0.12, c: 0.015, h: 260 }),
    textAccent: oklchToString(amber),

    accent: oklchToString(amber),
    accentHover: oklchToString({ l: 0.80, c: 0.20, h: 65 }),
    accentActive: oklchToString({ l: 0.70, c: 0.16, h: 65 }),
    accentMuted: oklchToString({ l: 0.25, c: 0.06, h: 65 }),
    accentForeground: oklchToString({ l: 0.12, c: 0.015, h: 260 }),

    success: oklchToString({ l: 0.70, c: 0.18, h: 155 }),
    successForeground: oklchToString({ l: 0.15, c: 0.02, h: 155 }),
    warning: oklchToString({ l: 0.78, c: 0.16, h: 85 }),
    warningForeground: oklchToString({ l: 0.20, c: 0.02, h: 85 }),
    danger: oklchToString({ l: 0.62, c: 0.22, h: 25 }),
    dangerForeground: oklchToString({ l: 0.95, c: 0.02, h: 25 }),
    info: oklchToString({ l: 0.70, c: 0.14, h: 240 }),
    infoForeground: oklchToString({ l: 0.95, c: 0.02, h: 240 }),

    ring: oklchToString({ l: 0.75, c: 0.18, h: 65, alpha: 0.5 }),
    ringOffset: oklchToString({ l: 0.12, c: 0.015, h: 260 }),
  };

  const cssVariables: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssVariables[`--color-${cssKey}`] = value;
  }

  return {
    name: 'obsidian-noir',
    displayName: 'Obsidian Noir',
    description: 'Cinematic dark luxury with warm amber accents',
    aestheticDirection: 'Film noir meets modern luxury — deep obsidian surfaces with warm amber highlights that feel like candlelight in a dark room',
    unforgettableElement: 'Amber glow that pulses subtly on interactive elements, creating a sense of living warmth',
    antiPattern: 'Generic dark mode with blue/purple accents — this is warm, not cold',
    tokens: buildTokenBlock({
      colors,
      colorScales: {
        neutral: neutralScale,
        accent: accentScale,
        success: generateColorScale({ l: 0.70, c: 0.18, h: 155 }),
        warning: generateColorScale({ l: 0.78, c: 0.16, h: 85 }),
        danger: generateColorScale({ l: 0.62, c: 0.22, h: 25 }),
        info: generateColorScale({ l: 0.70, c: 0.14, h: 240 }),
      },
      typography: {
        fontSans: '"Inter", "SF Pro Display", system-ui, sans-serif',
        fontMono: '"JetBrains Mono", "Fira Code", monospace',
        fontDisplay: '"Playfair Display", "Georgia", serif',
        textXs: '0.75rem',
        textSm: '0.875rem',
        textBase: '1rem',
        textLg: '1.125rem',
        textXl: '1.25rem',
        text2xl: '1.5rem',
        text3xl: '1.875rem',
        text4xl: '2.25rem',
        text5xl: '3rem',
        leadingTight: '1.25',
        leadingSnug: '1.375',
        leadingNormal: '1.5',
        leadingRelaxed: '1.625',
        trackingTight: '-0.025em',
        trackingNormal: '0',
        trackingWide: '0.025em',
        fontNormal: '400',
        fontMedium: '500',
        fontSemibold: '600',
        fontBold: '700',
      },
      spacing: defaultSpacing,
      radius: {
        radiusNone: '0',
        radiusSm: '0.25rem',
        radiusMd: '0.5rem',
        radiusLg: '0.75rem',
        radiusXl: '1rem',
        radius2xl: '1.5rem',
        radiusFull: '9999px',
      },
      shadows: {
        shadowXs: '0 1px 2px oklch(0% 0 0 / 0.05)',
        shadowSm: '0 1px 3px oklch(0% 0 0 / 0.1), 0 1px 2px oklch(0% 0 0 / 0.06)',
        shadowMd: '0 4px 6px oklch(0% 0 0 / 0.1), 0 2px 4px oklch(0% 0 0 / 0.06)',
        shadowLg: '0 10px 15px oklch(0% 0 0 / 0.1), 0 4px 6px oklch(0% 0 0 / 0.05)',
        shadowXl: '0 20px 25px oklch(0% 0 0 / 0.1), 0 10px 10px oklch(0% 0 0 / 0.04)',
        shadow2xl: '0 25px 50px oklch(0% 0 0 / 0.25)',
        shadowInner: 'inset 0 2px 4px oklch(0% 0 0 / 0.06)',
      },
      motion: {
        durationFast: '150ms',
        durationNormal: '250ms',
        durationSlow: '400ms',
        durationSlower: '600ms',
        easingLinear: 'linear',
        easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easingInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easingSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      breakpoints: defaultBreakpoints,
      zIndex: defaultZIndex,
    }),
    cssVariables,
  };
}

// ─── Theme 2: Arctic Bloom ────────────────────────────────────────────────────
// Aesthetic: Crisp Scandinavian minimalism with organic coral/sage accents
// Unforgettable: Living gradient that shifts subtly with scroll position
// Anti-pattern: Sterile cold white UI — this breathes with organic warmth

function arcticBloom(): ThemePreset {
  const coral = { l: 0.70, c: 0.14, h: 15 } as const;
  const sage = { l: 0.72, c: 0.10, h: 155 } as const;
  const frost = { l: 0.98, c: 0.008, h: 230 } as const;

  const accentScale = generateColorScale(coral);
  const neutralScale = generateColorScale(frost);

  const colors = {
    bg: oklchToString({ l: 0.98, c: 0.008, h: 230 }),
    bgSecondary: oklchToString({ l: 0.96, c: 0.01, h: 230 }),
    bgTeritary: oklchToString({ l: 0.93, c: 0.012, h: 230 }),
    bgInverse: oklchToString({ l: 0.15, c: 0.02, h: 230 }),

    surface: oklchToString({ l: 1.0, c: 0.005, h: 230 }),
    surfaceHover: oklchToString({ l: 0.97, c: 0.012, h: 15 }),
    surfaceActive: oklchToString({ l: 0.94, c: 0.018, h: 15 }),
    surfaceBorder: oklchToString({ l: 0.90, c: 0.008, h: 230 }),

    text: oklchToString({ l: 0.18, c: 0.02, h: 230 }),
    textMuted: oklchToString({ l: 0.45, c: 0.015, h: 230 }),
    textSubtle: oklchToString({ l: 0.60, c: 0.01, h: 230 }),
    textInverse: oklchToString({ l: 0.98, c: 0.008, h: 230 }),
    textAccent: oklchToString(coral),

    accent: oklchToString(coral),
    accentHover: oklchToString({ l: 0.62, c: 0.16, h: 15 }),
    accentActive: oklchToString({ l: 0.55, c: 0.14, h: 15 }),
    accentMuted: oklchToString({ l: 0.92, c: 0.04, h: 15 }),
    accentForeground: oklchToString({ l: 1.0, c: 0.005, h: 230 }),

    success: oklchToString(sage),
    successForeground: oklchToString({ l: 0.20, c: 0.03, h: 155 }),
    warning: oklchToString({ l: 0.75, c: 0.15, h: 75 }),
    warningForeground: oklchToString({ l: 0.20, c: 0.03, h: 75 }),
    danger: oklchToString({ l: 0.60, c: 0.20, h: 20 }),
    dangerForeground: oklchToString({ l: 0.98, c: 0.01, h: 20 }),
    info: oklchToString({ l: 0.65, c: 0.12, h: 220 }),
    infoForeground: oklchToString({ l: 0.98, c: 0.01, h: 220 }),

    ring: oklchToString({ l: 0.70, c: 0.14, h: 15, alpha: 0.4 }),
    ringOffset: oklchToString({ l: 1.0, c: 0.005, h: 230 }),
  };

  const cssVariables: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssVariables[`--color-${cssKey}`] = value;
  }

  return {
    name: 'arctic-bloom',
    displayName: 'Arctic Bloom',
    description: 'Crisp Scandinavian minimalism with organic coral and sage accents',
    aestheticDirection: 'Nordic clarity meets organic warmth — frost-white surfaces with coral and sage that feel like spring breaking through snow',
    unforgettableElement: 'Living gradient that shifts subtly with scroll position, creating a sense of seasonal change within the interface',
    antiPattern: 'Sterile cold white UI — this breathes with organic warmth, not clinical precision',
    tokens: buildTokenBlock({
      colors,
      colorScales: {
        neutral: neutralScale,
        accent: accentScale,
        success: generateColorScale(sage),
        warning: generateColorScale({ l: 0.75, c: 0.15, h: 75 }),
        danger: generateColorScale({ l: 0.60, c: 0.20, h: 20 }),
        info: generateColorScale({ l: 0.65, c: 0.12, h: 220 }),
      },
      typography: {
        fontSans: '"DM Sans", "SF Pro Text", system-ui, sans-serif',
        fontMono: '"IBM Plex Mono", "Courier New", monospace',
        fontDisplay: '"Fraunces", "Georgia", serif',
        textXs: '0.75rem',
        textSm: '0.875rem',
        textBase: '1rem',
        textLg: '1.125rem',
        textXl: '1.25rem',
        text2xl: '1.5rem',
        text3xl: '1.875rem',
        text4xl: '2.25rem',
        text5xl: '3rem',
        leadingTight: '1.2',
        leadingSnug: '1.35',
        leadingNormal: '1.5',
        leadingRelaxed: '1.65',
        trackingTight: '-0.02em',
        trackingNormal: '0',
        trackingWide: '0.03em',
        fontNormal: '400',
        fontMedium: '500',
        fontSemibold: '600',
        fontBold: '700',
      },
      spacing: defaultSpacing,
      radius: {
        radiusNone: '0',
        radiusSm: '0.375rem',
        radiusMd: '0.625rem',
        radiusLg: '0.875rem',
        radiusXl: '1.25rem',
        radius2xl: '1.75rem',
        radiusFull: '9999px',
      },
      shadows: {
        shadowXs: '0 1px 2px oklch(50% 0.01 230 / 0.03)',
        shadowSm: '0 1px 3px oklch(50% 0.01 230 / 0.06), 0 1px 2px oklch(50% 0.01 230 / 0.04)',
        shadowMd: '0 4px 8px oklch(50% 0.01 230 / 0.06), 0 2px 4px oklch(50% 0.01 230 / 0.04)',
        shadowLg: '0 12px 20px oklch(50% 0.01 230 / 0.08), 0 4px 8px oklch(50% 0.01 230 / 0.04)',
        shadowXl: '0 24px 40px oklch(50% 0.01 230 / 0.10), 0 8px 16px oklch(50% 0.01 230 / 0.04)',
        shadow2xl: '0 32px 64px oklch(50% 0.01 230 / 0.14)',
        shadowInner: 'inset 0 2px 4px oklch(50% 0.01 230 / 0.04)',
      },
      motion: {
        durationFast: '120ms',
        durationNormal: '200ms',
        durationSlow: '350ms',
        durationSlower: '500ms',
        easingLinear: 'linear',
        easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easingInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easingSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      breakpoints: defaultBreakpoints,
      zIndex: defaultZIndex,
    }),
    cssVariables,
  };
}

// ─── Theme 3: Industrial Brutalist ─────────────────────────────────────────────
// Aesthetic: Raw, honest brutalism with electric lime energy
// Unforgettable: Hard borders, monospaced everything, lime that cuts through concrete
// Anti-pattern: Soft rounded pastel UI — this is architecture, not decoration

function industrialBrutalist(): ThemePreset {
  const lime = { l: 0.82, c: 0.22, h: 130 } as const;
  const concrete = { l: 0.22, c: 0.008, h: 0 } as const;

  const accentScale = generateColorScale(lime);
  const neutralScale = generateColorScale(concrete);

  const colors = {
    bg: oklchToString({ l: 0.14, c: 0.008, h: 0 }),
    bgSecondary: oklchToString({ l: 0.18, c: 0.01, h: 0 }),
    bgTeritary: oklchToString({ l: 0.22, c: 0.012, h: 0 }),
    bgInverse: oklchToString({ l: 0.95, c: 0.005, h: 0 }),

    surface: oklchToString({ l: 0.20, c: 0.01, h: 0 }),
    surfaceHover: oklchToString({ l: 0.25, c: 0.015, h: 0 }),
    surfaceActive: oklchToString({ l: 0.30, c: 0.02, h: 0 }),
    surfaceBorder: oklchToString({ l: 0.35, c: 0.01, h: 0 }),

    text: oklchToString({ l: 0.95, c: 0.005, h: 0 }),
    textMuted: oklchToString({ l: 0.65, c: 0.01, h: 0 }),
    textSubtle: oklchToString({ l: 0.50, c: 0.008, h: 0 }),
    textInverse: oklchToString({ l: 0.14, c: 0.008, h: 0 }),
    textAccent: oklchToString(lime),

    accent: oklchToString(lime),
    accentHover: oklchToString({ l: 0.88, c: 0.24, h: 130 }),
    accentActive: oklchToString({ l: 0.76, c: 0.20, h: 130 }),
    accentMuted: oklchToString({ l: 0.25, c: 0.06, h: 130 }),
    accentForeground: oklchToString({ l: 0.10, c: 0.01, h: 0 }),

    success: oklchToString({ l: 0.75, c: 0.18, h: 155 }),
    successForeground: oklchToString({ l: 0.15, c: 0.02, h: 155 }),
    warning: oklchToString({ l: 0.78, c: 0.18, h: 85 }),
    warningForeground: oklchToString({ l: 0.20, c: 0.02, h: 85 }),
    danger: oklchToString({ l: 0.62, c: 0.24, h: 15 }),
    dangerForeground: oklchToString({ l: 0.95, c: 0.02, h: 15 }),
    info: oklchToString({ l: 0.70, c: 0.14, h: 240 }),
    infoForeground: oklchToString({ l: 0.95, c: 0.02, h: 240 }),

    ring: oklchToString({ l: 0.82, c: 0.22, h: 130, alpha: 0.6 }),
    ringOffset: oklchToString({ l: 0.14, c: 0.008, h: 0 }),
  };

  const cssVariables: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssVariables[`--color-${cssKey}`] = value;
  }

  return {
    name: 'industrial-brutalist',
    displayName: 'Industrial Brutalist',
    description: 'Raw honest brutalism with electric lime energy',
    aestheticDirection: 'Concrete meets electricity — monospaced clarity with lime that cuts through darkness like a laser through fog',
    unforgettableElement: 'Hard 2px borders on everything, lime accent that feels like it could power a building',
    antiPattern: 'Soft rounded pastel UI — this is architecture, not decoration',
    tokens: buildTokenBlock({
      colors,
      colorScales: {
        neutral: neutralScale,
        accent: accentScale,
        success: generateColorScale({ l: 0.75, c: 0.18, h: 155 }),
        warning: generateColorScale({ l: 0.78, c: 0.18, h: 85 }),
        danger: generateColorScale({ l: 0.62, c: 0.24, h: 15 }),
        info: generateColorScale({ l: 0.70, c: 0.14, h: 240 }),
      },
      typography: {
        fontSans: '"Space Mono", "JetBrains Mono", monospace',
        fontMono: '"Space Mono", "JetBrains Mono", monospace',
        fontDisplay: '"Space Mono", "JetBrains Mono", monospace',
        textXs: '0.75rem',
        textSm: '0.875rem',
        textBase: '1rem',
        textLg: '1.125rem',
        textXl: '1.25rem',
        text2xl: '1.5rem',
        text3xl: '1.875rem',
        text4xl: '2.25rem',
        text5xl: '3rem',
        leadingTight: '1.3',
        leadingSnug: '1.4',
        leadingNormal: '1.5',
        leadingRelaxed: '1.6',
        trackingTight: '-0.01em',
        trackingNormal: '0',
        trackingWide: '0.05em',
        fontNormal: '400',
        fontMedium: '500',
        fontSemibold: '600',
        fontBold: '700',
      },
      spacing: defaultSpacing,
      radius: {
        radiusNone: '0',
        radiusSm: '0',
        radiusMd: '0',
        radiusLg: '0',
        radiusXl: '0',
        radius2xl: '0',
        radiusFull: '0',
      },
      shadows: {
        shadowXs: '0 0 0 1px oklch(50% 0.01 0 / 0.3)',
        shadowSm: '0 0 0 1px oklch(50% 0.01 0 / 0.3)',
        shadowMd: '0 0 0 2px oklch(50% 0.01 0 / 0.3)',
        shadowLg: '0 0 0 2px oklch(50% 0.01 0 / 0.3)',
        shadowXl: '0 0 0 3px oklch(50% 0.01 0 / 0.3)',
        shadow2xl: '0 0 0 3px oklch(50% 0.01 0 / 0.3)',
        shadowInner: 'inset 0 0 0 1px oklch(50% 0.01 0 / 0.3)',
      },
      motion: {
        durationFast: '80ms',
        durationNormal: '150ms',
        durationSlow: '250ms',
        durationSlower: '400ms',
        easingLinear: 'linear',
        easingIn: 'cubic-bezier(0, 0, 1, 1)',
        easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easingInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easingSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      breakpoints: defaultBreakpoints,
      zIndex: defaultZIndex,
    }),
    cssVariables,
  };
}

// ─── Theme 4: Twilight Editorial ──────────────────────────────────────────────
// Aesthetic: Magazine-inspired editorial with rich violet and warm gold
// Unforgettable: Typography-first layout where text IS the visual element
// Anti-pattern: Card-grid dashboard with icons — this is editorial, not app

function twilightEditorial(): ThemePreset {
  const violet = { l: 0.55, c: 0.18, h: 285 } as const;
  const gold = { l: 0.78, c: 0.16, h: 80 } as const;
  const ink = { l: 0.15, c: 0.025, h: 280 } as const;

  const accentScale = generateColorScale(violet);
  const neutralScale = generateColorScale(ink);

  const colors = {
    bg: oklchToString({ l: 0.97, c: 0.01, h: 280 }),
    bgSecondary: oklchToString({ l: 0.94, c: 0.015, h: 280 }),
    bgTeritary: oklchToString({ l: 0.90, c: 0.02, h: 280 }),
    bgInverse: oklchToString({ l: 0.12, c: 0.025, h: 280 }),

    surface: oklchToString({ l: 1.0, c: 0.005, h: 280 }),
    surfaceHover: oklchToString({ l: 0.96, c: 0.02, h: 285 }),
    surfaceActive: oklchToString({ l: 0.92, c: 0.03, h: 285 }),
    surfaceBorder: oklchToString({ l: 0.88, c: 0.015, h: 280 }),

    text: oklchToString({ l: 0.12, c: 0.025, h: 280 }),
    textMuted: oklchToString({ l: 0.40, c: 0.02, h: 280 }),
    textSubtle: oklchToString({ l: 0.55, c: 0.015, h: 280 }),
    textInverse: oklchToString({ l: 0.97, c: 0.01, h: 280 }),
    textAccent: oklchToString(violet),

    accent: oklchToString(violet),
    accentHover: oklchToString({ l: 0.48, c: 0.20, h: 285 }),
    accentActive: oklchToString({ l: 0.42, c: 0.18, h: 285 }),
    accentMuted: oklchToString({ l: 0.92, c: 0.05, h: 285 }),
    accentForeground: oklchToString({ l: 0.97, c: 0.01, h: 280 }),

    success: oklchToString({ l: 0.65, c: 0.16, h: 155 }),
    successForeground: oklchToString({ l: 0.15, c: 0.02, h: 155 }),
    warning: oklchToString(gold),
    warningForeground: oklchToString({ l: 0.20, c: 0.03, h: 80 }),
    danger: oklchToString({ l: 0.58, c: 0.20, h: 25 }),
    dangerForeground: oklchToString({ l: 0.97, c: 0.01, h: 25 }),
    info: oklchToString({ l: 0.60, c: 0.12, h: 240 }),
    infoForeground: oklchToString({ l: 0.97, c: 0.01, h: 240 }),

    ring: oklchToString({ l: 0.55, c: 0.18, h: 285, alpha: 0.4 }),
    ringOffset: oklchToString({ l: 0.97, c: 0.01, h: 280 }),
  };

  const cssVariables: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssVariables[`--color-${cssKey}`] = value;
  }

  return {
    name: 'twilight-editorial',
    displayName: 'Twilight Editorial',
    description: 'Magazine-inspired editorial with rich violet and warm gold',
    aestheticDirection: 'Where typography becomes architecture — violet ink on warm parchment with gold accents that catch the eye like a headline',
    unforgettableElement: 'Oversized display type that bleeds into adjacent sections, creating a sense of narrative flow',
    antiPattern: 'Card-grid dashboard with icons — this is editorial storytelling, not an app interface',
    tokens: buildTokenBlock({
      colors,
      colorScales: {
        neutral: neutralScale,
        accent: accentScale,
        success: generateColorScale({ l: 0.65, c: 0.16, h: 155 }),
        warning: generateColorScale(gold),
        danger: generateColorScale({ l: 0.58, c: 0.20, h: 25 }),
        info: generateColorScale({ l: 0.60, c: 0.12, h: 240 }),
      },
      typography: {
        fontSans: '"Source Sans 3", "SF Pro Text", system-ui, sans-serif',
        fontMono: '"Source Code Pro", "Courier New", monospace',
        fontDisplay: '"Playfair Display", "Georgia", serif',
        textXs: '0.75rem',
        textSm: '0.875rem',
        textBase: '1.125rem',
        textLg: '1.25rem',
        textXl: '1.375rem',
        text2xl: '1.75rem',
        text3xl: '2.25rem',
        text4xl: '3rem',
        text5xl: '4rem',
        leadingTight: '1.15',
        leadingSnug: '1.3',
        leadingNormal: '1.6',
        leadingRelaxed: '1.75',
        trackingTight: '-0.03em',
        trackingNormal: '0',
        trackingWide: '0.04em',
        fontNormal: '400',
        fontMedium: '500',
        fontSemibold: '600',
        fontBold: '700',
      },
      spacing: defaultSpacing,
      radius: {
        radiusNone: '0',
        radiusSm: '0.125rem',
        radiusMd: '0.25rem',
        radiusLg: '0.375rem',
        radiusXl: '0.5rem',
        radius2xl: '0.75rem',
        radiusFull: '9999px',
      },
      shadows: {
        shadowXs: '0 1px 2px oklch(20% 0.02 280 / 0.04)',
        shadowSm: '0 1px 3px oklch(20% 0.02 280 / 0.06), 0 1px 2px oklch(20% 0.02 280 / 0.04)',
        shadowMd: '0 4px 8px oklch(20% 0.02 280 / 0.06), 0 2px 4px oklch(20% 0.02 280 / 0.04)',
        shadowLg: '0 10px 16px oklch(20% 0.02 280 / 0.08), 0 4px 6px oklch(20% 0.02 280 / 0.04)',
        shadowXl: '0 20px 30px oklch(20% 0.02 280 / 0.10), 0 8px 12px oklch(20% 0.02 280 / 0.04)',
        shadow2xl: '0 25px 50px oklch(20% 0.02 280 / 0.16)',
        shadowInner: 'inset 0 2px 4px oklch(20% 0.02 280 / 0.04)',
      },
      motion: {
        durationFast: '140ms',
        durationNormal: '240ms',
        durationSlow: '400ms',
        durationSlower: '600ms',
        easingLinear: 'linear',
        easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easingInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easingSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      breakpoints: defaultBreakpoints,
      zIndex: defaultZIndex,
    }),
    cssVariables,
  };
}

// ─── Theme 5: Neon Depth ──────────────────────────────────────────────────────
// Aesthetic: Deep space with electric cyan/magenta nebulas
// Unforgettable: Depth-of-field effect where foreground elements float above a nebula
// Anti-pattern: Flat Material Design — this has cosmic depth

function neonDepth(): ThemePreset {
  const cyan = { l: 0.80, c: 0.18, h: 195 } as const;
  const magenta = { l: 0.65, c: 0.22, h: 330 } as const;
  const void_ = { l: 0.08, c: 0.02, h: 260 } as const;

  const accentScale = generateColorScale(cyan);
  const neutralScale = generateColorScale(void_);

  const colors = {
    bg: oklchToString({ l: 0.06, c: 0.02, h: 260 }),
    bgSecondary: oklchToString({ l: 0.10, c: 0.025, h: 260 }),
    bgTeritary: oklchToString({ l: 0.14, c: 0.03, h: 260 }),
    bgInverse: oklchToString({ l: 0.95, c: 0.01, h: 260 }),

    surface: oklchToString({ l: 0.12, c: 0.03, h: 260 }),
    surfaceHover: oklchToString({ l: 0.16, c: 0.04, h: 260 }),
    surfaceActive: oklchToString({ l: 0.20, c: 0.05, h: 260 }),
    surfaceBorder: oklchToString({ l: 0.25, c: 0.04, h: 260 }),

    text: oklchToString({ l: 0.95, c: 0.01, h: 260 }),
    textMuted: oklchToString({ l: 0.65, c: 0.03, h: 260 }),
    textSubtle: oklchToString({ l: 0.50, c: 0.02, h: 260 }),
    textInverse: oklchToString({ l: 0.06, c: 0.02, h: 260 }),
    textAccent: oklchToString(cyan),

    accent: oklchToString(cyan),
    accentHover: oklchToString({ l: 0.86, c: 0.20, h: 195 }),
    accentActive: oklchToString({ l: 0.74, c: 0.16, h: 195 }),
    accentMuted: oklchToString({ l: 0.20, c: 0.06, h: 195 }),
    accentForeground: oklchToString({ l: 0.06, c: 0.02, h: 260 }),

    success: oklchToString({ l: 0.72, c: 0.18, h: 155 }),
    successForeground: oklchToString({ l: 0.15, c: 0.02, h: 155 }),
    warning: oklchToString({ l: 0.80, c: 0.18, h: 80 }),
    warningForeground: oklchToString({ l: 0.20, c: 0.02, h: 80 }),
    danger: oklchToString(magenta),
    dangerForeground: oklchToString({ l: 0.95, c: 0.02, h: 330 }),
    info: oklchToString(cyan),
    infoForeground: oklchToString({ l: 0.06, c: 0.02, h: 260 }),

    ring: oklchToString({ l: 0.80, c: 0.18, h: 195, alpha: 0.5 }),
    ringOffset: oklchToString({ l: 0.06, c: 0.02, h: 260 }),
  };

  const cssVariables: Record<string, string> = {};
  for (const [key, value] of Object.entries(colors)) {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    cssVariables[`--color-${cssKey}`] = value;
  }

  return {
    name: 'neon-depth',
    displayName: 'Neon Depth',
    description: 'Deep space with electric cyan and magenta nebulas',
    aestheticDirection: 'Cosmic depth meets electric precision — void-dark surfaces with cyan and magenta that glow like nebulae in the distance',
    unforgettableElement: 'Depth-of-field effect where foreground elements float above a nebula, creating tangible spatial hierarchy',
    antiPattern: 'Flat Material Design — this has cosmic depth, with layers that feel like they could be touched',
    tokens: buildTokenBlock({
      colors,
      colorScales: {
        neutral: neutralScale,
        accent: accentScale,
        success: generateColorScale({ l: 0.72, c: 0.18, h: 155 }),
        warning: generateColorScale({ l: 0.80, c: 0.18, h: 80 }),
        danger: generateColorScale(magenta),
        info: generateColorScale(cyan),
      },
      typography: {
        fontSans: '"Geist", "SF Pro Display", system-ui, sans-serif',
        fontMono: '"Geist Mono", "Fira Code", monospace',
        fontDisplay: '"Geist", "SF Pro Display", system-ui, sans-serif',
        textXs: '0.75rem',
        textSm: '0.875rem',
        textBase: '1rem',
        textLg: '1.125rem',
        textXl: '1.25rem',
        text2xl: '1.5rem',
        text3xl: '1.875rem',
        text4xl: '2.25rem',
        text5xl: '3rem',
        leadingTight: '1.2',
        leadingSnug: '1.35',
        leadingNormal: '1.5',
        leadingRelaxed: '1.625',
        trackingTight: '-0.025em',
        trackingNormal: '0',
        trackingWide: '0.025em',
        fontNormal: '400',
        fontMedium: '500',
        fontSemibold: '600',
        fontBold: '700',
      },
      spacing: defaultSpacing,
      radius: {
        radiusNone: '0',
        radiusSm: '0.375rem',
        radiusMd: '0.625rem',
        radiusLg: '0.875rem',
        radiusXl: '1.25rem',
        radius2xl: '1.75rem',
        radiusFull: '9999px',
      },
      shadows: {
        shadowXs: '0 0 8px oklch(80% 0.18 195 / 0.1)',
        shadowSm: '0 0 12px oklch(80% 0.18 195 / 0.12), 0 2px 4px oklch(0% 0 0 / 0.3)',
        shadowMd: '0 0 20px oklch(80% 0.18 195 / 0.15), 0 4px 8px oklch(0% 0 0 / 0.3)',
        shadowLg: '0 0 30px oklch(80% 0.18 195 / 0.18), 0 8px 16px oklch(0% 0 0 / 0.3)',
        shadowXl: '0 0 40px oklch(80% 0.18 195 / 0.22), 0 16px 32px oklch(0% 0 0 / 0.3)',
        shadow2xl: '0 0 60px oklch(80% 0.18 195 / 0.28), 0 24px 48px oklch(0% 0 0 / 0.3)',
        shadowInner: 'inset 0 0 12px oklch(80% 0.18 195 / 0.08)',
      },
      motion: {
        durationFast: '120ms',
        durationNormal: '200ms',
        durationSlow: '350ms',
        durationSlower: '500ms',
        easingLinear: 'linear',
        easingIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easingOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easingInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easingSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      breakpoints: defaultBreakpoints,
      zIndex: defaultZIndex,
    }),
    cssVariables,
  };
}

// ─── Export all presets ────────────────────────────────────────────────────────

export const themePresets: ThemePreset[] = [
  obsidianNoir(),
  arcticBloom(),
  industrialBrutalist(),
  twilightEditorial(),
  neonDepth(),
];

export function getThemePreset(name: string): ThemePreset | undefined {
  return themePresets.find((t) => t.name === name);
}

export function listThemePresets(): Array<{ name: string; displayName: string; description: string }> {
  return themePresets.map((t) => ({
    name: t.name,
    displayName: t.displayName,
    description: t.description,
  }));
}

export { obsidianNoir, arcticBloom, industrialBrutalist, twilightEditorial, neonDepth };