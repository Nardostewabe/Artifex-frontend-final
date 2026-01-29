import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  MessageSquare,
  Star,
  BarChart2,
  Video,
  Plus,
  Check,
  X,
  ChevronRight,
  MoreHorizontal,
  DollarSign,
  Loader2,
  Store
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../../../config';
import { useAuth } from '../../../context/AuthContext';


const SellerDashboard = () => {
  const { token } = useAuth();
  const location = useLocation();

  // Real Data State
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Computed Stats
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: 'ETB 0.00', change: '--', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Active Orders', value: '0', change: '0 Pending', icon: Package, color: 'text-[#8b5cf6]', bg: 'bg-purple-50' },
    { label: 'Total Products', value: '0', change: '0 Low Stock', icon: ShoppingBag, color: 'text-[#0ea5e9]', bg: 'bg-blue-50' },
    { label: 'Completed Orders', value: '0', change: 'Lifetime', icon: Check, color: 'text-amber-500', bg: 'bg-amber-50' },
  ]);

  const [inventoryAlerts, setInventoryAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    const actualToken = token || localStorage.getItem("token");
    if (!actualToken) return;

    try {
      // 1. Fetch Products
      const prodResponse = await fetch(`${API_BASE_URL}/api/Products/my-products`, {
        headers: { 'Authorization': `Bearer ${actualToken}` }
      });

      let productsData = [];
      if (prodResponse.ok) {
        productsData = await prodResponse.json();
        setProducts(productsData);
      }

      // 2. Fetch Orders
      const orderResponse = await fetch(`${API_BASE_URL}/api/Order/seller-orders`, {
        headers: { 'Authorization': `Bearer ${actualToken}` }
      });

      let ordersData = [];
      if (orderResponse.ok) {
        ordersData = await orderResponse.json();
        setOrders(ordersData);
      }

      // 3. Fetch Profile
      const profileResponse = await fetch(`${API_BASE_URL}/api/Profile/seller`, {
        headers: { 'Authorization': `Bearer ${actualToken}` }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
      }

      calculateStats(productsData, ordersData);

    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (productsData, ordersData) => {
    // A. Product Stats
    const totalProducts = productsData.length;
    const lowStockItems = productsData.filter(p => p.stockQuantity < 5 && p.stockQuantity > 0);
    const outOfStockItems = productsData.filter(p => p.stockQuantity === 0);

    const alerts = [...lowStockItems, ...outOfStockItems]
      .sort((a, b) => a.stockQuantity - b.stockQuantity)
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        stock: p.stockQuantity,
        image: p.images && p.images.length > 0 ? p.images[0].url : null,
        id: p.id
      }));

    setInventoryAlerts(alerts);

    // B. Order Stats
    const totalRevenue = ordersData
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    const activeOrders = ordersData.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    const pendingCount = ordersData.filter(o => o.status === 'Pending').length;

    setStats(prevStats => {
      const newStats = [...prevStats];

      // Revenue
      newStats[0] = {
        ...newStats[0],
        value: `ETB ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: `${ordersData.length} Total`
      };

      // Active Orders
      newStats[1] = {
        ...newStats[1],
        value: activeOrders.toString(),
        change: `${pendingCount} New`
      };

      // Total Products
      newStats[2] = {
        ...newStats[2],
        value: totalProducts.toString(),
        change: `${lowStockItems.length} Low Stock`
      };

      // Completed Orders
      newStats[3] = {
        ...newStats[3],
        value: ordersData.filter(o => o.status === 'Completed' || o.status === 'Delivered').length.toString(),
        change: 'Lifetime'
      };

      return newStats;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-32 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* --- LEFT SIDEBAR Navigation --- */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 overflow-hidden border border-purple-50">
                {profile?.shopLogo ? (
                  <img src={profile.shopLogo} alt="Shop" className="h-full w-full object-cover" />
                ) : (
                  <Store size={20} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-gray-900 truncate" title={profile?.shopName}>{profile?.shopName || "My Shop"}</h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{profile?.category || "Merchant"}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { name: 'Overview', icon: BarChart2, path: '/seller-home' },
                { name: 'Orders', icon: Package, path: '/seller-orders' },
                { name: 'Inventory', icon: ShoppingBag, path: '/seller-inventory' },
                { name: 'Shop Profile', icon: Store, path: '/seller-profile' },
              ].map((item) => (
                <Link
                  to={item.path}
                  key={item.name}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === item.path
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon size={18} strokeWidth={2} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <Link to="/add-product">
                <button className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white py-3 rounded-xl text-xs uppercase hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                  <Plus size={16} />
                  <span>Add Product</span>
                </button>
              </Link>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 space-y-8">

          {/* 1. Header & Welcome */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Here is what’s happening with your shop today.</p>
            </div>
            <div className="flex sm:flex space-x-3">
              <Link to='/seller-shop' >
                <button className="px-6 py-2 bg-gray-900 border border-gray-900 rounded-xl text-xs font-bold uppercase text-white hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                  View Public Shop
                </button>
              </Link>
            </div>
          </div>

          {/* 2. Stats Grid (Performance Monitoring) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.label === 'Total Products' ? (stat.change.includes('0') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600') : 'bg-gray-100 text-gray-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-xs text-gray-500 font-medium uppercase mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* 3. Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Recent Orders</h3>
                <Link to="/seller-orders" className="text-xs text-purple-600 font-medium hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Order Details</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.length > 0 ? orders.slice(0, 5).map((order) => (
                      <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{order.productName}</div>
                          <div className="text-xs text-gray-500">#{order.orderId} • {order.buyerName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                                  'bg-green-100 text-green-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600 font-medium">
                          ETB {order.totalPrice?.toLocaleString() || "0.00"}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">No recent orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Inventory Alerts */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Low Stock Alert</h3>
                  <ShoppingBag size={18} className="text-gray-400" />
                </div>
                {inventoryAlerts.length > 0 ? (
                  <div className="space-y-4">
                    {inventoryAlerts.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate" title={item.name}>{item.name}</div>
                          <div className="text-xs text-red-500 font-medium">{item.stock === 0 ? 'Out of Stock' : `${item.stock} remaining`}</div>
                        </div>
                        <Link to={`/product/edit/${item.id}`}>
                          <button className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800">
                            Restock
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400 text-sm">
                    <Check size={24} className="mx-auto mb-2 text-green-500" />
                    <p>All stock levels are healthy.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;
