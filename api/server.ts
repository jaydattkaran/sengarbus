import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import Redis from "ioredis";
import cookieParser from "cookie-parser";
// import { createClient } from 'redis'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const redis = new Redis();

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

app.use("/api", router);

app.listen(5000, "0.0.0.0", () => { 
  console.log(`Server is running on port ${PORT}`)
});
