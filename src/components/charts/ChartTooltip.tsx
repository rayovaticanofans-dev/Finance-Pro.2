import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export interface ChartTooltipProps {
  x: number;
  y: number;
  visible: boolean;
  children?: React.ReactNode;
}

const TOOLTIP_W = 130;
const TOOLTIP_H = 60;
const OFFSET_X = 12;
const OFFSET_Y = -12;

export const ChartTooltip = React.memo(function ChartTooltip({
  x,
  y,
  visible,
  children,
}: ChartTooltipProps) {
  const { isDark } = useTheme();

  if (!visible) return null;

  // Auto-position: flip if near right/bottom edges
  // We render inside SVG foreignObject for full HTML support
  const flipX = x > 340; // approximate: flip left if near right edge
  const flipY = y < TOOLTIP_H; // flip down if near top

  const translateX = flipX ? x - TOOLTIP_W - OFFSET_X : x + OFFSET_X;
  const translateY = flipY ? y - OFFSET_Y : y + OFFSET_Y - TOOLTIP_H;

  return (
    <foreignObject
      x={translateX}
      y={translateY}
      width={TOOLTIP_W}
      height={TOOLTIP_H}
      style={{ overflow: 'visible', pointerEvents: 'none' }}
    >
      <div
        style={{
          background: isDark ? '#1E1E2E' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
          borderRadius: '10px',
          padding: '8px 12px',
          fontSize: '12px',
          color: isDark ? '#F1F5F9' : '#1E293B',
          boxShadow: isDark
            ? '0 8px 24px rgba(0,0,0,0.5)'
            : '0 8px 24px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
          lineHeight: '1.5',
          animation: 'fp-tooltip-in 0.15s ease',
          width: 'fit-content',
          minWidth: '80px',
        }}
      >
        <style>{`@keyframes fp-tooltip-in { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }`}</style>
        {children}
      </div>
    </foreignObject>
  );
});
