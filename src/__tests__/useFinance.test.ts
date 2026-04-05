import { describe, it, expect } from 'vitest';
import { generateId } from '../utils/id';
import {
  startOfMonth,
  endOfMonth,
  isSameMonth,
  addDays,
  addMonths,
  formatISODate,
  getDaysInMonth,
} from '../utils/date';

describe('generateId', () => {
  it('returns a string', () => {
    expect(typeof generateId()).toBe('string');
  });

  it('returns unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()));
    expect(ids.size).toBe(100);
  });

  it('matches UUID v4 format', () => {
    const uuid = generateId();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });
});

describe('startOfMonth', () => {
  it('returns first day of month at midnight', () => {
    const d = startOfMonth(new Date('2024-03-15'));
    expect(d.getDate()).toBe(1);
    expect(d.getMonth()).toBe(2); // March = index 2
    expect(d.getHours()).toBe(0);
  });
});

describe('endOfMonth', () => {
  it('returns last day of month', () => {
    const d = endOfMonth(new Date('2024-02-01'));
    expect(d.getDate()).toBe(29); // 2024 is leap year
    expect(d.getMonth()).toBe(1);
  });
});

describe('isSameMonth', () => {
  it('returns true for same month/year', () => {
    expect(isSameMonth(new Date('2024-03-01'), new Date('2024-03-31'))).toBe(true);
  });

  it('returns false for different months', () => {
    expect(isSameMonth(new Date('2024-03-01'), new Date('2024-04-01'))).toBe(false);
  });

  it('returns false for same month different year', () => {
    expect(isSameMonth(new Date('2024-03-01'), new Date('2023-03-01'))).toBe(false);
  });
});

describe('addDays', () => {
  it('adds days correctly', () => {
    const d = addDays(new Date('2024-03-01'), 5);
    expect(formatISODate(d)).toBe('2024-03-06');
  });

  it('handles month boundaries', () => {
    const d = addDays(new Date('2024-01-30'), 3);
    expect(formatISODate(d)).toBe('2024-02-02');
  });
});

describe('addMonths', () => {
  it('adds months correctly', () => {
    const d = addMonths(new Date('2024-01-15'), 3);
    expect(d.getMonth()).toBe(3); // April
    expect(d.getFullYear()).toBe(2024);
  });
});

describe('getDaysInMonth', () => {
  it('returns correct days for each month', () => {
    expect(getDaysInMonth(new Date('2024-01-01'))).toBe(31);
    expect(getDaysInMonth(new Date('2024-02-01'))).toBe(29); // leap year
    expect(getDaysInMonth(new Date('2024-04-01'))).toBe(30);
  });
});
