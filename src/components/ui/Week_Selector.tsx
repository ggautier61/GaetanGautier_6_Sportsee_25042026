'use client';

import Image from "next/image";

import styles from './Week_Selector.module.css';

interface WeekSelectorProps {
  selectedWeek: number;
  onWeekChange: (week: number) => void;
  rangeWeeks?: number;
}

export function getWeekDates(weekOffset: number): { start: Date; end: Date } {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - weekOffset * 7 + mondayOffset);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return { start: weekStart, end: weekEnd };
}

function formatWeekRange(weekOffset: number, rangeWeeks: number): string {
    const firstWeekStart = getWeekDates(weekOffset + rangeWeeks - 1).start;
    const lastWeekEnd = getWeekDates(weekOffset).end;
    const startStr = firstWeekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    const endStr = lastWeekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    return `${startStr} - ${endStr}`;
}

export function WeekSelector({ selectedWeek, onWeekChange, rangeWeeks = 1 }: WeekSelectorProps) {
  return (
    <div className={styles.weekSelector}>
            <button 
              className={styles.weekArrow}
              onClick={() => onWeekChange(selectedWeek + 1)}
            >
              <Image src="/assets/arrow-left.png" width={6} height={6} alt="Précédent" />
            </button>
            <span className={styles.weekLabel}>{formatWeekRange(selectedWeek, rangeWeeks)}</span>
            <button 
              className={styles.weekArrow}
              onClick={() => onWeekChange(selectedWeek - 1)}
              disabled={selectedWeek === 0}
            >
              <Image src="/assets/arrow-right.png" width={6} height={6} alt="Suivant" />
            </button>
          </div>
  );
}
