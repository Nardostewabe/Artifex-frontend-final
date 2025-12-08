import React from 'react';

const Shop = () => {
  return (
    <div className="pt-32 px-6 min-h-screen bg-white">
      <h1 className="text-4xl font-serif text-center mb-10">Shop All</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* We will fill this with products later */}
        <div className="h-64 bg-gray-100 rounded-lg"></div>
        <div className="h-64 bg-gray-100 rounded-lg"></div>
        <div className="h-64 bg-gray-100 rounded-lg"></div>
        <div className="h-64 bg-gray-100 rounded-lg"></div>
      </div>
    </div>
  );
};

export default Shop;