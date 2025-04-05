import { Request, Response } from "express";
import pool from "../config//db";

export const addSchedule = async (req: Request, res: Response) => {
  try {
    const {
      route_id,
      bus_id,
      departure_time,
      arrival_time,
      travel_date,
      status,
    } = req.body;

    const result = await pool.query(
      "INSERT INTO schedules (route_id, bus_id, departure_time, arrival_time, travel_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        route_id,
        bus_id,
        departure_time,
        arrival_time,
        travel_date,
        status || "sheduled",
      ]
    );

    res.status(201).json({
      message: "Schedule added successfully",
      schedule: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSchedulesByRoute = async (req: Request, res: Response) => {
  try {
    const { route_id } = req.params;

    const result = await pool.query(
      "SELECT * FROM schedules WHERE route_id = $1",
      [route_id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { departure_time, arrival_time, travel_date, status } = req.body;

    const result = await pool.query(
      "UPDATE schedules SET departure_time = $1, arrival_time = $2, travel_date = $3, status = $4 WHERE schedule_id = $5 RETURNING *",
      [departure_time, arrival_time, travel_date, status, id]
    );

    res.json({
      message: "Schedule updated successfully",
      schedule: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM schedules WHERE schedule_id = $1 RETURNING *",
      [id]
    );

    res.json({ message: "Schedule deleted successfully " });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
