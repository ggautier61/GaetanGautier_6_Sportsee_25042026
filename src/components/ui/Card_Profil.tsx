import Image from "next/image";
import styles from './Card_Profil.module.css';
import Card_Distance from "./Card_Distance";

export function Card_Profil() {
  return (
    <div className={`${styles.card} ${styles.test} px-[52px] py-[24px] flex justify-between items-center`}>
      <div className="flex items-center gap-4">
        <div className={styles.imgContainer}>
          <Image src="/assets/Profil_1.png" alt="Profil_1_2" width={208} height={234} className="object-cover w-full h-full" />
        </div>
        <div className="flex flex-col gap-1 justify-center">
            <h2 style={{fontSize: '22px'}}>Clara Dupont</h2>
            <p style={{fontSize: '14px', color: 'var(--grissportsee)'}}>Membre depuis le 14 juin 2023</p>
        </div>
      </div>

      
      
        <Card_Distance distance={312} />
     
    </div>
  );
}

export default Card_Profil;