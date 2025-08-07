import { Alert } from 'react-native';

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

export class ErrorHandler {
  static handle(error: any, title: string = 'Error'): AppError {
    let appError: AppError;

    if (error instanceof Error) {
      appError = {
        message: error.message,
        code: 'GENERAL_ERROR'
      };
    } else if (typeof error === 'string') {
      appError = {
        message: error,
        code: 'STRING_ERROR'
      };
    } else if (error?.response?.data?.error) {
      appError = {
        message: error.response.data.error,
        code: 'API_ERROR',
        details: error.response.data
      };
    } else if (error?.message) {
      appError = {
        message: error.message,
        code: 'UNKNOWN_ERROR'
      };
    } else {
      appError = {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR'
      };
    }

    // Log error for debugging
    console.error('Error handled:', {
      title,
      error: appError,
      originalError: error
    });

    return appError;
  }

  static showAlert(error: AppError, title: string = 'Error'): void {
    Alert.alert(title, error.message);
  }

  static showNetworkError(): void {
    Alert.alert(
      'Network Error',
      'Unable to connect to the server. Please check your internet connection and try again.',
      [{ text: 'OK' }]
    );
  }

  static showAuthError(): void {
    Alert.alert(
      'Authentication Error',
      'Your session has expired. Please log in again.',
      [{ text: 'OK' }]
    );
  }

  static showValidationError(errors: string[]): void {
    Alert.alert(
      'Validation Error',
      errors.join('\n'),
      [{ text: 'OK' }]
    );
  }
}

export default ErrorHandler; 