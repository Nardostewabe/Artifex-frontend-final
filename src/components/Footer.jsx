import React from 'react';
import { Facebook, Instagram, Twitter, Mail, ArrowRight } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    {
      title: "Shop",
      links: ["Handmade Crochet", "Tote Bags", "Custom Orders", "Discounts"]
    },
    {
      title: "About",
      links: ["Artifex, Inc.", "Investors", "Careers", "Press", "Impact"]
    },
    {
      title: "Help",
      links: ["Help Center", "Privacy Settings", "Shipping Policy", "Returns"]
    },
    {
      title: "Connect",
      links: ["Contact Us", "Blog", "Sell on Artifex", "Affiliates"]
    }
  ];

  return (
    <footer className="w-screen bg-[#CDC1FF] text-slate-900 py-16 relative z-10 border-t border-purple-200">
      <div className="container mx-auto px-6">
        
        {/* Top Section: Brand & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-10">
          <div className="max-w-sm">
            <h2 className="text-3xl font-bold tracking-tighter mb-4 italic">Artifex</h2>
            <p className="text-slate-700 mb-6">
              Bringing handmade craftsmanship to your doorstep. Join our community of creators and collectors.
            </p>
            <div className="flex space-x-4">
              <button className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                <Instagram size={20} />
              </button>
              <button className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                <Facebook size={20} />
              </button>
              <button className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                <Twitter size={20} />
              </button>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <h3 className="font-semibold mb-4 text-lg">Stay in the loop</h3>
            <div className="flex w-full max-w-md bg-white rounded-full p-1 shadow-sm focus-within:ring-2 focus-within:ring-purple-400 transition-all">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent pl-4 flex-grow outline-none text-sm"
              />
              <button className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                Subscribe <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <hr className="border-purple-200 mb-12" />

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold mb-5 text-sm uppercase tracking-widest text-slate-800">
                {section.title}
              </h3>
              <div className="flex flex-col space-y-3">
                {section.links.map((link) => (
                  <button 
                    key={link}
                    className="group flex items-center text-slate-700 hover:text-black text-sm w-fit transition-all"
                  >
                    <span className="relative">
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-purple-200 gap-4 text-xs font-medium text-slate-600">
          <p>© 2025 Artifex Marketplace. All rights reserved.</p>
          <div className="flex space-x-6">
            <button className="hover:underline">Terms of Service</button>
            <button className="hover:underline">Privacy Policy</button>
            <button className="hover:underline">Cookie Settings</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;