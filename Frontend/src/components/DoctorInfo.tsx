import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: string;
}

export default function DoctorInfo() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        if (!user?._id) return;
        const res = await axios.get(
          `http://localhost:8000/api/doctors/${user._id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const data = res.data;
        if (data.success) {
          setDoctor(data.data);
        } else {
          console.error("Failed to fetch doctor info:", data.message);
        }
      } catch (error) {
        console.error("Error fetching doctor info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorInfo();
  }, [user]);

  if (loading)
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-muted-foreground">Loading doctor information...</p>
      </div>
    );

  if (!doctor)
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-muted-foreground">No doctor information found.</p>
      </div>
    );

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
            👨‍⚕️
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Dr. {doctor.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {doctor.specialization}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">
            {doctor.experience}+
          </p>
          <p className="text-xs text-muted-foreground mt-1">Years Experience</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mt-1">Patients Helped</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground mt-1">
            Patient Satisfaction
          </p>
        </div>
      </div>
    </div>
  );
}
