import { Request, Response } from "express";
import pool from "../config/db";

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM bookings) AS total_bookings,
        (SELECT COALESCE(SUM(amount), 0) FROM bookings) AS total_revenue,
        (SELECT COUNT(*) FROM bookings WHERE status = 'active') AS active_trips,
        (SELECT COUNT(*) FROM buses) AS total_buses,
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT 
            ROUND(
              (COUNT(*) FILTER (WHERE status = 'booked') * 100.0 / NULLIF(COUNT(*), 0)), 2
            ) 
          FROM seats
        ) AS seat_utilization
    `);

    res.json({
      totalBookings: result.rows[0].total_bookings,
      totalRevenue: result.rows[0].total_revenue,
      activeTrips: result.rows[0].active_trips,
      totalBuses: result.rows[0].total_buses,
      totalUsers: result.rows[0].total_users,
      seatUtilization: result.rows[0].seat_utilization + "%" || "0%",
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getActiveBookings = async (req: Request, res: Response) => {
  try {
    const activeBookings = await pool.query(`
      SELECT b.*, u.firstname AS user_name, s.departure_time
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN schedules s ON b.schedule_id = s.schedule_id
      WHERE b.status = 'active'
    `);

    res.json(activeBookings.rows);
  } catch (error) {
    console.error("Error fetching active bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUpcomingSchedules = async (req: Request, res: Response) => {
  try {
    const upcomingSchedules = await pool.query(`
      SELECT s.*, r.source, r.destination 
      FROM schedules s
      JOIN routes r ON s.route_id = r.route_id
      WHERE s.departure_time BETWEEN NOW() AND NOW() + INTERVAL '24 HOURS'
      ORDER BY s.departure_time ASC
    `);

    res.json(upcomingSchedules.rows);
  } catch (error) {
    console.error("Error fetching upcoming schedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
