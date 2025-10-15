import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, orgRes] = await Promise.all([
          api.get("/api/users/me/"),
          api.get("/api/organizations/profile/"),
        ]);
        setProfile({
          ...userRes.data,
          organization: orgRes.data.name,
          preference: orgRes.data.preference || [],
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await api.post("/api/users/change-password/", formData);
      setMessage(res.data.message);
      setFormData({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to change password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Account Settings</h1>

        {profile && (
          <div className="bg-slate-700 p-4 rounded mb-6 space-y-2">
            <p>
              <span className="text-slate-400">Username:</span> {profile.username}
            </p>
            <p>
              <span className="text-slate-400">Email:</span> {profile.email}
            </p>
            <p>
              <span className="text-slate-400">Organization:</span>{" "}
              {profile.organization}
            </p>
            {profile.preference.length > 0 && (
              <div>
                <p className="text-slate-400 mb-1">Preferences:</p>
                <div className="flex flex-wrap gap-2">
                  {profile.preference.map((p: string) => (
                    <span
                      key={p}
                      className="bg-emerald-600/20 border border-emerald-500 text-emerald-400 text-xs px-2 py-1 rounded-full"
                    >
                      {p.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {message && <p className="text-green-400 text-center mb-4">{message}</p>}
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {["old_password", "new_password", "confirm_password"].map((field) => (
            <input
              key={field}
              type="password"
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
            className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded text-lg font-semibold transition"
          >
            Change Password
          </button>
        </form>

        <hr className="my-6 border-slate-700" />

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded text-lg font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
