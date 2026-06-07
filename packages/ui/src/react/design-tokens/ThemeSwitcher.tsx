/**
 * ThemeSwitcher — Visual theme selection component
 * Displays theme presets with previews and aesthetic descriptions
 */

import React from 'react';
import { useTheme } from './ThemeProvider.js';
import type { ThemePreset } from './types.js';

interface ThemeCardProps {
  preset: ThemePreset;
  isActive: boolean;
  onSelect: () => void;
}

function ThemeCard({ preset, isActive, onSelect }: ThemeCardProps) {
  const { colors } = preset.tokens;

  return (
    <button
      onClick={onSelect}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px',
        borderRadius: '12px',
        border: isActive
          ? `2px solid ${colors.accent}`
          : '2px solid transparent',
        background: colors.surface,
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'all 200ms ease',
        boxShadow: isActive
          ? `0 0 0 4px ${colors.accentMuted}`
          : 'none',
      }}
    >
      {/* Color preview dots */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[colors.bg, colors.surface, colors.accent, colors.success, colors.danger].map(
          (color, i) => (
            <div
              key={i}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: color,
                border: '2px solid rgba(255,255,255,0.1)',
              }}
            />
          ),
        )}
      </div>

      {/* Theme name */}
      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: colors.text,
          lineHeight: 1.2,
        }}
      >
        {preset.displayName}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: '12px',
          color: colors.textMuted,
          lineHeight: 1.4,
        }}
      >
        {preset.description}
      </div>

      {/* Aesthetic direction */}
      <div
        style={{
          fontSize: '11px',
          color: colors.textSubtle,
          fontStyle: 'italic',
          lineHeight: 1.4,
        }}
      >
        {preset.aestheticDirection}
      </div>

      {/* Signature element */}
      <div
        style={{
          fontSize: '11px',
          color: colors.accent,
          lineHeight: 1.4,
          padding: '4px 8px',
          background: colors.accentMuted,
          borderRadius: '6px',
        }}
      >
        {preset.unforgettableElement}
      </div>
    </button>
  );
}

interface ThemeSwitcherProps {
  /** Optional callback when theme changes */
  onThemeChange?: (name: string) => void;
  /** Layout direction */
  layout?: 'grid' | 'list';
  /** Show detailed descriptions */
  showDetails?: boolean;
}

export function ThemeSwitcher({
  onThemeChange,
  layout = 'grid',
  showDetails = true,
}: ThemeSwitcherProps) {
  const { currentTheme, availableThemes, setTheme } = useTheme();

  const handleSelect = (name: string) => {
    setTheme(name);
    onThemeChange?.(name);
  };

  return (
    <div
      style={{
        padding: '16px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: currentTheme.tokens.colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '12px',
        }}
      >
        Theme ({availableThemes.length})
      </div>

      <div
        style={{
          display: layout === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fill, minmax(240px, 1fr))' : undefined,
          flexDirection: layout === 'list' ? 'column' : undefined,
          gap: '12px',
        }}
      >
        {availableThemes.map((preset) => (
          <ThemeCard
            key={preset.name}
            preset={preset}
            isActive={currentTheme.name === preset.name}
            onSelect={() => handleSelect(preset.name)}
          />
        ))}
      </div>
    </div>
  );
}