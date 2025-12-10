import React from 'react';
import { Star } from 'lucide-react';
import { MOCK_REVIEWS } from '../data';

const CustomerProduct = ({ product, onNavigate }) => {
  if (!product) return null;

  return (
    <div className="container mx-auto px-6 py-8 w-screen ">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <span className="cursor-pointer hover:underline" onClick={() => onNavigate('dashboard')}>Home</span>
        <span>/</span>
        <span 
            className="cursor-pointer hover:underline" 
            onClick={() => onNavigate(product.category)}
        >
            {product.category}
        </span>
        <span>/</span>
        <span className="font-semibold text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 ">
        {/* Left: ProductImagesCarousel */}
        <div className="bg-white rounded-xl shadow-sm p-4 h-96 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400 text-lg">Product Image Carousel</span>
        </div>

        {/* Right: ProductDetails */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-800">{product.price}</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">In Stock</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Sold by</p>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 text-lg">{product.seller}</span>
              <div className="flex text-yellow-500 text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-gray-700">{product.rating}</span>
              </div>
            </div>
          </div>

          <div className="prose text-gray-700">
            <h3 className="font-semibold text-gray-900">Description</h3>
            <p>
              This is a detailed description of the handmade item, following the document source requirements.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <button className="px-6 py-3 rounded-md font-medium transition-colors duration-200 bg-gray-900 text-white hover:bg-gray-700">
                Order Now
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="px-6 py-3 rounded-md font-medium transition-colors duration-200 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50">
                Message Seller
              </button>
              <button className="px-6 py-3 rounded-md font-medium transition-colors duration-200 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50">
                Custom Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        <div className="space-y-6">
          {MOCK_REVIEWS.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">{review.user}</span>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerProduct;