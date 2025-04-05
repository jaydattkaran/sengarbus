import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";

interface AuthRequest extends Request {
  admin?: { id: string; role: string };
}
// Register Admin with Role Restriction
export const registerAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password, role } = req.body;
  const adminId = req.admin?.id; // Get logged-in admin ID (from middleware)

  try {
    // Check if requester is a superadmin
    const adminCheck = await pool.query(
      "SELECT role FROM admins WHERE id = $1",
      [adminId]
    );

    if (!adminCheck.rows.length || adminCheck.rows[0].role !== "superadmin") {
      res.status(403).json({ error: "Only superadmin can create new admins" });
      return;
    }

    // Ensure only valid roles can be assigned
    const validRoles = ["admin", "operator"];
    if (role && !validRoles.includes(role)) {
      res.status(400).json({ error: "Invalid role assignment" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin
    const result = await pool.query(
      "INSERT INTO admins (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role || "admin"]
    );

    res.status(201).json({
      message: "Admin registered successfully",
      admin: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ id: admin.id, role: admin.role }, jwtSecret, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};

export const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM admins");

    res.json({
      admins: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const validRoles = ["admin", "superadmin"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ message: "Invalid role provided" });
      return;
    }

    const result = await pool.query(
      "UPDATE admins SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }

    res.json({
      message: "Admin role updated successfully",
      admin: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params;

  try{
    const result = await pool.query(
      "DELETE FROM admins WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    next(error);
  }
}