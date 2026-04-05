import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/hooks/useFinance';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import { getTotalIncome, getTotalExpenses, getBalance, getSavingsRate, getCategoryDistribution } from '@/utils/calculations';
import { filterItems } from '@/utils/filters';
import { formatPercent, formatCurrency } from '@/utils/formatters';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
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

export function MonthlyReport() {
  const { isDark } = useTheme();
  const { items } = useFinance();
  const { formatAmount, currency } = useCurrencyContext();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const monthStart = new Date(year, month, 1).toISOString();
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
  const prevMonthStart = new Date(year, month - 1, 1).toISOString();
  const prevMonthEnd = new Date(year, month, 0, 23, 59, 59).toISOString();

  const monthItems = filterItems(items, { dateRange: { start: monthStart, end: monthEnd } });
  const prevItems = filterItems(items, { dateRange: { start: prevMonthStart, end: prevMonthEnd } });

  const income = getTotalIncome(monthItems);
  const expenses = getTotalExpenses(monthItems);
  const balance = getBalance(monthItems);
  const savingsRate = getSavingsRate(monthItems);
  const prevIncome = getTotalIncome(prevItems);
  const prevExpenses = getTotalExpenses(prevItems);

  const catDist = getCategoryDistribution(monthItems);
  const topCategories = Object.entries(catDist)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  const changePercent = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  const statStyle: React.CSSProperties = {
    padding: '14px',
    borderRadius: '12px',
    background: isDark ? 'rgba(255,255,255,0.04)' : '#fff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Month/year selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => { if (month === 0) { setMonth(11); setYear((y) => y - 1); } else setMonth((m) => m - 1); }}
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: isDark ? '#CBD5E1' : '#374151', fontSize: '16px', fontFamily: 'inherit' }}>
          ‹
        </button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: '17px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
          {MONTHS_ES[month]} {year}
        </span>
        <button onClick={() => { if (month === 11) { setMonth(0); setYear((y) => y + 1); } else setMonth((m) => m + 1); }}
          style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: isDark ? '#CBD5E1' : '#374151', fontSize: '16px', fontFamily: 'inherit' }}>
          ›
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div style={statStyle}>
          <div style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 700, marginBottom: '4px' }}>INGRESOS</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#22C55E' }}>{formatAmount(income)}</div>
          <div style={{ fontSize: '11px', color: changePercent(income, prevIncome) >= 0 ? '#22C55E' : '#EF4444', marginTop: '2px' }}>
            {changePercent(income, prevIncome) >= 0 ? '▲' : '▼'} {Math.abs(changePercent(income, prevIncome)).toFixed(0)}% vs mes anterior
          </div>
        </div>
        <div style={statStyle}>
          <div style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 700, marginBottom: '4px' }}>GASTOS</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#EF4444' }}>{formatAmount(expenses)}</div>
          <div style={{ fontSize: '11px', color: changePercent(expenses, prevExpenses) <= 0 ? '#22C55E' : '#EF4444', marginTop: '2px' }}>
            {changePercent(expenses, prevExpenses) >= 0 ? '▲' : '▼'} {Math.abs(changePercent(expenses, prevExpenses)).toFixed(0)}% vs mes anterior
          </div>
        </div>
        <div style={statStyle}>
          <div style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 700, marginBottom: '4px' }}>BALANCE</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: balance >= 0 ? '#22C55E' : '#EF4444' }}>{formatAmount(balance)}</div>
        </div>
        <div style={statStyle}>
          <div style={{ fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF', fontWeight: 700, marginBottom: '4px' }}>TASA DE AHORRO</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#3B82F6' }}>{formatPercent(savingsRate)}</div>
        </div>
      </div>

      {/* Top categories */}
      {topCategories.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: isDark ? '#6B7280' : '#9CA3AF', marginBottom: '10px' }}>
            Top 5 categorías
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topCategories.map(([id, amount]) => {
              const cat = findCategory(id);
              const pct = expenses > 0 ? (amount / expenses) * 100 : 0;
              return (
                <div key={id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ color: isDark ? '#CBD5E1' : '#374151' }}>{cat?.emoji} {cat?.label ?? id}</span>
                    <span style={{ fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>{formatCurrency(amount, currency)}</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: cat?.color ?? '#3B82F6', borderRadius: '3px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
