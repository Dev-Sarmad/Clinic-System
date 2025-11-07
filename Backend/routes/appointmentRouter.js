import express from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointmentController.js";
import { authorizeRoles } from "../middlewares/authMiddleware.js";

const appointmentRouter = express.Router();

appointmentRouter.post("/", createAppointment);
appointmentRouter.get("/", getAppointments);
appointmentRouter.get("/:id", getAppointmentById);
appointmentRouter.put(
  "/:id/:status",
  authorizeRoles("doctor", "admin"),
  updateAppointmentStatus
);
appointmentRouter.delete(
  "/:id",
  authorizeRoles("patient", "admin"),
  deleteAppointment
);

export default appointmentRouter;
