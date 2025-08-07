// Environment configuration for the app
export interface Environment {
  apiBaseUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  timeout: number;
}

// Get the current environment
const getEnvironment = (): Environment => {
  const isDevelopment = __DEV__;
  const isProduction = !isDevelopment;

  // API Base URL configuration
  let apiBaseUrl: string;
  
      if (isDevelopment) {
      // For development, use the backend running on port 5000
      apiBaseUrl = 'http://192.168.1.124:5000/api';
    } else {
      // For production, use your actual API URL
      apiBaseUrl = 'https://your-production-api.com/api';
    }

  return {
    apiBaseUrl,
    isDevelopment,
    isProduction,
    timeout: 10000, // 10 seconds
  };
};

export const environment = getEnvironment();

// Helper function to get API URL for a specific endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${environment.apiBaseUrl}${endpoint}`;
};

// Helper function to check if we're in development mode
export const isDev = (): boolean => environment.isDevelopment;

// Helper function to check if we're in production mode
export const isProd = (): boolean => environment.isProduction;

// Helper function to get the current API base URL
export const getApiBaseUrl = (): string => environment.apiBaseUrl; 