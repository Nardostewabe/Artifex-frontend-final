import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Store, PlusCircle, FileText, Home } from 'lucide-react';
import logo from '../assets/Artifex logo 2_2/6.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SellerNavigationBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Handle Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) setIsScrolled(true);
            else setIsScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle Logout Logic
    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate("/login");
    };

    const navLinks = [
        { name: 'Dashboard', path: '/seller-home', icon: <Home size={18} /> },
        { name: 'My Shop', path: '/seller-shop', icon: <Store size={18} /> },
        { name: 'Add Product', path: '/add-product', icon: <PlusCircle size={18} /> },
        { name: 'Applications', path: '/waiting-approval', icon: <FileText size={18} /> },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled || isMobileMenuOpen ? 'bg-white shadow-sm py-2' : 'bg-transparent py-4'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16 md:h-20">
                    {/* LEFT SECTION: MOBILE MENU & LINKS */}
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
                                    className={`flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-200 
                                        ${location.pathname === link.path ? 'text-purple-600' : (isScrolled ? 'text-gray-600' : 'text-gray-800')} 
                                        hover:text-purple-400`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* MIDDLE SECTION: LOGO */}
                    <div className="flex-shrink-0 flex justify-center">
                        <Link to="/seller-home">
                            <img
                                src={logo}
                                alt="Artifex Logo"
                                className="h-20 md:h-50 w-auto object-contain transition-all duration-300"
                            />
                        </Link>
                    </div>

                    {/* RIGHT SECTION: ICONS & ACTIONS */}
                    <div className="flex-1 flex justify-end items-center space-x-3 md:space-x-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs font-bold uppercase tracking-wider">
                            <User size={14} /> Seller Portal
                        </div>

                        <button onClick={handleLogout} className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-50 text-red-500 border border-red-200 rounded-full hover:bg-red-100 text-xs uppercase tracking-wider transition-colors">
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                <div
                    className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="flex flex-col items-center py-8 space-y-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-2 text-sm uppercase tracking-widest font-medium ${location.pathname === link.path ? 'text-purple-600' : 'text-gray-800 hover:text-purple-500'}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.icon} {link.name}
                            </Link>
                        ))}

                        <div className="w-16 h-px bg-gray-200 my-2"></div>

                        <button onClick={handleLogout} className="w-full max-w-xs bg-red-400 text-white text-center py-3 rounded-full text-xs uppercase tracking-widest hover:bg-red-500">Logout</button>
                    </div>
                </div>
            </nav>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    style={{ top: '80px' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </>
    );
}

export default SellerNavigationBar;
