import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/hooks/useFinance';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import { PieChart } from '@/components/charts/PieChart';
import { LineChart } from '@/components/charts/LineChart';
import { PDFExport } from './PDFExport';
import { CSVExport } from './CSVExport';
import { getDateRange } from '@/utils/filters';
import { filterItems } from '@/utils/filters';
import { getTotalIncome, getTotalExpenses, getBalance, getSavingsRate, getCategoryDistribution, getMonthlyTrend, apply5030Rule, getFinancialScore } from '@/utils/calculations';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import type { DateRange } from '@/types/finance';

type Tab = 'resumen' | 'categorias' | 'tendencias';
type PeriodPreset = 'month' | 'last3' | 'year' | 'custom';

function findCategoryLabel(id: string): string {
  for (const cat of DEFAULT_CATEGORIES) {
    if (cat.id === id) return `${cat.emoji} ${cat.label}`;
    if (cat.children) {
      const child = cat.children.find((c) => c.id === id);
      if (child) return `${child.emoji} ${child.label}`;
    }
  }
  return id;
}

export function ReportsPage() {
  const { isDark } = useTheme();
  const { items } = useFinance();
  const { formatAmount, currency } = useCurrencyContext();
  const [tab, setTab] = useState<Tab>('resumen');
  const [period, setPeriod] = useState<PeriodPreset>('month');
  const [customRange, setCustomRange] = useState<DateRange | null>(null);

  const dateRange: DateRange = (() => {
    if (period === 'custom' && customRange) return customRange;
    if (period === 'last3') {
      const d = new Date(); d.setMonth(d.getMonth() - 3);
      return { start: d.toISOString(), end: new Date().toISOString(), label: 'Últimos 3 meses' };
    }
    return getDateRange(period === 'month' ? 'month' : 'year');
  })();

  const filtered = filterItems(items, { dateRange });
  const income = getTotalIncome(filtered);
  const expenses = getTotalExpenses(filtered);
  const balance = getBalance(filtered);
  const savingsRate = getSavingsRate(filtered);
  const score = getFinancialScore(filtered);
  const catDist = getCategoryDistribution(filtered);
  const monthlyTrend = getMonthlyTrend(items, 6);
  const rule5030 = apply5030Rule(filtered);

  const pieData = Object.entries(catDist)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, amount]) => ({ label: findCategoryLabel(id), value: amount }));

  const lineData = monthlyTrend.map((m) => ({ label: m.month, income: m.income, expenses: m.expenses }));

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
    fontWeight: 600,
    background: active ? (isDark ? 'rgba(255,255,255,0.1)' : '#fff') : 'transparent',
    color: active ? (isDark ? '#F1F5F9' : '#1E293B') : (isDark ? '#6B7280' : '#9CA3AF'),
    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.15s',
  });

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
    cursor: 'pointer', border: 'none', fontFamily: 'inherit',
    background: active ? 'linear-gradient(135deg, #3B82F6, #6366F1)' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'),
    color: active ? '#fff' : (isDark ? '#CBD5E1' : '#374151'),
  });

  const statCard = (label: string, value: string, color: string) => (
    <div style={{ padding: '16px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.04)' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` }}>
      <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 600, marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '22px', fontWeight: 800, color }}>{value}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Period selector */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {([['month', 'Este mes'], ['last3', 'Últimos 3 meses'], ['year', 'Este año'], ['custom', 'Personalizado']] as [PeriodPreset, string][]).map(([key, label]) => (
            <button key={key} style={chipStyle(period === key)} onClick={() => setPeriod(key)}>{label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <PDFExport items={filtered} />
          <CSVExport items={filtered} />
        </div>
      </div>

      {period === 'custom' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <input type="date" style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.06)' : '#fff', color: isDark ? '#F1F5F9' : '#1E293B', fontFamily: 'inherit' }} onChange={(e) => setCustomRange((prev) => ({ ...prev, start: e.target.value, end: prev?.end ?? '' }))} />
          <input type="date" style={{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: isDark ? 'rgba(255,255,255,0.06)' : '#fff', color: isDark ? '#F1F5F9' : '#1E293B', fontFamily: 'inherit' }} onChange={(e) => setCustomRange((prev) => ({ start: prev?.start ?? '', end: e.target.value, ...prev }))} />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderRadius: '10px', padding: '4px' }}>
        {([['resumen', 'Resumen'], ['categorias', 'Categorías'], ['tendencias', 'Tendencias']] as [Tab, string][]).map(([key, label]) => (
          <button key={key} style={tabStyle(tab === key)} onClick={() => setTab(key)}>{label}</button>
        ))}
      </div>

      {/* Resumen tab */}
      {tab === 'resumen' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {statCard('INGRESOS', formatAmount(income), '#22C55E')}
            {statCard('GASTOS', formatAmount(expenses), '#EF4444')}
            {statCard('BALANCE', formatAmount(balance), balance >= 0 ? '#22C55E' : '#EF4444')}
            {statCard('TASA DE AHORRO', formatPercent(savingsRate), '#3B82F6')}
          </div>
          {/* Financial score */}
          <div style={{ padding: '16px', borderRadius: '14px', background: isDark ? 'rgba(255,255,255,0.04)' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#94A3B8' : '#6B7280', marginBottom: '10px' }}>PUNTUACIÓN FINANCIERA</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, color: score >= 70 ? '#22C55E' : score >= 40 ? '#F59E0B' : '#EF4444' }}>{score}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#CBD5E1' : '#374151' }}>{score >= 70 ? '¡Excelente!' : score >= 40 ? 'En progreso' : 'Necesita mejorar'}</div>
                <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF' }}>de 100 puntos</div>
              </div>
            </div>
          </div>
          {/* 50/30/20 rule */}
          <div style={{ padding: '16px', borderRadius: '14px', background: isDark ? 'rgba(255,255,255,0.04)' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}` }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: isDark ? '#94A3B8' : '#6B7280', marginBottom: '12px' }}>REGLA 50/30/20</div>
            {[['Necesidades (50%)', rule5030.needs, '#3B82F6'], ['Deseos (30%)', rule5030.wants, '#8B5CF6'], ['Ahorros (20%)', rule5030.savings, '#22C55E']].map(([label, val, col]) => (
              <div key={label as string} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: isDark ? '#CBD5E1' : '#374151' }}>{label as string}</span>
                  <span style={{ fontWeight: 700, color: col as string }}>{formatCurrency(val as number, currency)}</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, income > 0 ? ((val as number) / income) * 100 : 0)}%`, background: col as string, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categorías tab */}
      {tab === 'categorias' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PieChart data={pieData} title="Distribución de gastos" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pieData.map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                <span style={{ fontSize: '14px', color: isDark ? '#CBD5E1' : '#374151' }}>{label}</span>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF' }}>{expenses > 0 ? formatPercent((value / expenses) * 100) : '0%'}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444' }}>{formatAmount(value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tendencias tab */}
      {tab === 'tendencias' && (
        <div>
          <LineChart data={lineData} />
        </div>
      )}
    </div>
  );
}
