import { UserModel, RunningData } from '@/models/user';
import usersData from '../../mocks/data.json';

interface RawUserData {
  id: string;
  weeklyGoal?: number;
  goal?: number;
  userInfos: {
    firstName: string;
    lastName: string;
    age: number;
    gender?: string;
    height?: number;
    weight?: number;
    profilePicture?: string;
    createdAt?: string;
  };
  username?: string;
  password?: string;
  runningData: RunningData[];
}

interface UseUserReturn {
  user: UserModel | null;
  loading: boolean;
  error: string | null;
  getRecentSessions: (days?: number) => RunningData[];
  getAverageHeartRate: () => number;
  getTotalCalories: () => number;
  getTotalDuration: () => string;
  getTempsTotalCouru: () => number;
}

export function useUser(userId?: string): UseUserReturn {
  const rawData = usersData as RawUserData[];
  let user: UserModel | null = null;
  let loading = false;
  let error: string | null = null;

  if (userId) {
    const found = rawData.find((u) => u.id === userId);
    if (found) {
      const userData = {
        id: found.id,
        firstName: found.userInfos.firstName,
        lastName: found.userInfos.lastName,
        age: found.userInfos.age,
        gender: found.userInfos.gender,
        height: found.userInfos.height,
        weight: found.userInfos.weight,
        profilePicture: found.userInfos.profilePicture,
        createdAt: found.userInfos.createdAt,
        weeklyGoal: found.weeklyGoal ?? found.goal ?? 0,
        runningData: found.runningData,
      };
      user = new UserModel(userData);
    } else {
      error = 'User not found';
    }
  }

  const getRecentSessions = (days: number = 7): RunningData[] => {
    if (!user) return [];
    return user.runningData.slice(-days);
  };

  const getAverageHeartRate = (): number => {
    if (!user || user.runningData.length === 0) return 0;
    const recent = getRecentSessions();
    const sum = recent.reduce((acc, s) => acc + s.heartRate.average, 0);
    return Math.round(sum / recent.length);
  };

  const getTotalCalories = (): number => {
    if (!user) return 0;
    const recent = getRecentSessions();
    return recent.reduce((acc, s) => acc + s.caloriesBurned, 0);
  };

  const getTotalDuration = (): string => {
    if (!user) return '0h';
    const recent = getRecentSessions();
    const totalMinutes = recent.reduce((acc, s) => acc + s.duration, 0);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return hours > 0 ? `${hours}h${mins}` : `${mins}m`;
  };

  const getTempsTotalCouru = (): number => {
    if (!user) return 0;
    const totalMinutes = user.runningData.reduce((acc, s) => acc + s.duration, 0);
    return totalMinutes;
  };

  return {
    user,
    loading,
    error,
    getRecentSessions,
    getAverageHeartRate,
    getTotalCalories,
    getTotalDuration,
    getTempsTotalCouru
  };
}

export function getAllUsers(): UserModel[] {
  const rawData = usersData as RawUserData[];
  return rawData.map((u) => {
    const userData = {
      id: u.id,
      firstName: u.userInfos.firstName,
      lastName: u.userInfos.lastName,
      age: u.userInfos.age,
      gender: u.userInfos.gender,
      height: u.userInfos.height,
      weight: u.userInfos.weight,
      profilePicture: u.userInfos.profilePicture,
      createdAt: u.userInfos.createdAt,
      weeklyGoal: u.weeklyGoal ?? u.goal ?? 0,
      runningData: u.runningData,
    };
    return new UserModel(userData);
  });
}

export function getUserById(userId: string): UserModel | null {
  const rawData = usersData as RawUserData[];
  const found = rawData.find((u) => u.id === userId);
  if (!found) return null;

  const userData = {
    id: found.id,
    firstName: found.userInfos.firstName,
    lastName: found.userInfos.lastName,
    age: found.userInfos.age,
    gender: found.userInfos.gender,
    height: found.userInfos.height,
    weight: found.userInfos.weight,
    profilePicture: found.userInfos.profilePicture,
    createdAt: found.userInfos.createdAt,
    weeklyGoal: found.weeklyGoal ?? found.goal ?? 0,
    runningData: found.runningData,
  };
  return new UserModel(userData);
}