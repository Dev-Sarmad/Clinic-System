import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import Room from "../models/roomModel.js";

export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, roomId } = req.body;
    const patientId = req.user?._id;

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Only patients can book appointments",
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointmentDate = new Date(date);
    const dayName = appointmentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!doctor.availableDays.includes(dayName)) {
      return res.status(400).json({
        success: false,
        message: `Doctor is not available on ${dayName}`,
      });
    }

    const conflict = await Appointment.findOne({
      doctorId,
      date: appointmentDate,
      "timeSlot.start": timeSlot.start,
      "timeSlot.end": timeSlot.end,
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "Doctor already has an appointment in this time slot",
      });
    }

    let assignedRoom = null;
    if (roomId) {
      const room = await Room.findById(roomId);
      if (!room) {
        return res
          .status(404)
          .json({ success: false, message: "Room not found" });
      }
      if (room.isOccupied) {
        return res.status(400).json({
          success: false,
          message: "Room is currently occupied",
        });
      }
      assignedRoom = room._id;
    }

    const appointment = await Appointment.create({
      doctorId,
      patientId,
      roomId: assignedRoom,
      date: appointmentDate,
      timeSlot,
      status: "scheduled",
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while booking appointment",
      error: error.message,
    });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { role, _id } = req.user;

    let filter = {};
    if (role === "patient") filter.patientId = _id;
    else if (role === "doctor") filter.doctorId = _id;

    const appointments = await Appointment.find(filter)
      .populate("doctorId", "specialization qualification")
      .populate("patientId", "name email")
      .populate("roomId", "roomNumber");

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("doctorId", "specialization qualification timings ")
      .populate("patientId", "name email")
      .populate("roomId", "roomNumber");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching appointment details",
      error: error.message,
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(status)
    const validStatuses = ["scheduled", "checked-in", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { $set: { status} },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    if (appointment.roomId) {
      const Room = await import("../models/roomModel.js");
      const room = await Room.default.findById(appointment.roomId);

      if (room) {
        if (status === "checked-in") room.isOccupied = true;
        else if (status === "completed" || status === "cancelled")
          room.isOccupied = false;
        await room.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Appointment status updated",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating appointment status",
      error: error.message,
    });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, role } = req.user;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      role === "patient" &&
      appointment.patientId.toString() !== _id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only cancel your own appointments",
      });
    }

    await Appointment.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting appointment",
      error: error.message,
    });
  }
};
