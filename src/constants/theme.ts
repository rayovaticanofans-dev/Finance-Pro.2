export interface ThemePalette {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderFocus: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export const LIGHT_THEME: ThemePalette = {
  primary: '#3B82F6',
  primaryHover: '#2563EB',
  secondary: '#6366F1',
  accent: '#8B5CF6',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  border: '#E2E8F0',
  borderFocus: '#3B82F6',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',
};

export const DARK_THEME: ThemePalette = {
  primary: '#60A5FA',
  primaryHover: '#3B82F6',
  secondary: '#818CF8',
  accent: '#A78BFA',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceHover: '#334155',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  border: '#334155',
  borderFocus: '#60A5FA',
  success: '#4ADE80',
  warning: '#FCD34D',
  error: '#F87171',
  info: '#38BDF8',
};
