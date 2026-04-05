import { useCallback, useState } from 'react';
import { ocrService } from '@/services/ocr.service';
import type { ReceiptData } from '@/services/ocr.service';

export interface OCRResult {
  text: string;
  amount?: number;
  date?: string;
  merchant?: string;
  confidence: number;
}

export function useOCR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanImage = useCallback(
    async (imageSource: File | string): Promise<OCRResult> => {
      setIsProcessing(true);
      setError(null);
      try {
        const data: ReceiptData = await ocrService.extractReceiptData(imageSource);
        const result: OCRResult = {
          text: data.rawText,
          amount: data.amount,
          date: data.date,
          merchant: data.merchant,
          confidence: data.confidence,
        };
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'OCR processing failed';
        setError(message);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { scanImage, isProcessing, error, clearError };
}
