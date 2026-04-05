import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { RecurringBadge } from './RecurringBadge';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import type { Item } from '@/types/finance';
import type { CategoryNode } from '@/types/category';
import { useCurrencyContext } from '@/contexts/CurrencyContext';

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

interface TransactionDetailProps {
  item: Item;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
  onClose?: () => void;
}

export function TransactionDetail({ item, onEdit, onDelete, onClose }: TransactionDetailProps) {
  const { isDark } = useTheme();
  const { currency } = useCurrencyContext();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cat = findCategory(item.category);
  const isIncome = item.type === 'income';

  const handleDelete = useCallback(() => {
    if (confirmDelete) {
      onDelete?.(item.id);
      onClose?.();
    } else {
      setConfirmDelete(true);
    }
  }, [confirmDelete, item.id, onDelete, onClose]);

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '10px 0',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    gap: '12px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: isDark ? '#6B7280' : '#9CA3AF',
    flexShrink: 0,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '14px',
    color: isDark ? '#F1F5F9' : '#1E293B',
    textAlign: 'right',
    wordBreak: 'break-word',
  };

  return (
    <div>
      {/* Amount hero */}
      <div style={{ textAlign: 'center', padding: '20px 0 16px', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, marginBottom: '8px' }}>
        <div style={{ fontSize: '42px', marginBottom: '8px' }}>{cat?.emoji ?? '💸'}</div>
        <div style={{ fontSize: '32px', fontWeight: 800, color: isIncome ? '#22C55E' : '#EF4444' }}>
          {isIncome ? '+' : '-'}{formatCurrency(item.amount, currency)}
        </div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: isDark ? '#CBD5E1' : '#374151', marginTop: '6px' }}>
          {item.desc}
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={rowStyle}>
          <span style={labelStyle}>Categoría</span>
          <span style={valueStyle}>{cat?.emoji} {cat?.label ?? item.category}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Tipo</span>
          <span style={{ ...valueStyle, color: isIncome ? '#22C55E' : '#EF4444' }}>
            {isIncome ? 'Ingreso' : 'Gasto'}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Fecha</span>
          <span style={valueStyle}>{formatDate(item.date, 'long')}</span>
        </div>
        {item.note && (
          <div style={rowStyle}>
            <span style={labelStyle}>Nota</span>
            <span style={valueStyle}>{item.note}</span>
          </div>
        )}
        {item.recurring !== 'none' && (
          <div style={rowStyle}>
            <span style={labelStyle}>Recurrencia</span>
            <RecurringBadge recurring={item.recurring} />
          </div>
        )}
        {item.tags && item.tags.length > 0 && (
          <div style={rowStyle}>
            <span style={labelStyle}>Etiquetas</span>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
                    color: isDark ? '#818CF8' : '#4F46E5',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {item.split && item.split.length > 0 && (
          <div style={{ padding: '10px 0' }}>
            <div style={labelStyle}>Divisiones</div>
            {item.split.map((s) => {
              const sc = findCategory(s.category);
              return (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', color: isDark ? '#CBD5E1' : '#374151' }}>
                  <span>{sc?.emoji} {sc?.label ?? s.category}{s.note ? ` · ${s.note}` : ''}</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(s.amount, currency)}</span>
                </div>
              );
            })}
          </div>
        )}
        <div style={rowStyle}>
          <span style={labelStyle}>Creado</span>
          <span style={valueStyle}>{formatDate(item.createdAt, 'long')}</span>
        </div>
        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <span style={labelStyle}>Actualizado</span>
          <span style={valueStyle}>{formatDate(item.updatedAt, 'long')}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <Button variant="secondary" size="md" onClick={() => onEdit?.(item)} fullWidth>
          ✏️ Editar
        </Button>
        <Button
          variant={confirmDelete ? 'danger' : 'ghost'}
          size="md"
          onClick={handleDelete}
          fullWidth
        >
          {confirmDelete ? '¿Confirmar?' : '🗑️ Eliminar'}
        </Button>
      </div>
      {confirmDelete && (
        <button
          onClick={() => setConfirmDelete(false)}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#6B7280' : '#9CA3AF', fontSize: '12px', marginTop: '8px', fontFamily: 'inherit' }}
        >
          Cancelar
        </button>
      )}
    </div>
  );
}
