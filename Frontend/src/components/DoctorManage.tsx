import { useState } from "react";
import axios from "axios";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  email: string;
  phone?: string;
}

export default function DoctorsManage({
  doctors: initialDoctors = [],
  loading = false,
}: {
  doctors: Doctor[];
  loading: boolean;
}) {
  // use local state to allow editing list without refetch
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    qualification: "",
    experience: "",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);

  /** ✅ Handle Add/Edit Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingDoctor) {
        // 🔹 Update doctor
        const response = await axios.put(
          `http://localhost:8000/api/doctors/${editingDoctor.id}`,
          formData
        );

        // update in local list
        setDoctors((prev) =>
          prev.map((doc) =>
            doc.id === editingDoctor.id ? response.data : doc
          )
        );
      } else {
        // 🔹 Add new doctor
        const response = await axios.post(
          "http://localhost:8000/api/doctors",
          formData
        );

        // append to local list
        setDoctors((prev) => [...prev, response.data]);
      }

      // reset form
      setShowForm(false);
      setEditingDoctor(null);
      setFormData({
        name: "",
        specialization: "",
        qualification: "",
        experience: "",
        email: "",
        phone: "",
      });
    } catch (error: any) {
      console.error("[DoctorsManage] Error saving doctor:", error.message);
      alert("Error saving doctor. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  /** ✅ Handle Delete Doctor */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/doctors/${id}`);

      // remove doctor locally
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error: any) {
      console.error("[DoctorsManage] Error deleting doctor:", error.message);
      alert("Error deleting doctor. Check console for details.");
    }
  };

  /** ✅ Handle Edit Click */
  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name || "",
      specialization: doctor.specialization || "",
      qualification: doctor.qualification || "",
      experience: doctor.experience?.toString() || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
    });
    setShowForm(true);
  };

  /** ✅ Handle Open Add Form */
  const openAddForm = () => {
    setShowForm(true);
    setEditingDoctor(null);
    setFormData({
      name: "",
      specialization: "",
      qualification: "",
      experience: "",
      email: "",
      phone: "",
    });
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
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-foreground mb-4">
              {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "specialization", "qualification", "experience", "email", "phone"].map(
                (field) => (
                  <input
                    key={field}
                    type={
                      field === "email"
                        ? "email"
                        : field === "experience"
                        ? "number"
                        : "text"
                    }
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={(formData as any)[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                )
              )}

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
                    Experience
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
                  <tr key={doctor.id} className="hover:bg-muted transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">
                      {doctor.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {doctor.specialization}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {doctor.experience} years
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {doctor.email}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="px-3 py-1 bg-blue-500/10 text-blue-600 rounded hover:bg-blue-500/20 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="px-3 py-1 bg-red-500/10 text-red-600 rounded hover:bg-red-500/20 transition-colors text-sm font-medium"
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
