import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-white/60 backdrop-blur-lg shadow-lg rounded-2xl px-6 py-4 flex justify-between items-center border border-white/40">
      <h1 className="text-2xl font-bold text-[#2A2A4A] tracking-wide">
        Platform Admin Dashboard
      </h1>

      <div className="flex items-center gap-5">
        {/* Notification */}
        <div className="relative">
          <Bell className="w-7 h-7 text-[#A6C7FF]" strokeWidth={2} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#FF3B3B] rounded-full shadow-md"></span>
        </div>

        {/* Profile */}
        <div className="w-11 h-11 rounded-full bg-[#C2A8FF] flex items-center justify-center text-white font-semibold shadow-md">
          A
        </div>
      </div>
    </header>
  );
}