import express from "express";
import { authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  createPrescription,
  updatePrescription,
  getPrescriptionById,
  getPrescriptions,
} from "../controllers/prescriptionController.js";

const prescriptionRouter = express.Router();

prescriptionRouter.post("/", authorizeRoles("doctor"), createPrescription);
prescriptionRouter.get(
  "/",
  authorizeRoles("doctor", "patient"),
  getPrescriptions
);
prescriptionRouter.put("/:id", authorizeRoles("doctor"), updatePrescription);
prescriptionRouter.get(
  "/:id",
  authorizeRoles("doctor", "patient"),
  getPrescriptionById
);

export default prescriptionRouter;
