import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Currency } from '@/types/currency';
import { CURRENCIES } from '@/constants/currencies';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (amount: number, from: Currency, to: Currency) => number;
  formatAmount: (amount: number, currency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = 'fp-v3:currency';
const DEFAULT_CURRENCY: Currency = 'USD';

function loadCurrency(): Currency {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in CURRENCIES) return stored as Currency;
  } catch {
    // localStorage not available
  }
  return DEFAULT_CURRENCY;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(loadCurrency);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {
      // localStorage not available
    }
  }, [currency]);

  const setCurrency = useCallback((c: Currency) => setCurrencyState(c), []);

  const convert = useCallback(
    (amount: number, from: Currency, to: Currency): number => {
      if (from === to) return amount;
      const fromInfo = CURRENCIES[from];
      const toInfo = CURRENCIES[to];
      // Convert to USD first, then to target
      const usdAmount = amount / fromInfo.fx;
      return usdAmount * toInfo.fx;
    },
    []
  );

  const formatAmount = useCallback(
    (amount: number, curr?: Currency): string => {
      const target = curr ?? currency;
      const info = CURRENCIES[target];
      try {
        return new Intl.NumberFormat(info.locale, {
          style: 'currency',
          currency: target,
          minimumFractionDigits: info.decimals,
          maximumFractionDigits: info.decimals,
        }).format(amount);
      } catch {
        return `${info.symbol}${amount.toFixed(info.decimals)}`;
      }
    },
    [currency]
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({ currency, setCurrency, convert, formatAmount }),
    [currency, setCurrency, convert, formatAmount]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrencyContext(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrencyContext must be used within CurrencyProvider');
  return ctx;
}
