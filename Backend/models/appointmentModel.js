import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: false,
  },
  date: { type: Date, required: true },
  timeSlot: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["scheduled", "checked-in", "completed", "cancelled"],
    default: "scheduled",
  },
});

appointmentSchema.index(
  { patientId: 1, date: 1, "timeSlot.start": 1, "timeSlot.end": 1 },
  { unique: true }
);

appointmentSchema.index(
  { doctorId: 1, date: 1, "timeSlot.start": 1, "timeSlot.end": 1 },
  { unique: true }
);
export default mongoose.model("Appointment", appointmentSchema);
