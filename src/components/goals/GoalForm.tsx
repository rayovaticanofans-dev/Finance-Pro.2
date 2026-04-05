import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import type { SavingsGoal } from '@/types/goals';

const EMOJI_LIST = ['🎯','🏠','✈️','🚗','💻','📱','🎓','💍','🌴','🎸','⚽','🏋️','🐕','📚','💰','🌟','🎪','🏔️','🚀','🌺'];
const COLORS = ['#3B82F6','#22C55E','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6','#F97316','#06B6D4','#84CC16'];

interface GoalFormProps {
  editGoal?: SavingsGoal;
  onSave: (data: Omit<SavingsGoal, 'id' | 'createdAt' | 'currentAmount' | 'status'>) => void;
  onCancel?: () => void;
}

export function GoalForm({ editGoal, onSave, onCancel }: GoalFormProps) {
  const { isDark } = useTheme();

  const [name, setName] = useState(editGoal?.name ?? '');
  const [emoji, setEmoji] = useState(editGoal?.emoji ?? '🎯');
  const [targetAmount, setTargetAmount] = useState(editGoal?.targetAmount?.toString() ?? '');
  const [currentSavings, setCurrentSavings] = useState(editGoal?.currentAmount?.toString() ?? '0');
  const [deadline, setDeadline] = useState(editGoal?.deadline ?? '');
  const [monthlyContribution, setMonthlyContribution] = useState(editGoal?.monthlyContribution?.toString() ?? '');
  const [color, setColor] = useState(editGoal?.color ?? '#3B82F6');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    const numTarget = parseFloat(targetAmount);
    if (!targetAmount || isNaN(numTarget) || numTarget <= 0) newErrors.targetAmount = 'La meta debe ser un número positivo';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      emoji,
      targetAmount: numTarget,
      currentAmount: parseFloat(currentSavings) || 0,
      deadline: deadline || undefined,
      monthlyContribution: parseFloat(monthlyContribution) || undefined,
      color,
    });
  }, [name, emoji, targetAmount, currentSavings, deadline, monthlyContribution, color, onSave]);

  // Auto-calculate monthly contribution
  const autoCalcMonthly = () => {
    const target = parseFloat(targetAmount) || 0;
    const current = parseFloat(currentSavings) || 0;
    if (!deadline || target <= current) return;
    const remaining = target - current;
    const months = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
    if (months > 0) setMonthlyContribution((remaining / months).toFixed(2));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Emoji + Name row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px', alignItems: 'end' }}>
        <div>
          <label style={labelStyle}>Icono</label>
          <div style={{ position: 'relative' }}>
            <button
              style={{
                width: '52px', height: '52px', fontSize: '24px', borderRadius: '12px',
                border: `2px solid ${color}`, background: `${color}22`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onClick={(e) => { e.stopPropagation(); }}
            >
              {emoji}
            </button>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Nombre de la meta</label>
          <input type="text" style={inputStyle(!!errors.name)} value={name} placeholder="Ej. Casa propia" onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }} />
          {errors.name && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.name}</div>}
        </div>
      </div>

      {/* Emoji picker */}
      <div>
        <label style={labelStyle}>Seleccionar emoji</label>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {EMOJI_LIST.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              style={{
                fontSize: '20px', padding: '6px 8px', borderRadius: '8px', cursor: 'pointer',
                border: e === emoji ? `2px solid ${color}` : '2px solid transparent',
                background: e === emoji ? `${color}22` : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
              }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <label style={labelStyle}>Color</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{
                width: '28px', height: '28px', borderRadius: '50%', background: c, cursor: 'pointer',
                border: c === color ? '3px solid white' : '3px solid transparent',
                outline: c === color ? `2px solid ${c}` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Target amount */}
      <div>
        <label style={labelStyle}>Monto objetivo</label>
        <input type="number" style={inputStyle(!!errors.targetAmount)} value={targetAmount} placeholder="0.00" min={0} step="0.01" onChange={(e) => { setTargetAmount(e.target.value); setErrors((p) => ({ ...p, targetAmount: '' })); }} />
        {errors.targetAmount && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{errors.targetAmount}</div>}
      </div>

      {/* Current savings */}
      <div>
        <label style={labelStyle}>Ahorro actual</label>
        <input type="number" style={inputStyle()} value={currentSavings} placeholder="0.00" min={0} step="0.01" onChange={(e) => setCurrentSavings(e.target.value)} />
      </div>

      {/* Deadline */}
      <div>
        <label style={labelStyle}>Fecha límite (opcional)</label>
        <input type="date" style={inputStyle()} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>

      {/* Monthly contribution */}
      <div>
        <label style={{ ...labelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Contribución mensual</span>
          {deadline && targetAmount && (
            <button onClick={autoCalcMonthly} style={{ background: 'none', border: 'none', cursor: 'pointer', color: color, fontSize: '11px', fontWeight: 600, fontFamily: 'inherit' }}>
              Auto calcular
            </button>
          )}
        </label>
        <input type="number" style={inputStyle()} value={monthlyContribution} placeholder="0.00" min={0} step="0.01" onChange={(e) => setMonthlyContribution(e.target.value)} />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
        {onCancel && <Button variant="ghost" size="md" onClick={onCancel} fullWidth>Cancelar</Button>}
        <Button variant="primary" size="md" onClick={handleSubmit} fullWidth>
          {editGoal ? 'Guardar cambios' : 'Crear meta'}
        </Button>
      </div>
    </div>
  );
}
