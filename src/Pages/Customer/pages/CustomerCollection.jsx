import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Package } from 'lucide-react';
import { API_BASE_URL } from '../../../config';
import RatingDisplay from '../../../components/RatingDisplay';

const CustomerCollection = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/Products`);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();

        // Filter by category name (case-insensitive)
        if (!category || category === 'all' || category === 'collections') {
          setProducts(data);
        } else {
          const filtered = data.filter(p => {
            const productCats = p.categories || p.Categories || [];
            return productCats.some(c => c.name.toLowerCase() === category.toLowerCase());
          });
          setProducts(filtered);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error loading collection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-32">
      <Loader2 className="animate-spin text-purple-600" size={48} />
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-6 py-32 text-center">
      <p className="text-red-500 mb-4">Error: {error}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-purple-600 text-white px-6 py-2 rounded-xl"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-32 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <span className="cursor-pointer hover:underline" onClick={() => navigate('/customer-home')}>Home</span>
          <span>/</span>
          <span className="capitalize font-semibold text-gray-900">{category || 'All'}</span>
        </div>

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">{category || 'All'} Collection</h1>
            <p className="text-gray-500 mt-1">{products.length} products found</p>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/customer/product/${product.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group border border-gray-100"
              >
                <div className="h-48 bg-gray-50 w-full flex items-center justify-center relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-300">
                      <Package size={40} />
                      <span className="text-xs mt-2">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate flex-1 pr-2">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-xs mb-3 italic">
                    By {product.sellerName || "Local Artisan"}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="font-bold text-gray-900">${product.price}</span>
                    <RatingDisplay productId={product.id} initialRating={product.averageRating || product.rating} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <Package size={64} className="mb-4 text-gray-300" />
            <h3 className="text-xl font-medium text-gray-900">No products found</h3>
            <p>We couldn't find any products in this collection.</p>
            <button
              onClick={() => navigate('/shop')}
              className="mt-6 text-purple-600 font-semibold hover:underline"
            >
              Browse all products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCollection;