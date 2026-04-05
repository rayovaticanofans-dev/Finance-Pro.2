import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { generateId } from '@/utils/id';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalConfig {
  id: string;
  component: React.ComponentType<Record<string, unknown>>;
  props?: Record<string, unknown>;
  size?: ModalSize;
}

interface ModalContextValue {
  modals: ModalConfig[];
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id?: string) => void;
  closeAll: () => void;
  activeModal: ModalConfig | null;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = useCallback((config: Omit<ModalConfig, 'id'>): string => {
    const id = generateId();
    setModals((prev) => [...prev, { ...config, id }]);
    return id;
  }, []);

  const closeModal = useCallback((id?: string) => {
    if (id) {
      setModals((prev) => prev.filter((m) => m.id !== id));
    } else {
      // Close the top-most modal
      setModals((prev) => prev.slice(0, -1));
    }
  }, []);

  const closeAll = useCallback(() => {
    setModals([]);
  }, []);

  // Close top modal on Escape key
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modals.length > 0) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [modals.length, closeModal]);

  const activeModal = useMemo(
    () => (modals.length > 0 ? modals[modals.length - 1] : null),
    [modals]
  );

  const value = useMemo<ModalContextValue>(
    () => ({ modals, openModal, closeModal, closeAll, activeModal }),
    [modals, openModal, closeModal, closeAll, activeModal]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
