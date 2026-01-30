import { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  UserPlus,
  Trash2,
  ShieldCheck,
  Mail,
  MapPin,
  AlertCircle,
  Loader2,
  X,
  Plus
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import { API_BASE_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

// --- Sub-Component: Create Admin Modal ---
const CreateAdminModal = ({ isOpen, onClose, token, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    department: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/PlatformAdminManagement/create-content-admin`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (resp.ok) {
        onSuccess();
        onClose();
        setFormData({ username: "", email: "", password: "", fullName: "", department: "" });
      } else {
        const msg = await resp.text();
        throw new Error(msg || "Failed to create administrator");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tighter italic">Register Admin</h2>
            <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1">Credentials Assignment</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-2 text-sm font-bold">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 ml-4 mb-1 block">Username</label>
                <input
                  name="username" required
                  className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-400 transition text-sm font-medium"
                  value={formData.username} onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black text-slate-400 ml-4 mb-1 block">Full Name</label>
                <input
                  name="fullName" required
                  className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-400 transition text-sm font-medium"
                  value={formData.fullName} onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black text-slate-400 ml-4 mb-1 block">Email</label>
              <input
                name="email" type="email" required
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-400 transition text-sm font-medium"
                value={formData.email} onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-black text-slate-400 ml-4 mb-1 block">Department</label>
              <input
                name="department" required placeholder="e.g. Content, Support"
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-400 transition text-sm font-medium"
                value={formData.department} onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-black text-slate-400 ml-4 mb-1 block">Security Password</label>
              <input
                name="password" type="password" required
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-400 transition text-sm font-medium"
                value={formData.password} onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit" disabled={submitting}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? "Encrypting Data..." : "Finalize Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminManagement() {
  const { token, logout } = useAuth();
  const { showAlert } = useModal();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal State
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, adminId: null });
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${API_BASE_URL}/api/PlatformAdminManagement/list-content-admins`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (resp.status === 401 || resp.status === 403) {
        logout();
        navigate("/login");
        return;
      }
      if (!resp.ok) throw new Error("Failed to fetch administrator list");
      const data = await resp.json();
      setAdmins(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAdmins();
  }, [token]);

  const initiateRemove = (id) => {
    setConfirmConfig({ isOpen: true, adminId: id });
  };

  const removeAdmin = async () => {
    const id = confirmConfig.adminId;
    if (!id) return;

    setIsProcessing(true);
    try {
      const resp = await fetch(`${API_BASE_URL}/api/PlatformAdminManagement/remove-admin/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (resp.ok) {
        setAdmins(prev => prev.filter(a => a.id !== id));
        setConfirmConfig({ isOpen: false, adminId: null });
      } else {
        throw new Error("Failed to remove administrator");
      }
    } catch (err) {
      showAlert(err.message, "Remove Failed", "danger");
    } finally {
      setIsProcessing(false);
    }
  };

  const columns = ["Administrator", "Department", "Security Email", "Authorized Since", "Actions"];

  const tableData = admins.map(a => ({
    "Administrator": (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shadow-inner">
          <ShieldCheck size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 italic">{a.fullName ?? a.FullName}</span>
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-tighter">ID: {(a.id ?? a.Id).substring(0, 8)}...</span>
        </div>
      </div>
    ),
    "Department": (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
        <span className="text-xs font-bold text-slate-600">{a.department ?? a.Department}</span>
      </div>
    ),
    "Security Email": (
      <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
        <Mail size={12} /> {a.email ?? a.Email}
      </div>
    ),
    "Authorized Since": new Date(a.joinedDate ?? a.JoinedDate ?? a.assignedAt ?? a.AssignedAt).toLocaleDateString(),
    "Actions": (
      <button
        onClick={() => initiateRemove(a.id ?? a.Id)}
        className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition-all shadow-sm"
      >
        <Trash2 size={14} /> Revoke Access
      </button>
    )
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-12 text-slate-800">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              Privileged <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 italic">Accounts</span>
            </h1>
            <p className="text-slate-500 font-medium italic">Manage Content Administrators and system hierarchy.</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-3xl font-black text-sm hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition">
              <Plus size={18} />
            </div>
            Assign New Admin
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin w-12 h-12 mb-4" />
            <p className="font-bold italic">Authenticating security roster...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-10 rounded-[3rem] border border-red-100 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Registry Offline</h2>
            <p className="text-slate-600 font-medium mb-6">{error}</p>
            <button
              onClick={fetchAdmins}
              className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200 hover:bg-red-700 transition"
            >
              Retry Auth
            </button>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-[3rem] blur opacity-25"></div>
            <div className="relative">
              <DataTable columns={columns} data={tableData} />
            </div>
          </div>
        )}

      </div>

      <CreateAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={token}
        onSuccess={fetchAdmins}
      />

      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ isOpen: false, adminId: null })}
        onConfirm={removeAdmin}
        isProcessing={isProcessing}
        title="Revoke Admin Access?"
        message="This will permanently remove administrative privileges for this user. They will no longer have access to protected platform management areas."
        confirmText="Revoke Access"
        type="danger"
      />
    </div>
  );
}