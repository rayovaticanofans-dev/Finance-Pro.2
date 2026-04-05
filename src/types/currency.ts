export type Currency =
  | 'USD'
  | 'EUR'
  | 'ARS'
  | 'MXN'
  | 'COP'
  | 'CLP'
  | 'BRL'
  | 'PEN'
  | 'GBP'
  | 'JPY';

export interface CurrencyInfo {
  symbol: string;
  name: string;
  fx: number;
  locale: string;
  decimals: number;
}

export type CurrencyMap = Record<Currency, CurrencyInfo>;

export type ExchangeRates = Record<Currency, number>;
