import React from 'react';
import { Star } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data';

const CustomerDashboard = ({ onNavigate, onProductClick }) => {
  return (
    <div className="animate-fade-in">
      
      {/* Featured Products */}
      <section className="container mx-auto px-6 py-8 w-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PRODUCTS.slice(0, 3).map((product) => (
            <div 
              key={product.id} 
              onClick={() => onProductClick(product)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100"
            >
              <div className="h-48 bg-gray-200 w-full flex items-center justify-center text-gray-400">
                Product Image
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-2">By {product.seller}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">{product.price}</span>
                  <div className="flex items-center text-yellow-500 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-gray-600">{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Category Tiles - Triggers Internal Navigation */}
      <section className="bg-white py-12 shadow-sm my-6">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div 
              onClick={() => onNavigate('knitwear')} 
              className="h-32 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-transparent hover:border-[#bfdbfe] cursor-pointer transition-colors"
            >
              <span className="text-xl font-bold text-gray-800">Knitwear</span>
            </div>
            
            <div 
              onClick={() => onNavigate('crochet')} 
              className="h-32 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-transparent hover:border-[#bfdbfe] cursor-pointer transition-colors"
            >
              <span className="text-xl font-bold text-gray-800">Crochet</span>
            </div>
            
            <div 
              onClick={() => onNavigate('all')} 
              className="h-32 rounded-lg bg-gray-100 flex items-center justify-center border-2 border-transparent hover:border-[#bfdbfe] cursor-pointer transition-colors"
            >
              <span className="text-xl font-bold text-gray-800">All Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorials Section */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Learn & DIY</h2>
        <div 
          onClick={() => onNavigate('tutorials')}
          className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-900">Tutorials</h3>
            <p className="text-gray-600">Explore DIY guides and patterns.</p>
          </div>
          <button className="px-6 py-3 rounded-md font-medium transition-colors duration-200 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50">
            View Tutorials
          </button>
        </div>
      </section>
    </div>
  );
};

export default CustomerDashboard;