import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../../../config'; // Adjust path as needed
import { useAuth } from '../../../context/AuthContext'; // Adjust path

const SellerOrders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Orders on mount
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
                // Update UI instantly without reloading
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-32 pb-12 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h2 className="text-lg font-bold text-gray-900">Order Management</h2>
                    </div>

                    {orders.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <Package size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No orders yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Product</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {orders.map((order) => (
                                        <tr key={order.orderId} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden">
                                                        {order.productImage && <img src={order.productImage} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{order.productName}</div>
                                                        <div className="text-xs text-gray-500">Qty: {order.quantity} • ${order.totalPrice}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{order.buyerName}</div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    <MapPin size={10} /> {order.shippingAddress}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${order.status === 'Completed' || order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerOrders;