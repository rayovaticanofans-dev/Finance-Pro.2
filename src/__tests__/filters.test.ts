import { describe, it, expect } from 'vitest';
import { filterByDateRange, filterByCategory, searchItems, sortItems } from '../utils/filters';
import type { Item } from '../types/finance';
import type { TransactionSort } from '../types/finance';

const makeItem = (overrides: Partial<Item>): Item => ({
  id: '1',
  desc: 'Test item',
  amount: 100,
  type: 'expense',
  currency: 'USD',
  category: 'food',
  date: '2024-03-15',
  recurring: 'none',
  createdAt: '2024-03-15T00:00:00Z',
  updatedAt: '2024-03-15T00:00:00Z',
  ...overrides,
});

const items: Item[] = [
  makeItem({ id: '1', desc: 'Supermercado', amount: 200, category: 'food', date: '2024-03-10' }),
  makeItem({ id: '2', desc: 'Gasolina', amount: 80, category: 'transport', date: '2024-03-15' }),
  makeItem({ id: '3', desc: 'Netflix', amount: 15, category: 'entertainment', date: '2024-04-01' }),
  makeItem({ id: '4', desc: 'Salary', amount: 3000, type: 'income', category: 'salary', date: '2024-03-01' }),
];

describe('filterByDateRange', () => {
  it('filters items within range', () => {
    const result = filterByDateRange(items, { start: '2024-03-01', end: '2024-03-31' });
    expect(result).toHaveLength(3);
    expect(result.map(i => i.id)).toContain('1');
    expect(result.map(i => i.id)).toContain('2');
    expect(result.map(i => i.id)).toContain('4');
  });

  it('excludes items outside range', () => {
    const result = filterByDateRange(items, { start: '2024-04-01', end: '2024-04-30' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });
});

describe('filterByCategory', () => {
  it('filters items by single category', () => {
    const result = filterByCategory(items, ['food']);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters items by multiple categories', () => {
    const result = filterByCategory(items, ['food', 'transport']);
    expect(result).toHaveLength(2);
  });

  it('returns all items for empty category list', () => {
    const result = filterByCategory(items, []);
    expect(result).toHaveLength(items.length);
  });
});

describe('searchItems', () => {
  it('finds items by description substring', () => {
    const result = searchItems(items, 'super');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('is case-insensitive', () => {
    const result = searchItems(items, 'NETFLIX');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('returns all items for empty query', () => {
    const result = searchItems(items, '');
    expect(result).toHaveLength(items.length);
  });
});

describe('sortItems', () => {
  it('sorts by amount ascending', () => {
    const sort: TransactionSort = { field: 'amount', direction: 'asc' };
    const result = sortItems(items, sort);
    expect(result[0].amount).toBe(15);
    expect(result[result.length - 1].amount).toBe(3000);
  });

  it('sorts by amount descending', () => {
    const sort: TransactionSort = { field: 'amount', direction: 'desc' };
    const result = sortItems(items, sort);
    expect(result[0].amount).toBe(3000);
  });

  it('sorts by date descending', () => {
    const sort: TransactionSort = { field: 'date', direction: 'desc' };
    const result = sortItems(items, sort);
    expect(result[0].date).toBe('2024-04-01');
  });
});
