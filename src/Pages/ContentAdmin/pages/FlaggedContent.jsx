import { useState } from "react";
import { FiTrash2, FiFlag, FiUserCheck, FiAlertCircle } from "react-icons/fi";

// DUMMY DATA: Focuses on reporter and reported message
const INITIAL_FLAGGED = [
  { id: 1, type: "Review", content: "This seller is fake!!", reporter: "User123", seller: "AnnaDesigns", sellerReports: 4, reason: "Harassment", date: "2025-01-08" },
];

export default function FlaggedContent({ showToast }) {
  // STATE: List of flagged messages
  const [items, setItems] = useState(INITIAL_FLAGGED);
  // STATE: Active item for the Detail Modal
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * FUNCTION: handleAction
   * Updates state and triggers global toast.
   */
  const handleAction = (id, action) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItem(null);
    showToast(`Content ${action}ed successfully!`, action === "Removed" ? "error" : "success");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-[#3A3A6C]">Flagged Reviews & Comments</h2>

      {/* GRID VIEW: Displays reported snippets in clean card layouts */}
      <div className="grid gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#6C63FF] bg-[#6C63FF]/10 px-2 py-1 rounded">
                {item.type}
              </span>
              <p className="text-lg font-semibold text-[#3A3A6C]">"{item.content}"</p>
              <p className="text-sm text-gray-500 italic">Reported by {item.reporter} against @{item.seller}</p>
            </div>
            <button
              onClick={() => setSelectedItem(item)}
              className="bg-[#F8F8FF] text-[#6C63FF] px-6 py-2 rounded-xl font-bold hover:bg-[#6C63FF] hover:text-white transition-all"
            >
              Review
            </button>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL: Allows admin to Warn, Remove, or Keep the content */}
      {selectedItem && (
        <div className="fixed inset-0 bg-[#3A3A6C]/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Manage Flagged Content</h3>
              <button onClick={() => setSelectedItem(null)}>✕</button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">Message Content:</p>
              <p className="font-medium italic">"{selectedItem.content}"</p>
            </div>

            {/* SELLER ALERT: Identifies if the target user is a repeat offender */}
            <div className="flex items-center gap-3 text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
              <FiAlertCircle />
              <p className="text-xs font-bold uppercase">Seller has {selectedItem.sellerReports} previous reports</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => handleAction(selectedItem.id, "Warned")} className="bg-yellow-500 text-white py-3 rounded-xl font-bold">Warn</button>
              <button onClick={() => handleAction(selectedItem.id, "Removed")} className="bg-red-500 text-white py-3 rounded-xl font-bold">Remove</button>
              <button onClick={() => handleAction(selectedItem.id, "Approved")} className="bg-[#6C63FF] text-white py-3 rounded-xl font-bold">Keep</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
