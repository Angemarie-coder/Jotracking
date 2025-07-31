'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean }>;
  logout: () => void;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (token: string, email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authApi.getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          throw new Error('Invalid user data');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(email, password);
      
      if (response.token && response.user) {
        // Store the token in localStorage
        localStorage.setItem('token', response.token);
        
        // Update the auth state with user data
        setUser({
          id: response.user.id,
          email: response.user.email,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          isVerified: response.user.isVerified,
          isAdmin: response.user.isAdmin || false
        });

        // Check if there's a redirect URL in the query params
        const redirectTo = searchParams.get('redirect') || '/dashboard';
        router.push(redirectTo);
        
        return { success: true };
      } else {
        throw new Error(response.error || 'Login failed: No token received');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      // Handle specific error cases
      if (error.response?.data?.requiresVerification) {
        // setShowResend(true);
        // setPendingEmail(email);
      }
      throw error; // Re-throw to handle in the component
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      const response = await authApi.resendVerification(email);
      return { 
        success: true, 
        message: response.message || 'Verification email sent. Please check your inbox.'
      };
    } catch (error: any) {
      console.error('Failed to resend verification email:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to resend verification email' 
      };
    }
  };

  const verifyEmail = async (token: string, email: string) => {
    try {
      const response = await authApi.verifyEmail(token, email);
      
      // If verification is successful, update the user's verified status
      if (response.success && user) {
        setUser({ ...user, isVerified: true });
      }
      
      return { 
        success: response.success, 
        message: response.message || 'Email verified successfully!'
      };
    } catch (error: any) {
      console.error('Email verification failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Email verification failed' 
      };
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    resendVerificationEmail,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}