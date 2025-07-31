import axios from 'axios';

// Use environment variable or default to local development URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/sessions
  timeout: 15000, // 15 seconds timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Only run this on the client side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with a status code outside 2xx
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized
      if (status === 401) {
        // Only run this on the client side
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Only redirect if not already on the login page to prevent infinite redirects
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }
      
      // Return a more detailed error message if available
      return Promise.reject({
        message: data?.message || 'An error occurred',
        status,
        data: data || {},
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return Promise.reject({
        message: 'No response from server. Please check your connection.',
        status: null,
      });
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
      return Promise.reject({
        message: error.message || 'Error setting up request',
        status: null,
      });
    }
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  register: async (firstName: string, lastName: string, email: string, password: string) => {
    const response = await api.post('/api/auth/register', { 
      firstName, 
      lastName, 
      email, 
      password 
    });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
  
  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return { success: true };
  },
  
  verifyEmail: async (token: string, email: string) => {
    const response = await api.get('/api/auth/verify-email', { 
      params: { token, email } 
    });
    return response.data;
  },
  
  resendVerification: async (email: string) => {
    const response = await api.post('/api/auth/resend-verification', { email });
    return response.data;
  },
};

// Jobs API
export const jobsApi = {
  getJobs: async (page = 1, limit = 10) => {
    const response = await api.get('/api/jobs', { 
      params: { page, limit } 
    });
    return response.data;
  },
  
  getJob: async (id: string) => {
    const response = await api.get(`/api/jobs/${id}`);
    return response.data;
  },
  
  createJob: async (jobData: any) => {
    const response = await api.post('/api/jobs', jobData);
    return response.data;
  },
  
  updateJob: async (id: string, jobData: any) => {
    const response = await api.put(`/api/jobs/${id}`, jobData);
    return response.data;
  },
  
  deleteJob: async (id: string) => {
    const response = await api.delete(`/api/jobs/${id}`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export default api;
