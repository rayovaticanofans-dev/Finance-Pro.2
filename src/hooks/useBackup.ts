import { useCallback } from 'react';
import { useFinanceContext } from '@/contexts/FinanceContext';
import { useProfiles } from '@/contexts/ProfilesContext';
import { backupService } from '@/services/backup.service';
import type { Item } from '@/types/finance';

export function useBackup() {
  const { items, importData } = useFinanceContext();
  const { activeProfileId } = useProfiles();

  const exportData = useCallback((): void => {
    const data = backupService.exportToJSON({
      version: 3,
      exportedAt: new Date().toISOString(),
      profileId: activeProfileId,
      items,
    });
    const filename = `financepro-backup-${new Date().toISOString().slice(0, 10)}.json`;
    backupService.downloadFile(data, filename, 'application/json');
  }, [items, activeProfileId]);

  const importDataFromFile = useCallback(
    async (file: File): Promise<void> => {
      const text = await file.text();
      const parsed = backupService.importFromJSON(text);
      if (!backupService.validateExportData(parsed)) {
        throw new Error('Invalid backup file format');
      }
      importData(parsed.items);
    },
    [importData]
  );

  const exportCSV = useCallback(
    (itemsToExport?: Item[]): void => {
      const target = itemsToExport ?? items;
      const csv = backupService.exportToCSV(target);
      const filename = `financepro-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      backupService.downloadFile(csv, filename, 'text/csv;charset=utf-8;');
    },
    [items]
  );

  return { exportData, importData: importDataFromFile, exportCSV };
}
