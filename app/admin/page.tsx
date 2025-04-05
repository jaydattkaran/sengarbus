"use client";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define TypeScript interfaces
interface DashboardSummary {
  totalUsers: number;
  totalBuses: number;
  totalBookings: number;
  totalRevenue: number;
  activeTrips: number;
}

interface Booking {
  user_name: string;
  amount: number;
  created_at: string | number | Date;
  departure_time: string | number | Date;
  payment_status: string;
  destination: string;
  schedule_id: number;
  booking_id: number;
  user_id: number;
  seat_id: string;
  status: string;
}

interface Schedule {
  destination: string;
  arrival_time: string | number | Date;
  travel_date: string;
  status: string;
  created_at: string | number | Date;
  source: string;
  bus_id: number;
  schedule_id: string;
  id: number;
  route_id: number;
  departure_time: string;
}

const Dashboard = () => {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  const [dashboardData, setDashboardData] = useState<DashboardSummary>({
    totalBookings: 0,
    totalRevenue: 0,
    activeTrips: 0,
    totalBuses: 0,
    totalUsers: 0,
  });

  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      const fetchDashboardData = async () => {
        try {
          const API_URL = process.env.NEXT_PUBLIC_API_URL;
          const token = await getToken();

          const [summaryRes, activeBookingsRes, upcomingSchedulesRes] =
            await Promise.all([
              fetch(`${API_URL}/api/dashboard/summary`, {
                method: "GET",
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
              fetch(`${API_URL}/api/dashboard/active-bookings`, {
                method: "GET",
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
              fetch(`${API_URL}/api/dashboard/upcoming-schedules`, {
                method: "GET",
                credentials: "include",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }),
            ]);

          if (
            !summaryRes.ok ||
            !activeBookingsRes.ok ||
            !upcomingSchedulesRes.ok
          ) {
            throw new Error("Failed to fetch one or more API responses");
          }

          const [summaryData, activeBookingsData, upcomingSchedulesData] =
            await Promise.all([
              summaryRes.json(),
              activeBookingsRes.json(),
              upcomingSchedulesRes.json(),
            ]);

          console.log(
            "Dashboard data:",
            summaryData,
            activeBookingsData,
            upcomingSchedulesData
          );

          setDashboardData(summaryData);
          setActiveBookings(activeBookingsData);
          setUpcomingSchedules(upcomingSchedulesData);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchDashboardData();
    }
  }, [isSignedIn, getToken]);

  // Dummy Data for Charts
  const revenueData = [
    { month: "Jan", revenue: 10000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 22000 },
    { month: "Apr", revenue: 17000 },
    { month: "May", revenue: 25000 },
  ];

  const bookingDistribution = [
    { name: "Active", value: activeBookings.length },
    {
      name: "Completed",
      value: dashboardData.totalBookings - activeBookings.length,
    },
    { name: "Canceled", value: 5 }, // Placeholder, replace with real canceled count
  ];

  const tripsPerRoute = [
    { route: "Route A", trips: 12 },
    { route: "Route B", trips: 8 },
    { route: "Route C", trips: 15 },
  ];

  return (
    <div className="p-6 w-[100vw] md:w-[90vw]">
      {loading ? (
        <div className="py-6 text-lg">Fetching dashboard data...</div>
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <div>
          {/* Dashboard Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 dark:bg-blue-500/40 bg-blue-500 text-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Total Bookings</h3>
              <p className="text-2xl">{dashboardData.totalBookings}</p>
            </div>
            <div className="p-4 dark:bg-green-500/40 bg-green-500 text-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Total Revenue</h3>
              <p className="text-2xl">₹{dashboardData.totalRevenue}</p>
            </div>
            <div className="p-4 dark:bg-yellow-500/40 bg-yellow-500 text-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Active Trips</h3>
              <p className="text-2xl">{dashboardData.activeTrips}</p>
            </div>
            <div className="p-4 dark:bg-green-500/40 bg-green-500 text-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Total Buses</h3>
              <p className="text-2xl">₹{dashboardData.totalBuses}</p>
            </div>
            <div className="p-4 dark:bg-yellow-500/40 bg-yellow-500 text-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">Total Users</h3>
              <p className="text-2xl">{dashboardData.totalUsers}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Revenue Trend Line Chart */}
            <div className="border border p-4 shadow-md rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-2">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Booking Distribution Pie Chart */}
            <div className="border p-4 shadow-md rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-2">
                Booking Distribution
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={bookingDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#82ca9d"
                  >
                    <Cell fill="#0088FE" />
                    <Cell fill="#00C49F" />
                    <Cell fill="#FFBB28" />
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Active Trips Per Route Bar Chart */}
            <div className="border p-4 shadow-md rounded-lg mb-6">
              <h2 className="text-lg font-semibold mb-2">Trips Per Route</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tripsPerRoute}>
                  <XAxis dataKey="route" />
                  <YAxis />
                  <Tooltip cursor={{ fill: "#f5f5f5" }} />
                  <Legend />
                  <Bar dataKey="trips" fill="#FF8042">
                    <LabelList
                      dataKey="trips"
                      position="top"
                      fill="#333"
                      fontSize={14}
                    />
                    {tripsPerRoute.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index % 2 === 0 ? "#FF8042" : "#FFBB28"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Another Chart Placeholder */}
          <div className="md:w-[88vw] overflow-x-auto mb-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Upcoming Schedules</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                {upcomingSchedules.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead className="dark:bg-gray-800 bg-gray-300">
                        <tr>
                          <th className="border p-2">Schedule ID</th>
                          <th className="border p-2">Route ID</th>
                          <th className="border p-2">Bus ID</th>
                          <th className="border p-2">Source</th>
                          <th className="border p-2">Destination</th>
                          <th className="border p-2">Departure Time</th>
                          <th className="border p-2">Arrival Time</th>
                          <th className="border p-2">Travel Date</th>
                          <th className="border p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingSchedules.map((schedule, index) => (
                          <tr
                            key={
                              schedule.schedule_id ||
                              `${schedule.route_id}-${index}`
                            }
                            className="dark:hover:bg-neutral-700 hover:bg-neutral-100"
                          >
                            <td className="border p-2">
                              {schedule.schedule_id}
                            </td>
                            <td className="border p-2">{schedule.route_id}</td>
                            <td className="border p-2">{schedule.bus_id}</td>
                            <td className="border p-2">{schedule.source}</td>
                            <td className="border p-2">
                              {schedule.destination}
                            </td>
                            <td className="border p-2">
                              {new Date(
                                schedule.departure_time
                              ).toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {new Date(schedule.arrival_time).toLocaleString()}
                            </td>
                            <td className="border p-2">
                              {schedule.travel_date}
                            </td>
                            <td className="border p-2">
                              {schedule.status ?? "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    No upcoming schedules found.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Total Bookings */}
          <div className="md:w-[88vw] overflow-x-auto mb-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Active Bookings</CardTitle>
              </CardHeader>
              <CardContent className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                {activeBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                      <thead className="dark:bg-gray-800 bg-gray-300">
                        <tr>
                          <th className="border p-2">Booking ID</th>
                          <th className="border p-2">User ID</th>
                          <th className="border p-2">User Name</th>
                          <th className="border p-2">Seat</th>
                          <th className="border p-2">Payment Status</th>
                          <th className="border p-2">Departure Time</th>
                          <th className="border p-2">Amount</th>
                          <th className="border p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeBookings.map((booking, index) => (
                          <tr
                            key={
                              booking.booking_id ||
                              `${booking.user_id}-${index}`
                            }
                            className="dark:hover:bg-neutral-700 hover:bg-neutral-100"
                          >
                            <td className="border p-2">{booking.booking_id}</td>
                            <td className="border p-2">{booking.user_id}</td>
                            <td className="border p-2">{booking.user_name}</td>
                            <td className="border p-2">{booking.seat_id}</td>
                            <td className="border p-2">
                              {booking.payment_status}
                            </td>
                            <td className="border p-2">
                              {new Date(
                                booking.departure_time
                              ).toLocaleString()}
                            </td>

                            <td className="border p-2">{booking.amount}</td>
                            <td className="border p-2">
                              {booking.status ?? "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    No upcoming schedules found.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
