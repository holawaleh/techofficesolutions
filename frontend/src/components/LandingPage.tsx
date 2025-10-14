// src/components/LandingPage.tsx
import { useNavigate } from "react-router-dom";
import { Building2, HeartPulse, Plane, Leaf, Wrench, ShoppingBag } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white font-inter">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-emerald-400">Enterprise Hub</h1>
        <div className="space-x-6">
          <button
            onClick={() => navigate("/login")}
            className="text-slate-300 hover:text-emerald-400 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-lg text-white font-semibold shadow-md transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center py-24 px-6">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6">
          Enterprise Solutions for <span className="text-emerald-400">Every Industry</span>
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
          Manage sales, inventory, services, and reports seamlessly — tailored for hospitality, commerce, tourism,
          health, agriculture, and technical services.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="mt-10 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition-transform hover:scale-105"
        >
          Start Free Trial
        </button>
      </section>

      {/* INDUSTRIES GRID */}
      <section className="py-20 bg-slate-900/50 text-center">
        <h3 className="text-3xl font-semibold mb-12 text-emerald-400">Industries We Empower</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto px-8">
          <IndustryCard icon={<Building2 />} name="Hospitality" />
          <IndustryCard icon={<ShoppingBag />} name="Commerce" />
          <IndustryCard icon={<Plane />} name="Tourism" />
          <IndustryCard icon={<HeartPulse />} name="Health" />
          <IndustryCard icon={<Leaf />} name="Agriculture" />
          <IndustryCard icon={<Wrench />} name="Technical Services" />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-6 text-center text-slate-500 text-sm">
        <p>© 2025 Enterprise Hub. All rights reserved.</p>
        <p className="mt-1">
          Built with ❤️ by <span className="text-emerald-400">techaffairs</span>
        </p>
      </footer>
    </div>
  );
}

function IndustryCard({ icon, name }: any) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-emerald-400 hover:shadow-lg transition-transform hover:scale-105">
      <div className="flex justify-center text-emerald-400 mb-3 text-3xl">{icon}</div>
      <h5 className="font-semibold text-lg">{name}</h5>
    </div>
  );
}
