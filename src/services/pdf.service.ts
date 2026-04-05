import { jsPDF } from 'jspdf';
import type { Item } from '@/types/finance';
import type { Currency } from '@/types/currency';
import { CURRENCIES } from '@/constants/currencies';
import { formatCurrency } from '@/utils/formatters';
import { getTotalIncome, getTotalExpenses, getBalance } from '@/utils/calculations';

export interface PDFReportOptions {
  title: string;
  currency: Currency;
  dateRange?: { start: string; end: string };
  profileName?: string;
  includeCharts?: boolean;
}

class PDFService {
  generateTransactionReport(items: Item[], options: PDFReportOptions): jsPDF {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const fmt = (amount: number) => formatCurrency(amount, options.currency);

    // ── Header ────────────────────────────────────────────────────────────
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('FinancePro', margin, 12);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(options.title, margin, 21);

    if (options.profileName) {
      doc.setFontSize(10);
      doc.text(options.profileName, pageWidth - margin, 12, { align: 'right' });
    }

    const currInfo = CURRENCIES[options.currency];
    doc.text(currInfo.name, pageWidth - margin, 21, { align: 'right' });

    y = 36;
    doc.setTextColor(0, 0, 0);

    // ── Date range ────────────────────────────────────────────────────────
    if (options.dateRange) {
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Período: ${options.dateRange.start} – ${options.dateRange.end}`,
        margin,
        y
      );
      y += 6;
    }

    // ── Summary section ───────────────────────────────────────────────────
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'F');

    const colW = contentWidth / 3;
    const summaryItems = [
      { label: 'Total Ingresos', value: fmt(getTotalIncome(items)), color: [34, 197, 94] as const },
      { label: 'Total Gastos', value: fmt(getTotalExpenses(items)), color: [239, 68, 68] as const },
      { label: 'Balance', value: fmt(getBalance(items)), color: [59, 130, 246] as const },
    ];

    summaryItems.forEach((s, i) => {
      const x = margin + i * colW + colW / 2;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(s.label, x, y + 8, { align: 'center' });

      doc.setFontSize(12);
      doc.setTextColor(s.color[0], s.color[1], s.color[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(s.value, x, y + 18, { align: 'center' });
    });

    y += 34;
    doc.setTextColor(0, 0, 0);

    // ── Table header ──────────────────────────────────────────────────────
    doc.setFillColor(37, 99, 235);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');

    const cols = [
      { label: 'Fecha', x: margin + 2, w: 22 },
      { label: 'Descripción', x: margin + 24, w: 60 },
      { label: 'Categoría', x: margin + 84, w: 35 },
      { label: 'Tipo', x: margin + 119, w: 20 },
      { label: 'Monto', x: margin + 139, w: 36 },
    ];

    cols.forEach((c) => doc.text(c.label, c.x, y + 5.5));
    y += 8;

    // ── Table rows ────────────────────────────────────────────────────────
    doc.setFont('helvetica', 'normal');
    let rowIndex = 0;

    for (const item of items) {
      if (y > pageHeight - 30) {
        this.addFooter(doc, pageHeight, margin, pageWidth);
        doc.addPage();
        y = margin + 10;
        rowIndex = 0;
      }

      if (rowIndex % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, 7, 'F');
      }

      doc.setTextColor(30, 30, 30);
      doc.setFontSize(7.5);

      const truncate = (s: string, max: number) =>
        s.length > max ? `${s.slice(0, max - 1)}…` : s;

      doc.text(item.date.slice(0, 10), cols[0].x, y + 4.8);
      doc.text(truncate(item.desc, 35), cols[1].x, y + 4.8);
      doc.text(truncate(item.category, 20), cols[2].x, y + 4.8);

      if (item.type === 'income') {
        doc.setTextColor(34, 197, 94);
      } else {
        doc.setTextColor(239, 68, 68);
      }
      doc.text(item.type === 'income' ? 'Ingreso' : 'Gasto', cols[3].x, y + 4.8);

      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(fmt(item.amount), cols[4].x + cols[4].w - 2, y + 4.8, { align: 'right' });
      doc.setFont('helvetica', 'normal');

      y += 7;
      rowIndex++;
    }

    this.addFooter(doc, pageHeight, margin, pageWidth);
    return doc;
  }

  private addFooter(
    doc: jsPDF,
    pageHeight: number,
    margin: number,
    pageWidth: number
  ): void {
    const totalPages = (doc.internal as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
    const currentPage = doc.getCurrentPageInfo().pageNumber;
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Generado el ${new Date().toLocaleString('es-ES')} · FinancePro`,
      margin,
      pageHeight - 8
    );
    doc.text(
      `Página ${currentPage} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: 'right' }
    );
  }
}

export const pdfService = new PDFService();
