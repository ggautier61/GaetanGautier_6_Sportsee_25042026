'use client';

import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';
import { LineChart } from '@/components/charts/LineChart';
import { BarChart } from '@/components/charts/BarChart';
import { getUserById } from '@/hooks/useUser';
import { RunningData } from '@/models/user';
import { Card_IA } from '@/components/ui/Card_IA';

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
      <main className="pt-9" style={{maxWidth: "1140px",minHeight: '100vh' }}>
        <Header />
        <div className="py-[108px] gap-[108px]">
          <div>
            <div>
              {/* card Conversation IA */}
              <Card_IA />
            </div>
            <div>
              {/* card Profil */}
            </div>
          </div>

          <div>

          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
              <StatCard label="Séanches" value={sessionCount} icon="activity" />
              <StatCard label="FC moy" value={`${avgHeartRate} bpm`} icon="heart" />
              <StatCard label="Calories" value={`${totalCalories} kcal`} icon="flame" />
              <StatCard label="Durée" value={durationStr} icon="clock" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <Card title="Progression">
                <LineChart data={lineChartData} />
              </Card>
              <Card title="Fréquence cardiaque">
                <BarChart data={barChartData} />
              </Card>
            </div>
          </div>
        </div>
      </main>
  );
}