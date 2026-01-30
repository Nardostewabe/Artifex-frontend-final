import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, User, LogOut } from 'lucide-react';
import logo from '../../../assets/Artifex logo 2_2/6.png'; // Make sure this path is correct
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCart } from '../../../context/CartContext';
import ThemeToggle from '../../../components/ThemeToggle';

const Navigationbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { token, logout } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();

    // 2. Handle Scroll Logic
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) setIsScrolled(true);
            else setIsScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3. Handle Logout Logic
    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate("/login");
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const navLinks = [
        { name: 'Shop', path: '/shop' },
        { name: 'Collections', path: '/collections' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const isLoggedIn = !!token;
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
                                    className={`text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-200 
                                        ${isScrolled ? 'text-gray-600' : 'text-gray-800'} 
                                        hover:text-purple-400`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* MIDDLE SECTION: LOGO */}
                    <div className="flex-shrink-0 flex justify-center">
                        <Link to="/customer-home">
                            <img
                                src={logo}
                                alt="Artifex Logo"
                                className="h-20 md:h-50 w-auto object-contain transition-all duration-300"
                            />
                        </Link>
                    </div>

                    {/* RIGHT SECTION: ICONS & ACTIONS */}
                    <div className="flex-1 flex justify-end items-center space-x-3 md:space-x-6">

                        {/* --- DESKTOP AUTH LOGIC --- */}
                        {!isLoggedIn ? (
                            <Link to="/login" className="hidden md:block text-gray-700 hover:text-purple-400 p-1" title="Login">
                                <User size={20} strokeWidth={1.5} />
                            </Link>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <Link to="/my-profile" className="text-gray-700 hover:text-purple-600 p-1" title="My Profile">
                                    <User size={20} strokeWidth={1.5} />
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-500 border border-red-200 rounded-full hover:bg-red-100 text-xs uppercase tracking-wider">
                                    <LogOut size={14} /> Logout
                                </button>
                            </div>
                        )}

                        <ThemeToggle className="hidden md:block" />

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-gray-700 hover:text-blue-400 p-1 transition-colors"
                        >
                            <Search size={20} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={() => navigate('/favorites')}
                            className="hidden sm:block text-gray-700 hover:text-purple-400 p-1 transition-colors"
                        >
                            <Heart size={20} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={() => navigate('/cart')}
                            className="text-gray-700 hover:text-blue-400 p-1 transition-colors relative"
                        >
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-purple-200 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {getCartCount()}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU DROPDOWN */}
                <div
                    className={`md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        }`}
                >
                    <div className="flex flex-col items-center py-8 space-y-6">
                        <ThemeToggle />
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-800 text-sm uppercase tracking-widest hover:text-purple-500 font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 text-xs uppercase tracking-widest pt-4">
                            Wishlist
                        </Link>

                        <div className="w-16 h-px bg-gray-200 my-2"></div>

                        {/* --- MOBILE AUTH LOGIC --- */}
                        <div className="flex flex-col items-center space-y-4 w-full px-8">
                            {!isLoggedIn ? (
                                <>
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 text-sm uppercase tracking-widest hover:text-purple-500">Log In</Link>
                                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="w-full max-w-xs bg-gray-900 text-white text-center py-3 rounded-full text-xs uppercase tracking-widest">Sign Up</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/my-profile" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-800 text-sm uppercase tracking-widest hover:text-purple-500">My Profile</Link>
                                    <button onClick={handleLogout} className="w-full max-w-xs bg-red-400 text-white text-center py-3 rounded-full text-xs uppercase tracking-widest hover:bg-red-500">Logout</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav >

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    style={{ top: '80px' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )
            }

            {/* SEARCH OVERLAY */}
            <div className={`fixed inset-0 z-[60] bg-white/95 backdrop-blur-md transition-all duration-500 ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                <div className="max-w-4xl mx-auto h-full flex flex-col px-6">
                    <div className="flex justify-end pt-12">
                        <button onClick={() => setIsSearchOpen(false)} className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <X size={32} />
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col justify-center pb-32">
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 text-center font-bold">Search Products & Shops</p>
                        <div className="relative group">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple-400 transition-colors" size={32} />
                            <input
                                type="text"
                                autoFocus={isSearchOpen}
                                placeholder="What are you looking for?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                className="w-full bg-transparent border-b-2 border-gray-100 focus:border-purple-300 py-6 pl-12 pr-4 text-3xl md:text-5xl outline-none transition-all placeholder:text-gray-100 font-serif"
                            />
                        </div>
                        <div className="mt-8 flex flex-wrap gap-3 justify-center">
                            <p className="text-sm text-gray-400 w-full text-center mb-2">Popular Searches:</p>
                            {['Handmade Jewelry', 'Ceramics', 'Wall Art', 'Textiles'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => { setSearchQuery(tag); navigate(`/shop?search=${encodeURIComponent(tag)}`); setIsSearchOpen(false); }}
                                    className="px-4 py-2 bg-gray-50 text-gray-500 rounded-full text-sm hover:bg-purple-50 hover:text-purple-600 transition-all border border-gray-100"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navigationbar;