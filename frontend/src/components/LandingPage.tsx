import { useNavigate } from "react-router-dom";
import { Shield, Users, Activity, Building2, ShoppingBag, HeartPulse, Leaf, Plane, Wrench } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white font-inter">
      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-emerald-400">FlexBisPro</h1>
        <button
          onClick={() => navigate("/login")}
          className="text-white hover:text-emerald-400 font-semibold transition"
        >
          Sign In
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl md:text-6xl font-bold mb-4">
          FlexBisPro  <span className="text-emerald-400">Solutions for Every Industry</span>
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg">
          Comprehensive monitoring and management platform tailored for hospitality, commerce,
          tourism, health, agriculture, and beyond.
        </p>

        <button
          onClick={() => navigate("/signup")}
          className="mt-10 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition-transform hover:scale-105"
        >
          Get Started Free
        </button>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-800 py-20 px-8">
        <h3 className="text-3xl font-semibold text-center mb-12 text-emerald-400">
          Why Choose FlexBisPro?
        </h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Activity className="w-10 h-10 text-emerald-400" />}
            title="Real-Time Monitoring"
            text="Track your business metrics in real-time with comprehensive dashboards and analytics."
          />
          <FeatureCard
            icon={<Shield className="w-10 h-10 text-emerald-400" />}
            title="Enterprise Security"
            text="Bank-level security with role-based access control and complete data isolation."
          />
          <FeatureCard
            icon={<Users className="w-10 h-10 text-emerald-400" />}
            title="Team Collaboration"
            text="Invite staff with granular permissions and manage your entire team from one place."
          />
        </div>
      </section>

      {/* INDUSTRIES */}
  {/* INDUSTRIES */}
<section className="py-20 px-8 text-center">
  <h3 className="text-3xl font-semibold mb-12 text-emerald-400">Industries We Serve</h3>
  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
    <IndustryCard icon={<Building2 />} name="Hospitality" desc="Hotels, restaurants, and accommodation" />
    <IndustryCard icon={<ShoppingBag />} name="Commerce" desc="Retail, e-commerce, and trade" />
    <IndustryCard icon={<Plane />} name="Tourism" desc="Travel agencies and tour operators" />
    <IndustryCard icon={<HeartPulse />} name="Health" desc="Healthcare facilities and clinics" />
    <IndustryCard icon={<Leaf />} name="Agriculture" desc="Farming and agricultural services" />
    <IndustryCard icon={<Wrench />} name="Technical Services" desc="Engineering, maintenance, and IT support" />
  </div>
</section>


      {/* CTA SECTION */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-500 py-16 text-center text-white">
        <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h3>
        <p className="text-lg mb-8">
          Join thousands of businesses already using FlexBisPro.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition"
        >
          Start here
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-6 text-center text-slate-400 text-sm">
        <p>© 2025 FlexBisPro. All rights reserved.</p>
        <p className="mt-1">Made by <span className="text-emerald-400">techaffairs</span></p>
      </footer>
    </div>
  );
}

/* --- Reusable Cards --- */
function FeatureCard({ icon, title, text }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-slate-900 p-6 rounded-xl shadow-md border border-slate-700 text-center hover:shadow-lg hover:border-emerald-400 transition"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-slate-400">{text}</p>
    </motion.div>
  );
}


function IndustryCard({ icon, name, desc }: any) {
  return (
    <div className="group bg-slate-900 p-6 rounded-xl border border-slate-700 hover:border-emerald-400 hover:shadow-lg transition">
      <div className="flex justify-center mb-3 transition-transform duration-500 group-hover:rotate-6">
        <div className="text-emerald-400 group-hover:text-emerald-300 transform group-hover:scale-110 transition-all duration-500">
          {icon}
        </div>
      </div>
      <h5 className="font-semibold text-lg group-hover:text-emerald-400 transition">{name}</h5>
      <p className="text-slate-400 text-sm mt-1">{desc}</p>
    </div>
  );
}



