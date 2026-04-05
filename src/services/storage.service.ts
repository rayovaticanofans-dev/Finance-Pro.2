const KEY_PREFIX = 'fp-v3';

function buildKey(key: string, profileId?: string): string {
  if (profileId) return `${KEY_PREFIX}:${profileId}:${key}`;
  return `${KEY_PREFIX}:${key}`;
}

class StorageService {
  get<T>(key: string, profileId?: string): T | null {
    try {
      const raw = localStorage.getItem(buildKey(key, profileId));
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T, profileId?: string): void {
    try {
      localStorage.setItem(buildKey(key, profileId), JSON.stringify(value));
    } catch {
      // Quota exceeded or unavailable
    }
  }

  remove(key: string, profileId?: string): void {
    try {
      localStorage.removeItem(buildKey(key, profileId));
    } catch {
      // Unavailable
    }
  }

  clear(profileId?: string): void {
    try {
      const prefix = profileId ? `${KEY_PREFIX}:${profileId}:` : `${KEY_PREFIX}:`;
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) keysToRemove.push(k);
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Unavailable
    }
  }

  getAllKeys(profileId?: string): string[] {
    const prefix = profileId ? `${KEY_PREFIX}:${profileId}:` : `${KEY_PREFIX}:`;
    const keys: string[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) {
          keys.push(k.slice(prefix.length));
        }
      }
    } catch {
      // Unavailable
    }
    return keys;
  }
}

export const storageService = new StorageService();
