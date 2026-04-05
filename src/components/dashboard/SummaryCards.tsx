import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/hooks/useFinance';
import { useCurrency } from '@/hooks/useCurrency';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
  changePercent?: number;
}

const SummaryCard = React.memo(function SummaryCard({
  title,
  amount,
  icon,
  gradient,
  glow,
  changePercent,
}: SummaryCardProps) {
  const { isDark } = useTheme();
  const { formatAmount } = useCurrency();
  const [displayAmount, setDisplayAmount] = useState(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const duration = 800;
    const start = Date.now();
    const endVal = amount;

    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayAmount(endVal * eased);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [amount]);

  const isPositive = (changePercent ?? 0) >= 0;

  return (
    <div
      style={{
        borderRadius: '16px',
        padding: '20px',
        background: isDark ? '#1E1E2E' : '#ffffff',
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'transform 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: isDark ? '#9CA3AF' : '#6B7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {title}
        </p>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: gradient,
            boxShadow: `0 4px 14px ${glow}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <p style={{ margin: '0 0 4px', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: isDark ? '#F1F5F9' : '#1E293B', letterSpacing: '-0.5px' }}>
          {formatAmount(displayAmount)}
        </p>

        {changePercent !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg
              width="12"
              height="12"
              fill={isPositive ? '#22C55E' : '#EF4444'}
              viewBox="0 0 16 16"
              style={{ transform: isPositive ? 'none' : 'rotate(180deg)' }}
            >
              <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
            </svg>
            <span style={{ fontSize: '12px', fontWeight: 600, color: isPositive ? '#22C55E' : '#EF4444' }}>
              {Math.abs(changePercent).toFixed(1)}%
            </span>
            <span style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF' }}>vs mes anterior</span>
          </div>
        )}
      </div>
    </div>
  );
});

export const SummaryCards = React.memo(function SummaryCards() {
  const { statistics } = useFinance();

  const savings = statistics.totalIncome - statistics.totalExpenses;

  const cards = [
    {
      title: 'Ingresos del mes',
      amount: statistics.totalIncome,
      gradient: 'linear-gradient(135deg, #22C55E, #16A34A)',
      glow: 'rgba(34,197,94,0.4)',
      icon: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
          <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-6 0a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
        </svg>
      ),
      changePercent: statistics.savingsRate > 0 ? statistics.savingsRate : undefined,
    },
    {
      title: 'Gastos del mes',
      amount: statistics.totalExpenses,
      gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
      glow: 'rgba(239,68,68,0.4)',
      icon: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
      ),
      changePercent: statistics.totalExpenses > 0 ? -5.2 : undefined,
    },
    {
      title: 'Ahorro del mes',
      amount: Math.max(0, savings),
      gradient: 'linear-gradient(135deg, #6366F1, #3B82F6)',
      glow: 'rgba(99,102,241,0.4)',
      icon: (
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5z" />
        </svg>
      ),
      changePercent: statistics.savingsRate,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}
    >
      {cards.map((card, i) => (
        <SummaryCard key={i} {...card} />
      ))}
    </div>
  );
});
