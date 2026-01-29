import { useState, useEffect } from "react";
import { Trash2, Flag, AlertCircle, Loader2, Send } from "lucide-react";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../context/AuthContext";

export default function FlaggedContent({ showToast }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // State for deletion logic
  const [showDeleteInput, setShowDeleteInput] = useState(false);
  const [deletionReason, setDeletionReason] = useState("");

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/ContentAdmin/reports`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setItems(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(true);
    try {
      const endpoint = action === "Escalate"
        ? `${API_BASE_URL}/api/ContentAdmin/escalate/${id}`
        : `${API_BASE_URL}/api/ContentAdmin/dismiss/${id}`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
        setSelectedItem(null);
        showToast(`Report ${action === "Escalate" ? "escalated" : "dismissed"} successfully!`, "success");
      } else {
        showToast("Failed to process report", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Operation failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ New Handler for Product Deletion
  const handleDeleteProduct = async () => {
    if (!deletionReason.trim()) {
        showToast("Please enter a reason for deletion.", "error");
        return;
    }

    setActionLoading(true);
    const productId = selectedItem.targetProductId;

    try {
        const res = await fetch(`${API_BASE_URL}/api/ContentAdmin/delete-product/${productId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(deletionReason)
        });

        if (res.ok) {
            setItems(items.filter(item => item.id !== selectedItem.id)); // Remove report from list
            setSelectedItem(null);
            setShowDeleteInput(false);
            setDeletionReason("");
            showToast("Product deleted and seller notified.", "success");
        } else {
            showToast("Failed to delete product.", "error");
        }
    } catch (err) {
        console.error(err);
        showToast("Error deleting product.", "error");
    } finally {
        setActionLoading(false);
    }
  };

  if (loading) return <div className="flex flex-col items-center justify-center p-20 text-slate-400"><Loader2 className="animate-spin mb-4" size={40} /><p className="font-bold italic">Loading reports...</p></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-[#3A3A6C] tracking-tighter italic">Pending Reports</h2>
          <p className="text-slate-500 font-medium italic">Review flagged products and reported sellers.</p>
        </div>
        <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">{items.length} Active</span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white p-20 rounded-[2rem] border-2 border-dashed border-slate-100 text-center">
          <p className="text-slate-300 font-bold uppercase tracking-widest italic">All clear. No pending reports.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${item.targetType === 'Product' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                    {item.targetType || item.TargetType}
                  </span>
                  <span className="text-xs font-bold text-slate-400">#{item.id}</span>
                </div>
                <p className="text-lg font-bold text-[#3A3A6C] tracking-tight">{item.reason || item.Reason}</p>
                <p className="text-xs text-slate-500 italic max-w-md truncate">
                  Target: {item.targetType === 'Product' ? `Product #${item.targetProductId}` : `Seller #${item.targetSellerId}`}
                </p>
              </div>
              <button
                onClick={() => { setSelectedItem(item); setShowDeleteInput(false); }}
                className="bg-[#F8F8FF] text-[#6C63FF] px-6 py-2 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#6C63FF] hover:text-white transition-all shadow-sm"
              >
                Arbitrate
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-[#3A3A6C]/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black tracking-tighter">Case Details</h3>
                <p className="text-xs text-slate-400 font-bold uppercase">{selectedItem.targetType} Report</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-slate-300 hover:text-slate-900 transition-colors">✕</button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reason</p>
                <p className="text-slate-800 font-bold italic">"{selectedItem.reason}"</p>
                {selectedItem.description && (
                  <p className="text-xs text-slate-500 mt-2 font-medium">{selectedItem.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100">
                <AlertCircle size={18} />
                <p className="text-xs font-bold uppercase tracking-tighter">Reported by {selectedItem.reporter?.username || "Community User"}</p>
              </div>
            </div>

            {/* Deletion Input UI */}
            {showDeleteInput ? (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                    <label className="text-xs font-bold text-red-500 uppercase tracking-wide">Reason for Deletion (Sent to Seller)</label>
                    <textarea 
                        className="w-full mt-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-200"
                        rows="3"
                        placeholder="e.g., Violation of policy regarding..."
                        value={deletionReason}
                        onChange={(e) => setDeletionReason(e.target.value)}
                    ></textarea>
                    <div className="flex gap-2 mt-3">
                        <button 
                            onClick={handleDeleteProduct} 
                            disabled={actionLoading}
                            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition"
                        >
                            {actionLoading ? "Deleting..." : "Confirm Delete"}
                        </button>
                        <button 
                            onClick={() => setShowDeleteInput(false)} 
                            className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 pt-4">
                    <button
                        disabled={actionLoading}
                        onClick={() => handleAction(selectedItem.id, "Dismiss")}
                        className="bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50"
                    >
                        Dismiss Case
                    </button>
                    
                    {/* If it's a PRODUCT, show Delete option. If SELLER, show Escalate option */}
                    {selectedItem.targetType === "Product" ? (
                        <button
                            disabled={actionLoading}
                            onClick={() => setShowDeleteInput(true)}
                            className="bg-red-50 text-red-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100 flex items-center justify-center gap-2"
                        >
                            <Trash2 size={16} /> Delete Product
                        </button>
                    ) : (
                        <button
                            disabled={actionLoading}
                            onClick={() => handleAction(selectedItem.id, "Escalate")}
                            className="bg-[#6C63FF] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#5A52E0] transition-all shadow-lg shadow-purple-100 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {actionLoading && <Loader2 className="animate-spin" size={14} />}
                            Escalate to Admin
                        </button>
                    )}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}