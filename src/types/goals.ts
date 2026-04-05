export type GoalStatus = 'active' | 'completed' | 'paused';

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  monthlyContribution?: number;
  status: GoalStatus;
  emoji?: string;
  color?: string;
  createdAt: string;
}

export interface InvestmentGoal {
  id: string;
  name: string;
  targetReturn: number;
  currentValue: number;
  initialInvestment: number;
  createdAt: string;
}
