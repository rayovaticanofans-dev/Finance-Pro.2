import { PageContainer } from '@/components/layout/PageContainer';
import { ScanReceipt } from '@/components/ocr/ScanReceipt';

export default function ScanReceiptPage() {
  return (
    <PageContainer title="Escanear recibo" subtitle="Extrae datos automáticamente de tus recibos">
      <ScanReceipt />
    </PageContainer>
  );
}
