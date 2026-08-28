import React from "react";
import { CheckCircle, RefreshCw, AlertTriangle, Info } from "lucide-react";
import { useDashboard } from "../../contexts/DashboardContext";
import { useLanguage } from "../../contexts/LanguageContext";

const HealthSummary = () => {
  const { dashboard, loadingDashboard } = useDashboard();
  const { t } = useLanguage();

  if (loadingDashboard || !dashboard) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-[1.25rem] border border-slate-100 h-32" />
        ))}
      </div>
    );
  }

  const { healthScore, healthLabel, alerts, vehicleTwin } = dashboard;
  const alertCount = alerts?.length ?? 0;
  const isHealthy = alertCount === 0;

  // Build 30-second summary items from real alerts
  const summaryItems = alerts?.length > 0
    ? alerts.map((a) => ({
        text: a.message,
        color: a.type === "CRITICAL" ? "text-[#EF4444]" : a.type === "WARNING" ? "text-[#F59E0B]" : "text-[#10B981]",
        dot: a.type === "CRITICAL" ? "bg-[#EF4444]" : a.type === "WARNING" ? "bg-[#F59E0B]" : "bg-[#10B981]",
      }))
    : [{ text: t.dash?.allDocsUpToDate || "All documents are up to date", color: "text-[#10B981]", dot: "bg-[#10B981]" }];

  // Format last updated
  const lastUpdated = vehicleTwin?.lastUpdated
    ? (() => {
        const d = new Date(vehicleTwin.lastUpdated);
        const diffMs = Date.now() - d.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 60) return { label: `${diffMin} ${t.dash?.minAgo || "min ago"}`, sub: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) };
        const diffH = Math.floor(diffMin / 60);
        return { label: `${diffH} ${t.dash?.hrAgo || "hr ago"}`, sub: d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) };
      })()
    : null;

  // Score color
  const scoreColor = healthScore >= 80 ? "#10B981" : healthScore >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">

      {/* Health Score */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-5 lg:p-6 flex flex-col justify-between">
        <h3 className="text-[13px] font-semibold text-slate-500 mb-3">{t.dash?.vehicleHealthScore || "Vehicle Health Score"}</h3>
        <div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-[2.5rem] font-bold leading-none tracking-tight" style={{ color: scoreColor }}>{healthScore}</span>
            <span className="text-xl font-semibold text-slate-400">/ 100</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-[13px]" style={{ color: scoreColor }}>{healthLabel}</span>
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${scoreColor}20`, border: `1px solid ${scoreColor}40` }}>
              {isHealthy
                ? <CheckCircle className="w-4 h-4" style={{ color: scoreColor }} />
                : <AlertTriangle className="w-4 h-4" style={{ color: scoreColor }} />
              }
            </div>
          </div>
        </div>
      </div>

      {/* 30-Second Summary */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-5 lg:p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-slate-600">{t.dash?.thirtySecondSummary || "30-Second Summary"}</h3>
          <Info className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <ul className="space-y-2.5 text-[12px] font-semibold">
          {summaryItems.slice(0, 3).map((item, i) => (
            <li key={i} className={`flex items-start gap-2 ${item.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${item.dot} mt-1.5 shrink-0`} />
              {item.text}
            </li>
          ))}
          {summaryItems.length === 0 && (
            <li className="flex items-start gap-2 text-[#10B981]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
              {t.dash?.everythingIsOk || "Everything is OK"}
            </li>
          )}
        </ul>
      </div>

      {/* Total Alerts */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-5 lg:p-6 flex flex-col justify-between">
        <h3 className="text-[13px] font-semibold text-slate-500 mb-3">{t.dash?.totalAlerts || "Total Alerts"}</h3>
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[2.5rem] font-bold leading-none tracking-tight" style={{ color: alertCount > 0 ? "#EF4444" : "#10B981" }}>
              {alertCount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-[13px]" style={{ color: alertCount > 0 ? "#EF4444" : "#10B981" }}>
              {alertCount > 0 ? (t.dash?.needsAttention || "Needs Attention") : (t.dash?.allClear || "All Clear")}
            </span>
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: alertCount > 0 ? "#FEF2F2" : "#ECFDF5", border: alertCount > 0 ? "1px solid #FEE2E2" : "1px solid #D1FAE5" }}>
              {alertCount > 0
                ? <AlertTriangle className="w-4 h-4 text-[#F97316]" />
                : <CheckCircle className="w-4 h-4 text-[#10B981]" />
              }
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-5 lg:p-6 flex flex-col justify-between">
        <h3 className="text-[13px] font-semibold text-slate-500 mb-3">{t.dash?.lastUpdated || "Last Updated"}</h3>
        <div>
          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-2xl font-bold text-slate-900 leading-none">
              {lastUpdated ? lastUpdated.label : (t.dash?.noData || "No data")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium text-[11px]">
              {lastUpdated ? lastUpdated.sub : (t.dash?.locationUnavailable || "Location unavailable")}
            </span>
            <button className="text-blue-500 hover:rotate-180 transition-transform">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HealthSummary;
