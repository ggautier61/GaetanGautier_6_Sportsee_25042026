const API_BASE_URL = 'http://localhost:8000';

const TOKEN_COOKIE_NAME = 'authToken';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  createdAt: string;
  age: number;
  weight: number;
  height: number;
  profilePicture: string;
}

export interface UserStatistics {
  totalDistance: number;
  totalSessions: number;
  totalDuration: number;
  objectifThisWeek: number;
}

export interface UserInfoResponse {
  profile: UserProfile;
  statistics: UserStatistics;
}

export interface ActivitySession {
  date: string;
  distance: number;
  duration: number;
  heartRate: { min: number; max: number; average: number };
  caloriesBurned: number;
}

function setCookie(token: string): void {
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
}

function deleteCookie(): void {
  document.cookie = `${TOKEN_COOKIE_NAME}=; path=/; max-age=0`;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Identifiants invalides');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    setCookie(data.token);
    return data;
  }

  async getUserInfo(): Promise<UserInfoResponse> {
    const response = await fetch(`${API_BASE_URL}/api/user-info`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Impossible de récupérer les informations utilisateur');
    }

    return response.json();
  }

  async getUserActivity(startDate: string, endDate: string): Promise<ActivitySession[]> {
    const url = new URL(`${API_BASE_URL}/api/user-activity`);
    url.searchParams.set('startWeek', startDate);
    url.searchParams.set('endWeek', endDate);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Impossible de récupérer l\'activité utilisateur');
    }

    return response.json();
  }


  logout(): void {
    localStorage.removeItem('authToken');
    deleteCookie();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const apiService = new ApiService();
