import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/hooks/useFinance';
import { useCurrency } from '@/hooks/useCurrency';
import { formatDate } from '@/utils/formatters';
import { EmptyState } from '@/components/ui/EmptyState';

export const RecentTransactions = React.memo(function RecentTransactions() {
  const { isDark } = useTheme();
  const { items } = useFinance();
  const { formatAmount } = useCurrency();
  const navigate = useNavigate();

  const recent = items.slice(0, 10);

  const containerStyle: React.CSSProperties = {
    borderRadius: '16px',
    background: isDark ? '#1E1E2E' : '#ffffff',
    boxShadow: isDark
      ? '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)'
      : '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 20px 16px',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
          Transacciones recientes
        </h3>
        <button
          onClick={() => navigate('/transactions')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            color: '#6366F1',
            padding: 0,
            fontFamily: 'inherit',
          }}
        >
          Ver todas →
        </button>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          title="Sin transacciones"
          description="Añade tu primera transacción para comenzar."
          ctaLabel="Nueva transacción"
          onCta={() => navigate('/transactions/new')}
        />
      ) : (
        <div>
          {recent.map((item, i) => (
            <div
              key={item.id}
              onClick={() => navigate(`/transactions/${item.id}`)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 20px',
                borderBottom: i < recent.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/transactions/${item.id}`); }}
              aria-label={`${item.desc}, ${formatAmount(item.amount)}`}
            >
              {/* Category emoji */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: item.type === 'income'
                    ? 'rgba(34,197,94,0.12)'
                    : 'rgba(239,68,68,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                {item.category ? item.category.split('-')[0] === 'food' ? '🍔'
                  : item.category.startsWith('transport') ? '🚗'
                  : item.category.startsWith('housing') ? '🏠'
                  : item.category.startsWith('entertainment') ? '🎬'
                  : item.category.startsWith('health') ? '💊'
                  : item.type === 'income' ? '💰' : '💳'
                  : item.type === 'income' ? '💰' : '💳'}
              </div>

              {/* Description & date */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.desc}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF' }}>
                  {formatDate(item.date, 'relative')}
                </p>
              </div>

              {/* Amount */}
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: item.type === 'income' ? '#22C55E' : '#EF4444',
                  flexShrink: 0,
                }}
              >
                {item.type === 'income' ? '+' : '-'}{formatAmount(item.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
