import { useState, useEffect, useMemo } from "react";
import { Loader2, Search, Filter } from "lucide-react";
import { API_BASE_URL } from "../../../config";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  // 1. Fetch Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use your public endpoint
        const res = await fetch(`${API_BASE_URL}/api/Products`); 
        if (res.ok) {
            setProducts(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Client-Side Filtering (Efficient for < 1000 items)
  const filteredProducts = useMemo(() => {
    let results = [...products];

    if (search.trim() !== "") {
      results = results.filter(
        p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (category !== "All") {
      results = results.filter(p => p.category === category);
    }

    // Sort
    if (sort === "newest") {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "az") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "price-high") {
        results.sort((a, b) => b.price - a.price);
    }

    return results;
  }, [products, search, category, sort]);

  // Extract unique categories dynamically
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-[#3A3A6C]">View & Filter Products</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={16} />
            <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-9 p-2 rounded-lg bg-[#F8F8FF] border-none outline-none font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
        </div>

        <select
          className="p-2 rounded-lg bg-[#F8F8FF] border-none outline-none font-medium text-slate-600"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="p-2 rounded-lg bg-[#F8F8FF] border-none outline-none font-medium text-slate-600"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="az">Name (A-Z)</option>
          <option value="price-high">Price (High-Low)</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center p-12 text-slate-400"><Loader2 className="animate-spin inline"/></div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
            <table className="min-w-full text-left">
            <thead className="bg-[#E6E6FF] text-[#3A3A4A] font-bold text-sm">
                <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Date</th>
                <th className="p-4">Stock</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                    {item.images && item.images.length > 0 ? (
                        <img src={item.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                    )}
                    <span className="font-bold text-slate-700">{item.name}</span>
                    </td>
                    <td className="p-4"><span className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs font-bold uppercase">{item.category}</span></td>
                    <td className="p-4 font-mono text-slate-600">ETB{item.price}</td>
                    <td className="p-4 text-xs text-slate-400 font-bold">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                        <span className={`text-xs font-bold ${item.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.stockQuantity > 0 ? `${item.stockQuantity} in stock` : 'Out of Stock'}
                        </span>
                    </td>
                </tr>
                ))}
                {filteredProducts.length === 0 && (
                <tr><td colSpan="5" className="text-center p-8 text-slate-400 italic">No products found.</td></tr>
                )}
            </tbody>
            </table>
        </div>
      )}
    </div>
  );
}