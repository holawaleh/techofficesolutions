// src/components/LandingPage.tsx
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4 text-teal-400">Welcome to TechofficeSolutions</h1>
      <p className="text-gray-300 mb-8 text-lg">
        Your all-in-one enterprise suite for managing sales, inventory, and services.
      </p>
      <button className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 transition text-white font-semibold">
        Get Started
      </button>
    </div>
  );
}
