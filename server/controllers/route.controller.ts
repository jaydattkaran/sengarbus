import { Request, Response } from "express";
import pool from "../config//db";

export const addRoute = async (req: Request, res: Response) => {
  try {
    const { source, destination, distance_km, estimated_time } = req.body;

    const result = await pool.query(
      "INSERT INTO routes (source, destination, distance_km, estimated_time) VALUES ($1, $2, $3, $4) RETURNING *",
      [source, destination, distance_km, estimated_time]
    );

    res
      .status(201)
      .json({ message: "Route added successfully", route: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllRoutes = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM routes ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getRouteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM routes WHERE route_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Route not found" });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { source, destination, distance_km, estimated_time } = req.body;

    const result = await pool.query(
      "UPDATE routes SET source = $1, destination = $2, distance_km = $3, estimated_time = $4 WHERE route_id = $5 RETURNING *",
      [source, destination, distance_km, estimated_time, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Route not found" });
      return;
    }

    res.json({ message: "Route updated successfully", route: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM routes WHERE route_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Route not found" });
      return;
    }

    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
