import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNotifications } from '@/contexts/NotificationContext';
import type { Notification, NotificationType } from '@/contexts/NotificationContext';
import { useTheme } from '@/contexts/ThemeContext';

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ReactNode; color: string; bg: string; border: string; progressColor: string }
> = {
  success: {
    color: '#16A34A',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)',
    progressColor: '#22C55E',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="9" fill="#22C55E" />
        <path d="M6 10l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  error: {
    color: '#DC2626',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    progressColor: '#EF4444',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="9" fill="#EF4444" />
        <path d="M7 7l6 6M13 7l-6 6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  warning: {
    color: '#B45309',
    bg: 'rgba(234,179,8,0.12)',
    border: 'rgba(234,179,8,0.35)',
    progressColor: '#F59E0B',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
        <path d="M10 2L2 17h16L10 2z" fill="#F59E0B" />
        <path d="M10 8v4M10 14v.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  info: {
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.3)',
    progressColor: '#6366F1',
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="9" fill="#6366F1" />
        <path d="M10 9v5M10 6.5v.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
};

function ToastItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = notification.duration ?? 5000;
  const startTimeRef = useRef<number>(Date.now());
  const frameRef = useRef<number>(0);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    if (duration <= 0) return;
    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining > 0) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [duration]);

  const cfg = TYPE_CONFIG[notification.type];

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => onDismiss(notification.id), 300);
  };

  return (
    <div
      style={{
        position: 'relative',
        background: isDark ? '#1E1E2E' : '#ffffff',
        border: `1px solid ${isDark ? cfg.border.replace('0.3', '0.4') : cfg.border}`,
        borderRadius: '14px',
        padding: '14px 14px 16px 14px',
        boxShadow: isDark
          ? '0 10px 30px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)'
          : '0 10px 30px rgba(0,0,0,0.15)',
        minWidth: '300px',
        maxWidth: '380px',
        overflow: 'hidden',
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        marginBottom: '8px',
      }}
      role="alert"
      aria-live="polite"
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, marginTop: '1px' }}>{cfg.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B', lineHeight: 1.4 }}>
            {notification.title}
          </p>
          {notification.message && (
            <p style={{ margin: '3px 0 0', fontSize: '13px', color: isDark ? '#94A3B8' : '#6B7280', lineHeight: 1.5 }}>
              {notification.message}
            </p>
          )}
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Cerrar notificación"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDark ? '#6B7280' : '#9CA3AF',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            width: `${progress}%`,
            background: cfg.progressColor,
            borderRadius: '0 0 0 14px',
            transition: 'width 0.1s linear',
          }}
        />
      )}
    </div>
  );
}

export function Toast() {
  const { notifications, removeNotification } = useNotifications();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const visible = notifications.slice(-5); // max 5 toasts

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 99999,
    bottom: '24px',
    right: isMobile ? undefined : '24px',
    left: isMobile ? '50%' : undefined,
    transform: isMobile ? 'translateX(-50%)' : undefined,
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: isMobile ? 'center' : 'flex-end',
    pointerEvents: 'none',
  };

  return ReactDOM.createPortal(
    <div style={containerStyle} aria-live="polite" aria-label="Notificaciones">
      {visible.map((n) => (
        <div key={n.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem notification={n} onDismiss={removeNotification} />
        </div>
      ))}
    </div>,
    document.body
  );
}
