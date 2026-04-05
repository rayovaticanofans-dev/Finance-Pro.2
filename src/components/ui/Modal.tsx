import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '@/contexts/ThemeContext';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
  'aria-label'?: string;
}

const SIZE_MAP: Record<ModalSize, string> = {
  sm: '400px',
  md: '560px',
  lg: '720px',
  xl: '900px',
  full: '100vw',
};

export const Modal = React.memo(function Modal({
  isOpen,
  onClose,
  size = 'md',
  title,
  children,
  footer,
  closeOnBackdrop = true,
  'aria-label': ariaLabel,
}: ModalProps) {
  const { isDark } = useTheme();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = 'hidden';
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = '';
      }, 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && firstFocusRef.current) {
      firstFocusRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdrop && e.target === e.currentTarget) onClose();
    },
    [closeOnBackdrop, onClose]
  );

  if (!mounted) return null;

  const isFull = size === 'full';

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: isFull ? 'flex-start' : 'center',
    justifyContent: 'center',
    padding: isFull ? 0 : '16px',
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.25s ease',
  };

  const dialogStyle: React.CSSProperties = {
    position: 'relative',
    width: isFull ? '100%' : '100%',
    maxWidth: SIZE_MAP[size],
    maxHeight: isFull ? '100vh' : '90vh',
    height: isFull ? '100vh' : undefined,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: isFull ? 0 : '16px',
    background: isDark
      ? 'linear-gradient(135deg, #1E1E2E 0%, #16213E 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    boxShadow: isDark
      ? '0 25px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)'
      : '0 25px 50px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)',
    transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
    transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
    flexShrink: 0,
  };

  const bodyStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  };

  const footerStyle: React.CSSProperties = {
    padding: '16px 24px',
    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    flexShrink: 0,
  };

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: 'none',
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    color: isDark ? '#9CA3AF' : '#6B7280',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  };

  const modal = (
    <div role="presentation" style={backdropStyle} onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        style={dialogStyle}
      >
        {title !== undefined && (
          <div style={headerStyle}>
            <h2
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 700,
                color: isDark ? '#F1F5F9' : '#1E293B',
              }}
            >
              {title}
            </h2>
            <button
              ref={firstFocusRef}
              style={closeButtonStyle}
              onClick={onClose}
              aria-label="Cerrar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.854 4.354a.5.5 0 0 0-.707-.707L8 7.793 3.854 3.647a.5.5 0 1 0-.707.707L7.293 8.5l-4.146 4.146a.5.5 0 0 0 .707.708L8 9.207l4.146 4.147a.5.5 0 0 0 .708-.708L8.707 8.5l4.147-4.146z" />
              </svg>
            </button>
          </div>
        )}
        <div style={bodyStyle}>{children}</div>
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modal, document.body);
});
