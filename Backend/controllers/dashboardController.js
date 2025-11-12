import mongoose from "mongoose";
import Appointment from "../models/appointmentModel.js";
import Prescription from "../models/prescriptionModel.js";
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";

export const getDashboard = async (req, res) => {
  try {
    const { role, _id } = req.user;
    let dashboardData = {};

    if (role === "doctor") {
  // 1. INPUT VALIDATION and PRE-CASTING
  // Check if the ID is valid before proceeding
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    // If the ID is invalid, you should ideally return an error response here.
    // For now, we'll log an error and set data to default.
    console.error("Invalid Doctor ID provided:", _id);
    dashboardData = {}; 
    return; // Exit the block/function
  }

  // Cast the ID to a Mongoose ObjectId once for consistent use in all queries
  const doctorObjectId = new mongoose.Types.ObjectId(_id);

  // --- 2. APPOINTMENT STATISTICS (AGGREGATION) ---
  const appointmentsAgg = await Appointment.aggregate([
    // Use the pre-cast ObjectId in the $match stage
    { $match: { doctorId: doctorObjectId } }, 
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        appointments: { $push: "$$ROOT" },
      },
    },
  ]);

  const totalAppointments = appointmentsAgg.reduce(
    (acc, item) => acc + item.count,
    0
  );
  
  // Use nullish coalescing and optional chaining for safer access
  const upcomingAppointments =
    appointmentsAgg.find((a) => a._id === "scheduled")?.count || 0;
  const cancelledAppointments =
    appointmentsAgg.find((a) => a._id === "cancelled")?.count || 0;
  const completedAppointments =
    appointmentsAgg.find((a) => a._id === "completed")?.appointments || [];

  // --- 3. TODAY'S APPOINTMENTS (REGULAR FIND) ---
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0, 0, 0, 0
  );
  const todayEnd = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23, 59, 59, 999
  );

  const todaysAppointments = await Appointment.find({
    // Use the pre-cast ObjectId
    doctorId: doctorObjectId,
    date: { $gte: todayStart, $lt: todayEnd },
  })
    .populate("patientId", "name email")
    .populate("doctorId", "specialization");

  // --- 4. TOTAL APPOINTMENTS BY PATIENT (AGGREGATION) ---
  const totalAppointmentsByPatient = await Appointment.aggregate([
    // Use the pre-cast ObjectId
    { $match: { doctorId: doctorObjectId } },
    { $group: { _id: "$patientId", count: { $sum: 1 } } },
  ]);

  // --- 5. PRESCRIPTIONS (REGULAR FIND) ---
  const prescriptions = await Prescription.find({
    // Use the pre-cast ObjectId
    doctorId: doctorObjectId,
  })
    .populate("doctorId", "name specialization")
    .populate("patientId", "name email")
    .populate("appointmentId", "date timeSlot status");

  // --- 6. FINAL DASHBOARD DATA ASSEMBLY ---
  dashboardData = {
    totalAppointments,
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    todaysAppointments,
    totalAppointmentsByPatient,
    prescriptions,
  };
}
    else if (role === "patient") {
      const appointmentsAgg = await Appointment.aggregate([
        { $match: { patientId: new mongoose.Types.ObjectId(_id) } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            appointments: { $push: "$$ROOT" },
          },
        },
      ]);

      const totalAppointments = appointmentsAgg.reduce(
        (acc, item) => acc + item.count,
        0
      );
      const completedAppointments =
        appointmentsAgg.find((a) => a._id === "completed")?.appointments || [];
      const upcomingAppointments =
        appointmentsAgg.find((a) => a._id === "scheduled")?.appointments || [];
      const cancelledAppointments =
        appointmentsAgg.find((a) => a._id === "cancelled")?.count || 0;

      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));

      const todaysAppointments = await Appointment.find({
        patientId: _id,
        date: { $gte: todayStart, $lt: todayEnd },
      })
        .populate("doctorId", "specialization")
        .populate("patientId", "name email");

      const prescriptions = await Prescription.find({ patientId: _id })
        .populate("doctorId", "name specialization")
        .populate("patientId", "name email")
        .populate("appointmentId", "date timeSlot status");

      dashboardData = {
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        cancelledAppointments,
        todaysAppointments,
        prescriptions,
      };
    }

    else if (role === "admin") {
      const appointmentsAgg = await Appointment.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const totalAppointments = appointmentsAgg.reduce(
        (acc, item) => acc + item.count,
        0
      );
      const upcomingAppointments =
        appointmentsAgg.find((a) => a._id === "scheduled")?.count || 0;
      const completedAppointments =
        appointmentsAgg.find((a) => a._id === "completed")?.count || 0;
      const cancelledAppointments =
        appointmentsAgg.find((a) => a._id === "cancelled")?.count || 0;

      const totalPatients = await User.countDocuments({ role: "patient" });
      const totalDoctors = await User.countDocuments({ role: "doctor" });

      // 🔹 Get all doctors with details
      const doctors = await Doctor.find()
        .populate("userId", "name email phone gender")
        .select(
          "specialization qualification experience isAvailable timings availableDays"
        );

      // 🔹 Get all patients (Users with role patient)
      const patients = await User.find({ role: "patient" }).select(
        "name email phone gender createdAt"
      );

      const appointments = await Appointment.find()
        .populate({
          path: "doctorId",
          populate: {
            path: "userId",
            model: "User",
            select: "name email phone",
          },
        })
        .populate("patientId", "name email phone gender")
        .sort({ date: -1 });

      const prescriptions = await Prescription.find()
        .populate({
          path: "appointmentId",
          populate: [
            {
              path: "doctorId",
              populate: { path: "userId", select: "name email" },
            },
            { path: "patientId", select: "name email phone" },
          ],
        })
        .populate({
          path: "doctorId",
          populate: { path: "userId", select: "name email" },
        })
        .populate("patientId", "name email")
        .sort({ createdAt: -1 });

      dashboardData = {
        summary: {
          totalAppointments,
          upcomingAppointments,
          completedAppointments,
          cancelledAppointments,
          totalPatients,
          totalDoctors,
          totalPrescriptions: prescriptions.length,
        },
        details: {
          appointments: appointments.map((a) => ({
            id: a._id,
            date: a.date,
            timeSlot: a.timeSlot,
            status: a.status,
            doctor: a.doctorId?.userId?.name || "Unknown Doctor",
            patient: a.patientId?.name || "Unknown Patient",
          })),
          prescriptions: prescriptions.map((p) => ({
            id: p._id,
            diagnosis: p.diagnosis,
            notes: p.notes,
            medicines: p.medicines,
            doctor: p.doctorId?.userId?.name || "Unknown Doctor",
            patient: p.patientId?.name || "Unknown Patient",
            appointmentDate: p.appointmentId?.date || null,
            createdAt: p.createdAt,
          })),
          doctors: doctors.map((d) => ({
            id: d._id,
            name: d.userId?.name,
            email: d.userId?.email,
            phone: d.userId?.phone,
            specialization: d.specialization,
            qualification: d.qualification,
            experience: d.experience,
            availableDays: d.availableDays,
            timings: d.timings,
            isAvailable: d.isAvailable,
          })),
          patients: patients.map((p) => ({
            id: p._id,
            name: p.name,
            email: p.email,
            phone: p.phone,
            gender: p.gender,
            createdAt: p.createdAt,
          })),
        },
      };
    } else {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.status(200).json({
      success: true,
      role,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard",
      error: error.message,
    });
  }
};
