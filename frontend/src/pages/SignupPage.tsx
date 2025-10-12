// src/pages/SignupPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    company_name: "",
    address: "",
    phone_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/api/users/signup/", formData);
      alert("Signup successful! You can now log in.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Your Account
        </h1>

        {error && (
          <p className="text-red-400 text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["username", "email", "password", "company_name", "address", "phone_number"].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              name={field}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={(formData as any)[field]}
              onChange={handleChange}
              className="w-full p-3 rounded bg-slate-700 border border-slate-600 focus:border-emerald-500 focus:outline-none"
              required
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded text-lg font-semibold transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-4">
          Already have an account?{" "}
          <span
            className="text-emerald-400 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
