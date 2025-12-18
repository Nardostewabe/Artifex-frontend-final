import React from 'react';
import { MOCK_PRODUCTS } from '../data';

const CustomerCollection = ({ category, onNavigate, onProductClick }) => {
  
  const filteredProducts = category === 'all' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === category);

  return (
    <div className="container mx-auto px-6 py-8 min-h-screen w-screen">
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <span className="cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
        <span>/</span>
        <span className="capitalize font-semibold text-gray-900">{category}</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">{category} Collection</h1>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => onProductClick(product)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            >
              <div className="h-48 bg-gray-200 w-full flex items-center justify-center text-gray-400">
                 Image
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-500 text-sm">By {product.seller}</p>
                <p className="font-bold text-gray-800 mt-2">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">No products found in this collection.</div>
      )}
    </div>
  );
};

export default CustomerCollection;