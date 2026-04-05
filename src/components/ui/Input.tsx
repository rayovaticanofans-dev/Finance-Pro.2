import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export type InputVariant = 'default' | 'filled' | 'outlined';
export type InputType = 'text' | 'number' | 'email' | 'password' | 'date' | 'search';

export interface InputProps {
  label?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: InputType;
  variant?: InputVariant;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  autoComplete?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const Input = React.memo(function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  variant = 'default',
  error,
  helperText,
  prefixIcon,
  suffixIcon,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  autoComplete,
  min,
  max,
  step,
}: InputProps) {
  const { isDark } = useTheme();
  const [focused, setFocused] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputId = id ?? (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  const hasError = !!error;

  const getBg = () => {
    if (variant === 'filled') return isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)';
    return isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';
  };

  const getBorder = () => {
    if (hasError) return '1.5px solid #EF4444';
    if (focused) return '1.5px solid #6366F1';
    if (variant === 'outlined') return `1.5px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#D1D5DB'}`;
    return `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}`;
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: isDark ? '#CBD5E1' : '#374151',
    userSelect: 'none',
  };

  const fieldStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `10px ${type === 'password' || suffixIcon ? '40px' : '14px'} 10px ${prefixIcon ? '40px' : '14px'}`,
    background: getBg(),
    border: getBorder(),
    borderRadius: '10px',
    fontSize: '14px',
    color: isDark ? '#F1F5F9' : '#1E293B',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow: focused
      ? hasError
        ? '0 0 0 3px rgba(239,68,68,0.15)'
        : '0 0 0 3px rgba(99,102,241,0.15)'
      : 'none',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const iconWrapperStyle = (side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    [side]: '12px',
    display: 'flex',
    alignItems: 'center',
    color: isDark ? '#6B7280' : '#9CA3AF',
    pointerEvents: side === 'right' && type === 'password' ? 'auto' : 'none',
    cursor: side === 'right' && type === 'password' ? 'pointer' : 'default',
    zIndex: 1,
  });

  const helperStyle: React.CSSProperties = {
    fontSize: '12px',
    color: hasError ? '#EF4444' : isDark ? '#6B7280' : '#9CA3AF',
    lineHeight: '1.4',
  };

  const actualType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={wrapperStyle}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
          {required && <span style={{ color: '#EF4444', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      <div style={fieldStyle}>
        {prefixIcon && <span style={iconWrapperStyle('left')}>{prefixIcon}</span>}
        <input
          id={inputId}
          name={name}
          type={actualType}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoComplete={autoComplete}
          min={min}
          max={max}
          step={step}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyle}
        />
        {type === 'password' && (
          <button
            type="button"
            style={{ ...iconWrapperStyle('right'), background: 'none', border: 'none', padding: 0 }}
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
            )}
          </button>
        )}
        {suffixIcon && type !== 'password' && (
          <span style={iconWrapperStyle('right')}>{suffixIcon}</span>
        )}
      </div>
      {(error || helperText) && (
        <span id={error ? `${inputId}-error` : `${inputId}-helper`} style={helperStyle} role={error ? 'alert' : undefined}>
          {error ?? helperText}
        </span>
      )}
    </div>
  );
});
