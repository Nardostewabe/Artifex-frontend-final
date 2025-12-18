import React, { useState } from 'react';
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
  DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock Data to visualize the UI
const stats = [
  { label: 'Total Revenue', value: '$4,200', change: '+12%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Active Orders', value: '12', change: '4 Pending', icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Total Products', value: '48', change: '2 Low Stock', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Review Score', value: '4.8', change: '150 Reviews', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
];

const recentOrders = [
  { id: '#ORD-7721', product: 'Ceramic Vase Set', customer: 'Alice Freeman', date: '2 mins ago', total: '$120.00', status: 'Pending' },
  { id: '#ORD-7720', product: 'Handwoven Scarf', customer: 'Mark T.', date: '1 hour ago', total: '$45.00', status: 'Processing' },
  { id: '#ORD-7719', product: 'Leather Wallet', customer: 'Sarah Connor', date: '3 hours ago', total: '$85.00', status: 'Shipped' },
];

const inventoryAlerts = [
  { name: 'Blue Clay Mug', stock: 2, image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=100' },
  { name: 'Canvas Tote', stock: 0, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=100' },
];

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-20 md:pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* --- LEFT SIDEBAR Navigation --- */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-28">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                {/* Placeholder for Shop Logo */}
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" alt="Shop" className="h-full w-full object-cover"/>
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900">CraftedByMe</h2>
                <p className="text-xs text-gray-500">Seller Dashboard</p>
              </div>
            </div>

            <nav className="space-y-1">
              {[
                { name: 'Overview', icon: BarChart2 },
                { name: 'Orders', icon: Package },
                { name: 'Inventory', icon: ShoppingBag },
                { name: 'Messages', icon: MessageSquare },
                { name: 'Reviews', icon: Star },
                { name: 'Tutorials', icon: Video },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === item.name 
                      ? 'bg-purple-50 text-purple-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={18} strokeWidth={2} />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <Link to="/seller-home/add-product"> 
              <button className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
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
            <div className="hidden sm:flex space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                View Shop
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Settings
              </button>
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
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.label === 'Total Revenue' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 3. Recent Orders (Track Orders - Accept/Decline) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Recent Orders</h3>
                <button className="text-xs text-purple-600 font-medium hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 font-medium">Order Details</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Amount</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{order.product}</div>
                          <div className="text-xs text-gray-500">{order.id} • {order.customer}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-medium">
                          {order.total}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {order.status === 'Pending' ? (
                            <div className="flex justify-end gap-2">
                              <button title="Accept" className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                                <Check size={16} />
                              </button>
                              <button title="Decline" className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreHorizontal size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Right Column: Inventory & Reviews Highlights */}
            <div className="space-y-6">
              
              {/* Inventory Alert */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Low Stock Alert</h3>
                  <ShoppingBag size={18} className="text-gray-400" />
                </div>
                <div className="space-y-4">
                  {inventoryAlerts.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100"/>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-red-500 font-medium">{item.stock === 0 ? 'Out of Stock' : `${item.stock} remaining`}</div>
                      </div>
                      <button className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800">
                        Restock
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* DIY Tutorial Quick Action */}
              <div className="bg-purple-900 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden group cursor-pointer">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Video size={80} />
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-1">Upload Tutorial</h3>
                  <p className="text-purple-200 text-xs mb-4 max-w-[80%]">Share your craft process with customers to boost engagement.</p>
                  <div className="inline-flex items-center text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
                    Upload Video <ChevronRight size={14} className="ml-1"/>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;