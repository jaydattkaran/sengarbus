import express from "express";
import {
  sessionCreate,
  getSession,
  searchBuses,
  selectBus,
  getBookingDetails,
  getBookedTicket,
  getBookingHistory,
  bookTicket,
} from "../controllers/user.controller";
import { clerkMiddleware } from "@clerk/express";

const router = express.Router();

router.get("/session/create", sessionCreate);
router.get("/", getSession);
router.post("/search-buses", searchBuses);
router.post("/buses/select", clerkMiddleware(), selectBus);
router.get("/ticket", getBookingDetails);
router.post("/bookticket", bookTicket);
router.get("/bookedticket", getBookedTicket);
router.get("/booking-history", getBookingHistory);


export default router;