import { useState, useMemo } from "react";
import { FiEye, FiTrash2, FiCheck, FiAlertTriangle, FiSearch, FiFilter, FiLayers, FiUser, FiSend } from "react-icons/fi";

export default function ModerationQueue({ items, onAction }) {
  // SEARCH & FILTER STATES
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterType, setFilterType] = useState("All"); 
  const [selectedItem, setSelectedItem] = useState(null);

  /**
   * DATA ENGINE
   */
  const processedItems = useMemo(() => {
    let result = items.filter(i => 
      i.name.toLowerCase().includes(search.toLowerCase()) || 
      i.seller.toLowerCase().includes(search.toLowerCase())
    );

    if (filterType !== "All") result = result.filter(i => i.type === filterType);

    result.sort((a, b) => {
      if (sortBy === "reports") return b.userReports - a.userReports;
      const rank = { High: 3, Medium: 2, Low: 1 };
      if (sortBy === "severity") return rank[b.severity] - rank[a.severity];
      return new Date(b.date) - new Date(a.date);
    });

    return result;
  }, [search, items, sortBy, filterType]);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#3A3A6C]">Moderation Queue</h2>
          <p className="text-sm text-slate-400">Total reported items: {items.length}</p>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex-1 lg:flex-none min-w-[120px]">
            <FiLayers className="text-[#6C63FF]" />
            <select className="text-xs font-bold outline-none bg-transparent w-full" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Product">Products</option>
              <option value="Review">Reviews</option>
              <option value="Tutorial">Tutorials</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex-1 lg:flex-none min-w-[120px]">
            <FiFilter className="text-slate-400" />
            <select className="text-xs font-bold outline-none bg-transparent w-full" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="severity">Severity</option>
              <option value="reports">Reports</option>
            </select>
          </div>

          <div className="relative text-sm w-full lg:w-48">
            <FiSearch className="absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl w-full focus:ring-2 focus:ring-[#6C63FF] outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-[#F8F8FF] border-b text-slate-500 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-4">Type</th>
                <th className="p-4">Content</th>
                <th className="p-4">Owner</th>
                <th className="p-4 text-center">Reports</th>
                <th className="p-4 text-center">Severity</th>
                <th className="p-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4"><span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100">{item.type}</span></td>
                  <td className="p-4 font-bold text-[#3A3A6C]">{item.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-[#6C63FF] text-xs font-bold">
                      <FiUser size={12} /> @{item.seller}
                    </div>
                  </td>
                  <td className="p-4 text-center font-bold text-slate-600">{item.userReports}</td>
                  <td className="p-4 text-center">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${item.severity === 'High' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelectedItem(item)} className="bg-[#F8F8FF] text-[#6C63FF] px-4 py-1.5 rounded-lg text-xs font-bold border border-slate-100 hover:bg-[#6C63FF] hover:text-white transition-all shadow-sm">
                      Action
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL SECTION WITH ESCALATION */}
      {selectedItem && (
        <div className="fixed inset-0 bg-[#3A3A6C]/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-[2rem] w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Threat Analysis</h3>
                  <p className="text-xs font-bold text-[#6C63FF] uppercase tracking-widest">Reported {selectedItem.type}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">✕</button>
              </div>

              <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-4">
                <FiAlertTriangle className="text-red-500 shrink-0" size={24} />
                <p className="text-red-900 text-sm font-bold uppercase">{selectedItem.reason}</p>
              </div>

              <div className="bg-[#F8F8FF] border border-slate-200 rounded-3xl p-6">
                {selectedItem.type === "Tutorial" && (
                  <video controls className="w-full rounded-2xl mb-4 shadow-lg">
                    <source src={selectedItem.videoUrl} type="video/mp4" />
                  </video>
                )}
                <div className="flex gap-4 items-center mb-4">
                  {selectedItem.type === "Product" && <img src={selectedItem.img} className="w-16 h-16 rounded-xl border-2 border-white shadow" />}
                  <div>
                    <p className="text-xs font-bold text-[#6C63FF]">Account: @{selectedItem.seller}</p>
                    <h4 className="text-lg font-black">{selectedItem.name}</h4>
                  </div>
                </div>
                <div className="p-4 bg-white/70 rounded-xl italic text-sm text-slate-600 border border-white">"{selectedItem.reportedContent}"</div>
              </div>

              {/* ACTION BUTTONS: ADDED ESCALATE */}
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => { onAction(selectedItem, "Approve"); setSelectedItem(null); }} className="bg-slate-100 py-4 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all">Keep</button>
                
                {/* NEW ESCALATE BUTTON */}
                <button onClick={() => { onAction(selectedItem, "Escalated"); setSelectedItem(null); }} className="bg-orange-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all flex flex-col items-center justify-center text-xs gap-1">
                  <FiSend size={16} /> <span>Escalate to PA</span>
                </button>

                <button onClick={() => { onAction(selectedItem, "Remove"); setSelectedItem(null); }} className="bg-red-500 text-white py-4 rounded-xl font-bold shadow-xl shadow-red-100 hover:bg-red-600 transition-all">Remove</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}