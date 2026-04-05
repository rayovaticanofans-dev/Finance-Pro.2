import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { BalanceCard } from './BalanceCard';
import { SummaryCards } from './SummaryCards';
import { RecentTransactions } from './RecentTransactions';
import { QuickActions } from './QuickActions';
import { SpendingChart } from './SpendingChart';
import { MonthlyTrendChart } from './MonthlyTrendChart';
import { usePro } from '@/hooks/usePro';
import { UpgradeModal } from '@/components/ui/UpgradeModal';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export function DashboardPage() {
  const { isDark } = useTheme();
  const { isPro } = usePro();
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Pro upgrade banner */}
      {!isPro && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '12px 18px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(59,130,246,0.15))',
            border: `1px solid ${isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.2)'}`,
            flexWrap: 'wrap',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px', color: isDark ? '#CBD5E1' : '#374151', fontWeight: 500 }}>
            🚀 Actualiza a Finance Pro — desbloquea análisis IA, reportes PDF y mucho más
          </p>
          <button
            onClick={() => setShowUpgrade(true)}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Actualizar
          </button>
        </div>
      )}

      {/* Page title with greeting */}
      <div>
        <h1
          style={{
            margin: '0 0 4px',
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 800,
            color: isDark ? '#F1F5F9' : '#1E293B',
            letterSpacing: '-0.5px',
          }}
        >
          {getGreeting()} 👋
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: isDark ? '#64748B' : '#6B7280' }}>
          Dashboard · Resumen financiero general
        </p>
      </div>

      {/* Balance hero card */}
      <BalanceCard />

      {/* Summary cards */}
      <SummaryCards />

      {/* Charts row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        <SpendingChart />
        <MonthlyTrendChart />
      </div>

      {/* Bottom row: transactions + quick actions */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        <RecentTransactions />
        <QuickActions />
      </div>

      <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
