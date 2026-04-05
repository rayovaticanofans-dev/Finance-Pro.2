import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { BudgetCard } from './BudgetCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import type { Budget } from '@/types/budget';
import type { Item } from '@/types/finance';

interface BudgetListProps {
  budgets: Budget[];
  items: Item[];
  onAdd?: () => void;
  onEdit?: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

export function BudgetList({ budgets, items, onAdd, onEdit, onDelete }: BudgetListProps) {
  const { isDark } = useTheme();
  const { formatAmount } = useCurrencyContext();

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => {
    return s + items
      .filter((i) => {
        if (i.type !== 'expense' || i.category !== b.categoryId) return false;
        const now = new Date(); const d = new Date(i.date);
        if (b.period === 'monthly') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        if (b.period === 'weekly') { const ws = new Date(now); ws.setDate(now.getDate() - now.getDay()); ws.setHours(0,0,0,0); return d >= ws; }
        return d.getFullYear() === now.getFullYear();
      })
      .reduce((ss, i) => ss + i.amount, 0);
  }, 0);

  if (budgets.length === 0) {
    return (
      <EmptyState
        title="Sin presupuestos"
        description="Crea tu primer presupuesto para controlar tus gastos."
        ctaLabel="Crear presupuesto"
        onCta={onAdd}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Summary */}
      <div
        style={{
          padding: '16px',
          borderRadius: '14px',
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 600, marginBottom: '4px' }}>TOTAL LÍMITE</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: isDark ? '#F1F5F9' : '#1E293B' }}>{formatAmount(totalLimit)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 600, marginBottom: '4px' }}>TOTAL GASTADO</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#EF4444' }}>{formatAmount(totalSpent)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 600, marginBottom: '4px' }}>DISPONIBLE</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#22C55E' }}>{formatAmount(Math.max(0, totalLimit - totalSpent))}</div>
        </div>
      </div>

      {/* Budget cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            items={items}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
