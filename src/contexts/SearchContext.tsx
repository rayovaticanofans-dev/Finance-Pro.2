import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Item } from '@/types/finance';
import { searchItems } from '@/utils/filters';

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  results: Item[];
  history: string[];
  clearHistory: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

const HISTORY_KEY = 'fp-v3:searchHistory';
const MAX_HISTORY = 10;
const DEBOUNCE_MS = 300;

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    // localStorage not available
  }
  return [];
}

function saveHistory(history: string[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // Quota exceeded
  }
}

interface SearchProviderProps {
  children: React.ReactNode;
  items: Item[];
}

export function SearchProvider({ children, items }: SearchProviderProps) {
  const [query, setQueryState] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [history, setHistory] = useState<string[]>(loadHistory);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(q);
      if (q.trim().length >= 2) {
        setHistory((prev) => {
          const updated = [q.trim(), ...prev.filter((h) => h !== q.trim())].slice(
            0,
            MAX_HISTORY
          );
          saveHistory(updated);
          return updated;
        });
      }
    }, DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const results = useMemo(
    () => (debouncedQuery.trim() ? searchItems(items, debouncedQuery) : []),
    [items, debouncedQuery]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  const value = useMemo<SearchContextValue>(
    () => ({ query, setQuery, results, history, clearHistory }),
    [query, setQuery, results, history, clearHistory]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
