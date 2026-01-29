import { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "../../../config";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/Products`);
        if (res.ok) setProducts(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      (p.name.toLowerCase().includes(search.toLowerCase()) || 
       (p.seller?.shopName || "").toLowerCase().includes(search.toLowerCase())) &&
      (filterCategory === "All" || p.category === filterCategory)
    );
  }, [products, search, filterCategory]);

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline text-[#3A3A6C]"/></div>;

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
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0].url} className="w-12 h-12 rounded-lg object-cover shadow-sm" alt={p.name} />
                  ) : (
                    <div className="w-12 h-12 bg-slate-100 rounded-lg"></div>
                  )}
                </td>
                <td className="p-2 font-bold">{p.name}</td>
                <td className="p-2">{p.seller?.shopName || "Unknown"}</td>
                <td className="p-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="p-2">
                    <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs font-bold">{p.category}</span>
                </td>
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