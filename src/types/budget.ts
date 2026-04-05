export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

export type BudgetStatus = 'ok' | 'warning' | 'exceeded';

export interface Budget {
  id: string;
  name: string;
  categoryId: string;
  limit: number;
  period: BudgetPeriod;
  spent: number;
  status: BudgetStatus;
  alertAt: number;
  createdAt: string;
}

export interface BudgetAlert {
  budgetId: string;
  message: string;
  type: 'warning' | 'exceeded';
  createdAt: string;
}
