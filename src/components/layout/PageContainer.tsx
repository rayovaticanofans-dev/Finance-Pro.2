import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export interface Breadcrumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface PageContainerProps {
  title?: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageContainer({
  title,
  subtitle,
  breadcrumbs,
  actions,
  children,
}: PageContainerProps) {
  const { isDark } = useTheme();

  const breadcrumbStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  };

  const breadcrumbItemStyle = (isLast: boolean): React.CSSProperties => ({
    fontSize: '13px',
    color: isLast ? isDark ? '#CBD5E1' : '#374151' : isDark ? '#6B7280' : '#9CA3AF',
    fontWeight: isLast ? 600 : 400,
    cursor: isLast ? 'default' : 'pointer',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'inherit',
    transition: 'color 0.15s ease',
  });

  const separatorStyle: React.CSSProperties = {
    color: isDark ? '#4B5563' : '#D1D5DB',
    fontSize: '12px',
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header area */}
      {(title || breadcrumbs || actions) && (
        <div
          style={{
            marginBottom: '24px',
          }}
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Ruta de navegación" style={breadcrumbStyle}>
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={i}>
                    {i > 0 && <span style={separatorStyle} aria-hidden="true">/</span>}
                    {crumb.href || crumb.onClick ? (
                      <button
                        style={breadcrumbItemStyle(isLast)}
                        onClick={crumb.onClick}
                        aria-current={isLast ? 'page' : undefined}
                      >
                        {crumb.label}
                      </button>
                    ) : (
                      <span
                        style={breadcrumbItemStyle(isLast)}
                        aria-current={isLast ? 'page' : undefined}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              {title && (
                <h1
                  style={{
                    margin: '0 0 4px',
                    fontSize: 'clamp(22px, 3vw, 28px)',
                    fontWeight: 800,
                    color: isDark ? '#F1F5F9' : '#1E293B',
                    letterSpacing: '-0.5px',
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </h1>
              )}
              {subtitle && (
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    color: isDark ? '#64748B' : '#6B7280',
                    lineHeight: 1.5,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Page content */}
      {children}
    </div>
  );
}
