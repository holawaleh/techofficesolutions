import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ChoosePreferencesPage from "./pages/ChoosePreferencesPage";



export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<LandingPage />} />

      <Route path="/choose-preferences" element={<ChoosePreferencesPage />} />

      {/* Auth pages */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}


