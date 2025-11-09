import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const dashboardRouter = express.Router()

dashboardRouter.get("/dashboard",authorizeRoles("admin") ,getDashboard)

export default dashboardRouter