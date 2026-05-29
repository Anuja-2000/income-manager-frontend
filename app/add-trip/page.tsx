"use client";
import { useState, useEffect } from "react";
import { incomeApi } from "../../lib/api";
import { CreateTripData, Driver } from "../../lib/types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm, SubmitHandler } from "react-hook-form";
import { tripSchema } from "@/validators/tripSchema";

export default function AddTripPage() {
    const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [formData, setFormData] = useState<CreateTripData>({
    date: today,
    startTime: "",
    endTime: "",
    distance: 0,
    amount: 0,
    duration: "",
    type: "",
    notes: "",
    amountType: "",
    driverId: 0,
    vehicleId: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const id = 0;

  const form = useForm<CreateTripData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      date: date,
      startTime: "",
      endTime: "",
      distance: 0,
      type: "",
      amount: 0,
      duration: "",
      amountType: "cash",
      driverId: id,
      vehicleId: id,
    },
  });

  // Fetch drivers on component mount
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await incomeApi.getDrivers();
        setDrivers(response.data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
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
      return diffMinutes > 0 ? diffMinutes.toString() : "";
    }
    return "";
  };

  // Auto-calculate duration when times change
  const handleStartTimeChange = (time: string) => {
    setFormData((prev) => ({ ...prev, startTime: time }));
    if (time && formData.endTime) {
      const calculatedDuration = calculateDuration(time, formData.endTime);
      if (calculatedDuration) {
        setFormData((prev) => ({ ...prev, duration: calculatedDuration }));
      }
    }
  };

  const handleEndTimeChange = (time: string) => {
    setFormData((prev) => ({ ...prev, endTime: time }));
    if (formData.startTime && time) {
      const calculatedDuration = calculateDuration(formData.startTime, time);
      if (calculatedDuration) {
        setFormData((prev) => ({ ...prev, duration: calculatedDuration }));
      }
    }
  };

  const onSubmit: SubmitHandler<CreateTripData> = async (data) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const tripData = {
        startTime: formData.startTime,
        endTime: formData.endTime || "", // Send empty string if not provided
        distance: Number(formData.distance), // Ensure it's a number (Double in backend)
        type: formData.type,
        amount: Number(formData.amount), // Ensure it's a number (Double in backend)
        duration: formData.duration.toString(), // Ensure it's a string
        amountType: formData.amountType,
        date: formData.date,
        driverId: Number(formData.driverId), // Ensure it's a number (int in backend)
        vehicleId: Number(formData.vehicleId), // Ensure it's a number (int in backend)
      };

      console.log("Submitting trip data:", tripData);

      const response = await incomeApi.createTrip(tripData);
      console.log('Trip created successfully:', response.data);

      // Reset form
      setFormData({
        date: today,
        startTime: "",
        endTime: "",
        distance: 0,
        amount: 0,
        duration: "",
        type: "",
        amountType: "",
        driverId: formData.driverId,
        vehicleId: formData.vehicleId,
        notes: "",
      });

      setMessage({ type: "success", text: "Trip added successfully!" });

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error creating trip:", error);
      setMessage({
        type: "error",
        text: "Failed to add trip. Please try again.",
      });
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
                variant={message.type === "success" ? "success" : "destructive"}
                className="mb-6"
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Date Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="date"
                  className="text-sm font-semibold text-green-700"
                >
                  Date
                </Label>
                <Input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                  className="border-green-300 focus:border-green-600 bg-green-50 w-full"
                />
              </div>

              {/* Driver Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="driver"
                  className="text-sm font-semibold text-green-700"
                >
                  Select Driver
                </Label>
                <Select
                  value={formData.driverId ? formData.driverId.toString() : ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      driverId: parseInt(value),
                    }))
                  }
                  required
                >
                  <SelectTrigger className="border-green-300 focus:border-green-600 bg-green-50">
                    <SelectValue placeholder="Choose a driver..." />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.length === 0 && (
                      <SelectItem value="no-driver" disabled>
                        No drivers available
                      </SelectItem>
                    )}
                    {drivers.map((drv) => (
                      <SelectItem key={drv.id} value={drv.id.toString()}>
                        {drv.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trip Type Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="tripType"
                  className="text-sm font-semibold text-green-700"
                >
                  Trip Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                  required
                >
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
                <Label
                  htmlFor="startTime"
                  className="text-sm font-semibold text-green-700"
                >
                  Start Time
                </Label>
                <Input
                  type="time"
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  required
                  className="border-green-300 focus:border-green-600 bg-green-50 [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <Label
                  htmlFor="endTime"
                  className="text-sm font-semibold text-green-700"
                >
                  End Time{" "}
                  {formData.type === "uber" && (
                    <span className="text-gray-500">(Optional)</span>
                  )}
                </Label>
                <Input
                  type="time"
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  required={formData.type !== "uber"}
                  className="border-green-300 focus:border-green-600 bg-green-50 [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>

              {/* Distance */}
              <div className="space-y-2">
                <Label
                  htmlFor="distance"
                  className="text-sm font-semibold text-green-700"
                >
                  Distance (km)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  id="distance"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      distance: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="Enter distance in km"
                  required
                  className="border-green-300 focus:border-green-600 bg-green-50"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label
                  htmlFor="amount"
                  className="text-sm font-semibold text-green-700"
                >
                  Amount
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  id="amount"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="Enter trip amount"
                  required
                  className="border-green-300 focus:border-green-600 bg-green-50"
                />
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label
                  htmlFor="duration"
                  className="text-sm font-semibold text-green-700"
                >
                  Duration (minutes)
                  {formData.startTime && formData.endTime && (
                    <span className="text-xs text-blue-600 ml-2">
                      (Auto-calculated)
                    </span>
                  )}
                </Label>
                <Input
                  type="number"
                  step="1"
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  placeholder="Enter trip duration in minutes"
                  required
                  className="border-green-300 focus:border-green-600 bg-green-50"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label
                  htmlFor="notes"
                  className="text-sm font-semibold text-green-700"
                >
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
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
                {isSubmitting ? "Adding Trip..." : "Add Trip"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
