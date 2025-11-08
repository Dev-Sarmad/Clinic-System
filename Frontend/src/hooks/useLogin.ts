import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/apiClient";

type LoginData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.post("auth/login", data, {
        withCredentials: true
      });

      const { user, token } = res.data;

      if (!user || !token) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", token);

      login(user, token);

      if (user.role === "admin") navigate("/admin-dashboard");
      else if (user.role === "doctor") navigate("/doctor-dashboard");
      else if (user.role === "patient") navigate("/patient-dashboard");
      else navigate("/login"); // fallback
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};
