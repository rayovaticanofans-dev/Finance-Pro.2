import React, { useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const SPINNER = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{ animation: 'fp-spin 0.7s linear infinite' }}
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
    <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
  },
  secondary: {
    background: 'rgba(99,102,241,0.1)',
    color: '#6366F1',
    border: '1px solid rgba(99,102,241,0.3)',
  },
  ghost: {
    background: 'transparent',
    color: '#6B7280',
    border: '1px solid transparent',
  },
  danger: {
    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
  },
  success: {
    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
  },
};

const SIZE_STYLES: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: '12px', borderRadius: '8px', gap: '6px' },
  md: { padding: '10px 20px', fontSize: '14px', borderRadius: '10px', gap: '8px' },
  lg: { padding: '14px 28px', fontSize: '16px', borderRadius: '12px', gap: '10px' },
};

export const Button = React.memo(function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps) {
  const { isDark } = useTheme();

  const [hovered, setHovered] = React.useState(false);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  const isDisabled = disabled || loading;

  const ghostDarkColor = isDark ? '#9CA3AF' : '#6B7280';

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    userSelect: 'none',
    outline: 'none',
    width: fullWidth ? '100%' : undefined,
    transform: hovered && !isDisabled ? 'translateY(-1px)' : 'translateY(0)',
    fontFamily: 'inherit',
    ...SIZE_STYLES[size],
    ...VARIANT_STYLES[variant],
    ...(variant === 'ghost' && isDark ? { color: ghostDarkColor } : {}),
    ...(variant === 'secondary' && isDark
      ? { background: 'rgba(99,102,241,0.15)', color: '#818CF8' }
      : {}),
  };

  const renderIcon = (pos: 'left' | 'right') => {
    if (loading && pos === 'left') return SPINNER;
    if (icon && iconPosition === pos) return icon;
    return null;
  };

  return (
    <>
      {/* Inline keyframes for spinner */}
      <style>{`@keyframes fp-spin { to { transform: rotate(360deg); } }`}</style>
      <button
        type={type}
        style={baseStyle}
        disabled={isDisabled}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={ariaLabel}
        aria-busy={loading}
        aria-disabled={isDisabled}
      >
        {renderIcon('left')}
        {children}
        {renderIcon('right')}
      </button>
    </>
  );
});
