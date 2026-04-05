import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ChartTooltip } from './ChartTooltip';

export interface LineDataItem {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: LineDataItem[];
  showArea?: boolean;
  showPoints?: boolean;
  color?: string;
  gradient?: boolean;
  width?: number;
  height?: number;
}

const PAD = { top: 20, right: 20, bottom: 36, left: 50 };

function formatAxisValue(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return String(Math.round(v));
}

function niceMax(max: number): number {
  if (max === 0) return 10;
  const exp = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / exp) * exp;
}

/** Cubic bezier control points for smooth curve */
function smoothPath(points: Array<{ x: number; y: number }>): string {
  if (points.length < 2) return points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    d += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export const LineChart = React.memo(function LineChart({
  data,
  showArea = true,
  showPoints = true,
  color = '#6366F1',
  gradient = true,
  width: propWidth = 500,
  height: propHeight = 260,
}: LineChartProps) {
  const { isDark } = useTheme();
  const [animated, setAnimated] = useState(false);
  const [pathLength, setPathLength] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; visible: boolean; content: React.ReactNode }>({
    x: 0, y: 0, visible: false, content: null,
  });
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [data]);

  if (data.length === 0) {
    return <div style={{ height: `${propHeight}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#4B5563' : '#D1D5DB', fontSize: '13px' }}>Sin datos</div>;
  }

  const chartW = propWidth - PAD.left - PAD.right;
  const chartH = propHeight - PAD.top - PAD.bottom;

  const maxVal = niceMax(Math.max(...data.map((d) => d.value)));
  const gridLines = 4;
  const gridStep = maxVal / gridLines;
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) => i * gridStep);

  const toX = (i: number) => (i / (data.length - 1)) * chartW;
  const toY = (val: number) => chartH - (val / maxVal) * chartH;

  const points = data.map((d, i) => ({ x: toX(i), y: toY(d.value) }));
  const linePath = smoothPath(points);

  // Area path: line + close to bottom
  const areaPath = linePath + ` L ${points[points.length - 1].x} ${chartH} L ${points[0].x} ${chartH} Z`;

  const gradId = `line-grad-${color.replace('#', '')}`;
  const areaGradId = `area-grad-${color.replace('#', '')}`;

  const textColor = isDark ? '#9CA3AF' : '#6B7280';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  const handlePointHover = (e: React.MouseEvent, item: LineDataItem, i: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setHoveredIndex(i);
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
      content: (
        <div>
          <strong>{item.label}</strong>
          <br />
          <span>{formatAxisValue(item.value)}</span>
        </div>
      ),
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        width="100%"
        viewBox={`0 0 ${propWidth} ${propHeight}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
          <linearGradient id={areaGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <g transform={`translate(${PAD.left},${PAD.top})`}>
          {/* Grid lines */}
          {gridValues.map((v, i) => {
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

          {/* X labels */}
          {data.map((d, i) => {
            // Show every Nth label if too many
            const step = Math.ceil(data.length / 8);
            if (i % step !== 0 && i !== data.length - 1) return null;
            return (
              <text
                key={i}
                x={toX(i)}
                y={chartH + 16}
                textAnchor="middle"
                style={{ fontSize: '11px', fill: textColor, fontFamily: 'inherit' }}
              >
                {d.label.length > 5 ? d.label.slice(0, 4) + '…' : d.label}
              </text>
            );
          })}

          {/* Area fill */}
          {showArea && (
            <path
              d={areaPath}
              fill={gradient ? `url(#${areaGradId})` : color}
              fillOpacity={gradient ? 1 : 0.1}
            />
          )}

          {/* Line */}
          <path
            ref={pathRef}
            d={linePath}
            fill="none"
            stroke={gradient ? `url(#${gradId})` : color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength || undefined}
            strokeDashoffset={animated ? 0 : pathLength}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
          />

          {/* Hover vertical line */}
          {hoveredIndex !== null && (
            <line
              x1={toX(hoveredIndex)}
              y1={0}
              x2={toX(hoveredIndex)}
              y2={chartH}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="4,4"
              opacity={0.5}
            />
          )}

          {/* Points */}
          {showPoints && data.map((d, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <circle
                key={i}
                cx={toX(i)}
                cy={toY(d.value)}
                r={isHovered ? 6 : 4}
                fill={color}
                stroke={isDark ? '#1E1E2E' : '#fff'}
                strokeWidth={2}
                style={{ transition: 'r 0.2s ease', cursor: 'pointer' }}
                onMouseMove={(e) => handlePointHover(e, d, i)}
                onMouseLeave={() => { setHoveredIndex(null); setTooltip((t) => ({ ...t, visible: false })); }}
              />
            );
          })}

          <ChartTooltip x={tooltip.x - PAD.left} y={tooltip.y - PAD.top} visible={tooltip.visible}>
            {tooltip.content}
          </ChartTooltip>
        </g>
      </svg>
    </div>
  );
});
