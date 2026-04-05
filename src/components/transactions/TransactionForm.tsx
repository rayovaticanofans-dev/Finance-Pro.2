import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { CategoryPicker } from '@/components/categories/CategoryPicker';
import { SplitTransactionForm } from './SplitTransactionForm';
import { useFinance } from '@/hooks/useFinance';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import { validateItem } from '@/utils/validators';
import { generateId } from '@/utils/id';
import { CURRENCIES } from '@/constants/currencies';
import type { Item, RecurringType, SplitTransaction, TransactionType } from '@/types/finance';
import type { Currency } from '@/types/currency';
import { DEFAULT_CATEGORIES } from '@/constants/categories';

const RECURRING_OPTIONS: { value: RecurringType; label: string }[] = [
  { value: 'none', label: 'Ninguna' },
  { value: 'daily', label: 'Diaria' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
];

interface TransactionFormProps {
  editItem?: Item;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function findCategoryLabel(id: string): string {
  for (const cat of DEFAULT_CATEGORIES) {
    if (cat.id === id) return `${cat.emoji} ${cat.label}`;
    if (cat.children) {
      const child = cat.children.find((c) => c.id === id);
      if (child) return `${child.emoji} ${child.label}`;
    }
  }
  return id;
}

export function TransactionForm({ editItem, onSuccess, onCancel }: TransactionFormProps) {
  const { isDark } = useTheme();
  const { addItem, updateItem } = useFinance();
  const { currency: defaultCurrency } = useCurrencyContext();

  const [type, setType] = useState<TransactionType>(editItem?.type ?? 'expense');
  const [amount, setAmount] = useState(editItem?.amount?.toString() ?? '');
  const [currency, setCurrency] = useState<Currency>(editItem?.currency ?? defaultCurrency);
  const [category, setCategory] = useState(editItem?.category ?? DEFAULT_CATEGORIES[0]?.id ?? '');
  const [date, setDate] = useState(editItem?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
  const [desc, setDesc] = useState(editItem?.desc ?? '');
  const [note, setNote] = useState(editItem?.note ?? '');
  const [tagsInput, setTagsInput] = useState((editItem?.tags ?? []).join(', '));
  const [recurring, setRecurring] = useState<RecurringType>(editItem?.recurring ?? 'none');
  const [split, setSplit] = useState<SplitTransaction[]>(editItem?.split ?? []);
  const [showSplit, setShowSplit] = useState((editItem?.split?.length ?? 0) > 0);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrency(defaultCurrency);
  }, [defaultCurrency]);

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${hasError ? '#EF4444' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '10px',
    padding: '10px 14px',
    color: isDark ? '#F1F5F9' : '#1E293B',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.15s',
  });

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: isDark ? '#94A3B8' : '#6B7280',
    marginBottom: '6px',
    display: 'block',
  };

  const errorStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#EF4444',
    marginTop: '4px',
  };

  const toggleContainerStyle: React.CSSProperties = {
    display: 'flex',
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
    borderRadius: '12px',
    padding: '4px',
    gap: '4px',
    marginBottom: '20px',
  };

  const toggleBtnStyle = (active: boolean, color: string): React.CSSProperties => ({
    flex: 1,
    padding: '10px',
    borderRadius: '9px',
    border: 'none',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    background: active ? color : 'transparent',
    color: active ? '#fff' : isDark ? '#9CA3AF' : '#6B7280',
    boxShadow: active ? `0 4px 12px ${color}44` : 'none',
  });

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    const numAmount = parseFloat(amount);
    const now = new Date().toISOString();

    const partial: Partial<Item> = {
      desc: desc.trim(),
      amount: numAmount,
      type,
      currency,
      category,
      date,
      note: note.trim() || undefined,
      tags: tags.length ? tags : undefined,
      recurring,
    };

    const { valid, errors: valErrors } = validateItem(partial);
    if (!valid) {
      setErrors(valErrors);
      setLoading(false);
      return;
    }

    // Validate split sum if enabled
    if (showSplit && split.length > 0) {
      const splitSum = split.reduce((s, sp) => s + sp.amount, 0);
      if (Math.abs(splitSum - numAmount) > 0.01) {
        setErrors({ split: 'La suma de divisiones debe igualar el monto total' });
        setLoading(false);
        return;
      }
    }

    const item: Item = {
      id: editItem?.id ?? generateId(),
      desc: desc.trim(),
      amount: numAmount,
      type,
      currency,
      category,
      date,
      note: note.trim() || undefined,
      tags: tags.length ? tags : undefined,
      recurring,
      split: showSplit && split.length > 0 ? split : undefined,
      createdAt: editItem?.createdAt ?? now,
      updatedAt: now,
    };

    if (editItem) {
      updateItem(item);
    } else {
      addItem(item);
    }

    setLoading(false);
    onSuccess?.();
  }, [amount, category, currency, date, desc, editItem, note, recurring, showSplit, split, tagsInput, type, addItem, updateItem, onSuccess]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Type toggle */}
      <div style={toggleContainerStyle}>
        <button
          style={toggleBtnStyle(type === 'income', '#22C55E')}
          onClick={() => setType('income')}
          type="button"
        >
          💰 Ingreso
        </button>
        <button
          style={toggleBtnStyle(type === 'expense', '#EF4444')}
          onClick={() => setType('expense')}
          type="button"
        >
          💸 Gasto
        </button>
      </div>

      {/* Amount + Currency */}
      <div>
        <label style={labelStyle}>Monto</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
          <input
            type="number"
            style={inputStyle(!!errors.amount)}
            value={amount}
            placeholder="0.00"
            min={0}
            step="0.01"
            onChange={(e) => { setAmount(e.target.value); setErrors((prev) => ({ ...prev, amount: '' })); }}
          />
          <select
            style={{ ...inputStyle(), width: 'auto', paddingRight: '8px' }}
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
          >
            {Object.entries(CURRENCIES).map(([code, info]) => (
              <option key={code} value={code}>{code} {info.symbol}</option>
            ))}
          </select>
        </div>
        {errors.amount && <div style={errorStyle}>{errors.amount}</div>}
      </div>

      {/* Category picker */}
      <div>
        <label style={labelStyle}>Categoría</label>
        <button
          type="button"
          onClick={() => setShowCategoryPicker(true)}
          style={{
            ...inputStyle(!!errors.category),
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {findCategoryLabel(category)}
          <span style={{ marginLeft: 'auto', opacity: 0.5 }}>▾</span>
        </button>
        {errors.category && <div style={errorStyle}>{errors.category}</div>}
      </div>

      {/* Date */}
      <div>
        <label style={labelStyle}>Fecha</label>
        <input
          type="date"
          style={inputStyle(!!errors.date)}
          value={date}
          onChange={(e) => { setDate(e.target.value); setErrors((prev) => ({ ...prev, date: '' })); }}
        />
        {errors.date && <div style={errorStyle}>{errors.date}</div>}
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Descripción</label>
        <input
          type="text"
          style={inputStyle(!!errors.desc)}
          value={desc}
          placeholder="Ej. Almuerzo con cliente"
          maxLength={200}
          onChange={(e) => { setDesc(e.target.value); setErrors((prev) => ({ ...prev, desc: '' })); }}
        />
        {errors.desc && <div style={errorStyle}>{errors.desc}</div>}
      </div>

      {/* Notes */}
      <div>
        <label style={labelStyle}>Notas (opcional)</label>
        <textarea
          style={{ ...inputStyle(), resize: 'vertical', minHeight: '72px' }}
          value={note}
          placeholder="Notas adicionales..."
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Tags */}
      <div>
        <label style={labelStyle}>Etiquetas (separadas por coma)</label>
        <input
          type="text"
          style={inputStyle()}
          value={tagsInput}
          placeholder="trabajo, personal, urgente..."
          onChange={(e) => setTagsInput(e.target.value)}
        />
      </div>

      {/* Recurring */}
      <div>
        <label style={labelStyle}>Recurrencia</label>
        <select
          style={inputStyle()}
          value={recurring}
          onChange={(e) => setRecurring(e.target.value as RecurringType)}
        >
          {RECURRING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Split transaction toggle */}
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showSplit}
            onChange={(e) => setShowSplit(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#CBD5E1' : '#374151' }}>
            Dividir transacción
          </span>
        </label>
        {showSplit && (
          <div style={{ marginTop: '12px' }}>
            <SplitTransactionForm
              total={parseFloat(amount) || 0}
              currency={currency}
              splits={split}
              onChange={setSplit}
            />
            {errors.split && <div style={errorStyle}>{errors.split}</div>}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '8px' }}>
        {onCancel && (
          <Button variant="ghost" size="md" onClick={onCancel} fullWidth>
            Cancelar
          </Button>
        )}
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          loading={loading}
          fullWidth
        >
          {editItem ? 'Guardar cambios' : 'Agregar'}
        </Button>
      </div>

      {/* Category picker modal */}
      {showCategoryPicker && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setShowCategoryPicker(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: isDark ? '#1E293B' : '#FFFFFF',
              borderRadius: '20px 20px 0 0',
              padding: '20px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            <CategoryPicker
              selected={category}
              onSelect={(id) => { setCategory(id); setShowCategoryPicker(false); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
