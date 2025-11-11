import { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminStats from "../components/AdminStats";
import apiClient from "../services/apiClient";
import PatientAppointments from "../components/PatientAppointments";
import PrescriptionsManagement from "../components/PrescriptionsManagement";
import PatientsManage from "../components/PatientManage";
import DoctorsManage from "../components/DoctorManage";
import type { SummaryStats } from "../Types/Types";

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  availableDays?: string[];
  timings?: {
    start: string;
    end: string;
  };
  isAvailable?: boolean;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: number;
  gender?: string;
}

export interface Appointment {
  id: string;
  date: string;
  timeSlot: { start: string; end: string };
  status: string;
  doctor: string;
  patient: string;
}

export interface Prescription {
  id: string;
  diagnosis: string;
  notes: string;
  medicines: { name: string; dosage: string; duration: string }[];
  doctor: string;
  patient: string;
  appointmentDate?: string;
  createdAt: string;
}
export interface AdminStatsResponse {
  success: boolean;
  role: string;
  data: {
    summary: SummaryStats;
    details: {
      appointments: Appointment[];
      prescriptions: Prescription[];
      doctors: Doctor[];
      patients: Patient[];
    };
  };
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await apiClient.get<AdminStatsResponse>("dashboard");
      const data = response.data.data;
      setSummary(data.summary);
      setAppointments(data.details.appointments);
      setDoctors(data.details.doctors);
      setPatients(data.details.patients);
      setPrescriptions(data.details.prescriptions);
    } catch (error: any) {
      console.error(
        "[DashboardStats] Error fetching statistics:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "doctors" && "Doctors Management"}
              {activeTab === "patients" && "Patients Management"}
              {activeTab === "appointments" && "Patient Appointments"}
              {activeTab === "prescriptions" && "Patient Prescriptions"}
            </h1>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                🔔
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                ⚙️
              </button>
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                A
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <AdminStats stats={summary} loading={loading} />
          )}
          {activeTab === "doctors" && (
            <DoctorsManage doctors={doctors} loading={loading} />
          )}
          {activeTab === "patients" && (
            <PatientsManage patients={patients} loading={loading} />
          )}
          {activeTab === "appointments" && (
            <PatientAppointments
              appointments={appointments}
              loading={loading}
            />
          )}
          {activeTab === "prescriptions" && (
            <PrescriptionsManagement
              prescriptions={prescriptions}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
