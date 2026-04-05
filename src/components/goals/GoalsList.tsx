import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { GoalCard } from './GoalCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { SavingsGoal, GoalStatus } from '@/types/goals';

const STATUS_FILTERS: { key: GoalStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'active', label: '🟢 Activas' },
  { key: 'completed', label: '✅ Completadas' },
  { key: 'paused', label: '⏸ Pausadas' },
];

interface GoalsListProps {
  goals: SavingsGoal[];
  onAdd?: () => void;
  onContribute?: (goal: SavingsGoal) => void;
  onEdit?: (goal: SavingsGoal) => void;
  onDelete?: (id: string) => void;
}

export function GoalsList({ goals, onAdd, onContribute, onEdit, onDelete }: GoalsListProps) {
  const { isDark } = useTheme();
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'all'>('all');

  const filtered = statusFilter === 'all' ? goals : goals.filter((g) => g.status === statusFilter);

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'inherit',
    background: active ? 'linear-gradient(135deg, #3B82F6, #6366F1)' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'),
    color: active ? '#fff' : (isDark ? '#CBD5E1' : '#374151'),
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  });

  if (goals.length === 0) {
    return (
      <EmptyState
        title="Sin metas"
        description="Define una meta financiera para motivar tu ahorro."
        ctaLabel="Crear meta"
        onCta={onAdd}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map((f) => (
          <button key={f.key} style={chipStyle(statusFilter === f.key)} onClick={() => setStatusFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: isDark ? '#6B7280' : '#9CA3AF', fontSize: '14px' }}>
          No hay metas en esta categoría
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filtered.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onContribute={onContribute}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
