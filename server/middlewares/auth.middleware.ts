import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Redis from "ioredis";
import { getAuth } from "@clerk/express";

interface AuthRequest extends Request {
  admin?: { id: string; role: string };
  sessionID?: string;
}

const redis = new Redis();

export const authenticateAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions" });
    }
    next();
  };
};

export const createUserSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let sessionID = req.cookies["sessionId"];

    // ✅ If session ID is missing, create a new one
    if (!sessionID) {
      sessionID = uuidv4();

      res.cookie("sessionId", sessionID, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      await redis.setex(
        `session:${sessionID}`,
        3600,
        JSON.stringify({ createdAt: Date.now() })
      );

      // console.log("New session created:", sessionID);
    }

    req.sessionID = sessionID;
    next();
  } catch (error) {
    console.error("Session middleware error:", error);
    res.status(500).json({ error: "Session handling failed" });
  }
};

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authData = getAuth(req);
    const userId = authData?.userId ?? null;

    if (!userId) {
      res.status(401).json({
        authenticated: false,
        message: "User not authenticated",
      });
      return; // Make sure to return after sending response
    }

    // User is authenticated
    res.status(200).json({
      authenticated: true,
      userId: userId,
    });
    return; // Make sure to return after sending response
  } catch (error) {
    console.log("Authentication check error:", error);
    res.status(500).json({
      authenticated: false,
      message: "Authentication check failed",
    });
    return; // Make sure to return after sending response
  }
};
