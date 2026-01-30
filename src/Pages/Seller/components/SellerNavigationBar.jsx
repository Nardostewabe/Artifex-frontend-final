import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Store, PlusCircle, FileText, Home } from 'lucide-react';
import logo from '../../../assets/Artifex logo 2_2/6.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import ThemeToggle from '../../../components/ThemeToggle';

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
        { name: 'Inventory', path: '/seller-inventory', icon: <Store size={18} /> },
        { name: 'Shop Profile', path: '/seller-profile', icon: <Store size={18} /> },
        { name: 'Add Product', path: '/add-product', icon: <PlusCircle size={18} /> },
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
                            className="md:hidden text-gray-700 p-2 hover:bg-purple-50 rounded-full transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <div className="hidden md:flex space-x-12">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`flex items-center gap-2 text-xs uppercase font-medium transition-colors duration-200 
                                        ${location.pathname === link.path ? 'text-purple-600' : (isScrolled ? 'text-gray-600' : 'text-gray-800')} 
                                        hover:text-purple-400`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* MIDDLE SECTION: LOGO ... */}
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
                        <ThemeToggle className="hidden md:block" />
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-xs font-bold uppercase shadow-sm">
                            <User size={14} /> Seller Portal
                        </div>

                        <button onClick={handleLogout} className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-full hover:bg-red-100 text-xs font-bold uppercase transition-colors shadow-sm">
                            <LogOut size={14} /> Logout
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                <div
                    className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-purple-50 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="flex flex-col items-center py-10 space-y-8">
                        <ThemeToggle />
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-3 text-sm uppercase font-bold ${location.pathname === link.path ? 'text-purple-600' : 'text-gray-800 hover:text-purple-500'}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.icon} {link.name}
                            </Link>
                        ))}

                        <div className="w-16 h-px bg-purple-50 my-2"></div>

                        <button onClick={handleLogout} className="w-full max-w-xs bg-red-400 text-white text-center py-4 rounded-full text-xs font-bold uppercase shadow-lg shadow-red-100">Logout</button>
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
