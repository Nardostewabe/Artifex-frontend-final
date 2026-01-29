import { useState, useEffect, useMemo } from "react";
import { Loader2, Search, Filter, X, Package, MapPin, Tag } from "lucide-react";
import { API_BASE_URL } from "../../../config";
import { useAuth } from "../../../context/AuthContext";

export default function ViewProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const [selectedProductId, setSelectedProductId] = useState(null);

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

  // 1. Extract Unique Categories from the List of Lists
  const allCategories = useMemo(() => {
    const flattened = products.flatMap(p => p.categories?.map(c => c.name) || []);
    return ["All", ...new Set(flattened)];
  }, [products]);

  // 2. Filter Logic (Updated for Many-to-Many)
  const filteredProducts = useMemo(() => {
    let results = [...products];

    if (search.trim() !== "") {
      results = results.filter(
        p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.seller?.shopName || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      // Check if the product's category list contains the selected category
      results = results.filter(p => p.categories?.some(c => c.name === category));
    }

    if (sort === "newest") {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "price-high") {
        results.sort((a, b) => b.price - a.price);
    }

    return results;
  }, [products, search, category, sort]);

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin inline text-[#3A3A6C]"/></div>;

  const handleDelete = async (productId) => {
    try {
      await fetch(`${API_BASE_URL}/api/ContentAdmin/delete-product/{productId}`, {
        method: "POST",
      });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold text-[#3A3A6C]">View & Filter Products</h1>

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
          {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="p-2 rounded-lg bg-[#F8F8FF] border-none outline-none font-medium text-slate-600"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price-high">Price (High-Low)</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="min-w-full text-left">
          <thead className="bg-[#E6E6FF] text-[#3A3A4A] font-bold text-sm">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Categories</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Action</th>
              <th className="p-4">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0].url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300">
                        <Package size={16}/>
                    </div>
                  )}
                  <div>
                      <span className="font-bold text-slate-700 block">{item.name}</span>
                      {/* Fixed Seller Access */}
                      <span className="text-xs text-slate-400">by {item.seller?.shopName || "Unknown Shop"}</span>
                  </div>
                </td>
                <td className="p-4">
                    {/* Fixed Category Display (Map the array) */}
                    <div className="flex flex-wrap gap-1">
                        {item.categories?.map(cat => (
                            <span key={cat.id} className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-[10px] font-bold uppercase">
                                {cat.name}
                            </span>
                        ))}
                    </div>
                </td>
                <td className="p-4 font-mono text-slate-600">${item.price}</td>
                <td className="p-4">
                    <span className={`text-xs font-bold ${item.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.stockQuantity > 0 ? `${item.stockQuantity} in stock` : 'Out of Stock'}
                    </span>
                </td>
                <td className="p-4">
                    <button 
                        onClick={() => setSelectedProductId(item.id)}
                        className="text-[#6C63FF] hover:text-[#5A52E0] font-bold text-xs underline"
                    >
                        View Details
                    </button>
                </td>
                <td className="p-4">
                    <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-[#6C63FF] hover:text-[#5A52E0] font-bold text-xs underline"
                    >
                        Delete
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductDetailModal 
        productId={selectedProductId} 
        onClose={() => setSelectedProductId(null)} 
      />
    </div>
  );
}

// ... (ProductDetailModal remains mostly the same, just ensure you use item.categories.map there too if you display category)
function ProductDetailModal({ productId, onClose }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!productId) return;
        setLoading(true);
        const fetchDetail = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/Products/${productId}`);
                if (res.ok) setProduct(await res.json());
            } catch(e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchDetail();
    }, [productId]);

    if (!productId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#F8FAFC]">
                    <h3 className="text-xl font-black text-[#3A3A6C] tracking-tight">Product Details</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400"><X size={20} /></button>
                </div>
                <div className="p-8 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#6C63FF]" size={32}/></div>
                    ) : product ? (
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-32 h-32 bg-slate-100 rounded-xl overflow-hidden">
                                    {product.images?.[0] ? <img src={product.images[0].url} className="w-full h-full object-cover"/> : <Package className="m-auto mt-10 text-slate-300"/>}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{product.name}</h2>
                                    <p className="text-emerald-600 font-black text-lg">${product.price}</p>
                                    <p className="text-sm text-slate-500 font-bold mt-1">
                                        Seller: <span className="text-[#3A3A6C]">{product.seller?.ShopName || "Unknown Shop"}</span>
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {product.categories?.map(c => (
                                            <span key={c.id} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">{c.name}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold border-b pb-2 mb-2">Description</h4>
                                <p className="text-slate-600 text-sm">{product.description}</p>
                            </div>
                        </div>
                    ) : <p>Failed to load.</p>}
                </div>
            </div>
        </div>
    );
}