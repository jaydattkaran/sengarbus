import { Request, Response } from "express";
import pool from "../config/db";

export const listBookings = async (req: Request, res: Response) => {
  try {
    const { status, user_id, start_date, end_date } = req.body;

    let query = `
        SELECT b.booking_id, b.user_id, u.firstname AS user_name, b.schedule_id, s.departure_time,
               b.seat_id, b.amount, b.status, b.created_at
        FROM bookings b
        JOIN users u ON b.user_id = u.user_id
        JOIN schedules s ON b.schedule_id = s.schedule_id
        WHERE 1=1
        `;

    let params: any[] = [];

    if (status) {
      query += `AND b.status = $${params.length + 1}`;
      params.push(status);
    }

    if (user_id) {
      query += `AND b.user_id = $${params.length + 1}`;
      params.push(user_id);
    }

    if (start_date && end_date) {
      query += `AND b.created_at BETWEEN $${params.length + 1} AND $${
        params.length + 2
      }`;
      params.push(start_date, end_date);
    }

    query += " ORDER BY b.created_at DESC";

    const result = await pool.query(query, params);
    res.json({ success: true, bookings: result.rows });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.params;

    const query = `
    SELECT b.booking_id, b.user_id, u.firstname AS user_name, u.email,
           b.schedule_id, s.departure_time, s.arrival_time, r.route_id,
           b.seat_id, b.amount, b.status, b.created_at
    FROM bookings b
    JOIN users u ON b.user_id = u.user_id
    JOIN schedules s ON b.schedule_id = s.schedule_id
    JOIN routes r ON s.route_id = r.route_id
    WHERE b.booking_id = $1
    `;

    const result = await pool.query(query, [booking_id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({ success: true, booking: result.rows[0] });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid booking status" });
      return;
    }

    const query = `
    UPDATE bookings
    SET status = $1
    WHERE booking_id = $2
    RETURNING *
    `;

    const result = await pool.query(query, [status, booking_id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({
      success: true,
      message: "Booking status updated",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
