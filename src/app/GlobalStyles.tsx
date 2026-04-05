import React, { useEffect } from 'react';

const CSS_CONTENT = `
  :root {
    --color-primary: #6366f1;
    --color-primary-dark: #4f46e5;
    --color-secondary: #8b5cf6;
    --color-accent: #06b6d4;
    --color-bg: #f8fafc;
    --color-bg-secondary: #f1f5f9;
    --color-surface: #ffffff;
    --color-surface-2: #f8fafc;
    --color-border: #e2e8f0;
    --color-text: #0f172a;
    --color-text-secondary: #64748b;
    --color-text-muted: #94a3b8;
    --color-success: #22c55e;
    --color-warning: #f59e0b;
    --color-error: #ef4444;
    --color-info: #3b82f6;
    --color-income: #22c55e;
    --color-expense: #ef4444;
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;
    --radius-sm: 6px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-full: 9999px;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
    --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
    --transition-fast: 150ms ease;
    --transition-normal: 250ms ease;
    --transition-slow: 400ms ease;
    --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    --z-base: 1;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-modal: 300;
    --z-toast: 400;
    --z-tooltip: 500;
  }
  html.dark {
    --color-bg: #0f172a;
    --color-bg-secondary: #1e293b;
    --color-surface: #1e293b;
    --color-surface-2: #334155;
    --color-border: #334155;
    --color-text: #f8fafc;
    --color-text-secondary: #94a3b8;
    --color-text-muted: #64748b;
  }
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: var(--font-sans);
    background-color: var(--color-bg);
    color: var(--color-text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    transition: background-color var(--transition-slow), color var(--transition-slow);
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  @keyframes progressFill { from { stroke-dashoffset: var(--dash-total); } to { stroke-dashoffset: var(--dash-offset); } }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }
  :focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  @media print {
    .no-print { display: none !important; }
    body { background: white; color: black; }
  }
`;

export function GlobalStyles(): null {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'finance-pro-global';
    style.textContent = CSS_CONTENT;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return null;
}
