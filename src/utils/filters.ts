import type { Item, TransactionFilter, TransactionSort, DateRange } from '@/types/finance';
import { startOfDay, endOfDay } from '@/utils/date';

export function filterByDateRange(items: Item[], range: DateRange): Item[] {
  const start = new Date(range.start);
  const end = new Date(range.end);
  return items.filter((item) => {
    const d = new Date(item.date);
    return d >= start && d <= end;
  });
}

export function getDateRange(
  preset: 'today' | 'week' | 'month' | 'year' | 'last30' | 'last90'
): DateRange {
  const now = new Date();

  switch (preset) {
    case 'today':
      return {
        start: startOfDay(now).toISOString(),
        end: endOfDay(now).toISOString(),
        label: 'Hoy',
      };
    case 'week': {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      return {
        start: startOfDay(weekStart).toISOString(),
        end: endOfDay(now).toISOString(),
        label: 'Esta semana',
      };
    }
    case 'month': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        start: startOfDay(monthStart).toISOString(),
        end: endOfDay(now).toISOString(),
        label: 'Este mes',
      };
    }
    case 'year': {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      return {
        start: startOfDay(yearStart).toISOString(),
        end: endOfDay(now).toISOString(),
        label: 'Este año',
      };
    }
    case 'last30': {
      const d30 = new Date(now);
      d30.setDate(d30.getDate() - 30);
      return {
        start: startOfDay(d30).toISOString(),
        end: endOfDay(now).toISOString(),
        label: 'Últimos 30 días',
      };
    }
    case 'last90': {
      const d90 = new Date(now);
      d90.setDate(d90.getDate() - 90);
      return {
        start: startOfDay(d90).toISOString(),
        end: endOfDay(now).toISOString(),
        label: 'Últimos 90 días',
      };
    }
  }
}

export function filterByCategory(items: Item[], categoryIds: string[]): Item[] {
  if (categoryIds.length === 0) return items;
  return items.filter((item) => categoryIds.includes(item.category));
}

export function searchItems(items: Item[], query: string): Item[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase().trim();
  return items.filter(
    (item) =>
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.note?.toLowerCase().includes(q) ?? false) ||
      (item.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
  );
}

export function filterItems(items: Item[], filter: TransactionFilter): Item[] {
  let result = [...items];

  if (filter.dateRange) {
    result = filterByDateRange(result, filter.dateRange);
  }

  if (filter.categories && filter.categories.length > 0) {
    result = filterByCategory(result, filter.categories);
  }

  if (filter.types && filter.types.length > 0) {
    result = result.filter((item) => filter.types!.includes(item.type));
  }

  if (filter.amountMin !== undefined) {
    result = result.filter((item) => item.amount >= filter.amountMin!);
  }

  if (filter.amountMax !== undefined) {
    result = result.filter((item) => item.amount <= filter.amountMax!);
  }

  if (filter.tags && filter.tags.length > 0) {
    result = result.filter((item) =>
      item.tags?.some((t) => filter.tags!.includes(t)) ?? false
    );
  }

  if (filter.search) {
    result = searchItems(result, filter.search);
  }

  if (filter.recurring && filter.recurring.length > 0) {
    result = result.filter((item) => filter.recurring!.includes(item.recurring));
  }

  return result;
}

export function sortItems(items: Item[], sort: TransactionSort): Item[] {
  return [...items].sort((a, b) => {
    let cmp = 0;
    switch (sort.field) {
      case 'date':
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        cmp = a.amount - b.amount;
        break;
      case 'category':
        cmp = a.category.localeCompare(b.category);
        break;
      case 'desc':
        cmp = a.desc.localeCompare(b.desc);
        break;
    }
    return sort.direction === 'asc' ? cmp : -cmp;
  });
}
