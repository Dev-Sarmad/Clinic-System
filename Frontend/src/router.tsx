import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashBoard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const Router = () => {
  const { user, initialized } = useAuth();

  if (!initialized)
    return <div className="text-center mt-20 text-gray-700">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user && user.role ? (
              <Navigate to={`/${user.role}-dashboard`} replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/signup"
          element={
            user && user.role ? (
              <Navigate to={`/${user.role}-dashboard`} replace />
            ) : (
              <Signup />
            )
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
