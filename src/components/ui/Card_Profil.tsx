import Image from "next/image";
import styles from './Card_Profil.module.css';


interface Card_ProfilProps {
  fullName?: string;
  memberSince?: string;
}

export default function Card_Profil({ fullName, memberSince }: Card_ProfilProps) {

  return (
      <div className="flex items-center gap-[38px]">
        <div className={styles.imgContainer}>
          <Image src="/assets/Profil_1.png" alt="Profil_1_2" width={208} height={234} className="object-cover w-full h-full" />
        </div>
        <div className="flex flex-col gap-1 justify-center">
            <h2 style={{fontSize: '22px', fontWeight: 500}}>{fullName || 'Nom de l\'utilisateur'}</h2>
            <p style={{fontSize: '14px', color: 'var(--grissportsee)'}}>Membre depuis le {memberSince || 'Date inconnue'}</p>
        </div>
      </div>
  );
}
