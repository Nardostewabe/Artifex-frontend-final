import React from 'react';

export default function DataTable({ columns, data }) {
  // Logic to determine badge colors for Status columns
  const getStatusBadge = (value) => {
    const status = String(value).toLowerCase();
    
    const styles = {
      active: "bg-green-100 text-green-700 border border-green-200",
      approved: "bg-green-100 text-green-700 border border-green-200",
      suspended: "bg-red-100 text-red-700 border border-red-200",
      rejected: "bg-red-100 text-red-700 border border-red-200",
      "under investigation": "bg-yellow-100 text-yellow-800 border border-yellow-200",
      pending: "bg-blue-100 text-blue-700 border border-blue-200",
      high: "bg-red-100 text-red-700",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-gray-100 text-gray-700",
    };

    return styles[status] || null;
  };

  return (
    <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-separate border-spacing-y-2">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider rounded-lg">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left font-semibold first:rounded-l-lg last:rounded-r-lg">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="space-y-2">
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i} className="bg-white hover:bg-purple-50 transition-colors duration-200 group">
                  {columns.map((col) => {
                    const cellValue = row[col];
                    const badgeClass = getStatusBadge(cellValue);

                    return (
                      <td key={`${i}-${col}`} className="px-4 py-3 text-slate-700 border-b border-slate-100 group-last:border-0">
                        {badgeClass ? (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
                            {cellValue}
                          </span>
                        ) : (
                          cellValue
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-slate-400">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}