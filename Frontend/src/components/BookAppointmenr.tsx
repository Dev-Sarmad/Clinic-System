import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  availability: string;
  phone: string;
  _id?: string;
}

interface Room {
  _id: string;
  roomNumber: string;
  name: string;
  capacity: number;
}

interface BookAppointmentProps {
  doctorId: string;
  doctors: Doctor[];
  onBook: (
    doctorId: string,
    appointmentDate: string,
    appointmentTime: string
  ) => void;
  onCancel: () => void;
}

export default function BookAppointment({
  doctorId,
  onBook,
  onCancel,
}: BookAppointmentProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<string>(doctorId || "");
  const { token } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/rooms/");
        const roomsData = Array.isArray(response.data)
          ? response.data
          : response.data.rooms || [];
        setRooms(roomsData);
        if (roomsData.length > 0) {
          setSelectedRoom(roomsData[0]._id);
        }
      } catch (err) {
        console.log("[v0] Error fetching rooms:", err);
        setRooms([]);
        setError("Failed to load available rooms");
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/doctors")
      .then((res) => {
        console.log("Doctors API Response:", res.data);
        if (res.data.success && Array.isArray(res.data.data)) {
          setDoctors(res.data.data);
        } else if (Array.isArray(res.data)) {
          // fallback if API returns raw array
          setDoctors(res.data);
        } else {
          setDoctors([]); // ensure it's always an array
        }
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        setDoctors([]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedDoctor ||
      !appointmentDate ||
      !appointmentTime ||
      !selectedRoom
    ) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Prepare time slots (e.g., convert time to match backend expectations)
    const timeSlotStart = appointmentTime;
    const [hours, minutes] = appointmentTime.split(":");
    const endHours = Number.parseInt(hours) + 1; // Assuming 1-hour duration
    const timeSlotEnd = `${String(endHours).padStart(2, "0")}:${minutes}`;

    const appointmentData = {
      doctorId: selectedDoctor,
      roomId: selectedRoom,
      date: appointmentDate,
      timeSlot: {
        start: timeSlotStart,
        end: timeSlotEnd,
      },
      status: "scheduled",
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/appointments/",
        appointmentData,{
          withCredentials:true
        }
        
      );

      console.log("Appointment Response: ", response);

      if (response.status === 201 || response.status === 200) {
        setSuccess("Appointment booked successfully!");
        setTimeout(() => {
          onBook(selectedDoctor, appointmentDate, appointmentTime); // Pass doctor ID instead of name
        }, 1500);
      } else {
        setError("Failed to book appointment, please try again.");
      }
    } catch (err) {
      console.log("[v0] Error booking appointment:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to book appointment. Please try again."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const doctor = doctors.find(
    (d) => d._id === selectedDoctor || d.id === selectedDoctor
  );
  console.log(doctor);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-6 shadow-md">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <span>📅</span>
          Book an Appointment
        </h2>
        <p className="mt-2 opacity-90">
          Select a doctor and choose your preferred date and time
        </p>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg">
          ✕ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <label className="block font-bold text-foreground mb-4">
            Select Doctor
          </label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-full"
          >
            <option>Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id || doc.id} value={doc._id || doc.id}>
                {doc.name} - {doc.specialization}
              </option>
            ))}
          </select>
        </div>

        {doctor && (
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {doctor.name}
                </h3>
                <p className="text-accent font-medium">
                  {doctor.specialization}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <label className="block font-bold text-foreground mb-4">
            Select Room
          </label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">-- Choose a Room --</option>
            {Array.isArray(rooms) && rooms.length > 0 ? (
              rooms.map((room) => (
                <option key={room._id} value={room._id}>
                  {room.name || room.roomNumber} (Capacity: {room.capacity})
                </option>
              ))
            ) : (
              <option disabled>Loading rooms...</option>
            )}
          </select>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <label className="block font-bold text-foreground mb-4">
            Preferred Date
          </label>
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <label className="block font-bold text-foreground mb-4">
            Preferred Time
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setAppointmentTime(time)}
                className={`px-4 py-3 rounded-lg font-medium transition-colors border ${
                  appointmentTime === time
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-foreground hover:border-primary"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <label className="block font-bold text-foreground mb-4">
            Reason for Visit (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe your symptoms or reason for the visit..."
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={4}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={
              !selectedDoctor ||
              !appointmentDate ||
              !appointmentTime ||
              !selectedRoom ||
              loading
            }
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Booking..." : "✓ Confirm Booking"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-muted text-foreground rounded-lg font-bold hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            ✕ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
