// src/hooks/useSignup.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: "admin" | "doctor" | "patient";
}

export const useSignup = () => {
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignup = async (data: SignupData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post("/auth/register", data, {
        withCredentials: true, 
      });

      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", token);

      signup(user, token);

      if (user.role === "admin") navigate("/admin-dashboard");
      else if (user.role === "doctor") navigate("/doctor-dashboard");
      else if (user.role === "patient") navigate("/patient-dashboard");
      else navigate("/login"); // fallback
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return { handleSignup, loading, error };
};
