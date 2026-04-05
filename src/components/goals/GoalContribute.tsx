import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import type { SavingsGoal } from '@/types/goals';

interface GoalContributeProps {
  goal: SavingsGoal;
  onSave: (goalId: string, amount: number, note?: string) => void;
  onCancel?: () => void;
}

export function GoalContribute({ goal, onSave, onCancel }: GoalContributeProps) {
  const { isDark } = useTheme();
  const { formatAmount } = useCurrencyContext();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');

  const remaining = goal.targetAmount - goal.currentAmount;
  const previewCurrent = goal.currentAmount + (parseFloat(amount) || 0);
  const previewPercentage = goal.targetAmount > 0 ? Math.min(100, (previewCurrent / goal.targetAmount) * 100) : 0;

  const inputStyle: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '10px',
    padding: '10px 14px',
    color: isDark ? '#F1F5F9' : '#1E293B',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: isDark ? '#94A3B8' : '#6B7280',
    marginBottom: '6px',
    display: 'block',
  };

  const handleSave = useCallback(() => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError('El monto debe ser un número positivo');
      return;
    }
    onSave(goal.id, num, note.trim() || undefined);
  }, [amount, note, goal.id, onSave]);

  const color = goal.color ?? '#3B82F6';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Goal info */}
      <div style={{ textAlign: 'center', padding: '16px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderRadius: '12px' }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>{goal.emoji ?? '🎯'}</div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>{goal.name}</div>
        <div style={{ fontSize: '13px', color: isDark ? '#6B7280' : '#9CA3AF', marginTop: '4px' }}>
          {formatAmount(goal.currentAmount)} / {formatAmount(goal.targetAmount)}
        </div>
        <div style={{ fontSize: '12px', color: color, fontWeight: 600, marginTop: '4px' }}>
          Faltan {formatAmount(remaining)}
        </div>
      </div>

      {/* Progress preview */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF', marginBottom: '6px' }}>
          <span>Progreso después</span>
          <span style={{ color, fontWeight: 700 }}>{Math.round(previewPercentage)}%</span>
        </div>
        <div style={{ height: '8px', borderRadius: '4px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${previewPercentage}%`, background: color, borderRadius: '4px', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Amount */}
      <div>
        <label style={labelStyle}>Monto</label>
        <input
          type="number"
          style={{ ...inputStyle, borderColor: error ? '#EF4444' : undefined }}
          value={amount}
          placeholder="0.00"
          min={0}
          step="0.01"
          onChange={(e) => { setAmount(e.target.value); setError(''); }}
          autoFocus
        />
        {error && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{error}</div>}
        {remaining > 0 && (
          <button
            onClick={() => setAmount(remaining.toFixed(2))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: color, fontSize: '12px', marginTop: '4px', fontFamily: 'inherit', fontWeight: 600 }}
          >
            Completar meta ({formatAmount(remaining)})
          </button>
        )}
      </div>

      {/* Date */}
      <div>
        <label style={labelStyle}>Fecha</label>
        <input type="date" style={inputStyle} value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {/* Note */}
      <div>
        <label style={labelStyle}>Nota (opcional)</label>
        <input type="text" style={inputStyle} value={note} placeholder="Nota sobre esta contribución..." onChange={(e) => setNote(e.target.value)} />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {onCancel && <Button variant="ghost" size="md" onClick={onCancel} fullWidth>Cancelar</Button>}
        <Button variant="success" size="md" onClick={handleSave} fullWidth>Guardar</Button>
      </div>
    </div>
  );
}
