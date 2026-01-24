import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../../config.js";
import { ArrowRight, Package, Flame as Fire } from 'lucide-react';
// Re-reading user code: "import { ArrowRight, Package } from 'lucide-react';" and usage "<Fire size={24} ... />"
// I will import Flame as Fire to match the usage.

const TrendingSection = ({ id }) => {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        // 1. Try fetching trending products
        const trendingResponse = await fetch(`${API_BASE_URL}/api/Products/trending`);

        let products = [];
        if (trendingResponse.ok) {
          products = await trendingResponse.json();
        }

        // 2. If no trending products, fetch available products as fallback
        if (!products || products.length === 0) {
          const allProductsResponse = await fetch(`${API_BASE_URL}/api/Products`);
          if (allProductsResponse.ok) {
            const allProducts = await allProductsResponse.json();
            // Take top 4 products
            products = allProducts.slice(0, 4);
          }
        }

        setTrendingProducts(products);

      } catch (err) {
        console.error("Failed to load trending items", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (!loading && trendingProducts.length === 0) return null;

  return (
    <section id={id} className="py-12 px-4 sm:px-6 bg-orange-50/50">
      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
              <Fire size={24} className="fill-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
              <p className="text-sm text-gray-500">Items that everyone is buying</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="hidden sm:flex items-center gap-1 text-orange-600 font-medium hover:gap-2 transition-all"
          >
            View All <ArrowRight size={16} />
          </button>
        </div>

        {/* Horizontal Scroll / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/customer/product/${product.id}`)}
              className="group bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3 relative">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><Package /></div>
                )}
                {/* Badge */}
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <Fire size={10} className="fill-white" /> HOT
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-900 font-bold">${product.price}</span>
                  <span className="text-[10px] text-gray-400">{product.orderCount || 0} sold</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrendingSection;