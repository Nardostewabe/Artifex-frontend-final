import { useState, useMemo } from "react";

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Crochet Flower Bag",
    seller: "MimiCrafts",
    category: "Bags",
    status: "Pending",
    date: "2025-02-21",
    thumbnail: "https://via.placeholder.com/80"
  },
  {
    id: 2,
    name: "Soft Crochet Blanket",
    seller: "WoolHeaven",
    category: "Home Decor",
    status: "Approved",
    date: "2025-01-10",
    thumbnail: "https://via.placeholder.com/80"
  },
  {
    id: 3,
    name: "Mini Crochet Animals",
    seller: "CraftyJoy",
    category: "Toys",
    status: "Rejected",
    date: "2025-02-01",
    thumbnail: "https://via.placeholder.com/80"
  }
];

export default function ViewProducts() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");

  const filteredProducts = useMemo(() => {
    let results = [...DUMMY_PRODUCTS];

    // Search by product or seller
    if (search.trim() !== "") {
      results = results.filter(
        p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.seller.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "All") {
      results = results.filter(p => p.category === category);
    }

    // Filter by status
    if (status !== "All") {
      results = results.filter(p => p.status === status);
    }

    // Sorting
    if (sort === "newest") {
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === "oldest") {
      results.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === "az") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }

    return results;
  }, [search, category, status, sort]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">View & Filter Products</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or seller..."
          className="border p-2 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          <option>Bags</option>
          <option>Home Decor</option>
          <option>Toys</option>
        </select>

        <select
          className="border p-2 rounded-lg"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>

        <select
          className="border p-2 rounded-lg"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="az">Sort: A–Z</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Seller</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-12 h-12 rounded"
                  />
                  {item.name}
                </td>
                <td className="p-3">{item.seller}</td>
                <td className="p-3">{item.category}</td>
                <td
                  className={`p-3 font-semibold ${
                    item.status === "Pending"
                      ? "text-yellow-600"
                      : item.status === "Approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.status}
                </td>
                <td className="p-3">{item.date}</td>
                <td className="p-3">
                  <button className="text-blue-600 underline">
                    View Details
                  </button>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No products match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
