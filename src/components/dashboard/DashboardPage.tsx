import { useTheme } from '@/contexts/ThemeContext';
import { BalanceCard } from './BalanceCard';
import { SummaryCards } from './SummaryCards';
import { RecentTransactions } from './RecentTransactions';
import { QuickActions } from './QuickActions';
import { SpendingChart } from './SpendingChart';
import { MonthlyTrendChart } from './MonthlyTrendChart';

export function DashboardPage() {
  const { isDark } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Page title */}
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
          Dashboard
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: isDark ? '#64748B' : '#6B7280' }}>
          Resumen financiero general
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
    </div>
  );
}
