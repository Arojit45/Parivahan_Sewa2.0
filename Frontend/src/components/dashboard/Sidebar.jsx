import React, { useState } from 'react';
import { Home, PlusCircle, Shield, AlertTriangle, MapPin, Bell, Share2, BookOpen, MessageSquare, Truck, Activity, FileText, CheckSquare, Settings, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuGroups = [
    {
      title: 'MY VEHICLES',
      items: [
        { icon: <Home className="w-5 h-5" />, label: 'My Vehicles', active: true },
        { icon: <PlusCircle className="w-5 h-5" />, label: 'Add Vehicle' },
      ]
    },
    {
      title: 'SECURITY & SAFETY',
      items: [
        { icon: <Shield className="w-5 h-5" />, label: 'Guardian Mode', badge: 'New' },
        { icon: <AlertTriangle className="w-5 h-5" />, label: 'Stolen Vehicle Mode', badge: 'New', badgeColor: 'text-red-600 bg-red-100' },
        { icon: <MapPin className="w-5 h-5" />, label: 'Live Tracking' },
        { icon: <Bell className="w-5 h-5" />, label: 'Alerts & Notifications' },
        { icon: <Share2 className="w-5 h-5" />, label: 'Sharing & Access' },
      ]
    },
    {
      title: 'SERVICES',
      items: [
        { icon: <BookOpen className="w-5 h-5" />, label: 'Citizen Process Guide' },
        { icon: <MessageSquare className="w-5 h-5" />, label: 'Virtual Assistant' },
      ]
    },
    {
      title: 'FLEET',
      items: [
        { icon: <Truck className="w-5 h-5" />, label: 'Fleet Dashboard' },
        { icon: <Activity className="w-5 h-5" />, label: 'Fleet Risk Radar' },
      ]
    },
    {
      title: 'DOCUMENTS',
      items: [
        { icon: <FileText className="w-5 h-5" />, label: 'My Documents' },
        { icon: <CheckSquare className="w-5 h-5" />, label: 'Application Status' },
      ]
    }
  ];

  return (
    <aside className={`bg-white border-r border-slate-200 h-screen sticky top-0 overflow-y-auto hidden lg:flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Logo & Toggle */}
      <div className={`p-5 border-b border-slate-100 sticky top-0 bg-white z-10 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} relative`}>
        <img src="/govtLogo.png" alt="Logo" className={`${isCollapsed ? 'h-8' : 'h-10'} w-auto transition-all`} />
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h2 className="font-bold text-slate-900 leading-tight">PARIVAHAN</h2>
            <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">Command Center</p>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white border border-slate-200 text-slate-400 rounded-full p-1 hover:text-blue-600 shadow-sm z-20"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>

      <div className="p-4 overflow-x-hidden">
        <button className={`w-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors py-2.5 rounded-lg flex items-center font-semibold text-sm mb-6 ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-4'}`}>
           <Home className="w-4 h-4 shrink-0" /> {!isCollapsed && <span>Dashboard</span>}
        </button>

        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && <h3 className="text-xs font-bold text-slate-400 mb-3 px-4 tracking-wider">{group.title}</h3>}
            {isCollapsed && <div className="h-px bg-slate-100 w-full mb-3 mt-4"></div>}
            <ul className="space-y-1">
              {group.items.map((item, i) => (
                <li key={i}>
                  <a href="#" className={`flex items-center rounded-lg text-sm font-medium transition-colors ${item.active ? 'text-blue-700 bg-blue-50/50' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'} ${isCollapsed ? 'justify-center p-2.5 mx-auto w-10 h-10' : 'gap-3 px-4 py-2'}`} title={isCollapsed ? item.label : undefined}>
                    <span className={`shrink-0 ${item.active ? 'text-blue-600' : 'text-slate-400'}`}>{item.icon}</span>
                    {!isCollapsed && <span className="flex-1 whitespace-pre-line truncate">{item.label}</span>}
                    {!isCollapsed && item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${item.badgeColor || 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-slate-100">
        <ul className="space-y-1">
          <li>
            <a href="#" className={`flex items-center rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors ${isCollapsed ? 'justify-center p-2.5 mx-auto w-10 h-10' : 'gap-3 px-4 py-2'}`} title={isCollapsed ? "Settings" : undefined}>
              <Settings className="w-5 h-5 text-slate-400 shrink-0" /> {!isCollapsed && "Settings"}
            </a>
          </li>
          <li>
            <a href="#" className={`flex items-center rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors ${isCollapsed ? 'justify-center p-2.5 mx-auto w-10 h-10' : 'gap-3 px-4 py-2'}`} title={isCollapsed ? "Help & Support" : undefined}>
              <HelpCircle className="w-5 h-5 text-slate-400 shrink-0" /> {!isCollapsed && "Help & Support"}
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
