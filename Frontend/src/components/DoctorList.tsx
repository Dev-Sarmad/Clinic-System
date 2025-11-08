"use client"

import { useState, useEffect } from "react"
import axios from "axios"

interface Doctor {
  id: string
  userId: string
  name: string
  email: string
  specialization: string
  qualification?: string
  experience: number
  timings: {
    start: string
    end: string
  }
  availableDays: string[]
  isAvailable?: boolean
}

interface DoctorsListProps {
  onSelectDoctor: (doctorId: string) => void
}

export default function DoctorList({ onSelectDoctor }: DoctorsListProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all")

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get("http://localhost:8000/api/doctors/")
        if (response.data.success) {
          setDoctors(response.data.data)
        } else {
          setError("Failed to fetch doctors")
        }
      } catch (err) {
        console.error("[v0] Error fetching doctors:", err)
        setError("Error fetching doctors. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const specializations = ["all", ...new Set(doctors.map((d) => d.specialization))]
  const filteredDoctors =
    selectedSpecialty === "all" ? doctors : doctors.filter((d) => d.specialization === selectedSpecialty)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">Loading doctors...</p>
          <p className="text-sm text-muted-foreground mt-2">Please wait while we fetch available doctors</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800 font-medium">❌ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🔍</span>
          Filter by Specialization
        </h2>
        <div className="flex flex-wrap gap-3">
          {specializations.map((specialization) => (
            <button
              key={specialization}
              onClick={() => setSelectedSpecialty(specialization)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSpecialty === specialization
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {specialization.charAt(0).toUpperCase() + specialization.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl">👨‍⚕️</div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{doctor.name}</h3>
                  <p className="text-sm text-accent font-medium">{doctor.specialization}</p>
                  {doctor.qualification && <p className="text-xs text-muted-foreground">{doctor.qualification}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground font-medium">{doctor.experience} years exp.</p>
                <p
                  className={`text-sm font-semibold mt-1 ${doctor.isAvailable !== false ? "text-green-600" : "text-red-600"}`}
                >
                  {doctor.isAvailable !== false ? "🟢 Available" : "🔴 Unavailable"}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <span>📧</span>
                <span className="text-foreground text-xs">{doctor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>🕐</span>
                <span className="text-muted-foreground">
                  {doctor.timings.start} - {doctor.timings.end}
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span>📅</span>
                <span className="text-muted-foreground">{doctor.availableDays.join(", ")}</span>
              </div>
            </div>

           <button
  onClick={() => {
    console.log("Selected doctor:", doctor.id);
    onSelectDoctor(doctor.id);
  }}
  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
>
  Book Appointment
</button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No doctors found for the selected specialization</p>
        </div>
      )}
    </div>
  )
}
