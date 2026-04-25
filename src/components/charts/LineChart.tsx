'use client';

import React, { useMemo } from 'react';
import styles from './LineChart.module.css';

interface LineChartData {
  date: string;
  actual: number;
  goal: number;
}

interface LineChartProps {
  title?: string;
  data: LineChartData[];
  dataKey?: string;
}

export function LineChart({ title = 'Progression', data }: LineChartProps) {
  const chartWidth = 600;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const { maxValue, pointsGoal, pointsActual, xLabels } = useMemo(() => {
    if (data.length === 0) {
      return { maxValue: 100, pointsGoal: '', pointsActual: '', xLabels: [] };
    }

    const max = Math.max(...data.map((d) => Math.max(d.actual, d.goal)), 10);

    const xScale = (index: number) => padding.left + (index / (data.length - 1)) * innerWidth;
    const yScale = (value: number) => padding.top + innerHeight - (value / max) * innerHeight;

    const goalPoints = data
      .map((d, i) => `${xScale(i)},${yScale(d.goal)}`)
      .join(' ');
    const actualPoints = data
      .map((d, i) => `${xScale(i)},${yScale(d.actual)}`)
      .join(' ');

    const labels = data.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    });

    return { maxValue: max, pointsGoal: goalPoints, pointsActual: actualPoints, xLabels: labels };
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
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotGoal}`}></span>
          Objectif
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendDotActual}`}></span>
          Réel
        </div>
      </div>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className={styles.chart}>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding.top + innerHeight * ratio;
          return (
            <line
              key={i}
              x1={padding.left}
              y1={y}
              x2={chartWidth - padding.right}
              y2={y}
              className={styles.gridLine}
            />
          );
        })}

        {pointsGoal && (
          <polyline
            fill="none"
            stroke="#ff7181"
            strokeWidth={2}
            points={pointsGoal}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {pointsActual && (
          <polyline
            fill="none"
            stroke="#9376ff"
            strokeWidth={2}
            points={pointsActual}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {data.map((_, i) => {
          const x = padding.left + (i / (data.length - 1)) * innerWidth;
          return (
            <text
              key={i}
              x={x}
              y={chartHeight - 8}
              textAnchor="middle"
              className={styles.axisLabel}
            >
              {xLabels[i]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default LineChart;