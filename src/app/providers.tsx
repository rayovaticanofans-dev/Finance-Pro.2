import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ProfilesProvider } from '@/contexts/ProfilesContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { ModalProvider } from '@/contexts/ModalContext';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps): React.ReactElement {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ProfilesProvider>
          <CurrencyProvider>
            <FinanceProvider>
              <NotificationProvider>
                <SearchProvider>
                  <ModalProvider>
                    {children}
                  </ModalProvider>
                </SearchProvider>
              </NotificationProvider>
            </FinanceProvider>
          </CurrencyProvider>
        </ProfilesProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
