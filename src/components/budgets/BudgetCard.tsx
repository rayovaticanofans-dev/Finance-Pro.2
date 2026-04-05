import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ProgressRing } from '@/components/charts/ProgressRing';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import type { Budget, BudgetStatus } from '@/types/budget';
import type { Item } from '@/types/finance';
import type { CategoryNode } from '@/types/category';

function findCategory(id: string): CategoryNode | undefined {
  for (const cat of DEFAULT_CATEGORIES) {
    if (cat.id === id) return cat;
    if (cat.children) {
      const child = cat.children.find((c) => c.id === id);
      if (child) return child;
    }
  }
  return undefined;
}

function getDaysRemainingInPeriod(period: Budget['period']): number {
  const now = new Date();
  if (period === 'monthly') {
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return end.getDate() - now.getDate();
  }
  if (period === 'weekly') {
    return 6 - now.getDay();
  }
  // yearly
  const end = new Date(now.getFullYear(), 11, 31);
  const diff = end.getTime() - now.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

const STATUS_COLORS: Record<BudgetStatus, string> = {
  ok: '#22C55E',
  warning: '#F59E0B',
  exceeded: '#EF4444',
};

interface BudgetCardProps {
  budget: Budget;
  items: Item[];
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

export function BudgetCard({ budget, items, onEdit, onDelete }: BudgetCardProps) {
  const { isDark } = useTheme();
  const { formatAmount } = useCurrencyContext();
  const [hovered, setHovered] = useState(false);
  const cat = findCategory(budget.categoryId);

  const spent = items
    .filter((i) => {
      if (i.type !== 'expense' || i.category !== budget.categoryId) return false;
      const now = new Date();
      const d = new Date(i.date);
      if (budget.period === 'monthly') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (budget.period === 'weekly') {
        const ws = new Date(now); ws.setDate(now.getDate() - now.getDay()); ws.setHours(0,0,0,0);
        return d >= ws;
      }
      return d.getFullYear() === now.getFullYear();
    })
    .reduce((s, i) => s + i.amount, 0);

  const percentage = budget.limit > 0 ? Math.min(100, (spent / budget.limit) * 100) : 0;
  const remaining = budget.limit - spent;
  const status: BudgetStatus = percentage >= 100 ? 'exceeded' : percentage >= budget.alertAt ? 'warning' : 'ok';
  const color = STATUS_COLORS[status];
  const daysLeft = getDaysRemainingInPeriod(budget.period);

  const PERIOD_LABELS: Record<Budget['period'], string> = { weekly: 'semana', monthly: 'mes', yearly: 'año' };

  const cardStyle: React.CSSProperties = {
    padding: '16px',
    borderRadius: '16px',
    background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
    boxShadow: hovered ? (isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.1)') : 'none',
    transition: 'all 0.2s ease',
    cursor: 'default',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <span style={{ fontSize: '24px' }}>{cat?.emoji ?? '💰'}</span>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
              {budget.name}
            </div>
            <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF' }}>
              {cat?.label ?? budget.categoryId} · {PERIOD_LABELS[budget.period]}
            </div>
          </div>
        </div>
        <ProgressRing
          value={percentage}
          size={64}
          strokeWidth={6}
          color={color}
          label={`${Math.round(percentage)}%`}
        />
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: '12px' }}>
        <div style={{ height: '8px', borderRadius: '4px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              borderRadius: '4px',
              width: `${percentage}%`,
              background: color,
              transition: 'width 0.6s ease',
              boxShadow: `0 0 8px ${color}66`,
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px' }}>
          <span style={{ color: color, fontWeight: 700 }}>{formatAmount(spent)} gastado</span>
          <span style={{ color: isDark ? '#6B7280' : '#9CA3AF' }}>de {formatAmount(budget.limit)}</span>
        </div>
      </div>

      {/* Footer info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <span style={{ fontSize: '12px', color: remaining >= 0 ? '#22C55E' : '#EF4444', fontWeight: 600 }}>
          {remaining >= 0 ? `${formatAmount(remaining)} restante` : `${formatAmount(Math.abs(remaining))} excedido`}
        </span>
        <span style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF' }}>
          {daysLeft} días restantes
        </span>
      </div>

      {hovered && (onEdit || onDelete) && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          {onEdit && (
            <button onClick={() => onEdit(budget)} style={{ flex: 1, background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: isDark ? '#CBD5E1' : '#374151', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}>
              ✏️ Editar
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(budget.id)} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#EF4444', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit' }}>
              🗑️ Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
