import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useModal } from '@/contexts/ModalContext';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
  onClick: () => void;
}

export const QuickActions = React.memo(function QuickActions() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { openModal } = useModal();

  const actions: QuickAction[] = [
    {
      label: 'Nueva\nTransacción',
      gradient: 'linear-gradient(135deg, #6366F1, #3B82F6)',
      glow: 'rgba(99,102,241,0.4)',
      onClick: () => navigate('/transactions/new'),
      icon: (
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
      ),
    },
    {
      label: 'Escanear\nRecibo',
      gradient: 'linear-gradient(135deg, #A855F7, #7C3AED)',
      glow: 'rgba(168,85,247,0.4)',
      onClick: () => navigate('/scan'),
      icon: (
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
          <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z" />
        </svg>
      ),
    },
    {
      label: 'Ver\nReportes',
      gradient: 'linear-gradient(135deg, #22C55E, #16A34A)',
      glow: 'rgba(34,197,94,0.4)',
      onClick: () => navigate('/reports'),
      icon: (
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z" />
        </svg>
      ),
    },
    {
      label: 'Agregar\nMeta',
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
      glow: 'rgba(245,158,11,0.4)',
      onClick: () => openModal({ component: () => null, size: 'md' }),
      icon: (
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
          <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        borderRadius: '16px',
        padding: '20px',
        background: isDark ? '#1E1E2E' : '#ffffff',
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)'
          : '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
        Acciones rápidas
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px 12px',
              borderRadius: '14px',
              border: 'none',
              background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(-2px)';
              el.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.transform = 'translateY(0)';
              el.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';
            }}
            aria-label={action.label.replace(/\n/g, ' ')}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: action.gradient,
                boxShadow: `0 4px 12px ${action.glow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
              }}
            >
              {action.icon}
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: isDark ? '#CBD5E1' : '#374151',
                textAlign: 'center',
                lineHeight: 1.3,
                whiteSpace: 'pre-line',
              }}
            >
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});
