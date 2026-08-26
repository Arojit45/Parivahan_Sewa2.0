import React, { useState, useEffect } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#', hasDropdown: true },
    { name: 'Dashboard Preview', href: '#' },
    { name: 'AI Assistant', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Help', href: '#' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/govtLogo.png" alt="Parivahan Sewa Logo" className="h-12 w-auto" />
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">
              PARIVAHAN SEWA
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">
              MINISTRY OF ROAD TRANSPORT & HIGHWAYS
              <br />
              Government of India
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                link.name === 'Home'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-slate-600'
              }`}
            >
              {link.name}
              {link.hasDropdown && (
                <span className="ml-1 text-xs">▼</span>
              )}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium px-3 py-2 rounded-full border border-slate-200 hover:border-blue-200 bg-white shadow-sm">
            <Globe className="w-4 h-4" />
            English
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2">
            Login / Register
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl"
          >
            <div className="flex flex-col p-4">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="py-3 text-slate-700 font-medium border-b border-slate-50"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                <button className="flex items-center justify-center gap-2 text-slate-600 text-sm font-medium px-3 py-2.5 rounded-lg border border-slate-200 w-full">
                  <Globe className="w-4 h-4" />
                  English
                </button>
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium w-full">
                  Login / Register
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
