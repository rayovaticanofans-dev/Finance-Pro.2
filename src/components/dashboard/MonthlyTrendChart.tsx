import React, { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/hooks/useFinance';
import { BarChart } from '@/components/charts/BarChart';
import type { BarDataItem } from '@/components/charts/BarChart';

export const MonthlyTrendChart = React.memo(function MonthlyTrendChart() {
  const { isDark } = useTheme();
  const { statistics } = useFinance();

  const chartData = useMemo<BarDataItem[]>(() => {
    return statistics.monthlyTrend.map((entry) => ({
      label: entry.month.split(' ')[0], // Short month name
      value: entry.income,
      value2: entry.expenses,
    }));
  }, [statistics.monthlyTrend]);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
          Tendencia mensual
        </h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#22C55E', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 500 }}>Ingresos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#EF4444', display: 'inline-block' }} />
            <span style={{ fontSize: '12px', color: isDark ? '#9CA3AF' : '#6B7280', fontWeight: 500 }}>Gastos</span>
          </div>
        </div>
      </div>

      <BarChart
        data={chartData}
        color="#22C55E"
        color2="#EF4444"
        showGrid={true}
        showLabels={true}
        height={220}
      />
    </div>
  );
});
