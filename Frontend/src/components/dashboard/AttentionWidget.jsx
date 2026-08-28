import React from "react";
import { Receipt, Leaf, CheckCircle, AlertTriangle } from "lucide-react";
import { useDashboard } from "../../contexts/DashboardContext";
import { useLanguage } from "../../contexts/LanguageContext";

const AttentionWidget = () => {
  const { dashboard } = useDashboard();
  const { t } = useLanguage();
  const alerts = dashboard?.alerts ?? [];
  const challans = dashboard?.pendingChallans ?? [];

  // All clear state
  if (alerts.length === 0 && challans.length === 0) {
    return (
      <div className="bg-white rounded-[1.25rem] border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[15px] font-bold text-[#1e293b]">{t.dash?.attentionNeeded || "Things That Need Your Attention"}</h2>
        </div>
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-emerald-500" />
          </div>
          <h3 className="font-bold text-slate-800 text-[14px]">{t.dash?.allSet || "You are all set!"}</h3>
          <p className="text-[12px] text-slate-500 text-center leading-relaxed">
            {t.dash?.noPendingActions || "No pending challans or expiring documents."}<br />{t.dash?.vehicleGreatShape || "Your vehicle is in great shape."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[15px] font-bold text-[#1e293b]">{t.dash?.attentionNeeded || "Things That Need Your Attention"}</h2>
        <button className="text-[13px] font-bold text-blue-600 hover:underline">{t.dash?.viewAll || "View All"} &rsaquo;</button>
      </div>

      <div className="space-y-4">

        {/* Pending challans */}
        {challans.length > 0 && (
          <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-[0.8rem] bg-white border border-[#FEE2E2] shadow-sm text-red-500 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-[13px] font-bold text-red-700">{t.dash?.pendingChallan || "Pending Challan"}</h4>
              <p className="text-[11px] text-red-600/80 font-medium mt-0.5">
                {challans.length} {t.dash?.challanPending || "challans pending"}
              </p>
              <p className="text-[11px] text-slate-700 font-bold mt-1">
                {t.dash?.amount || "Amount"}: ₹{challans.reduce((s, c) => s + Number(c.amount), 0).toLocaleString("en-IN")}
              </p>
            </div>
            <button className="bg-white border border-red-200 text-red-600 text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
              {t.dash?.viewChallan || "View Challan"}
            </button>
          </div>
        )}

        {/* Alert items (non-challan) */}
        {alerts
          .filter((a) => a.type !== "INFO" || challans.length === 0)
          .map((alert, i) => {
            const isWarning = alert.type === "WARNING";
            const bg = isWarning ? "bg-[#FEF3C7]/40 border-[#FEF3C7]" : "bg-[#FEF2F2] border-[#FEE2E2]";
            const iconColor = isWarning ? "text-amber-500" : "text-red-500";
            const iconBorder = isWarning ? "border-[#FEF3C7]" : "border-[#FEE2E2]";
            const titleColor = isWarning ? "text-amber-700" : "text-red-700";
            const msgColor = isWarning ? "text-amber-600/80" : "text-red-600/80";
            const btnColor = isWarning
              ? "border-amber-200 text-amber-600 hover:bg-amber-50"
              : "border-red-200 text-red-600 hover:bg-red-50";
            return (
              <div key={i} className={`${bg} border rounded-2xl p-4 flex items-center gap-4`}>
                <div className={`w-10 h-10 rounded-[0.8rem] bg-white ${iconBorder} border shadow-sm ${iconColor} flex items-center justify-center shrink-0`}>
                  {isWarning ? <Leaf className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <h4 className={`text-[13px] font-bold ${titleColor}`}>{alert.title}</h4>
                  <p className={`text-[11px] ${msgColor} font-medium mt-0.5`}>{alert.message}</p>
                </div>
                <button className={`bg-white border text-[11px] font-bold px-4 py-2 rounded-lg transition-colors ${btnColor}`}>
                  {isWarning ? (t.dash?.renew || "Renew") : (t.dash?.view || "View")}
                </button>
              </div>
            );
          })}

      </div>
    </div>
  );
};

export default AttentionWidget;
