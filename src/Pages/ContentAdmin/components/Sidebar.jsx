import { LayoutDashboard, Flag, Layers, ShoppingBag, FileClock, AlertTriangle, LogOut } from "lucide-react";

export default function Sidebar({ activePage, setActivePage, queueCount, onLogout }) {
  
  const menuItems = [
    { id: "queue", label: "Moderation Queue", icon: LayoutDashboard, count: queueCount },
    { id: "flagged", label: "Pending Reports", icon: Flag }, // Optional: You might want to merge Queue & Flagged
    { id: "categories", label: "Categories", icon: Layers },
    { id: "products", label: "All Products", icon: ShoppingBag },
    { id: "history", label: "Audit Logs", icon: FileClock },
    { id: "reports", label: "System Reports", icon: AlertTriangle },
  ];

  return (
    <aside className="w-20 md:w-64 bg-[#6C63FF] border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-50">
      {/* LOGO */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#6C63FF] rounded-lg flex items-center justify-center text-white font-black text-lg">A</div>
        <span className="font-black text-xl tracking-tighter text-[#3A3A6C] hidden md:block">Artifex<span className="text-[#6C63FF]">.Admin</span></span>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
              activePage === item.id 
                ? "bg-white text-black font-bold shadow-sm" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 font-medium"
            }`}
          >
            <item.icon size={20} className={activePage === item.id ? "text-black" : "text-slate-400 group-hover:text-slate-600"} />
            <span className="hidden md:block">{item.label}</span>
            
            {/* BADGE (Only show if count > 0) */}
            {item.count > 0 && (
              <span className="absolute right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full hidden md:block animate-pulse">
                {item.count}
              </span>
            )}
            {/* Mobile Dot Badge */}
            {item.count > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full md:hidden"></span>
            )}
          </button>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-100">
        <button
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 mt-auto text-black/70 text-sm hover:text-white hover:bg-white/10 rounded-xl transition-colors"
      >
        <LogOut /> Logout
      </button>
      </div>
    </aside>
  );
}