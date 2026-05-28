import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import useSubmitPrescription from "../hooks/usePrescriptions";
import type { NewPrescription } from "../hooks/usePrescriptions";

const prescriptionSchema = yup
  .object({
    diagnosis: yup.string().required("Diagnosis is required"),
    notes: yup.string().required("Notes are required"),
    medicines: yup
      .array()
      .of(
        yup.object({
          name: yup.string().required("Medicine name is required"),
          dosage: yup.string().required("Dosage is required"),
          duration: yup.string().required("Duration is required"),
        }),
      )
      .required("At least one medicine is required"),
  })
  .required();

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
}

interface PrescriptionFormValues {
  diagnosis: string;
  notes: string;
  medicines: Medicine[];
}

interface Appointment {
  _id: string;
  patientId:
    | {
        _id: string;
        name: string;
        email: string;
      }
    | string;
  timeSlot: {
    start: string;
    end: string;
  };
  date: string;
  status: "scheduled" | "completed" | "cancelled" | "checked-in";
}

interface AppointmentsListProps {
  appointments: Appointment[];
  onUpdateStatus: (
    appointmentId: string,
    status: Appointment["status"],
  ) => void;
}

export default function AppointmentsList({
  appointments,
  onUpdateStatus,
}: AppointmentsListProps) {
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<PrescriptionFormValues>({
    resolver: yupResolver(prescriptionSchema),
    defaultValues: {
      diagnosis: "",
      notes: "",
      medicines: [{ name: "", dosage: "", duration: "" }],
    },
  });

  const medicines = watch("medicines") as Medicine[];
  const { submitPrescription, loading, error, message } =
    useSubmitPrescription();

  const handlePrescribeClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionModal(true);
    reset();
  };

  const handleCloseModal = () => {
    setShowPrescriptionModal(false);
    reset();
  };

  const onSubmitPrescription: SubmitHandler<PrescriptionFormValues> = async (
    data,
  ) => {
    if (!selectedAppointment) return;

    const prescriptionData: NewPrescription = {
      appointmentId: selectedAppointment._id,
      doctorId: user?._id || "",
      patientId:
        typeof selectedAppointment.patientId === "string"
          ? selectedAppointment.patientId
          : selectedAppointment.patientId._id,
      diagnosis: data.diagnosis,
      notes: data.notes,
      medicines: data.medicines,
    };

    const response = await submitPrescription(prescriptionData);

    // ✅ Only close modal on success
    if (response?.success) {
      onUpdateStatus?.(selectedAppointment._id, "completed");
      handleCloseModal();
    }
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    const base = "inline-block px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "completed":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            ✓ Completed
          </span>
        );
      case "checked-in":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>
            ⏱ In Progress
          </span>
        );
      case "scheduled":
        return (
          <span className={`${base} bg-yellow-100 text-yellow-700`}>
            ⏳ Scheduled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* ✅ Success Message */}
      {message && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-3 mb-4 rounded-md text-center">
          ✅ {message}
        </div>
      )}

      {/* Appointment List */}
      <div className="divide-y divide-border">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="p-6 hover:bg-muted/30 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-lg">
                👤
              </div>
              <div className="flex-1">
                {(() => {
                  const patient =
                    typeof appointment.patientId === "string"
                      ? null
                      : appointment.patientId;
                  return (
                    <>
                      <h4 className="font-semibold">
                        {patient?.name ?? "Unknown patient"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {patient?.email ?? "-"}
                      </p>
                    </>
                  );
                })()}
                <p className="text-xs text-muted-foreground mt-1">
                  📅 {new Date(appointment.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {getStatusBadge(appointment.status)}
              <button
                onClick={() => handlePrescribeClick(appointment)}
                disabled={appointment.status !== "scheduled"}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                💊 Prescribe
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
            <h3 className="font-semibold text-xl mb-4">
              Prescribe for{" "}
              {typeof selectedAppointment.patientId === "string"
                ? "Unknown Patient"
                : selectedAppointment.patientId.name}
            </h3>

            <form
              onSubmit={handleSubmit(onSubmitPrescription)}
              className="space-y-4"
            >
              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium">Diagnosis</label>
                <Controller
                  name="diagnosis"
                  control={control}
                  render={({ field }) => (
                    <input {...field} className="w-full p-2 border rounded" />
                  )}
                />
                {errors.diagnosis && (
                  <p className="text-sm text-red-500">
                    {errors.diagnosis.message}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium">Notes</label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full p-2 border rounded"
                    />
                  )}
                />
              </div>

              {/* Medicines */}
              <div>
                <label className="block text-sm font-medium">Medicines</label>
                {medicines.map((_, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Controller
                      name={`medicines.${i}.name` as const}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="p-2 border rounded w-1/3"
                          placeholder="Name"
                        />
                      )}
                    />
                    <Controller
                      name={`medicines.${i}.dosage` as const}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="p-2 border rounded w-1/3"
                          placeholder="Dosage"
                        />
                      )}
                    />
                    <Controller
                      name={`medicines.${i}.duration` as const}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          className="p-2 border rounded w-1/3"
                          placeholder="Duration"
                        />
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Error message inside modal */}
              {error && (
                <p className="text-center text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
                  ❌ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-primary text-white rounded-md"
              >
                {loading ? "Submitting..." : "Submit Prescription"}
              </button>
            </form>

            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-lg hover:text-red-500"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </>
  );
}
