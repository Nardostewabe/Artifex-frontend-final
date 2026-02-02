import { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Loader2
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/PlatformAdminDashboard/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.status === 401 || response.status === 403) {
          logout();
          navigate("/login");
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch dashboard stats");

        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token, logout, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        <Loader2 className="animate-spin mr-2" />
        <span className="font-medium">Loading Dashboard Data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 p-6">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center max-w-md">
          <AlertTriangle className="w-10 h-10 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Sync Error</h2>
          <p className="text-sm opacity-80 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition"
          >
            Retry Sync
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? stats?.TotalUsers ?? 0,
      icon: <User className="w-6 h-6" />,
      theme: "from-blue-100 to-indigo-100 text-blue-600",
      badge: "Platform Scale"
    },
    {
      title: "Total Sellers",
      value: stats?.totalSellers ?? stats?.TotalSellers ?? 0,
      icon: <ShoppingBag className="w-6 h-6" />,
      theme: "from-purple-100 to-blue-100 text-purple-600",
      badge: "Shop Growth"
    },
    {
      title: "Total Revenue",
      value: (stats?.totalRevenue ?? stats?.TotalRevenue) ? `ETB ${(stats?.totalRevenue ?? stats?.TotalRevenue).toLocaleString()}` : "ETB 0",
      icon: <span className="font-bold text-xs uppercase opacity-70">ETB</span>,
      theme: "from-emerald-100 to-teal-100 text-emerald-600",
      badge: "Earnings"
    },
    {
      title: "Pending Disputes",
      value: stats?.pendingDisputes ?? stats?.PendingDisputes ?? 0,
      icon: <AlertTriangle className="w-6 h-6" />,
      theme: "from-red-100 to-orange-100 text-red-600",
      badge: "Action Required"
    },
  ];

  // Helper for trend chart max value
  const rawChartData = stats?.newUsersLast7Days ?? stats?.NewUsersLast7Days ?? [];

  // Robustly ensure we have 7 days of data even if backend returns fewer
  const chartData = rawChartData.length > 0 ? rawChartData : [
    { Date: 'N/A', Count: 0 },
    { Date: 'N/A', Count: 0 },
    { Date: 'N/A', Count: 0 },
    { Date: 'N/A', Count: 0 },
    { Date: 'N/A', Count: 0 },
    { Date: 'N/A', Count: 0 },
    { Date: 'N/A', Count: 0 }
  ];

  const maxTrend = Math.max(...(chartData.map(d => Number(d.count ?? d.Count ?? 0)) || [10]), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-12 text-slate-800">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-bold text-xs uppercase tracking-[0.3em]">
              Marketplace Control
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-800">
            System <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">Overview</span>
          </h1>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-sm">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">System Operational</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`relative group bg-gradient-to-br ${card.theme} rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-2xl overflow-hidden`}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl shadow-sm text-current">
                  {card.icon}
                </div>
                <span className="bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border border-white/20">
                  {card.badge}
                </span>
              </div>

              <h3 className="text-slate-700 font-bold uppercase tracking-widest mb-1 text-[10px]">
                {card.title}
              </h3>

              <div className="flex items-center gap-3">
                <span className="text-4xl font-black tracking-tighter italic">
                  {card.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Trends Chart */}
      <div className="mt-12 bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900">New User Trajectory</h2>
            <p className="text-slate-500 text-sm font-medium">Growth performance over the last 7 days</p>
          </div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <TrendingUp size={14} />
            Positive Growth
          </div>
        </div>

        <div className="flex items-end gap-2 h-48 w-full px-2">
          {chartData.map((day, idx) => {
            const count = Number(day.count ?? day.Count ?? 0);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group">
                <div className="relative w-full h-full flex flex-col justify-end items-center px-1 md:px-4">
                  <div className="absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                    {count} New
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-2xl transition-all duration-500 group-hover:to-purple-500 group-hover:scale-x-105"
                    style={{
                      height: `${(count / maxTrend) * 100}%`,
                      minHeight: count > 0 ? '4px' : '0'
                    }}
                  />
                  {count === 0 && (
                    <div className="w-full h-0.5 bg-slate-100 rounded-full" />
                  )}
                </div>
                <span className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  {day.date ?? day.Date}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

