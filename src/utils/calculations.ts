import type { Item } from '@/types/finance';
import { isSameMonth, addMonths, startOfMonth, endOfMonth } from '@/utils/date';

export function getTotalIncome(items: Item[]): number {
  return items
    .filter((i) => i.type === 'income')
    .reduce((sum, i) => sum + i.amount, 0);
}

export function getTotalExpenses(items: Item[]): number {
  return items
    .filter((i) => i.type === 'expense')
    .reduce((sum, i) => sum + i.amount, 0);
}

export function getBalance(items: Item[]): number {
  return getTotalIncome(items) - getTotalExpenses(items);
}

export function getDailyAverage(items: Item[], days = 30): number {
  const expenses = items.filter((i) => i.type === 'expense');
  if (expenses.length === 0) return 0;
  const total = expenses.reduce((sum, i) => sum + i.amount, 0);
  return total / days;
}

export function getMonthlyAverage(items: Item[]): number {
  if (items.length === 0) return 0;
  const months = new Set(
    items.map((i) => {
      const d = new Date(i.date);
      return `${d.getFullYear()}-${d.getMonth()}`;
    })
  );
  const total = getTotalExpenses(items);
  return months.size > 0 ? total / months.size : 0;
}

export function getCategoryDistribution(items: Item[]): Record<string, number> {
  return items
    .filter((i) => i.type === 'expense')
    .reduce<Record<string, number>>((acc, i) => {
      acc[i.category] = (acc[i.category] ?? 0) + i.amount;
      return acc;
    }, {});
}

export function getMonthlyTrend(
  items: Item[],
  months = 6
): Array<{ month: string; income: number; expenses: number }> {
  const result: Array<{ month: string; income: number; expenses: number }> = [];
  const now = new Date();

  for (let m = months - 1; m >= 0; m--) {
    const date = addMonths(now, -m);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const monthItems = items.filter((i) => {
      const d = new Date(i.date);
      return d >= start && d <= end;
    });
    const monthName = new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric' }).format(
      date
    );
    result.push({
      month: monthName,
      income: getTotalIncome(monthItems),
      expenses: getTotalExpenses(monthItems),
    });
  }
  return result;
}

export function getSavingsRate(items: Item[]): number {
  const income = getTotalIncome(items);
  if (income === 0) return 0;
  const expenses = getTotalExpenses(items);
  const savings = income - expenses;
  return Math.max(0, (savings / income) * 100);
}

export function getFinancialScore(items: Item[]): number {
  if (items.length === 0) return 0;

  const savingsRate = getSavingsRate(items);
  const income = getTotalIncome(items);
  const expenses = getTotalExpenses(items);

  // Savings rate score: up to 40 points (target: 20%+ savings rate)
  const savingsScore = Math.min(40, (savingsRate / 20) * 40);

  // Income/expense ratio score: up to 30 points
  const ratioScore = income > 0 ? Math.min(30, (income / Math.max(expenses, 1)) * 15) : 0;

  // Consistency score: up to 30 points (having both income and expense entries)
  const hasIncome = income > 0 ? 15 : 0;
  const hasExpenses = expenses > 0 ? 15 : 0;
  const consistencyScore = hasIncome + hasExpenses;

  return Math.round(Math.min(100, savingsScore + ratioScore + consistencyScore));
}

export function apply5030Rule(
  items: Item[]
): { needs: number; wants: number; savings: number } {
  const income = getTotalIncome(items);
  return {
    needs: income * 0.5,
    wants: income * 0.3,
    savings: income * 0.2,
  };
}

export function projectSavings(
  currentSavings: number,
  monthlyContribution: number,
  months: number
): number {
  // Simple projection without compound interest
  return currentSavings + monthlyContribution * months;
}

// Checks if two dates are in the same month
export { isSameMonth };
