import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import type { CategoryNode } from '@/types/category';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import { useFinance } from '@/hooks/useFinance';

function getMonthlySpending(items: ReturnType<typeof useFinance>['items'], categoryId: string): number {
  const now = new Date();
  return items
    .filter((i) => {
      if (i.type !== 'expense') return false;
      if (i.category !== categoryId) return false;
      const d = new Date(i.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, i) => sum + i.amount, 0);
}

interface CategoryNodeRowProps {
  node: CategoryNode;
  depth: number;
  spending: number;
  expanded: boolean;
  onToggle: (id: string) => void;
  onEdit?: (node: CategoryNode) => void;
  onDelete?: (id: string) => void;
}

function CategoryNodeRow({
  node,
  depth,
  spending,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: CategoryNodeRowProps) {
  const { isDark } = useTheme();
  const { formatAmount } = useCurrencyContext();
  const [hovered, setHovered] = useState(false);
  const hasChildren = (node.children?.length ?? 0) > 0;

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: `10px 12px 10px ${12 + depth * 20}px`,
    borderRadius: '10px',
    background: hovered ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)') : 'transparent',
    cursor: 'pointer',
    transition: 'background 0.15s',
  };

  return (
    <>
      <div
        style={rowStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => hasChildren && onToggle(node.id)}
        role={hasChildren ? 'button' : undefined}
        tabIndex={hasChildren ? 0 : undefined}
        onKeyDown={(e) => { if (e.key === 'Enter' && hasChildren) onToggle(node.id); }}
        aria-expanded={hasChildren ? expanded : undefined}
      >
        {/* Color dot */}
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: node.color,
            flexShrink: 0,
          }}
        />
        {/* Emoji */}
        <span style={{ fontSize: '18px', flexShrink: 0 }}>{node.emoji}</span>
        {/* Label */}
        <span
          style={{
            flex: 1,
            fontSize: '14px',
            fontWeight: depth === 0 ? 700 : 500,
            color: isDark ? '#F1F5F9' : '#1E293B',
          }}
        >
          {node.label}
        </span>
        {/* Spending */}
        {spending > 0 && (
          <span style={{ fontSize: '12px', color: isDark ? '#94A3B8' : '#6B7280', fontWeight: 600 }}>
            {formatAmount(spending)}
          </span>
        )}
        {/* Expand arrow */}
        {hasChildren && (
          <span style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF', transition: 'transform 0.2s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
            ▶
          </span>
        )}
        {/* Edit/Delete for custom categories */}
        {node.isCustom && hovered && (
          <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onEdit?.(node)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 4px', color: isDark ? '#94A3B8' : '#6B7280', borderRadius: '4px' }}
              aria-label="Editar"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete?.(node.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '2px 4px', color: '#EF4444', borderRadius: '4px' }}
              aria-label="Eliminar"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      {hasChildren && expanded && node.children?.map((child) => (
        <CategoryNodeRow
          key={child.id}
          node={child}
          depth={depth + 1}
          spending={spending}
          expanded={false}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

interface CategoryTreeProps {
  onEdit?: (node: CategoryNode) => void;
  onDelete?: (id: string) => void;
}

export function CategoryTree({ onEdit, onDelete }: CategoryTreeProps) {
  const { isDark } = useTheme();
  const { items } = useFinance();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div
      style={{
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderRadius: '14px',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
        overflow: 'hidden',
      }}
    >
      {DEFAULT_CATEGORIES.map((cat) => (
        <CategoryNodeRow
          key={cat.id}
          node={cat}
          depth={0}
          spending={getMonthlySpending(items, cat.id)}
          expanded={expanded.has(cat.id)}
          onToggle={toggleExpanded}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
