import { describe, it, expect } from 'vitest';
import { isValidAmount, isValidDate, validateItem } from '../utils/validators';
import type { Item } from '../types/finance';

describe('isValidAmount', () => {
  it('returns true for positive numbers', () => {
    expect(isValidAmount(100)).toBe(true);
    expect(isValidAmount(0.01)).toBe(true);
    expect(isValidAmount('50')).toBe(true);
  });
  it('returns false for zero and negatives', () => {
    expect(isValidAmount(0)).toBe(false);
    expect(isValidAmount(-1)).toBe(false);
  });
  it('returns false for non-numeric values', () => {
    expect(isValidAmount('abc')).toBe(false);
    expect(isValidAmount(null)).toBe(false);
    expect(isValidAmount(undefined)).toBe(false);
    expect(isValidAmount(NaN)).toBe(false);
  });
});

describe('isValidDate', () => {
  it('returns true for valid date strings', () => {
    expect(isValidDate('2024-01-15')).toBe(true);
    expect(isValidDate('2024-12-31T23:59:59Z')).toBe(true);
  });
  it('returns false for invalid dates', () => {
    expect(isValidDate('invalid')).toBe(false);
    expect(isValidDate('')).toBe(false);
    expect(isValidDate(null)).toBe(false);
  });
});

describe('validateItem', () => {
  const validItem: Partial<Item> = {
    desc: 'Grocery shopping',
    amount: 150,
    type: 'expense',
    currency: 'USD',
    category: 'food',
    date: '2024-01-15',
  };

  it('returns valid for a complete item', () => {
    const result = validateItem(validItem);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('returns error for missing description', () => {
    const result = validateItem({ ...validItem, desc: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.desc).toBeDefined();
  });

  it('returns error for missing amount', () => {
    const result = validateItem({ ...validItem, amount: undefined });
    expect(result.valid).toBe(false);
    expect(result.errors.amount).toBeDefined();
  });

  it('returns error for invalid type', () => {
    const result = validateItem({ ...validItem, type: 'invalid' as Item['type'] });
    expect(result.valid).toBe(false);
    expect(result.errors.type).toBeDefined();
  });
});
