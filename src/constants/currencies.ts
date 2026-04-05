import type { CurrencyMap } from '@/types/currency';

export const CURRENCIES: CurrencyMap = {
  USD: {
    symbol: '$',
    name: 'US Dollar',
    fx: 1,
    locale: 'en-US',
    decimals: 2,
  },
  EUR: {
    symbol: '€',
    name: 'Euro',
    fx: 0.92,
    locale: 'de-DE',
    decimals: 2,
  },
  ARS: {
    symbol: '$',
    name: 'Peso Argentino',
    fx: 850,
    locale: 'es-AR',
    decimals: 2,
  },
  MXN: {
    symbol: '$',
    name: 'Peso Mexicano',
    fx: 17.15,
    locale: 'es-MX',
    decimals: 2,
  },
  COP: {
    symbol: '$',
    name: 'Peso Colombiano',
    fx: 3950,
    locale: 'es-CO',
    decimals: 0,
  },
  CLP: {
    symbol: '$',
    name: 'Peso Chileno',
    fx: 910,
    locale: 'es-CL',
    decimals: 0,
  },
  BRL: {
    symbol: 'R$',
    name: 'Real Brasileño',
    fx: 4.97,
    locale: 'pt-BR',
    decimals: 2,
  },
  PEN: {
    symbol: 'S/',
    name: 'Sol Peruano',
    fx: 3.73,
    locale: 'es-PE',
    decimals: 2,
  },
  GBP: {
    symbol: '£',
    name: 'Pound Sterling',
    fx: 0.79,
    locale: 'en-GB',
    decimals: 2,
  },
  JPY: {
    symbol: '¥',
    name: 'Japanese Yen',
    fx: 149.5,
    locale: 'ja-JP',
    decimals: 0,
  },
};
