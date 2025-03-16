import { Router, Request, Response, NextFunction } from "express";
import pool from "./db";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import {
  clerkMiddleware,
  requireAuth,
  getAuth,
  clerkClient,
} from "@clerk/express";


interface CustomRequest extends Request {
  sessionID?: string;
}
interface Stop {
  stop_type: string;
  type: "boarding" | "dropping";
  location_name: string;
  time: string;
}

const router = Router();
// Ensure REDIS_URL is defined before using it
if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set in environment variables");
}

const redis = new Redis(process.env.REDIS_URL, {
  tls: process.env.REDIS_URL.startsWith("rediss://") ? {} : undefined, // Only use TLS for secure connections
});
if (!process.env.CLERK_SECRET_KEY) {
  console.error("Missing CLERK_SECRET_KEY environment variable");
  process.exit(1);
}

redis
  .ping()
  .then((res) => console.log("Redis Connected:", res))
  .catch((err) => console.log("Redis Connection Error:", err));

  router.use(async (req: CustomRequest, res: Response, next: NextFunction) => {
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
  });

router.get("/session/create", async (req: CustomRequest, res: Response) => {
  try {
    res.json({ sessionID: req.sessionID });
  } catch (error) {
    console.error("Error sending response:", error);
    res.status(500).json({ error: "Failed to send response" });
  }
});
router.get("/", (req: CustomRequest, res: Response) => {
  console.log("Session ID in request:", req.sessionID);
  res.send({ message: "Session Test", sessionID: req.sessionID });
});

router.post("/search-buses", async (req: Request, res: Response) => {
  try {
    // console.log("Received headers:", req.headers);
    console.log("Received data:", req.body);
    const { source, destination, travelDate } = req.body;
    const formattedDate = new Date(travelDate).toISOString().split("T")[0];

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
      SELECT 
          schedules.schedule_id, 
          schedules.departure_time, 
          schedules.arrival_time, 
          buses.bus_id, 
          buses.name AS bus_name, 
          buses.type AS bus_type, 
          buses.capacity, 
          routes.route_id, 
          routes.source, 
          routes.destination, 
          routes.distance_km 
      FROM schedules
      INNER JOIN buses ON schedules.bus_id = buses.bus_id
      INNER JOIN routes ON schedules.route_id = routes.route_id
      WHERE schedules.route_id = $1 AND DATE(schedules.departure_time) = $2;
    `;

    console.log("Executing query with:", routeId, formattedDate);
    const schedules = await pool.query(scheduleQuery, [routeId, formattedDate]);
    console.log("Executed query with provided data:");

    if (schedules.rows.length === 0) {
      res.status(404).json({ message: "No buses available for this date" });
      return;
    }

    for (let schedule of schedules.rows) {
      const seatQuery = `
      SELECT seat_no, seat_type, status, price 
      FROM seats 
      WHERE schedule_id = $1 ORDER BY seat_no;
    `;
      const seatsResult = await pool.query(seatQuery, [schedule.schedule_id]);

      schedule.available_seats = seatsResult.rows;

      // Fetch boarding & dropping points
      const stopsQuery = `
     SELECT stop_type, location_name, time 
     FROM stops 
     WHERE schedule_id = $1 
     ORDER BY time ASC;
   `;
      const stopsResult = await pool.query(stopsQuery, [schedule.schedule_id]);

      // Separate boarding and dropping points
      schedule.boarding_points = stopsResult.rows.filter(
        (stop: Stop) => stop.stop_type === "boarding"
      );
      schedule.dropping_points = stopsResult.rows.filter(
        (stop) => stop.stop_type === "dropping"
      );
    }

    // console.log("Data fetched from DB:", schedules.rows);
    res.json({ success: true, buses: schedules.rows });
    return;
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Internal Server error" });
    return;
  }
});

router.get(
  "/auth/check",
  clerkMiddleware(),
  async (req: Request, res: Response) => {
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
  }
);

router.post(
  "/buses/select",
  clerkMiddleware(),
  async (req: Request, res: Response) => {
    try {
      const sessionID = req.cookies?.["sessionId"];
      if (!sessionID) {
        res.status(400).json({ error: "Session ID missing" });
        return;
      }
      const { bus } = req.body;
      // console.log("data recieved:", bus)

      const authData = getAuth(req);
      const userId = authData?.userId ?? null;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const clerkUser = await clerkClient.users.getUser(userId);
      const { firstName, lastName, emailAddresses, phoneNumbers } = clerkUser;

      const email = emailAddresses?.[0]?.emailAddress ?? null;
      const phone = phoneNumbers?.[0]?.phoneNumber ?? null;

      const userExists = await pool.query(
        "SELECT clerkId FROM users WHERE clerkId = $1",
        [userId]
      );
      if (userExists.rows.length === 0) {
        await pool.query(
          "INSERT INTO users (clerkId, firstname, lastname, email, phone) VALUES ($1, $2, $3, $4, $5)",
          [userId, firstName, lastName, email, phone]
        );
      } else {
        const user = userExists.rows[0];

        await pool.query(
          `UPDATE users 
           SET firstname = COALESCE(NULLIF($2, ''), firstname),
               lastname = COALESCE(NULLIF($3, ''), lastname),
               email = COALESCE(NULLIF($4, ''), email),
               phone = COALESCE(NULLIF($5, ''), phone)
           WHERE clerkId = $1`,
          [userId, firstName, lastName, email, phone]
        );
      }

      await redis.set(`session:${sessionID}:selectedBus`, JSON.stringify(bus));
      await redis.set(`session:${sessionID}:userId`, userId);
      const fullData = { bus, userId };

      res.json(fullData);
    } catch (error) {
      console.log("Authentication Error:", error);
      res.status(401).json({ error: "Unauthorized" });
    }
  }
);

router.get("/ticket", async (req: Request, res: Response) => {
  try {
    // ✅ Apply Clerk Authentication
    requireAuth()(req, res, async () => {
      const sessionID = req.cookies?.["sessionId"];
      if (!sessionID) {
        return res.status(400).json({ error: "Session ID missing" });
      }

      const busData = await redis.get(`session:${sessionID}:selectedBus`);
      const userId = await redis.get(`session:${sessionID}:userId`);

      if (!busData) {
        return res.status(404).json({ error: "No bus selected" });
      }

      const userDataQuery = await pool.query(
        `SELECT firstname, lastname, email, phone FROM users WHERE clerkId = $1`,
        [userId]
      );

      const userData = userDataQuery.rows[0] ?? {};

      // Structure the response to match the POST response
      const fullData = { bus: JSON.parse(busData), userId, userData };

      res.json(fullData);
    });
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.post("/bookticket", async (req: Request, res: Response) => {
  const {
    seat_id,
    firstname,
    lastname,
    email,
    phone,
    age,
    gender,
    amount,
    schedule_id,
  } = req.body;
  // console.log("Request payload in backend:", req.body);

  const sessionID = req.cookies?.["sessionId"];
  // console.log("Session ID:", sessionID);
  if (!sessionID) {
    res.status(400).json({ error: "Session ID missing" });
    return;
  }
  try {
    await pool.query("BEGIN");

    const redisStart = Date.now();
    const clerkId = await redis.get(`session:${sessionID}:userId`);
    // console.log(
    //   `Clerk ID from Redis: ${clerkId} (Time taken: ${
    //     Date.now() - redisStart
    //   }ms)`
    // );

    if (!clerkId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const fieldsToUpdate: string[] = [];
    const values: any[] = [];
    let index = 1;

    if (firstname) {
      fieldsToUpdate.push(`firstname = $${index}`);
      values.push(firstname);
      index++;
    }
    if (lastname) {
      fieldsToUpdate.push(`lastname = $${index}`);
      values.push(lastname);
      index++;
    }
    if (age) {
      fieldsToUpdate.push(`age = $${index}`);
      values.push(age);
      index++;
    }
    if (gender) {
      fieldsToUpdate.push(`gender = $${index}`);
      values.push(gender);
      index++;
    }
    if (email) {
      fieldsToUpdate.push(`email = $${index}`);
      values.push(email);
      index++;
    }
    if (phone) {
      fieldsToUpdate.push(`phone = $${index}`);
      values.push(phone);
      index++;
    }

    if (fieldsToUpdate.length > 0) {
      values.push(clerkId);
      await pool.query(
        `UPDATE users SET ${fieldsToUpdate.join(
          ", "
        )} WHERE clerkId = $${index}`,
        values
      );
    }

    const userResult = await pool.query(
      `SELECT user_id FROM users WHERE clerkId = $1`,
      [clerkId]
    );

    const user_id = userResult.rows[0].user_id;
    // console.log("User ID from DB:", user_id);

    const seatNumbers = seat_id
      .map((s: { seat_no: number }) => s.seat_no)
      .join(",");

    // console.log("Seat Numbers Processed:", seatNumbers);

    const bookingResult = await pool.query(
      `INSERT INTO bookings (user_id, seat_id, schedule_id, amount, payment_status) 
       VALUES ($1, $2, $3, $4, 'success') RETURNING *`,
      [user_id, seatNumbers, schedule_id, amount]
    );
    // console.log(
    //   `Booking inserted (Time taken: ${Date.now() - bookingInsertStart}ms)`
    // );
    // console.log("Booking Result:", bookingResult.rows);

    try {
      const seatIds = seat_id
        .map((s: { seat_no: string | number }) => Number(s.seat_no))
        .filter((num: number) => !isNaN(num)); // Ensures valid numbers

      const { rowCount } = await pool.query(
        `UPDATE seats SET status = 'Booked' WHERE seat_no = ANY($1::int[]) RETURNING seat_no`,
        [seatIds]
      );

      if (rowCount === 0) {
        throw new Error("No seats were updated. Check seat_no values.");
      }

      await pool.query("COMMIT"); // Commit transaction
      // console.log("Transaction committed successfully.");
    } catch (error) {
      await pool.query("ROLLBACK"); // Rollback on failure
      // console.error("Transaction failed, rolled back:", error);
      throw error; // Ensure error is sent to frontend
    }

    // const paymentUrl = await paymentGateway.createPayment({
    //   amount,
    //   currency: "INR",
    //   userId,
    //   success_url: "https://yourdomain.com/payment-success",
    //   failure_url: "https://yourdomain.com/payment-failure",
    // })

    res.status(200).json({
      message: "Booking successful",
      booking: bookingResult.rows[0],
      booking_id: bookingResult.rows[0].booking_id,
    });
  } catch (error: any) {
    await pool.query("ROLLBACK");
    console.error("Payment Failiure:", error);
    res.status(401).json({ error: error.message });
  }
});

router.get("/bookedticket", async (req: Request, res: Response) => {
  try {
    const { booking_id } = req.query;

    const bookingResults = await pool.query(
      `SELECT booking_id, user_id, schedule_id, amount, payment_status, created_at, seat_id 
       FROM bookings WHERE booking_id = $1`,
      [booking_id]
    );

    if (bookingResults.rows.length === 0) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    const booking = bookingResults.rows[0];

    const userResult = await pool.query(
      `SELECT firstname, lastname, email, phone FROM users WHERE user_id = $1`,
      [booking.user_id]
    );

    const scheduleResult = await pool.query(
      `SELECT schedule_id, route_id, travel_date, bus_id, departure_time, arrival_time FROM schedules WHERE schedule_id = $1`,
      [booking.schedule_id]
    );

    const schedule = scheduleResult.rows[0];

    let route = null;
    if (schedule?.route_id) {
      const routeResult = await pool.query(
        `SELECT route_id, source, destination FROM routes WHERE route_id = $1`,
        [schedule.route_id]
      );
      route = routeResult.rows.length > 0 ? routeResult.rows[0] : null;
    }

    const seatIds = booking.seat_id
      ? booking.seat_id.split(",").map(Number)
      : [];

    const seatResult = await pool.query(
      `SELECT seat_id, seat_no, seat_type, price FROM seats WHERE seat_id = ANY($1)`,
      [seatIds]
    );

    res.status(200).json({
      booking_id: booking.booking_id,
      user: userResult.rows[0] || null,
      seats: seatResult.rows,
      schedule: schedule
        ? {
            ...schedule,
            route: route || null,
          }
        : null,
      amount: booking.amount,
      payment_status: booking.payment_status,
      booked_at: booking.created_at
        ? new Date(booking.created_at).toISOString()
        : null,
    });
  } catch (error) {
    console.error("Error retrieving booking details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/booking-history", async (req: Request, res: Response) => {
  try {
    requireAuth()(req, res, async () => {
      const sessionID = req.cookies?.["sessionId"];
      if (!sessionID) {
        return res.status(400).json({ error: "Session ID is missing" });
      }

      const authData = getAuth(req);
      const userId = authData?.userId ?? null;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Fetch user details from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);
      const { firstName } = clerkUser;

      // Fetch user_id from DB
      const userExists = await pool.query(
        "SELECT user_id FROM users WHERE clerkId = $1",
        [userId]
      );

      const user_id = userExists?.rows[0]?.user_id;

      if (!user_id) {
        return res.status(404).json({ error: "User not found in database" });
      }

      // Fetch booking history
      const bookingHistoryResults = await pool.query(
        `SELECT 
          b.booking_id, b.user_id, b.schedule_id, b.payment_status,
          TO_CHAR(s.travel_date::TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS') AS travel_date,
          s.bus_id, s.route_id,
          bu.name AS bus_name, bu.type AS bus_type,
          r.source AS start_location, r.destination AS end_location,
          se.seat_no, se.seat_type
        FROM bookings b
        JOIN schedules s ON b.schedule_id = s.schedule_id
        JOIN buses bu ON s.bus_id = bu.bus_id
        JOIN routes r ON s.route_id = r.route_id
        JOIN LATERAL (SELECT unnest(string_to_array(b.seat_id, ',')::int[])) AS seat_id ON TRUE
        JOIN seats se ON seat_id.unnest = se.seat_id
        WHERE b.user_id = $1;
        `,
        [user_id]
      );

      if (bookingHistoryResults.rowCount === 0) {
        return res
          .status(200)
          .json({ message: "No bookings found", bookingHistory: [] });
      }

      // Group bookings by booking_id
      const groupedBookings: { [key: number]: any } = {};

      bookingHistoryResults.rows.forEach((booking: any) => {
        const bookingId = booking.booking_id;

        if (!groupedBookings[bookingId]) {
          groupedBookings[bookingId] = {
            bookingId: booking.booking_id,
            userId: booking.user_id,
            paymentStatus: booking.payment_status,
            travelDate: booking.travel_date,
            busDetails: {
              busId: booking.bus_id,
              name: booking.bus_name,
              type: booking.bus_type,
            },
            routeDetails: {
              routeId: booking.route_id,
              startLocation: booking.start_location,
              endLocation: booking.end_location,
            },
            seatDetails: [],
          };
        }

        // Append seat details
        groupedBookings[bookingId].seatDetails.push({
          seatNumber: booking.seat_no,
          seatType: booking.seat_type,
        });
      });

      // Convert object to array
      const formattedBookingHistory = Object.values(groupedBookings);

      res.status(200).json({
        message: "Booking History",
        bookingHistory: formattedBookingHistory,
        firstName,
      });
    });
  } catch (error) {
    console.error("Error fetching booking history", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;