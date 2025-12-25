import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx'; // Adjust path
import { API_BASE_URL } from "../../../config.js"; // Adjust path

import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Package, 
  DollarSign, 
  Edit3, 
  Trash2, 
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react';

const SellerShop = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Products on Mount
  useEffect(() => {
    fetchSellerProducts();
  }, []);

 const fetchSellerProducts = async () => {
    const actualToken = token || localStorage.getItem("token");
    if (!actualToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Products/my-products`, {
        headers: {
          'Authorization': `Bearer ${actualToken}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      
      // 👇 ADD THIS LINE TO DEBUG
      console.log("MY PRODUCTS DATA:", data); 
      
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Could not load your shop items.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this product?")) return;
    
    // Optimistic UI update (remove immediately)
    setProducts(products.filter(p => p.id !== id));

    const actualToken = token || localStorage.getItem("token");
    try {
        await fetch(`${API_BASE_URL}/api/Products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${actualToken}` }
        });
    } catch (err) {
        console.error("Failed to delete", err);
        // Revert on failure if needed
        fetchSellerProducts();
    }
  };

  // Filter products by search
const filteredProducts = products.filter(product => {
    const cats = product.categories || product.Categories || [];
    
    return product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           cats.some(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));
});

  if (loading) {
    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-purple-600" size={40} />
        </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-24 pb-12 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Shop</h1>
            <p className="text-sm text-gray-500">Manage your inventory and listings</p>
          </div>
          <button 
            onClick={() => navigate('/add-product')} 
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Stats / Overview (Optional) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">In Stock</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                    {products.filter(p => p.stockStatus === 'In Stock').length}
                </p>
            </div>
             {/* Add more stats as needed */}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm mb-6 flex gap-2">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search your products..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg outline-none text-sm text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <Filter size={18} />
            </button>
        </div>

        {error && (
             <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={18} /> {error}
            </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4 text-gray-300">
                    <Package size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="text-sm text-gray-500 mt-1">Try changing your search or add a new item.</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
                <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
                
                {/* Image Area */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                        <img 
                            src={product.images[0].url} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package size={32} />
                        </div>
                    )}
                    
                    {/* Floating Status Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded-md backdrop-blur-md 
                            ${product.stockStatus === 'In Stock' ? 'bg-green-500/90 text-white' : 
                              product.stockStatus === 'Out of Stock' ? 'bg-red-500/90 text-white' : 'bg-orange-500/90 text-white'}`}>
                            {product.stockStatus}
                        </span>
                    </div>

                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                         <button onClick={() => navigate(`/product/${product.id}`)} className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-800 transition-transform hover:scale-110" title="View">
                             <Eye size={18} />
                         </button>
                         <button  onClick={() => navigate(`/product/edit/${product.id}`)}  className="p-2 bg-white rounded-full hover:bg-gray-100 text-blue-600 transition-transform hover:scale-110" title="Edit">
                             <Edit3 size={18} />
                         </button>
                         <button onClick={() => handleDelete(product.id)} className="p-2 bg-white rounded-full hover:bg-red-50 text-red-500 transition-transform hover:scale-110" title="Delete">
                             <Trash2 size={18} />
                         </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-4 flex-1 flex flex-col">
                   <div className="flex justify-between items-start mb-2">
        <div className="flex flex-wrap gap-1">
            {(() => {
            const cats = product.categories || product.Categories || [];
            return (
                <>
                    {cats.slice(0, 2).map(cat => (
                        <span key={cat.id} className="text-[10px] font-bold text-purple-600 uppercase tracking-wide bg-purple-50 px-1.5 py-0.5 rounded">
                            {cat.name}
                        </span>
                    ))}
                    {cats.length > 2 && (
                        <span className="text-[10px] text-gray-400 py-0.5">+{cats.length - 2}</span>
                    )}
                </>
            );
        })()}
        </div>
    </div>

    <h3 className="font-bold text-gray-900 mb-1 truncate" title={product.name}>{product.name}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">{product.description}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <div className="flex items-center gap-1 text-gray-900 font-bold">
                            <DollarSign size={16} className="text-gray-400" />
                            {product.price}
                        </div>
                        <div className="text-xs text-gray-400">
                            Qty: {product.stockQuantity}
                        </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default SellerShop;