import React, { useCallback, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useBackup } from '@/hooks/useBackup';
import { Button } from '@/components/ui/Button';

const BACKUP_DATE_KEY = 'fp-v3:lastBackup';

function loadLastBackupDate(): string | null {
  try { return localStorage.getItem(BACKUP_DATE_KEY); } catch { return null; }
}

function saveLastBackupDate(): void {
  try { localStorage.setItem(BACKUP_DATE_KEY, new Date().toISOString()); } catch { /* ignore */ }
}

export function BackupRestore() {
  const { isDark } = useTheme();
  const { exportData, importData: importFromFile, exportCSV } = useBackup();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [lastBackup, setLastBackup] = useState<string | null>(loadLastBackupDate);

  const handleExport = useCallback(() => {
    exportData();
    saveLastBackupDate();
    setLastBackup(new Date().toISOString());
    setStatus('✅ Backup exportado correctamente');
    setTimeout(() => setStatus(null), 3000);
  }, [exportData]);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importFromFile(file);
      setStatus('✅ Datos importados correctamente');
    } catch (err) {
      setStatus('❌ Error al importar: archivo inválido');
    }
    setTimeout(() => setStatus(null), 4000);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [importFromFile]);

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 0',
    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    gap: '12px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 600,
    color: isDark ? '#F1F5F9' : '#1E293B',
  };

  const subStyle: React.CSSProperties = {
    fontSize: '12px',
    color: isDark ? '#6B7280' : '#9CA3AF',
    marginTop: '2px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {status && (
        <div style={{
          padding: '10px 14px', borderRadius: '10px', marginBottom: '12px', fontSize: '13px', fontWeight: 600,
          background: status.startsWith('✅') ? (isDark ? 'rgba(34,197,94,0.15)' : 'rgba(34,197,94,0.1)') : (isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)'),
          color: status.startsWith('✅') ? '#22C55E' : '#EF4444',
        }}>
          {status}
        </div>
      )}

      <div style={rowStyle}>
        <div>
          <div style={labelStyle}>Exportar JSON</div>
          <div style={subStyle}>Descarga todas tus transacciones</div>
        </div>
        <Button variant="secondary" size="sm" onClick={handleExport}>⬇️ Exportar</Button>
      </div>

      <div style={rowStyle}>
        <div>
          <div style={labelStyle}>Exportar CSV</div>
          <div style={subStyle}>Compatible con Excel y hojas de cálculo</div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => exportCSV()}>📊 CSV</Button>
      </div>

      <div style={rowStyle}>
        <div>
          <div style={labelStyle}>Importar datos</div>
          <div style={subStyle}>Restaurar desde archivo JSON</div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>⬆️ Importar</Button>
        <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
      </div>

      {lastBackup && (
        <div style={{ padding: '12px 0', fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF' }}>
          Último backup: {new Date(lastBackup).toLocaleString('es-ES')}
        </div>
      )}
    </div>
  );
}
