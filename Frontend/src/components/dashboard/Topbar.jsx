import React from 'react';
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      
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
        
        <div className="flex items-center gap-4 border-r border-slate-200 pr-6">
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
