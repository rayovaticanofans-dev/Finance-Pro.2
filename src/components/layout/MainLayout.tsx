import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export function MainLayout() {
  const { isDark } = useTheme();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const SIDEBAR_FULL = 240;
  const SIDEBAR_MINI = 68;
  const sidebarWidth = sidebarCollapsed ? SIDEBAR_MINI : SIDEBAR_FULL;

  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: isDark
      ? 'linear-gradient(135deg, #0F0F1A 0%, #12121F 100%)'
      : 'linear-gradient(135deg, #F0F4FF 0%, #F8FAFC 100%)',
    color: isDark ? '#F1F5F9' : '#1E293B',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const bodyStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    paddingTop: '64px', // header height
  };

  const sidebarWrapStyle: React.CSSProperties = {
    width: `${sidebarWidth}px`,
    flexShrink: 0,
    position: 'fixed',
    top: '64px',
    left: 0,
    bottom: 0,
    transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
    zIndex: 100,
    display: isDesktop ? 'block' : 'none',
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    marginLeft: isDesktop ? `${sidebarWidth}px` : 0,
    marginBottom: isDesktop ? 0 : '64px',
    transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
  };

  const innerStyle: React.CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: isDesktop ? '24px 28px' : '16px',
    minHeight: 'calc(100vh - 64px)',
  };

  return (
    <div style={layoutStyle}>
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((p) => !p)}
      />
      <div style={bodyStyle}>
        {isDesktop && (
          <div style={sidebarWrapStyle}>
            <Sidebar
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
            />
          </div>
        )}
        <main style={mainStyle}>
          <div style={innerStyle}>
            <Outlet />
          </div>
        </main>
      </div>
      {!isDesktop && <BottomNav />}
    </div>
  );
}
