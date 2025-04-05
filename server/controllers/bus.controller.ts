import { Request, Response } from "express";
import pool from "../config/db";

export const addBus = async (req: Request, res: Response) => {
  try {
    const { bus_number, bus_name, bus_type, total_seats, operator_name, bus_status } =
      req.body;

    const result = await pool.query(
      "INSERT INTO buses (bus_number, bus_type, total_seats, operator_name, bus_status, bus_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [bus_number, bus_type, total_seats, operator_name, bus_status || "Active", bus_name]
    );

    res
      .status(201)
      .json({ message: "Bus added successfully", bus: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBuses = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM buses ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getBusById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM buses WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Bus not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { bus_number, bus_type, total_seats, operator_name, bus_status } =
      req.body;

      const result = await pool.query(
        "UPDATE buses SET bus_number = $1, bus_type = $2, total_seats = $3, operator_name = $4, bus_status = $5 WHERE bus_id = $6 RETURNING *",
        [bus_number, bus_type, total_seats, operator_name, bus_status, id]
      );
      

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Bus not found" });
      return;
    }

    res.json({ message: "Bus updated successfully", bus: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("Deleting bus with ID:", id);
    const result = await pool.query(
      "DELETE FROM buses WHERE bus_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      console.log("No bus found with ID:", id);
      res.status(404).json({ message: "Bus not found" });
      return;
    }

    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Error while deleting bus:", error);
    res.status(500).json({ message: "Server error" });
  }
};
