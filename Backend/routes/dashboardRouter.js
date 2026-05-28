import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import authenticationMiddleware, {
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const dashboardRouter = express.Router();

dashboardRouter.get(
  "/dashboard",
  authenticationMiddleware,
  authorizeRoles("admin", "doctor", "patient"),
  getDashboard,
);

export default dashboardRouter