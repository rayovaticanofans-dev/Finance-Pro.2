import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ProfilesProvider } from '@/contexts/ProfilesContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { ModalProvider } from '@/contexts/ModalContext';
import React from 'react';

function InnerWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider items={[]}>
      <ModalProvider>{children}</ModalProvider>
    </SearchProvider>
  );
}

function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MemoryRouter>
      <ThemeProvider>
        <SettingsProvider>
          <ProfilesProvider>
            <CurrencyProvider>
              <FinanceProvider>
                <NotificationProvider>
                  <InnerWrapper>{children}</InnerWrapper>
                </NotificationProvider>
              </FinanceProvider>
            </CurrencyProvider>
          </ProfilesProvider>
        </SettingsProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('DashboardPage', () => {
  it('renders the balance hero card', () => {
    render(<DashboardPage />, { wrapper: TestWrapper });
    expect(screen.getByText('Balance Total')).toBeInTheDocument();
  });

  it('renders income section label', () => {
    render(<DashboardPage />, { wrapper: TestWrapper });
    expect(screen.getByText('Ingresos del mes')).toBeInTheDocument();
  });

  it('renders expenses section label', () => {
    render(<DashboardPage />, { wrapper: TestWrapper });
    expect(screen.getByText('Gastos del mes')).toBeInTheDocument();
  });

  it('renders the pro upgrade banner when not pro', () => {
    render(<DashboardPage />, { wrapper: TestWrapper });
    expect(screen.getByText(/Actualiza a Finance Pro/i)).toBeInTheDocument();
  });

  it('renders a time-based greeting', () => {
    render(<DashboardPage />, { wrapper: TestWrapper });
    const greeting = screen.getByText(/Buenos (días|tardes|noches)/i);
    expect(greeting).toBeInTheDocument();
  });
});
