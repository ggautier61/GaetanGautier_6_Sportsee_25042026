import React from 'react';
import Image from "next/image";
import styles from './Card_IA.module.css';

export function Card_IA() {
  return (
    <div className={`${styles.card} ${styles.test} px-[52px] py-[24px] flex justify-between`}>
      <div className="flex items-center gap-4" style={{color: 'var(--bluesportsee)'}}>
        <Image src="/assets/Icon_AI.png" alt="Icon IA" width={16} height={16} />
        Posez vos questions sur votre programme, vos performances ou vos objectifs.
      </div>

      {/* Bouton Lancer une conversation */}
      <div className="px-[40px] py-[16px]" style={{backgroundColor: 'var(--bluesportsee)', color: 'white', borderRadius: '10px'}}>
        Lancer une conversation
      </div>
    </div>
  );
}

export default Card_IA;