import mongoose from "mongoose";

const roomSchema =  mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  isOccupied: { type: Boolean, default: false },
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
});

export default mongoose.model("Room", roomSchema);
