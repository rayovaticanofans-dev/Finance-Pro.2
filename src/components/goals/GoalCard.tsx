import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ProgressRing } from '@/components/charts/ProgressRing';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import type { SavingsGoal } from '@/types/goals';

interface GoalCardProps {
  goal: SavingsGoal;
  onContribute?: (goal: SavingsGoal) => void;
  onEdit?: (goal: SavingsGoal) => void;
  onDelete?: (id: string) => void;
}

export function GoalCard({ goal, onContribute, onEdit, onDelete }: GoalCardProps) {
  const { isDark } = useTheme();
  const { formatAmount } = useCurrencyContext();
  const [menuOpen, setMenuOpen] = useState(false);

  const percentage = goal.targetAmount > 0
    ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
    : 0;

  const remaining = goal.targetAmount - goal.currentAmount;

  const estimatedDate = () => {
    if (goal.monthlyContribution && goal.monthlyContribution > 0 && remaining > 0) {
      const months = Math.ceil(remaining / goal.monthlyContribution);
      const d = new Date();
      d.setMonth(d.getMonth() + months);
      return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    }
    if (goal.deadline) {
      return new Date(goal.deadline).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    }
    return null;
  };

  const STATUS_COLORS: Record<SavingsGoal['status'], string> = {
    active: goal.color ?? '#3B82F6',
    completed: '#22C55E',
    paused: '#6B7280',
  };

  const color = STATUS_COLORS[goal.status];

  const cardStyle: React.CSSProperties = {
    padding: '20px',
    borderRadius: '16px',
    background: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
    position: 'relative',
    overflow: 'hidden',
  };

  const est = estimatedDate();

  return (
    <div style={cardStyle}>
      {/* Background accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '80px', height: '80px',
        background: `radial-gradient(circle at top right, ${color}22, transparent)`,
        borderRadius: '0 16px 0 80px',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '32px', marginBottom: '6px' }}>{goal.emoji ?? '🎯'}</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
            {goal.name}
          </div>
          {goal.status !== 'active' && (
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px',
              background: goal.status === 'completed' ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.15)',
              color: goal.status === 'completed' ? '#22C55E' : '#6B7280',
            }}>
              {goal.status === 'completed' ? '✓ Completado' : '⏸ Pausado'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <ProgressRing value={percentage} size={72} strokeWidth={7} color={color} />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#6B7280' : '#9CA3AF', fontSize: '18px', padding: '2px' }}
            aria-label="Opciones"
          >
            ⋮
          </button>
        </div>
      </div>

      {/* Amounts */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
          <span style={{ color: isDark ? '#94A3B8' : '#6B7280' }}>Ahorro actual</span>
          <span style={{ fontWeight: 700, color: color }}>{formatAmount(goal.currentAmount)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px' }}>
          <span style={{ color: isDark ? '#94A3B8' : '#6B7280' }}>Meta</span>
          <span style={{ fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>{formatAmount(goal.targetAmount)}</span>
        </div>
        <div style={{ height: '6px', borderRadius: '3px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${percentage}%`, background: color, borderRadius: '3px', transition: 'width 0.6s ease' }} />
        </div>
      </div>

      {/* Meta info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF', marginBottom: '12px' }}>
        {est && <span>📅 {est}</span>}
        {goal.monthlyContribution && goal.monthlyContribution > 0 && (
          <span>📆 {formatAmount(goal.monthlyContribution)}/mes</span>
        )}
      </div>

      {/* Contribute button */}
      {goal.status === 'active' && onContribute && (
        <button
          onClick={() => onContribute(goal)}
          style={{
            width: '100%', padding: '10px', borderRadius: '10px', border: 'none',
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          + Contribuir
        </button>
      )}

      {/* Context menu */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute', top: '54px', right: '20px', zIndex: 50,
            background: isDark ? '#1E293B' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            overflow: 'hidden', minWidth: '130px',
          }}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button onClick={() => { setMenuOpen(false); onEdit?.(goal); }} style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', color: isDark ? '#CBD5E1' : '#374151', fontFamily: 'inherit' }}>✏️ Editar</button>
          <button onClick={() => { setMenuOpen(false); onDelete?.(goal.id); }} style={{ display: 'block', width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', color: '#EF4444', fontFamily: 'inherit' }}>🗑️ Eliminar</button>
        </div>
      )}
    </div>
  );
}
