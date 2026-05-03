'use client';

import { useState } from 'react';
import Image from "next/image";

import styles from './Week_Selector.module.css';



export function WeekSelector() {

    const [selectedWeek, setSelectedWeek] = useState(0);
    
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
        const startStr = start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        const endStr = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        return `${startStr} - ${endStr}`;
    }




  return (
    <div className={styles.weekSelector}>
            <button 
              className={styles.weekArrow}
              onClick={() => setSelectedWeek(prev => prev + 1)}
              // disabled={selectedWeek >= 10}
            >
                
              <Image src="/assets/arrow-left.png" width={6} height={6} alt="Précédent" />
            </button>
            <span className={styles.weekLabel}>{formatWeekRange(selectedWeek)}</span>
            <button 
              className={styles.weekArrow}
              onClick={() => setSelectedWeek(prev => prev - 1)}
              disabled={selectedWeek === 0}
            >
              <Image src="/assets/arrow-right.png" width={6} height={6} alt="Suivant" />
            </button>
          </div>
  );
}
