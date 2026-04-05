import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import type { Budget, BudgetPeriod } from '@/types/budget';

const PERIOD_OPTIONS: { value: BudgetPeriod; label: string }[] = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'yearly', label: 'Anual' },
];

interface BudgetFormProps {
  editBudget?: Budget;
  onSave: (data: Omit<Budget, 'id' | 'createdAt' | 'spent' | 'status'>) => void;
  onCancel?: () => void;
}

export function BudgetForm({ editBudget, onSave, onCancel }: BudgetFormProps) {
  const { isDark } = useTheme();

  const [categoryId, setCategoryId] = useState(editBudget?.categoryId ?? DEFAULT_CATEGORIES[0]?.id ?? '');
  const [name, setName] = useState(editBudget?.name ?? '');
  const [limit, setLimit] = useState(editBudget?.limit?.toString() ?? '');
  const [period, setPeriod] = useState<BudgetPeriod>(editBudget?.period ?? 'monthly');
  const [alertAt, setAlertAt] = useState(editBudget?.alertAt ?? 80);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const allCategories = DEFAULT_CATEGORIES.flatMap((c) => [c, ...(c.children ?? [])]);

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

  const chipStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    background: active ? 'linear-gradient(135deg, #3B82F6, #6366F1)' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'),
    color: active ? '#fff' : (isDark ? '#CBD5E1' : '#374151'),
    transition: 'all 0.15s',
  });

  const handleSubmit = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    const numLimit = parseFloat(limit);
    if (!limit || isNaN(numLimit) || numLimit <= 0) newErrors.limit = 'El límite debe ser un número positivo';
    if (!categoryId) newErrors.categoryId = 'La categoría es requerida';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      categoryId,
      limit: numLimit,
      period,
      alertAt,
    });
  }, [name, limit, categoryId, period, alertAt, onSave]);

  const selectedCat = allCategories.find((c) => c.id === categoryId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Category selector */}
      <div>
        <label style={labelStyle}>Categoría</label>
        <select style={inputStyle(!!errors.categoryId)} value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setErrors((p) => ({ ...p, categoryId: '' })); }}>
          {allCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
          ))}
        </select>
        {errors.categoryId && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.categoryId}</div>}
      </div>

      {/* Name */}
      <div>
        <label style={labelStyle}>Nombre del presupuesto</label>
        <input
          type="text"
          style={inputStyle(!!errors.name)}
          value={name}
          placeholder={selectedCat ? `${selectedCat.label} mensual` : 'Nombre...'}
          onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
        />
        {errors.name && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.name}</div>}
      </div>

      {/* Limit */}
      <div>
        <label style={labelStyle}>Límite</label>
        <input
          type="number"
          style={inputStyle(!!errors.limit)}
          value={limit}
          placeholder="0.00"
          min={0}
          step="0.01"
          onChange={(e) => { setLimit(e.target.value); setErrors((p) => ({ ...p, limit: '' })); }}
        />
        {errors.limit && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.limit}</div>}
      </div>

      {/* Period */}
      <div>
        <label style={labelStyle}>Período</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          {PERIOD_OPTIONS.map((p) => (
            <button key={p.value} style={chipStyle(period === p.value)} onClick={() => setPeriod(p.value)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert threshold slider */}
      <div>
        <label style={labelStyle}>Umbral de alerta: {alertAt}%</label>
        <input
          type="range"
          min={0}
          max={100}
          value={alertAt}
          onChange={(e) => setAlertAt(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#3B82F6', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF' }}>
          <span>0%</span><span>50%</span><span>100%</span>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
        {onCancel && <Button variant="ghost" size="md" onClick={onCancel} fullWidth>Cancelar</Button>}
        <Button variant="primary" size="md" onClick={handleSubmit} fullWidth>
          {editBudget ? 'Guardar cambios' : 'Crear presupuesto'}
        </Button>
      </div>
    </div>
  );
}
