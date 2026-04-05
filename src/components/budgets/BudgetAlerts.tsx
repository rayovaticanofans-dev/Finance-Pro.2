import { useTheme } from '@/contexts/ThemeContext';
import type { BudgetAlert } from '@/types/budget';

interface BudgetAlertsProps {
  alerts: BudgetAlert[];
  onDismiss?: (budgetId: string) => void;
}

export function BudgetAlerts({ alerts, onDismiss }: BudgetAlertsProps) {
  const { isDark } = useTheme();

  if (alerts.length === 0) return null;

  const getAlertColors = (type: BudgetAlert['type']) =>
    type === 'exceeded'
      ? { bg: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.4)', color: '#EF4444', icon: '🚨' }
      : { bg: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.4)', color: '#F59E0B', icon: '⚠️' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {alerts.map((alert) => {
        const colors = getAlertColors(alert.type);
        return (
          <div
            key={alert.budgetId}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: colors.bg,
              border: `1px solid ${colors.border}`,
            }}
          >
            <span style={{ fontSize: '18px' }}>{colors.icon}</span>
            <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: colors.color }}>
              {alert.message}
            </span>
            {onDismiss && (
              <button
                onClick={() => onDismiss(alert.budgetId)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: colors.color,
                  fontSize: '16px',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  opacity: 0.7,
                  fontFamily: 'inherit',
                }}
                aria-label="Descartar alerta"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
