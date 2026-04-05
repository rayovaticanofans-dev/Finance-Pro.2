import React, { useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { exportService } from '@/services/export.service';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import type { Item } from '@/types/finance';

interface CSVExportProps {
  items: Item[];
}

export function CSVExport({ items }: CSVExportProps) {
  const { isDark } = useTheme();
  const { currency } = useCurrencyContext();

  const handleExport = useCallback(() => {
    const csv = exportService.exportTransactionsCSV(items, currency);
    const filename = `transacciones-${new Date().toISOString().slice(0, 10)}.csv`;
    exportService.downloadCSV(items, filename);
    void csv;
  }, [items, currency]);

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
    background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
    color: isDark ? '#CBD5E1' : '#374151',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'inherit',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  };

  return (
    <button
      style={btnStyle}
      onClick={handleExport}
      disabled={items.length === 0}
      aria-label="Exportar CSV"
    >
      ⬇️ CSV
    </button>
  );
}
