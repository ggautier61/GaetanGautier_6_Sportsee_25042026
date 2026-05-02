'use client';

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import styles from './ObjectivePieChart.module.css';

interface ObjectivePieChartProps {
  achieved?: number;
  remaining?: number;
}

function CustomLegend({ payload }: any) {
  return (
    <ul className={styles.legend}>
      {payload?.map((entry: any, index: number) => (
        <li key={`item-${index}`} className={styles.legendItem}>
          <span
            className={styles.dot}
            style={{ backgroundColor: entry.color }}
          />
          <span className={styles.legendText}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ObjectivePieChart({
  achieved = 4,
  remaining = 2,
}: ObjectivePieChartProps) {
  const data = [
    { name: 'Objectifs réussis', value: achieved, color: '#0B23F4' },
    { name: 'Objectifs restants', value: remaining, color: '#B6BDFC' },
  ];

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            content={<CustomLegend />}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
