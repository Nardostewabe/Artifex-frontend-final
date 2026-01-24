import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  ShoppingCart,
  Settings,
  AlertCircle,
  ClipboardList,
  LogOut,
} from "lucide-react";

export default function Sidebar({ pendingReportsCount = 0, pendingRegistersCount = 0 }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", to: "PlatformAdmin-dashboard", icon: <Home className="w-5 h-5" />, count: 0 },
    { label: "User Monitoring", to: "/users", icon: <Users className="w-5 h-5" />, count: 0 },
    { label: "Seller Management", to: "/sellers", icon: <ShoppingCart className="w-5 h-5" />, count: 0 },
    { label: "Seller Registers", to: "/sellers-approval", icon: <ShoppingCart className="w-5 h-5" />, count: pendingRegistersCount },
    { label: "Admin Management", to: "/admins", icon: <Settings className="w-5 h-5" />, count: 0 },
    { label: "Reports & Complaints", to: "/reports", icon: <AlertCircle className="w-5 h-5" />, count: pendingReportsCount },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-[#B18AFF] to-[#8EB8FF] text-white p-6 shadow-2xl flex flex-col gap-6 rounded-r-3xl shrink-0 hidden md:flex">
      {/* Branding Section */}
      <div className="mb-4 px-2">
        <h1 className="text-2xl font-black italic tracking-tighter">PADMIN</h1>
        <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest leading-none mt-1">
          Platform Administrator
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map(({ label, to, icon, count }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm
               text-base font-semibold
               ${isActive
                ? "bg-white text-[#6C63FF] shadow-lg scale-105"
                : "hover:bg-white/20 hover:scale-[1.02] text-white"}`
            }
          >
            <div className="flex items-center gap-3">
              {icon}
              <span className="text-sm">{label}</span>
            </div>

            {/* Notification Badge */}
            {count > 0 && (
              <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-black bg-red-500 text-white">
                {count}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-black/70 text-sm hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>

      {/* Footer */}
      <div className="text-white/60 text-xs px-4 py-2 text-center border-t border-white/20 pt-4">
        © Platform Admin 2026
      </div>
    </div>
  );
}