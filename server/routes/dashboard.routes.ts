import express from "express";
import {
  getDashboardSummary,
  getActiveBookings,
  getUpcomingSchedules,
} from "../controllers/dashboard.controller";

const router = express.Router();

router.get("/summary", getDashboardSummary);
router.get("/active-bookings", getActiveBookings);
router.get("/upcoming-schedules", getUpcomingSchedules);

export default router;
