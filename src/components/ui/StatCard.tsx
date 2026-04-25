import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: 'activity' | 'heart' | 'flame' | 'clock';
}

function getIcon(iconType: string) {
  switch (iconType) {
    case 'activity':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3-9-4 4-4-9h4l3 9-4 4-3-9h4" />
        </svg>
      );
    case 'heart':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case 'flame':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c0 4-4 6-4 10a4 4 0 108 0c0-4-4-6-4-10z" />
        </svg>
      );
    case 'clock':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    default:
      return null;
  }
}

function getIconClass(iconType: string) {
  switch (iconType) {
    case 'activity':
      return styles.iconBlue;
    case 'heart':
      return styles.iconPink;
    case 'flame':
      return styles.iconOrange;
    case 'clock':
      return styles.iconPurple;
    default:
      return styles.iconPink;
  }
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <div className={`${styles.iconWrapper} ${getIconClass(icon)}`}>
        {getIcon(icon)}
      </div>
      <div className={styles.statInfo}>
        <p className={styles.statValue}>{value}</p>
        <p className={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

export default StatCard;