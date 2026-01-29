import { useEffect, useState } from "react";
import { Loader2, FileClock, CheckCircle, XCircle } from "lucide-react";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../context/AuthContext";

export default function ModerationHistory() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetch all reports to see history
        const res = await fetch(`${API_BASE_URL}/api/ContentAdmin/reports`, {
           headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) {
           const allReports = await res.json();
           // Filter: History = Items that are NOT pending anymore
           const history = allReports.filter(r => r.status !== "Pending");
           setLogs(history);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  if(loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline text-slate-400"/></div>;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-[#3A3A6C]">Moderation History</h2>
            <p className="text-slate-500">Archive of resolved cases.</p>
        </div>
        <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
            {logs.length} Records
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F8F8FF] text-[#3A3A6C] text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
            <tr>
              <th className="p-4">Status</th>
              <th className="p-4">Target</th>
              <th className="p-4">Reporter</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Resolved Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map(log => (
              <tr key={log.id} className="text-sm hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <span className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full font-bold text-[10px] uppercase ${
                    log.status === 'Dismissed' ? 'bg-gray-100 text-gray-500' : 
                    log.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {log.status === 'Resolved' ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                    {log.status}
                  </span>
                </td>
                <td className="p-4 font-bold text-[#3A3A6C]">
                    {log.targetType} {log.product ? `"${log.product.name}"` : `#${log.targetSellerId}`}
                </td>
                <td className="p-4 text-slate-600 font-medium">
                    {log.reporter?.username || "System"}
                </td>
                <td className="p-4 text-slate-500 italic">"{log.reason}"</td>
                <td className="p-4 text-slate-400 font-mono text-xs">
                    {new Date(log.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-400 italic flex flex-col items-center gap-2">
                    <FileClock size={32} />
                    No history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}