import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

interface BottomTab {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const TABS: BottomTab[] = [
  {
    path: '/dashboard',
    label: 'Inicio',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5v-5h3v5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L8.354 1.146z" />
      </svg>
    ),
  },
  {
    path: '/transactions',
    label: 'Movimientos',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z" />
      </svg>
    ),
  },
  { path: '/transactions/new', label: '', icon: null }, // FAB placeholder
  {
    path: '/budgets',
    label: 'Presupuestos',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zM0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5zm3 1v7h4V6H3zm5 0v7h5V6H8z" />
      </svg>
    ),
  },
  {
    path: '/settings',
    label: 'Ajustes',
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.892 3.433-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.892-1.64-.901-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '64px',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    background: isDark ? 'rgba(15,15,26,0.95)' : 'rgba(240,244,255,0.95)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    height: '100%',
    textDecoration: 'none',
    color: isActive ? '#6366F1' : isDark ? '#6B7280' : '#9CA3AF',
    transition: 'color 0.2s ease',
    position: 'relative',
  });

  const labelStyle = (isActive: boolean): React.CSSProperties => ({
    fontSize: '10px',
    fontWeight: isActive ? 700 : 400,
    lineHeight: 1,
  });

  const activeDotStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '6px',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#6366F1',
  };

  const fabStyle: React.CSSProperties = {
    width: '52px',
    height: '52px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(99,102,241,0.5)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    flexShrink: 0,
    color: '#fff',
  };

  return (
    <nav style={containerStyle} aria-label="Navegación principal">
      {TABS.map((tab, i) => {
        if (i === 2) {
          // FAB center button
          return (
            <div key="fab" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button
                style={fabStyle}
                onClick={() => navigate('/transactions/new')}
                aria-label="Nueva transacción"
              >
                <svg width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                </svg>
              </button>
            </div>
          );
        }

        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            style={({ isActive }) => tabStyle(isActive)}
            aria-label={tab.label}
          >
            {({ isActive }) => (
              <>
                {tab.icon}
                <span style={labelStyle(isActive)}>{tab.label}</span>
                {isActive && <span style={activeDotStyle} aria-hidden="true" />}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
