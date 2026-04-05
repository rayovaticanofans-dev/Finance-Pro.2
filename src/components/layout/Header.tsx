import React, { useCallback, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useProfiles } from '@/contexts/ProfilesContext';
import { useCurrency } from '@/hooks/useCurrency';
import { useNotifications } from '@/contexts/NotificationContext';

interface HeaderProps {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const { profiles, activeProfile, setActiveProfile } = useProfiles();
  const { currency, setCurrency } = useCurrency();
  const { notifications } = useNotifications();
  const [profileOpen, setProfileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.length;

  // Close dropdowns on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node))
        setCurrencyOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: '12px',
    background: isDark
      ? 'rgba(15,15,26,0.85)'
      : 'rgba(240,244,255,0.85)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
  };

  const iconButtonStyle = useCallback(
    (active = false): React.CSSProperties => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      border: 'none',
      background: active
        ? isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)'
        : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
      color: isDark ? '#9CA3AF' : '#6B7280',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    }),
    [isDark]
  );

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: isDark ? '#1E1E2E' : '#ffffff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'}`,
    borderRadius: '14px',
    boxShadow: isDark
      ? '0 20px 40px rgba(0,0,0,0.5)'
      : '0 20px 40px rgba(0,0,0,0.15)',
    zIndex: 300,
    minWidth: '180px',
    overflow: 'hidden',
    animation: 'fp-dropdown-in 0.15s ease',
  };

  const CURRENCY_OPTIONS = ['USD', 'EUR', 'ARS', 'MXN', 'COP', 'CLP', 'BRL', 'PEN', 'GBP', 'JPY'];

  return (
    <>
      <style>{`@keyframes fp-dropdown-in { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <header style={headerStyle} role="banner">
        {/* Hamburger / toggle */}
        <button
          style={iconButtonStyle()}
          onClick={onToggleSidebar}
          aria-label="Alternar menú lateral"
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
          </svg>
        </button>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="rgba(255,255,255,0.2)" />
              <path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span
            style={{
              fontSize: '17px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.3px',
            }}
          >
            FinancePro
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Currency selector */}
        <div ref={currencyRef} style={{ position: 'relative' }}>
          <button
            style={{
              ...iconButtonStyle(currencyOpen),
              width: 'auto',
              padding: '0 12px',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'inherit',
            }}
            onClick={() => setCurrencyOpen((p) => !p)}
            aria-label="Seleccionar moneda"
            aria-expanded={currencyOpen}
          >
            {currency}
          </button>
          {currencyOpen && (
            <div style={{ ...dropdownStyle, minWidth: '120px' }}>
              {CURRENCY_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCurrency(c as typeof currency); setCurrencyOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '9px 14px',
                    background: c === currency ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: c === currency ? 700 : 400,
                    color: c === currency ? '#6366F1' : isDark ? '#F1F5F9' : '#1E293B',
                    fontFamily: 'inherit',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          style={iconButtonStyle()}
          onClick={toggleTheme}
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDark ? (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
            </svg>
          )}
        </button>

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button style={iconButtonStyle()} aria-label={`${unreadCount} notificaciones`}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z" />
            </svg>
          </button>
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#EF4444',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                borderRadius: '999px',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
                border: `2px solid ${isDark ? '#0F0F1A' : '#F0F4FF'}`,
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>

        {/* Profile selector */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px 4px 6px',
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              color: isDark ? '#F1F5F9' : '#1E293B',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setProfileOpen((p) => !p)}
            aria-label="Seleccionar perfil"
            aria-expanded={profileOpen}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: activeProfile.color ?? '#6366F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {activeProfile.name.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeProfile.name}
            </span>
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style={{ opacity: 0.6 }}>
              <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
            </svg>
          </button>
          {profileOpen && (
            <div style={dropdownStyle}>
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setActiveProfile(p.id); setProfileOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 14px',
                    background: p.id === activeProfile.id
                      ? isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'
                      : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    color: isDark ? '#F1F5F9' : '#1E293B',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: p.color ?? '#6366F1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: p.id === activeProfile.id ? 700 : 400 }}>{p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
