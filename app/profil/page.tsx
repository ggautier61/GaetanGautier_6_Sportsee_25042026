'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import Card_Profil from '@/components/ui/Card_Profil';
import Card_Stats from '@/components/ui/Card_Stats';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

interface RunningData {
  date: string;
  distance: number;
  duration: number;
  heartRate: { min: number; max: number; average: number };
  caloriesBurned: number;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ProfilPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/home');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return <p>Chargement...</p>;
  }

  const profile = user.info?.profile;
  const runningData: RunningData[] = user.activity || [];

  if (!profile) {
    return <p>Impossible de charger le profil</p>;
  }

  const memberSince = profile.createdAt ? formatDate(profile.createdAt) : 'Date inconnue';
  const fullName = `${profile.firstName} ${profile.lastName}`;

  const totalMinutes = runningData.reduce((sum, s) => sum + s.duration, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const totalCalories = runningData.reduce((sum, s) => sum + s.caloriesBurned, 0);
  const totalDistance = user.info?.statistics.totalDistance || runningData.reduce((sum, s) => sum + s.distance, 0);
  const totalSessions = user.info?.statistics.totalSessions || runningData.length;

  const uniqueRunDays = new Set(runningData.map((s) => new Date(s.date).toDateString()));
  const firstDate = runningData.length > 0
    ? new Date(Math.min(...runningData.map((s) => new Date(s.date).getTime())))
    : null;
  const startDate = profile.createdAt ? new Date(profile.createdAt) : firstDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const totalDays = startDate
    ? Math.round((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;
  const joursSansCourse = totalDays - uniqueRunDays.size;

  return (
    <div className="flex flex-col h-full w-full items-center">
      <main className="h-full pt-9" style={{ width: '1140px', maxWidth: '1140px' }}>
        <Header />

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
                    <span>Âge : {profile.age} ans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Taille : {profile.height ? (profile.height / 100).toFixed(2).toString().replace('.', 'm') : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Poids : {profile.weight} kg</span>
                  </div>
                </div>
              </div>
            </Card>

          </section>

          {/* Statistiques */}
          <section className='flex flex-col gap-5' style={{ flex: '1' }}>

            <div className="flex flex-col">
              <h2 style={{ fontSize: '22px', fontWeight: 500 }}>Vos statistiques</h2>
              <p style={{color: 'var(--grissportsee)', fontSize: 14}}>depuis le {formatDate(profile.createdAt || '')}</p>
            </div>
            

            <div>
              <div className='grid grid-cols-2 gap-5'>
                
                <Card_Stats title="Temps total couru" indicator={`${hours}h`} text={`${minutes} min`} />
                <Card_Stats title="Calories totales brûlées" indicator={`${totalCalories}`} text="cal" />
                <Card_Stats title="Distance totale parcourue" indicator={`${totalDistance}`} text="km" />
                <Card_Stats title="Nombre de jours de repos" indicator={`${joursSansCourse}`} text="jours" />
                <Card_Stats title="Nombre de sessions" indicator={`${totalSessions}`} text="sessions" />
              </div>

            </div>
            

          </section>

        </div>
      </main>
      
      <Footer />

    </div>
  );
}
