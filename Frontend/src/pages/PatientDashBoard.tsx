import { useState, useEffect } from "react";
import axios from "axios";
import PatientHeader from "../components/PatientHeader";
import PatientSidebar from "../components/PatientSidebar";
import DoctorsList from "../components/DoctorList";
import PrescriptionsView from "../components/PrescriptionView";
import BookAppointment from "../components/BookAppointmenr";
import { useAuth } from "../context/AuthContext";
import useAppointments from "../hooks/useAppointment";
import useSubmitPrescription from "../hooks/usePrescriptions";
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
  diagnosis: string
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

export default function PatientDashboard() {
  const [currentView, setCurrentView] = useState<PatientView>("dashboard");
  const { user } = useAuth();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const {getPrescriptions, error: ErrorPrescription, message, loading:prescriptionLoading} = useSubmitPrescription()

  const { appointments, setAppointments, loading: appointmentLoading, error: ErrorAppointment } = useAppointments(
    user?._id,
    user?.role
  );
useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await getPrescriptions();
        setPrescriptions(data);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
      }
    };
    fetchPrescriptions();
  }, []);
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
            <p>{ErrorPrescription.message || ErrorAppointment.message}</p>

            <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8 shadow-md">
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.name}
              </h1>
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
                      key={apt._id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div className="p-4 bg-muted rounded-lg mb-4">
                        {apt.doctorId?.userId?.role === "doctor" ? (
                          // If logged-in user is doctor, show patient info
                          <>
                            <p className="font-semibold text-foreground">
                              Doctor:{" "}
                              {apt.doctorId?.userId.name ??
                                "Patient data unavailable"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Email: {apt.doctorId?.userId.email ?? "-"}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-foreground">
                              Doctor:{" "}
                              {apt.doctorId?.userId?.name ??
                                "Doctor data unavailable"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Specialization:{" "}
                              {apt.doctorId?.specialization ?? "-"}
                            </p>
                          </>
                        )}

                        <p className="text-sm text-muted-foreground">
                          Date:{" "}
                          {apt.date
                            ? new Date(apt.date).toLocaleDateString()
                            : "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Time: {apt.timeSlot?.start ?? "-"} -{" "}
                          {apt.timeSlot?.end ?? "-"}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === "scheduled"
                            ? "bg-green-100 text-green-800"
                            : apt.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : apt.status === "checked-in"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
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
