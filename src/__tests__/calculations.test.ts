import { describe, it, expect } from 'vitest';
import {
  getTotalIncome,
  getTotalExpenses,
  getBalance,
  getCategoryDistribution,
  getSavingsRate,
  apply5030Rule,
} from '../utils/calculations';
import type { Item } from '../types/finance';

const makeItem = (overrides: Partial<Item>): Item => ({
  id: '1',
  desc: 'Test',
  amount: 100,
  type: 'expense',
  currency: 'USD',
  category: 'food',
  date: '2024-01-15',
  recurring: 'none',
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
  ...overrides,
});

const items: Item[] = [
  makeItem({ id: '1', type: 'income', amount: 3000, category: 'salary' }),
  makeItem({ id: '2', type: 'expense', amount: 500, category: 'food' }),
  makeItem({ id: '3', type: 'expense', amount: 300, category: 'transport' }),
  makeItem({ id: '4', type: 'expense', amount: 200, category: 'food' }),
];

describe('getTotalIncome', () => {
  it('sums income items only', () => {
    expect(getTotalIncome(items)).toBe(3000);
  });
  it('returns 0 for empty list', () => {
    expect(getTotalIncome([])).toBe(0);
  });
});

describe('getTotalExpenses', () => {
  it('sums expense items only', () => {
    expect(getTotalExpenses(items)).toBe(1000);
  });
  it('returns 0 for empty list', () => {
    expect(getTotalExpenses([])).toBe(0);
  });
});

describe('getBalance', () => {
  it('calculates income minus expenses', () => {
    expect(getBalance(items)).toBe(2000);
  });
  it('returns 0 for empty list', () => {
    expect(getBalance([])).toBe(0);
  });
});

describe('getCategoryDistribution', () => {
  it('groups totals by category', () => {
    const dist = getCategoryDistribution(items.filter(i => i.type === 'expense'));
    expect(dist['food']).toBe(700);
    expect(dist['transport']).toBe(300);
  });
});

describe('getSavingsRate', () => {
  it('returns ratio of savings to income', () => {
    const rate = getSavingsRate(items);
    expect(rate).toBeCloseTo(2000 / 3000, 5);
  });
  it('returns 0 when no income', () => {
    expect(getSavingsRate([makeItem({ type: 'expense', amount: 100 })])).toBe(0);
  });
});

describe('apply5030Rule', () => {
  it('returns needs, wants, savings breakdown', () => {
    const result = apply5030Rule(items);
    expect(result).toHaveProperty('needs');
    expect(result).toHaveProperty('wants');
    expect(result).toHaveProperty('savings');
    expect(typeof result.needs).toBe('number');
  });
});
