import { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  Search,
  Eye,
  AlertCircle,
  ShieldAlert,
  X,
  MessageSquare,
  Loader2,
  Inbox
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import { API_BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

// --- Sub-Component: User Details Modal ---
const UserDetailsModal = ({ isOpen, onClose, userId, token, onActionSuccess }) => {
  const { showAlert } = useModal();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [warnText, setWarnText] = useState("");
  const [showWarnInput, setShowWarnInput] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showConfirmSuspend, setShowConfirmSuspend] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId || !isOpen) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/PlatformAdminUsers/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Could not load user details");
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [userId, isOpen, token]);

  const handleWarn = async () => {
    if (!warnText.trim()) return;
    setProcessing(true);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/PlatformAdminUsers/warn/${userId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(warnText)
      });
      if (resp.ok) {
        showAlert("Warning sent to user.", "Success", "success");
        setShowWarnInput(false);
        setWarnText("");
      } else {
        throw new Error("Failed to send warning");
      }
    } catch (err) {
      showAlert(err.message, "Warning Failed", "danger");
    } finally {
      setProcessing(false);
    }
  };

  const handleSuspend = async () => {
    setProcessing(true);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/PlatformAdminManagement/suspend-user/${userId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (resp.ok) {
        showAlert("User status updated.", "Success", "success");
        onActionSuccess();
        onClose();
        setShowConfirmSuspend(false);
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (err) {
      showAlert(err.message, "Action Failed", "danger");
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">User Dossier</h2>
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">{user?.username || "Loading..."}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8">
          {loading ? (
            <div className="flex flex-col items-center py-20 text-slate-400">
              <Loader2 className="animate-spin w-12 h-12 mb-4" />
              <p className="font-bold">Retrieving complete profile...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-center">
              <AlertCircle className="mx-auto mb-2" size={32} />
              <p className="font-bold">{error}</p>
            </div>
          ) : (
            <>
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Status</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${(user.status || "Active") === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}>
                    {user.status || "Active"}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Orders</p>
                  <p className="text-xl font-black text-slate-800 italic">{user.orderCount || 0}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Reports</p>
                  <p className="text-xl font-black text-red-600 italic">{user.reportCount || 0}</p>
                </div>
              </div>

              {/* Detail Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase mb-2">Account History</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-sm font-medium text-slate-500">Username</span>
                      <span className="text-sm font-bold text-slate-800">{user.username}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-50 pb-2">
                      <span className="text-sm font-medium text-slate-500">Email</span>
                      <span className="text-sm font-bold text-slate-800">{user.email}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase mb-2">Platform Activity</h4>
                  <p className="text-sm text-slate-600">This user joined the community on <span className="font-bold text-slate-800">{user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "N/A"}</span>.</p>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase mb-3 text-slate-700">Recent Transactions</h4>
                <div className="space-y-2">
                  {user.recentOrders?.length > 0 ? user.recentOrders.map(o => (
                    <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white transition shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg text-blue-500 shadow-inner italic font-black text-xs">#{o.id}</div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 italic">Order Ref: {o.id}</p>
                          <p className="text-[10px] text-slate-400">{o.date ? new Date(o.date).toLocaleDateString() : "N/A"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-800">${o.total}</p>
                        <span className={`text-[9px] font-bold uppercase ${o.status === "Delivered" ? "text-emerald-500" : "text-amber-500"
                          }`}>{o.status}</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400 italic px-4">No recent transactions found.</p>
                  )}
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="pt-6 border-t border-slate-100 flex flex-col gap-4">
                <h4 className="text-xs font-black text-slate-400 uppercase">Administrative Actions</h4>

                {showWarnInput ? (
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-3">
                    <textarea
                      placeholder="Enter warning message..."
                      className="w-full p-3 bg-white rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-400 transition min-h-[100px]"
                      value={warnText}
                      onChange={(e) => setWarnText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setShowWarnInput(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                      <button
                        onClick={handleWarn}
                        disabled={processing}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200"
                      >
                        {processing ? "Sending..." : "Send Warning"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowWarnInput(true)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-2xl text-xs font-black hover:bg-blue-100 transition shadow-sm"
                    >
                      <MessageSquare size={16} /> Send Warning
                    </button>
                    <button
                      onClick={() => setShowConfirmSuspend(true)}
                      disabled={processing}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-2xl text-xs font-black hover:bg-red-100 transition shadow-sm"
                    >
                      <ShieldAlert size={16} /> {(user.status || "Active") === "Active" ? "Suspend User" : "Unsuspend User"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <ConfirmationModal
          isOpen={showConfirmSuspend}
          onClose={() => setShowConfirmSuspend(false)}
          onConfirm={handleSuspend}
          title={(user?.status || "Active") === "Active" ? "Suspend Community Member?" : "Restore Community Access?"}
          message={(user?.status || "Active") === "Active"
            ? `Are you sure you want to restrict access for ${user?.username}? They will no longer be able to log in or interact with the platform.`
            : `Are you sure you want to restore full platform access for ${user?.username}?`}
          confirmText={(user?.status || "Active") === "Active" ? "Terminate Access" : "Restore Access"}
          type={(user?.status || "Active") === "Active" ? "danger" : "info"}
          isProcessing={processing}
        />
      </div>
    </div>
  );
};

export default function UserMonitoring() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/PlatformAdminUsers`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        logout();
        navigate("/login");
        return;
      }
      if (!response.ok) throw new Error("Failed to load user list");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = ["User", "Role", "Joined Date", "Details"];

  const tableData = filteredUsers.map(u => ({
    "User": (
      <div className="flex flex-col">
        <span className="font-bold text-slate-800 italic">{u.username}</span>
        <span className="text-[10px] text-slate-400 font-medium">{u.email}</span>
      </div>
    ),
    "Role": u.role,
    "Joined Date": new Date(u.joinedDate).toLocaleDateString(),
    "Details": (
      <button
        onClick={() => setSelectedUserId(u.id)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
      >
        <Eye size={14} /> View Dossier
      </button>
    )
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-12 text-slate-800">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              User <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 italic">Monitoring</span>
            </h1>
            <p className="text-slate-500 font-medium italic">Oversee individual community members and maintain platform safety.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Filter by name or email..."
              className="pl-12 pr-6 py-4 bg-white rounded-3xl border-none shadow-xl shadow-slate-200/50 text-sm focus:ring-2 focus:ring-blue-400 transition w-full md:w-80"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin w-12 h-12 mb-4" />
            <p className="font-bold italic">Scanning database for users...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Sync Interrupted</h2>
            <p className="text-slate-600 font-medium mb-6">We couldn't reach the user monitoring service.</p>
            <button
              onClick={fetchUsers}
              className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition"
            >
              Reconnect
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-slate-50 p-20 rounded-[3rem] border border-slate-100 text-center border-dashed">
            <Inbox className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-bold italic tracking-tight uppercase">No matching dossiers found</p>
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[3rem] blur opacity-25"></div>
            <div className="relative">
              <DataTable columns={columns} data={tableData} />
            </div>
          </div>
        )}

        <UserDetailsModal
          isOpen={!!selectedUserId}
          onClose={() => setSelectedUserId(null)}
          userId={selectedUserId}
          token={token}
          onActionSuccess={fetchUsers}
        />

      </div>
    </div>
  );
}
