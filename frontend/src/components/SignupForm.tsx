import { useState } from "react";
import { UserPlus, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const AREAS_OF_INTEREST = [
  { id: "hospitality", label: "Hospitality", icon: "🏨" },
  { id: "commerce", label: "Commerce", icon: "🛍️" },
  { id: "tourism", label: "Tourism", icon: "✈️" },
  { id: "health", label: "Health", icon: "🏥" },
  { id: "agriculture", label: "Agriculture", icon: "🌾" },
  { id: "others", label: "Others", icon: "📋" },
];

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    company_name: "",
    address: "",
    phone_number: "",
    areas_of_interest: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Toggle interest selection
  const handleAreaToggle = (areaId: string) => {
    setFormData((prev) => ({
      ...prev,
      areas_of_interest: prev.areas_of_interest.includes(areaId)
        ? prev.areas_of_interest.filter((id) => id !== areaId)
        : [...prev.areas_of_interest, areaId],
    }));
  };

  // ✅ Move to step 2
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  // ✅ Submit signup form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.areas_of_interest.length === 0) {
      setError("Please select at least one area of interest");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await signup(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Step 2 — Interests
  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Select Your Interests</h2>
          <p className="text-slate-600 mt-2">Choose the areas relevant to your business</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {AREAS_OF_INTEREST.map((area) => (
              <button
                key={area.id}
                type="button"
                onClick={() => handleAreaToggle(area.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  formData.areas_of_interest.includes(area.id)
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="text-2xl mb-2">{area.icon}</div>
                <div className="font-semibold text-slate-900">{area.label}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-slate-600">Already have an account? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  // ✅ Step 1 — Basic Info + Password Toggle
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
        <p className="text-slate-600 mt-2">Get started with your free account</p>
      </div>

      <form onSubmit={handleNext} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="username"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="+234..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">
            Company Name
          </label>
          <input
            id="company"
            type="text"
            required
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="Your Company Ltd"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
            Address
          </label>
          <input
            id="address"
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            placeholder="City, State"
          />
        </div>

        {/* ✅ Password with Eye Toggle */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all pr-10"
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-emerald-500 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all"
        >
          Next: Select Interests
        </button>
      </form>

      <div className="text-center text-sm">
        <span className="text-slate-600">Already have an account? </span>
        <button
          onClick={onSwitchToLogin}
          className="text-emerald-600 hover:text-emerald-700 font-semibold"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
