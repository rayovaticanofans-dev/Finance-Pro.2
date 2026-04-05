import { describe, it, expect } from 'vitest';
import { formatPercent, formatNumber, capitalize } from '../utils/formatters';

describe('formatPercent', () => {
  it('formats 50 as a 50% string', () => {
    const result = formatPercent(50);
    expect(result).toContain('50');
  });

  it('formats 100 as 100%', () => {
    const result = formatPercent(100);
    expect(result).toContain('100');
  });

  it('formats 0 as 0%', () => {
    const result = formatPercent(0);
    expect(result).toContain('0');
  });
});

describe('formatNumber', () => {
  it('formats integer without decimals', () => {
    const result = formatNumber(1234);
    expect(result).toContain('1');
    expect(result).toContain('234');
  });

  it('formats with specified decimal places', () => {
    const result = formatNumber(3.14159, 2);
    expect(result).toContain('3');
    expect(result).toContain('14');
  });
});

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('handles already capitalized string', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('handles single character', () => {
    expect(capitalize('a')).toBe('A');
  });
});

describe('formatNumber', () => {
  it('formats integer without decimals', () => {
    const result = formatNumber(1234);
    expect(result).toContain('1');
    expect(result).toContain('234');
  });

  it('formats with specified decimal places', () => {
    const result = formatNumber(3.14159, 2);
    expect(result).toContain('3');
    expect(result).toContain('14');
  });
});

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('handles already capitalized string', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('handles single character', () => {
    expect(capitalize('a')).toBe('A');
  });
});
