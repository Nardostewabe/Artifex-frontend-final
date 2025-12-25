import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, Loader2, Package } from 'lucide-react';
import { API_BASE_URL } from "../../../../config.js"; 

// --- Static Images for Categories ---
import knitwearImg from '../../../../assets/Categories/knitwear.jpg';
import crochetImg from '../../../../assets/Categories/crochet.jpg';
import woodworkImg from '../../../../assets/Categories/chair.jpg';
import jewleryImg from '../../../../assets/Categories/jewlery.jpg';
import printsImg from '../../../../assets/Categories/print.jpg';
import stickersImg from '../../../../assets/Categories/lin.jpg';
import ceramicsImg from '../../../../assets/Categories/ceramics.jpg';
import decorImg from '../../../../assets/Categories/home-decor.jpg';
import clothingImg from '../../../../assets/Categories/clothing.jpg';
import accessoriesImg from '../../../../assets/Categories/accessories.jpg';
import AllImg from '../../../../assets/Categories/all.jpg';

// Helper: Match DB Category Name -> Local Image
const getCategoryImage = (categoryName) => {
  if (!categoryName) return AllImg;
  const normalized = categoryName.toLowerCase().trim();
  const map = {
    'knitwear': knitwearImg,
    'crochet': crochetImg,
    'woodwork': woodworkImg,
    'jewelry': jewleryImg,
    'jewlery': jewleryImg,
    'art prints': printsImg,
    'stickers': stickersImg,
    'ceramics': ceramicsImg,
    'home decor': decorImg,
    'clothing': clothingImg,
    'accessories': accessoriesImg,
  };
  return map[normalized] || AllImg;
};

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

        // 3. Fetch Categories
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
    <div className="animate-fade-in w-full overflow-x-hidden w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] ">
      
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
                onClick={() => navigate(`/product/${product.id}`)}
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
                    <span className="font-bold text-gray-800">${product.price}</span>
                    <div className="flex items-center text-yellow-500 text-sm">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 text-gray-600">4.8</span> 
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Category Tiles --- */}
      <section className="w-screen py-12 shadow-sm my-6 bg-white">
        <div className="bg-white mb-10 lg:mb-30 px-6 py-8">
            <div className="w-full text-center py-6">
              <h1 className="font-bold text-sm md:text-2xl lg:text-3xl">Browse Categories</h1>
            </div>
            
            <div className="overflow-x-scroll space-x-4 grid grid-cols-3 md:grid-cols-6 lg:flex hide-scrollbar -mr-px">
              {/* Static 'All' Link */}
              <Link to="/shop">
                  <div className="shrink-0">
                    <div className="overflow-hidden rounded-lg">
                      <div className='cursor-pointer transition-transform hover:scale-105'>
                        <div className="w-50 h-50 md:w-80 md:h-80 lg:w-100 lg:h-100 bg-gray-100 rounded-lg overflow-hidden">
                          <img src={AllImg} alt="All" className="w-full h-full object-cover"/>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-lg font-medium text-left text-gray-800">All Categories</p>
                  </div>
              </Link>

              {/* Dynamic Categories */}
              {categories.map((cat) => (
                <Link to={`/shop?category=${cat.id}`} key={cat.id}>
                  <div className="shrink-0">
                    <div className="overflow-hidden rounded-lg">
                      <div className='cursor-pointer transition-transform hover:scale-105'>
                        <div className="w-50 h-50 md:w-80 md:h-80 lg:w-100 lg:h-100 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={getCategoryImage(cat.name)} 
                            alt={cat.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-lg font-medium text-left text-gray-800 capitalize">{cat.name}</p>
                  </div>
                </Link>
              ))}
            </div>
        </div>
      </section>

      {/* --- Tutorials Section --- */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Learn & DIY</h2>
        <div 
          onClick={() => navigate('/tutorials')}
          className="bg-white p-6 rounded-xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between cursor-pointer hover:bg-gray-50 border border-gray-100 transition-colors"
        >
          <div className="mb-4 sm:mb-0">
            <h3 className="text-xl font-bold text-gray-900">Tutorials</h3>
            <p className="text-gray-600 mt-1">Explore DIY guides, patterns, and learn how to make your own crafts.</p>
          </div>
          <button className="px-6 py-3 rounded-xl font-medium transition-colors duration-200 bg-gray-900 text-white hover:bg-gray-800 shadow-lg">
            View Tutorials
          </button>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;