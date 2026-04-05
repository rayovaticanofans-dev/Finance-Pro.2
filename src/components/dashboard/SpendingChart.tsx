import React, { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/hooks/useFinance';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { PieChart } from '@/components/charts/PieChart';
import type { PieDataItem } from '@/components/charts/PieChart';
import { useCurrency } from '@/hooks/useCurrency';

export const SpendingChart = React.memo(function SpendingChart() {
  const { isDark } = useTheme();
  const { statistics } = useFinance();
  const { formatAmount } = useCurrency();

  const chartData = useMemo<PieDataItem[]>(() => {
    const dist = statistics.categoryDistribution;
    const entries = Object.entries(dist).sort(([, a], [, b]) => b - a).slice(0, 7);

    return entries.map(([catId, value]) => {
      const category = DEFAULT_CATEGORIES.find((c) => c.id === catId)
        ?? DEFAULT_CATEGORIES.flatMap((c) => c.children ?? []).find((c) => c.id === catId);

      return {
        label: category?.label ?? catId,
        value,
        color: category?.color ?? '#6366F1',
      };
    });
  }, [statistics.categoryDistribution]);

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div
      style={{
        borderRadius: '16px',
        padding: '20px',
        background: isDark ? '#1E1E2E' : '#ffffff',
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)'
          : '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
        Gastos por categoría
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PieChart
          data={chartData}
          size={200}
          showLegend={true}
          centerText={total > 0 ? formatAmount(total) : undefined}
          centerSubtext={total > 0 ? 'total' : undefined}
        />
      </div>
    </div>
  );
});
