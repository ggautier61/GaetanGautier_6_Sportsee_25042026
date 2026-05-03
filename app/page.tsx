'use client';

import { Header } from '@/components/layout/Header';
import { useRouter } from 'next/navigation';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { BarChart } from '@/components/charts/BarChart';
import ObjectivePieChart from '@/components/charts/ObjectivePieChart';
import { getUserById } from '@/hooks/useUser';
import { RunningData } from '@/models/user';
import { Card_IA } from '@/components/ui/Card_IA';
import Card_Profil from '@/components/ui/Card_Profil';
import { Footer } from '@/components/layout/Footer';
import CellPieExample from '@/components/charts/Pie';
import CustomActiveShapePieChart from '@/components/charts/Pie';
import { WeekSelector } from '@/components/ui/Week_Selector';
import Card_Distance from '@/components/ui/Card_Distance';


function getLastWeekSessions(runningData: RunningData[]): RunningData[] {
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  return runningData
    .filter((s) => new Date(s.date) >= oneWeekAgo)
    .slice(-7);
}

const getWeekDates = () => {
     const today = new Date();
     const dayOfWeek = today.getDay();
     const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
     const monday = new Date(today);
     monday.setDate(today.getDate() + mondayOffset);
     const sunday = new Date(monday);
     sunday.setDate(monday.getDate() + 6);

     return {dateDebut: monday, dateFin: sunday};
   };

function getThisWeekSessions(runningData: RunningData[]): RunningData[] {
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  const week = getWeekDates();

  return runningData
    .filter((s) => new Date(s.date) >= week.dateDebut && new Date(s.date) <= week.dateFin);
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

export default function Home() {
  const router = useRouter();
  const user = getUserById('user123');

  if (!user) {
    return <p>Utilisateur non trouvé</p>;
  }

  const memberSince = user.createdAt ? formatDate(user.createdAt) : 'Date inconnue';
  const fullName = `${user.firstName} ${user.lastName}`;

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

   //Cacul temps d'activité cette semaine
   const totalTempsActiviteThisWeek = getThisWeekSessions(user.runningData).reduce((sum, s) => sum + s.duration, 0);

   //Somme des kilomètres parcourus cette semaine
   const totalDistanceThisWeek = getThisWeekSessions(user.runningData).reduce((sum, s) => sum + s.distance, 0);
   const  totalDistance = user.runningData.reduce((sum, s) => sum + s.distance, 0);

   





  const recentSessions = getLastWeekSessions(user.runningData);
  const sessionCount = recentSessions.length;
  const avgHeartRate = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((sum, s) => sum + s.heartRate.average, 0) / recentSessions.length)
    : 0;
  const totalCalories = recentSessions.reduce((sum, s) => sum + s.caloriesBurned, 0);
  const totalDurationMinutes = recentSessions.reduce((sum, s) => sum + s.duration, 0);
  const hours = Math.floor(totalDurationMinutes / 60);
  const mins = totalDurationMinutes % 60;
  const durationStr = hours > 0 ? `${hours}h${mins}` : `${mins}m`;

  const lineChartData = prepareLineChartData(user.runningData, user.weeklyGoal || 2);
  const barChartData = prepareHeartRateData(user.runningData);


  return (
    <div className="flex flex-col items-center">
      <main className="pt-9" style={{width: "1140px", maxWidth: "1140px",minHeight: '100vh' }}>
        <Header isAuthenticated={true} onLogout={() => router.push('/login')} />
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
                <Card className="bg-[white] px-[40px] py-4">

                  <div className='flex flex-col justify-between h-full'>
                    <div className='flex flex-col'>
                      <div className="flex items-center justify-between" style={{ height: '48px' }}>
                        <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--bluesportsee)' }}>18km en moyenne</div>
                        <WeekSelector />
                        {/* <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--blueclairsportsee)' }}>Total </div> */}
                      </div>
                      <p style={{fontSize:12, color: 'var(--grissportsee)'}}>
                        Total des kilomètres 4 dernières semaines
                      </p>
                    </div>

                    <BarChart type="distance" />

                  </div>
                  
                </Card>

              </div>

              {/* Graphique Rythme cardiaque par jour */}
              <div style={{ flex: 1 , height: '100%'}}>                 
                <Card className="bg-[white] px-[40px] py-4">
                  <div className='flex flex-col justify-between h-full'>
                    <div className='flex flex-col'>
                      <div className="flex items-center justify-between" style={{ height: '48px' }}>
                        <div style={{ fontSize: 22, fontWeight: 500, color: 'var(--rougesportsee)' }}>163 BPM</div>
                        <WeekSelector />
                        {/* <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--blueclairsportsee)' }}>Total </div> */}
                      </div>
                      <p style={{fontSize:12, color: 'var(--grissportsee)'}}>
                        Fréquence cardiaque moyenne
                      </p>
                    </div>

                    <BarChart type="heartRate" />

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
                        <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--bluesportsee)' }}>x{user.weeklyGoal}</div>
                        <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--blueclairsportsee)' }}>sur objectifs de 6</div>
                      </div>
                      <p style={{fontSize:14, color: 'var(--grissportsee)'}}>
                        Courses hebdomadaire réalisées
                      </p>
                    </div>
                    <CustomActiveShapePieChart />

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

    </div>
  );
}