import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, Package } from 'lucide-react';
import { API_BASE_URL } from "../../../config.js";
import RatingDisplay from '../../../components/RatingDisplay.jsx';

// We only need one static image now for the "All Items" link or as a fallback
import AllImg from '../../../assets/categories/all.jpg'; 

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // 1. Fetch Trending Products
        const trendingRes = await fetch(`${API_BASE_URL}/api/Products/trending`);
        const trendingData = trendingRes.ok ? await trendingRes.json() : [];

        // 2. Fallback to generic products if no trending items
        if (trendingData.length === 0) {
          const productRes = await fetch(`${API_BASE_URL}/api/Products`);
          if (productRes.ok) {
            const allProducts = await productRes.json();
            setFeaturedProducts(allProducts.slice(0, 3));
          }
        } else {
          setFeaturedProducts(trendingData.slice(0, 3));
        }

        // 3. Fetch Categories (Now includes names AND imageUrls)
        const catRes = await fetch(`${API_BASE_URL}/api/Categories`);
        if (catRes.ok) {
          setCategories(await catRes.json());
        }

      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <div className="h-96 w-full flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" size={48} /></div>;
  }

  return (
    <div className="animate-fade-in w-full overflow-x-hidden min-h-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-20">

      {/* --- Featured / Trending Section --- */}
      <section className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {featuredProducts.some(p => p.isTrending) ? "Trending Now 🔥" : "Featured Products"}
        </h2>

        {featuredProducts.length === 0 ? (
          <div className="text-gray-500 italic">No products available yet. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/customer/product/${product.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100 group"
              >
                <div className="h-48 bg-gray-100 w-full flex items-center justify-center overflow-hidden relative">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <Package size={32} />
                      <span className="text-xs mt-1">No Image</span>
                    </div>
                  )}
                  {product.isTrending && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                      HOT
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-gray-800">ETB {product.price}</span>
                    <RatingDisplay productId={product.id} initialRating={product.averageRating || product.rating} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Category Tiles --- */}
      <section className="w-full py-8 bg-white border-y border-gray-50 my-4">
        <div className="container mx-auto px-6">
          <div className="w-full text-center mb-6">
            <h2 className="font-bold text-xl md:text-2xl text-gray-900">Browse Categories</h2>
          </div>

          <div className="flex overflow-x-auto space-x-4 md:space-x-6 hide-scrollbar pb-2">
            {/* Static 'All' Link */}
            <Link to="/shop" className="shrink-0 group">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 ring-2 ring-transparent group-hover:ring-purple-100">
                  <img src={AllImg} alt="All" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <p className="mt-3 text-sm font-bold text-center text-gray-700 uppercase tracking-widest group-hover:text-purple-600 transition-colors">All items</p>
              </div>
            </Link>

            {/* Dynamic Categories from DB */}
            {categories.map((cat) => (
              <Link to={`/collection/${cat.name.toLowerCase()}`} key={cat.id} className="shrink-0 group">
                <div className="relative">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 ring-2 ring-transparent group-hover:ring-purple-100">
                    <img
                      // Use the DB image URL, or fallback to the generic 'All' image if missing
                      src={cat.imageUrl || AllImg}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.src = AllImg; }} // Safety fallback if URL is broken
                    />
                  </div>
                  <p className="mt-3 text-sm font-bold text-center text-gray-700 uppercase tracking-widest capitalize group-hover:text-purple-600 transition-colors">
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;