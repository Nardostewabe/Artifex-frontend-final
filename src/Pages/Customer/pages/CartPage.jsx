import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { API_BASE_URL } from '../../../config';
import { Trash2, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react'; // Added Loader2
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../../components/ConfirmationModal';
import { recordPurchase } from '../../../services/purchaseService';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    // ✅ Extract 'user' to get email/name for Chapa
    const { token, user } = useAuth();
    const navigate = useNavigate();

    const total = getCartTotal();
    // ✅ Calculate the 50% Split
    const depositAmount = total / 2;

    const [isProcessing, setIsProcessing] = useState(false);

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

        // 1. Pre-check Stock
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

        // 2. Confirm & Pay (Updated for 50% Logic)
        showModal({
            title: "Secure Checkout",
            // ✅ Updated Message to inform user about the split payment
            message: `Total Cart Value: ETB ${total.toLocaleString()}\n\nPay 50% (ETB ${depositAmount.toLocaleString()}) now via Chapa?\nThe remaining balance will be collected upon delivery.`,
            type: "info",
            confirmText: isProcessing ? "Processing..." : `Pay ETB ${depositAmount.toLocaleString()}`,
            onConfirm: async () => {
                closeModal(); // Close modal immediately to avoid UI locking

                try {
                    setIsProcessing(true);

                    // --- STEP A: Create Order in Backend (Reserve Stock) ---
                    const orderPayload = {
                        items: cartItems.map(item => ({
                            productId: item.id,
                            quantity: item.quantity
                        }))
                    };

                    // We create the order first to ensure stock is reserved
                    const orderResponse = await fetch(`${API_BASE_URL}/api/Order/checkout`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(orderPayload)
                    });

                    if (!orderResponse.ok) {
                        const errorData = await orderResponse.json();
                        throw new Error(errorData.message || "Failed to create order.");
                    }

                    // --- STEP B: Initialize Payment for 50% Amount ---
                    const paymentResponse = await fetch(`${API_BASE_URL}/api/Payment/initialize`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            amount: depositAmount, // ✅ Only paying half
                            email: user?.email || "customer@artifex.com",
                            firstName: user?.username || "Valued",
                            lastName: "Customer"
                        })
                    });

                    const paymentData = await paymentResponse.json();

                    if (!paymentResponse.ok) {
                        throw new Error(paymentData.message || "Payment initialization failed.");
                    }

                    // --- STEP C: Record Purchase & Redirect ---
                    await recordPurchase(cartItems.map(item => item.id));

                    // Clear cart locally since order is created in DB
                    clearCart();

                    // ✅ ROUTING: Redirect to Chapa
                    if (paymentData.checkoutUrl) {
                        window.location.href = paymentData.checkoutUrl;
                    } else {
                        throw new Error("Invalid payment URL received.");
                    }

                } catch (err) {
                    console.error("Checkout Error:", err);
                    setIsProcessing(false); // Stop loading only on error
                    showModal({
                        title: "Checkout Failed",
                        message: err.message || "Something went wrong. Please try again.",
                        type: "error",
                        isAlert: true
                    });
                }
                // Note: We don't set isProcessing(false) on success because we are redirecting away
            }
        });
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] flex flex-col items-center justify-center pt-24 px-4">
                <ShoppingBag size={64} className="text-gray-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <button onClick={() => navigate('/shop')} className="bg-blue-300 text-blue-900 px-8 py-3 rounded-full hover:bg-blue-400 transition-colors font-medium shadow-sm hover:shadow-md mt-4">
                    Start Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] dark:from-slate-900 dark:to-[#1e1b4b] pt-32 pb-12 px-4 sm:px-6 relative transition-colors duration-500">

            {/* Full Screen Loader for Redirection */}
            {isProcessing && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <Loader2 className="w-16 h-16 text-purple-600 animate-spin mb-4" />
                    <h2 className="text-xl font-bold text-gray-800">Redirecting to Chapa...</h2>
                    <p className="text-gray-500">Please do not close this window.</p>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8">
                    <ArrowLeft size={20} /> Continue Shopping
                </button>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Items List (Same as before) */}
                    <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
                        <div className="p-6 space-y-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100 dark:border-slate-700 last:border-0">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.images?.[0] ? <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400"><ShoppingBag size={24} /></div>}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{item.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">ETB {item.price}</p>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-500 p-1"><Trash2 size={18} /></button>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center border border-gray-200 dark:border-slate-600 rounded-lg">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border-r border-gray-200 dark:border-slate-600">-</button>
                                                <span className="px-3 py-1 text-gray-900 dark:text-white font-medium min-w-[2.5rem] text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border-l border-gray-200 dark:border-slate-600">+</button>
                                            </div>
                                            <span className="text-gray-900 dark:text-white font-bold ml-auto">ETB {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 sticky top-24 transition-colors">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Payment Details</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>Subtotal</span>
                                    <span>ETB {total.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-gray-100 my-4"></div>

                                {/* 50% Split Visualization */}
                                <div className="flex justify-between text-purple-600 font-bold">
                                    <span>Due Now (50%)</span>
                                    <span>ETB {depositAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Due on Delivery</span>
                                    <span>ETB {depositAmount.toLocaleString()}</span>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-slate-700 my-4"></div>
                                <div className="flex justify-between text-gray-900 dark:text-white font-bold text-lg">
                                    <span>Total</span>
                                    <span>ETB {total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 mb-4 disabled:opacity-50"
                                onClick={handleCheckout}
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Processing..." : "Pay 50% & Checkout"}
                            </button>
                            <p className="text-xs text-center text-gray-400">
                                You will be redirected to Chapa to complete the down payment.
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