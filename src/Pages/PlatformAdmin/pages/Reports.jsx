import { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import {
  Gavel,
  MessageCircle,
  User,
  Package,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
  Inbox
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

// --- Sub-Component: Resolve Dispute Modal ---
const ResolveDisputeModal = ({ isOpen, onClose, dispute, token, onSuccess }) => {
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleResolve = async (e) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/PlatformAdminDisputes/${dispute.id}/resolve`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(resolutionNotes)
      });
      if (resp.ok) {
        onSuccess();
        onClose();
        setResolutionNotes("");
      } else {
        const msg = await resp.text();
        throw new Error(msg || "Failed to resolve dispute");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !dispute) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tighter italic">Resolve Dispute</h2>
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mt-1">Case ID: #{dispute.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleResolve} className="p-8 space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 text-amber-500">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Issue Reported</h4>
                <p className="text-slate-800 font-bold italic tracking-tight italic">"{(dispute.reason ?? dispute.Reason)}"</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <h4 className="text-[9px] font-black text-slate-400 uppercase mb-1">Complainant</h4>
                <p className="text-xs font-bold text-slate-700">{(dispute.complainant?.username ?? dispute.Complainant?.Username)}</p>
              </div>
              <div>
                <h4 className="text-[9px] font-black text-slate-400 uppercase mb-1">Order Ref</h4>
                <p className="text-xs font-bold text-slate-700">ORD-{(dispute.order?.id ?? dispute.Order?.Id)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-black text-slate-400 ml-4 mb-2 block">Official Resolution Notes</label>
              <textarea
                required
                placeholder="Briefly describe the resolution (e.g. Refund issued, Item returned, Case dismissed)..."
                className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-400 transition text-sm font-medium min-h-[120px] shadow-inner"
                value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit" disabled={submitting}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            {submitting ? "Finalizing..." : "Archive & Resolve"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function Reports() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("disputes"); // "disputes" or "escalated"
  const [disputes, setDisputes] = useState([]);
  const [escalatedReports, setEscalatedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [disputesRes, escalatedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/PlatformAdminDisputes`, {
          headers: { "Authorization": `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/PlatformAdminDisputes/escalated-reports`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
      ]);

      if (disputesRes.status === 401 || escalatedRes.status === 401) {
        logout();
        navigate("/login");
        return;
      }

      if (!disputesRes.ok || !escalatedRes.ok) throw new Error("Failed to load data");

      setDisputes(await disputesRes.json());
      setEscalatedReports(await escalatedRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const resolveReport = async (reportId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/PlatformAdminDisputes/resolve-report/${reportId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setEscalatedReports(prev => prev.filter(r => r.id !== reportId));
        setSelectedReport(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns = activeTab === "disputes"
    ? ["Case ID", "Reason", "Status", "Complainant", "Actions"]
    : ["Report ID", "Target", "Reason", "Reporter", "Actions"];
const disputeTableData = disputes.map(d => ({
    "Case ID": (
      <div className="flex items-center gap-2">
        <span className="font-black text-slate-800 italic">#{d.id}</span>
      </div>
    ),
    "Reason": (
      <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-slate-600 font-medium italic">
        "{d.reason}"
      </div>
    ),
    "Status": (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
        d.status === 'Open' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
      }`}>
        {d.status}
      </span>
    ),
    "Complainant": (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shadow-inner">
          <User size={14} />
        </div>
        <span className="text-xs font-bold text-slate-700">{d.complainantName}</span>
      </div>
    ),
    "Actions": (
      <button
        onClick={() => setSelectedDispute(d)}
        className="flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
      >
        <Gavel size={14} /> Arbitrate
      </button>
    )
  }));

  const reportTableData = escalatedReports.map(r => ({
    "Report ID": `#${r.id}`,
    "Target": (
      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${r.targetType === 'Product' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
        }`}>
        {r.targetType}
      </span>
    ),
    "Reason": r.reason,
    "Reporter": r.reporter?.username || "Admin",
    "Actions": (
      <button
        onClick={() => setSelectedReport(r)}
        className="flex items-center gap-2 px-6 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-black hover:bg-rose-600 hover:text-white transition-all shadow-sm"
      >
        <AlertCircle size={14} /> Resolve
      </button>
    )
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-12 text-slate-800">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em]">Arbitration Court</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 italic">Disputes</span>
            </h1>
            <p className="text-slate-500 font-medium italic">Review community complaints and issue final resolutions.</p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            <button
              onClick={() => setActiveTab("disputes")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "disputes" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                }`}
            >
              Order Disputes ({disputes.length})
            </button>
            <button
              onClick={() => setActiveTab("escalated")}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "escalated" ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                }`}
            >
              Escalated Reports ({escalatedReports.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin w-12 h-12 mb-4" />
            <p className="font-bold italic">Opening evidence locker...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">System Error</h2>
            <p className="text-slate-600 font-medium mb-6">Failed to sync: {error}</p>
            <button
              onClick={() => fetchData()}
              className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition"
            >
              Retry Evidence Sync
            </button>
          </div>
        ) : (activeTab === "disputes" ? disputes.length === 0 : escalatedReports.length === 0) ? (
          <div className="bg-emerald-50/50 p-20 rounded-[3rem] border border-emerald-100/50 text-center border-dashed">
            <CheckCircle2 className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <p className="text-emerald-400 font-bold italic tracking-tight uppercase">Platform is pristine. No active items.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-[3rem] blur opacity-25"></div>
            <div className="relative">
              <DataTable
                columns={columns}
                data={activeTab === "disputes" ? disputeTableData : reportTableData}
              />
            </div>
          </div>
        )}

      </div>

      <ResolveDisputeModal
        isOpen={!!selectedDispute}
        onClose={() => setSelectedDispute(null)}
        dispute={selectedDispute}
        token={token}
        onSuccess={() => {
          const id = selectedDispute.id ?? selectedDispute.Id;
          setDisputes(prev => prev.filter(d => (d.id ?? d.Id) !== id));
        }}
      />

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter text-rose-600">Final Resolution</h2>
                <p className="text-[10px] font-black uppercase text-slate-400">Moderating Case #{selectedReport.id}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-300"><X size={20} /></button>
            </div>

            <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 space-y-4">
              <p className="text-sm text-slate-700 font-medium">This report was escalated by Content Admins because it requires Platform-level intervention (e.g. account suspension or legal review).</p>
              <div className="p-3 bg-white/50 rounded-lg italic text-xs text-rose-800">
                "{selectedReport.description || selectedReport.reason}"
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => resolveReport(selectedReport.id)}
                className="w-full bg-rose-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-rose-700 transition shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
              >
                Mark as Resolved
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="w-full bg-slate-100 text-slate-500 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

