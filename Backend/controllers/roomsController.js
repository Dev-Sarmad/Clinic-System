import Room from "../models/roomModel.js";

export const getRooms = async (req, res) => {
  try {
    // Optional query param to filter by doctor (if you want)
    const { doctorId } = req.query;

    // Base query: find rooms that are not occupied
    const query = { isOccupied: false };

    // If a doctorId is provided, filter by that doctor
    if (doctorId) query.assignedDoctor = doctorId;

    // Fetch available rooms
    const availableRooms = await Room.find(query)
      .populate("assignedDoctor", "name specialization") // Populate doctor details if assigned
      .sort({ roomNumber: 1 }); // Sort by room number ascending

    // If no available rooms found
    if (!availableRooms || availableRooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No available rooms found."
      });
    }

    // Return list of available rooms
    return res.status(200).json({
      success: true,
      count: availableRooms.length,
      rooms: availableRooms
    });
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching available rooms",
      error: error.message
    });
  }
};
