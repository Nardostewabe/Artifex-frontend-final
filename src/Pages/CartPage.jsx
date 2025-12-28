import React from 'react';
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import { useState } from 'react';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();

    const total = getCartTotal();
    const [isProcessing, setIsProcessing] = useState(false);

    // Modal State
    const [modalConfig, setModalConfig] = React.useState({
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

   const handleCheckout = () => {
        if (!token) {
            showModal({
                title: "Login Required",
                message: "You must be logged in to checkout.",
                type: "warning",
                isAlert: true,
                onConfirm: () => navigate('/login')
            });
            return;
        }

        // 1. Pre-check Stock (Frontend Side)
        const outOfStockItems = cartItems.filter(item => item.quantity > item.stockQuantity);
        if (outOfStockItems.length > 0) {
            const itemNames = outOfStockItems.map(i => i.name).join(", ");
            showModal({
                title: "Stock Issue",
                message: `The following items have insufficient stock: ${itemNames}. Please adjust quantities.`,
                type: "warning",
                isAlert: true
            });
            return;
        }

        // 2. Confirm & Pay
        showModal({
            title: "Confirm Checkout",
            message: `Proceed to payment for $${total.toFixed(2)}?`,
            type: "info",
            confirmText: "Pay Now",
            onConfirm: async () => {
                // CLOSE MODAL FIRST to prevent stacking
                closeModal(); 
                
                try {
                    setIsProcessing(true);

                    // Prepare payload matching CheckoutDto
                    const payload = {
                        items: cartItems.map(item => ({
                            productId: item.id,
                            quantity: item.quantity
                        }))
                    };

                    const response = await fetch(`${API_BASE_URL}/api/Order/checkout`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(payload)
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || "Checkout failed.");
                    }

                    // Success!
                    showModal({
                        title: "Order Success!",
                        message: "Thank you! Your order has been placed successfully.",
                        type: "success",
                        isAlert: true,
                        onConfirm: () => {
                            clearCart();
                            navigate('/shop');
                        }
                    });

                } catch (err) {
                    showModal({
                        title: "Checkout Failed",
                        message: err.message,
                        type: "error",
                        isAlert: true
                    });
                } finally {
                    setIsProcessing(false);
                }
            }
        });
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] flex flex-col items-center justify-center pt-24 px-4">
                <ShoppingBag size={64} className="text-gray-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">Looks like you haven't added anything yet.</p>
                <button
                    onClick={() => navigate('/shop')}
                    className="bg-blue-300 text-blue-900 px-8 py-3 rounded-full hover:bg-blue-400 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-32 pb-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
                >
                    <ArrowLeft size={20} /> Continue Shopping
                </button>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.images && item.images.length > 0 ? (
                                            <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <ShoppingBag size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{item.name}</h3>
                                                <p className="text-sm text-gray-500">${item.price}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-400 hover:text-red-500 p-1"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-50 border-r border-gray-200"
                                                >-</button>
                                                <span className="px-3 py-1 text-gray-900 font-medium min-w-[2.5rem] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-50 border-l border-gray-200"
                                                >+</button>
                                            </div>
                                            <span className="text-gray-900 font-bold ml-auto">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4"></div>
                                <div className="flex justify-between text-gray-900 font-bold text-lg">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                className="w-full bg-purple-300 text-purple-900 py-4 rounded-xl font-bold hover:bg-purple-400 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 mb-4"
                                onClick={handleCheckout}
                            >
                                Checkout
                            </button>
                            <p className="text-xs text-center text-gray-400">
                                Taxes and shipping calculated at checkout.
                            </p>
                        </div>
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

export default CartPage;
