'use client';

import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import Card_Profil from '@/components/ui/Card_Profil';
import Card_Stats from '@/components/ui/Card_Stats';
import { getUserById } from '@/hooks/useUser';
import Image from 'next/image';

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatGender(gender: string): string {
  const map: Record<string, string> = { female: 'Femme', male: 'Homme' };
  return map[gender] || gender;
}



export default function ProfilPage() {
  const user = getUserById('user123');

  if (!user) {
    return <p>Utilisateur non trouvé</p>;
  }

  const memberSince = user.createdAt ? formatDate(user.createdAt) : 'Date inconnue';
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="flex flex-col items-center">
      <main className="pt-9" style={{ width: '1140px', maxWidth: '1140px', minHeight: '100vh' }}>
        <Header />

        <div className="py-[108px] px-[40px] flex gap-[40px]">

          {/* Profil */}
          <section className='flex flex-col gap-4' style={{ width: '508px' }}>
            {/* Card Profil */}
            <Card className="px-[32px] py-[24px]">
              <Card_Profil fullName={fullName} memberSince={memberSince} />
            </Card>

            {/* Card Votre profil */}
            <Card className="px-[40px] py-[24px]">
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 500 }}>Votre profil</h2>
                <hr className="my-[20px] border-[var(--blueclairsportsee)]" />
                <div className="flex flex-col gap-y-6 gap-x-12" style={{fontSize: '16px', fontWeight: 500, color: 'var(--grissportsee)'}}>
                  <div className="flex items-center gap-2">
                    <span>Age : 29</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Genre : {formatGender(user.gender || '')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Taille : {user.height} cm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Poids : {user.weight}kg</span>
                  </div>
                </div>
              </div>
            </Card>

          </section>

          {/* Statistiques */}
          <section className='flex flex-col' style={{ flex: '1' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 500 }}>Vos Statistiques</h2>
            <p style={{color: 'var(--grissportsee)', fontSize: 14}}>depuis le {formatDate(user.createdAt || '')}</p>

            <div>
              <div className='grid grid-cols-2 gap-5'>
                <Card_Stats title="Temps total couru" indicator={`${user.getTempsTotalCouru()}`} text="min" />
                <Card_Stats title="Calories totales brûlées" indicator={`${user.getTotalCalories()}`} text="cal" />
                <Card_Stats title="Distance totale parcourue" indicator={`${user.getTotalDistance()}`} text="km" />
                <Card_Stats title="Nombre de jours de repos" indicator={`${user.getTotalDistance()}`} text="km" />
                <Card_Stats title="Nombre de sessions" indicator={`${user.getTotalDistance()}`} text="sessions" />
              </div>

            </div>
            {/* Card Profil */}
            <Card className="px-[32px] py-[24px]">
              <Card_Profil fullName={fullName} memberSince={memberSince} />
            </Card>

            {/* Card Votre profil */}
            <Card className="px-[40px] py-[24px]">
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 500 }}>Votre profil</h2>
                <hr className="my-[20px] border-[var(--blueclairsportsee)]" />
                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                  <div className="flex flex-col">
                    <span style={{ fontSize: '14px', color: 'var(--grissportsee)' }}>Age</span>
                    <span style={{ fontSize: '18px', fontWeight: 500 }}>{user.age} ans</span>
                  </div>
                  <div className="flex flex-col">
                    <span style={{ fontSize: '14px', color: 'var(--grissportsee)' }}>Genre</span>
                    <span style={{ fontSize: '18px', fontWeight: 500 }}>{formatGender(user.gender || '')}</span>
                  </div>
                  <div className="flex flex-col">
                    <span style={{ fontSize: '14px', color: 'var(--grissportsee)' }}>Taille</span>
                    <span style={{ fontSize: '18px', fontWeight: 500 }}>{user.height} cm</span>
                  </div>
                  <div className="flex flex-col">
                    <span style={{ fontSize: '14px', color: 'var(--grissportsee)' }}>Poids</span>
                    <span style={{ fontSize: '18px', fontWeight: 500 }}>{user.weight} kg</span>
                  </div>
                </div>
              </div>
            </Card>

          </section>

        </div>
      </main>
    </div>
  );
}
