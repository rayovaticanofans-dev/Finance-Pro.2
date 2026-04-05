import { useMemo } from 'react';
import { useFinanceContext } from '@/contexts/FinanceContext';
import { filterItems, sortItems } from '@/utils/filters';
import {
  getCategoryDistribution,
  getDailyAverage,
  getFinancialScore,
  getMonthlyAverage,
  getMonthlyTrend,
  getSavingsRate,
} from '@/utils/calculations';
import type { Item, TransactionFilter, TransactionSort } from '@/types/finance';

export interface FinanceStatistics {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  dailyAverage: number;
  monthlyAverage: number;
  financialScore: number;
  categoryDistribution: Record<string, number>;
  monthlyTrend: Array<{ month: string; income: number; expenses: number }>;
  transactionCount: number;
}

export function useFinance() {
  const ctx = useFinanceContext();

  const statistics = useMemo<FinanceStatistics>(
    () => ({
      totalIncome: ctx.totalIncome,
      totalExpenses: ctx.totalExpenses,
      balance: ctx.balance,
      savingsRate: getSavingsRate(ctx.items),
      dailyAverage: getDailyAverage(ctx.items),
      monthlyAverage: getMonthlyAverage(ctx.items),
      financialScore: getFinancialScore(ctx.items),
      categoryDistribution: getCategoryDistribution(ctx.items),
      monthlyTrend: getMonthlyTrend(ctx.items),
      transactionCount: ctx.items.length,
    }),
    [ctx.items, ctx.totalIncome, ctx.totalExpenses, ctx.balance]
  );

  const filteredAndSorted = useMemo(
    () => ctx.filteredItems,
    [ctx.filteredItems]
  );

  const getFilteredItems = useMemo(
    () =>
      (filter: TransactionFilter, sort?: TransactionSort): Item[] => {
        const filtered = filterItems(ctx.items, filter);
        if (!sort) return filtered;
        return sortItems(filtered, sort);
      },
    [ctx.items]
  );

  return {
    ...ctx,
    filteredAndSorted,
    statistics,
    getFilteredItems,
  };
}
