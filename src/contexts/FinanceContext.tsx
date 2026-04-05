import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import type {
  FinanceAction,
  FinanceState,
  Item,
  TransactionFilter,
  TransactionSort,
} from '@/types/finance';
import { filterItems, sortItems } from '@/utils/filters';
import {
  getBalance,
  getTotalExpenses,
  getTotalIncome,
} from '@/utils/calculations';
import { useProfiles } from '@/contexts/ProfilesContext';

const DEFAULT_SORT: TransactionSort = { field: 'date', direction: 'desc' };
const DEFAULT_FILTER: TransactionFilter = {};

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [action.payload, ...state.items] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.payload.id ? action.payload : i)),
      };
    case 'DELETE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'IMPORT_DATA':
      return { ...state, items: action.payload };
    case 'CLEAR_ALL':
      return { ...state, items: [], filter: DEFAULT_FILTER, sort: DEFAULT_SORT };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

function makeStorageKey(profileId: string): string {
  return `fp-v3:${profileId}:finance`;
}

function loadItems(profileId: string): Item[] {
  try {
    const raw = localStorage.getItem(makeStorageKey(profileId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Item[]) : [];
  } catch {
    return [];
  }
}

function saveItems(profileId: string, items: Item[]): void {
  try {
    localStorage.setItem(makeStorageKey(profileId), JSON.stringify(items));
  } catch {
    // Quota exceeded or unavailable
  }
}

interface FinanceContextValue {
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  items: Item[];
  filteredItems: Item[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  addItem: (item: Item) => void;
  updateItem: (item: Item) => void;
  deleteItem: (id: string) => void;
  setFilter: (filter: TransactionFilter) => void;
  setSort: (sort: TransactionSort) => void;
  importData: (items: Item[]) => void;
  clearAll: () => void;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const { activeProfileId } = useProfiles();

  const [state, dispatch] = useReducer(financeReducer, undefined, () => ({
    items: loadItems(activeProfileId),
    filter: DEFAULT_FILTER,
    sort: DEFAULT_SORT,
    isLoading: false,
  }));

  // Reload when active profile changes
  useEffect(() => {
    const items = loadItems(activeProfileId);
    dispatch({ type: 'IMPORT_DATA', payload: items });
  }, [activeProfileId]);

  // Persist whenever items change
  useEffect(() => {
    saveItems(activeProfileId, state.items);
  }, [activeProfileId, state.items]);

  const filteredItems = useMemo(
    () => sortItems(filterItems(state.items, state.filter), state.sort),
    [state.items, state.filter, state.sort]
  );

  const totalIncome = useMemo(() => getTotalIncome(state.items), [state.items]);
  const totalExpenses = useMemo(() => getTotalExpenses(state.items), [state.items]);
  const balance = useMemo(() => getBalance(state.items), [state.items]);

  const addItem = useCallback((item: Item) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  const updateItem = useCallback(
    (item: Item) => dispatch({ type: 'UPDATE_ITEM', payload: item }),
    []
  );
  const deleteItem = useCallback(
    (id: string) => dispatch({ type: 'DELETE_ITEM', payload: id }),
    []
  );
  const setFilter = useCallback(
    (filter: TransactionFilter) => dispatch({ type: 'SET_FILTER', payload: filter }),
    []
  );
  const setSort = useCallback(
    (sort: TransactionSort) => dispatch({ type: 'SET_SORT', payload: sort }),
    []
  );
  const importData = useCallback(
    (items: Item[]) => dispatch({ type: 'IMPORT_DATA', payload: items }),
    []
  );
  const clearAll = useCallback(() => dispatch({ type: 'CLEAR_ALL' }), []);

  const value = useMemo<FinanceContextValue>(
    () => ({
      state,
      dispatch,
      items: state.items,
      filteredItems,
      totalIncome,
      totalExpenses,
      balance,
      addItem,
      updateItem,
      deleteItem,
      setFilter,
      setSort,
      importData,
      clearAll,
    }),
    [
      state,
      filteredItems,
      totalIncome,
      totalExpenses,
      balance,
      addItem,
      updateItem,
      deleteItem,
      setFilter,
      setSort,
      importData,
      clearAll,
    ]
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinanceContext(): FinanceContextValue {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinanceContext must be used within FinanceProvider');
  return ctx;
}
