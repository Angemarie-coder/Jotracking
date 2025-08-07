export enum JobStatus {
  SAVED = 'saved',
  APPLIED = 'applied',
  INTERVIEWING = 'interviewing',
  OFFER = 'offer',
  REJECTED = 'rejected'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location?: string;
  url?: string;
  salary?: string;
  status: JobStatus;
  appliedDate?: string;
  description?: string;
  notes?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobRequest {
  title: string;
  company: string;
  location?: string;
  url?: string;
  salary?: string;
  status: JobStatus;
  appliedDate?: string;
  description?: string;
  notes?: string;
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface JobFilters {
  status?: JobStatus;
  search?: string;
  company?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  total: number;
  applied: number;
  interviewing: number;
  offers: number;
  rejected: number;
  saved: number;
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  EmailVerification: { token: string; email: string } | undefined;
  MainTabs: undefined;
  AddJob: undefined;
  JobDetail: { jobId: number };
  EditJob: { jobId: number };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Jobs: undefined;
  Profile: undefined;
};

export type NavigationProps = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

export type RouteProps = {
  params?: any;
}; 