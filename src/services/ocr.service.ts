import Tesseract from 'tesseract.js';

export interface ReceiptData {
  rawText: string;
  amount?: number;
  date?: string;
  merchant?: string;
  items?: string[];
  confidence: number;
}

const AMOUNT_PATTERNS = [
  /(?:total|monto|importe|a\s+pagar|subtotal)[:\s]+[\$€£¥]?\s*([\d,\.]+)/i,
  /[\$€£¥]\s*([\d,\.]+)\s*(?:pesos?|dolares?|euros?)?/i,
  /([\d]{1,3}(?:[,\s][\d]{3})*(?:[.,][\d]{2}))\s*(?:ARS|USD|EUR|MXN)?/,
];

const DATE_PATTERNS = [
  /(\d{2})[\/\-](\d{2})[\/\-](\d{2,4})/,
  /(\d{1,2})\s+(?:de\s+)?(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+(?:de\s+)?(\d{4})/i,
  /(\d{4})[\/\-](\d{2})[\/\-](\d{2})/,
];

function extractAmount(text: string): number | undefined {
  for (const pattern of AMOUNT_PATTERNS) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const raw = match[1].trim();
      let normalized: string;
      // European format: 1.234,56 → last separator is comma
      if (/\.\d{3},\d{2}$/.test(raw)) {
        normalized = raw.replace(/\./g, '').replace(',', '.');
      } else {
        // US format or plain: remove thousands separators (comma or space), keep decimal dot
        normalized = raw.replace(/[,\s]/g, '');
      }
      const n = parseFloat(normalized);
      if (!isNaN(n) && n > 0) return n;
    }
  }
  return undefined;
}

function extractDate(text: string): string | undefined {
  for (const pattern of DATE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const raw = match[0];
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
    }
  }
  return undefined;
}

function extractMerchant(text: string): string | undefined {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 2 && !/^\d/.test(l));
  return lines[0] ?? undefined;
}

class OCRService {
  async extractReceiptData(imageSource: File | string): Promise<ReceiptData> {
    let imageSrc: string;

    if (imageSource instanceof File) {
      imageSrc = await this.fileToDataURL(imageSource);
    } else {
      imageSrc = imageSource;
    }

    const result = await Tesseract.recognize(imageSrc, 'spa+eng', {
      logger: () => { /* suppress progress logs */ },
    });

    const rawText = result.data.text;
    const confidence = result.data.confidence / 100;

    return {
      rawText,
      amount: extractAmount(rawText),
      date: extractDate(rawText),
      merchant: extractMerchant(rawText),
      confidence,
    };
  }

  private fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}

export const ocrService = new OCRService();
