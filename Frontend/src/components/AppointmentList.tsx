

interface Appointment {
  id: string
  patientName: string
  patientAge: number
  condition: string
  appointmentTime: string
  status: "scheduled" | "check-in" | "completed"
}

interface AppointmentsListProps {
  appointments: Appointment[]
  onPrescribe: (appointmentId: string) => void
  prescriptions: Record<string, string[]>
}

export default function AppointmentsList({ appointments, onPrescribe, prescriptions }: AppointmentsListProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "completed":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400`}>
            ✓ Completed
          </span>
        )
      case "in-progress":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400`}>
            ⏱ In Progress
          </span>
        )
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400`}>
            ⏳ Pending
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="divide-y divide-border">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="p-6 hover:bg-muted/30 transition-colors flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-lg flex-shrink-0">
              👤
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-foreground">{appointment.patientName}</h4>
                <span className="text-xs text-muted-foreground">Age: {appointment.patientAge}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Condition: <span className="text-foreground font-medium">{appointment.condition}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">🕐 {appointment.appointmentTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>{getStatusBadge(appointment.status)}</div>

            {prescriptions[appointment.id] && (
              <div className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                💊 {prescriptions[appointment.id].length} meds
              </div>
            )}

            <button
              onClick={() => onPrescribe(appointment.id)}
              disabled={appointment.status === "scheduled"}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary flex items-center gap-2"
            >
              <span>💊</span>
              Prescribe
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
