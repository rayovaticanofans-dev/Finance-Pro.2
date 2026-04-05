import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { useTheme } from '@/contexts/ThemeContext';
import { ProBadge } from '@/components/ui/ProBadge';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEATURES: Array<{ name: string; free: boolean; pro: boolean }> = [
  { name: 'Gráficos básicos', free: true, pro: true },
  { name: 'Análisis IA', free: false, pro: true },
  { name: 'Exportar PDF', free: false, pro: true },
  { name: 'Registros ilimitados', free: false, pro: true },
  { name: 'Filtros avanzados', free: false, pro: true },
];

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <svg width="18" height="18" fill="#22C55E" viewBox="0 0 16 16" aria-label="Incluido">
      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
    </svg>
  ) : (
    <svg width="18" height="18" fill="#EF4444" viewBox="0 0 16 16" aria-label="No incluido">
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const { isDark } = useTheme();

  const planHeaderStyle = (isPro: boolean): React.CSSProperties => ({
    textAlign: 'center',
    padding: '16px 12px',
    borderRadius: '10px',
    background: isPro
      ? 'linear-gradient(135deg, #6366F1, #3B82F6)'
      : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    color: isPro ? '#fff' : isDark ? '#CBD5E1' : '#374151',
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Actualiza tu plan" size="md">
      {/* Hero section */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🚀</div>
        <h3 style={{
          margin: '0 0 8px',
          fontSize: '22px',
          fontWeight: 800,
          color: isDark ? '#F1F5F9' : '#1E293B',
        }}>
          Desbloquea Finance Pro
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: isDark ? '#9CA3AF' : '#6B7280' }}>
          Lleva tus finanzas al siguiente nivel con análisis IA, reportes PDF y mucho más.
        </p>
      </div>

      {/* Plan comparison table */}
      <div style={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        marginBottom: '20px',
      }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' }}>
          <div style={{ padding: '12px', fontSize: '13px', fontWeight: 600, color: isDark ? '#9CA3AF' : '#6B7280' }}>
            Funcionalidad
          </div>
          <div style={planHeaderStyle(false)}>
            <div style={{ fontSize: '13px', fontWeight: 700 }}>Gratis</div>
          </div>
          <div style={planHeaderStyle(true)}>
            <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <ProBadge /> Pro
            </div>
          </div>
        </div>

        {/* Feature rows */}
        {FEATURES.map((feature, i) => (
          <div
            key={feature.name}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              background: i % 2 === 0
                ? 'transparent'
                : isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
            }}
          >
            <div style={{ padding: '12px', fontSize: '13px', color: isDark ? '#CBD5E1' : '#374151', display: 'flex', alignItems: 'center' }}>
              {feature.name}
            </div>
            <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check ok={feature.free} />
            </div>
            <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Check ok={feature.pro} />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <button
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            fontFamily: 'inherit',
            transition: 'opacity 0.2s ease',
            marginBottom: '12px',
          }}
          onClick={onClose}
        >
          🚀 Actualizar a Pro
        </button>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: isDark ? '#6B7280' : '#9CA3AF',
            fontSize: '13px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
          onClick={onClose}
        >
          Continuar con la versión gratuita
        </button>
      </div>
    </Modal>
  );
}
