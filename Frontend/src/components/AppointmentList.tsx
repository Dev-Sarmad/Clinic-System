import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import  useSubmitPrescription  from "../hooks/usePrescriptions";

const prescriptionSchema = yup.object({
  diagnosis: yup.string().required("Diagnosis is required"),
  notes: yup.string().optional(),
  medicines: yup.array().of(
    yup.object({
      name: yup.string().required("Medicine name is required"),
      dosage: yup.string().required("Dosage is required"),
      duration: yup.string().required("Duration is required"),
    })
  ),
}).required();

interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    name: string;
    email: string;
  };
  timeSlot: {
    start: string;
    end: string;
  };
  date: string;
}

interface AppointmentsListProps {
  appointments: Appointment[];
  prescriptions: Record<string, string[]>;
  onUpdateStatus: (appointmentId: string, status: string) => void;
}

export default function AppointmentsList({ appointments, prescriptions, onUpdateStatus }: AppointmentsListProps) {
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { user } = useAuth();

  // React Hook Form setup
  const { control, handleSubmit, reset, formState: { errors }, watch } = useForm({
    resolver: yupResolver(prescriptionSchema),
    defaultValues: {
      diagnosis: "",
      notes: "",
      medicines: [{ name: "", dosage: "", duration: "" }],
    }
  });

  const { submitPrescription, loading, error } = useSubmitPrescription();

  const handlePrescribeClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
    reset(); // Reset form values when modal is opened
  };

  const handleCloseModal = () => {
    setShowPrescriptionModal(false);
    reset();
  };

  const onSubmitPrescription = async (data: any) => {
  if (selectedAppointment) {
    const prescriptionData = {
      appointmentId: selectedAppointment._id,
      doctorId: user?._id,
      patientId: selectedAppointment.patientId._id,
      diagnosis: data.diagnosis,
      notes: data.notes,
      medicines: data.medicines,
    };

    await submitPrescription(prescriptionData);
    onUpdateStatus?.(selectedAppointment._id, "completed"); // safe optional call
    handleCloseModal();
  }
};


  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-block px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "completed":
        return <span className={`${baseClasses} bg-green-100 text-green-700`}>✓ Completed</span>;
      case "check-in":
        return <span className={`${baseClasses} bg-blue-100 text-blue-700`}>⏱ In Progress</span>;
      case "scheduled":
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>⏳ Scheduled</span>;
      case "cancelled":
        return <span className={`${baseClasses} bg-red-100 text-red-700`}>❌ Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="divide-y divide-border">
        {appointments.map((appointment) => (
          <div key={appointment._id} className="p-6 hover:bg-muted/30 transition-colors flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-lg flex-shrink-0">👤</div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-foreground">{appointment.patientId.name}</h4>
                  <span className="text-xs text-muted-foreground">Email: {appointment.patientId.email}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Time: <span className="text-foreground font-medium">{appointment.timeSlot.start} - {appointment.timeSlot.end}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">📅 Date: {new Date(appointment.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div>{getStatusBadge(appointment.status)}</div>
              {prescriptions[appointment._id] && prescriptions[appointment._id].length > 0 && (
                <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                  💊 {prescriptions[appointment._id].length} meds
                </div>
              )}
              <button
                onClick={() => handlePrescribeClick(appointment)}
                disabled={appointment.status !== "scheduled"}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>💊</span> Prescribe
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="font-semibold text-xl mb-4">Prescribe for {selectedAppointment.patientId.name}</h3>

            <form onSubmit={handleSubmit(onSubmitPrescription)} className="space-y-4">
              {/* Diagnosis */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Diagnosis</label>
                <Controller
                  name="diagnosis"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full p-2 border rounded"
                      placeholder="Enter diagnosis"
                    />
                  )}
                />
                {errors.diagnosis && <p className="text-sm text-red-500">{errors.diagnosis.message}</p>}
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Notes</label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full p-2 border rounded"
                      placeholder="Additional notes"
                    />
                  )}
                />
              </div>

              {/* Medicines */}
              <div className="mb-4">
                <label className="block text-sm font-medium">Medicines</label>
                <div>
                  {watch("medicines").map((_, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Controller
                        name={`medicines[${index}].name`}
                        control={control}
                        render={({ field }) => (
                          <input
                            type="text"
                            className="p-2 border rounded w-1/3"
                            placeholder="Medicine name"
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        name={`medicines[${index}].dosage`}
                        control={control}
                        render={({ field }) => (
                          <input
                            type="text"
                            className="p-2 border rounded w-1/3"
                            placeholder="Dosage"
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        name={`medicines[${index}].duration`}
                        control={control}
                        render={({ field }) => (
                          <input
                            type="text"
                            className="p-2 border rounded w-1/3"
                            placeholder="Duration"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary text-white rounded-md"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Prescription"}
              </button>

              {/* Error Message */}
              {error && <p className="text-red-500 text-center">{error}</p>}
            </form>

            {/* Close Modal Button */}
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-xl">❌</button>
          </div>
        </div>
      )}
    </>
  );
}
