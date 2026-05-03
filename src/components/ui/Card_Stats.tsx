import Image from "next/image";
import styles from './Card_Profil.module.css';
import { Card } from "./Card";


interface Card_StatsProps {
    title?: string;
    indicator?: string;
    text?: string;
}

export default function Card_Stats({ title, indicator, text }: Card_StatsProps) {

  return (
      <Card className='bg-[var(--bluesportsee)] px-[30px] py-[20px] flex flex-col justify-between gap-4' styleContent={{gap: '10px'}}  >
        <div style={{fontSize: 14, color: 'white'}}>{title}</div>
        <div className='flex items-end'>
            <span style={{fontSize: 24, fontWeight: 500, color: 'white', lineHeight: 1}}>{indicator}</span>
            <span style={{fontSize: 14, color: 'var(--blueclairsportsee)', marginLeft: 4, lineHeight: 1.1}}>{text}</span>
        </div>
    </Card>
  );
}