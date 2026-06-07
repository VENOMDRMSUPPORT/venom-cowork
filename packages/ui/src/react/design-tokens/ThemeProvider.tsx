/**
 * ThemeProvider for VenomCowork Design System
 * Injects CSS variables from theme presets into the document root
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ThemePreset } from './types.js';
import { themePresets, getThemePreset } from './presets.js';
import { generateCSSVariables } from './css-generator.js';

interface ThemeContextValue {
  /** Current active theme preset */
  currentTheme: ThemePreset;
  /** All available theme presets */
  availableThemes: ThemePreset[];
  /** Switch to a different theme */
  setTheme: (name: string) => void;
  /** Get a specific theme by name */
  getTheme: (name: string) => ThemePreset | undefined;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'venomcowork-theme';

function getInitialTheme(): ThemePreset {
  if (typeof window === 'undefined') return themePresets[0]!;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const preset = getThemePreset(stored);
      if (preset) return preset;
    }
  } catch {
    // localStorage unavailable
  }

  return themePresets[0]!;
}

interface ThemeProviderProps {
  /** Initial theme name (defaults to stored preference or first preset) */
  initialTheme?: string;
  /** Whether to persist theme selection to localStorage (default: true) */
  persist?: boolean;
  /** Whether to auto-inject CSS variables into :root (default: true) */
  autoInject?: boolean;
  children: React.ReactNode;
}

export function ThemeProvider({
  initialTheme,
  persist = true,
  autoInject = true,
  children,
}: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemePreset>(() => {
    if (initialTheme) {
      const preset = getThemePreset(initialTheme);
      if (preset) return preset;
    }
    return getInitialTheme();
  });

  const setTheme = useCallback(
    (name: string) => {
      const preset = getThemePreset(name);
      if (preset) {
        setCurrentTheme(preset);
        if (persist) {
          try {
            localStorage.setItem(STORAGE_KEY, name);
          } catch {
            // localStorage unavailable
          }
        }
      }
    },
    [persist],
  );

  const getTheme = useCallback((name: string) => {
    return getThemePreset(name);
  }, []);

  // Inject CSS variables into :root
  useEffect(() => {
    if (!autoInject) return;

    const css = generateCSSVariables(currentTheme);
    const styleId = 'venomcowork-design-tokens';

    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = css;

    // Set data-theme attribute for CSS selectors
    document.documentElement.setAttribute('data-theme', currentTheme.name);

    return () => {
      // Cleanup on unmount
      const el = document.getElementById(styleId);
      if (el) el.remove();
      document.documentElement.removeAttribute('data-theme');
    };
  }, [currentTheme, autoInject]);

  const value: ThemeContextValue = {
    currentTheme,
    availableThemes: themePresets,
    setTheme,
    getTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access the current theme context.
 * Must be used within a ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to get current theme's CSS variables as a record.
 * Useful for inline styles or dynamic token access.
 */
export function useThemeTokens(): Record<string, string> {
  const { currentTheme } = useTheme();
  return currentTheme.cssVariables;
}