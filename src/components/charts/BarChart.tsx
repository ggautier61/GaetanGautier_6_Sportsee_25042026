'use client';

import React, { useMemo, useState } from 'react';
import styles from './BarChart.module.css';

interface BarChartData {
  name: string;
  value: number;
}

interface BarChartProps {
  title?: string;
  data: BarChartData[];
}

export function BarChart({ title = 'Fréquence cardiaque', data }: BarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  
  const chartWidth = 400;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const { bars, maxValue, barWidth } = useMemo(() => {
    if (data.length === 0) {
      return { bars: [], maxValue: 100, barWidth: 0 };
    }

    const max = Math.max(...data.map((d) => d.value), 10);
    const barWidth = (innerWidth / data.length) * 0.6;
    const gap = (innerWidth / data.length) * 0.4;

    const barData = data.map((d, i) => {
      const barHeight = (d.value / max) * innerHeight;
      return {
        ...d,
        x: padding.left + gap / 2 + i * (barWidth + gap),
        height: barHeight,
        y: padding.top + innerHeight - barHeight,
      };
    });

    return { bars: barData, maxValue: max, barWidth };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className={styles.chartContainer}>
        {title && <h3 className={styles.chartTitle}>{title}</h3>}
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className={styles.barChart}>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + innerHeight * ratio;
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={chartWidth - padding.right}
              y2={y}
              stroke="#e8e8e8"
              strokeDasharray="4 4"
            />
          );
        })}

        {bars.map((bar, i) => (
          <g key={i}>
            <rect
              x={bar.x}
              y={bar.y}
              width={barWidth}
              height={bar.height}
              rx={4}
              fill={hoveredBar === i ? '#ff7181' : '#ff8fa0'}
              className={styles.bar}
              onMouseEnter={() => setHoveredBar(i)}
              onMouseLeave={() => setHoveredBar(null)}
            />
            <text
              x={bar.x + barWidth / 2}
              y={chartHeight - 10}
              textAnchor="middle"
              className={styles.barLabel}
            >
              {bar.name}
            </text>
            {hoveredBar === i && (
              <text
                x={bar.x + barWidth / 2}
                y={bar.y - 8}
                textAnchor="middle"
                className={styles.barValue}
              >
                {bar.value}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default BarChart;