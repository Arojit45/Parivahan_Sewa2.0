import React, { useState } from "react";
import { Home, PlusCircle, Shield, AlertTriangle, MapPin, Bell, Share2, BookOpen, MessageSquare, Truck, Activity, FileText, CheckSquare, Settings, HelpCircle, ChevronLeft, ChevronRight, CreditCard, Receipt, LogOut, Car, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboard } from "../../contexts/DashboardContext";
import { useLanguage } from "../../contexts/LanguageContext";
import SettingsModal from "./SettingsModal";

const fuelIcon = (fuelType) => {
  if (!fuelType) return <Car className="w-4 h-4" />;
  const f = fuelType.toUpperCase();
  if (f === "ELECTRIC") return <Zap className="w-4 h-4 text-emerald-500" />;
  return <Car className="w-4 h-4" />;
};

const Sidebar = () => {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // DashboardContext — may not be mounted outside dashboard, so guard
  let vehicleCtx = null;
  try { vehicleCtx = useDashboard(); } catch (_) {}
  const vehicles = vehicleCtx?.vehicles ?? [];
  const selectedVehicleId = vehicleCtx?.selectedVehicleId;
  const selectVehicle = vehicleCtx?.selectVehicle;

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const menuGroups = [
    {
      title: t.dash?.securityAndSafety || "SECURITY & SAFETY",
      items: [
        { icon: <Shield className="w-5 h-5" />, label: t.dash?.guardianMode || "Guardian Mode", badge: t.dash?.new || "New", path: "/guardian-mode" },
      ],
    },
    {
      title: t.dash?.services || "SERVICES",
      items: [
        { icon: <CreditCard className="w-5 h-5" />, label: t.dash?.drivingLicence || "Driving License", path: "/driving-license" },
        { icon: <FileText className="w-5 h-5" />, label: t.dash?.vehicleRegistration || "Vehicle Registration", path: "/register-vehicle" },
        { icon: <Receipt className="w-5 h-5" />, label: t.dash?.challan || "Challan", path: "/challans" },
        { icon: <BookOpen className="w-5 h-5" />, label: t.dash?.citizenGuide || "Citizen Process Guide", path: "/citizen-guide" },
        { icon: <MessageSquare className="w-5 h-5" />, label: t.dash?.askMyVehicle || "Ask My Vehicle", path: "/ask-my-vehicle" },
      ],
    },
    {
      title: t.dash?.fleet || "FLEET",
      items: [
        { icon: <Truck className="w-5 h-5" />, label: t.dash?.fleetDashboard || "Fleet Dashboard", path: "/fleet" },
      ],
    },
    {
      title: t.dash?.documents || "DOCUMENTS",
      items: [
        { icon: <FileText className="w-5 h-5" />, label: t.dash?.myDocuments || "My Documents", path: "/my-documents" },
        { icon: <CheckSquare className="w-5 h-5" />, label: t.dash?.trackReview || "Track & Review", path: "/track-review" },
        { icon: <AlertTriangle className="w-5 h-5" />, label: t.dash?.correctionsCenter || "Corrections Center", path: "/corrections" },
      ],
    },
  ];

  return (
    <aside className={`bg-white border-r border-slate-200 h-screen sticky top-0 hidden lg:flex flex-col transition-all duration-300 relative z-50 ${isCollapsed ? "w-20" : "w-72"}`}>

      {/* Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-9 bg-white border border-slate-200 text-slate-400 rounded-full p-1 hover:text-blue-600 shadow-sm z-[100] transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Logo */}
      <div className={`p-5 border-b border-slate-100 flex items-center ${isCollapsed ? "justify-center" : "gap-3"} shrink-0 h-24`}>
        <img src="/govtLogo.png" alt="Logo" className={`${isCollapsed ? "h-10" : "h-11"} w-auto transition-all`} />
        {!isCollapsed && (
          <div className="overflow-hidden flex flex-col justify-center pl-1">
            <h1 className="text-[17px] font-extrabold text-[#000080] leading-tight tracking-[0.05em] drop-shadow-sm">
              {t.dash?.parivahanSewa || "PARIVAHAN SEWA"}
            </h1>
            <p className="text-[8px] text-blue-800/80 font-bold leading-[1.3] mt-0.5 tracking-wider uppercase">
              {t.dash?.ministryTitle || "MINISTRY OF ROAD TRANSPORT & HIGHWAYS"}
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
        )}
      </div>

      {/* Scrollable menu */}
      <div className="p-4 overflow-y-auto overflow-x-hidden flex-1">

        {/* Dashboard link */}
        <Link
          to="/dashboard"
          className={`w-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors py-2.5 rounded-lg flex items-center font-semibold text-sm mb-4 ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"}`}
        >
          <Home className="w-4 h-4 shrink-0" /> {!isCollapsed && <span>{t.dash?.dashboard || "Dashboard"}</span>}
        </Link>

        {/* MY VEHICLES section */}
        {!isCollapsed && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 mb-3 px-4 tracking-wider">{t.dash?.myVehicles || "MY VEHICLES"}</h3>

            {vehicles.length === 0 ? (
              <div className="px-4 mb-2">
                <p className="text-[11px] text-slate-400 font-medium mb-3">{t.dash?.noVehiclesAdded || "No vehicles added yet"}</p>
                <Link
                  to="/add-vehicle"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <div className="p-1 rounded-full border border-blue-600 flex items-center justify-center">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold">{t.dash?.addVehicleBtn || "Add Vehicle"}</span>
                </Link>
              </div>
            ) : (
              <ul className="space-y-1 mb-2">
                {vehicles.map((v) => {
                  const isActive = v.id === selectedVehicleId;
                  return (
                    <li key={v.id}>
                      <button
                        onClick={() => selectVehicle && selectVehicle(v.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${isActive ? "bg-blue-50 text-blue-700 border border-blue-100" : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"}`}
                      >
                        <span className={`shrink-0 ${isActive ? "text-blue-500" : "text-slate-400"}`}>
                          {fuelIcon(v.fuelType)}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block truncate font-semibold text-[13px]">{v.nickname || `${v.manufacturer} ${v.model}`}</span>
                          <span className="block text-[10px] text-slate-400 font-medium">{v.registrationNumber}</span>
                        </span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            {vehicles.length > 0 && (
              <Link
                to="/add-vehicle"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
              >
                <PlusCircle className="w-5 h-5 text-slate-400 shrink-0" />
                <span>{t.dash?.addVehicleBtn || "Add Vehicle"}</span>
              </Link>
            )}
          </div>
        )}

        {/* Other menu groups */}
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && <h3 className="text-xs font-bold text-slate-400 mb-3 px-4 tracking-wider">{group.title}</h3>}
            {isCollapsed && <div className="h-px bg-slate-100 w-full mb-3 mt-4" />}
            <ul className="space-y-1">
              {group.items.map((item, i) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={i}>
                    <Link
                      to={item.path}
                      className={`flex items-center rounded-lg text-sm font-medium transition-colors ${isActive ? "text-blue-700 bg-blue-50/50" : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"} ${isCollapsed ? "justify-center p-2.5 mx-auto w-10 h-10" : "gap-3 px-4 py-2"}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className={`shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`}>{item.icon}</span>
                      {!isCollapsed && <span className="flex-1 whitespace-pre-line truncate">{item.label}</span>}
                      {!isCollapsed && item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 ${item.badgeColor || "text-emerald-600 bg-emerald-50 border-emerald-200"}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-slate-100 shrink-0 bg-white">
        <ul className="space-y-1">
          <li>
            <button onClick={() => setShowSettings(true)} className={`w-full flex items-center rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors ${isCollapsed ? "justify-center p-2.5 mx-auto w-10 h-10" : "gap-3 px-4 py-2"}`} title={isCollapsed ? (t.dash?.settings || "Settings") : undefined}>
              <Settings className="w-5 h-5 text-slate-400 shrink-0" /> {!isCollapsed && (t.dash?.settings || "Settings")}
            </button>
          </li>
          <li>
            <Link to="/help-support" className={`flex items-center rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors ${isCollapsed ? "justify-center p-2.5 mx-auto w-10 h-10" : "gap-3 px-4 py-2"}`} title={isCollapsed ? (t.dash?.helpSupport || "Help & Support") : undefined}>
              <HelpCircle className="w-5 h-5 text-slate-400 shrink-0" /> {!isCollapsed && (t.dash?.helpSupport || "Help & Support")}
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${isCollapsed ? "justify-center p-2.5 mx-auto w-10 h-10" : "gap-3 px-4 py-2 mt-2"}`}
              title={isCollapsed ? (t.dash?.logout || "Logout") : undefined}
            >
              <LogOut className="w-5 h-5 text-red-500 shrink-0" /> {!isCollapsed && (t.dash?.logout || "Logout")}
            </button>
          </li>
        </ul>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </aside>
  );
};

export default Sidebar;
