import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Filter, Download, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../../../config';
import { useAuth } from '../../../context/AuthContext';
import DisputeModal from '../../../components/DisputeModal';

const SellerOrders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [disputeModalOpen, setDisputeModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/Order/seller-orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error("Failed to load orders", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/Order/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newStatus })
            });

            if (res.ok) {
                setOrders(prev => prev.map(order =>
                    order.orderId === orderId ? { ...order, status: newStatus } : order
                ));
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openDisputeModal = (orderId) => {
        setSelectedOrderId(orderId);
        setDisputeModalOpen(true);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

    return (
        <div className="min-h-screen w-full pt-32 pb-12 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Stats */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic mb-2">Order <span className="text-purple-600">Management</span></h1>
                    <p className="text-gray-500 font-medium italic">Track and manage your customer orders.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                                <Filter size={20} />
                            </button>
                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                                <Download size={20} />
                            </button>
                        </div>
                    </div>

                    {orders.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <Package size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No orders yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Order Details</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                        {order.productImage && <img src={order.productImage} alt={order.productName} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800">{order.productName}</div>
                                                        <div className="text-xs text-gray-500">Qty: {order.quantity}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                        {order.buyerName ? order.buyerName.charAt(0) : "?"}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-600">{order.buyerName || "Unknown Customer"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <Calendar size={14} />
                                                    {new Date(order.orderDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-800">
                                                ETB {order.totalPrice}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${order.status === 'Completed' || order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    order.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                                            'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right flex flex-col items-end gap-2">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-white focus:border-purple-500 outline-none cursor-pointer"
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                <button
                                                    onClick={() => openDisputeModal(order.orderId)}
                                                    className="text-[10px] font-bold text-red-500 hover:text-red-700 underline uppercase tracking-tighter"
                                                >
                                                    Report Dispute
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
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

export default SellerOrders;
