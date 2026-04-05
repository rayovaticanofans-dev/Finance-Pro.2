import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Profile } from '@/types/profile';
import { generateId } from '@/utils/id';

interface ProfilesContextValue {
  profiles: Profile[];
  activeProfile: Profile;
  activeProfileId: string;
  addProfile: (name: string, color?: string) => Profile;
  removeProfile: (id: string) => void;
  updateProfile: (profile: Profile) => void;
  setActiveProfile: (id: string) => void;
}

const ProfilesContext = createContext<ProfilesContextValue | null>(null);

const PROFILES_KEY = 'fp-v3:profiles';
const ACTIVE_KEY = 'fp-v3:activeProfile';

const DEFAULT_PROFILE: Profile = {
  id: 'default',
  name: 'Personal',
  createdAt: new Date().toISOString(),
  color: '#3B82F6',
};

function loadProfiles(): Profile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as Profile[];
    }
  } catch {
    // localStorage not available
  }
  return [DEFAULT_PROFILE];
}

function loadActiveProfileId(profiles: Profile[]): string {
  try {
    const stored = localStorage.getItem(ACTIVE_KEY);
    if (stored && profiles.some((p) => p.id === stored)) return stored;
  } catch {
    // localStorage not available
  }
  return profiles[0]?.id ?? DEFAULT_PROFILE.id;
}

function saveProfiles(profiles: Profile[]): void {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch {
    // Quota exceeded
  }
}

function saveActiveProfileId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    // Quota exceeded
  }
}

export function ProfilesProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(loadProfiles);
  const [activeProfileId, setActiveProfileIdState] = useState<string>(() =>
    loadActiveProfileId(loadProfiles())
  );

  useEffect(() => {
    saveProfiles(profiles);
    // If active profile was removed, fallback to first
    if (!profiles.some((p) => p.id === activeProfileId) && profiles.length > 0) {
      setActiveProfileIdState(profiles[0].id);
    }
  }, [profiles, activeProfileId]);

  useEffect(() => {
    saveActiveProfileId(activeProfileId);
  }, [activeProfileId]);

  const addProfile = useCallback((name: string, color?: string): Profile => {
    const profile: Profile = {
      id: generateId(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      color: color ?? '#3B82F6',
    };
    setProfiles((prev) => [...prev, profile]);
    return profile;
  }, []);

  const removeProfile = useCallback((id: string) => {
    setProfiles((prev) => {
      if (prev.length <= 1) return prev; // Always keep at least one profile
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const updateProfile = useCallback((updated: Profile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  const setActiveProfile = useCallback((id: string) => {
    setActiveProfileIdState(id);
  }, []);

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) ?? profiles[0] ?? DEFAULT_PROFILE,
    [profiles, activeProfileId]
  );

  const value = useMemo<ProfilesContextValue>(
    () => ({
      profiles,
      activeProfile,
      activeProfileId: activeProfile.id,
      addProfile,
      removeProfile,
      updateProfile,
      setActiveProfile,
    }),
    [profiles, activeProfile, addProfile, removeProfile, updateProfile, setActiveProfile]
  );

  return <ProfilesContext.Provider value={value}>{children}</ProfilesContext.Provider>;
}

export function useProfiles(): ProfilesContextValue {
  const ctx = useContext(ProfilesContext);
  if (!ctx) throw new Error('useProfiles must be used within ProfilesProvider');
  return ctx;
}
