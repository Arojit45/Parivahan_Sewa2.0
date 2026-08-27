import React from 'react';
import { Search, Bell, HelpCircle, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Topbar = () => {
  const { language, setLanguage } = useLanguage();

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
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 shrink-0">
      
      {/* Search */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          />
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
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                    language === lang.code
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
        <button className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden">
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
            Amit Kumar <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
        </button>

      </div>
    </header>
  );
};

export default Topbar;
