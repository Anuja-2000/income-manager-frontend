import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';
import { ApiError } from './types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/*
export function useApi<T = any>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
      return response.data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}*/

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Handle axios errors
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'You are not authorized. Please log in.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return `Request failed with status ${error.response.status}`;
      }
    }
    
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your internet connection.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
}
