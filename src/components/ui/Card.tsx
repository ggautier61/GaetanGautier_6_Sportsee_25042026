import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className = 'bg-[white]', style}: CardProps) {
  return (
    <div className={`${styles.card} ${className}`} style={style}>
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
}

export default Card;