// src/components/Navbar.tsx
import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white/5 backdrop-blur-md border-b border-white/10">
      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/10 text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
        />
      </div>

      {/* User area */}
      <div className="flex items-center gap-5">
        <Bell size={20} className="text-gray-300 cursor-pointer hover:text-white transition" />
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center font-bold text-sm">
          A
        </div>
      </div>
    </header>
  );
}
