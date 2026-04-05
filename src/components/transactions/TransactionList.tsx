import React, { useMemo, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { TransactionItem } from './TransactionItem';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Item } from '@/types/finance';

function getGroupLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const itemDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today.getTime() - itemDay.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
}

function groupByDate(items: Item[]): Array<{ label: string; items: Item[] }> {
  const map = new Map<string, Item[]>();
  for (const item of items) {
    const key = item.date.slice(0, 10);
    const existing = map.get(key);
    if (existing) {
      existing.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  const groups: Array<{ label: string; items: Item[] }> = [];
  for (const [key, groupItems] of map.entries()) {
    groups.push({ label: getGroupLabel(key), items: groupItems });
  }
  return groups;
}

interface TransactionListProps {
  items: Item[];
  isLoading?: boolean;
  onItemClick?: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
}

const VISIBLE_THRESHOLD = 100;

export function TransactionList({
  items,
  isLoading = false,
  onItemClick,
  onEdit,
  onDelete,
  emptyMessage = 'No hay transacciones aún. ¡Agrega tu primera transacción!',
}: TransactionListProps) {
  const { isDark } = useTheme();
  const [showAll, setShowAll] = useState(false);

  const visibleItems = useMemo(() => {
    if (items.length <= VISIBLE_THRESHOLD || showAll) return items;
    return items.slice(0, VISIBLE_THRESHOLD);
  }, [items, showAll]);

  const groups = useMemo(() => groupByDate(visibleItems), [visibleItems]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px' }}>
            <Skeleton width={42} height={42} style={{ borderRadius: '12px' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Skeleton width="60%" height={14} />
              <Skeleton width="40%" height={12} />
            </div>
            <Skeleton width={70} height={16} />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Sin transacciones"
        description={emptyMessage}
        ctaLabel="Agregar transacción"
      />
    );
  }

  const groupLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: isDark ? '#6B7280' : '#9CA3AF',
    padding: '8px 16px 4px',
  };

  const dividerStyle: React.CSSProperties = {
    height: '1px',
    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    margin: '4px 16px',
  };

  return (
    <div>
      {groups.map((group, gi) => (
        <div key={group.label + gi}>
          <div style={groupLabelStyle}>{group.label}</div>
          {group.items.map((item, ii) => (
            <React.Fragment key={item.id}>
              <TransactionItem
                item={item}
                onClick={onItemClick}
                onEdit={onEdit}
                onDelete={onDelete}
              />
              {ii < group.items.length - 1 && <div style={dividerStyle} />}
            </React.Fragment>
          ))}
        </div>
      ))}

      {items.length > VISIBLE_THRESHOLD && !showAll && (
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <button
            onClick={() => setShowAll(true)}
            style={{
              background: 'none',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
              borderRadius: '8px',
              padding: '8px 20px',
              color: isDark ? '#CBD5E1' : '#374151',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            Mostrar {items.length - VISIBLE_THRESHOLD} más
          </button>
        </div>
      )}
    </div>
  );
}
