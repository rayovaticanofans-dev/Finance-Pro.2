import React, { useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  id?: string;
}

export const Switch = React.memo(function Switch({
  checked,
  onChange,
  label,
  disabled = false,
  id,
}: SwitchProps) {
  const { isDark } = useTheme();
  const switchId = id ?? (label ? `switch-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) onChange(e.target.checked);
    },
    [onChange, disabled]
  );

  const trackStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: '42px',
    height: '24px',
    flexShrink: 0,
  };

  const inputStyle: React.CSSProperties = {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
  };

  const sliderStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: '999px',
    background: checked
      ? 'linear-gradient(135deg, #6366F1, #3B82F6)'
      : isDark
      ? 'rgba(255,255,255,0.12)'
      : '#D1D5DB',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.25s ease',
    opacity: disabled ? 0.5 : 1,
  };

  const knobStyle: React.CSSProperties = {
    position: 'absolute',
    top: '3px',
    left: checked ? '21px' : '3px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#ffffff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
    transition: 'left 0.25s cubic-bezier(0.34,1.56,0.64,1)',
  };

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
      }}
      htmlFor={switchId}
    >
      <span style={trackStyle}>
        <input
          id={switchId}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          style={inputStyle}
        />
        <span style={sliderStyle}>
          <span style={knobStyle} />
        </span>
      </span>
      {label && (
        <span
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: isDark ? '#CBD5E1' : '#374151',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {label}
        </span>
      )}
    </label>
  );
});
