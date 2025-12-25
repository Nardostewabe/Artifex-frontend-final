import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Loader2, Package, Search } from 'lucide-react';
import { API_BASE_URL } from "../config.js"; 

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [catRes, prodRes] = await Promise.all([
            fetch(`${API_BASE_URL}/api/Categories`),
            fetch(`${API_BASE_URL}/api/Products`)
        ]);

        if (catRes.ok) setCategories(await catRes.json());
        if (prodRes.ok) {
            const prodData = await prodRes.json();
            setProducts(prodData);
            setFilteredProducts(prodData);
        }
      } catch (err) {
        console.error("Failed to load shop data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Handle Filtering
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const categoryId = categoryParam ? parseInt(categoryParam) : 'all';
    
    setSelectedCategoryId(categoryId);
    applyFilters(categoryId, searchTerm, products);

  }, [searchParams, products, searchTerm]);

  const applyFilters = (catId, search, allProducts) => {
    let result = allProducts;

    if (catId !== 'all') {
      result = result.filter(product => {
        const productCats = product.categories || product.Categories || [];
        return productCats.some(c => c.id === catId);
      });
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerSearch));
    }

    setFilteredProducts(result);
  };

  const handleCategoryClick = (id) => {
    if (id === 'all') setSearchParams({});
    else setSearchParams({ category: id });
  };

  if (isLoading) return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" size={48} /></div>;

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900">Shop Collection</h1>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:border-purple-500 shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={20} className="text-gray-500" />
                <h3 className="font-bold text-gray-900">Categories</h3>
              </div>
              <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                <button
                    onClick={() => handleCategoryClick('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-left transition-colors whitespace-nowrap ${selectedCategoryId === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                    All Products
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-left transition-colors whitespace-nowrap ${selectedCategoryId === cat.id ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                        {cat.name}
                    </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Package size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No products found.</p>
                    <button onClick={() => handleCategoryClick('all')} className="mt-4 text-purple-600 hover:underline">Clear Filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-100">
                            <div className="h-64 bg-gray-100 relative overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={32}/></div>
                                )}
                                {product.isTrending && <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">HOT</div>}
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">{product.name}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-900 font-medium">${product.price}</span>
                                    <span className="text-xs text-gray-400">View Details</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;