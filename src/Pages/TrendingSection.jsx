import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../config.js"; 
import { ArrowRight, Package } from 'lucide-react';

const TrendingSection = () => {
  const navigate = useNavigate();
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Products/trending`);
        if (response.ok) {
          const data = await response.json();
          setTrendingProducts(data);
        }
      } catch (err) {
        console.error("Failed to load trending items", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) return null; // Don't show anything while loading (or show a spinner)
  if (trendingProducts.length === 0) return null; // Hide section if no items are trending

  return (
    <section className="py-12 px-4 sm:px-6 bg-orange-50/50">
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
                onClick={() => navigate(`/product/${product.id}`)}
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
                    <Fire size={10} className="fill-white"/> HOT
                 </div>
              </div>

              {/* Info */}
              <div>
                 <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                 <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-900 font-bold">${product.price}</span>
                    <span className="text-[10px] text-gray-400">{product.orderCount} sold</span>
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