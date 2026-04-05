import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'glass' | 'clickable';

export interface CardProps {
  children?: React.ReactNode;
  variant?: CardVariant;
  padding?: string | number;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export const Card = React.memo(function Card({
  children,
  variant = 'default',
  padding = '20px',
  className,
  onClick,
  style: extraStyle,
  'aria-label': ariaLabel,
}: CardProps) {
  const { isDark } = useTheme();
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  const baseStyles: React.CSSProperties = {
    borderRadius: '16px',
    padding,
    transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
    position: 'relative',
    overflow: 'hidden',
  };

  const variantStyles: Record<CardVariant, React.CSSProperties> = {
    default: {
      background: isDark ? '#1E1E2E' : '#ffffff',
      boxShadow: isDark
        ? '0 1px 3px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)'
        : '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
    },
    elevated: {
      background: isDark ? '#1E1E2E' : '#ffffff',
      boxShadow: isDark
        ? '0 10px 30px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)'
        : '0 10px 30px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)',
    },
    bordered: {
      background: isDark ? '#1E1E2E' : '#ffffff',
      border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}`,
      boxShadow: 'none',
    },
    glass: {
      background: isDark
        ? 'rgba(30,30,46,0.6)'
        : 'rgba(255,255,255,0.65)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}`,
      boxShadow: isDark
        ? '0 8px 32px rgba(0,0,0,0.4)'
        : '0 8px 32px rgba(0,0,0,0.08)',
    },
    clickable: {
      background: isDark ? '#1E1E2E' : '#ffffff',
      boxShadow: hovered
        ? isDark
          ? '0 16px 40px rgba(0,0,0,0.5)'
          : '0 16px 40px rgba(0,0,0,0.15)'
        : isDark
        ? '0 4px 12px rgba(0,0,0,0.3)'
        : '0 4px 12px rgba(0,0,0,0.08)',
      cursor: 'pointer',
      transform: hovered ? 'translateY(-2px) scale(1.005)' : 'translateY(0) scale(1)',
    },
  };

  const combinedStyle: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...extraStyle,
  };

  return (
    <div
      className={className}
      style={combinedStyle}
      onClick={onClick}
      onMouseEnter={variant === 'clickable' ? handleMouseEnter : undefined}
      onMouseLeave={variant === 'clickable' ? handleMouseLeave : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={ariaLabel}
      onKeyDown={
        onClick
          ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }
          : undefined
      }
    >
      {children}
    </div>
  );
});
