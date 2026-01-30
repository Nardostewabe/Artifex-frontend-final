import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ShoppingBag, Share2, Star, Flag, Heart, Store } from 'lucide-react';
import { API_BASE_URL } from "../../../config.js";
import { useAuth } from '../../../context/AuthContext.jsx';
import { useCart } from '../../../context/CartContext.jsx';
import ConfirmationModal from '../../../components/ConfirmationModal.jsx';
import ReportModal from '../../../components/ReportModal.jsx';
import ReviewSection from './ReviewSection.jsx';

const CustomerProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buying, setBuying] = useState(false);
  const [reviewRating, setReviewRating] = useState({ avg: 0, count: 0 });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    isAlert: false,
    onConfirm: null
  });

  const showModal = (config) => {
    setModalConfig({
      isOpen: true,
      confirmText: "Confirm",
      cancelText: "Cancel",
      ...config
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleRatingUpdate = (avg, count) => {
    setReviewRating({ avg, count });
  };

  // ✅ NEW: State to track which image is being shown
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/Products/${id}`);

        if (!response.ok) throw new Error("Product not found");

        const data = await response.json();
        setProduct(data);

        // ✅ NEW: Set the first image as active by default
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0].url);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();

    const checkFavoriteStatus = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/Favorites/check/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIsFavorited(data.isFavorited);
        }
      } catch (err) {
        console.error("Failed to check favorite status", err);
      }
    };
    if (id && token) checkFavoriteStatus();
  }, [id, token]);

  const toggleFavorite = async () => {
    if (!token) {
      showModal({
        title: "Login Required",
        message: "Please login to add items to your favorites.",
        type: "info",
        confirmText: "Login",
        onConfirm: () => navigate('/login')
      });
      return;
    }

    try {
      const method = isFavorited ? 'DELETE' : 'POST';
      const endpoint = isFavorited
        ? `${API_BASE_URL}/api/Favorites/${id}`
        : `${API_BASE_URL}/api/Favorites`;

      const body = isFavorited ? null : JSON.stringify({ productId: id });

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body
      });

      if (res.ok) {
        setIsFavorited(!isFavorited);
      }
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);
    showModal({
      title: "Added to Cart!",
      message: `${product.name} has been added to your cart.`,
      type: "success",
      confirmText: "Go to Cart",
      cancelText: "Continue Shopping",
      onConfirm: () => navigate('/cart')
    });
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" size={48} /></div>;
  if (error || !product) return <div className="text-center py-20 text-red-500 font-bold">{error || "Product not found"}</div>;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] dark:from-slate-900 dark:to-[#1e1b4b] pt-20 md:pt-24 pb-12 px-4 sm:px-6 transition-colors duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400">
        <span className="cursor-pointer hover:underline" onClick={() => navigate('/')}>Home</span>
        <span>/</span>
        <span className="cursor-pointer hover:underline" onClick={() => navigate('/shop')}>Shop</span>
        <span>/</span>
        <span className="font-semibold text-gray-900 dark:text-gray-200">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* ✅ LEFT SIDE: Image Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Large Image */}
          <div className="bg-gray-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm h-96 flex items-center justify-center border border-gray-200 dark:border-slate-700 transition-colors">
            {activeImage ? (
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
            ) : (
              <span className="text-gray-400 text-lg">No Image Available</span>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={img.id || index}
                  onClick={() => setActiveImage(img.url)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img.url
                    ? 'border-purple-600 ring-2 ring-purple-100'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-slate-600'
                    }`}
                >
                  <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">ETB {product.price}</span>
              {reviewRating.count > 0 && (
                <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                  <Star size={16} className="fill-purple-700 text-purple-700" />
                  <span className="font-bold">{reviewRating.avg}</span>
                  <span className="text-purple-400 text-xs text-nowrap">({reviewRating.count} reviews)</span>
                </div>
              )}
              {product.stockQuantity > 0 ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">In Stock ({product.stockQuantity})</span>
              ) : (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            {/* "Order Now" button removed as requested */}
            {/* Action Buttons */}
            <div className="mt-auto pt-6 border-t border-gray-100 flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity < 1}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-300 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 hover:shadow-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} />
                {product.stockQuantity < 1 ? "Sold Out" : "Add to Cart"}
              </button>
              <button className="p-4 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Share2 size={20} />
              </button>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="p-4 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Report this product"
              >
                <Flag size={20} />
              </button>
              <button
                onClick={toggleFavorite}
                className={`p-4 rounded-xl border transition-all ${isFavorited ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 dark:border-slate-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart size={20} className={isFavorited ? "fill-red-500" : ""} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate(`/seller-shop/${product.sellerId}`, { state: { seller: product.seller || product.Seller } })}
                className="px-6 py-3 rounded-xl font-bold border-2 border-purple-200 text-purple-700 hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
              >
                <Store size={18} /> View Shop
              </button>
            </div>
          </div>

          <div className="prose text-gray-700 dark:text-gray-300">
            <h3 className="font-semibold text-gray-900 dark:text-white">Description</h3>
            <p className="whitespace-pre-wrap">{product.description || "No description provided."}</p>
          </div>
        </div>
      </div>

      {/* ✅ NEW: Review Section */}
      {product && <ReviewSection productId={product.id} onRatingUpdate={handleRatingUpdate} />}

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        isAlert={modalConfig.isAlert}
      />

      {product && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          targetId={product.id}
          targetType="product"
          targetName={product.name}
          onSuccess={() => {
            showModal({
              title: "Report Submitted",
              message: "Thank you for flagging this product. Our team will review it shortly.",
              type: "success",
              isAlert: true
            });
          }}
        />
      )}
    </div>
  );
};

export default CustomerProduct;