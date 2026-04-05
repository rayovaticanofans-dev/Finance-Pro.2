import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ChartTooltip } from './ChartTooltip';

export interface BarDataItem {
  label: string;
  value: number;
  value2?: number;
}

export interface BarChartProps {
  data: BarDataItem[];
  horizontal?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
  color?: string;
  color2?: string;
  width?: number;
  height?: number;
}

const PAD = { top: 20, right: 20, bottom: 40, left: 50 };

function niceMax(max: number): number {
  if (max === 0) return 10;
  const exp = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / exp) * exp;
}

function formatAxisValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(Math.round(v));
}

export const BarChart = React.memo(function BarChart({
  data,
  showGrid = true,
  showLabels = true,
  color = '#6366F1',
  color2 = '#22C55E',
  width: propWidth = 500,
  height: propHeight = 280,
}: BarChartProps) {
  const { isDark } = useTheme();
  const [animated, setAnimated] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; visible: boolean; content: React.ReactNode }>({
    x: 0, y: 0, visible: false, content: null,
  });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (data.length === 0) {
    return <div style={{ height: `${propHeight}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#4B5563' : '#D1D5DB', fontSize: '13px' }}>Sin datos</div>;
  }

  const chartW = propWidth - PAD.left - PAD.right;
  const chartH = propHeight - PAD.top - PAD.bottom;

  const hasGroups = data.some((d) => d.value2 !== undefined);
  const allValues = data.flatMap((d) => [d.value, ...(d.value2 !== undefined ? [d.value2] : [])]);
  const maxVal = niceMax(Math.max(...allValues));

  const gridLines = 5;
  const gridStep = maxVal / gridLines;
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) => i * gridStep);

  const barGroupWidth = chartW / data.length;
  const barPad = barGroupWidth * 0.2;
  const barWidth = hasGroups
    ? (barGroupWidth - barPad) / 2 - 2
    : barGroupWidth - barPad;

  const toY = (val: number) => chartH - (val / maxVal) * chartH;

  const handleBarHover = (e: React.MouseEvent, item: BarDataItem, isSecond = false) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
      content: (
        <div>
          <strong>{item.label}</strong>
          <br />
          {isSecond && item.value2 !== undefined ? (
            <span style={{ color: color2 }}>{formatAxisValue(item.value2)}</span>
          ) : (
            <span style={{ color }}>{formatAxisValue(item.value)}</span>
          )}
        </div>
      ),
    });
  };

  const textColor = isDark ? '#9CA3AF' : '#6B7280';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${propWidth} ${propHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Grid lines */}
          {showGrid && gridValues.map((v, i) => {
            const y = toY(v);
            return (
              <g key={i}>
                <line x1={0} y1={y} x2={chartW} y2={y} stroke={gridColor} strokeWidth={1} />
                <text x={-8} y={y} textAnchor="end" dominantBaseline="middle" style={{ fontSize: '11px', fill: textColor, fontFamily: 'inherit' }}>
                  {formatAxisValue(v)}
                </text>
              </g>
            );
          })}

          {/* X axis */}
          <line x1={0} y1={chartH} x2={chartW} y2={chartH} stroke={gridColor} strokeWidth={1} />

          {/* Bars */}
          {data.map((item, i) => {
            const groupX = i * barGroupWidth + barPad / 2;
            const barH1 = animated ? (item.value / maxVal) * chartH : 0;
            const barX1 = hasGroups ? groupX : groupX;
            const barX2 = groupX + barWidth + 2;
            const barH2 = item.value2 !== undefined && animated ? (item.value2 / maxVal) * chartH : 0;

            return (
              <g key={i}>
                {/* Primary bar */}
                <rect
                  x={barX1}
                  y={toY(animated ? item.value : 0)}
                  width={barWidth}
                  height={barH1}
                  rx={4}
                  fill={`url(#bar-grad-${color.replace('#', '')})`}
                  style={{ transition: 'y 0.5s cubic-bezier(0.34,1.56,0.64,1), height 0.5s cubic-bezier(0.34,1.56,0.64,1)', cursor: 'pointer' }}
                  onMouseMove={(e) => handleBarHover(e, item)}
                  onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                />

                {/* Secondary bar */}
                {hasGroups && item.value2 !== undefined && (
                  <rect
                    x={barX2}
                    y={toY(animated ? item.value2 : 0)}
                    width={barWidth}
                    height={barH2}
                    rx={4}
                    fill={`url(#bar-grad2-${color2.replace('#', '')})`}
                    style={{ transition: 'y 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1), height 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1)', cursor: 'pointer' }}
                    onMouseMove={(e) => handleBarHover(e, item, true)}
                    onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                  />
                )}

                {/* X label */}
                {showLabels && (
                  <text
                    x={groupX + (hasGroups ? barWidth : barWidth / 2)}
                    y={chartH + 14}
                    textAnchor="middle"
                    style={{
                      fontSize: '11px',
                      fill: textColor,
                      fontFamily: 'inherit',
                    }}
                  >
                    {item.label.length > 6 ? item.label.slice(0, 5) + '…' : item.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Gradient defs */}
          <defs>
            <linearGradient id={`bar-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id={`bar-grad2-${color2.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color2} stopOpacity="1" />
              <stop offset="100%" stopColor={color2} stopOpacity="0.6" />
            </linearGradient>
          </defs>

          <ChartTooltip x={tooltip.x - PAD.left} y={tooltip.y - PAD.top} visible={tooltip.visible}>
            {tooltip.content}
          </ChartTooltip>
        </g>
      </svg>
    </div>
  );
});
