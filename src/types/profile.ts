import type { Currency } from './currency';

export interface Profile {
  id: string;
  name: string;
  createdAt: string;
  avatar?: string;
  color?: string;
}

export interface UserPreferences {
  currency: Currency;
  language: string;
  dateFormat: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}

export interface ProfileStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export interface ProfilesState {
  profiles: Profile[];
  activeProfileId: string;
}

export type ProfileAction =
  | { type: 'ADD_PROFILE'; payload: Profile }
  | { type: 'UPDATE_PROFILE'; payload: Profile }
  | { type: 'DELETE_PROFILE'; payload: string }
  | { type: 'SET_ACTIVE_PROFILE'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> };
