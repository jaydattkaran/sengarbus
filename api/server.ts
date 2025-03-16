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
    origin: "https://sengarbus.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true, // Use "true" in production
      sameSite: "none", // Change to "none" if backend & frontend are on different domains
    },
  })
);

app.use("/api", router);

app.listen(5000, "0.0.0.0", () => { 
  console.log(`Server is running on port ${PORT}`)
});
function session(arg0: { secret: string; resave: boolean; saveUninitialized: boolean; cookie: { httpOnly: boolean; secure: boolean; sameSite: any; }; }): any {
  throw new Error("Function not implemented.");
}

