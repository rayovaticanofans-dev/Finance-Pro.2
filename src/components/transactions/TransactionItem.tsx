import React, { useCallback, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { formatRelativeDate } from '@/utils/formatters';
import { RecurringBadge } from './RecurringBadge';
import type { Item } from '@/types/finance';
import type { CategoryNode } from '@/types/category';

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

interface TransactionItemProps {
  item: Item;
  onClick?: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onDelete?: (id: string) => void;
}

export function TransactionItem({ item, onClick, onEdit, onDelete }: TransactionItemProps) {
  const { isDark } = useTheme();
  const { formatAmount } = useCurrencyContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cat = findCategory(item.category);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(true);
  }, []);

  const handleClickOutside = useCallback(() => {
    setMenuOpen(false);
  }, []);

  React.useEffect(() => {
    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpen, handleClickOutside]);

  const isIncome = item.type === 'income';
  const amountColor = isIncome ? '#22C55E' : '#EF4444';
  const amountSign = isIncome ? '+' : '-';

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '12px',
    background: hovered
      ? isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
      : 'transparent',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    position: 'relative',
    userSelect: 'none',
  };

  const emojiStyle: React.CSSProperties = {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
    flexShrink: 0,
  };

  const descStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: isDark ? '#F1F5F9' : '#1E293B',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '200px',
  };

  const metaStyle: React.CSSProperties = {
    fontSize: '12px',
    color: isDark ? '#6B7280' : '#9CA3AF',
    marginTop: '2px',
  };

  const amountStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 700,
    color: amountColor,
    marginLeft: 'auto',
    flexShrink: 0,
  };

  const menuStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '100%',
    zIndex: 100,
    background: isDark ? '#1E293B' : '#FFFFFF',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '10px',
    boxShadow: isDark
      ? '0 8px 24px rgba(0,0,0,0.5)'
      : '0 8px 24px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    minWidth: '140px',
  };

  const menuItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    color: isDark ? '#CBD5E1' : '#374151',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'background 0.1s',
  };

  return (
    <div
      style={containerStyle}
      onClick={() => onClick?.(item)}
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(item); }}
      aria-label={`${item.desc} ${amountSign}${formatAmount(item.amount)}`}
    >
      <div style={emojiStyle}>{cat?.emoji ?? '💸'}</div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={descStyle}>{item.desc}</div>
        <div style={metaStyle}>
          {cat?.label ?? item.category} · {formatRelativeDate(item.date)}
        </div>
        {(item.tags && item.tags.length > 0) && (
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '10px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
                  color: isDark ? '#818CF8' : '#4F46E5',
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        <span style={amountStyle}>
          {amountSign}{formatAmount(item.amount)}
        </span>
        {item.recurring !== 'none' && <RecurringBadge recurring={item.recurring} />}
      </div>

      {menuOpen && (
        <div ref={menuRef} style={menuStyle} onClick={(e) => e.stopPropagation()}>
          <button
            style={menuItemStyle}
            onClick={() => { setMenuOpen(false); onEdit?.(item); }}
          >
            ✏️ Editar
          </button>
          <button
            style={{ ...menuItemStyle, color: '#EF4444' }}
            onClick={() => { setMenuOpen(false); onDelete?.(item.id); }}
          >
            🗑️ Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
