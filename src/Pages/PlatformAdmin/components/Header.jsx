import { Bell } from 'lucide-react';
import ThemeToggle from '../../../components/ThemeToggle';

export default function Header() {
  return (
    <header className="w-full bg-white/60 backdrop-blur-lg shadow-lg rounded-2xl px-6 py-4 flex justify-between items-center border border-white/40">
      <h1 className="text-2xl font-bold text-[#2A2A4A] tracking-wide">
        Platform Admin Dashboard
      </h1>

      <div className="flex items-center gap-5">
        <ThemeToggle />
      </div>
    </header>
  );
}