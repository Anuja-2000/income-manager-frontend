import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PlusIcon, CarIcon, ClockIcon, DollarSignIcon, ListIcon, BarChart3Icon } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your trips and manage your income efficiently</p>
          </div>
          <Button asChild>
            <Link href="/add-trip">
              <PlusIcon className="h-4 w-4" />
              Add New Trip
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Todays Trips</CardTitle>
              <CarIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">0</div>
              <p className="text-xs text-muted-foreground mt-1">No trips recorded today</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Duration</CardTitle>
              <ClockIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">0h 0m</div>
              <p className="text-xs text-muted-foreground mt-1">Time spent on trips</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Todays Earnings</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">$0.00</div>
              <p className="text-xs text-muted-foreground mt-1">Total amount earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button asChild variant="outline" size="lg" className="justify-start">
                <Link href="/view-trips">
                  <ListIcon className="h-4 w-4" />
                  View All Trips
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="justify-start">
                <BarChart3Icon className="h-4 w-4" />
                Income Summary
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <CarIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="font-medium text-foreground">No recent trips</p>
              <p className="text-sm mt-1">Start by adding your first trip!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
