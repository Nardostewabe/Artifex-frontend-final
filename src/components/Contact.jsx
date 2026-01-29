import React from 'react';
import { Mail, MapPin, MessageCircle, ArrowRight } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen w-full pt-28 pb-12 px-6 bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff]">
      
      {/* HEADER */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          We’d Love to Hear From You.
        </h1>
        <p className="text-lg text-gray-700">
          Have a question about an order? Need help setting up your Seller profile? 
          <br className="hidden md:block"/> Our team is ready to help.
        </p>
      </div>

      {/* CONTACT CARDS */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. Customer Support */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <MessageCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Support</h3>
          <p className="text-sm text-gray-500 mb-6">For Buyers & Sellers</p>
          
          <a href="mailto:support@artifex.com" className="text-lg font-bold text-blue-600 hover:text-blue-800 transition-colors">
            support@artifex.com
          </a>
          <span className="text-xs text-gray-400 mt-2">Response time: Within 24 hours</span>
        </div>

        {/* 2. Business Inquiries */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Partnerships</h3>
          <p className="text-sm text-gray-500 mb-6">For Press & Business</p>
          
          <a href="mailto:partners@artifex.com" className="text-lg font-bold text-purple-600 hover:text-purple-800 transition-colors">
            partners@artifex.com
          </a>
          <span className="text-xs text-gray-400 mt-2">We love collaborations!</span>
        </div>

        {/* 3. HQ Location */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
          <div className="w-16 h-16 bg-gray-50 text-gray-800 rounded-full flex items-center justify-center mb-6">
            <MapPin size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Artifex HQ</h3>
          <p className="text-sm text-gray-500 mb-6">Come say hi (by appointment)</p>
          
          <p className="text-gray-800 font-medium">
            123 Creative Avenue<br />
            Tech District<br />
            Addis Ababa, Ethiopia
          </p>
        </div>

      </div>

      {/* SOCIAL PROOF / BOTTOM BANNER */}
      <div className="max-w-5xl mx-auto mt-12 bg-[#3A3A6C] rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-bold">Join the Community</h3>
            <p className="text-gray-300 max-w-lg mx-auto">
                Follow us on social media for daily inspiration, featured artist spotlights, and tutorial snippets.
            </p>
            <div className="flex justify-center gap-6 pt-4 font-bold text-sm tracking-widest uppercase">
                <a href="#" className="hover:text-[#bfdbfe] transition-colors">Instagram</a>
                <a href="#" className="hover:text-[#bfdbfe] transition-colors">Pinterest</a>
                <a href="#" className="hover:text-[#bfdbfe] transition-colors">TikTok</a>
            </div>
        </div>
        
        {/* Decorative Circle */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
      </div>

    </div>
  );
};

export default Contact;