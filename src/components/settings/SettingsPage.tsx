import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { CurrencySelector } from './CurrencySelector';
import { BackupRestore } from './BackupRestore';
import { ProfileSwitcher } from './ProfileSwitcher';
import { NotificationPrefs } from './NotificationPrefs';

type Section = 'apariencia' | 'moneda' | 'perfil' | 'datos' | 'notificaciones' | 'acerca';

const SECTIONS: { key: Section; label: string; icon: string }[] = [
  { key: 'apariencia', label: 'Apariencia', icon: '🎨' },
  { key: 'moneda', label: 'Moneda', icon: '💱' },
  { key: 'perfil', label: 'Perfiles', icon: '👤' },
  { key: 'datos', label: 'Datos', icon: '💾' },
  { key: 'notificaciones', label: 'Notificaciones', icon: '🔔' },
  { key: 'acerca', label: 'Acerca de', icon: 'ℹ️' },
];

export function SettingsPage() {
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<Section>('apariencia');

  const sectionBtnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'left',
    background: active
      ? (isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)')
      : 'transparent',
    color: active ? '#3B82F6' : (isDark ? '#CBD5E1' : '#374151'),
    transition: 'all 0.15s',
  });

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: '4px 0',
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: isDark ? '#F1F5F9' : '#1E293B',
    marginBottom: '20px',
  };

  const toggleTrack: React.CSSProperties = {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    background: isDark ? '#3B82F6' : 'rgba(0,0,0,0.2)',
    position: 'relative',
    cursor: 'pointer',
    border: 'none',
    transition: 'background 0.2s',
  };

  const toggleThumb: React.CSSProperties = {
    position: 'absolute',
    top: '3px',
    left: isDark ? '23px' : '3px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#fff',
    transition: 'left 0.2s',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
  };

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      {/* Sidebar navigation */}
      <div style={{ minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {SECTIONS.map((s) => (
          <button key={s.key} style={sectionBtnStyle(activeSection === s.key)} onClick={() => setActiveSection(s.key)}>
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      <div style={contentStyle}>
        {activeSection === 'apariencia' && (
          <div>
            <div style={sectionTitle}>Apariencia</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B' }}>Modo oscuro</div>
                <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF', marginTop: '2px' }}>Cambia el tema de la aplicación</div>
              </div>
              <button style={toggleTrack} onClick={toggleTheme} role="switch" aria-checked={isDark} aria-label="Modo oscuro">
                <div style={toggleThumb} />
              </button>
            </div>
          </div>
        )}

        {activeSection === 'moneda' && (
          <div>
            <div style={sectionTitle}>Moneda</div>
            <CurrencySelector />
          </div>
        )}

        {activeSection === 'perfil' && (
          <div>
            <div style={sectionTitle}>Perfiles</div>
            <ProfileSwitcher />
          </div>
        )}

        {activeSection === 'datos' && (
          <div>
            <div style={sectionTitle}>Datos</div>
            <BackupRestore />
          </div>
        )}

        {activeSection === 'notificaciones' && (
          <div>
            <div style={sectionTitle}>Notificaciones</div>
            <NotificationPrefs />
          </div>
        )}

        {activeSection === 'acerca' && (
          <div>
            <div style={sectionTitle}>Acerca de</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '20px', borderRadius: '16px', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: isDark ? '#F1F5F9' : '#1E293B' }}>FinancePro</div>
                <div style={{ fontSize: '14px', color: isDark ? '#6B7280' : '#9CA3AF', marginTop: '6px' }}>Versión 3.0.0</div>
                <div style={{ fontSize: '13px', color: isDark ? '#6B7280' : '#9CA3AF', marginTop: '4px' }}>Tu app de finanzas personales</div>
              </div>
              <div style={{ padding: '14px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', fontSize: '13px', color: isDark ? '#94A3B8' : '#6B7280', textAlign: 'center' }}>
                Hecho con ❤️ para ayudarte a gestionar tus finanzas
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
