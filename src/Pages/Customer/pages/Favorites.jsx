import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2, Package, Trash2, ShoppingBag } from 'lucide-react';
import { API_BASE_URL } from '../../../config';
import { useAuth } from '../../../context/AuthContext';
import RatingDisplay from '../../../components/RatingDisplay';

const Favorites = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Assuming GET /api/Favorites returns an array of products
                const response = await fetch(`${API_BASE_URL}/api/Favorites`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setFavorites(data);
                } else {
                    throw new Error("Failed to load favorites");
                }
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [token]);

    const handleRemoveFavorite = async (e, productId) => {
        e.stopPropagation();
        try {
            const response = await fetch(`${API_BASE_URL}/api/Favorites/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setFavorites(favorites.filter(p => p.id !== productId));
            }
        } catch (err) {
            console.error("Failed to remove favorite", err);
        }
    };

    if (loading) return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-purple-600" size={40} />
        </div>
    );

    if (!token) return (
        <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500 pt-20">
            <Heart size={48} className="mb-4 text-gray-300" />
            <p className="text-xl font-medium mb-4">Please log in to see your favorites.</p>
            <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg"
            >
                Login Now
            </button>
        </div>
    );

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-32 pb-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <Heart className="text-red-500 fill-red-500" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
                        <p className="text-sm text-gray-500">Items you've saved for later</p>
                    </div>
                </div>

                {favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 shadow-sm">
                        <Package size={64} className="text-gray-300 mb-6" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-8 max-w-xs text-center">Start exploring our collection and save items you love!</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl"
                        >
                            Explore Shop
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/customer/product/${product.id}`)}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-gray-100 flex flex-col relative"
                            >
                                <button
                                    onClick={(e) => handleRemoveFavorite(e, product.id)}
                                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                    title="Remove from favorites"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="h-64 bg-gray-100 relative overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                        <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Package size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-0.5 rounded">
                                            Handcrafted
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-gray-900 font-bold text-lg">ETB {product.price}</span>
                                        <RatingDisplay productId={product.id} initialRating={product.averageRating} />
                                    </div>
                                    <button className="w-full mt-4 py-2.5 bg-gray-50 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-purple-600 hover:text-white transition-all border border-gray-100 group-hover:border-purple-600">
                                        <ShoppingBag size={18} /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;
