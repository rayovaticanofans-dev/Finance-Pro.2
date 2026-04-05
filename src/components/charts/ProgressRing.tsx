import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export interface ProgressRingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  sublabel?: string;
}

export const ProgressRing = React.memo(function ProgressRing({
  value,
  size = 100,
  strokeWidth = 8,
  color = '#6366F1',
  backgroundColor,
  label,
  sublabel,
}: ProgressRingProps) {
  const { isDark } = useTheme();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  const clampedValue = Math.max(0, Math.min(100, value));
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated ? clampedValue / 100 : 0) * circumference;

  const bgColor = backgroundColor ?? (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)');

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-label={label ? `${label}: ${clampedValue}%` : `${clampedValue}%`}
        role="img"
      >
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)',
            filter: `drop-shadow(0 0 4px ${color}66)`,
          }}
        />
      </svg>

      {/* Center content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          padding: `${strokeWidth + 4}px`,
          textAlign: 'center',
        }}
      >
        {label && (
          <span
            style={{
              fontSize: `${Math.max(10, size * 0.16)}px`,
              fontWeight: 800,
              color: isDark ? '#F1F5F9' : '#1E293B',
              lineHeight: 1.1,
            }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            style={{
              fontSize: `${Math.max(9, size * 0.11)}px`,
              color: isDark ? '#6B7280' : '#9CA3AF',
              lineHeight: 1.2,
            }}
          >
            {sublabel}
          </span>
        )}
        {!label && (
          <span
            style={{
              fontSize: `${Math.max(12, size * 0.18)}px`,
              fontWeight: 800,
              color: isDark ? '#F1F5F9' : '#1E293B',
            }}
          >
            {Math.round(clampedValue)}%
          </span>
        )}
      </div>
    </div>
  );
});
