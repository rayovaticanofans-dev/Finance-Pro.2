import React, { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/hooks/useFinance';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import { aiService } from '@/services/ai.service';
import { PageContainer } from '@/components/layout/PageContainer';
import { filterItems, getDateRange } from '@/utils/filters';
import { getTotalExpenses } from '@/utils/calculations';
import type { SpendingPattern } from '@/services/ai.service';

export default function AIPage() {
  const { isDark } = useTheme();
  const { items } = useFinance();
  const { formatAmount } = useCurrencyContext();

  const monthItems = useMemo(() => {
    const range = getDateRange('month');
    return filterItems(items, { dateRange: range });
  }, [items]);

  const score = useMemo(() => aiService.calculateFinancialScore(items), [items]);
  const patterns = useMemo(() => aiService.detectPatterns(items), [items]);
  const tips = useMemo(() => aiService.getFinancialTips(items), [items]);

  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const totalExpensesThisMonth = getTotalExpenses(monthItems);
  const projectedMonthlyExpense =
    dayOfMonth > 0 ? (totalExpensesThisMonth / dayOfMonth) * daysInMonth : 0;

  const alerts = useMemo(() => {
    const allPatterns = aiService.detectPatterns(items);
    const monthPatterns = aiService.detectPatterns(monthItems);
    return monthPatterns.filter((mp) => {
      const allP = allPatterns.find((p) => p.category === mp.category);
      if (!allP || allP.avgAmount === 0) return false;
      return mp.avgAmount > allP.avgAmount * 1.5;
    });
  }, [items, monthItems]);

  const scoreColor =
    score.total >= 70 ? '#22C55E' : score.total >= 40 ? '#F59E0B' : '#EF4444';
  const scoreGradient =
    score.total >= 70
      ? 'linear-gradient(135deg, #22C55E, #16A34A)'
      : score.total >= 40
      ? 'linear-gradient(135deg, #F59E0B, #D97706)'
      : 'linear-gradient(135deg, #EF4444, #DC2626)';
  const scoreLabel =
    score.total >= 70 ? 'Excelente' : score.total >= 40 ? 'Regular' : 'Necesita mejora';

  const cardStyle: React.CSSProperties = {
    background: isDark ? 'rgba(30,30,50,0.8)' : '#fff',
    borderRadius: '14px',
    padding: '24px',
    boxShadow: isDark
      ? '0 4px 20px rgba(0,0,0,0.3)'
      : '0 4px 20px rgba(0,0,0,0.08)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
  };

  const sectionTitleStyle: React.CSSProperties = {
    margin: '0 0 16px',
    fontSize: '16px',
    fontWeight: 700,
    color: isDark ? '#F1F5F9' : '#1E293B',
  };

  const trendIcon = (trend: SpendingPattern['trend']) => {
    if (trend === 'increasing') return '📈';
    if (trend === 'decreasing') return '📉';
    return '➡️';
  };

  const tipIcons = ['💡', '🎯', '📊', '💰', '🚀', '⚠️', '✅'];
  const circumference = 2 * Math.PI * 40; // r=40

  return (
    <PageContainer
      title="Análisis IA"
      subtitle="Insights financieros personalizados con inteligencia artificial"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Health Score + Projection row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {/* Financial Health Score */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Puntaje Financiero</h2>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginBottom: '20px',
              }}
            >
              {/* Circular gauge */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="10"
                    strokeDasharray={`${(score.total / 100) * circumference} ${circumference}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dasharray 0.8s ease' }}
                  />
                  <text
                    x="50"
                    y="46"
                    textAnchor="middle"
                    fontSize="22"
                    fontWeight="800"
                    fill={scoreColor}
                  >
                    {score.total}
                  </text>
                  <text
                    x="50"
                    y="62"
                    textAnchor="middle"
                    fontSize="10"
                    fill={isDark ? '#9CA3AF' : '#6B7280'}
                  >
                    / 100
                  </text>
                </svg>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: scoreGradient,
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '12px',
                  }}
                >
                  {scoreLabel}
                </div>

                {[
                  { label: 'Ahorro', value: score.savingsRate, max: 40, color: '#6366F1' },
                  { label: 'Balance', value: score.consistency, max: 30, color: '#3B82F6' },
                  { label: 'Diversif.', value: score.diversification, max: 30, color: '#8B5CF6' },
                ].map(({ label, value, max, color }) => (
                  <div key={label} style={{ marginBottom: '8px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        marginBottom: '3px',
                        color: isDark ? '#9CA3AF' : '#6B7280',
                      }}
                    >
                      <span>{label}</span>
                      <span>
                        {value}/{max}
                      </span>
                    </div>
                    <div
                      style={{
                        height: '4px',
                        borderRadius: '2px',
                        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${(value / max) * 100}%`,
                          background: color,
                          borderRadius: '2px',
                          transition: 'width 0.8s ease',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown bullets */}
            <div
              style={{
                borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                paddingTop: '12px',
              }}
            >
              {score.breakdown.map((line, i) => (
                <p
                  key={i}
                  style={{
                    margin: '4px 0',
                    fontSize: '12px',
                    color: isDark ? '#9CA3AF' : '#6B7280',
                    lineHeight: 1.4,
                  }}
                >
                  • {line}
                </p>
              ))}
            </div>
          </div>

          {/* Monthly Projection */}
          <div style={cardStyle}>
            <h2 style={sectionTitleStyle}>Proyección Mensual</h2>

            <div
              style={{
                background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '16px',
              }}
            >
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: '13px',
                  color: isDark ? '#9CA3AF' : '#6B7280',
                }}
              >
                Gastos proyectados este mes
              </p>
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: isDark ? '#F1F5F9' : '#1E293B',
                  letterSpacing: '-0.5px',
                }}
              >
                {formatAmount(projectedMonthlyExpense)}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF' }}>
                Basado en el ritmo de gasto actual
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                {
                  label: 'Gastado',
                  value: formatAmount(totalExpensesThisMonth),
                  color: '#EF4444',
                },
                {
                  label: `Día ${dayOfMonth}/${daysInMonth}`,
                  value: `${Math.round((dayOfMonth / daysInMonth) * 100)}%`,
                  color: isDark ? '#F1F5F9' : '#1E293B',
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    borderRadius: '10px',
                    padding: '14px',
                    textAlign: 'center',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 4px',
                      fontSize: '11px',
                      color: isDark ? '#9CA3AF' : '#6B7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {label}
                  </p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Cards */}
        {alerts.length > 0 && (
          <div>
            <h2
              style={{
                ...sectionTitleStyle,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ⚠️ Alertas de Gasto
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '12px',
              }}
            >
              {alerts.map((alert) => (
                <div
                  key={alert.category}
                  style={{
                    ...cardStyle,
                    padding: '16px',
                    border: '1px solid rgba(239,68,68,0.3)',
                    background: isDark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.04)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#EF4444' }}>
                      Gasto elevado
                    </span>
                  </div>
                  <p
                    style={{
                      margin: '0 0 4px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isDark ? '#F1F5F9' : '#1E293B',
                    }}
                  >
                    {alert.category}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#9CA3AF' : '#6B7280' }}>
                    Promedio actual: {formatAmount(alert.avgAmount)}
                    <br />
                    Más del 50% sobre la media histórica
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spending Patterns */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Patrones de Gasto</h2>
          {patterns.length === 0 ? (
            <p
              style={{
                color: isDark ? '#9CA3AF' : '#6B7280',
                fontSize: '14px',
                textAlign: 'center',
                padding: '20px 0',
                margin: 0,
              }}
            >
              Registra más transacciones para ver patrones de gasto.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              {patterns.slice(0, 8).map((pattern) => (
                <div
                  key={pattern.category}
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: '13px',
                        fontWeight: 600,
                        color: isDark ? '#F1F5F9' : '#1E293B',
                        lineHeight: 1.3,
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {pattern.category}
                    </p>
                    <span style={{ fontSize: '18px', flexShrink: 0, marginLeft: '8px' }}>
                      {trendIcon(pattern.trend)}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: '0 0 4px',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#6366F1',
                    }}
                  >
                    {formatAmount(pattern.avgAmount)}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: isDark ? '#6B7280' : '#9CA3AF' }}>
                    {pattern.frequency} transacciones ·{' '}
                    {pattern.trend === 'increasing'
                      ? 'Aumentando'
                      : pattern.trend === 'decreasing'
                      ? 'Disminuyendo'
                      : 'Estable'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Financial Tips */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Recomendaciones Personalizadas</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '12px',
            }}
          >
            {tips.map((tip, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '12px',
                  background: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
                  borderRadius: '10px',
                  padding: '14px',
                  border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)'}`,
                }}
              >
                <span style={{ fontSize: '20px', flexShrink: 0 }}>
                  {tipIcons[i % tipIcons.length]}
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    color: isDark ? '#CBD5E1' : '#374151',
                    lineHeight: 1.5,
                  }}
                >
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
