import express from "express";
import { addSchedule, getSchedulesByRoute, updateSchedule, deleteSchedule } from "../controllers/schedule.controller";

const router = express.Router();

router.post("/", addSchedule);
router.get("/:route_id", getSchedulesByRoute);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

export default router;