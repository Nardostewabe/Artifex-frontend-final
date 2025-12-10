export default function DataTable({ columns, data }) {
  const badgeColors = {
    "Active": "bg-[#22C55E] text-white",
    "Suspended": "bg-[#EF4444] text-white",
    "Under Investigation": "bg-[#FACC15] text-black",
    "High": "bg-[#EF4444] text-white",
    "Medium": "bg-[#FACC15] text-black",
    "Low": "bg-[#E5E7EB] text-black",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#E9E9FF]">
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="bg-[#E6E6FF] text-[#2A2A4A] rounded-xl">
            {columns.map(col => (
              <th key={col} className="p-3 text-left font-semibold">{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="bg-white hover:bg-[#F8F8FF] transition rounded-xl shadow-sm">
              {columns.map(col => (
                <td key={col} className="p-3 text-[#2A2A4A]">
                  {badgeColors[row[col]] ? (
                    <span className={`px-3 py-1 rounded-full text-sm ${badgeColors[row[col]]}`}>
                      {row[col]}
                    </span>
                  ) : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}