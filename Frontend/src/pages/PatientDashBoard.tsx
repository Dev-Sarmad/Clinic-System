import { useState, useEffect } from "react";
import axios from "axios";
import PatientHeader from "../components/PatientHeader";
import PatientSidebar from "../components/PatientSidebar";
import DoctorsList from "../components/DoctorList";
import PrescriptionsView from "../components/PrescriptionView";
import BookAppointment from "../components/BookAppointmenr";

type PatientView =
  | "dashboard"
  | "doctors"
  | "prescriptions"
  | "book-appointment";

interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  medications: string[];
  notes: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  availability: string;
  image: string;
  phone: string;
  _id?: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
}

export default function PatientDashboard() {
  const [currentView, setCurrentView] = useState<PatientView>("dashboard");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      doctorName: "Dr. Sarah Mitchell",
      date: "2024-01-20",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: "2",
      doctorName: "Dr. James Chen",
      date: "2024-01-25",
      time: "2:30 PM",
      status: "pending",
    },
  ]);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: "1",
      doctorName: "Dr. Sarah Mitchell",
      date: "2024-01-15",
      medications: [
        "Aspirin 100mg - Once daily",
        "Lisinopril 10mg - Twice daily",
        "Atorvastatin 20mg - Once at night",
      ],
      notes: "Continue for 30 days. Avoid grapefruit juice.",
    },
    {
      id: "2",
      doctorName: "Dr. Michael Brown",
      date: "2024-01-10",
      medications: [
        "Metformin 500mg - Twice daily with meals",
        "Vitamin D 1000IU - Once daily",
      ],
      notes: "Monitor blood sugar levels. Schedule follow-up in 2 weeks.",
    },
  ]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/doctors/");
        setDoctors(response.data);
      } catch (err) {
        console.log("[v0] Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleSelectDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setCurrentView("book-appointment");
  };

  const handleBookAppointment = (
    doctorId: string,
    doctorName: string,
    appointmentDate: string,
    appointmentTime: string
  ) => {
    const newAppointment = {
      id: String(appointments.length + 1),
      doctorName: doctorName,
      date: appointmentDate,
      time: appointmentTime,
      status: "scheduled",
    };
    setAppointments([...appointments, newAppointment]);
    setCurrentView("dashboard");
    setSelectedDoctorId(null);
  };

  const renderView = () => {
    switch (currentView) {
      case "doctors":
        return (
          <DoctorsList doctors={doctors} onSelectDoctor={handleSelectDoctor} />
        );
      case "prescriptions":
        return <PrescriptionsView prescriptions={prescriptions} />;
      case "book-appointment":
        return (
          <BookAppointment
            doctorId={selectedDoctorId || ""}
            doctors={doctors}
            onBook={handleBookAppointment}
            onCancel={() => {
              setCurrentView("dashboard");
              setSelectedDoctorId(null);
            }}
          />
        );
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8 shadow-md">
              <h1 className="text-4xl font-bold mb-2">Welcome back, John!</h1>
              <p className="text-lg opacity-90">
                Your health is our priority. Manage your appointments and
                prescriptions here.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Upcoming Appointments
                    </p>
                    <p className="text-4xl font-bold text-primary mt-2">
                      {appointments.length}
                    </p>
                  </div>
                  <span className="text-3xl">📅</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Active Prescriptions
                    </p>
                    <p className="text-4xl font-bold text-accent mt-2">
                      {prescriptions.length}
                    </p>
                  </div>
                  <span className="text-3xl">💊</span>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Your Doctors
                    </p>
                    <p className="text-4xl font-bold text-accent mt-2">
                      {doctors.length}+
                    </p>
                  </div>
                  <span className="text-3xl">👨‍⚕️</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg shadow-sm">
              <div className="p-6 border-b border-border">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span>📋</span>
                  Upcoming Appointments
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {apt.doctorName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {apt.date} at {apt.time}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    No upcoming appointments
                  </p>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <PatientSidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 overflow-auto">
        <PatientHeader onLogout={() => console.log("Logging out...")} />
        <main className="p-8">{renderView()}</main>
      </div>
    </div>
  );
}
