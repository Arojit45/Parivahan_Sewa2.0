import React, { useState, useEffect } from 'react';
import { Globe, Menu, X, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.navbar.home, href: '/' },
    { name: t.navbar.dashboard, href: '/auth' },
    { name: t.navbar.help, href: '/auth' },
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'bn', label: 'বাংলা' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3'
          : 'bg-white py-4 shadow-sm'
        }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img src="/govtLogo.png" alt="Parivahan Sewa Logo" className="h-12 w-auto" />
          <div className="hidden sm:block overflow-hidden flex flex-col justify-center pl-1">
            <h1 className="text-[17px] font-extrabold text-[#000080] leading-tight tracking-[0.05em] drop-shadow-sm uppercase">
              PARIVAHAN SEWA
            </h1>
            <p className="text-[8px] text-blue-800/80 font-bold leading-[1.3] mt-0.5 tracking-wider uppercase">
              MINISTRY OF ROAD TRANSPORT & HIGHWAYS
            </p>
            <p className="text-[10px] text-slate-800 font-bold leading-[1.2] mt-0.5 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
              E-Transport Portal
            </p>
            <div className="h-[1.5px] w-12 flex mt-1.5 rounded-full overflow-hidden shadow-sm opacity-90">
              <div className="flex-1 bg-[#FF9933]"></div>
              <div className="flex-1 bg-slate-200"></div>
              <div className="flex-1 bg-[#138808]"></div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className={`text-sm font-semibold transition-colors hover:text-blue-600 flex items-center ${link.name === t.navbar.home
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                  : 'text-slate-600'
                }`}
            >
              {link.name}
              {link.hasDropdown && (
                <ChevronDown className="ml-1 w-4 h-4 text-slate-400" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="relative group">
            <button className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm">
              <Globe className="w-4 h-4 text-blue-600" />
              {languages.find(l => l.code === language)?.label || 'English'}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-2">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${language === lang.code ? 'text-blue-600 font-semibold' : 'text-slate-700 font-medium'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <Link to="/auth" className="text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 transition-colors">
              Login
            </Link>
            <Link to="/auth" state={{ register: true }} className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full shadow-md shadow-blue-600/20 transition-all">
              Sign Up
            </Link>
          </div>
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
                <Link
                  key={index}
                  to={link.href}
                  className="py-3 text-slate-700 font-medium border-b border-slate-50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setIsMobileMenuOpen(false); }}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium ${language === lang.code ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
