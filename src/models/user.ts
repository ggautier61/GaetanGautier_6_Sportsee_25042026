export interface RunningData {
  date: string;
  distance: number;
  duration: number;
  heartRate: { min: number; max: number; average: number };
  caloriesBurned: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender?: string;
  height?: number;
  weight?: number;
  profilePicture?: string;
  createdAt?: string;
  weeklyGoal?: number;
  runningData: RunningData[];
}

export class UserModel implements User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender?: string;
  height?: number;
  weight?: number;
  profilePicture?: string;
  createdAt?: string;
  weeklyGoal?: number;
  runningData: RunningData[];

  constructor(data: User) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.age = data.age;
    this.gender = data.gender;
    this.height = data.height;
    this.weight = data.weight;
    this.profilePicture = data.profilePicture;
    this.createdAt = data.createdAt;
    this.weeklyGoal = data.weeklyGoal;
    this.runningData = data.runningData;
  }

  addSession(session: Omit<RunningData, 'date'>): void {
    const today = new Date().toISOString().split('T')[0];
    this.runningData.push({ ...session, date: today });
  }

  getRecentSessions(count: number = 7): RunningData[] {
    return this.runningData.slice(-count);
  }

  getTotalDistance(): number {
    return this.runningData.reduce((sum, s) => sum + s.distance, 0);
  }

  getTotalCalories(): number {
    return this.runningData.reduce((sum, s) => sum + s.caloriesBurned, 0);
  }

  getTempsTotalCouru(): { hours: number; minutes: number } {
    if (!this) return { hours: 0, minutes: 0 };
    const totalMinutes = this.runningData.reduce((acc, s) => acc + s.duration, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  getTotalSessions(): number {
    return this.runningData.length;
  }


  getJoursSansCourse(): number {
    if (!this.createdAt) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(this.createdAt);
    startDate.setHours(0, 0, 0, 0);

    const totalDays = Math.round((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const uniqueRunDays = new Set(
      this.runningData
        .map((s) => {
          const d = new Date(s.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
        .filter((time) => time >= startDate.getTime() && time <= today.getTime())
    );

    return totalDays - uniqueRunDays.size;
  }
}

export default User;