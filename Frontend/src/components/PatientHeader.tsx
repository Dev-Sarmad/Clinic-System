import { useAuth } from "../context/AuthContext"

interface PatientHeaderProps {
  onLogout: () => void
}

export default function PatientHeader({ onLogout }: PatientHeaderProps) {
    const {user} =  useAuth()
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your health and appointments</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted">
            <span className="text-xl">👤</span>
            <div>
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Patient ID: {user._id}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
