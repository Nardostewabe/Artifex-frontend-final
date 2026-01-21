export default function Tutorials() {
  return (
    <div className="space-y-8">

      <h2 className="text-3xl font-bold text-[#3A3A6C]">DIY Tutorials</h2>

      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-semibold text-xl text-[#3A3A6C]">
          Crochet Bag Tutorial
        </h3>
        <p className="mt-2"><strong>Seller:</strong> CraftByLina</p>
        <p><strong>Description:</strong> Step-by-step crochet guide.</p>

        <div className="flex gap-4 mt-4">
          <button className="bg-[#6C63FF] text-white px-4 py-2 rounded-lg">Approve</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Reject</button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">Flag</button>
        </div>
      </div>

    </div>
  );
}
