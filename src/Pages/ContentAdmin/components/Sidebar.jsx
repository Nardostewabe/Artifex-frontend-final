import {
  FiHome,
  FiFlag,
  FiBookOpen,
  FiClock,
  FiBarChart2,
  FiUser,
  FiLogOut
} from "react-icons/fi";

export default function Sidebar({ setActivePage, activePage }) {
  const menus = [
    { id: "pending", title: "Product List", icon: <FiHome /> },
    { id: "flagged", title: "Flagged Content", icon: <FiFlag /> },
    { id: "tutorials", title: "DIY Tutorials", icon: <FiBookOpen /> },
    { id: "history", title: "Moderation History", icon: <FiClock /> },
    { id: "reports", title: "Violation Reports", icon: <FiBarChart2 /> },
  ];

  return (
    <div
      className="
        w-60
        bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff]
        text-white
        min-h-screen 
        p-6
        shadow-2xl 
        flex flex-col justify-between
        rounded-r-[32px]
        border-r border-white/20
      "
    >
      {/* Branding / Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold tracking-wide drop-shadow-sm">
          Content Admin
        </h1>
      </div>

      {/* Menu List */}
      <div className="space-y-3">
        {menus.map((m) => (
          <button
            key={m.id}
            onClick={() => setActivePage(m.id)}
            className={`
              flex items-center gap-4 w-full
              px-4 py-3 rounded-xl 
              font-medium text-sm tracking-wide
              backdrop-blur-sm
              transition-all duration-300

              ${
                activePage === m.id
                  ? "bg-white text-[#4A4A6A] shadow-md scale-[1.05]"
                  : "hover:bg-white/20 hover:scale-[1.02]"
              }
            `}
          >
            <span className="text-lg">{m.icon}</span>
            <span className="whitespace-nowrap">{m.title}</span>
          </button>
        ))}
      </div>

      {/* Bottom Items */}
      <div className="space-y-3 mt-10">
        <button
          className="
            flex items-center gap-3 px-4 py-3 
            w-full rounded-xl
            hover:bg-white/20 hover:scale-[1.02]
            backdrop-blur-sm transition-all duration-300
          "
        >
          <FiUser className="text-lg" />
          <span className="text-sm">Profile</span>
        </button>

        <button
          className="
            flex items-center gap-3 px-4 py-3 
            w-full rounded-xl
            hover:bg-white/20 hover:scale-[1.02]
            backdrop-blur-sm transition-all duration-300
          "
        >
          <FiLogOut className="text-lg" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
