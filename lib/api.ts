import { create } from 'domain';
import axiosInstance from './axios';
import { CreateTripData } from './types';
import { Trip } from '@/model/trip';

/*
// Example API functions using the configured axios instance
export const apiClient = {
  // Generic GET request
  get: <T = any>(url: string, config?: any) => 
    axiosInstance.get<T>(url, config),

  // Generic POST request
  post: <T = any>(url: string, data?: any, config?: any) => 
    axiosInstance.post<T>(url, data, config),

  // Generic PUT request
  put: <T = any>(url: string, data?: any, config?: any) => 
    axiosInstance.put<T>(url, data, config),

  // Generic DELETE request
  delete: <T = any>(url: string, config?: any) => 
    axiosInstance.delete<T>(url, config),

  // Generic PATCH request
  patch: <T = any>(url: string, data?: any, config?: any) => 
    axiosInstance.patch<T>(url, data, config),
};
*/

// Example specific API functions for your income manager
export const incomeApi = {
  // Get all trips
  getTrips: () => axiosInstance.get<Trip[]>('/trips'),

  // Search trips with filters (server-side)
  searchTrips: (params: {
    search?: string;
    driverId?: number;
    type?: string;
    amountType?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: number;
    maxAmount?: number;
    sortBy?: string;
    sortDir?: string;
  }) => axiosInstance.get<{
    trips: Trip[];
    totalCount: number;
    totalAmount: number;
    totalDistance: number;
    totalDuration: number;
  }>('/trips/search', { params }),
  
  // Get trip by ID
  getTripById: (id: string) => axiosInstance.get(`/trips/${id}`),

  // Create new trip
  //createTrip: (tripData: any) => axiosInstance.post('/trips', tripData),

  // Update trip
  //updateTrip: (id: string, tripData: any) => axiosInstance.put(`/trips/${id}`, tripData),

  // Delete trip
  deleteTrip: (id: string) => axiosInstance.delete(`/trips/${id}`),

  // Get income summary
  getIncomeSummary: () => axiosInstance.get('/income/summary'),

  getDrivers: () => axiosInstance.get('/drivers'),

  createTrip: (tripData: CreateTripData) => axiosInstance.post('/trips/create', tripData),
};

export default incomeApi;
