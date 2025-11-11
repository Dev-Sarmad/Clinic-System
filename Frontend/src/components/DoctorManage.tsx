import { useState } from "react";
import apiClient from "../services/apiClient";
import { useForm, Controller } from "react-hook-form";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  email: string;
  phone?: string;
  password: string;
  role?: string;
  availableDays?: string[];
  isAvailable?: boolean;
  timings?: { start: string; end: string };
}

export default function DoctorsManage({
  doctors: initialDoctors = [],
  loading = false,
}: {
  doctors: Doctor[];
  loading: boolean;
}) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      specialization: "",
      qualification: "",
      experience:0,
      email: "",
      phone: "",
      password: "",
      role: "doctor",
      availableDays: [] as string[],
      isAvailable: true,
      timings: { start: "", end: "" },
    },
  });

  /** ✅ Handle Add/Edit Submit */
  const onSubmit = async (formData: any) => {
    setSubmitting(true);
    const payload = {
    ...formData,
    experience: Number(formData.experience), 
  };
    try {
      if (editingDoctor) {
        const response = await apiClient.put(
          `/doctors/${editingDoctor.id}`,
          payload
        );
        setDoctors((prev) =>
          prev.map((doc) =>
            doc.id === editingDoctor.id ? response.data : doc
          )
        );
      } else {
        const response = await apiClient.post("/doctors", payload);
        setDoctors((prev) => [...prev, response.data.doctor]);
      }

      setShowForm(false);
      setEditingDoctor(null);
      reset();
    } catch (error: any) {
      console.error("[DoctorsManage] Error saving doctor:", error.message);
      alert("Error saving doctor. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await apiClient.delete(`/doctors/${id}`);
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error: any) {
      console.error("[DoctorsManage] Error deleting doctor:", error.message);
      alert("Error deleting doctor. Check console for details.");
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    reset({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      qualification: doctor.qualification || "",
      experience: doctor.experience,
      email: doctor.email || "",
      phone: doctor.phone || "",
      password: "",
      role: doctor.role || "doctor",
      availableDays: doctor.availableDays || [],
      isAvailable: doctor.isAvailable ?? true,
      timings: doctor.timings || { start: "", end: "" },
    });
    setShowForm(true);
  };

  const openAddForm = () => {
    setShowForm(true);
    setEditingDoctor(null);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Doctors List</h2>
        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          + Add Doctor
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-bold text-foreground mb-4">
              {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Name"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                )}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name.message}</span>
              )}

              {/* Email */}
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder="Email"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                )}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email.message}</span>
              )}

              {/* Password */}
              <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                )}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}

              {/* Specialization */}
              <Controller
                name="specialization"
                control={control}
                rules={{ required: "Specialization is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Specialization"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                )}
              />

              {/* Qualification */}
              <Controller
                name="qualification"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Qualification"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                )}
              />

              {/* Experience */}
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Experience (years)"
                    type="number"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                )}
              />

              {/* Role (fixed doctor) */}
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                  >
                    <option value="doctor">Doctor</option>
                  </select>
                )}
              />

              {/* Availability toggle */}
              <Controller
                name="isAvailable"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    <span>Available</span>
                  </label>
                )}
              />

              {/* Available Days */}
              <div>
                <label className="block font-medium mb-2 text-foreground">
                  Available Days:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <Controller
                      key={day}
                      name="availableDays"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            value={day}
                            checked={field.value.includes(day)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const newDays = checked
                                ? [...field.value, day]
                                : field.value.filter((d: string) => d !== day);
                              field.onChange(newDays);
                            }}
                          />
                          <span>{day}</span>
                        </label>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Timings */}
              <div>
                <label className="block font-medium mb-2 text-foreground">
                  Timings:
                </label>
                <div className="flex gap-2">
                  <Controller
                    name="timings.start"
                    control={control}
                    rules={{ required: "Start time required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="time"
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                      />
                    )}
                  />
                  <Controller
                    name="timings.end"
                    control={control}
                    rules={{ required: "End time required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="time"
                        className="flex-1 px-3 py-2 border border-border rounded-lg bg-input text-foreground"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium disabled:opacity-70"
                >
                  {submitting
                    ? "Saving..."
                    : editingDoctor
                    ? "Update"
                    : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingDoctor(null);
                  }}
                  className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctors Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading doctors...</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Available Days
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Timings
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="hover:bg-muted transition-colors"
                  >
                    <td className="px-6 py-4">{doctor.name}</td>
                    <td className="px-6 py-4">{doctor.specialization}</td>
                    <td className="px-6 py-4">
                      {doctor.isAvailable ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4">
                      {doctor.availableDays?.join(", ") || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {doctor.timings
                        ? `${doctor.timings.start} - ${doctor.timings.end}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4">{doctor.email}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded hover:bg-blue-500/20 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="px-3 py-1 bg-red-500/10 text-red-600 rounded hover:bg-red-500/20 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {doctors.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No doctors found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
