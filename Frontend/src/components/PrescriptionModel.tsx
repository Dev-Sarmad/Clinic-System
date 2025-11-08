
import { useState } from "react"

interface Appointment {
  id: string
  patientName: string
  patientAge: number
  condition: string
  appointmentTime: string
  status: "scheduled" | "check-in" | "completed" | "canceled"
}

interface PrescriptionModalProps {
  appointment: Appointment
  onClose: () => void
  onSave: (medications: string[]) => void
  existingPrescriptions: string[]
}

export default function PrescriptionModal({
  appointment,
  onClose,
  onSave,
  existingPrescriptions,
}: PrescriptionModalProps) {
  const [medications, setMedications] = useState<string[]>(existingPrescriptions)
  const [currentMedication, setCurrentMedication] = useState("")
  const [notes, setNotes] = useState("")

  const handleAddMedication = () => {
    if (currentMedication.trim()) {
      setMedications([...medications, currentMedication])
      setCurrentMedication("")
    }
  }

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (medications.length > 0) {
      onSave(medications)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Create Prescription</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Patient: <span className="font-semibold text-foreground">{appointment.patientName}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-2xl text-muted-foreground hover:text-foreground transition-colors">
            ✕
          </button>
        </div>

        {/* Patient Info */}
        <div className="p-6 bg-muted/30 border-b border-border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-semibold text-foreground mt-1">{appointment.patientAge} years</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Condition</p>
              <p className="font-semibold text-foreground mt-1">{appointment.condition}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Medications Section */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">💊 Medications</label>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentMedication}
                onChange={(e) => setCurrentMedication(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddMedication()}
                placeholder="e.g., Amoxicillin 500mg - 3 times daily"
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleAddMedication}
                className="px-4 py-2 rounded-lg bg-accent text-accent-foreground font-medium transition-all hover:bg-accent/90"
              >
                Add
              </button>
            </div>

            {medications.length > 0 && (
              <div className="space-y-2">
                {medications.map((med, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border/50"
                  >
                    <span className="text-foreground">{med}</span>
                    <button
                      onClick={() => handleRemoveMedication(index)}
                      className="text-destructive hover:text-destructive/80 transition-colors font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">📝 Clinical Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes or instructions for the patient..."
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          {/* Instructions */}
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
            <p className="text-sm font-semibold text-foreground mb-2">📋 Instructions:</p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Follow dosage instructions carefully</li>
              <li>• Take medications as prescribed</li>
              <li>• Report any adverse reactions immediately</li>
              <li>• Complete the full course even if feeling better</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-border text-foreground font-medium transition-colors hover:bg-muted/50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={medications.length === 0}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  )
}
