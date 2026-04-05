import { describe, it, expect } from 'vitest';
import { aiService } from '@/services/ai.service';
import type { Item } from '@/types/finance';

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

describe('suggestCategory', () => {
  it('suggests food-supermarket for "supermercado walmart"', () => {
    const result = aiService.suggestCategory('supermercado walmart');
    expect(result).toBe('food-supermarket');
  });

  it('suggests transport-gas for fuel-related descriptions', () => {
    const result = aiService.suggestCategory('carga de nafta en YPF');
    expect(result).toBe('transport-gas');
  });

  it('returns default category for unknown description', () => {
    const result = aiService.suggestCategory('xyzxyz unknown item 9999');
    expect(result).toBe('services-subscriptions');
  });
});

describe('detectPatterns', () => {
  it('detects patterns from items with recurring category', () => {
    const items: Item[] = [
      makeItem({ id: '1', category: 'food', amount: 100, date: '2024-01-10' }),
      makeItem({ id: '2', category: 'food', amount: 120, date: '2024-02-10' }),
      makeItem({ id: '3', category: 'food', amount: 110, date: '2024-03-10' }),
    ];
    const patterns = aiService.detectPatterns(items);
    expect(patterns.length).toBeGreaterThan(0);
    const foodPattern = patterns.find((p) => p.category === 'food');
    expect(foodPattern).toBeDefined();
    expect(foodPattern?.frequency).toBe(3);
  });

  it('returns empty array for no items', () => {
    expect(aiService.detectPatterns([])).toEqual([]);
  });

  it('ignores categories with only one transaction', () => {
    const items: Item[] = [makeItem({ id: '1', category: 'solo', amount: 100 })];
    const patterns = aiService.detectPatterns(items);
    expect(patterns.find((p) => p.category === 'solo')).toBeUndefined();
  });

  it('returns trend information', () => {
    const items: Item[] = [
      makeItem({ id: '1', category: 'food', amount: 100, date: '2023-01-10' }),
      makeItem({ id: '2', category: 'food', amount: 200, date: '2024-06-10' }),
    ];
    const patterns = aiService.detectPatterns(items);
    const pattern = patterns.find((p) => p.category === 'food');
    expect(pattern?.trend).toMatch(/increasing|decreasing|stable/);
  });
});

describe('getFinancialTips', () => {
  it('returns tip about saving more when savings rate is low', () => {
    const items: Item[] = [
      makeItem({ id: '1', type: 'income', amount: 1000 }),
      makeItem({ id: '2', type: 'expense', amount: 990 }),
    ];
    const tips = aiService.getFinancialTips(items);
    expect(tips.length).toBeGreaterThan(0);
    expect(tips.some((t) => t.toLowerCase().includes('ahorro') || t.toLowerCase().includes('ahorr'))).toBe(true);
  });

  it('returns a tip prompting to register income when there is none', () => {
    const items: Item[] = [makeItem({ id: '1', type: 'expense', amount: 100 })];
    const tips = aiService.getFinancialTips(items);
    expect(tips.length).toBeGreaterThan(0);
    expect(tips[0].toLowerCase()).toContain('ingreso');
  });

  it('returns positive tip when savings rate is high', () => {
    const items: Item[] = [
      makeItem({ id: '1', type: 'income', amount: 5000 }),
      makeItem({ id: '2', type: 'expense', amount: 1000 }),
    ];
    const tips = aiService.getFinancialTips(items);
    expect(tips.some((t) => t.includes('Excelente') || t.includes('excelente') || t.includes('%'))).toBe(true);
  });
});

describe('calculateFinancialScore', () => {
  it('returns score object with total between 0 and 100', () => {
    const items: Item[] = [
      makeItem({ id: '1', type: 'income', amount: 3000 }),
      makeItem({ id: '2', type: 'expense', amount: 1500, category: 'food' }),
      makeItem({ id: '3', type: 'expense', amount: 500, category: 'transport' }),
    ];
    const score = aiService.calculateFinancialScore(items);
    expect(score.total).toBeGreaterThanOrEqual(0);
    expect(score.total).toBeLessThanOrEqual(100);
  });

  it('returns numeric sub-scores', () => {
    const items: Item[] = [
      makeItem({ id: '1', type: 'income', amount: 3000 }),
      makeItem({ id: '2', type: 'expense', amount: 1500 }),
    ];
    const score = aiService.calculateFinancialScore(items);
    expect(typeof score.savingsRate).toBe('number');
    expect(typeof score.consistency).toBe('number');
    expect(typeof score.diversification).toBe('number');
  });

  it('returns breakdown array', () => {
    const items: Item[] = [
      makeItem({ id: '1', type: 'income', amount: 1000 }),
      makeItem({ id: '2', type: 'expense', amount: 500 }),
    ];
    const score = aiService.calculateFinancialScore(items);
    expect(Array.isArray(score.breakdown)).toBe(true);
    expect(score.breakdown.length).toBeGreaterThan(0);
  });

  it('returns zero score for empty items', () => {
    const score = aiService.calculateFinancialScore([]);
    expect(score.total).toBe(0);
  });

  it('scores higher with better savings rate', () => {
    const goodItems: Item[] = [
      makeItem({ id: '1', type: 'income', amount: 5000 }),
      makeItem({ id: '2', type: 'expense', amount: 1000 }),
    ];
    const badItems: Item[] = [
      makeItem({ id: '1', type: 'income', amount: 1000 }),
      makeItem({ id: '2', type: 'expense', amount: 990 }),
    ];
    const goodScore = aiService.calculateFinancialScore(goodItems);
    const badScore = aiService.calculateFinancialScore(badItems);
    expect(goodScore.total).toBeGreaterThan(badScore.total);
  });
});
