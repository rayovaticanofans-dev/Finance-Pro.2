import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSettings } from '@/contexts/SettingsContext';

interface NotifToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function NotifToggle({ label, description, checked, onChange }: NotifToggleProps) {
  const { isDark } = useTheme();

  const trackStyle: React.CSSProperties = {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    background: checked ? '#3B82F6' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.2s',
    flexShrink: 0,
    border: 'none',
  };

  const thumbStyle: React.CSSProperties = {
    position: 'absolute',
    top: '3px',
    left: checked ? '23px' : '3px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#fff',
    transition: 'left 0.2s',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        gap: '16px',
      }}
    >
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#F1F5F9' : '#1E293B' }}>
          {label}
        </div>
        {description && (
          <div style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF', marginTop: '2px' }}>
            {description}
          </div>
        )}
      </div>
      <button
        style={trackStyle}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <div style={thumbStyle} />
      </button>
    </div>
  );
}

export function NotificationPrefs() {
  const { settings, updateSettings } = useSettings();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <NotifToggle
        label="Alertas de presupuesto"
        description="Notificaciones cuando superas un límite"
        checked={settings.notifications}
        onChange={(val) => updateSettings({ notifications: val })}
      />
      <NotifToggle
        label="Recordatorio de metas"
        description="Recordatorios para contribuir a tus metas"
        checked={settings.notifications}
        onChange={(val) => updateSettings({ notifications: val })}
      />
      <NotifToggle
        label="Resumen semanal"
        description="Recibe un resumen de tus finanzas cada semana"
        checked={settings.notifications}
        onChange={(val) => updateSettings({ notifications: val })}
      />
      <NotifToggle
        label="Transacciones recurrentes"
        description="Recordatorios de pagos periódicos"
        checked={settings.notifications}
        onChange={(val) => updateSettings({ notifications: val })}
      />
    </div>
  );
}
