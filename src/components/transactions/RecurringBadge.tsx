import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import type { RecurringType } from '@/types/finance';

const LABELS: Record<Exclude<RecurringType, 'none'>, string> = {
  daily: 'Diaria',
  weekly: 'Semanal',
  monthly: 'Mensual',
  yearly: 'Anual',
};

interface RecurringBadgeProps {
  recurring: RecurringType;
}

export function RecurringBadge({ recurring }: RecurringBadgeProps) {
  const { isDark } = useTheme();

  if (recurring === 'none') return null;

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)',
    color: isDark ? '#818CF8' : '#4F46E5',
    border: `1px solid ${isDark ? 'rgba(99,102,241,0.4)' : 'rgba(99,102,241,0.25)'}`,
    whiteSpace: 'nowrap',
  };

  return (
    <span style={badgeStyle} title={`Recurrente: ${LABELS[recurring]}`}>
      🔄 {LABELS[recurring]}
    </span>
  );
}
