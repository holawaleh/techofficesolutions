// src/pages/LandingPage.tsx
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400">Techoffice Cloud</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium rounded hover:bg-slate-800"
          >
            Log in
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center flex-1 px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
          Track, Monitor, and Grow — All in One Cloud.
        </h2>
        <p className="max-w-2xl text-slate-400 text-lg mb-8">
          Techoffice Cloud gives your business a real-time dashboard to manage
          assets, monitor performance, and stay on top of operations from
          anywhere.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-slate-900 font-semibold rounded-lg"
        >
          Create Your Free Account
        </button>

        {/* Mock dashboard preview */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl">
          <div className="bg-slate-800 rounded-xl p-6 text-left">
            <h3 className="text-blue-400 font-semibold mb-2">Active Assets</h3>
            <p className="text-3xl font-bold">124</p>
            <p className="text-slate-400 text-sm mt-2">
              Devices reporting data
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 text-left">
            <h3 className="text-green-400 font-semibold mb-2">Uptime</h3>
            <p className="text-3xl font-bold">99.98%</p>
            <p className="text-slate-400 text-sm mt-2">
              Across all monitored systems
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 text-left">
            <h3 className="text-rose-400 font-semibold mb-2">Alerts</h3>
            <p className="text-3xl font-bold">5</p>
            <p className="text-slate-400 text-sm mt-2">
              Pending actions from checks
            </p>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-slate-900 py-20 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold text-blue-400 mb-2">
              Live Monitoring
            </h3>
            <p className="text-slate-400">
              Keep tabs on your assets in real time with automatic updates and
              smart alerts.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Team Collaboration
            </h3>
            <p className="text-slate-400">
              Invite teammates, assign roles, and share insights securely inside
              your organization.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-rose-400 mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-slate-400">
              Turn your data into clear charts and metrics to guide smarter
              business decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-500 border-t border-slate-800">
        © {new Date().getFullYear()} Techoffice Cloud — All rights reserved.
      </footer>
    </div>
  );
}
