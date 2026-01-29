import { useState } from "react";
import { FiSend, FiAlertCircle } from "react-icons/fi";

export default function ViolationReports({ showToast }) {
  const [reportText, setReportText] = useState("");
  const [urgency, setUrgency] = useState("Normal");

  const handleSendReport = (e) => {
    e.preventDefault();
    if(!reportText.trim()) return;
    
    // Simulate API call to send report to PA
    if (showToast) showToast("Report escalated to Platform Admin", "success");
    setReportText("");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-[#3A3A6C]">Violation Reports</h2>

      {/* EXISTING STATS */}
      <div className="bg-white p-5 rounded-xl shadow space-y-4 border border-slate-100">
        <p className="text-lg">🔥 Sellers with most rejected listings: <strong>SophiaCrafts</strong></p>
        <p className="text-lg">⚠️ Frequent inappropriate reviewers: <strong>User224</strong></p>
        <p className="text-lg">🚫 Most flagged category: <strong>Accessories</strong></p>
      </div>

      {/* NEW SECTION: CUSTOM PA REPORTING */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <FiAlertCircle size={24} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-[#3A3A6C]">Escalate to Platform Admin</h3>
                <p className="text-sm text-slate-500">Send a direct report regarding system issues or complex moderation cases.</p>
            </div>
        </div>

        <form onSubmit={handleSendReport} className="space-y-4">
          <div className="flex gap-4">
             <select 
               value={urgency} 
               onChange={(e) => setUrgency(e.target.value)}
               className="bg-[#F8F8FF] border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-[#6C63FF]"
             >
               <option>Low Urgency</option>
               <option>Normal</option>
               <option>High Urgency</option>
             </select>
          </div>
          
          <textarea 
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Write your report here..." 
            className="w-full h-32 bg-[#F8F8FF] border border-slate-200 rounded-xl p-4 text-sm font-medium outline-none focus:border-[#6C63FF] resize-none"
          ></textarea>

          <div className="flex justify-end">
            <button type="submit" className="bg-[#6C63FF] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5A52E0] transition-all flex items-center gap-2">
              <FiSend /> Send Report
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}