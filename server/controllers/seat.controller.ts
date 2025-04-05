import { Request, Response } from "express";
import pool from "../config/db";

export const updateSeatStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { seat_id } = req.params;
  let { status } = req.body;

  // Convert status to match the exact database values
  const validStatuses = ["Available", "Booked"];
  status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(); // Capitalize first letter

  if (!validStatuses.includes(status)) {
    res.status(400).json({ message: "Invalid seat status provided" });
    return;
  }

  try {
    const result = await pool.query(
      "UPDATE seats SET status = $1 WHERE seat_id = $2 RETURNING *",
      [status, Number(seat_id)]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Seat not found" });
      return;
    }

    res.json({
      message: "Seat status updated successfully",
      seat: result.rows[0],
    });
  } catch (error) {
    console.log("Error updating seat status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
