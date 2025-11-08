interface Prescription {
  id: string
  doctorName: string
  date: string
  medications: string[]
  notes: string
}

interface PrescriptionsViewProps {
  prescriptions: Prescription[]
}

export default function PrescriptionsView({ prescriptions }: PrescriptionsViewProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span>💊</span>
          Your Prescriptions
        </h2>
        <p className="text-muted-foreground">View all prescriptions from your doctors</p>
      </div>

      <div className="space-y-4">
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === prescription.id ? null : prescription.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-muted transition-colors"
              >
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-foreground">{prescription.doctorName}</h3>
                  <p className="text-sm text-muted-foreground mt-1">📅 {prescription.date}</p>
                  <p className="text-sm text-accent font-medium mt-2">{prescription.medications.length} medications</p>
                </div>
                <span className={`text-2xl transition-transform ${expandedId === prescription.id ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {expandedId === prescription.id && (
                <div className="border-t border-border p-6 bg-muted/30 space-y-4">
                  <div>
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <span>💊</span>
                      Medications
                    </h4>
                    <ul className="space-y-2">
                      {prescription.medications.map((med, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-foreground">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          {med}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <span>📝</span>
                      Doctor's Notes
                    </h4>
                    <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg">{prescription.notes}</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
                      🖨️ Print
                    </button>
                    <button className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors">
                      📥 Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-2xl mb-2">💊</p>
            <p className="text-foreground font-medium">No prescriptions yet</p>
            <p className="text-muted-foreground mt-1">Your prescriptions will appear here after consultation</p>
          </div>
        )}
      </div>
    </div>
  )
}

import React from "react"
