"use client"

type PatientView = "dashboard" | "doctors" | "prescriptions" | "book-appointment"

interface PatientSidebarProps {
  currentView: PatientView
  onViewChange: (view: PatientView) => void
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "doctors", label: "Find Doctors", icon: "👨‍⚕️" },
  { id: "prescriptions", label: "Prescriptions", icon: "💊" },
  { id: "book-appointment", label: "Book Appointment", icon: "📅" },
]

export default function PatientSidebar({ currentView, onViewChange }: PatientSidebarProps) {
  return (
    <div className="w-64 bg-primary text-primary-foreground shadow-lg flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-foreground text-primary rounded-lg flex items-center justify-center font-bold text-lg">
            ⚕️
          </div>
          <div>
            <h1 className="text-xl font-bold">MediCare</h1>
            <p className="text-sm opacity-80">Patient Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-8 space-y-2 px-4 pb-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as PatientView)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left ${
              currentView === item.id ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-primary-foreground/20">
        <p className="text-xs opacity-75">© 2025 MediCare</p>
        <p className="text-xs opacity-75">Version 1.0.0</p>
      </div>
    </div>
  )
}
