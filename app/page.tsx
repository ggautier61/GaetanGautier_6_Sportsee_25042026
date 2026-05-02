'use client';

import { Header } from '@/components/layout/Header';
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

function getLastWeekSessions(runningData: RunningData[]): RunningData[] {
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  return runningData
    .filter((s) => new Date(s.date) >= oneWeekAgo)
    .slice(-7);
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

export default function Home() {
  const user = getUserById('user123');

  if (!user) {
    return <p>Utilisateur non trouvé</p>;
  }

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

  const userName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="flex flex-col items-center">
      <main className="pt-9" style={{width: "1140px", maxWidth: "1140px",minHeight: '100vh' }}>
        <Header />
        <div className="flex flex-col py-[108px] px-[40px] gap-[108px]">
          <div className='flex flex-col gap-[40px]'>
            
              {/* card Conversation IA */}
              <Card_IA />

              {/* card Profil */}
              <Card_Profil />
            
          </div>

          <section>
            <h2 className="mb-[32px]">Vos dernières performances</h2>

            <div className="flex gap-8" style={{ height: '484px'}}>
              {/* Graphique Distance par semaine */}
              <div style={{ width: '445px', height: '100%' }}>
                <Card>
                  <BarChart type="distance" title="18km en moyenne" />
                </Card>

              </div>

              {/* Graphique Rythme cardiaque par jour */}
              <div style={{ flex: 1 , height: '100%'}}>                 
                <Card>
                  <BarChart type="heartRate" title="Rythme cardiaque" />
                </Card>
              </div>
            </div>

          </section>

          <section>
            <div className="mb-[32px]">
              <h2 style={{fontFamily: "Inter", fontWeight: 500, fontSize:"22px"}}>Cette semaine</h2>
              <p style={{fontFamily: "Inter", fontWeight: 500, fontSize:"16px", color: 'var(--grissportsee'}}>Du 27/04/2026 au 03/04/2026</p>
            </div>

            <div className="flex w-full gap-8">
              <div style={{ width: '445px', height: '100%' }}>
                <Card>
                  {/* <ObjectivePieChart achieved={4} remaining={2} /> */}
                  <CustomActiveShapePieChart />
                </Card>

              </div>
              <div className="flex flex-col gap-8" style={{ flex: 1 }}>
                <Card>
                  <p>Card 1</p>
                </Card>
                <Card>
                  <p>Card 2</p>
                </Card>
              </div>
            </div>


            
          </section>
          

          {/* <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              <StatCard label="Séanches" value={sessionCount} icon="activity" />
              <StatCard label="FC moy" value={`${avgHeartRate} bpm`} icon="heart" />
              <StatCard label="Calories" value={`${totalCalories} kcal`} icon="flame" />
              <StatCard label="Durée" value={durationStr} icon="clock" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              
              
            </div>
          </div> */}
        </div>
      </main>
      
      {/* <Footer /> */}

    </div>
  );
}