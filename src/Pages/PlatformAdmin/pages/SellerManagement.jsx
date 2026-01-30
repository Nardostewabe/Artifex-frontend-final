import { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  Store,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Loader2,
  AlertCircle,
  Inbox,
  Search,
  Power,
  Filter,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import { API_BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

export default function SellerManagement() {
  const { token, logout } = useAuth();
  const { showAlert } = useModal();
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, suspended, deactivated, pending
  const [processingId, setProcessingId] = useState(null);

  // Modal State
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, sellerId: null, action: null });

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${API_BASE_URL}/api/PlatformAdminSeller/all-sellers`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (resp.status === 401 || resp.status === 403) {
        logout();
        navigate("/login");
        return;
      }

      if (!resp.ok) throw new Error("Failed to load seller directory");

      const data = await resp.json();
      setSellers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSellers();
  }, [token]);

  const initiateAction = (sellerId, action) => {
    setConfirmConfig({ isOpen: true, sellerId, action });
  };

  const handleAction = async () => {
    const { sellerId, action } = confirmConfig;
    if (!sellerId || !action) return;

    setProcessingId(sellerId);
    try {
      let endpoint = "";
      let method = "POST";

      switch (action) {
        case "suspend": endpoint = `suspend-seller/${sellerId}`; break;
        case "unsuspend": endpoint = `unsuspend-seller/${sellerId}`; break;
        case "deactivate": endpoint = `deactivate-seller/${sellerId}`; method = "PATCH"; break;
        case "reactivate": endpoint = `reactivate-seller/${sellerId}`; method = "PATCH"; break;
      }

      const resp = await fetch(`${API_BASE_URL}/api/PlatformAdminSeller/${endpoint}`, {
        method,
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (resp.ok) {
        setConfirmConfig({ isOpen: false, sellerId: null, action: null });
        await fetchSellers(); // Refresh the list from server
      } else {
        const msg = await resp.text();
        showAlert(msg || `Failed to ${action} seller`, "Action Failed", "danger");
      }
    } catch (err) {
      showAlert(err.message, "Error", "danger");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredSellers = sellers.filter(s => {
    // 1. Search Filter
    const matchesSearch =
      (s.shopName ?? s.ShopName ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.ownerEmail ?? s.OwnerEmail ?? "").toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Status Filter
    const isSuspended = s.isSuspended ?? s.IsSuspended;
    const isDeactivated = s.isDeactivated ?? s.IsDeactivated;
    const isApproved = s.isApproved ?? s.IsApproved;

    if (statusFilter === "active") return isApproved && !isSuspended && !isDeactivated;
    if (statusFilter === "suspended") return isSuspended && !isDeactivated;
    if (statusFilter === "deactivated") return isDeactivated;
    if (statusFilter === "pending") return !isApproved && !isDeactivated;

    return true; // "all"
  });

  const columns = ["Merchant", "Owner", "Status", "Control Panel"];

  const tableData = filteredSellers.map(s => {
    const isSuspended = s.isSuspended ?? s.IsSuspended;
    const isDeactivated = s.isDeactivated ?? s.IsDeactivated;
    const isApproved = s.isApproved ?? s.IsApproved;
    const id = s.id ?? s.Id;

    return {
      "Merchant": (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
            <Store size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 tracking-tight">{s.shopName ?? s.ShopName}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
              {s.id.substring(0, 8)}...
            </span>
          </div>
        </div>
      ),
      "Owner": (
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-700 italic">{s.ownerName ?? s.OwnerName}</span>
          <span className="text-[10px] text-slate-400 font-medium">{s.ownerEmail ?? s.OwnerEmail}</span>
        </div>
      ),
      "Status": (
        <div className="flex flex-wrap gap-1">
          {isDeactivated ? (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-tighter border border-slate-200">Deactivated</span>
          ) : (
            <>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter border ${isApproved ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-orange-600 border-orange-100"
                }`}>
                {isApproved ? "Authorized" : "Pending Approval"}
              </span>
              {isSuspended && (
                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-md text-[9px] font-black uppercase tracking-tighter border border-red-100 animate-pulse">Suspended</span>
              )}
            </>
          )}
        </div>
      ),
      "Control Panel": (
        <div className="flex gap-2">
          {!isDeactivated ? (
            <>
              <button
                onClick={() => initiateAction(id, isSuspended ? "unsuspend" : "suspend")}
                disabled={processingId === id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm ${isSuspended ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white" : "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white"
                  }`}
              >
                {isSuspended ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                {isSuspended ? "Restore" : "Restrict"}
              </button>
              <button
                onClick={() => initiateAction(id, "deactivate")}
                disabled={processingId === id}
                className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-black hover:bg-rose-600 hover:text-white transition-all shadow-sm"
              >
                <XCircle size={14} /> Terminate
              </button>
            </>
          ) : (
            <button
              onClick={() => initiateAction(id, "reactivate")}
              disabled={processingId === id}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <CheckCircle size={14} /> Reactivate Business
            </button>
          )}
        </div>
      )
    };
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-12 text-slate-800">
      <div className="max-w-6xl mx-auto">

        {/* Header Section ... */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
          <div className="flex-1">
            <h2 className="text-indigo-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-2">Commerce Security Cluster</h2>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic uppercase">
              Seller <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Infrastructure</span>
            </h1>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Global Roster", icon: <Inbox size={14} /> },
                { id: "active", label: "Operating", icon: <CheckCircle size={14} /> },
                { id: "suspended", label: "Restricted", icon: <ShieldAlert size={14} /> },
                { id: "deactivated", label: "Decommissioned", icon: <Power size={14} /> },
                { id: "pending", label: "Audit Required", icon: <AlertCircle size={14} /> },
              ].map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setStatusFilter(pill.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === pill.id ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "bg-white text-slate-400 hover:text-slate-600 border border-slate-100"
                    }`}
                >
                  {pill.icon} {pill.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition"></div>
            <div className="relative flex items-center bg-white rounded-3xl shadow-sm border border-slate-100 pr-2">
              <Search className="ml-5 text-slate-300" size={18} />
              <input
                type="text"
                placeholder="Find merchant or email..."
                className="pl-3 pr-6 py-4 bg-transparent border-none text-sm focus:ring-0 font-medium w-full md:w-64 text-slate-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin w-12 h-12 mb-4 text-indigo-500" />
            <p className="font-black italic uppercase tracking-widest text-[10px]">Syncing merchant encrypted database...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 p-12 rounded-[3.5rem] border border-rose-100 text-center">
            <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Network Breach</h2>
            <p className="text-slate-600 font-medium mb-8 max-w-sm mx-auto italic">{error}</p>
            <button
              onClick={fetchSellers}
              className="px-12 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-200 hover:bg-rose-700 transition active:scale-95"
            >
              Attempt Reconnection
            </button>
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="bg-white/50 p-24 rounded-[4rem] border-2 border-dashed border-slate-100 text-center">
            <Inbox className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <p className="text-slate-400 font-black italic tracking-tighter uppercase text-xl">No merchant data matching current filter</p>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-[3.5rem] blur opacity-25"></div>
            <div className="relative">
              <DataTable columns={columns} data={tableData} />
            </div>
          </div>
        )}

      </div>

      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ isOpen: false, sellerId: null, action: null })}
        onConfirm={handleAction}
        isProcessing={processingId !== null}
        title={
          confirmConfig.action === 'deactivate' ? "Terminate Merchant Shop?" :
            confirmConfig.action === 'suspend' ? "Restrict Shop Access?" :
              confirmConfig.action === 'unsuspend' ? "Restore Shop Access?" :
                "Reactivate Business Entity?"
        }
        message={
          confirmConfig.action === 'deactivate' ? "This will revoke all seller privileges and downgrade the merchant to a standard user account. This action is critical." :
            confirmConfig.action === 'suspend' ? "The merchant will be unable to process orders or manage inventory until access is restored." :
              "Are you sure you want to proceed with this status change for the selected merchant?"
        }
        confirmText={
          confirmConfig.action === 'deactivate' ? "Terminate" :
            confirmConfig.action === 'suspend' ? "Restrict" :
              confirmConfig.action === 'unsuspend' ? "Restore" : "Reactivate"
        }
        type={
          confirmConfig.action === 'deactivate' || confirmConfig.action === 'suspend' ? "danger" : "info"
        }
      />
    </div>
  );
}
