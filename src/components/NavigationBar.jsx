import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, User } from 'lucide-react';
import logo from '../assets/Artifex logo 2_2/6.png';
import { Link } from 'react-router-dom';

const Navigationbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

     window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
      }, []);

    const navLinks = [
        { name: 'Shop', path: '/shop' },      
        { name: 'Collections', path: '/collections' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
                isScrolled || isMobileMenuOpen 
                    ? 'bg-white shadow-sm py-2' 
                    : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16 md:h-20">
                 <div className="flex-1 flex items-center justify-start">
                    <button 
                        className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className="hidden md:flex space-x-8">
                        {navLinks.map((link) => (
                            <Link
                            key={link.name}
                            to={link.path}
                            className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-200 
                                ${isScrolled ? 'text-gray-600' : 'text-gray-800'} 
                                hover:text-purple-400`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                 </div>

                 <div className="flex-shrink-0 flex justify-center">
                    <Link to="/">
                        <img 
                            src={logo} 
                            alt="Artifex Logo"
                            className="h-20 md:h-50 w-auto object-contain transition-all duration-300" 
                        />
                    </Link>
                 </div>

                 <div className="flex-1 flex justify-end items-center space-x-3 md:space-x-6">
                    <Link to="/login" className="hidden md:block text-gray-700 hover:text-purple-400 p-1 transition-colors">
                        <User size={20} strokeWidth={1.5} />
                    </Link>
                    <button className="text-gray-700 hover:text-blue-400 p-1 transition-colors">
                        <Search size={20} strokeWidth={1.5} />
                    </button>
                    <button className="hidden sm:block text-gray-700 hover:text-purple-400 p-1 transition-colors">
                        <Heart size={20} strokeWidth={1.5} />
                    </button>
                    <button className="text-gray-700 hover:text-blue-400 p-1 transition-colors relative">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        <span className="absolute -top-1 -right-1 bg-purple-200 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            2
                        </span>
                    </button>
                 </div>
            </div>
            {/* MOBILE MENU DROPDOWN */}
            <div 
                className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
                    isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="flex flex-col items-center py-8 space-y-6">
                    {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className="text-gray-800 text-sm uppercase tracking-widest hover:text-purple-500 font-medium"
                        onClick={() => setIsMobileMenuOpen(false)} // Close menu when clicked
                    >
                        {link.name}
                    </Link>
                    ))}
                    {/* Mobile-only Wishlist link (since we hide the icon on small screens) */}
                    <Link to="/" className="text-gray-400 text-xs uppercase tracking-widest pt-4">
                    Wishlist
                    </Link>
                    <div className="w-16 h-px bg-gray-200 my-2"></div> {/* Divider Line */}
        
                <div className="flex flex-col items-center space-y-4 w-full px-8">
                    <Link 
                        to="/login" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-800 text-sm uppercase tracking-widest hover:text-purple-500"
                    >
                        Log In
                    </Link>
                    <Link 
                        to="/signup" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full max-w-xs bg-gray-900 text-white text-center py-3 rounded-full text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                        Sign Up
                    </Link>
                </div>
    
                </div>
            </div>
        </nav>

        {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden" 
          style={{ top: '80px' }} // Start below navbar
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      </>
    );
}
export default Navigationbar;