import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  ShoppingCart,
  Settings,
  AlertCircle,
  ClipboardList,
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { label: "Dashboard", to: "PlatformAdmin-dashboard", icon: <Home className="w-5 h-5" /> },
    { label: "User Monitoring", to: "/users", icon: <Users className="w-5 h-5" /> },
    { label: "Seller Management", to: "/sellers", icon: <ShoppingCart className="w-5 h-5" /> },
    { label: "Admin Management", to: "/admins", icon: <Settings className="w-5 h-5" /> },
    { label: "Reports & Complaints", to: "/reports", icon: <AlertCircle className="w-5 h-5" /> },
    { label: "System Logs", to: "/logs", icon: <ClipboardList className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-[#B18AFF] to-[#8EB8FF] text-white p-6 shadow-xl flex flex-col gap-6 rounded-r-3xl">
      <h2 className="text-2xl font-bold tracking-wide drop-shadow-md mb-6">
        Platform Admin
      </h2>

      <nav className="flex flex-col gap-2">
        {menuItems.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm
               text-base font-semibold
               ${isActive
                 ? "bg-white text-[#4A4A6A] shadow-md scale-[1.03]"
                 : "hover:bg-white/20 hover:scale-[1.02] text-white"}`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto text-white/80 text-sm px-4 py-2">
        © Platform Admin 2025
      </div>
    </div>
  );
}