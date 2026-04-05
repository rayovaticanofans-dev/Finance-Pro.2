import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import type { Item, TransactionFilter, TransactionSort, DateRange } from '@/types/finance';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { getDateRange } from '@/utils/filters';

type DatePreset = 'today' | 'week' | 'month' | 'year' | 'custom';
type SortField = 'date' | 'amount' | 'category' | 'desc';

const DATE_PRESETS: { key: DatePreset; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
  { key: 'year', label: 'Año' },
  { key: 'custom', label: 'Personalizado' },
];

interface TransactionFiltersProps {
  filter: TransactionFilter;
  sort: TransactionSort;
  onFilterChange: (filter: TransactionFilter) => void;
  onSortChange: (sort: TransactionSort) => void;
  onClose?: () => void;
}

export function TransactionFilters({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  onClose,
}: TransactionFiltersProps) {
  const { isDark } = useTheme();
  const [datePreset, setDatePreset] = useState<DatePreset>('month');
  const [customStart, setCustomStart] = useState(filter.dateRange?.start?.slice(0, 10) ?? '');
  const [customEnd, setCustomEnd] = useState(filter.dateRange?.end?.slice(0, 10) ?? '');

  const activeFilterCount = [
    filter.dateRange,
    filter.categories?.length,
    filter.types?.length,
    filter.amountMin !== undefined,
    filter.amountMax !== undefined,
    filter.tags?.length,
  ].filter(Boolean).length;

  const handlePreset = useCallback(
    (preset: DatePreset) => {
      setDatePreset(preset);
      if (preset !== 'custom') {
        const range = getDateRange(preset === 'today' ? 'today' : preset === 'week' ? 'week' : preset === 'month' ? 'month' : 'year');
        onFilterChange({ ...filter, dateRange: range });
      }
    },
    [filter, onFilterChange]
  );

  const handleCategoryToggle = useCallback(
    (id: string) => {
      const current = filter.categories ?? [];
      const updated = current.includes(id)
        ? current.filter((c) => c !== id)
        : [...current, id];
      onFilterChange({ ...filter, categories: updated.length ? updated : undefined });
    },
    [filter, onFilterChange]
  );

  const handleTypeToggle = useCallback(
    (type: Item['type']) => {
      const current = filter.types ?? [];
      const updated = current.includes(type) ? current.filter((t) => t !== type) : [...current, type];
      onFilterChange({ ...filter, types: updated.length ? (updated as Item['type'][]) : undefined });
    },
    [filter, onFilterChange]
  );

  const handleCustomDateApply = useCallback(() => {
    if (customStart && customEnd) {
      const range: DateRange = { start: customStart, end: customEnd + 'T23:59:59', label: 'Personalizado' };
      onFilterChange({ ...filter, dateRange: range });
    }
  }, [customStart, customEnd, filter, onFilterChange]);

  const handleClear = useCallback(() => {
    onFilterChange({});
    onSortChange({ field: 'date', direction: 'desc' });
    setDatePreset('month');
  }, [onFilterChange, onSortChange]);

  const inputStyle: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '8px',
    padding: '8px 12px',
    color: isDark ? '#F1F5F9' : '#1E293B',
    fontSize: '13px',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: isDark ? '#6B7280' : '#9CA3AF',
    marginBottom: '8px',
  };

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'inherit',
    background: active
      ? 'linear-gradient(135deg, #3B82F6, #6366F1)'
      : isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
    color: active ? '#fff' : isDark ? '#CBD5E1' : '#374151',
    transition: 'all 0.15s',
  });

  const SORT_FIELDS: { key: SortField; label: string }[] = [
    { key: 'date', label: 'Fecha' },
    { key: 'amount', label: 'Monto' },
    { key: 'category', label: 'Categoría' },
    { key: 'desc', label: 'Descripción' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Date range presets */}
      <div>
        <div style={sectionTitleStyle}>Período</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {DATE_PRESETS.map((p) => (
            <button key={p.key} style={chipStyle(datePreset === p.key)} onClick={() => handlePreset(p.key)}>
              {p.label}
            </button>
          ))}
        </div>
        {datePreset === 'custom' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginTop: '10px', alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF' }}>Desde</label>
              <input type="date" style={inputStyle} value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF' }}>Hasta</label>
              <input type="date" style={inputStyle} value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
            </div>
            <Button variant="secondary" size="sm" onClick={handleCustomDateApply}>Aplicar</Button>
          </div>
        )}
      </div>

      {/* Type filter */}
      <div>
        <div style={sectionTitleStyle}>Tipo</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={chipStyle(!filter.types?.length)} onClick={() => onFilterChange({ ...filter, types: undefined })}>
            Todos
          </button>
          <button style={chipStyle(filter.types?.includes('income') ?? false)} onClick={() => handleTypeToggle('income')}>
            💰 Ingresos
          </button>
          <button style={chipStyle(filter.types?.includes('expense') ?? false)} onClick={() => handleTypeToggle('expense')}>
            💸 Gastos
          </button>
        </div>
      </div>

      {/* Category multi-select */}
      <div>
        <div style={sectionTitleStyle}>Categorías</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxHeight: '140px', overflowY: 'auto' }}>
          {DEFAULT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              style={chipStyle(filter.categories?.includes(cat.id) ?? false)}
              onClick={() => handleCategoryToggle(cat.id)}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amount range */}
      <div>
        <div style={sectionTitleStyle}>Rango de monto</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF' }}>Mínimo</label>
            <input
              type="number"
              style={inputStyle}
              placeholder="0"
              value={filter.amountMin ?? ''}
              onChange={(e) => onFilterChange({ ...filter, amountMin: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF' }}>Máximo</label>
            <input
              type="number"
              style={inputStyle}
              placeholder="∞"
              value={filter.amountMax ?? ''}
              onChange={(e) => onFilterChange({ ...filter, amountMax: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>
        </div>
      </div>

      {/* Tags filter */}
      <div>
        <div style={sectionTitleStyle}>Etiqueta</div>
        <input
          type="text"
          style={inputStyle}
          placeholder="Filtrar por etiqueta..."
          value={filter.tags?.[0] ?? ''}
          onChange={(e) => onFilterChange({ ...filter, tags: e.target.value ? [e.target.value] : undefined })}
        />
      </div>

      {/* Sort */}
      <div>
        <div style={sectionTitleStyle}>Ordenar por</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {SORT_FIELDS.map((f) => (
            <button
              key={f.key}
              style={chipStyle(sort.field === f.key)}
              onClick={() => onSortChange({ ...sort, field: f.key })}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={chipStyle(sort.direction === 'asc')} onClick={() => onSortChange({ ...sort, direction: 'asc' })}>↑ Asc</button>
          <button style={chipStyle(sort.direction === 'desc')} onClick={() => onSortChange({ ...sort, direction: 'desc' })}>↓ Desc</button>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
        <Button variant="ghost" size="sm" onClick={handleClear} fullWidth>
          Limpiar{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </Button>
        {onClose && (
          <Button variant="primary" size="sm" onClick={onClose} fullWidth>
            Aplicar
          </Button>
        )}
      </div>
    </div>
  );
}
