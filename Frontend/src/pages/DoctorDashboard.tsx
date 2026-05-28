import DoctorInfo from "../components/DoctorInfo";
import DoctorHeader from "../components/DoctorHeader";
import AppointmentsList from "../components/AppointmentList";
import { useAuth } from "../context/AuthContext";
import useAppointments from "../hooks/useAppointment";
import type { Appointment as AppointmentData } from "../hooks/useAppointment";

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const { appointments, setAppointments } = useAppointments(
    user?._id,
    user?.role,
  );

  const handleUpdateStatus = (
    appointmentId: string,
    status: AppointmentData["status"],
  ) => {
    setAppointments(
      appointments.map((appointment) =>
        appointment._id === appointmentId
          ? { ...appointment, status }
          : appointment,
      ),
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-primary-foreground shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground text-primary rounded-lg flex items-center justify-center font-bold text-lg">
              ⚕️
            </div>
            <div>
              <h1 className="text-xl font-bold">MediCare</h1>
              <p className="text-sm opacity-80">Doctor Portal</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-foreground/10 font-medium transition-colors hover:bg-primary-foreground/20"
          >
            <span className="text-lg">📊</span>
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors hover:bg-primary-foreground/20"
          >
            <span className="text-lg">👥</span>
            Patients
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors hover:bg-primary-foreground/20"
          >
            <span className="text-lg">📋</span>
            Records
          </a>
          <button
            className="flex cursor-pointer items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors hover:bg-primary-foreground/20"
            onClick={logout}
          >
            <span className="text-lg">⚙️</span>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <DoctorHeader />

        <main className="p-8">
          {/* Top Section: Doctor Info and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <DoctorInfo />
            </div>
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <p className="text-muted-foreground text-sm">
                  Total Appointments
                </p>
                <p className="text-3xl font-bold text-primary mt-2">24</p>
                <p className="text-xs text-muted-foreground mt-2">This week</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <p className="text-muted-foreground text-sm">Completed Today</p>
                <p className="text-3xl font-bold text-accent mt-2">8</p>
                <p className="text-xs text-muted-foreground mt-2">
                  of 12 scheduled
                </p>
              </div>
            </div>
          </div>

          {/* Appointments Section */}
          <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Today's Appointments
              </h2>
            </div>
            <AppointmentsList
              appointments={appointments}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
