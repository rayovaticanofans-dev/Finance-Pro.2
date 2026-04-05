import { useCallback, useEffect, useState } from 'react';
import type { GoalContribution, GoalStatus, SavingsGoal } from '@/types/goals';
import { generateId } from '@/utils/id';
import { useProfiles } from '@/contexts/ProfilesContext';

function storageKey(profileId: string): string {
  return `fp-v3:${profileId}:goals`;
}

function loadGoals(profileId: string): SavingsGoal[] {
  try {
    const raw = localStorage.getItem(storageKey(profileId));
    if (raw) return JSON.parse(raw) as SavingsGoal[];
  } catch {
    // localStorage not available
  }
  return [];
}

function saveGoals(profileId: string, goals: SavingsGoal[]): void {
  try {
    localStorage.setItem(storageKey(profileId), JSON.stringify(goals));
  } catch {
    // Quota exceeded
  }
}

function contribKey(profileId: string): string {
  return `fp-v3:${profileId}:goalContributions`;
}

function loadContributions(profileId: string): GoalContribution[] {
  try {
    const raw = localStorage.getItem(contribKey(profileId));
    if (raw) return JSON.parse(raw) as GoalContribution[];
  } catch {
    // localStorage not available
  }
  return [];
}

function saveContributions(profileId: string, contributions: GoalContribution[]): void {
  try {
    localStorage.setItem(contribKey(profileId), JSON.stringify(contributions));
  } catch {
    // Quota exceeded
  }
}

export function useGoals() {
  const { activeProfileId } = useProfiles();
  const [goals, setGoals] = useState<SavingsGoal[]>(() => loadGoals(activeProfileId));
  const [contributions, setContributions] = useState<GoalContribution[]>(() =>
    loadContributions(activeProfileId)
  );

  useEffect(() => {
    setGoals(loadGoals(activeProfileId));
    setContributions(loadContributions(activeProfileId));
  }, [activeProfileId]);

  useEffect(() => {
    saveGoals(activeProfileId, goals);
  }, [activeProfileId, goals]);

  useEffect(() => {
    saveContributions(activeProfileId, contributions);
  }, [activeProfileId, contributions]);

  const addGoal = useCallback(
    (goal: Omit<SavingsGoal, 'id' | 'createdAt' | 'currentAmount' | 'status'>) => {
      const newGoal: SavingsGoal = {
        ...goal,
        id: generateId(),
        currentAmount: 0,
        status: 'active' as GoalStatus,
        createdAt: new Date().toISOString(),
      };
      setGoals((prev) => [...prev, newGoal]);
      return newGoal;
    },
    []
  );

  const updateGoal = useCallback((updated: SavingsGoal) => {
    setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setContributions((prev) => prev.filter((c) => c.goalId !== id));
  }, []);

  const addContribution = useCallback(
    (goalId: string, amount: number, note?: string): GoalContribution => {
      const contribution: GoalContribution = {
        id: generateId(),
        goalId,
        amount,
        date: new Date().toISOString().slice(0, 10),
        note,
      };
      setContributions((prev) => [...prev, contribution]);
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id !== goalId) return g;
          const newAmount = g.currentAmount + amount;
          const status: GoalStatus = newAmount >= g.targetAmount ? 'completed' : g.status;
          return { ...g, currentAmount: newAmount, status };
        })
      );
      return contribution;
    },
    []
  );

  const getGoalProgress = useCallback((goal: SavingsGoal): number => {
    if (goal.targetAmount <= 0) return 0;
    return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  }, []);

  const projectGoalDate = useCallback((goal: SavingsGoal): Date | null => {
    const remaining = goal.targetAmount - goal.currentAmount;
    if (remaining <= 0) return new Date();
    const monthly = goal.monthlyContribution;
    if (!monthly || monthly <= 0) return null;
    const monthsNeeded = Math.ceil(remaining / monthly);
    const projected = new Date();
    projected.setMonth(projected.getMonth() + monthsNeeded);
    return projected;
  }, []);

  const getContributionsForGoal = useCallback(
    (goalId: string): GoalContribution[] =>
      contributions.filter((c) => c.goalId === goalId),
    [contributions]
  );

  return {
    goals,
    contributions,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    getGoalProgress,
    projectGoalDate,
    getContributionsForGoal,
  };
}
