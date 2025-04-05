import express from "express";
import { updateSeatStatus } from "../controllers/seat.controller";
import { authenticateAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.put("/:seat_id/status", authenticateAdmin, updateSeatStatus);

export default router;