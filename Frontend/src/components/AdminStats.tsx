
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

export default function AdminStats({ stats, loading }: AdminStatsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-3xl mb-4">⏳</div>
          <p className="text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Doctors", value: stats?.totalDoctors ?? 0, icon: "👨‍⚕️", color: "from-blue-500 to-blue-600" },
    { label: "Total Patients", value: stats?.totalPatients ?? 0, icon: "👥", color: "from-green-500 to-green-600" },
    { label: "Total Appointments", value: stats?.totalAppointments ?? 0, icon: "📅", color: "from-purple-500 to-purple-600" },
    { label: "Upcoming", value: stats?.upcomingAppointments ?? 0, icon: "⏰", color: "from-yellow-500 to-yellow-600" },
    { label: "Completed", value: stats?.completedAppointments ?? 0, icon: "✅", color: "from-teal-500 to-teal-600" },
    { label: "Cancelled", value: stats?.cancelledAppointments ?? 0, icon: "❌", color: "from-red-500 to-red-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className={`h-1 bg-gradient-to-r ${card.color}`}></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">{card.label}</h3>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{card.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
