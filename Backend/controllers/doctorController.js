import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import { adminDoctorCreationSchema } from "../validation/validation.js";

const createDoctor = async (req, res) => {
  try {
    const validationResult = await adminDoctorCreationSchema.safeParseAsync(
      req.body
    );
    if (validationResult.error) {
      return res.status(400).json({ error: validationResult.error.format() });
    }
    const {
      name,
      email,
      password,
      specialization,
      role,
      isAvailable,
      experience,
      timings,
      qualification,
      availableDays,
    } = validationResult.data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User with this email already exists" });
    }
    const user = await User.create({
      name,
      email,
      password,
      role: "doctor",
    });
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      isAvailable,
      role,
      experience,
      timings,
      qualification,
      availableDays,
    });
    return res.status(201).json({
      message: "Doctor created",
      doctor: {
        id: doctor._id,
        userId: doctor.userId,
        name: user.name,
        email: user.email,
        isAvailable: doctor.isAvailable,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        experience: doctor.experience,
        timings: doctor.timings,
        availableDays: doctor.availableDays,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getDoctors = async (req, res) => {
  const doctors = await Doctor.find().populate(
    "userId",
    "name email gender phone"
  );
  if (!doctors) {
    return res.status(404).json({ message: "No doctors found" });
  }
  return res.status(200).json({
    success: true,
    message: "Doctors fetched successfully",
    count: doctors.length,
    data: doctors.map((doc) => ({
      id: doc._id,
      userId: doc.userId._id,
      name: doc.userId?.name,
      email: doc.userId?.email,
      gender: doc.userId?.gender,
      phone: doc.userId?.phone,
      specialization: doc.specialization,
      isAvailable: doc.isAvailable,
      qualification: doc.qualification,
      experience: doc.experience,
      timings: doc.timings,
      availableDays: doc.availableDays,
    })),
  });
};
const deleteDoctor = async (req, res) => {
  const doctorId = req.params.id;
  if (!doctorId) {
    return res.status(400).json({ message: "Please provide valid Id" });
  }
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found " });
  }
  await doctor.deleteOne({ _id: doctorId });
  const userId = doctor.userId;
  if (userId) {
    await User.deleteOne({ _id: userId });
  }

  return res.status(200).json({ message: "Doctor deleted successfully" });
};
const updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(400).json({ message: "No doctor found" });
    const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, req.body, {
      new: true,
      runValidators: true,
    }).populate(
      "name userId email gender phone specialization isAvailable timings availableDays"
    );

    if (!updatedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Error updating doctor:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating doctor",
      error: error.message,
    });
  }
};
export { createDoctor, getDoctors, deleteDoctor, updateDoctor };
