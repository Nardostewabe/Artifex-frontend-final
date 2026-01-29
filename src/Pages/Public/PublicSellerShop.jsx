import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Phone, Tag, Store, Loader2, Package, Star, MessageSquare, Flag } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import RatingDisplay from '../../components/RatingDisplay';
import ReportModal from '../../components/ReportModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const PublicSellerShop = () => {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [profile, setProfile] = useState(location.state?.seller || null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    const showModal = (config) => setModalConfig({ isOpen: true, type: 'info', ...config });
    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    useEffect(() => {
        const fetchShopData = async () => {
            try {
                setLoading(true);

                // 1. Fetch Seller Profile (if not passed via state)
                if (!profile) {
                    // Try the user's new endpoint first
                    let profileRes = await fetch(`${API_BASE_URL}/api/Profile/seller/${sellerId}`);

                    // Fallback 1: Try without the ID (might be misconfigured on backend)
                    if (!profileRes.ok) {
                        profileRes = await fetch(`${API_BASE_URL}/api/Sellers/${sellerId}/profile`);
                    }

                    // Fallback 2: Try direct seller endpoint
                    if (!profileRes.ok) {
                        profileRes = await fetch(`${API_BASE_URL}/api/Sellers/${sellerId}`);
                    }

                    if (!profileRes.ok) {
                        const errorText = await profileRes.text();
                        console.error("Profile fetch failed:", errorText);
                        throw new Error(`Seller profile not found (${profileRes.status})`);
                    }

                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }

                // 2. Fetch Seller Products
                const productsRes = await fetch(`${API_BASE_URL}/api/Products/seller/${sellerId}`);
                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    setProducts(productsData);
                } else {
                    console.warn("Could not fetch seller products");
                }
            } catch (err) {
                console.error("Shop data fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (sellerId) fetchShopData();
    }, [sellerId, profile]);

    if (loading) return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-[#f8fafc]">
            <Loader2 className="animate-spin text-[#8b5cf6]" size={40} />
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <Store size={48} className="mb-4" />
            <p className="font-bold uppercase tracking-wider text-xs">{error || "Shop not found."}</p>
        </div>
    );

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-32 pb-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* SHOP PROFILE SECTION (Inspired by SellerProfile.jsx) */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-40 bg-gradient-to-r from-[#f3e8ff] to-[#e0f2fe] relative border-b border-purple-100">
                        <div className="absolute -bottom-10 left-8">
                            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-xl overflow-hidden bg-purple-50 border border-purple-100 flex items-center justify-center">
                                    {(profile.shopLogo || profile.ShopLogo) ? (
                                        <img src={profile.shopLogo || profile.ShopLogo} alt={profile.shopName || profile.ShopName} className="w-full h-full object-cover" />
                                    ) : (
                                        <Store size={32} className="text-purple-600" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 px-8 pb-8 flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{profile.shopName || profile.ShopName}</h1>
                                <p className="text-sm text-purple-600 font-bold uppercase tracking-wide">
                                    {profile.category || profile.Category || "General Crafter"}
                                </p>
                            </div>
                            <p className="text-gray-600 leading-relaxed max-w-2xl">
                                {profile.description || profile.Description || "Welcome to our shop! We take pride in our handcrafted creations."}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-medium pt-2">
                                {(profile.address || profile.location || profile.Address || profile.Location) && (
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        <MapPin size={16} className="text-purple-400" />
                                        {profile.address || profile.location || profile.Address || profile.Location}
                                    </div>
                                )}
                                {(profile.contactNumber || profile.ContactNumber) && (
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                        <Phone size={16} className="text-purple-400" />
                                        {profile.contactNumber || profile.ContactNumber}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-6 py-3 bg-[#8b5cf6] text-white rounded-xl font-bold hover:bg-[#7c3aed] transition-all shadow-lg shadow-purple-200">
                                <MessageSquare size={18} /> Message Seller
                            </button>
                            <button
                                onClick={() => setIsReportModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100"
                                title="Report Seller"
                            >
                                <Flag size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* PRODUCTS SECTION */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Package className="text-purple-600" /> Shop Catalog
                    </h2>

                    {products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
                            <Package size={48} className="text-gray-200 mb-4" />
                            <p className="text-gray-400 font-medium">No products currently listed.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/customer/product/${product.id}`)}
                                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border border-gray-100 flex flex-col"
                                >
                                    <div className="h-64 bg-gray-100 relative overflow-hidden">
                                        {product.images && product.images.length > 0 ? (
                                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Package size={32} />
                                            </div>
                                        )}
                                        {product.isTrending && (
                                            <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                                HOT
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="text-gray-900 font-bold text-lg">ETB {product.price}</span>
                                            <RatingDisplay productId={product.id} initialRating={product.averageRating} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                isAlert={true}
            />

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                targetId={sellerId}
                targetType="seller"
                targetName={profile.shopName || profile.ShopName}
                onSuccess={() => {
                    showModal({
                        title: "Report Submitted",
                        message: "Thank you for flagging this shop. Our team will review it shortly.",
                        type: "success"
                    });
                }}
            />
        </div>
    );
};

export default PublicSellerShop;
