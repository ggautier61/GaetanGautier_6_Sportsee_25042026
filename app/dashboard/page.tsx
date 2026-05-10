'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { BarChart } from '@/components/charts/BarChart';
import ObjectivePieChart from '@/components/charts/ObjectivePieChart';
import { Card_IA } from '@/components/ui/Card_IA';
import Card_Profil from '@/components/ui/Card_Profil';
import { Footer } from '@/components/layout/Footer';
import CustomActiveShapePieChart from '@/components/charts/Pie';
import { WeekSelector, getWeekDates } from '@/components/ui/Week_Selector';
import Card_Distance from '@/components/ui/Card_Distance';
import { useAuth } from '@/context/AuthContext';

interface RunningData {
  date: string;
  distance: number;
  duration: number;
  heartRate: { min: number; max: number; average: number };
  caloriesBurned: number;
}

function getLastWeekSessions(runningData: RunningData[]): RunningData[] {
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  return runningData
    .filter((s) => new Date(s.date) >= oneWeekAgo)
    .slice(-7);
}

function getThisWeekSessions(runningData: RunningData[]): RunningData[] {
  const week = getWeekDates(0);
  week.start.setHours(0, 0, 0, 0);
  const weekEnd = new Date(week.end);
  weekEnd.setHours(23, 59, 59, 999);
  const filteredSessions = runningData.filter((s) => {
    const sessionDate = new Date(s.date);
    return sessionDate >= week.start && sessionDate <= weekEnd;
  });
  return filteredSessions;
}

function prepareLineChartData(runningData: RunningData[], weeklyGoal: number) {
  const sessions = getLastWeekSessions(runningData);
  return sessions.map((s) => ({
    date: s.date,
    actual: s.distance,
    goal: weeklyGoal,
  }));
}

function prepareHeartRateData(runningData: RunningData[]) {
  const sessions = getLastWeekSessions(runningData);
  return sessions.map((s) => ({
    name: new Date(s.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    value: s.heartRate.average,
  }));
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [distanceWeek, setDistanceWeek] = useState(0);
  const [heartWeek, setHeartWeek] = useState(0);

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

  const getWeekDatesString = () => {
     const today = new Date();
     const dayOfWeek = today.getDay();
     const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
     const monday = new Date(today);
     monday.setDate(today.getDate() + mondayOffset);
     const sunday = new Date(monday);
     sunday.setDate(monday.getDate() + 6);
     
     const format = (d: Date) => d.toLocaleDateString('fr-FR');
     return `Du ${format(monday)} au ${format(sunday)}`;
  };

    const memberSince = profile.createdAt ? formatDate(profile.createdAt) : 'Date inconnue';
    const fullName = `${profile.firstName} ${profile.lastName}`;

   const totalDistance = user.info?.statistics.totalDistance || runningData.reduce((sum, s) => sum + s.distance, 0);
   const totalTempsActiviteThisWeek = getThisWeekSessions(runningData).reduce((sum, s) => sum + s.duration, 0);
   const totalDistanceThisWeek = getThisWeekSessions(runningData).reduce((sum, s) => sum + s.distance, 0);

   const totalsessionsthisweek =getThisWeekSessions(runningData).length;

   const distanceStart = getWeekDates(distanceWeek + 3).start.toISOString();
   const distanceEnd = getWeekDates(distanceWeek).end.toISOString();
   const heartStart = getWeekDates(heartWeek).start.toISOString();
   const heartEnd = getWeekDates(heartWeek).end.toISOString();
   
   return (
     <div className="w-full flex flex-col items-center">
       <main className="h-full pt-9" style={{width: "1140px", maxWidth: "1140px",minHeight: '100vh' }}>
         <Header />
         <div className="flex flex-col py-[108px] px-[40px] gap-[108px]">
           <div className='flex flex-col gap-[40px]'>
             
               {/* card Conversation IA */}
               <Card_IA />

               {/* card Profil */}
               <Card className='bg-[white] px-[52px] py-[32px]'>
                 <div className='flex items-center justify-between'>
                   <Card_Profil fullName={fullName} memberSince={memberSince} />
                   <Card_Distance distance={totalDistance} />
                 </div>
               </Card>
             
           </div>

           <section>
             <h2 className="mb-[32px]" style={{ fontWeight: 500, fontSize: 22 }}>Vos dernières performances</h2>

             <div className="flex gap-8" style={{ height: '484px'}}>
               {/* Graphique Distance par semaine */}
               <div style={{ width: '445px', height: '100%' }}>
                 <Card className="bg-[white] px-[40px] py-6">

                   <div className='flex flex-col h-full'>
                     <div className='flex flex-col mb-[40px]'>
                        <div className="flex items-center justify-between" style={{ height: '48px' }}>
                          <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--bluesportsee)' }}>18km en moyenne</div>
                          <WeekSelector selectedWeek={distanceWeek} onWeekChange={setDistanceWeek} rangeWeeks={4} />
                        </div>
                        <p style={{fontSize:12, color: 'var(--grissportsee)'}}>
                          Total des kilomètres 4 dernières semaines
                        </p>
                      </div>

                      <BarChart type="distance" startingDate={distanceStart} endingDate={distanceEnd} />

                   </div>
                   
                 </Card>

               </div>

               {/* Graphique Rythme cardiaque par jour */}
               <div style={{ flex: 1 , height: '100%'}}>                 
                 <Card className="bg-[white] px-[40px] py-6">
                   <div className='flex flex-col h-full'>
                     <div className='flex flex-col mb-[40px]'>
                        <div className="flex items-center justify-between" style={{ height: '48px' }}>
                          <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--rougesportsee)' }}>163 BPM</div>
                          <WeekSelector selectedWeek={heartWeek} onWeekChange={setHeartWeek} />
                        </div>
                        <p style={{fontSize:12, color: 'var(--grissportsee)'}}>
                          Fréquence cardiaque moyenne
                        </p>
                      </div>

                      <BarChart type="heartRate" startingDate={heartStart} endingDate={heartEnd} />

                   </div>
                   

                 </Card>
               </div>
             </div>

           </section>

           {/* Objectifs de la semaine */}
           <section>
             <div className="mb-[32px]">
               <h2 style={{fontWeight: 500, fontSize:22}}>Cette semaine</h2>
               <p style={{fontWeight: 500, fontSize:16, color: 'var(--grissportsee)'}}>{getWeekDatesString()}</p>
             </div>

             <div className="flex w-full gap-8" style={{height: "342px"}}>
               <div style={{ width: '445px', height: '100%' }}>
                 <Card className="bg-[white] px-[38px] py-4">
                   <div className='flex flex-col justify-between h-full'>
                     <div className='flex flex-col'>
                       <div className="flex items-center gap-2" style={{ height: '48px' }}>
                         <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--bluesportsee)' }}>x{totalsessionsthisweek}</div>
                         <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--blueclairsportsee)' }}>sur objectifs de 6</div>
                       </div>
                       <p style={{fontSize:14, color: 'var(--grissportsee)'}}>
                         Courses hebdomadaire réalisées
                       </p>
                     </div>
                     <CustomActiveShapePieChart nbSessions={totalsessionsthisweek} />

                   </div>
                 </Card>

               </div>

               <div className="flex flex-col gap-4" style={{ flex: 1 }}>
                 <Card className='bg-[white] px-[30px] py-5 flex flex-col justify-between' style={{height: 'auto'}}>
                     <div style={{fontSize: 14, color:'var(--grissportsee)'}}>
                       Durée d&apos;activité
                     </div>
                     <div className='flex gap-2 items-center'>
                       <div style={{fontSize: 22, fontWeight: 500, color:'var(--bluesportsee)'}}>{totalTempsActiviteThisWeek}</div>
                       <div style={{fontSize: 16, fontWeight: 500, color:'var(--blueclairsportsee)'}}>minutes</div>
                     </div>
                   
                 </Card>

                 <Card className='bg-[white] px-[30px] py-5 flex flex-col justify-between' style={{height: 'auto'}}>
                     <div style={{fontSize: 14, color:'var(--grissportsee)'}}>
                       Distance
                     </div>
                     <div className='flex gap-2 items-center'>
                       <div style={{fontSize: 22, fontWeight: 500, color:'var(--rougesportsee)'}}>{totalDistanceThisWeek}</div>
                       <div style={{fontSize: 16, fontWeight: 500, color:'var(--rougeclairsportsee)'}}>kilomètres</div>
                     </div>
                   
                 </Card>
               </div>
             </div>

           </section>

         </div>
       </main>

       <Footer />

     </div>
   );
}
