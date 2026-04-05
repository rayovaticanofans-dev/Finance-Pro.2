import type { Currency } from './currency';

export type TransactionType = 'income' | 'expense';

export type RecurringType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface SplitTransaction {
  id: string;
  category: string;
  amount: number;
  currency: Currency;
  note?: string;
}

export interface Item {
  id: string;
  desc: string;
  amount: number;
  type: TransactionType;
  currency: Currency;
  category: string;
  date: string;
  note?: string;
  tags?: string[];
  recurring: RecurringType;
  split?: SplitTransaction[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DateRange {
  start: string;
  end: string;
  label?: string;
}

export interface TransactionFilter {
  dateRange?: DateRange;
  categories?: string[];
  types?: TransactionType[];
  amountMin?: number;
  amountMax?: number;
  tags?: string[];
  search?: string;
  recurring?: RecurringType[];
}

export interface TransactionSort {
  field: 'date' | 'amount' | 'category' | 'desc';
  direction: 'asc' | 'desc';
}

export interface FinanceState {
  items: Item[];
  filter: TransactionFilter;
  sort: TransactionSort;
  isLoading: boolean;
}

export type FinanceAction =
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'UPDATE_ITEM'; payload: Item }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'SET_FILTER'; payload: TransactionFilter }
  | { type: 'SET_SORT'; payload: TransactionSort }
  | { type: 'IMPORT_DATA'; payload: Item[] }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_LOADING'; payload: boolean };
