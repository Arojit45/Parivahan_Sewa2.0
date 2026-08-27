import React from "react";
import { Info, FileText, CheckSquare, Shield, Receipt, File, FileSpreadsheet } from "lucide-react";
import { useDashboard } from "../../contexts/DashboardContext";

const ICONS = {
  rc:        <FileText className="w-5 h-5 text-blue-500" />,
  puc:       <CheckSquare className="w-5 h-5 text-emerald-500" />,
  insurance: <Shield className="w-5 h-5 text-blue-500" />,
  tax:       <Receipt className="w-5 h-5 text-amber-500" />,
  permit:    <File className="w-5 h-5 text-slate-400" />,
  fitness:   <FileSpreadsheet className="w-5 h-5 text-slate-400" />,
};
const ICON_BG = {
  rc:        "bg-blue-50/50",
  puc:       "bg-emerald-50/50",
  insurance: "bg-blue-50/50",
  tax:       "bg-amber-50/50",
  permit:    "bg-slate-50",
  fitness:   "bg-slate-50",
};
const TITLES = { rc: "RC", puc: "PUC", insurance: "Insurance", tax: "Tax", permit: "Permit", fitness: "Fitness" };
const ACTION_LABELS = { rc: "View RC", puc: "Renew PUC", insurance: "View Insurance", tax: "View Tax", permit: "Apply Permit", fitness: "Apply Fitness" };

function resolveItem(key, item) {
  const status = item?.status ?? "NOT_APPLICABLE";
  const validTill = item?.validTill ?? null;

  const formattedDate = validTill
    ? new Date(validTill).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  const today = new Date();
  let daysLeft = null;
  if (validTill) {
    daysLeft = Math.ceil((new Date(validTill) - today) / (1000 * 60 * 60 * 24));
  }

  let statusText, statusColor, actionColor, validText;
  switch (status) {
    case "VALID":
      statusText = "VALID";
      statusColor = "text-[#10B981]";
      actionColor = "text-blue-600 border-blue-200 hover:bg-blue-50";
      validText = formattedDate ? `Valid till ${formattedDate}` : "Valid";
      break;
    case "EXPIRING_SOON":
      statusText = `${daysLeft} DAYS LEFT`;
      statusColor = "text-[#F59E0B]";
      actionColor = "text-[#F59E0B] border-[#FDE68A] bg-[#FEF3C7]/30 hover:bg-[#FEF3C7]";
      validText = formattedDate ? `Expires ${formattedDate}` : "Expiring soon";
      break;
    case "EXPIRED":
      statusText = "EXPIRED";
      statusColor = "text-[#EF4444]";
      actionColor = "text-[#EF4444] border-red-200 bg-red-50 hover:bg-red-100";
      validText = formattedDate ? `Expired ${formattedDate}` : "Expired";
      break;
    default:
      statusText = "N/A";
      statusColor = "text-slate-500";
      actionColor = "text-blue-600 border-blue-200 hover:bg-blue-50";
      validText = "Not Required";
  }

  return { statusText, statusColor, actionColor, validText };
}

const ComplianceStatus = () => {
  const { dashboard } = useDashboard();
  const compliance = dashboard?.compliance;
  if (!compliance) return null;

  const keys = ["rc", "puc", "insurance", "tax", "permit", "fitness"];

  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[17px] font-bold text-[#1e293b] flex items-center gap-2">
          Compliance Status <Info className="w-4 h-4 text-slate-300" />
        </h2>
        <button className="text-[13px] font-bold text-blue-600 hover:underline flex items-center gap-1">
          View All Compliance <span className="text-lg leading-none mb-0.5">&rsaquo;</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
        {keys.map((key) => {
          const { statusText, statusColor, actionColor, validText } = resolveItem(key, compliance[key]);
          return (
            <div key={key} className="border border-slate-100 rounded-[1.25rem] p-4 flex flex-col hover:shadow-md transition-shadow bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ICON_BG[key]}`}>
                  {ICONS[key]}
                </div>
                <Info className="w-4 h-4 text-slate-300" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-900 mb-3">{TITLES[key]}</h3>
              <div className="flex-grow flex flex-col justify-end">
                <span className={`text-[11px] font-bold ${statusColor} mb-0.5 block`}>{statusText}</span>
                <span className="text-[11px] text-slate-500 font-medium mb-4 block leading-relaxed">{validText}</span>
                <button className={`w-full py-2 rounded-xl text-[12px] font-bold transition-colors border ${actionColor}`}>
                  {ACTION_LABELS[key]}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplianceStatus;
