import { useCallback } from 'react';
import type { Item } from '@/types/finance';
import { generateId } from '@/utils/id';
import { addDays, addMonths } from '@/utils/date';
import { formatISODate } from '@/utils/date';

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export function useRecurring() {
  const generateRecurring = useCallback(
    (item: Item, upToDate: Date = new Date()): Item[] => {
      if (item.recurring === 'none') return [];
      const instances: Item[] = [];
      let current = new Date(item.date);

      // Start from the day after the original
      switch (item.recurring) {
        case 'daily':
          current = addDays(current, 1);
          break;
        case 'weekly':
          current = addDays(current, 7);
          break;
        case 'monthly':
          current = addMonths(current, 1);
          break;
        case 'yearly':
          current = addYears(current, 1);
          break;
      }

      while (current <= upToDate) {
        const now = new Date().toISOString();
        instances.push({
          ...item,
          id: generateId(),
          date: formatISODate(current),
          createdAt: now,
          updatedAt: now,
          recurring: 'none', // Generated instances are not themselves recurring
        });

        switch (item.recurring) {
          case 'daily':
            current = addDays(current, 1);
            break;
          case 'weekly':
            current = addDays(current, 7);
            break;
          case 'monthly':
            current = addMonths(current, 1);
            break;
          case 'yearly':
            current = addYears(current, 1);
            break;
        }
      }

      return instances;
    },
    []
  );

  const detectRecurring = useCallback((items: Item[]): Item[] => {
    return items.filter((item) => item.recurring !== 'none');
  }, []);

  const processRecurring = useCallback(
    (items: Item[]): Item[] => {
      const recurringItems = detectRecurring(items);
      const existingDates = new Set(
        items.map((i) => `${i.desc}::${i.amount}::${i.date}`)
      );
      const today = new Date();
      const newItems: Item[] = [];

      for (const item of recurringItems) {
        const generated = generateRecurring(item, today);
        for (const gen of generated) {
          const key = `${gen.desc}::${gen.amount}::${gen.date}`;
          if (!existingDates.has(key)) {
            newItems.push(gen);
            existingDates.add(key);
          }
        }
      }

      return newItems;
    },
    [generateRecurring, detectRecurring]
  );

  return { generateRecurring, detectRecurring, processRecurring };
}
