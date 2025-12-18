import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#2734C2] text-white py-12 relative z-10">
      <div className="container mx-auto px-6 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-6">
          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Shop</h3>
            <div className="flex flex-col space-y-1 text-sm opacity-90">
              <button className="hover:opacity-100">Handmade Crochet</button>
              <button className="hover:opacity-100">Tote Bags</button>
              <button className="hover:opacity-100">Custom Orders</button>
              <button className="hover:opacity-100">Discounts</button>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">About</h3>
            <div className="flex flex-col space-y-1 text-sm opacity-90">
              <button className="hover:opacity-100">Artifex, Inc.</button>
              <button className="hover:opacity-100">Investors</button>
              <button className="hover:opacity-100">Careers</button>
              <button className="hover:opacity-100">Press</button>
              <button className="hover:opacity-100">Impact</button>
            </div>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Help</h3>
            <div className="flex flex-col space-y-1 text-sm opacity-90">
              <button className="hover:opacity-100">Help Center</button>
              <button className="hover:opacity-100">Privacy settings</button>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Connect</h3>
            <div className="flex flex-col space-y-1 text-sm opacity-90">
              <button className="hover:opacity-100">Contact Us</button>
              <button className="hover:opacity-100">Blog</button>
              <button className="hover:opacity-100">Socials</button>
            </div>
          </div>
        </div>

        <p className="text-sm opacity-80">© 2025 Artifex Marketplace</p>
      </div>
    </footer>
  );
};

export default Footer;
