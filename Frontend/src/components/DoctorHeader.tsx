import { useAuth } from "../context/AuthContext"

export default function DoctorHeader() {
  const {user} = useAuth()
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back, Dr. {user?.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center text-lg">
            🔔
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
            DS
          </div>
        </div>
      </div>
    </header>
  )
}
