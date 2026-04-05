import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Budget, BudgetAlert, BudgetStatus } from '@/types/budget';
import type { Item } from '@/types/finance';
import { generateId } from '@/utils/id';
import { useProfiles } from '@/contexts/ProfilesContext';

interface BudgetStatusResult {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
}

function storageKey(profileId: string): string {
  return `fp-v3:${profileId}:budgets`;
}

function loadBudgets(profileId: string): Budget[] {
  try {
    const raw = localStorage.getItem(storageKey(profileId));
    if (raw) return JSON.parse(raw) as Budget[];
  } catch {
    // localStorage not available
  }
  return [];
}

function saveBudgets(profileId: string, budgets: Budget[]): void {
  try {
    localStorage.setItem(storageKey(profileId), JSON.stringify(budgets));
  } catch {
    // Quota exceeded
  }
}

export function useBudget() {
  const { activeProfileId } = useProfiles();
  const [budgets, setBudgets] = useState<Budget[]>(() => loadBudgets(activeProfileId));

  useEffect(() => {
    setBudgets(loadBudgets(activeProfileId));
  }, [activeProfileId]);

  useEffect(() => {
    saveBudgets(activeProfileId, budgets);
  }, [activeProfileId, budgets]);

  const addBudget = useCallback((budget: Omit<Budget, 'id' | 'createdAt' | 'spent' | 'status'>) => {
    const now = new Date().toISOString();
    const newBudget: Budget = {
      ...budget,
      id: generateId(),
      spent: 0,
      status: 'ok',
      createdAt: now,
    };
    setBudgets((prev) => [...prev, newBudget]);
    return newBudget;
  }, []);

  const updateBudget = useCallback((updated: Budget) => {
    setBudgets((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const getBudgetStatus = useCallback(
    (budget: Budget, items: Item[]): BudgetStatusResult => {
      const periodItems = items.filter((item) => {
        if (item.type !== 'expense') return false;
        if (item.category !== budget.categoryId) return false;
        const now = new Date();
        const itemDate = new Date(item.date);
        if (budget.period === 'monthly') {
          return (
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getFullYear() === now.getFullYear()
          );
        }
        if (budget.period === 'weekly') {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          weekStart.setHours(0, 0, 0, 0);
          return itemDate >= weekStart;
        }
        if (budget.period === 'yearly') {
          return itemDate.getFullYear() === now.getFullYear();
        }
        return false;
      });

      const spent = periodItems.reduce((sum, i) => sum + i.amount, 0);
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
      const remaining = budget.limit - spent;

      let status: BudgetStatus = 'ok';
      if (percentage >= 100) status = 'exceeded';
      else if (percentage >= budget.alertAt) status = 'warning';

      return { budget, spent, remaining, percentage, status };
    },
    []
  );

  const getAlertsForBudgets = useCallback(
    (budgetList: Budget[], items: Item[]): BudgetAlert[] => {
      const alerts: BudgetAlert[] = [];
      for (const budget of budgetList) {
        const result = getBudgetStatus(budget, items);
        if (result.status === 'warning' || result.status === 'exceeded') {
          alerts.push({
            budgetId: budget.id,
            message:
              result.status === 'exceeded'
                ? `Presupuesto "${budget.name}" superado (${result.percentage.toFixed(0)}%)`
                : `Presupuesto "${budget.name}" al ${result.percentage.toFixed(0)}%`,
            type: result.status,
            createdAt: new Date().toISOString(),
          });
        }
      }
      return alerts;
    },
    [getBudgetStatus]
  );

  const budgetStatuses = useMemo(
    () => budgets.map((b) => ({ ...b })),
    [budgets]
  );

  return {
    budgets,
    budgetStatuses,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetStatus,
    getAlertsForBudgets,
  };
}
