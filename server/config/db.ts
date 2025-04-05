import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Use DATABASE_URL if available, otherwise use individual variables

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD || ""),
  port: Number(process.env.DB_PORT) || 5432,
});

// const pool = new Pool(
//   process.env.DATABASE_URL
//     ? {
//         connectionString: process.env.DATABASE_URL,
//         ssl: { rejectUnauthorized: false }, // Required for Render
//       }
//     : {
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_NAME,
//         password: String(process.env.DB_PASSWORD || ""),
//         port: Number(process.env.DB_PORT) || 5432,
//         ssl: { rejectUnauthorized: false }, // Required for Render
//       }
// );

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL Error:", err);
});

export default pool;
