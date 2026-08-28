import React, { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Globe, User, LogOut, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import SettingsModal from './SettingsModal';

const Topbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'mr', label: 'मराठी' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'മലയാളം' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'or', label: 'ଓଡ଼ିଆ' },
  ];

  const currentLabel = languages.find(l => l.code === language)?.label || 'English';

  return (
    <>
      <style>
        {`
          @keyframes shimmerSweep {
            0% { transform: translateX(-200%) skewX(-20deg); }
            30% { transform: translateX(300%) skewX(-20deg); }
            100% { transform: translateX(300%) skewX(-20deg); }
          }
          .animate-shimmer-sweep {
            animation: shimmerSweep 4s ease-in-out infinite;
          }
          @keyframes slowSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-slow-spin {
            animation: slowSpin 24s linear infinite;
          }
        `}
      </style>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between pl-6 pr-10 sticky top-0 z-40 shrink-0">

        {/* Formal Government Branding */}
        <div className="flex-1 flex items-center gap-3 select-none">
          {/* Ashoka Chakra SVG */}
          <div className="relative w-9 h-9 shrink-0 animate-slow-spin text-slate-800">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" />
              <circle cx="50" cy="50" r="8" />
              {Array.from({ length: 24 }).map((_, i) => (
                <path key={i} d="M50 50 L48.5 7 L51.5 7 Z" transform={`rotate(${i * 15} 50 50)`} />
              ))}
            </svg>
          </div>
          <div className="flex flex-col relative overflow-hidden pb-1 pr-4 px-1 -ml-1">
            <span className="text-[17px] font-bold text-slate-800 tracking-[0.2em] uppercase leading-tight pt-1 drop-shadow-sm" style={{ fontFamily: 'Georgia, serif' }}>
              E-Transport Portal
            </span>
            <div className="h-[2px] w-full flex mt-1.5 rounded-full overflow-hidden shadow-sm opacity-90">
              <div className="flex-1 bg-[#FF9933]"></div>
              <div className="flex-1 bg-[#ffffff]"></div>
              <div className="flex-1 bg-[#138808]"></div>
            </div>
            {/* Formal subtle shine sweep */}
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer-sweep"></div>
          </div>
        </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 ml-4">

        {/* Language Selector — 11 languages */}
        <div className="relative group">
          <button
            id="language-selector-btn"
            className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 transition-colors text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white shadow-sm min-w-0"
          >
            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="truncate max-w-[80px]">{currentLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="w-40 bg-white rounded-xl shadow-lg border border-slate-100 py-2 max-h-72 overflow-y-auto">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  id={`lang-option-${lang.code}`}
                  onClick={() => setLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${language === lang.code
                      ? 'text-blue-600 font-semibold bg-blue-50'
                      : 'text-slate-700 font-medium'
                    }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 border-x border-slate-200 px-6">
          <button className="relative text-slate-400 hover:text-blue-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[9px] font-bold text-white flex items-center justify-center">3</span>
          </button>
          <button className="text-slate-400 hover:text-blue-600 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Profile */}
        <div className="relative group">
          <button className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
              <img src={user?.profilePhoto || "/userIcon.png"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
              {user?.fullName || 'Citizen'} <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </button>
          
          {/* Profile Dropdown */}
          <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="w-64 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col items-center text-center">
                 <div className="w-16 h-16 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden flex items-center justify-center mb-2">
                   <img src={user?.profilePhoto || "/userIcon.png"} alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 <h4 className="font-bold text-slate-800">{user?.fullName || 'Citizen'}</h4>
                 <p className="text-xs text-slate-500">{user?.email || 'citizen@india.gov.in'}</p>
              </div>
              <div className="p-2">
                <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors text-left">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left mt-1">
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
    {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
};

export default Topbar;
