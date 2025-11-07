import mongoose from "mongoose";

const doctorSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  specialization: {
    type: String,
    required: [true, "Specialization is required"],
    trim: true,
  },
  qualification: {
    type: String,
    trim: true,
  },
  isAvailable: {
    type: Boolean
  },
  role: {
    type: String,
    enum: ["doctor"],
    required: true,
  },
  availableDays: {
    type: [String],
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    default: [],
  },
  experience: Number,
  timings: {
    start: {
      type: String,
      required: [true, "Start time is required"],
    },
    end: {
      type: String,
      required: [true, "End time is required"],
    },
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
