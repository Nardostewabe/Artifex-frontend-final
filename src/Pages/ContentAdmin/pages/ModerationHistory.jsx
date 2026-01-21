export default function ModerationHistory() {
  const logs = [
    { action: "Approved Listing", date: "2025-01-05" },
    { action: "Removed Flagged Review", date: "2025-01-04" },
    { action: "Issued Warning", date: "2025-01-01" },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-[#3A3A6C]">Moderation History</h2>

      <div className="bg-white rounded-xl shadow divide-y">
        {logs.map((log, i) => (
          <div key={i} className="p-4 hover:bg-[#F0F2FF] transition">
            <p className="font-semibold text-[#3A3A6C]">{log.action}</p>
            <p className="text-sm text-gray-500">{log.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
