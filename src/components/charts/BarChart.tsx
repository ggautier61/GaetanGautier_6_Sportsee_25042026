'use client';

import React, { useState, useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Line,
  LineChart,
  
} from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

import styles from './BarChart.module.css';
import runningData from '../../../mocks/data.json';

type ChartType = 'distance' | 'heartRate';

interface BarChartProps {
  type: ChartType;
  title?: string;
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

function processDistanceData(runningData: any[]) {
  const today = new Date();
  const fourWeeksAgo = new Date(today);
  fourWeeksAgo.setDate(today.getDate() - 72);

  const filtered = runningData.filter((run) => {
    const date = new Date(run.date);
    return date >= fourWeeksAgo && date <= today;
  });

  const weeklyData: { [key: string]: number } = {};
  
  filtered.forEach((run) => {
    const date = new Date(run.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay() + 1);
    const weekKey = `S${getWeekNumber(weekStart)}`;
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = 0;
    }
    weeklyData[weekKey] += run.distance;
  });

  return Object.entries(weeklyData).map(([name, value]) => ({
    name,
    value: Math.round(value * 10) / 10,
  })) as ChartData[];
}

function getWeekDates(weekOffset: number): { start: Date; end: Date } {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - weekOffset * 7 + mondayOffset);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  return { start: weekStart, end: weekEnd };
}

function formatWeekRange(weekOffset: number): string {
  const { start, end } = getWeekDates(weekOffset);
  const startStr = start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  const endStr = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  return `${startStr} - ${endStr}`;
}

function processHeartRateData(runningData: any[], weekOffset: number): ChartData[] {
  const today = new Date().toLocaleDateString('fr-FR');
  // today = new Date(today);

  
  const currentDay = new Date().getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  
  const weekStart = new Date();
  weekStart.setDate(new Date().getDate() - weekOffset * 7 + mondayOffset);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6)
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

export function BarChart({ type, title }: BarChartProps) {
  const [selectedWeek, setSelectedWeek] = useState(0);
  
  const data = type === 'distance' 
    ? processDistanceData(runningData[0].runningData)
    : processHeartRateData(runningData[0].runningData, selectedWeek);

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
      <div className={styles.chartHeader}>
        {title && <h3 className={styles.chartTitle}>{title}</h3>}
        {type === 'heartRate' && (
          <div className={styles.weekSelector}>
            <button 
              className={styles.weekArrow}
              onClick={() => setSelectedWeek(prev => prev + 1)}
              // disabled={selectedWeek >= 10}
            >
              ←
            </button>
            <span className={styles.weekLabel}>{formatWeekRange(selectedWeek)}</span>
            <button 
              className={styles.weekArrow}
              onClick={() => setSelectedWeek(prev => prev - 1)}
              disabled={selectedWeek === 0}
            >
              →
            </button>
          </div>
        )}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} height={300} >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: '#747a82' }}
            // axisLine={{ stroke: '#eee' }}
            axisLine={true}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#747a82' }}
            axisLine={true}
            tickLine={false}
            // domain={[120, 190]}
          />
          {/* <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #eee', 
              borderRadius: 4,
              fontSize: 12,
            }}
          /> */}
          <Legend align='left' fontSize={12}/>

          {type === 'distance' ? (
            <Bar 
              dataKey="value" 
              name="km"
              fill="#B6BDFC" 
              legendType='circle'
              radius={[7, 7, 7, 7]}
              barSize={14}
            />
          ) : (
            <>
              <Bar 
                dataKey="min" 
                name="Min BPM"
                fill="#FCC1B6" 
                radius={[7, 7, 7, 7]}
                barSize={14}
                legendType='circle'
                
              />
              <Bar 
                dataKey="max" 
                name="Max BPM"
                fill="#F4320B" 
                radius={[7, 7, 7, 7]}
                barSize={14}
                legendType='circle'
              />
              {/* <Bar 
                dataKey="moyMinus" 
                name="FC Moy-"
                fill="#4D96C8" 
                radius={[7, 7, 7, 7]}
                barSize={14}
              /> */}
              <Line type="monotone" dataKey="average" name="Average BPM" />
              <RechartsDevtools />
              
              {/* <Bar 
                dataKey="min" 
                name="FC Min"
                fill="#FCC1B6" 
                radius={[4, 4, 0, 0]}
                barSize={14}
              /> */}
              {/* <ReferenceLine y={160} stroke="#4CAF50" strokeDasharray="5 5" label={{ value: 'Zone cible', fontSize: 10, fill: '#4CAF50' }} /> */}
            </>
          )}

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChart;