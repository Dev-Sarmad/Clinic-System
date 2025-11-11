export interface Appointment {
  _id: string;
  doctorId: string;
  patientId: string;
  roomId: string;
  date: string; 
  timeSlot: {
    start: string;
    end: string;  
  };
  status: "scheduled" | "completed" | "cancelled";
  __v?: number;
}


export interface SummaryStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  totalPrescriptions?: number;
}

export interface AdminStatsProps {
  stats: SummaryStats | null;
  loading: boolean;
}
// Grouped appointments by status
export interface AppointmentGroup {
  _id: "scheduled" | "completed" | "cancelled";
  count: number;
  appointments: Appointment[];
}

// Summary statistics for cards
export interface SummaryStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalPatients: number;
  totalDoctors: number;
  totalPrescriptions?: number;
}

// Data returned by the API
export interface AdminStatsData {
  appointments: AppointmentGroup[];
  summary: SummaryStats;
}

// Full API response
export interface AdminStatsResponse {
  success: boolean;
  role: "admin" | string;
  data: AdminStatsData;
}