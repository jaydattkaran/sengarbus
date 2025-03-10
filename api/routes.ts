import { Router, Request, Response, NextFunction } from "express";
import pool from "./db";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";

interface CustomRequest extends Request {
  sessionID?: string;
}

const router = Router();
const redis = new Redis();

redis
  .ping()
  .then((res) => console.log("Redis Connected:", res))
  .catch((err) => console.log("Redis Connection Error:", err));

router.use(async (req: CustomRequest, res: Response, next:NextFunction) => {
  try {
    let sessionID = req.cookies["session-id"];
  
    if(!sessionID) {
      sessionID = uuidv4();
      res.cookie("session-id", sessionID, {
        httpOnly: true,
        secure: false, // change to true if use HTTPS
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
      });
  
      await redis.setex(`session:${sessionID}`, 3600, JSON.stringify({ createdAt: Date.now() }));
      console.log("New session created:", sessionID);
    } else {
      console.log("Existing session found:", sessionID);
    }
  
    req.sessionID = sessionID;
    next();
    
  } catch (error) {
    console.error("Session middleware error:", error);
    res.status(500).json({ error: "Session handling failed" });
  }
})

router.get("/session/create", async (req: CustomRequest, res: Response) => {
 try {
   res.json({ sessionID: req.sessionID });
 } catch (error) {
   console.error("Error sending response:", error);
   res.status(500).json({ error: "Failed to send response" })  
 }
})
router.get("/", (req: CustomRequest, res: Response) => {
  console.log("Session ID in request:", req.sessionID);
  res.send({ message: "Session Test", sessionID: req.sessionID });
});

router.post("/search-buses", async (req: Request, res: Response) => {
  try {
    const { source, destination, travelDate } = req.body;

    if (!source || !destination || !travelDate) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const routeQuery = `SELECT route_id FROM routes WHERE source = $1 AND destination = $2`;
    const routeResult = await pool.query(routeQuery, [source, destination]);

    if (routeResult.rows.length === 0) {
      res
        .status(404)
        .json({ message: "No buses available for the selected route." });
      return;
    }

    const routeId = routeResult.rows[0].route_id;

    const scheduleQuery = `
    SELECT schedules.schedule_id, buses.name, schedules.departure_time, 
           schedules.arrival_time, schedules.price
    FROM schedules
    INNER JOIN buses ON schedules.bus_id = buses.bus_id
    WHERE schedules.route_id = $1 AND DATE(schedules.departure_time) = $2
`;

    const schedules = await pool.query(scheduleQuery, [routeId, travelDate]);

    if (schedules.rows.length === 0) {
      res.status(404).json({ message: "No buses available for this date" });
      return;
    }

    res.json(schedules.rows);
    return;
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Internal Server error" });
    return;
  }
});

export default router;
