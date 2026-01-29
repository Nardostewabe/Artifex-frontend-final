import React from 'react';
import { Facebook, Instagram, Music2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, url: "https://instagram.com/artifex", label: "Instagram" },
    { icon: Facebook, url: "https://facebook.com/artifex", label: "Facebook" },
    { icon: Music2, url: "https://tiktok.com/@artifex", label: "TikTok" }
  ];

  return (
    <footer className="w-screen bg-[#CDC1FF] text-slate-900 py-10 relative z-10 border-t border-purple-200">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* Main Content Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold tracking-tighter mb-2 italic">
              Artifex
            </h2>
            <p className="text-slate-800 text-sm max-w-xs text-center md:text-left font-medium opacity-80">
              Curating local craftsmanship for a modern world.
            </p>
          </div>

          <div className="flex items-center gap-10">
            <nav className="hidden sm:flex items-center gap-6">
              <Link to="/shop" className="text-sm font-bold text-slate-800 hover:text-white transition-colors">Shop</Link>
              <Link to="/about" className="text-sm font-bold text-slate-800 hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="text-sm font-bold text-slate-800 hover:text-white transition-colors">Contact</Link>
            </nav>
            <div className="flex space-x-3">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/20 text-slate-900 hover:bg-white hover:text-purple-600 rounded-xl transition-all border border-white/30 backdrop-blur-sm"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-900/10 gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800/60 uppercase tracking-widest">
            <p>© {currentYear} Artifex Marketplace</p>
            <span className="hidden sm:block">•</span>
            <p className="hidden sm:flex items-center gap-1">Made with <Heart size={10} className="text-red-500 fill-red-500" /> by Hand</p>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-tighter text-slate-800/60">
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/shipping" className="hover:text-white transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
