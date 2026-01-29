import React, { useState, useEffect } from 'react';
import { Package, Clock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../../../config';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import DisputeModal from '../../../components/DisputeModal';

const CustomerOrders = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [disputeModalOpen, setDisputeModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/api/Order/customer-orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setOrders(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openDisputeModal = (orderId) => {
        setSelectedOrderId(orderId);
        setDisputeModalOpen(true);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff]">
            <Loader2 className="animate-spin text-purple-600" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-32 pb-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-bold italic">
                    <ArrowLeft size={18} /> Back
                </button>

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">My <span className="text-purple-600">Orders</span></h1>
                        <p className="text-gray-500 font-medium italic">Track your purchases and manage disputes.</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-md p-20 rounded-[2.5rem] border border-white/50 text-center shadow-xl shadow-purple-900/5">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest italic">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => navigate("/shop")}
                            className="mt-6 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-all"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.orderId} className="bg-white rounded-3xl p-6 shadow-sm border border-white hover:shadow-md transition-all flex flex-col md:flex-row gap-6">
                                <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img src={order.productImage} alt={order.productName} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{order.productName}</h3>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Sold by {order.sellerName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-gray-900">ETB {order.totalPrice}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">Qty: {order.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            <span className="text-xs font-bold text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'Completed' || order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                            order.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <button
                                            onClick={() => openDisputeModal(order.orderId)}
                                            className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <AlertCircle size={14} /> Report Dispute
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DisputeModal
                isOpen={disputeModalOpen}
                onClose={() => setDisputeModalOpen(false)}
                orderId={selectedOrderId}
                onSuccess={() => alert("Dispute submitted successfully to admins.")}
            />
        </div>
    );
};

export default CustomerOrders;
