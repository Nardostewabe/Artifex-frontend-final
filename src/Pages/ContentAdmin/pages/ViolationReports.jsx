import { useState, useEffect } from "react";
import { Send, AlertCircle, Loader2, TrendingUp, AlertTriangle, Ban } from "lucide-react";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../context/AuthContext";

export default function ViolationReports({ showToast }) {
  const { token } = useAuth();
  const [reportText, setReportText] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [sending, setSending] = useState(false);
  
  // ✅ STATE: Holds dynamic stats from the backend
  const [stats, setStats] = useState({ 
      TopRejectedSeller: "Loading...", 
      MostFlaggedCategory: "Loading...", 
      PendingReports: 0 
  });

  // ✅ FETCH: Load stats on mount
  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/ContentAdmin/stats`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Handle cases where data might be null (e.g. no rejected sellers yet)
                setStats({
                    TopRejectedSeller: data.topRejectedSeller || "None",
                    MostFlaggedCategory: data.mostFlaggedCategory || "None",
                    PendingReports: data.pendingReports || 0
                });
            }
        } catch(e) { 
            console.error("Failed to load stats", e); 
        }
    };
    fetchStats();
  }, [token]);

  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setSending(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ContentAdmin/create-system-report`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reason: `${urgency} Priority Report`,
          description: reportText
        })
      });

      if (res.ok) {
        if (showToast) showToast("Report escalated successfully!", "success");
        setReportText("");
        setUrgency("Normal");
      } else {
        showToast("Failed to send report", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error sending report", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-3xl font-black text-[#3A3A6C] tracking-tighter italic">Violation Reports</h2>

      {/* ✅ DYNAMIC STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-rose-50 p-3 rounded-xl text-rose-500"><Ban size={24}/></div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Most Rejected</p>
                  <p className="text-lg font-bold text-[#3A3A6C] truncate max-w-[150px]" title={stats.TopRejectedSeller}>
                    {stats.TopRejectedSeller}
                  </p>
              </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-500"><TrendingUp size={24}/></div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Flagged Category</p>
                  <p className="text-lg font-bold text-[#3A3A6C] truncate max-w-[150px]" title={stats.MostFlaggedCategory}>
                    {stats.MostFlaggedCategory}
                  </p>
              </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="bg-amber-50 p-3 rounded-xl text-amber-500"><AlertTriangle size={24}/></div>
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Queue</p>
                  <p className="text-lg font-bold text-[#3A3A6C]">{stats.PendingReports} Cases</p>
              </div>
          </div>
      </div>

      {/* DYNAMIC SUBMISSION FORM */}
      <div className="bg-white p-8 rounded-3xl shadow-lg shadow-purple-900/5 border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#3A3A6C]">Escalate to Platform Admin</h3>
            <p className="text-sm text-slate-500 font-medium">Send a direct report regarding system issues or complex moderation cases.</p>
          </div>
        </div>

        <form onSubmit={handleSendReport} className="space-y-6">
          <div className="flex gap-4">
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="bg-[#F8F8FF] border border-slate-200 rounded-xl px-5 py-4 font-bold text-sm outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-purple-100 transition-all cursor-pointer"
            >
              <option>Low Urgency</option>
              <option>Normal</option>
              <option>High Urgency</option>
            </select>
          </div>

          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Describe the issue in detail..."
            className="w-full h-40 bg-[#F8F8FF] border border-slate-200 rounded-2xl p-5 text-sm font-medium outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-purple-100 resize-none transition-all placeholder:text-slate-400"
          ></textarea>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="bg-[#6C63FF] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#5A52E0] transition-all flex items-center gap-3 shadow-lg shadow-purple-200 hover:shadow-purple-300 disabled:opacity-50"
            >
              {sending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              {sending ? "Sending..." : "Send Report"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}