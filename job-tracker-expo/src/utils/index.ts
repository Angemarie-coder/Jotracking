import { JobStatus } from '../types';

export const getStatusColor = (status: JobStatus): string => {
  switch (status) {
    case JobStatus.APPLIED: return '#2196F3';
    case JobStatus.INTERVIEWING: return '#FF9800';
    case JobStatus.OFFER: return '#4CAF50';
    case JobStatus.REJECTED: return '#F44336';
    case JobStatus.SAVED: return '#9E9E9E';
    default: return '#9E9E9E';
  }
};

export const getStatusLabel = (status: JobStatus): string => {
  switch (status) {
    case JobStatus.APPLIED: return 'Applied';
    case JobStatus.INTERVIEWING: return 'Interviewing';
    case JobStatus.OFFER: return 'Offer';
    case JobStatus.REJECTED: return 'Rejected';
    case JobStatus.SAVED: return 'Saved';
    default: return status;
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}; 