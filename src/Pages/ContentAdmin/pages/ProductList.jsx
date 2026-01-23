import { useState, useMemo } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([
    { id: 1, name: "Crochet Flower", seller: "AnnaDesigns", category: "Home Decor", status: "Available", date: "2025-01-03", img: "https://via.placeholder.com/60" },
    { id: 2, name: "Crochet Bag", seller: "LilyCrafts", category: "Bags", status: "Available", date: "2025-02-11", img: "https://via.placeholder.com/60" },
    { id: 3, name: "Mini Crochet Bear", seller: "CraftJoy", category: "Toys", status: "Out of Stock", date: "2025-02-18", img: "https://via.placeholder.com/60" },
  ]);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.seller.toLowerCase().includes(search.toLowerCase())) &&
      (filterCategory === "All" || p.category === filterCategory)
    );
  }, [products, search, filterCategory]);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-[#3A3A6C]">Product List</h2>

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search product or seller..."
          className="flex-1 p-2 rounded-xl border border-gray-200 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B18AFF]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 rounded-xl border border-gray-200 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B18AFF]"
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg border border-gray-200 text-sm">
          <thead className="bg-[#E6E6FF] text-[#3A3A4A] font-medium">
            <tr>
              <th className="p-3 text-left">Thumbnail</th>
              <th className="p-3 text-left">Product Name</th>
              <th className="p-3 text-left">Seller</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id} className="border-t hover:bg-[#F5F5FF] transition cursor-pointer">
                <td className="p-2">
                  <img src={p.img} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt={p.name} />
                </td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.seller}</td>
                <td className="p-2">{p.date}</td>
                <td className="p-2">{p.category}</td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400 font-medium">No products match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
