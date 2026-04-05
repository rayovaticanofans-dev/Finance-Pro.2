import type { Item } from '@/types/finance';
import type { Budget } from '@/types/budget';
import type { SavingsGoal } from '@/types/goals';

export interface ExportData {
  version: number;
  exportedAt: string;
  profileId: string;
  items: Item[];
  budgets?: Budget[];
  goals?: SavingsGoal[];
  categories?: string[];
}

const REQUIRED_ITEM_FIELDS: (keyof Item)[] = [
  'id',
  'desc',
  'amount',
  'type',
  'currency',
  'category',
  'date',
  'recurring',
  'createdAt',
  'updatedAt',
];

class BackupService {
  exportToJSON(data: ExportData): string {
    return JSON.stringify(data, null, 2);
  }

  importFromJSON(json: string): ExportData {
    try {
      const parsed = JSON.parse(json) as unknown;
      if (!this.validateExportData(parsed)) {
        throw new Error('Invalid backup format');
      }
      return parsed;
    } catch (err) {
      if (err instanceof SyntaxError) {
        throw new Error('Invalid JSON file');
      }
      throw err;
    }
  }

  validateExportData(data: unknown): data is ExportData {
    if (!data || typeof data !== 'object') return false;
    const d = data as Record<string, unknown>;
    if (typeof d['version'] !== 'number') return false;
    if (typeof d['exportedAt'] !== 'string') return false;
    if (typeof d['profileId'] !== 'string') return false;
    if (!Array.isArray(d['items'])) return false;

    // Validate each item has required fields
    for (const item of d['items'] as unknown[]) {
      if (!item || typeof item !== 'object') return false;
      const it = item as Record<string, unknown>;
      for (const field of REQUIRED_ITEM_FIELDS) {
        if (!(field in it)) return false;
      }
    }
    return true;
  }

  exportToCSV(items: Item[]): string {
    const headers = [
      'ID',
      'Fecha',
      'Descripción',
      'Categoría',
      'Tipo',
      'Monto',
      'Moneda',
      'Recurrente',
      'Etiquetas',
      'Nota',
    ];

    const escape = (val: string): string => {
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const rows = items.map((item) =>
      [
        item.id,
        item.date,
        escape(item.desc),
        escape(item.category),
        item.type,
        item.amount.toString(),
        item.currency,
        item.recurring,
        escape((item.tags ?? []).join('; ')),
        escape(item.note ?? ''),
      ].join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }

  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const backupService = new BackupService();
