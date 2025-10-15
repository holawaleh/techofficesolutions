import { useNavigate } from "react-router-dom";
import {
  Building2,
  ShoppingBag,
  Plane,
  HeartPulse,
  Leaf,
  Wrench,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white font-inter">
      {/* HERO SECTION */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          Enterprise Solutions for{" "}
          <span className="text-emerald-400">Every Industry</span>
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg">
          Comprehensive monitoring and management platform tailored for
          hospitality, commerce, tourism, health, agriculture, and technical
          services.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="mt-10 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition-transform hover:scale-105"
        >
          Sign Up Here
        </button>
      </section>

      {/* INDUSTRIES SECTION */}
      <section className="py-20 px-8 text-center">
        <h3 className="text-3xl font-semibold mb-12 text-emerald-400">
          Industries We Empower
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
          <IndustryCard
            icon={<Building2 />}
            name="Hospitality"
            desc="Streamline bookings, reservations, and guest experiences."
          />
          <IndustryCard
            icon={<ShoppingBag />}
            name="Commerce"
            desc="Manage inventory, sales, and customer transactions efficiently."
          />
          <IndustryCard
            icon={<Plane />}
            name="Tourism"
            desc="Simplify tour scheduling, client management, and bookings."
          />
          <IndustryCard
            icon={<HeartPulse />}
            name="Health"
            desc="Organize patient records, prescriptions, and clinical reports."
          />
          <IndustryCard
            icon={<Leaf />}
            name="Agriculture"
            desc="Track yields, resources, and production cycles with ease."
          />
          <IndustryCard
            icon={<Wrench />}
            name="Technical Services"
            desc="Manage repairs, maintenance, and field service operations."
          />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-500 py-16 text-center text-white">
        <h3 className="text-3xl font-bold mb-4">
          Ready to Transform Your Business?
        </h3>
        <p className="text-lg mb-8">
          Join thousands of businesses already using Enterprise Hub.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition"
        >
          Sign Up Here
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-6 text-center text-slate-400 text-sm">
        <p>© 2025 Enterprise Hub. All rights reserved.</p>
        <p className="mt-1">
          Made by <span className="text-emerald-400">techaffairs</span>
        </p>
      </footer>
    </div>
  );
}

function IndustryCard({ icon, name, desc }: any) {
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-emerald-400 hover:shadow-lg transition hover:scale-105">
      <div className="flex justify-center text-emerald-400 mb-3">{icon}</div>
      <h5 className="font-semibold text-lg mb-2">{name}</h5>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  );
}
