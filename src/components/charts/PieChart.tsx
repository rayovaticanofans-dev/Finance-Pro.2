import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ChartTooltip } from './ChartTooltip';

export interface PieDataItem {
  label: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  data: PieDataItem[];
  size?: number;
  innerRadius?: number;
  showLegend?: boolean;
  centerText?: string;
  centerSubtext?: string;
}

interface SliceInfo {
  path: string;
  midX: number;
  midY: number;
  percentage: number;
  item: PieDataItem;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildArcPath(cx: number, cy: number, r: number, inner: number, startAngle: number, endAngle: number): string {
  const gap = 0.5; // degrees gap between slices
  const s = startAngle + gap / 2;
  const e = endAngle - gap / 2;
  const outerStart = polarToCartesian(cx, cy, r, s);
  const outerEnd = polarToCartesian(cx, cy, r, e);
  const innerStart = polarToCartesian(cx, cy, inner, e);
  const innerEnd = polarToCartesian(cx, cy, inner, s);
  const largeArc = e - s > 180 ? 1 : 0;
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${inner} ${inner} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    'Z',
  ].join(' ');
}

export const PieChart = React.memo(function PieChart({
  data,
  size = 220,
  innerRadius,
  showLegend = true,
  centerText,
  centerSubtext,
}: PieChartProps) {
  const { isDark } = useTheme();
  const [animated, setAnimated] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; visible: boolean; content: React.ReactNode }>({
    x: 0, y: 0, visible: false, content: null,
  });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(t);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 8;
  const donut = innerRadius ?? outerR * 0.55;

  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0 || data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: `${size}px`, color: isDark ? '#4B5563' : '#D1D5DB', fontSize: '13px' }}>
        Sin datos
      </div>
    );
  }

  let currentAngle = 0;
  const slices: SliceInfo[] = data.map((item) => {
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    const midAngle = startAngle + angle / 2;
    const midR = (outerR + donut) / 2;
    const mid = polarToCartesian(cx, cy, midR, midAngle);
    currentAngle += angle;
    return {
      path: buildArcPath(cx, cy, outerR, donut, startAngle, endAngle),
      midX: mid.x,
      midY: mid.y,
      percentage: (item.value / total) * 100,
      item,
    };
  });

  const handleMouseMove = (e: React.MouseEvent<SVGPathElement>, slice: SliceInfo) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      visible: true,
      content: (
        <div>
          <strong>{slice.item.label}</strong>
          <br />
          <span>{slice.percentage.toFixed(1)}%</span>
        </div>
      ),
    });
  };

  const handleMouseLeave = () => {
    setTooltip((t) => ({ ...t, visible: false }));
    setHoveredIndex(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible', position: 'relative' }}
      >
        {slices.map((slice, i) => {
          const isHovered = hoveredIndex === i;
          const scale = isHovered ? 1.04 : animated ? 1 : 0;
          return (
            <path
              key={i}
              d={slice.path}
              fill={slice.item.color}
              opacity={hoveredIndex !== null && !isHovered ? 0.65 : 1}
              style={{
                transformOrigin: `${cx}px ${cy}px`,
                transform: `scale(${scale})`,
                transition: animated
                  ? `transform 0.2s ease, opacity 0.2s ease`
                  : 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
                cursor: 'pointer',
                filter: isHovered ? `drop-shadow(0 4px 12px ${slice.item.color}66)` : 'none',
              }}
              onMouseMove={(e) => { setHoveredIndex(i); handleMouseMove(e, slice); }}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}

        {/* Center text */}
        {centerText && (
          <>
            <text
              x={cx}
              y={cy - (centerSubtext ? 8 : 2)}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: '16px', fontWeight: 800, fill: isDark ? '#F1F5F9' : '#1E293B', fontFamily: 'inherit' }}
            >
              {centerText}
            </text>
            {centerSubtext && (
              <text
                x={cx}
                y={cy + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: '11px', fill: isDark ? '#6B7280' : '#9CA3AF', fontFamily: 'inherit' }}
              >
                {centerSubtext}
              </text>
            )}
          </>
        )}

        <ChartTooltip x={tooltip.x} y={tooltip.y} visible={tooltip.visible}>
          {tooltip.content}
        </ChartTooltip>
      </svg>

      {showLegend && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'center', maxWidth: `${size + 40}px` }}>
          {data.map((item, i) => (
            <div
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: isDark ? '#CBD5E1' : '#374151', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
