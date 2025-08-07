import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { environment } from '../config/environment';
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

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: environment.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: environment.timeout,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('authToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors and common errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear auth data on unauthorized
          try {
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
          } catch (storageError) {
            console.error('Error clearing auth data:', storageError);
          }
        }
        
        // Log error for debugging
        console.error('API Error:', {
          status: error.response?.status,
          message: error.response?.data,
          url: error.config?.url
        });
        
        return Promise.reject(error);
      }
    );
  }

  // Helper method to handle API responses
  private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }
    return response.data.data!;
  }

  // Helper method to handle auth responses specifically
  private handleAuthResponse(response: AxiosResponse<ApiResponse<AuthResponse>>): AuthResponse {
    if (!response.data.success) {
      throw new Error(response.data.error || 'API request failed');
    }
    return response.data.data!;
  }

  // Helper method to handle errors
  private handleError(error: any): never {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/login', credentials);
      return this.handleAuthResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/auth/register', userData);
      return this.handleAuthResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/auth/me');
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Job endpoints
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.company) params.append('company', filters.company);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response: AxiosResponse<ApiResponse<Job[]>> = await this.api.get(`/jobs?${params.toString()}`);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getJob(id: number): Promise<Job> {
    try {
      const response: AxiosResponse<ApiResponse<Job>> = await this.api.get(`/jobs/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createJob(jobData: CreateJobRequest): Promise<Job> {
    try {
      const response: AxiosResponse<ApiResponse<Job>> = await this.api.post('/jobs', jobData);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateJob(id: number, jobData: UpdateJobRequest): Promise<Job> {
    try {
      const response: AxiosResponse<ApiResponse<Job>> = await this.api.put(`/jobs/${id}`, jobData);
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteJob(id: number): Promise<void> {
    try {
      await this.api.delete(`/jobs/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response: AxiosResponse<ApiResponse<DashboardStats>> = await this.api.get('/jobs/stats');
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility method to check if API is reachable
  async checkApiHealth(): Promise<boolean> {
    try {
      await this.api.get('/health');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new ApiService(); 