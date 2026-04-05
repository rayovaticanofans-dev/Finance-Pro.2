import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { generateId } from '@/utils/id';
import type { SplitTransaction } from '@/types/finance';
import type { Currency } from '@/types/currency';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import type { CategoryNode } from '@/types/category';
import { useCurrencyContext } from '@/contexts/CurrencyContext';

function flatCategories(): CategoryNode[] {
  const result: CategoryNode[] = [];
  for (const cat of DEFAULT_CATEGORIES) {
    result.push(cat);
    if (cat.children) result.push(...cat.children);
  }
  return result;
}

interface SplitTransactionFormProps {
  total: number;
  currency: Currency;
  splits: SplitTransaction[];
  onChange: (splits: SplitTransaction[]) => void;
}

export function SplitTransactionForm({
  total,
  currency,
  splits,
  onChange,
}: SplitTransactionFormProps) {
  const { isDark } = useTheme();
  const { formatAmount } = useCurrencyContext();
  const allCategories = flatCategories();

  const allocated = splits.reduce((sum, s) => sum + s.amount, 0);
  const remaining = total - allocated;

  const addSplit = useCallback(() => {
    const newSplit: SplitTransaction = {
      id: generateId(),
      category: DEFAULT_CATEGORIES[0]?.id ?? '',
      amount: Math.max(0, remaining),
      currency,
    };
    onChange([...splits, newSplit]);
  }, [splits, onChange, remaining, currency]);

  const removeSplit = useCallback((id: string) => {
    onChange(splits.filter((s) => s.id !== id));
  }, [splits, onChange]);

  const updateSplit = useCallback(
    (id: string, field: keyof SplitTransaction, value: string | number) => {
      onChange(
        splits.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    },
    [splits, onChange]
  );

  const inputStyle: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '8px',
    padding: '6px 10px',
    color: isDark ? '#F1F5F9' : '#1E293B',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
  };

  const selectStyle: React.CSSProperties = { ...inputStyle };

  const remainingColor = Math.abs(remaining) < 0.01 ? '#22C55E' : remaining < 0 ? '#EF4444' : '#F59E0B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          borderRadius: '8px',
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
          fontSize: '13px',
        }}
      >
        <span style={{ color: isDark ? '#CBD5E1' : '#374151' }}>Total: {formatAmount(total)}</span>
        <span style={{ color: remainingColor, fontWeight: 700 }}>
          {Math.abs(remaining) < 0.01 ? '✓ Asignado' : `Restante: ${formatAmount(remaining)}`}
        </span>
      </div>

      {splits.map((split, idx) => (
        <div
          key={split.id}
          style={{
            padding: '12px',
            borderRadius: '10px',
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: isDark ? '#94A3B8' : '#6B7280' }}>
              División {idx + 1}
            </span>
            <button
              onClick={() => removeSplit(split.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#EF4444',
                fontSize: '16px',
                padding: '2px 6px',
                borderRadius: '6px',
              }}
              aria-label="Eliminar división"
            >
              ×
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 600 }}>
                Categoría
              </label>
              <select
                style={selectStyle}
                value={split.category}
                onChange={(e) => updateSplit(split.id, 'category', e.target.value)}
              >
                {allCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 600 }}>
                Monto
              </label>
              <input
                type="number"
                style={inputStyle}
                value={split.amount}
                min={0}
                step="0.01"
                onChange={(e) => updateSplit(split.id, 'amount', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 600 }}>
              Nota (opcional)
            </label>
            <input
              type="text"
              style={inputStyle}
              value={split.note ?? ''}
              placeholder="Nota..."
              onChange={(e) => updateSplit(split.id, 'note', e.target.value)}
            />
          </div>
        </div>
      ))}

      <Button
        variant="secondary"
        size="sm"
        onClick={addSplit}
        icon={<span>+</span>}
      >
        Agregar división
      </Button>
    </div>
  );
}
