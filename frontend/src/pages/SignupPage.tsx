import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    company_name: "",
    address: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    // Navigate to preferences page and carry data forward
    navigate("/choose-preferences", { state: formData });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create Your Account
        </h1>

        {error && (
          <p className="text-red-400 text-center mb-4 bg-red-900/30 border border-red-500/30 rounded-lg py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "username", label: "Username" },
            { name: "email", label: "Email" },
            { name: "company_name", label: "Company Name" },
            { name: "address", label: "Address" },
            { name: "phone_number", label: "Phone Number" },
          ].map(({ name, label }) => (
            <input
              key={name}
              name={name}
              type="text"
              placeholder={label}
              value={(formData as any)[name]}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-slate-700 border border-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          ))}

          {/* Password and confirm password with toggle visibility */}
          <PasswordField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <PasswordField
            label="Confirm Password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded text-lg font-semibold transition disabled:opacity-50"
          >
            Next →
          </button>
        </form>

        <p className="text-center text-slate-400 mt-4">
          Already have an account?{" "}
          <span
            className="text-emerald-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

/* --- Password Field Component --- */
function PasswordField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        name={name}
        placeholder={label}
        value={value}
        onChange={onChange}
        required
        className="w-full p-3 rounded bg-slate-700 border border-slate-600 focus:border-emerald-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-3 text-slate-400 hover:text-emerald-400 text-sm"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
