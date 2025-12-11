import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable"; 
import { Eye, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { API_BASE_URL } from  "../../../config";

// --- Helper for Auth Headers ---
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// --- Sub-Component: Details Modal ---
const SellerDetailsModal = ({ seller, isOpen, onClose, onApprove, onReject, isProcessing }) => {
  if (!isOpen || !seller) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 border-b border-white">
          <h2 className="text-2xl font-serif text-slate-800">Review Application</h2>
          <p className="text-slate-500 text-sm">Review details for <strong>{seller.shopName}</strong></p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div className="flex items-center gap-2 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm border border-yellow-100">
            <Clock size={16} />
            <span>Status: <strong>Pending Approval</strong></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Shop Name</label>
              <p className="text-slate-800 font-medium text-lg">{seller.shopName || "N/A"}</p>
            </div>
            {/* Note: Ensure your C# Seller model actually includes Category/FullName if you want to display them */}
            <div>
              <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Category</label>
              <p className="text-slate-800">{seller.category || "General"}</p>
            </div>
            <div>
              <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Business Address</label>
              <p className="text-slate-800">{seller.businessAddress || "N/A"}</p>
            </div>
            <div>
              <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Contact Info</label>
              <p className="text-slate-800">{seller.contactNumber || "N/A"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs uppercase text-slate-400 font-bold tracking-wider">Description</label>
              <p className="text-slate-600 italic bg-slate-50 p-3 rounded border border-slate-100">
                "{seller.description || "No description provided."}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={() => onReject(seller.id)}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg font-medium transition disabled:opacity-50"
          >
            <XCircle size={18} /> {isProcessing ? "Processing..." : "Reject"}
          </button>
          <button 
            onClick={() => onApprove(seller.id)}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-medium shadow-md shadow-purple-200 transition disabled:opacity-50"
          >
            <CheckCircle size={18} /> {isProcessing ? "Processing..." : "Approve"}
          </button>
        </div>

      </div>
    </div>
  );
};


// --- Main Page Component ---
export default function SellerApproval() {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch Data from Backend
  const fetchPendingSellers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/PlatformAdminSeller/pending-sellers`, {
        headers: getAuthHeaders()
      });

      if (response.status === 401 || response.status === 403) {
        alert("Unauthorized. Please login as Admin.");
        navigate("/login");
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setSellers(data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  // 2. Handle Approve (Calls POST /approve)
  const handleApprove = async (id) => {
    if (!window.confirm("Are you sure you want to approve this seller?")) return;
    
    setProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/PlatformAdminSeller/approve/${id}`, {
        method: "POST",
        headers: getAuthHeaders()
      });

      if (response.ok) {
        // Remove from list locally to avoid reload
        setSellers(prev => prev.filter(s => s.id !== id));
        setSelectedSeller(null);
        alert("Seller approved successfully.");
      } else {
        const err = await response.text();
        alert(`Error: ${err}`);
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("Network error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  // 3. Handle Reject (Calls DELETE /delete-seller)
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to REJECT and DELETE this application?")) return;

    setProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/PlatformAdminSeller/delete-seller/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setSellers(prev => prev.filter(s => s.id !== id));
        setSelectedSeller(null);
        alert("Application rejected and deleted.");
      } else {
        const err = await response.text();
        alert(`Error: ${err}`);
      }
    } catch (error) {
      console.error("Rejection error:", error);
      alert("Network error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  // 4. Data Mapping for DataTable
  const columns = ["Shop Name", "Category", "Contact", "Status", "Action"];
  
  const tableData = sellers.map(seller => ({
    "Shop Name": seller.shopName,
    "Category": seller.category || "General", // Fallback if null
    "Contact": seller.contactNumber || seller.email || "N/A", 
    "Status": "Pending",
    "Action": (
      <button 
        onClick={() => setSelectedSeller(seller)}
        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 px-3 py-1.5 rounded-md transition text-sm font-medium"
      >
        <Eye size={16} /> Review
      </button>
    ),
    raw: seller // Keep raw data for key (if needed in DataTable logic)
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        <Clock className="animate-spin mr-2" /> Loading requests...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-slate-800">Seller Requests</h1>
          <p className="text-slate-500 mt-1">Manage incoming shop applications</p>
        </div>
        <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-bold">
            {sellers.length} Pending
        </div>
      </div>

      <DataTable columns={columns} data={tableData} />

      <SellerDetailsModal 
        seller={selectedSeller} 
        isOpen={!!selectedSeller} 
        onClose={() => setSelectedSeller(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        isProcessing={processing}
      />
    </div>
  );
}