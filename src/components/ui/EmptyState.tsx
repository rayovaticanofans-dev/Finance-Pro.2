import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export const EmptyState = React.memo(function EmptyState({
  title = 'Sin datos',
  description = 'No hay elementos para mostrar aquí todavía.',
  ctaLabel,
  onCta,
}: EmptyStateProps) {
  const { isDark } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        gap: '16px',
      }}
    >
      {/* Inline SVG illustration */}
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="16"
          y="24"
          width="64"
          height="52"
          rx="8"
          fill={isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)'}
          stroke={isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'}
          strokeWidth="2"
        />
        <rect
          x="26"
          y="38"
          width="44"
          height="4"
          rx="2"
          fill={isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'}
        />
        <rect
          x="26"
          y="48"
          width="32"
          height="4"
          rx="2"
          fill={isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)'}
        />
        <rect
          x="26"
          y="58"
          width="38"
          height="4"
          rx="2"
          fill={isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'}
        />
        <circle
          cx="68"
          cy="28"
          r="14"
          fill={isDark ? '#1E1E2E' : '#fff'}
          stroke={isDark ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.25)'}
          strokeWidth="2"
        />
        <path
          d="M63 28h10M68 23v10"
          stroke={isDark ? '#818CF8' : '#6366F1'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div style={{ maxWidth: '320px' }}>
        <h3
          style={{
            margin: '0 0 8px',
            fontSize: '17px',
            fontWeight: 700,
            color: isDark ? '#F1F5F9' : '#1E293B',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            color: isDark ? '#64748B' : '#6B7280',
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>

      {ctaLabel && onCta && (
        <Button variant="primary" size="md" onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
});
