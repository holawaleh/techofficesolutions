import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api";

const INDUSTRIES = [
  { key: "hospitality", label: "Hospitality" },
  { key: "commerce", label: "Commerce" },
  { key: "pharmacy", label: "Pharmacy / Health" },
  { key: "agriculture", label: "Agriculture" },
  { key: "tourism", label: "Tourism" },
  { key: "technical_services", label: "Technical Services" },
];

export default function ChoosePreferencesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state; // from SignupPage

  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSelection = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((i) => i !== key) : [...prev, key]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setError("Please select at least one industry.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const payload = { ...userData, preference: selected };
      await api.post("/api/users/signup/", payload);
      alert("Signup complete! You can now log in.");
      navigate("/login");
    } catch (err: any) {
      console.error("Signup error:", err);

      const responseData = err.response?.data;
      let message = "Signup failed. Try again.";

      if (typeof responseData === "string") {
        message = responseData;
      } else if (Array.isArray(responseData?.preference)) {
        message = responseData.preference[0];
      } else if (responseData?.detail) {
        message = responseData.detail;
      } else if (responseData?.non_field_errors) {
        message = responseData.non_field_errors[0];
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8 text-emerald-400">
        Choose Your Business Preferences
      </h1>

      {error && (
        <p className="text-red-400 mb-4 text-center bg-red-900/30 px-4 py-2 rounded-lg border border-red-500/40">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
        {INDUSTRIES.map(({ key, label }) => (
          <div
            key={key}
            onClick={() => toggleSelection(key)}
            className={`p-6 border rounded-xl cursor-pointer transition-all duration-200 ${
              selected.includes(key)
                ? "bg-emerald-600 border-emerald-400 scale-105 shadow-lg"
                : "bg-slate-800 border-slate-700 hover:border-emerald-500 hover:scale-105"
            }`}
          >
            <h3 className="text-lg font-semibold text-center">{label}</h3>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-10 bg-emerald-600 hover:bg-emerald-700 px-10 py-3 rounded-lg text-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating Account...</span>
          </>
        ) : (
          "Finish Signup"
        )}
      </button>
    </div>
  );
}
