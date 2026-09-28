"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { incomeApi } from "../../lib/api";
import { Trip } from "@/model/trip";
import { Driver } from "@/model/driver";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  AlertCircle,
  ArrowLeftIcon,
  CalendarIcon,
  CarIcon,
  ClockIcon,
  PlusIcon,
  RefreshCwIcon,
  RouteIcon,
  SearchIcon,
  UserIcon,
  WalletIcon,
  XIcon,
} from "lucide-react";

// Radix Select does not allow an empty-string value, so "all" means "no filter"
const ALL = "all";

type SortKey =
  | "date-desc"
  | "date-asc"
  | "amount-desc"
  | "amount-asc"
  | "distance-desc"
  | "distance-asc";

interface Filters {
  search: string;
  driverId: string;
  type: string;
  amountType: string;
  dateFrom: string;
  dateTo: string;
  minAmount: string;
  maxAmount: string;
  sort: SortKey;
}

const defaultFilters: Filters = {
  search: "",
  driverId: ALL,
  type: ALL,
  amountType: ALL,
  dateFrom: "",
  dateTo: "",
  minAmount: "",
  maxAmount: "",
  sort: "date-desc",
};

const typeBadgeStyles: Record<string, string> = {
  uber: "bg-gray-900 text-white",
  pickme: "bg-yellow-400 text-yellow-950",
  cash: "bg-green-600 text-white",
  other: "bg-slate-200 text-slate-800",
};

const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

const formatAmount = (value: number) =>
  (value ?? 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Duration is stored as minutes in a string
const formatDuration = (minutes: number) => {
  if (!minutes || Number.isNaN(minutes)) return "-";
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ViewTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tripsResponse, driversResponse] = await Promise.all([
        incomeApi.getTrips(),
        incomeApi.getDrivers(),
      ]);
      setTrips(tripsResponse.data);
      setDrivers(driversResponse.data);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to load trips. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const driverNames = useMemo(
    () => new Map(drivers.map((drv) => [drv.id, drv.name])),
    [drivers]
  );

  // Build filter options from the data so new types show up automatically
  const tripTypes = useMemo(
    () =>
      Array.from(
        new Set(["uber", "pickme", "cash", "other", ...trips.map((t) => t.type)])
      ).filter(Boolean),
    [trips]
  );

  const amountTypes = useMemo(
    () => Array.from(new Set(trips.map((t) => t.amountType))).filter(Boolean),
    [trips]
  );

  const filteredTrips = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const minAmount = filters.minAmount === "" ? null : Number(filters.minAmount);
    const maxAmount = filters.maxAmount === "" ? null : Number(filters.maxAmount);

    const result = trips.filter((trip) => {
      if (filters.driverId !== ALL && trip.driverId.toString() !== filters.driverId)
        return false;
      if (filters.type !== ALL && trip.type !== filters.type) return false;
      if (filters.amountType !== ALL && trip.amountType !== filters.amountType)
        return false;
      // Dates are ISO yyyy-mm-dd strings, so string comparison is correct
      if (filters.dateFrom && trip.date < filters.dateFrom) return false;
      if (filters.dateTo && trip.date > filters.dateTo) return false;
      if (minAmount !== null && trip.amount < minAmount) return false;
      if (maxAmount !== null && trip.amount > maxAmount) return false;

      if (search) {
        const haystack = [
          trip.id,
          trip.date,
          formatDate(trip.date),
          trip.type,
          trip.amountType,
          trip.startTime,
          trip.endTime,
          trip.amount,
          trip.distance,
          driverNames.get(trip.driverId) ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });

    const [field, direction] = filters.sort.split("-") as [
      "date" | "amount" | "distance",
      "asc" | "desc",
    ];
    const factor = direction === "asc" ? 1 : -1;
    return result.sort((a, b) => {
      if (field === "date") {
        const byDate = a.date.localeCompare(b.date);
        return factor * (byDate || (a.startTime ?? "").localeCompare(b.startTime ?? ""));
      }
      return factor * ((a[field] ?? 0) - (b[field] ?? 0));
    });
  }, [trips, filters, driverNames]);

  const totals = useMemo(
    () =>
      filteredTrips.reduce(
        (acc, trip) => ({
          amount: acc.amount + (trip.amount ?? 0),
          distance: acc.distance + (trip.distance ?? 0),
          duration: acc.duration + (Number(trip.duration) || 0),
        }),
        { amount: 0, distance: 0, duration: 0 }
      ),
    [filteredTrips]
  );

  const activeFilterCount = (Object.keys(defaultFilters) as (keyof Filters)[])
    .filter((key) => key !== "sort")
    .filter((key) => filters[key] !== defaultFilters[key]).length;

  const inputClass = "border-green-300 focus:border-green-600 bg-green-50";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  aria-label="Back to dashboard"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-green-800">
                  All Trips
                </CardTitle>
                <p className="text-green-600 text-sm mt-1">
                  Search, filter and review every recorded trip
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={fetchData}
                disabled={isLoading}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <RefreshCwIcon
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Link href="/add-trip">
                <Button className="bg-green-700 hover:bg-green-800 text-white font-bold">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Trip
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>

        {/* Search & Filters */}
        <Card className="border-0 shadow-xl">
          <CardContent className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
              <Input
                type="search"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="Search by driver, type, payment, date, time, amount..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-green-700">Driver</Label>
                <Select
                  value={filters.driverId}
                  onValueChange={(value) => updateFilter("driverId", value)}
                >
                  <SelectTrigger className={`${inputClass} w-full`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All drivers</SelectItem>
                    {drivers.map((drv) => (
                      <SelectItem key={drv.id} value={drv.id.toString()}>
                        {drv.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-green-700">Trip Type</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => updateFilter("type", value)}
                >
                  <SelectTrigger className={`${inputClass} w-full`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All types</SelectItem>
                    {tripTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {capitalize(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-green-700">Payment</Label>
                <Select
                  value={filters.amountType}
                  onValueChange={(value) => updateFilter("amountType", value)}
                >
                  <SelectTrigger className={`${inputClass} w-full`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL}>All payments</SelectItem>
                    {amountTypes.map((amountType) => (
                      <SelectItem key={amountType} value={amountType}>
                        {capitalize(amountType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-green-700">Sort By</Label>
                <Select
                  value={filters.sort}
                  onValueChange={(value) => updateFilter("sort", value as SortKey)}
                >
                  <SelectTrigger className={`${inputClass} w-full`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest first</SelectItem>
                    <SelectItem value="date-asc">Oldest first</SelectItem>
                    <SelectItem value="amount-desc">Amount: high to low</SelectItem>
                    <SelectItem value="amount-asc">Amount: low to high</SelectItem>
                    <SelectItem value="distance-desc">Distance: long to short</SelectItem>
                    <SelectItem value="distance-asc">Distance: short to long</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFrom" className="text-sm font-semibold text-green-700">
                  From Date
                </Label>
                <Input
                  type="date"
                  id="dateFrom"
                  value={filters.dateFrom}
                  max={filters.dateTo || undefined}
                  onChange={(e) => updateFilter("dateFrom", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateTo" className="text-sm font-semibold text-green-700">
                  To Date
                </Label>
                <Input
                  type="date"
                  id="dateTo"
                  value={filters.dateTo}
                  min={filters.dateFrom || undefined}
                  onChange={(e) => updateFilter("dateTo", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minAmount" className="text-sm font-semibold text-green-700">
                  Min Amount
                </Label>
                <Input
                  type="number"
                  id="minAmount"
                  min="0"
                  step="0.01"
                  value={filters.minAmount}
                  onChange={(e) => updateFilter("minAmount", e.target.value)}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAmount" className="text-sm font-semibold text-green-700">
                  Max Amount
                </Label>
                <Input
                  type="number"
                  id="maxAmount"
                  min="0"
                  step="0.01"
                  value={filters.maxAmount}
                  onChange={(e) => updateFilter("maxAmount", e.target.value)}
                  placeholder="Any"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-green-100">
              <p className="text-sm text-green-700">
                Showing <span className="font-bold">{filteredTrips.length}</span> of{" "}
                <span className="font-bold">{trips.length}</span> trips
              </p>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...defaultFilters, sort: prev.sort }))}
                  className="text-green-700 hover:bg-green-50"
                >
                  <XIcon className="h-4 w-4 mr-1" />
                  Clear filters ({activeFilterCount})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary of filtered trips */}
        {!isLoading && !error && trips.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Trips", value: filteredTrips.length.toString(), icon: CarIcon },
              { label: "Total Earnings", value: formatAmount(totals.amount), icon: WalletIcon },
              { label: "Total Distance", value: `${totals.distance.toFixed(1)} km`, icon: RouteIcon },
              { label: "Total Duration", value: formatDuration(totals.duration), icon: ClockIcon },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} className="border-0 shadow-lg py-4">
                <CardContent className="px-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-green-700">{label}</p>
                    <Icon className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-green-800 mt-1">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="bg-white">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between gap-4 w-full">
              <span>{error}</span>
              <Button size="sm" variant="outline" onClick={fetchData}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-lg animate-pulse">
                <CardContent className="space-y-3">
                  <div className="h-4 bg-green-100 rounded w-1/2" />
                  <div className="h-8 bg-green-100 rounded w-2/3" />
                  <div className="h-3 bg-green-100 rounded w-full" />
                  <div className="h-3 bg-green-100 rounded w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !error && filteredTrips.length === 0 ? (
          <Card className="border-0 shadow-xl">
            <CardContent className="text-center py-12 text-green-600">
              <CarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {trips.length === 0 ? (
                <>
                  <p className="text-lg">No trips recorded yet</p>
                  <Link href="/add-trip">
                    <Button className="mt-4 bg-green-700 hover:bg-green-800 text-white">
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add your first trip
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-lg">No trips match your filters</p>
                  <Button
                    variant="outline"
                    className="mt-4 border-green-300 text-green-700 hover:bg-green-50"
                    onClick={() => setFilters(defaultFilters)}
                  >
                    Clear filters
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTrips.map((trip) => (
              <Card
                key={trip.id}
                className="border-0 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all gap-4"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="font-medium">{formatDate(trip.date)}</span>
                  </div>
                  <Badge
                    className={`border-0 ${typeBadgeStyles[trip.type] ?? typeBadgeStyles.other}`}
                  >
                    {capitalize(trip.type) || "Unknown"}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-green-800">
                      {formatAmount(trip.amount)}
                    </p>
                    {trip.amountType && (
                      <Badge variant="outline" className="border-green-300 text-green-700">
                        {capitalize(trip.amountType)}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <ClockIcon className="h-4 w-4 text-green-600 shrink-0" />
                      <span>
                        {trip.startTime || "--:--"}
                        {trip.endTime ? ` – ${trip.endTime}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <RouteIcon className="h-4 w-4 text-green-600 shrink-0" />
                      <span>{(trip.distance ?? 0).toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <UserIcon className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="truncate">
                        {driverNames.get(trip.driverId) ?? `Driver #${trip.driverId}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <CarIcon className="h-4 w-4 text-green-600 shrink-0" />
                      <span>{formatDuration(Number(trip.duration))}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
