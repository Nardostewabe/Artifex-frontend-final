export default function FlaggedContent() {
  return (
    <div className="space-y-8">

      <h2 className="text-3xl font-bold text-[#3A3A6C]">Flagged Content</h2>

      <div className="bg-white p-5 rounded-xl shadow space-y-4">
        <h3 className="text-xl font-semibold text-[#3A3A6C]">Flagged Product</h3>

        <p><strong>Reason:</strong> Inappropriate Image</p>
        <p><strong>Reporter:</strong> User123</p>

        <div className="flex gap-4 mt-3">
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Remove</button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">Escalate</button>
          <button className="bg-[#6C63FF] text-white px-4 py-2 rounded-lg">Warn User</button>
        </div>
      </div>

    </div>
  );
}
