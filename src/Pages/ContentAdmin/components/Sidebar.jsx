import { FiAlertCircle, FiClock, FiLogOut, FiBarChart2 } from "react-icons/fi";

export default function Sidebar({ setActivePage, activePage, queueCount, unseenLogsCount }) {
  /**
   * NAVIGATION CONFIG
   * count: References the dynamic state passed from App.jsx.
   */
  const menus = [
    { id: "queue", title: "Moderation Queue", icon: <FiAlertCircle />, count: queueCount },
    { id: "history", title: "History Logs", icon: <FiClock />, count: unseenLogsCount },
    { id: "reports", title: "Insights", icon: <FiBarChart2 />, count: 0 },
  ];

  return (
    /**
     * shrink-0: Prevents the sidebar from collapsing when the main table gets wide.
     * hidden md:flex: Hides the sidebar on very small mobile screens (optional - keeps layout clean).
     */
    <div className="w-64 shrink-0 bg-[#6C63FF] text-white p-6 flex flex-col shadow-2xl z-20 hidden md:flex">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-black italic tracking-tighter">CMOD</h1>
        <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest leading-none mt-1">Content Moderator</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menus.map((m) => (
          <button
            key={m.id}
            onClick={() => setActivePage(m.id)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 ${
              activePage === m.id ? "bg-white text-[#6C63FF] font-bold shadow-lg scale-105" : "hover:bg-white/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{m.icon}</span>
              <span className="text-sm">{m.title}</span>
            </div>

            {/* BUBBLE UI: Shows red circle if count > 0 */}
            {m.count > 0 && (
              <span className={`h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full text-[10px] font-black ${
                activePage === m.id ? "bg-[#6C63FF] text-white" : "bg-red-500 text-white"
              }`}>
                {m.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      <button className="flex items-center gap-3 px-4 py-3 mt-auto text-white/50 text-sm hover:text-white transition-colors">
        <FiLogOut /> Logout
      </button>
    </div>
  );
}