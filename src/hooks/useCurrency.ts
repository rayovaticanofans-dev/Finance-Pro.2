import { useCallback } from 'react';
import { useCurrencyContext } from '@/contexts/CurrencyContext';
import type { Currency } from '@/types/currency';
import { CURRENCIES } from '@/constants/currencies';

export function useCurrency() {
  const ctx = useCurrencyContext();

  const formatAmount = useCallback(
    (amount: number, currency?: Currency): string => {
      const target = currency ?? ctx.currency;
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
    [ctx.currency]
  );

  const convertToActive = useCallback(
    (amount: number, from: Currency): number => {
      return ctx.convert(amount, from, ctx.currency);
    },
    [ctx.convert, ctx.currency]
  );

  const getCurrencySymbol = useCallback(
    (currency?: Currency): string => {
      return CURRENCIES[currency ?? ctx.currency].symbol;
    },
    [ctx.currency]
  );

  return {
    ...ctx,
    formatAmount,
    convertToActive,
    getCurrencySymbol,
  };
}
