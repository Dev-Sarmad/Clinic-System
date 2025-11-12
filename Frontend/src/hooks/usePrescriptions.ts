import { useState } from "react";
import apiClient from "../services/apiClient";


export interface Medicine {
  name: string;
  dosage: string;
  duration: string;
}

export interface Prescription {
  _id: string;
  appointmentId: string;
  doctorId: {
    _id: string;
    userId:{
        name:string,email:string
    }
    specialization: string;
  };
  patientId: {
    _id: string;
    name: string;
    email: string;
  };
  diagnosis: string;
  notes: string;
  medicines: Medicine[];
  createdAt?: string;
}



export function useSubmitPrescription() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submitPrescription = async (prescription: Prescription) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(
        "/doctor/prescription",
        prescription
      );
      return response.data;
    } catch (err) {
      setError("Failed to submit the prescription. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const getPrescriptions = async (): Promise<Prescription[]> => {
    try {
      setLoading(true);
      const response = await apiClient.get("/doctor/prescription");
      return response.data.prescriptions;
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError("Failed to fetch prescriptions. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  };
  const getPrescriptionById = async (id: string): Promise<Prescription | null> => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/doctor/prescription/${id}`);
      return response.data.prescription;
    } catch (err) {
      console.error("Error fetching prescription:", err);
      setError("Failed to fetch prescription details.");
      return null;
    } finally {
      setLoading(false);
    }
  };
  

  return { submitPrescription, loading, error, getPrescriptions, getPrescriptionById };
}
export default useSubmitPrescription;
