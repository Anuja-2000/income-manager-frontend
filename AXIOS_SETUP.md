# Axios Configuration Guide

This project uses a centralized axios configuration for making API calls. Here's how to use it:

## Configuration Files

### 1. `lib/axios.ts`
Contains the main axios instance with:
- Base URL configuration
- Request/response interceptors
- Error handling
- Authentication token management

### 2. `lib/api.ts`
Provides ready-to-use API functions:
- Generic HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Specific API endpoints for the income manager

### 3. `lib/types.ts`
TypeScript interfaces for API data structures

### 4. `lib/hooks.ts`
Custom React hook for API calls with loading and error states

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

For production, update the URL accordingly:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com/api
```

## Usage Examples

### Basic API Call
```typescript
import { incomeApi } from '../lib/api';

// Get all trips
const trips = await incomeApi.getTrips();

// Create a new trip
const newTrip = await incomeApi.createTrip({
  date: '2025-09-06',
  startTime: '09:30',
  endTime: '10:15', // Optional for Uber trips
  distance: 15.5,
  amount: 2500,
  duration: 45,
  tripType: 'uber',
  driver: 'Ruwan',
  notes: 'Rush hour traffic'
});
```

### Using the Custom Hook
```typescript
import { useApi } from '../lib/hooks';
import { incomeApi } from '../lib/api';

function TripsComponent() {
  const { data, loading, error, execute } = useApi();

  const loadTrips = async () => {
    try {
      await execute(() => incomeApi.getTrips());
    } catch (error) {
      // Error is automatically handled by the hook
      console.error('Failed to load trips:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {data?.map(trip => (
        <div key={trip.id}>{trip.startLocation} → {trip.endLocation}</div>
      ))}
    </div>
  );
}
```

### Direct Axios Instance Usage
```typescript
import axiosInstance from '../lib/axios';

// For custom endpoints not covered by the API functions
const customData = await axiosInstance.get('/custom-endpoint');
```

## Authentication

The axios instance automatically:
- Adds Bearer token from localStorage to requests
- Removes token and redirects on 401 errors
- Handles common HTTP errors

To set an auth token:
```typescript
localStorage.setItem('authToken', 'your-jwt-token');
```

## Error Handling

The configuration includes:
- Network error handling
- HTTP status code handling
- Timeout handling (10 seconds)
- Automatic token cleanup on authentication errors

## Trip Form Fields

The trip form now includes the following required fields:
- **Date**: Trip date
- **Driver**: Selected driver name
- **Trip Type**: uber, pickme, cash, or other
- **Start Time**: Trip start time (required)
- **End Time**: Trip end time (optional for Uber trips)
- **Distance**: Trip distance in kilometers
- **Amount**: Trip payment amount
- **Duration**: Trip duration in minutes (auto-calculated when both start and end times are provided)
- **Notes**: Optional additional information

### Conditional Requirements
- **End Time** is optional when Trip Type is "uber"
- **Duration** is automatically calculated when both start and end times are provided
- All other fields are required

## API Endpoints

Current API functions include:
- `getTrips()` - Get all trips
- `getTripById(id)` - Get specific trip
- `createTrip(data)` - Create new trip
- `updateTrip(id, data)` - Update existing trip
- `deleteTrip(id)` - Delete trip
- `getIncomeSummary()` - Get income summary

Add more functions to `lib/api.ts` as needed for your backend endpoints.
