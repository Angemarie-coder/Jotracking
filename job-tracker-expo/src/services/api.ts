import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Job,
  CreateJobRequest,
  UpdateJobRequest,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  JobFilters,
  DashboardStats
} from '../types';

// For development, use your computer's IP address instead of localhost
// You can find your IP by running 'ipconfig' in Windows
const API_BASE_URL = 'http://192.168.1.65:5000/api'; // Update this IP to match your computer's IP

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<any> = await this.api.post('/auth/login', credentials);
    return {
      user: response.data.user,
      token: response.data.token
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('API: Making register request to:', `${this.api.defaults.baseURL}/auth/register`);
    console.log('API: Register data:', userData);
    
    const response: AxiosResponse<any> = await this.api.post('/auth/register', userData);
    console.log('API: Register response:', response.data);
    
    return {
      user: response.data.user,
      token: response.data.token
    };
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<any> = await this.api.get('/auth/me');
    return response.data.user;
  }

  // Job endpoints
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.company) params.append('company', filters.company);
    if (filters?.location) params.append('location', filters.location);

    const response: AxiosResponse<ApiResponse<Job[]>> = await this.api.get(`/jobs?${params.toString()}`);
    return response.data.data!;
  }

  async getJob(id: number): Promise<Job> {
    const response: AxiosResponse<ApiResponse<Job>> = await this.api.get(`/jobs/${id}`);
    return response.data.data!;
  }

  async createJob(jobData: CreateJobRequest): Promise<Job> {
    const response: AxiosResponse<ApiResponse<Job>> = await this.api.post('/jobs', jobData);
    return response.data.data!;
  }

  async updateJob(id: number, jobData: UpdateJobRequest): Promise<Job> {
    const response: AxiosResponse<ApiResponse<Job>> = await this.api.put(`/jobs/${id}`, jobData);
    return response.data.data!;
  }

  async deleteJob(id: number): Promise<void> {
    await this.api.delete(`/jobs/${id}`);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const response: AxiosResponse<ApiResponse<DashboardStats>> = await this.api.get('/jobs/stats');
    return response.data.data!;
  }
}

export default new ApiService(); 