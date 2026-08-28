import React from "react";
import { ChevronLeft, Edit2, Copy, RefreshCw, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDashboard } from "../../contexts/DashboardContext";
import { useLanguage } from "../../contexts/LanguageContext";
import CarModelViewer from "../CarModelViewer";

const VehicleCard = () => {
  const { dashboard } = useDashboard();
  const { t } = useLanguage();
  const v = dashboard?.vehicleCard;

  if (!v) return null;

  const statusColor =
    v.vehicleStatus === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-8 relative overflow-hidden">

      {/* Title & Actions */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
        <Link to="/dashboard" className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:underline">
          <ChevronLeft className="w-4 h-4" /> {t.dash?.backToVehicles || "Back to My Vehicles"}
        </Link>
      </div>

      {/* Image */}
      <div className="w-full md:w-1/3 pt-12 flex flex-col items-center justify-center relative cursor-grab active:cursor-grabbing">
        <div className="w-[120%] h-48 relative flex items-center justify-center -ml-[10%]">
          <CarModelViewer />
        </div>
        <button className="mt-4 text-xs font-semibold text-slate-500 flex items-center gap-1 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors">
          <RefreshCw className="w-3 h-3" /> {t.dash?.view360 || "View 360°"}
        </button>
      </div>

      {/* Details */}
      <div className="w-full md:w-2/3 pt-12 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-slate-900">
                {v.manufacturer} {v.model}
              </h1>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase ${statusColor}`}>
                {v.vehicleStatus}
              </span>
              <button className="text-slate-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
              <button 
                onClick={async () => {
                  if(window.confirm(t.dash?.unlinkPrompt || "Are you sure you want to unlink this vehicle?")) {
                    try {
                      const { apiFetch } = await import('../../utils/api');
                      await apiFetch(`/vehicles/${v.registrationNumber}`, { method: 'DELETE' });
                      window.location.reload();
                    } catch (err) {
                      alert(err.message || t.dash?.unlinkError || 'Failed to unlink vehicle.');
                    }
                  }
                }}
                className="text-red-400 hover:text-red-600 ml-2 border border-red-100 hover:bg-red-50 p-1 rounded transition-colors"
                title={t.dash?.unlinkTitle || "Unlink Vehicle"}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="border border-blue-200 rounded-lg px-3 py-1 font-bold text-sm bg-blue-50 text-slate-800 shadow-sm">
                {v.registrationNumber}
              </div>
              <button
                className="text-slate-400 hover:text-blue-600"
                onClick={() => navigator.clipboard.writeText(v.registrationNumber)}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-3">
              {v.fuelType} • {v.vehicleClass}
            </p>
          </div>
          <button className="text-[12px] font-bold text-blue-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1">
            {t.dash?.moreDetails || "More Details"} <span className="text-lg leading-none mb-0.5">&rsaquo;</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-12 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-500">{t.dash?.nickname || "Nickname"}</span>
            <span className="font-semibold text-slate-900">{v.nickname || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.dash?.owner || "Owner"}</span>
            <span className="font-semibold text-slate-900">{v.owner}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.dash?.regDate || "Registration Date"}</span>
            <span className="font-semibold text-slate-900">{v.registrationDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.dash?.rto || "RTO"}</span>
            <span className="font-semibold text-slate-900">{v.rto}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{t.dash?.insuranceProvider || "Insurance Provider"}</span>
            <span className="font-semibold text-slate-900">{v.insuranceProvider || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
