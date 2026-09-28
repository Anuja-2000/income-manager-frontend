import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PlusIcon, CarIcon, ClockIcon, DollarSignIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold text-green-800">
              Income Manager Dashboard
            </CardTitle>
            <p className="text-green-600 mt-2">Track your trips and manage your income efficiently</p>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Todays Trips</CardTitle>
              <CarIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">0</div>
              <p className="text-xs text-green-600 mt-1">No trips recorded today</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Duration</CardTitle>
              <ClockIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">0h 0m</div>
              <p className="text-xs text-green-600 mt-1">Time spent on trips</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Todays Earnings</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">$0.00</div>
              <p className="text-xs text-green-600 mt-1">Total amount earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-800">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/add-trip" className="block">
              <Button className="w-full bg-green-700 hover:bg-green-800 text-white font-bold" size="lg">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Trip
              </Button>
            </Link>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/view-trips" className="block">
                <Button variant="outline" className="w-full border-green-300 text-green-700 hover:bg-green-50" size="lg">
                  View All Trips
                </Button>
              </Link>
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" size="lg">
                Income Summary
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-green-600">
              <CarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No recent trips</p>
              <p className="text-sm mt-2">Start by adding your first trip!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}