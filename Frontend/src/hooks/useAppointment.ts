import { useState, useEffect } from "react";
import apiClient from "../services/apiClient";

interface Appointment {
  _id: string;
  doctorId: DoctorInfo;
  patientId: PatientInfo | string; // Sometimes backend returns just the id
  roomId?: RoomInfo | null;
  date: string;
  timeSlot: TimeSlot;
  status: "scheduled" | "checked-in" | "completed" | "cancelled";
}

interface DoctorInfo {
  _id: string;
  specialization: string;
  qualification?: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role:string
  };
}

interface PatientInfo {
  _id: string;
  name: string;
  email: string;
  role:string
}

interface RoomInfo {
  _id: string;
  roomNumber: string;
}

interface TimeSlot {
  start: string;
  end: string;
}


const useAppointments = (
  _id: string | undefined,
  role: "patient" | "doctor" | "admin" | undefined
) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(String);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/appointments`, {
          params: { _id, role },
        });

        if (response.data.success) {
          setAppointments(response.data.appointments);
        } else {
          setError("Failed to fetch appointments");
        }
      } catch (err) {
        setError("Error fetching appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [_id, role]);

  return { appointments, setAppointments, loading, error };
};

export default useAppointments;
