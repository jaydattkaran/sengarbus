import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes";
import busRoutes from "./routes/bus.routes";
import userRoutes from "./routes/user.routes";
import routeRoutes from "./routes/route.routes";
import scheduleRoutes from "./routes/schedule.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import seatRoutes from "./routes/seat.routes"

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
// redis.on("error", (err) => console.error("Redis error:", err));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", userRoutes);
// app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/seats", seatRoutes);


export default app;
