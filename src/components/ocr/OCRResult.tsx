import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import type { OCRResult as OCRResultType } from '@/hooks/useOCR';

interface OCRResultProps {
  result: OCRResultType;
  onRetry?: () => void;
  onCreateTransaction?: (data: { amount?: number; date?: string; desc?: string }) => void;
}

export function OCRResult({ result, onRetry, onCreateTransaction }: OCRResultProps) {
  const { isDark } = useTheme();
  const [amount, setAmount] = useState(result.amount?.toString() ?? '');
  const [date, setDate] = useState(result.date ?? new Date().toISOString().slice(0, 10));
  const [merchant, setMerchant] = useState(result.merchant ?? '');

  const confidence = result.confidence;
  const confidenceColor = confidence >= 0.8 ? '#22C55E' : confidence >= 0.5 ? '#F59E0B' : '#EF4444';
  const confidenceLabel = confidence >= 0.8 ? 'Alta' : confidence >= 0.5 ? 'Media' : 'Baja';

  const inputStyle: React.CSSProperties = {
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
    borderRadius: '8px',
    padding: '8px 12px',
    color: isDark ? '#F1F5F9' : '#1E293B',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: isDark ? '#6B7280' : '#9CA3AF',
    marginBottom: '4px',
    display: 'block',
  };

  return (
    <div style={{
      borderRadius: '16px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B' }}>
          Datos extraídos
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: confidenceColor }} />
          <span style={{ fontSize: '12px', color: confidenceColor, fontWeight: 600 }}>
            Confianza {confidenceLabel} ({Math.round(confidence * 100)}%)
          </span>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Editable fields */}
        <div>
          <label style={labelStyle}>Monto</label>
          <input
            type="number"
            style={inputStyle}
            value={amount}
            placeholder="0.00"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Fecha</label>
          <input
            type="date"
            style={inputStyle}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Comercio / Descripción</label>
          <input
            type="text"
            style={inputStyle}
            value={merchant}
            placeholder="Nombre del comercio..."
            onChange={(e) => setMerchant(e.target.value)}
          />
        </div>

        {/* Raw text preview */}
        {result.text && (
          <details>
            <summary style={{ fontSize: '12px', color: isDark ? '#6B7280' : '#9CA3AF', cursor: 'pointer', userSelect: 'none' }}>
              Ver texto extraído
            </summary>
            <pre style={{
              marginTop: '8px',
              padding: '10px',
              borderRadius: '8px',
              background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
              fontSize: '11px',
              color: isDark ? '#94A3B8' : '#6B7280',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '120px',
              overflowY: 'auto',
              fontFamily: 'monospace',
            }}>
              {result.text}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {onRetry && (
            <Button variant="ghost" size="sm" onClick={onRetry} fullWidth>
              🔄 Reintentar
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => onCreateTransaction?.({ amount: parseFloat(amount) || undefined, date, desc: merchant || undefined })}
            fullWidth
          >
            ✅ Crear Transacción
          </Button>
        </div>
      </div>
    </div>
  );
}
