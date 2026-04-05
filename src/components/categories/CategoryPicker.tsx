import React, { useMemo, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import type { CategoryNode } from '@/types/category';

const RECENT_KEY = 'fp-v3:recentCategories';
const MAX_RECENT = 5;

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch { /* ignore */ }
  return [];
}

function saveRecent(ids: string[]): void {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch { /* ignore */ }
}

function flatAll(): CategoryNode[] {
  const result: CategoryNode[] = [];
  for (const cat of DEFAULT_CATEGORIES) {
    result.push(cat);
    if (cat.children) result.push(...cat.children);
  }
  return result;
}

interface CategoryPickerProps {
  selected?: string;
  onSelect: (id: string) => void;
}

export function CategoryPicker({ selected, onSelect }: CategoryPickerProps) {
  const { isDark } = useTheme();
  const [search, setSearch] = useState('');
  const [expandedParent, setExpandedParent] = useState<string | null>(null);
  const [recentIds] = useState<string[]>(loadRecent);

  const allFlat = useMemo(() => flatAll(), []);

  const recent = useMemo(
    () => recentIds.map((id) => allFlat.find((c) => c.id === id)).filter(Boolean) as CategoryNode[],
    [recentIds, allFlat]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return allFlat.filter((c) => c.label.toLowerCase().includes(q) || c.emoji.includes(q));
  }, [search, allFlat]);

  const handleSelect = (id: string) => {
    const updated = [id, ...recentIds.filter((r) => r !== id)].slice(0, MAX_RECENT);
    saveRecent(updated);
    onSelect(id);
  };

  const inputStyle: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '10px',
    padding: '10px 14px',
    color: isDark ? '#F1F5F9' : '#1E293B',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
    marginBottom: '16px',
  };

  const catBtnStyle = (isSelected: boolean, color: string): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '10px 6px',
    borderRadius: '12px',
    border: isSelected ? `2px solid ${color}` : `2px solid transparent`,
    background: isSelected
      ? isDark ? `${color}22` : `${color}15`
      : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: isSelected ? 700 : 500,
    color: isSelected ? color : isDark ? '#CBD5E1' : '#374151',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
    minHeight: '64px',
  });

  const sectionTitle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: isDark ? '#6B7280' : '#9CA3AF',
    marginBottom: '8px',
    marginTop: '12px',
  };

  const renderGrid = (items: CategoryNode[]) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
      {items.map((c) => (
        <button
          key={c.id}
          style={catBtnStyle(selected === c.id, c.color)}
          onClick={() => handleSelect(c.id)}
          title={c.label}
        >
          <span style={{ fontSize: '22px' }}>{c.emoji}</span>
          <span style={{ textAlign: 'center', lineHeight: 1.2, fontSize: '10px' }}>{c.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <h3 style={{ margin: '0 0 12px', fontSize: '16px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
        Seleccionar categoría
      </h3>
      <input
        type="text"
        style={inputStyle}
        placeholder="Buscar categoría..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />

      {filtered ? (
        <>
          <div style={sectionTitle}>Resultados</div>
          {filtered.length === 0 ? (
            <div style={{ color: isDark ? '#6B7280' : '#9CA3AF', fontSize: '13px', padding: '12px 0' }}>
              Sin resultados
            </div>
          ) : renderGrid(filtered)}
        </>
      ) : (
        <>
          {recent.length > 0 && (
            <>
              <div style={sectionTitle}>Recientes</div>
              {renderGrid(recent)}
            </>
          )}

          {DEFAULT_CATEGORIES.map((parent) => (
            <div key={parent.id}>
              <button
                onClick={() => setExpandedParent(expandedParent === parent.id ? null : parent.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 0',
                  color: isDark ? '#CBD5E1' : '#374151',
                  fontFamily: 'inherit',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                <span style={sectionTitle}>{parent.emoji} {parent.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: '12px', opacity: 0.6 }}>
                  {expandedParent === parent.id ? '▲' : '▼'}
                </span>
              </button>
              {(expandedParent === parent.id || selected === parent.id) && (
                <div style={{ marginBottom: '8px' }}>
                  {renderGrid([parent, ...(parent.children ?? [])])}
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
