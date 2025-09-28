// API Response types
/*
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}
*/

// Trip related types
export interface Trip {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  distance: number;
  amount: number;
  duration: number;
  tripType: string;
  driver: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripData {
  date: string;
  startTime: string;
  endTime?: string;
  distance: number;
  amount: number;
  duration: number;
  tripType: string;
  driver: string;
  notes?: string;
}

export interface UpdateTripData extends Partial<CreateTripData> {
  id: string;
}

// Income summary types
export interface IncomeSummary {
  totalTrips: number;
  totalDistance: number;
  totalAmount: number;
  totalDuration: number;
  averageAmountPerTrip: number;
  averageDurationPerTrip: number;
  averageDistancePerTrip: number;
}

// Error types
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface Driver{
    id: number;
    name: string;
    licenseNumber?: string;
    nic?: string;
    contactNumber?: string;
    bankAccountNumber?: string;
    commissionPercentage?: number;
}
