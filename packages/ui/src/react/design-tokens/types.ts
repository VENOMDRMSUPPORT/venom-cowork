/**
 * VenomCowork Design Token System
 * OKLCH-based professional theme engine with unconventional aesthetic presets
 */

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface SemanticColors {
  // Background layers
  bg: string;
  bgSecondary: string;
  bgTeritary: string;
  bgInverse: string;

  // Surface layers
  surface: string;
  surfaceHover: string;
  surfaceActive: string;
  surfaceBorder: string;

  // Text hierarchy
  text: string;
  textMuted: string;
  textSubtle: string;
  textInverse: string;
  textAccent: string;

  // Brand/Accent
  accent: string;
  accentHover: string;
  accentActive: string;
  accentMuted: string;
  accentForeground: string;

  // Status
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  danger: string;
  dangerForeground: string;
  info: string;
  infoForeground: string;

  // Interactive
  ring: string;
  ringOffset: string;
}

export interface TypographyTokens {
  fontSans: string;
  fontMono: string;
  fontDisplay: string;

  textXs: string;
  textSm: string;
  textBase: string;
  textLg: string;
  textXl: string;
  text2xl: string;
  text3xl: string;
  text4xl: string;
  text5xl: string;

  leadingTight: string;
  leadingSnug: string;
  leadingNormal: string;
  leadingRelaxed: string;

  trackingTight: string;
  trackingNormal: string;
  trackingWide: string;

  fontNormal: string;
  fontMedium: string;
  fontSemibold: string;
  fontBold: string;
}

export interface SpacingTokens {
  space0: string;
  space1: string;
  space2: string;
  space3: string;
  space4: string;
  space5: string;
  space6: string;
  space8: string;
  space10: string;
  space12: string;
  space16: string;
  space20: string;
  space24: string;
  space32: string;
}

export interface RadiusTokens {
  radiusNone: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radius2xl: string;
  radiusFull: string;
}

export interface ShadowTokens {
  shadowXs: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadow2xl: string;
  shadowInner: string;
}

export interface MotionTokens {
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
  durationSlower: string;

  easingLinear: string;
  easingIn: string;
  easingOut: string;
  easingInOut: string;
  easingSpring: string;
}

export interface BreakpointTokens {
  bpSm: string;
  bpMd: string;
  bpLg: string;
  bpXl: string;
  bp2xl: string;
}

export interface ZIndexTokens {
  zHide: string;
  zBase: string;
  zDropdown: string;
  zSticky: string;
  zModal: string;
  zPopover: string;
  zTooltip: string;
  zToast: string;
}

export interface DesignTokens {
  colors: SemanticColors;
  colorScales: {
    neutral: ColorScale;
    accent: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    danger: ColorScale;
    info: ColorScale;
  };
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
  motion: MotionTokens;
  breakpoints: BreakpointTokens;
  zIndex: ZIndexTokens;
}

export interface ThemePreset {
  name: string;
  displayName: string;
  description: string;
  aestheticDirection: string;
  unforgettableElement: string;
  antiPattern: string;
  tokens: Partial<DesignTokens>;
  cssVariables: Record<string, string>;
}

export interface OKLCHColor {
  l: number;
  c: number;
  h: number;
  alpha?: number;
}

export interface ColorHarmonyRule {
  type: 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'monochrome' | 'high-contrast';
  baseHue: number;
  distribution: '60-30-10' | '90-10' | '50-50' | 'analogous-wash';
}