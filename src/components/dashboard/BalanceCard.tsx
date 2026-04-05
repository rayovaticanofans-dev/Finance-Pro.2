import React, { useEffect, useRef, useState } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { useCurrency } from '@/hooks/useCurrency';

export const BalanceCard = React.memo(function BalanceCard() {
  const { balance, statistics } = useFinance();
  const { formatAmount, getCurrencySymbol } = useCurrency();
  const [displayBalance, setDisplayBalance] = useState(0);
  const animRef = useRef<number>(0);

  // Animated count-up on mount
  useEffect(() => {
    const duration = 1000;
    const start = Date.now();
    const startVal = 0;
    const endVal = balance;

    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayBalance(startVal + (endVal - startVal) * eased);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [balance]);

  const isPositive = balance >= 0;
  const trendValue = statistics.totalIncome > 0
    ? ((balance / statistics.totalIncome) * 100).toFixed(1)
    : '0.0';

  const cardStyle: React.CSSProperties = {
    borderRadius: '20px',
    padding: '28px',
    background: 'linear-gradient(135deg, #6366F1 0%, #3B82F6 50%, #06B6D4 100%)',
    boxShadow: '0 20px 60px rgba(99,102,241,0.4)',
    position: 'relative',
    overflow: 'hidden',
    color: '#fff',
  };

  return (
    <div style={cardStyle}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', right: '80px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <p style={{ margin: '0 0 8px', fontSize: '13px', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Balance Total
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, opacity: 0.9, alignSelf: 'center' }}>
            {getCurrencySymbol()}
          </span>
          <span style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1 }}>
            {Math.abs(displayBalance).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', background: isPositive ? 'rgba(255,255,255,0.2)' : 'rgba(255,100,100,0.3)', borderRadius: '999px', padding: '2px 10px' }}>
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style={{ transform: isPositive ? 'none' : 'rotate(180deg)' }}>
              <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
            </svg>
            <span style={{ fontSize: '12px', fontWeight: 700 }}>{trendValue}%</span>
          </div>
        </div>

        {/* Income / Expenses row */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '11px', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ingresos</p>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{formatAmount(statistics.totalIncome)}</p>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '11px', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Gastos</p>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{formatAmount(statistics.totalExpenses)}</p>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <div>
            <p style={{ margin: '0 0 3px', fontSize: '11px', opacity: 0.7, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Score</p>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{statistics.financialScore}/100</p>
          </div>
        </div>
      </div>
    </div>
  );
});
