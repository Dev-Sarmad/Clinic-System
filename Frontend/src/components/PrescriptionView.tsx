import React, { useState } from "react";
import usePrescriptions from "../hooks/usePrescriptions";
import type {Prescription} from "../hooks/usePrescriptions"
interface PrescriptionsViewProps {
  prescriptions: Prescription[];
}

export default function PrescriptionsView({ prescriptions }: PrescriptionsViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { getPrescriptionById, loading } = usePrescriptions();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const handleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setSelectedPrescription(null);
    } else {
      setExpandedId(id);
      const data = await getPrescriptionById(id);
      setSelectedPrescription(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <span>💊</span>Your Prescriptions
        </h2>
        <p className="text-muted-foreground">View all prescriptions from your doctors</p>
      </div>

      <div className="space-y-4">
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="bg-card border border-border rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => handleExpand(prescription._id)}
                className="w-full p-6 flex items-center justify-between hover:bg-muted transition-colors"
              >
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-foreground">
                    {prescription.doctorId?.userId.name || "Unknown Doctor"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    📅 {new Date(prescription.createdAt || "").toLocaleDateString()}
                  </p>
                  <p className="text-sm text-accent font-medium mt-2">
                    {prescription.medicines.length} medications
                  </p>
                </div>
                <span
                  className={`text-2xl transition-transform ${
                    expandedId === prescription._id ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {expandedId === prescription._id && (
                <div className="border-t border-border p-6 bg-muted/30 space-y-4">
                  {loading ? (
                    <p>Loading prescription...</p>
                  ) : selectedPrescription ? (
                    <>
                      <div>
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                          <span>👨‍⚕️</span>Doctor Info
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedPrescription.doctorId.userId.name} (
                          {selectedPrescription.doctorId.specialization})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedPrescription.doctorId.userId.email}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                          <span>💊</span>Medications
                        </h4>
                        <ul className="space-y-2">
                          {selectedPrescription.medicines.map((med, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-foreground">
                              <span className="w-2 h-2 bg-primary rounded-full"></span>
                              {med.name} – {med.dosage} – {med.duration}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                          <span>📝</span>Notes
                        </h4>
                        <p className="text-sm text-muted-foreground bg-background p-3 rounded-lg">
                          {selectedPrescription.notes || "No notes provided."}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No details found.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-2xl mb-2">💊</p>
            <p className="text-foreground font-medium">No prescriptions yet</p>
            <p className="text-muted-foreground mt-1">
              Your prescriptions will appear here after consultation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
