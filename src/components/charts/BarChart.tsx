'use client';

import { useState } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
  
} from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';


import styles from './BarChart.module.css';
import runningData from '../../../mocks/data.json';
import CustomLegend from './CustomLegend';
import Image from "next/image";


type ChartType = 'distance' | 'heartRate';

interface BarChartProps {
  type: ChartType;
  startingDate: string;
  endingDate: string;
}

interface ChartData {
  name: string;
  value?: number;
  max?: number;
  moyPlus?: number;
  moyMinus?: number;
  min?: number;
}

const DAYS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

function processDistanceData(runningData: any[], startingDate: string, endingDate: string): ChartData[] {
  const start = new Date(startingDate);

  const result: ChartData[] = [];

  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    let total = 0;
    runningData.forEach((run) => {
      const runDate = new Date(run.date);
      if (runDate >= weekStart && runDate <= weekEnd) {
        total += run.distance;
      }
    });

    result.push({
      name: `S${i + 1}`,
      value: Math.round(total * 10) / 10,
    });
  }

  return result;
}

function processHeartRateData(runningData: any[], startingDate: string, endingDate: string): ChartData[] {
  const weekStart = new Date(startingDate);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(endingDate);
  weekEnd.setHours(23, 59, 59, 999);

  const weekRuns: { [key: number]: any } = {};
  
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);
    weekRuns[i] = null;
  }

  runningData.forEach((run) => {
    const runDate = new Date(run.date);
    if (runDate >= weekStart && runDate <= weekEnd) {
      const dayIndex = runDate.getDay() === 0 ? 6 : runDate.getDay() - 1;
      weekRuns[dayIndex] = run;
    }
  });

  return DAYS.map((day, index) => {
    const run = weekRuns[index];
    if (!run) {
      return { name: day, max: 0, moyPlus: 0, moyMinus: 0, min: 0 };
    }
    
    const avg = run.heartRate.average;
    const moyPlus = avg + 10;
    const moyMinus = avg - 10;
    
    return {
      name: day,
      min: run.heartRate.min,
      max: run.heartRate.max,
      average: run.heartRate.average,
    };
  });
}

export function BarChart({ type, startingDate, endingDate  }: BarChartProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const data = type === 'distance' 
    ? processDistanceData(runningData[0].runningData, startingDate, endingDate)
    : processHeartRateData(runningData[0].runningData, startingDate, endingDate);

  if (data.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <p>Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>

      <ResponsiveContainer width="100%" height='100%'>
        <ComposedChart data={data}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: '#747a82' }}
            axisLine={true}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#747a82' }}
            axisLine={true}
            tickLine={false}
          />

          <Legend align="left" content={<CustomLegend />} />

          {type === 'distance' ? (
            <Bar 
              dataKey="value" 
              name="Km"
              fill="#B6BDFC" 
              // legendType='circle'
              radius={[7, 7, 7, 7]}
              barSize={14}
            />
          ) : (
            <>
              <Bar 
                dataKey="min" 
                name="Min"
                fill="var(--rougeclairsportsee)" 
                radius={[7, 7, 7, 7]}
                barSize={14}
                legendType='circle'
                fontSize={12}
                fontWeight={400}
                
              />
              <Bar 
                dataKey="max" 
                name="Max BPM"
                fill="var(--rougesportsee)" 
                radius={[7, 7, 7, 7]}
                barSize={14}
                legendType='circle'
              />
              
              <Line type="monotone" 
                  dataKey="average" 
                  name="Average BPM" 
                  stroke={isHovered ? "#0B23F4" : "var(--grisclairsportsee)"}
                  strokeWidth={3}
                  dot={{ stroke: "white", fill: "var(--bluesportsee)", strokeWidth: 1, r: 4 }}
                  activeDot={{ stroke: "var(--bluesportsee)", fill: "var(--bluesportsee)", r: 4 }} />
              
            </>
          )}
          
          <RechartsDevtools />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;