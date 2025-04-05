import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAllAdmins,
  updateAdminRole,
  deleteAdmin,
} from "../controllers/admin.controller";
import {
  listBookings,
  getBookingById,
  updateBookingStatus,
} from "../controllers/adminBooking.controller";
import {
  authenticateAdmin,
  authorizeRole,
} from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticateAdmin, authorizeRole(["superadmin"]), getAllAdmins);
router.put(
  "/:id",
  authenticateAdmin,
  authorizeRole(["superadmin"]),
  updateAdminRole
);
router.delete(
  "/:id",
  authenticateAdmin,
  authorizeRole(["superadmin"]),
  deleteAdmin
);

router.post(
  "/register",
  authenticateAdmin,
  authorizeRole(["superadmin"]),
  registerAdmin
);
router.post("/login", loginAdmin);
router.get("/bookings", listBookings);
router.get("/bookings/:booking_id", getBookingById);
router.put("/bookings/:booking_id", updateBookingStatus);

export default router;
