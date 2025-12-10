import React, { useState } from 'react';

// ✅ Navbar is removed because PublicLayout handles it

import CustomerDashboard from '../pages/views/CustomerDashboard';
import CustomerCollection from '../pages/views/CustomerCollection';
import CustomerProduct from '../pages/views/CustomerProduct';

const Home = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleNavigate = (viewName) => {
    setCurrentView(viewName);
    window.scrollTo(0, 0);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo(0, 0);
  };

  return (
    // ✅ Main Wrapper
    // 1. "w-full": Ensures it takes full width of the PublicLayout outlet
    // 2. "min-h-screen": Ensures gradient covers the whole screen
    // 3. "pt-20": Pushes content DOWN so it isn't hidden behind the Fixed Navbar
    <div className="w-screen min-h-screen pt-20 bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] font-sans text-gray-800 flex flex-col">
      
      {/* Content Area */}
      <div className="flex-grow">
        
        {/* VIEW: Dashboard (Default) */}
        {currentView === 'dashboard' && (
          <CustomerDashboard 
            onNavigate={handleNavigate} 
            onProductClick={handleProductClick} 
          />
        )}
        
        {/* VIEW: Collections */}
        {(currentView === 'knitwear' || currentView === 'crochet' || currentView === 'all') && (
          <CustomerCollection 
            category={currentView} 
            onNavigate={handleNavigate} 
            onProductClick={handleProductClick} 
          />
        )}

        {/* VIEW: Tutorials */}
        {currentView === 'tutorials' && (
           <div className="container mx-auto px-6 py-20 text-center">
             <h1 className="text-3xl font-bold text-gray-900">Tutorials & DIY</h1>
             <p className="text-gray-700 mt-4">Tutorial content lists go here.</p>
             <button 
                onClick={() => handleNavigate('dashboard')} 
                className="mt-8 bg-white border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-50 font-medium"
             >
                Back to Dashboard
             </button>
           </div>
        )}
        
        {/* VIEW: Product Details */}
        {currentView === 'product' && (
          <CustomerProduct 
            product={selectedProduct} 
            onNavigate={handleNavigate} 
          />
        )}
      </div>

      
    </div>
  );
};

export default Home;