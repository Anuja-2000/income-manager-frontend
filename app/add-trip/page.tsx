'use client';
import { useState, useEffect } from 'react';
import { incomeApi } from '../../lib/api';
import { CreateTripData, Driver } from '../../lib/types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, useForm } from "react-hook-form"
import { Trip } from '@/model/trip';
import { tripSchema } from '@/validators/tripSchema';

export default function AddTripPage() {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driver, setDriver] = useState('');
  const [tripType, setTripType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [distance, setDistance] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const form = useForm<Trip>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      date,
      startTime,
      endTime,
      distance,
      amount,
      duration,
      tripType,
      driver,
      notes,
    },
  });

    // Fetch drivers on component mount
    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await incomeApi.getDrivers();
                setDrivers(response.data);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };

        fetchDrivers();
    }, []);

  // Calculate duration automatically when start and end times are provided
  const calculateDuration = (start: string, end: string) => {
    if (start && end) {
      const startTime = new Date(`2000-01-01 ${start}`);
      const endTime = new Date(`2000-01-01 ${end}`);
      const diffMs = endTime.getTime() - startTime.getTime();
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      return diffMinutes > 0 ? diffMinutes.toString() : '';
    }
    return '';
  };

  // Auto-calculate duration when times change
  const handleStartTimeChange = (time: string) => {
    setStartTime(time);
    if (time && endTime) {
      const calculatedDuration = calculateDuration(time, endTime);
      if (calculatedDuration) {
        setDuration(calculatedDuration);
      }
    }
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);
    if (startTime && time) {
      const calculatedDuration = calculateDuration(startTime, time);
      if (calculatedDuration) {
        setDuration(calculatedDuration);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const tripData: CreateTripData = {
        date,
        startTime,
        endTime: tripType === 'uber' ? endTime || '' : endTime,
        distance: parseFloat(distance),
        amount: parseFloat(amount),
        duration: parseFloat(duration),
        tripType,
        driver,
        notes,
      };

      //const response = await incomeApi.createTrip(tripData);
      //console.log('Trip created successfully:', response.data);
      
      // Reset form
      setDriver('');
      setTripType('');
      setStartTime('');
      setEndTime('');
      setDistance('');
      setAmount('');
      setDuration('');
      setNotes('');
      
      setMessage({ type: 'success', text: 'Trip added successfully!' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error('Error creating trip:', error);
      setMessage({ type: 'error', text: 'Failed to add trip. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-800 p-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold text-green-800">
              Add New Trip
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Alert Message */}
            {message && (
              <Alert 
                variant={message.type === 'success' ? 'success' : 'destructive'} 
                className="mb-6"
              >
                {message.type === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Date Field */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-semibold text-green-700">
                    Date
                  </Label>
                <Input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="border-green-300 focus:border-green-600 bg-green-50"
                />
              </div>

              {/* Driver Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="driver" className="text-sm font-semibold text-green-700">
                  Select Driver
                </Label>
                <Select value={driver} onValueChange={setDriver} required>
                  <SelectTrigger className="border-green-300 focus:border-green-600 bg-green-50">
                    <SelectValue placeholder="Choose a driver..." />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.length === 0 && (
                      <SelectItem value="no-driver" disabled>No drivers available</SelectItem>
                    )}
                    {drivers.map((drv) => (
                      <SelectItem key={drv.id} value={drv.name}>{drv.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trip Type Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="tripType" className="text-sm font-semibold text-green-700">
                  Trip Type
                </Label>
                <Select value={tripType} onValueChange={setTripType} required>
                  <SelectTrigger className="border-green-300 focus:border-green-600 bg-green-50">
                    <SelectValue placeholder="Choose trip type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uber">Uber</SelectItem>
                    <SelectItem value="pickme">Pickme</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-semibold text-green-700">
                  Start Time
                </Label>
                <Input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  required
                  className="border-green-300 focus:border-green-600 bg-green-50"
                />
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-semibold text-green-700">
                  End Time {tripType === 'uber' && <span className="text-gray-500">(Optional)</span>}
                </Label>
                <Input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  required={tripType !== 'uber'}
                  className="border-green-300 focus:border-green-600 bg-green-50"
                />
              </div>

              {/* Distance */}
              <div className="space-y-2">
                <Label htmlFor="distance" className="text-sm font-semibold text-green-700">
                  Distance (km)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  id="distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Enter distance in km"
                  required
                  className="border-green-300 focus:border-green-600 bg-green-50"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-semibold text-green-700">
                  Amount
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter trip amount"
                  required
                  className="border-green-300 focus:border-green-600 bg-green-50"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-semibold text-green-700">
                  Duration (minutes)
                  {startTime && endTime && (
                    <span className="text-xs text-blue-600 ml-2">(Auto-calculated)</span>
                  )}
                </Label>
                <Input
                  type="number"
                  step="1"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Enter trip duration in minutes"
                  required
                  className="border-green-300 focus:border-green-600 bg-green-50"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold text-green-700">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Additional notes about the trip"
                  className="border-green-300 focus:border-green-600 bg-green-50 resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold shadow-lg hover:shadow-xl"
                size="lg"
              >
                {isSubmitting ? 'Adding Trip...' : 'Add Trip'}
              </Button>
            </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}