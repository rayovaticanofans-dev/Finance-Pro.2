import { useCallback } from 'react';
import { useProfiles as useProfilesContext } from '@/contexts/ProfilesContext';

const PROFILE_COLORS = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#14B8A6',
  '#F97316',
];

export function useProfiles() {
  const ctx = useProfilesContext();

  const profileColor = useCallback(
    (id: string): string => {
      const profile = ctx.profiles.find((p) => p.id === id);
      if (profile?.color) return profile.color;
      // Derive a consistent color from the id
      const index = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return PROFILE_COLORS[index % PROFILE_COLORS.length];
    },
    [ctx.profiles]
  );

  return {
    ...ctx,
    profileColor,
  };
}
