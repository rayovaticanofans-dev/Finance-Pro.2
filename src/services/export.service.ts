import type { Item } from '@/types/finance';
import type { Currency } from '@/types/currency';
import { formatCurrency } from '@/utils/formatters';

class ExportService {
  exportTransactionsCSV(items: Item[], currency: Currency): string {
    const headers = [
      'Fecha',
      'Descripción',
      'Categoría',
      'Tipo',
      `Monto (${currency})`,
      'Moneda Original',
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
        item.date.slice(0, 10),
        escape(item.desc),
        escape(item.category),
        item.type === 'income' ? 'Ingreso' : 'Gasto',
        formatCurrency(item.amount, currency),
        item.currency,
        item.recurring,
        escape((item.tags ?? []).join('; ')),
        escape(item.note ?? ''),
      ].join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }

  exportTransactionsJSON(items: Item[]): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        count: items.length,
        items,
      },
      null,
      2
    );
  }

  downloadCSV(items: Item[], filename = `transactions-${Date.now()}.csv`): void {
    const csv = this.exportTransactionsCSV(items, 'USD');
    this.downloadFile(csv, filename, 'text/csv;charset=utf-8;');
  }

  downloadJSON(data: unknown, filename = `export-${Date.now()}.json`): void {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, filename, 'application/json');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
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

export const exportService = new ExportService();
