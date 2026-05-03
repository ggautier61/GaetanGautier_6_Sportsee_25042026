import React from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  styleContent?: React.CSSProperties;
}

export function Card({ children, className = 'bg-[white]', style, styleContent}: CardProps) {
  return (
    <div className={`${styles.card} ${className}`} style={style}>
      <div className={styles.cardContent} style={styleContent}>{children}</div>
    </div>
  );
}

export default Card;