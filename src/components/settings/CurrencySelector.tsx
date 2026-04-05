import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import { CURRENCIES } from '@/constants/currencies';
import type { Currency } from '@/types/currency';

export function CurrencySelector() {
  const { isDark } = useTheme();
  const { currency, setCurrency } = useCurrencyContext();

  const currencies = Object.entries(CURRENCIES) as [Currency, typeof CURRENCIES[Currency]][];

  const cardStyle = (isSelected: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    borderRadius: '12px',
    border: isSelected
      ? '2px solid #3B82F6'
      : `2px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
    background: isSelected
      ? (isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.07)')
      : (isDark ? 'rgba(255,255,255,0.03)' : '#fff'),
    cursor: 'pointer',
    transition: 'all 0.15s',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {currencies.map(([code, info]) => (
        <button
          key={code}
          style={cardStyle(currency === code)}
          onClick={() => setCurrency(code)}
          aria-pressed={currency === code}
        >
          <span
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: isDark ? '#F1F5F9' : '#1E293B',
              minWidth: '28px',
              textAlign: 'center',
            }}
          >
            {info.symbol}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B' }}>
              {code}
            </div>
            <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF' }}>
              {info.name}
            </div>
          </div>
          {currency === code && (
            <span style={{ color: '#3B82F6', fontSize: '18px' }}>✓</span>
          )}
        </button>
      ))}
    </div>
  );
}
