import { useNavigate } from "react-router-dom";
import { Building2, ShoppingBag, Plane, HeartPulse, Leaf, Wrench } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSignup = () => navigate("/signup");
  const handleSignin = () => navigate("/login");

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* HERO SECTION */}
      <header className="text-center py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <h1 className="text-4xl md:text-5xl font-bold">
          FlexBizPro by{" "}
          <span className="text-emerald-400">Tech Affairs</span>
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          Comprehensive monitoring and management platform tailored for
          hospitality, commerce, tourism, health, agriculture, and technical
          services.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleSignup}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Sign Up Here
          </button>
          <button
            onClick={handleSignin}
            className="border border-emerald-400 hover:bg-emerald-500/10 text-emerald-300 px-6 py-2 rounded-lg font-semibold"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* INDUSTRIES SECTION */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold text-emerald-400 mb-10">
          Industries We Empower
        </h2>

        <div className="flex flex-wrap justify-center gap-6 px-4">
          {[
            { icon: <Building2 />, title: "Hospitality", desc: "Streamline bookings and guest experiences." },
            { icon: <ShoppingBag />, title: "Commerce", desc: "Manage inventory and sales efficiently." },
            { icon: <Plane />, title: "Tourism", desc: "Simplify tour scheduling and client management." },
            { icon: <HeartPulse />, title: "Health", desc: "Organize patient records and prescriptions." },
            { icon: <Leaf />, title: "Agriculture", desc: "Track yields, inputs, and production cycles." },
            { icon: <Wrench />, title: "Technical Services", desc: "Manage repairs and maintenance operations." },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-slate-800/80 p-6 rounded-lg w-52 hover:bg-slate-700/70 transition"
            >
              <div className="text-emerald-400 mx-auto mb-3">{icon}</div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-slate-400 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="bg-emerald-600/90 py-16 text-center">
        <h3 className="text-xl font-semibold text-white">
          Ready to Transform Your Business?
        </h3>
        <p className="mt-2 text-slate-100">
          Join thousands of businesses already using FlexBisPro.
        </p>
        <button
          onClick={handleSignup}
          className="mt-6 bg-white text-emerald-600 hover:bg-slate-100 px-6 py-2 rounded-lg font-semibold"
        >
          Sign Up Here
        </button>
      </footer>

      {/* FOOTER COPYRIGHT */}
      <div className="bg-slate-950 text-slate-400 py-6 text-center text-sm">
        © 2025 <span className="text-emerald-400">FlexBisPro</span>. All rights reserved. <br />
        Made by <span className="text-emerald-400">techaffairs</span>
      </div>
    </div>
  );
}
