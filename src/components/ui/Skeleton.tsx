import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export type SkeletonVariant = 'text' | 'circle' | 'card' | 'list' | 'rect';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

const SHIMMER_KEYFRAMES = `
@keyframes fp-shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
`;

function useShimmerStyle(isDark: boolean): React.CSSProperties {
  const base = isDark ? '#2A2A3E' : '#E9ECF0';
  const highlight = isDark ? '#3A3A52' : '#F5F7FA';
  return {
    backgroundImage: `linear-gradient(90deg, ${base} 0px, ${highlight} 80px, ${base} 160px)`,
    backgroundSize: '800px 100%',
    animation: 'fp-shimmer 1.4s ease-in-out infinite',
    borderRadius: '6px',
  };
}

export const Skeleton = React.memo(function Skeleton({
  variant = 'rect',
  width,
  height,
  style: extraStyle,
}: SkeletonProps) {
  const { isDark } = useTheme();
  const shimmer = useShimmerStyle(isDark);

  const getDefaultDimensions = (): React.CSSProperties => {
    switch (variant) {
      case 'text':
        return { width: width ?? '100%', height: height ?? '14px', borderRadius: '4px' };
      case 'circle':
        return {
          width: width ?? '40px',
          height: height ?? '40px',
          borderRadius: '50%',
        };
      case 'card':
        return { width: width ?? '100%', height: height ?? '120px', borderRadius: '16px' };
      case 'list':
        return { width: width ?? '100%', height: height ?? '56px', borderRadius: '12px' };
      case 'rect':
      default:
        return { width: width ?? '100%', height: height ?? '40px' };
    }
  };

  return (
    <>
      <style>{SHIMMER_KEYFRAMES}</style>
      <div
        style={{
          display: 'block',
          ...getDefaultDimensions(),
          ...shimmer,
          ...extraStyle,
        }}
        aria-hidden="true"
      />
    </>
  );
});

export interface SkeletonListProps {
  count?: number;
  variant?: SkeletonVariant;
  gap?: number;
  width?: string | number;
  height?: string | number;
}

export const SkeletonList = React.memo(function SkeletonList({
  count = 3,
  variant = 'list',
  gap = 12,
  width,
  height,
}: SkeletonListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} variant={variant} width={width} height={height} />
      ))}
    </div>
  );
});
