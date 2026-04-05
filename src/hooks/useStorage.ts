import { useCallback, useState } from 'react';

interface StorageOptions<T> {
  serialize?: (v: T) => string;
  deserialize?: (s: string) => T;
  version?: number;
}

interface VersionedStorage<T> {
  version: number;
  data: T;
}

export function useStorage<T>(
  key: string,
  defaultValue: T,
  options: StorageOptions<T> = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse as (s: string) => T,
    version = 1,
  } = options;

  const readFromStorage = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;

      if (version > 1) {
        const wrapped = JSON.parse(raw) as VersionedStorage<T>;
        if (wrapped.version !== version) return defaultValue;
        return wrapped.data;
      }

      return deserialize(raw);
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue, deserialize, version]);

  const [storedValue, setStoredValue] = useState<T>(readFromStorage);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        try {
          if (version > 1) {
            const wrapped: VersionedStorage<T> = { version, data: next };
            localStorage.setItem(key, JSON.stringify(wrapped));
          } else {
            localStorage.setItem(key, serialize(next));
          }
        } catch {
          // Quota exceeded or unavailable
        }
        return next;
      });
    },
    [key, serialize, version]
  );

  const removeValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Unavailable
    }
    setStoredValue(defaultValue);
  }, [key, defaultValue]);

  return [storedValue, setValue, removeValue];
}
