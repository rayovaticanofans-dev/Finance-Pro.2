import React, { useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { pdfService } from '@/services/pdf.service';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import { useProfiles } from '@/hooks/useProfiles';
import type { Item } from '@/types/finance';

interface PDFExportProps {
  items: Item[];
}

export function PDFExport({ items }: PDFExportProps) {
  const { isDark } = useTheme();
  const { currency } = useCurrencyContext();
  const { activeProfile } = useProfiles();
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);
    try {
      const doc = pdfService.generateTransactionReport(items, {
        title: 'Reporte de Transacciones',
        currency,
        profileName: activeProfile.name,
        dateRange: items.length > 0
          ? {
              start: items.reduce((min, i) => i.date < min ? i.date : min, items[0].date).slice(0, 10),
              end: items.reduce((max, i) => i.date > max ? i.date : max, items[0].date).slice(0, 10),
            }
          : undefined,
      });
      doc.save(`reporte-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error('PDF export failed', e);
    } finally {
      setLoading(false);
    }
  }, [items, currency, activeProfile.name]);

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '10px',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
    background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
    color: isDark ? '#CBD5E1' : '#374151',
    cursor: loading ? 'wait' : 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'inherit',
    opacity: loading ? 0.7 : 1,
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  };

  return (
    <button style={btnStyle} onClick={handleExport} disabled={loading || items.length === 0} aria-label="Exportar PDF">
      {loading ? '⏳' : '📄'} PDF
    </button>
  );
}
