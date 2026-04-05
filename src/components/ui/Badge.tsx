import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'dot';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  count?: number;
  maxCount?: number;
}

const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string; border: string }> = {
  default: { bg: 'rgba(107,114,128,0.15)', text: '#6B7280', border: 'rgba(107,114,128,0.3)' },
  success: { bg: 'rgba(34,197,94,0.12)', text: '#16A34A', border: 'rgba(34,197,94,0.25)' },
  warning: { bg: 'rgba(234,179,8,0.12)', text: '#B45309', border: 'rgba(234,179,8,0.3)' },
  error: { bg: 'rgba(239,68,68,0.12)', text: '#DC2626', border: 'rgba(239,68,68,0.25)' },
  info: { bg: 'rgba(99,102,241,0.12)', text: '#6366F1', border: 'rgba(99,102,241,0.25)' },
  dot: { bg: '#EF4444', text: '#fff', border: 'transparent' },
};

const DARK_VARIANT_TEXT: Record<BadgeVariant, string> = {
  default: '#9CA3AF',
  success: '#4ADE80',
  warning: '#FCD34D',
  error: '#F87171',
  info: '#818CF8',
  dot: '#fff',
};

export const Badge = React.memo(function Badge({
  children,
  variant = 'default',
  size = 'md',
  count,
  maxCount = 99,
}: BadgeProps) {
  const { isDark } = useTheme();

  if (variant === 'dot') {
    return (
      <span
        style={{
          display: 'inline-block',
          width: size === 'sm' ? '8px' : '10px',
          height: size === 'sm' ? '8px' : '10px',
          borderRadius: '50%',
          background: '#EF4444',
          flexShrink: 0,
        }}
        aria-hidden="true"
      />
    );
  }

  const colors = VARIANT_COLORS[variant];
  const displayText = count !== undefined
    ? count > maxCount ? `${maxCount}+` : String(count)
    : children;

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: size === 'sm' ? '2px 7px' : '3px 10px',
    borderRadius: '999px',
    fontSize: size === 'sm' ? '11px' : '12px',
    fontWeight: 600,
    lineHeight: 1.4,
    background: isDark ? colors.bg.replace('0.12', '0.2').replace('0.15', '0.25') : colors.bg,
    color: isDark ? DARK_VARIANT_TEXT[variant] : colors.text,
    border: `1px solid ${isDark ? colors.border.replace('0.25', '0.35').replace('0.3', '0.4') : colors.border}`,
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  return <span style={style}>{displayText}</span>;
});
