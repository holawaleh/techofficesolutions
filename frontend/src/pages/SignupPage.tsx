import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    company_name: "",
    address: "",
    phone_number: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    // Navigate to preferences page with collected info
    navigate("/choose-preferences", { state: formData });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Your Account
        </h1>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleNext} className="space-y-4">
          {["username", "email", "company_name", "address", "phone_number"].map(
            (field) => (
              <input
                key={field}
                type={field === "email" ? "email" : "text"}
                name={field}
                placeholder={field.replace("_", " ").toUpperCase()}
                value={(formData as any)[field]}
                onChange={handleChange}
                className="w-full p-3 rounded bg-slate-700 border border-slate-600 focus:border-emerald-500 focus:outline-none"
                required
              />
            )
          )}

          {/* Password + Confirm Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-slate-700 border border-slate-600 focus:border-emerald-500 focus:outline-none mb-3"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-emerald-400"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            <input
              type="password"
              name="confirm_password"
              placeholder="CONFIRM PASSWORD"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-slate-700 border border-slate-600 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded text-lg font-semibold transition"
          >
            Next →
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
