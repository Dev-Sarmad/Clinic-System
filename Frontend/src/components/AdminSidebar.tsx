import { useAuth } from "../context/AuthContext"
export default function AdminSidebar({ activeTab, setActiveTab }) {
    const {user, logout}  =  useAuth()
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "doctors", label: "Doctors", icon: "👨‍⚕️" },
    { id: "patients", label: "Patients", icon: "👥" },
    { id: "appointments", label: "Appointments", icon: "📆" },
    { id: "prescriptions", label: "Prescriptions", icon: "📝" },
  ]

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="text-2xl font-bold">🏥 MediCare</div>
        <div className="text-xs text-sidebar-foreground/70 mt-1">Admin Portal</div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground" onClick={logout}>
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
