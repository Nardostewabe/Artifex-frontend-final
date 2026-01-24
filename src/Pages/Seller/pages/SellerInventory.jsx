import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Plus, MoreVertical, Edit3, Trash2,
    AlertCircle, CheckCircle2, Package, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../config';
import { useAuth } from '../../../context/AuthContext';

const SellerInventory = () => {
    const { token } = useAuth();

    // State for Real Data
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // 1. FETCH DATA (Read)
    useEffect(() => {
        fetchProducts();
    }, [token]);

    const fetchProducts = async () => {
        try {
            const actualToken = token || localStorage.getItem("token");
            if (!actualToken) return;

            const response = await fetch(`${API_BASE_URL}/api/Products/my-products`, {
                headers: {
                    'Authorization': `Bearer ${actualToken}`
                }
            });

            if (!response.ok) throw new Error("Failed to load inventory");

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 2. DELETE PRODUCT
    const handleDelete = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const actualToken = token || localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/Products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${actualToken}`
                }
            });

            if (!response.ok) throw new Error("Failed to delete product");

            // Update UI immediately (Optimistic update)
            setProducts(products.filter(p => p.id !== productId));
        } catch (err) {
            alert("Error deleting: " + err.message);
        }
    };

    // 3. FILTER LOGIC
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper: Status Badge
    const StatusBadge = ({ quantity, statusLabel }) => {
        // Logic: Use backend status OR calculate based on quantity
        let status = statusLabel || "In Stock";
        if (quantity === 0) status = "Out of Stock";
        else if (quantity < 5) status = "Low Stock";

        const styles = {
            "In Stock": "bg-green-100 text-green-700",
            "Low Stock": "bg-yellow-100 text-yellow-800",
            "Out of Stock": "bg-red-100 text-red-700",
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
                {status}
            </span>
        );
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-purple-600" size={40} />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="p-8 text-center text-red-500 bg-white rounded-xl shadow-sm border border-red-100">
                <AlertCircle className="mx-auto mb-2" size={32} />
                <p>Error: {error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-32 pb-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your products, stock levels, and prices.</p>
                    </div>
                    <Link to="/add-product">
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl hover:bg-purple-700 transition-colors shadow-sm font-medium">
                            <Plus size={18} />
                            <span>Add Product</span>
                        </button>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data Display */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* VIEW A: Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Product Name</th>
                                    <th className="px-6 py-4 font-medium">Price</th>
                                    <th className="px-6 py-4 font-medium">Stock</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Image Handling */}
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                                                    {product.images && product.images.length > 0 ? (
                                                        <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={16} /></div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">${product.price.toFixed(2)}</td>

                                        {/* Note: Backend property is stockQuantity, not stock */}
                                        <td className="px-6 py-4 text-gray-600">{product.stockQuantity} units</td>

                                        <td className="px-6 py-4">
                                            <StatusBadge quantity={product.stockQuantity} statusLabel={product.stockStatus} />
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                                <Link to={`/product/edit/${product.id}`}>
                                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                                        <Edit3 size={16} />
                                                    </button>
                                                </Link>

                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* VIEW B: Mobile Cards */}
                    <div className="md:hidden divide-y divide-gray-100">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="p-4 flex items-start gap-4">
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    {product.images && product.images.length > 0 ? (
                                        <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={24} /></div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-900 truncate pr-2">{product.name}</h3>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                                            <span className="text-xs text-gray-500">{product.stockQuantity} in stock</span>
                                        </div>
                                        <StatusBadge quantity={product.stockQuantity} statusLabel={product.stockStatus} />
                                    </div>

                                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                                        <Link to={`/product/edit/${product.id}`} className="flex-1">
                                            <button className="w-full py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded-lg border border-gray-200">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="flex-1 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg border border-red-100">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {!loading && filteredProducts.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Package className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No Products Found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-1 mb-6">Try adjusting your search or add a new product.</p>
                            <Link to="/add-product">
                                <button className="bg-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-purple-700">
                                    Add Product
                                </button>
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default SellerInventory;
