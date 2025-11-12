import Prescription from "../models/prescriptionModel.js";
import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";

export const createPrescription = async (req, res) => {
  try {
    const userId = req.user._id;
    const { appointmentId, diagnosis, notes, medicines } = req.body;

    if (req.user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Only doctors can create prescriptions",
      });
    }

    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found for this user",
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only prescribe for your own appointments",
      });
    }
    const existing = await Prescription.findOne({
      doctorId: doctor._id,
      patientId: appointment.patientId,
      appointmentId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Prescription already exists for this appointment.",
      });
    }
    const prescription = await Prescription.create({
      appointmentId,
      doctorId: doctor._id,
      patientId: appointment.patientId,
      diagnosis,
      notes,
      medicines,
    });

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating prescription",
      error: error.message,
    });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { id } = req.params;
    const { diagnosis, notes, medicines } = req.body;

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription not found" });
    }

    if (prescription.doctorId.toString() !== doctorId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update prescriptions you created",
      });
    }

    prescription.diagnosis = diagnosis ?? prescription.diagnosis;
    prescription.notes = notes ?? prescription.notes;
    prescription.medicines = medicines ?? prescription.medicines;

    await prescription.save();

    return res.status(200).json({
      success: true,
      message: "Prescription updated successfully",
      prescription,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating prescription",
      error: error.message,
    });
  }
};

export const getPrescriptions = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let filter = {};

    if (role === "patient") {
      filter.patientId = _id;
    } else if (role === "doctor") {
      filter.doctorId = _id;
    } else {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const prescriptions = await Prescription.find(filter)
      .populate("appointmentId", "date timeSlot status")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email specialization " },
      })
      .populate("patientId", "name email");

    return res.status(200).json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching prescriptions",
      error: error.message,
    });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, role } = req.user;

    const prescription = await Prescription.findById(id)
      .populate("appointmentId", "date timeSlot status")
      .populate("patientId", "name email")
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "name email specialization" }, // nested populate
      });

    if (!prescription) {
      return res
        .status(404)
        .json({ success: false, message: "Prescription not found" });
    }

    if (
      role === "patient" &&
      prescription.patientId._id.toString() !== _id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (
      role === "doctor" &&
      prescription.doctorId._id.toString() !== _id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.status(200).json({ success: true, prescription });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching prescription",
      error: error.message,
    });
  }
};
