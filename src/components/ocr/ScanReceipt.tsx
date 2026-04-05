import React, { useCallback, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { useOCR } from '@/hooks/useOCR';
import type { OCRResult as OCRResultType } from '@/hooks/useOCR';
import { OCRResult } from './OCRResult';

export function ScanReceipt() {
  const { isDark } = useTheme();
  const { scanImage, isProcessing, error } = useOCR();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<OCRResultType | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResult(null);
    try {
      const ocrResult = await scanImage(file);
      setResult(ocrResult);
    } catch { /* error handled by hook */ }
  }, [scanImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }, [handleFile]);

  const handleCamera = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  }, []);

  const dropZoneStyle: React.CSSProperties = {
    border: `2px dashed ${dragOver ? '#3B82F6' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)')}`,
    borderRadius: '16px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    background: dragOver
      ? (isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)')
      : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Drop zone */}
      {!preview && (
        <div
          style={dropZoneStyle}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Zona de carga de imagen"
          onKeyDown={(e) => { if (e.key === 'Enter') fileInputRef.current?.click(); }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B', marginBottom: '8px' }}>
            Arrastra un recibo aquí
          </div>
          <div style={{ fontSize: '13px', color: isDark ? '#6B7280' : '#9CA3AF', marginBottom: '16px' }}>
            o haz clic para seleccionar una imagen
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              📁 Seleccionar archivo
            </Button>
            {'mediaDevices' in navigator && (
              <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleCamera(); }}>
                📸 Cámara
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Image preview */}
      {preview && (
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', maxHeight: '300px' }}>
          <img src={preview} alt="Vista previa del recibo" style={{ width: '100%', height: '300px', objectFit: 'contain', background: isDark ? '#0F172A' : '#F8FAFC' }} />
          <button
            onClick={() => { setPreview(null); setResult(null); }}
            style={{
              position: 'absolute', top: '8px', right: '8px',
              background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
              width: '28px', height: '28px', color: '#fff', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Eliminar imagen"
          >
            ×
          </button>
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px', animation: 'spin 1s linear infinite' }}>⚙️</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: isDark ? '#CBD5E1' : '#374151' }}>
            Procesando imagen...
          </div>
          <div style={{ width: '100%', height: '4px', borderRadius: '2px', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden', marginTop: '12px' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #3B82F6, #6366F1)', animation: 'progress 1.5s ease-in-out infinite', borderRadius: '2px' }} />
          </div>
          <style>{`@keyframes progress { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 14px', borderRadius: '10px', background: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)', color: '#EF4444', fontSize: '13px', fontWeight: 600 }}>
          ❌ {error}
        </div>
      )}

      {/* OCR Result */}
      {result && (
        <OCRResult
          result={result}
          onRetry={() => { setPreview(null); setResult(null); }}
        />
      )}

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileInput} />
    </div>
  );
}
