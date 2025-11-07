import express from "express";
import {
  createDoctor,
  deleteDoctor,
  getDoctors,
  updateDoctor
} from "../controllers/doctorController.js";
import authenticationMiddleware, {
  authorizeRoles,
} from "../middlewares/authMiddleware.js";

const doctorRouter = express.Router();

doctorRouter.post(
  "/",
  authenticationMiddleware,
  authorizeRoles("admin"),
  createDoctor
);
doctorRouter.get("/", getDoctors);
doctorRouter.delete(
  "/:id",
  authenticationMiddleware,
  authorizeRoles("admin"),
  deleteDoctor
);
doctorRouter.delete(
  "/:id",
  authenticationMiddleware,
  authorizeRoles("admin"),
  updateDoctor
);

export default doctorRouter;
