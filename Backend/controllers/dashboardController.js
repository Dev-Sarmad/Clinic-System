import mongoose from "mongoose";
import Appointment from "../models/appointmentModel.js";
import Prescription from "../models/prescriptionModel.js";
import User from "../models/userModel.js";

export const getDashboard = async (req, res) => {
  try {
    const { role, _id } = req.user; // Extract role and ID of the logged-in user

    let dashboardData = {};

    if (role === "doctor") {
      // Doctor's dashboard logic (already explained earlier)

      const appointments = await Appointment.aggregate([
        { $match: { doctorId: new mongoose.Types.ObjectId(_id) } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            appointments: { $push: "$$ROOT" }
          }
        }
      ]);

      const completedAppointments = appointments.find(a => a._id === "completed")?.appointments || [];
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));
      const todaysAppointments = await Appointment.find({
        doctorId: _id,
        date: { $gte: todayStart, $lt: todayEnd }
      });

      const totalAppointmentsByPatient = await Appointment.aggregate([
        { $match: { doctorId: new mongoose.Types.ObjectId(_id) } },
        { $group: { _id: "$patientId", count: { $sum: 1 } } }
      ]);

      const totalAppointments = appointments.reduce((acc, item) => acc + item.count, 0);
      const upcomingAppointments = appointments.find(a => a._id === "scheduled")?.count || 0;
      const cancelledAppointments = appointments.find(a => a._id === "cancelled")?.count || 0;

      const prescriptions = await Prescription.find({ doctorId: _id })
        .populate("doctorId", "name specialization")
        .populate("patientId", "name email")
        .populate("appointmentId", "date timeSlot status");

      dashboardData = {
        totalAppointments,
        upcomingAppointments,
        completedAppointments,
        cancelledAppointments,
        todaysAppointments,
        totalAppointmentsByPatient,
        prescriptions
      };

    } else if (role === "patient") {
      // Patient's dashboard logic
      // 1. Fetch all appointments for the patient
      const appointments = await Appointment.aggregate([
        { $match: { patientId: new mongoose.Types.ObjectId(_id) } },
        {
          $group: {
            _id: "$status", 
            count: { $sum: 1 },
            appointments: { $push: "$$ROOT" }
          }
        }
      ]);

      // 2. Fetch completed appointments (status = "completed")
      const completedAppointments = appointments.find(a => a._id === "completed")?.appointments || [];

      // 3. Fetch upcoming appointments (status = "scheduled")
      const upcomingAppointments = appointments.find(a => a._id === "scheduled")?.appointments || [];

      // 4. Fetch today's appointments (appointments that happen today)
      const today = new Date();
      const todayStart = new Date(today.setHours(0, 0, 0, 0));
      const todayEnd = new Date(today.setHours(23, 59, 59, 999));
      const todaysAppointments = await Appointment.find({
        patientId: _id,
        date: { $gte: todayStart, $lt: todayEnd }
      });

      // 5. Aggregate prescriptions for this patient
      const prescriptions = await Prescription.find({ patientId: _id })
        .populate("doctorId", "name specialization")
        .populate("patientId", "name email")
        .populate("appointmentId", "date timeSlot status");

      // 6. Prepare the summary of appointments
      const totalAppointments = appointments.reduce((acc, item) => acc + item.count, 0);
      const cancelledAppointments = appointments.find(a => a._id === "cancelled")?.count || 0;

      dashboardData = {
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        cancelledAppointments,
        todaysAppointments,
        prescriptions
      };

    } else if (role === "admin") {
      // Admin's dashboard logic (already explained earlier)

      const appointmentsAgg = await Appointment.aggregate([
        {
          $group: {
            _id: "$status", 
            count: { $sum: 1 },
            appointments: { $push: "$$ROOT" }
          }
        }
      ]);

      const totalAppointments = appointmentsAgg.reduce((acc, item) => acc + item.count, 0);
      const upcomingAppointments = appointmentsAgg.find(a => a._id === "scheduled")?.count || 0;
      const completedAppointments = appointmentsAgg.find(a => a._id === "completed")?.count || 0;
      const cancelledAppointments = appointmentsAgg.find(a => a._id === "cancelled")?.count || 0;

      const totalPatients = await User.countDocuments({ role: "patient" });
      const totalDoctors = await User.countDocuments({ role: "doctor" });

      dashboardData = {
        appointments: appointmentsAgg,
        summary: {
          totalAppointments,
          upcomingAppointments,
          completedAppointments,
          cancelledAppointments,
          totalPatients,
          totalDoctors
        }
      };
    } else {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.status(200).json({
      success: true,
      role,
      data: dashboardData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard",
      error: error.message
    });
  }
};
