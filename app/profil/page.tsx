'use client';

import { Header } from '@/components/layout/Header';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import Card_Profil from '@/components/ui/Card_Profil';
import Card_Stats from '@/components/ui/Card_Stats';
import { getUserById } from '@/hooks/useUser';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatGender(gender: string): string {
  const map: Record<string, string> = { female: 'Femme', male: 'Homme' };
  return map[gender] || gender;
}



export default function ProfilPage() {
  const router = useRouter();
  const user = getUserById('user123');

  if (!user) {
    return <p>Utilisateur non trouvé</p>;
  }

  const memberSince = user.createdAt ? formatDate(user.createdAt) : 'Date inconnue';
  const fullName = `${user.firstName} ${user.lastName}`;

  const { hours, minutes } = user.getTempsTotalCouru();

  return (
    <div className="flex flex-col items-center">
      <main className="pt-9" style={{ width: '1140px', maxWidth: '1140px', minHeight: '100vh' }}>
        <Header isAuthenticated={true} onLogout={() => router.push('/login')} />

        <div className="py-[108px] px-[40px] flex gap-[57px] min-h-[calc(100vh-200px)]">

          {/* Profil */}
          <section className='flex flex-col gap-4' style={{ width: '508px' }}>
            {/* Card Profil */}
            <Card className="bg-[white] px-[32px] py-[24px]">
              <Card_Profil fullName={fullName} memberSince={memberSince} />
            </Card>

            {/* Card Votre profil */}
            <Card className="bg-[white] pt-[40px] pb-[60px] px-[28px]">
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 500 }}>Votre profil</h2>
                <hr className="my-[20px] border-[var(--blueclairsportsee)]" />
                <div className="flex flex-col gap-y-6 gap-x-12" style={{fontSize: '16px', fontWeight: 500, color: 'var(--grissportsee)'}}>
                  <div className="flex items-center gap-2">
                    <span>Âge : 29</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Genre : {formatGender(user.gender || '')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Taille : {user.height && typeof user.height === 'number' 
                        && !isNaN(user.height) ? (user.height / 100).toFixed(2).toString().replace('.', 'm') : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Poids : {user.weight}kg</span>
                  </div>
                </div>
              </div>
            </Card>

          </section>

          {/* Statistiques */}
          <section className='flex flex-col gap-5' style={{ flex: '1' }}>

            <div className="flex flex-col">
              <h2 style={{ fontSize: '22px', fontWeight: 500 }}>Vos statistiques</h2>
              <p style={{color: 'var(--grissportsee)', fontSize: 14}}>depuis le {formatDate(user.createdAt || '')}</p>
            </div>
            

            <div>
              <div className='grid grid-cols-2 gap-5'>
                
                <Card_Stats title="Temps total couru" indicator={`${hours}h`} text={`${minutes} min`} />
                <Card_Stats title="Calories totales brûlées" indicator={`${user.getTotalCalories()}`} text="cal" />
                <Card_Stats title="Distance totale parcourue" indicator={`${user.getTotalDistance()}`} text="km" />
                <Card_Stats title="Nombre de jours de repos" indicator={`${user.getJoursSansCourse()}`} text="jours" />
                <Card_Stats title="Nombre de sessions" indicator={`${user.getTotalSessions()}`} text="sessions" />
              </div>

            </div>
            

          </section>

        </div>
      </main>
    </div>
  );
}
