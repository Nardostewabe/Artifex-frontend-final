/**
 * COMPONENT: ModerationHistory
 * Receives the 'logs' array from the parent App.jsx.
 */
export default function ModerationHistory({ logs }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#3A3A6C]">Audit Logs</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{logs.length} Actions Logged</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#F8F8FF] text-[#3A3A6C] text-[10px] uppercase font-bold tracking-widest border-b border-slate-200">
            <tr>
              <th className="p-4">Action</th>
              <th className="p-4">Moderator</th>
              <th className="p-4">Target Content</th>
              <th className="p-4">Violation Type</th>
              <th className="p-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map(log => (
              <tr key={log.id} className="text-sm hover:bg-slate-50 transition-colors animate-in fade-in duration-500">
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase ${log.action.includes('Removed') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4 font-bold text-[#3A3A6C]">{log.moderator}</td>
                <td className="p-4 text-slate-700 font-medium">{log.target}</td>
                <td className="p-4 text-slate-400 italic text-xs">"{log.reason}"</td>
                <td className="p-4 text-slate-400 font-mono text-xs">{log.date}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-400 italic">No history recorded in this session.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
