import { useState } from "react";
import { Check, X, Play } from "lucide-react";

const INITIAL_TUTORIALS = [
  { id: 1, title: "Crochet Bag Guide", seller: "CraftByLina", description: "Advanced stitching tutorial.", date: "2025-02-15" },
];

export default function Tutorials({ showToast }) {
  const [items, setItems] = useState(INITIAL_TUTORIALS);
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * FUNCTION: handleAction
   * Fulfills "Moderation Action Controls" (Approve/Reject)
   */
  const handleAction = (id, action) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItem(null);
    showToast(`Tutorial ${action} successfully!`, action === "Rejected" ? "error" : "success");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-[#3A3A6C]">DIY Tutorial Approvals</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-4">
            {/* PREVIEW BOX */}
            <div className="w-full h-32 bg-[#F8F8FF] rounded-2xl flex items-center justify-center text-[#6C63FF]">
              <Play size={40} />
            </div>
            <div>
              <h3 className="font-bold text-xl">{item.title}</h3>
              <p className="text-sm text-[#6C63FF]">By {item.seller}</p>
            </div>
            <button
              onClick={() => setSelectedItem(item)}
              className="w-full bg-[#6C63FF] text-white py-3 rounded-xl font-bold hover:bg-[#5A52E0] transition-colors"
            >
              Review Submission
            </button>
          </div>
        ))}
      </div>

      {/* APPROVAL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-[#3A3A6C]/40 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-[2rem] p-8 max-w-lg w-full space-y-6">
            <h3 className="text-2xl font-bold">{selectedItem.title}</h3>
            <p className="text-gray-600">{selectedItem.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleAction(selectedItem.id, "Rejected")} className="bg-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><X size={18} /> Reject</button>
              <button onClick={() => handleAction(selectedItem.id, "Approved")} className="bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Check size={18} /> Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
