import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

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

app.use("/api", router);

app.listen(5000, "0.0.0.0", () => { 
  console.log(`Server is running on port ${PORT}`)
});
