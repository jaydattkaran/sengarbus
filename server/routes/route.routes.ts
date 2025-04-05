import express from "express";
import { addRoute, getAllRoutes, getRouteById, updateRoute, deleteRoute } from "../controllers/route.controller";

const router = express.Router();

router.post("/", addRoute);
router.get("/", getAllRoutes);
router.get("/:id", getRouteById);
router.put("/:id", updateRoute);
router.delete("/:id", deleteRoute);

export default router;