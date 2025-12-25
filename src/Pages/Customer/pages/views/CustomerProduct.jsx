import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from "../../../../config.js";
import { useAuth } from '../../../../context/AuthContext.jsx';
import ConfirmationModal from '../../../../components/ConfirmationModal';

const CustomerProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buying, setBuying] = useState(false);

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
  }, [id]);

  const handleOrder = () => {
    const actualToken = token || localStorage.getItem("token");
    if (!actualToken) {
      showModal({
        title: "Login Required",
        message: "Please log in to purchase items.",
        type: "warning",
        confirmText: "Login",
        isAlert: true,
        onConfirm: () => navigate('/login')
      });
      return;
    }

    showModal({
      title: "Confirm Purchase",
      message: `Are you sure you want to purchase this item for $${product.price}?`,
      type: "info",
      confirmText: "Purchase",
      onConfirm: () => processOrder(actualToken)
    });
  };

  const processOrder = async (actualToken) => {
    closeModal();
    setBuying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/Products/${id}/buy`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${actualToken}` }
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Purchase failed");

      showModal({
        title: "Order Placed",
        message: "Order placed successfully! 🎉",
        type: "success",
        isAlert: true
      });

      setProduct(prev => ({
        ...prev,
        stockQuantity: result.remainingStock,
        isTrending: result.isTrending
      }));

    } catch (err) {
      showModal({
        title: "Purchase Failed",
        message: err.message,
        type: "danger",
        isAlert: true
      });
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" size={48} /></div>;
  if (error || !product) return <div className="text-center py-20 text-red-500 font-bold">{error || "Product not found"}</div>;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-20 md:pt-24 pb-12 px-4 sm:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <span className="cursor-pointer hover:underline" onClick={() => navigate('/')}>Home</span>
        <span>/</span>
        <span className="cursor-pointer hover:underline" onClick={() => navigate('/shop')}>Shop</span>
        <span>/</span>
        <span className="font-semibold text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* ✅ LEFT SIDE: Image Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main Large Image */}
          <div className="bg-gray-100 rounded-xl overflow-hidden shadow-sm h-96 flex items-center justify-center border border-gray-200">
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
                    : 'border-transparent hover:border-gray-300'
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-800">${product.price}</span>
              {product.stockQuantity > 0 ? (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">In Stock ({product.stockQuantity})</span>
              ) : (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleOrder}
              disabled={buying || product.stockQuantity < 1}
              className="px-6 py-3 rounded-md font-medium transition-colors duration-200 bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {buying ? <Loader2 className="animate-spin" size={20} /> : (product.stockQuantity < 1 ? "Sold Out" : "Order Now")}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="px-6 py-3 rounded-md font-medium border border-gray-300 text-gray-800 hover:bg-gray-50">Message Seller</button>
            </div>
          </div>

          <div className="prose text-gray-700">
            <h3 className="font-semibold text-gray-900">Description</h3>
            <p className="whitespace-pre-wrap">{product.description || "No description provided."}</p>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default CustomerProduct;