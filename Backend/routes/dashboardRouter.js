import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router()

dashboardRouter.get("/dashboard", getDashboard)

export default dashboardRouter