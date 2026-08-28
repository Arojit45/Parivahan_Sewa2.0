import React, { useState } from "react";
import { Info, FileText, CheckSquare, Shield, Receipt, File, FileSpreadsheet, X, Clock } from "lucide-react";
import { useDashboard } from "../../contexts/DashboardContext";
import { useLanguage } from "../../contexts/LanguageContext";

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

function resolveItem(key, item, t) {
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
      statusText = t.dash?.valid || "VALID";
      statusColor = "text-[#10B981]";
      actionColor = "text-blue-600 border-blue-200 hover:bg-blue-50";
      validText = formattedDate ? `${t.dash?.validUntil || "Valid till"} ${formattedDate}` : (t.dash?.valid || "Valid");
      break;
    case "EXPIRING_SOON":
      statusText = `${daysLeft} ${t.dash?.daysLeft || "DAYS LEFT"}`;
      statusColor = "text-[#F59E0B]";
      actionColor = "text-[#F59E0B] border-[#FDE68A] bg-[#FEF3C7]/30 hover:bg-[#FEF3C7]";
      validText = formattedDate ? `${t.dash?.expires || "Expires"} ${formattedDate}` : (t.dash?.expiringSoon || "Expiring soon");
      break;
    case "EXPIRED":
      statusText = t.dash?.expired || "EXPIRED";
      statusColor = "text-[#EF4444]";
      actionColor = "text-[#EF4444] border-red-200 bg-red-50 hover:bg-red-100";
      validText = formattedDate ? `${t.dash?.expiredOn || "Expired"} ${formattedDate}` : (t.dash?.expired || "Expired");
      break;
    default:
      statusText = t.dash?.na || "N/A";
      statusColor = "text-slate-500";
      actionColor = "text-blue-600 border-blue-200 hover:bg-blue-50";
      validText = t.dash?.notRequired || "Not Required";
  }

  return { statusText, statusColor, actionColor, validText };
}

// ── Document Preview Modal ─────────────────────────────────────────────────
const DocumentModal = ({ docKey, item, title, onClose }) => {
  const formattedDate = item?.validTill
    ? new Date(item.validTill).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "N/A";

  const docMeta = {
    rc:        { label: "Registration Certificate", color: "#3b82f6", bg: "#EFF6FF" },
    puc:       { label: "Pollution Under Control", color: "#10B981", bg: "#ECFDF5" },
    insurance: { label: "Vehicle Insurance Policy", color: "#6366f1", bg: "#EEF2FF" },
    tax:       { label: "Road Tax Certificate",     color: "#F59E0B", bg: "#FFFBEB" },
  };
  const meta = docMeta[docKey] || { label: title, color: "#64748b", bg: "#F8FAFC" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header strip */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between" style={{ backgroundColor: meta.bg }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${meta.color}20` }}>
              {ICONS[docKey]}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{meta.label}</p>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Document body */}
        <div className="px-6 py-5 space-y-4">
          {/* Status badge */}
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-500">Status</span>
            <span
              className="text-[11px] font-bold px-3 py-1 rounded-full"
              style={{
                backgroundColor: item?.status === "VALID" ? "#D1FAE5" : item?.status === "EXPIRED" ? "#FEE2E2" : "#FEF3C7",
                color: item?.status === "VALID" ? "#065F46" : item?.status === "EXPIRED" ? "#991B1B" : "#92400E",
              }}
            >
              {item?.status ?? "N/A"}
            </span>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Details rows */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-slate-500 font-medium">Valid Till</span>
              <span className="text-[13px] font-bold text-slate-900">{formattedDate}</span>
            </div>
            {item?.documentNumber && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500 font-medium">Document No.</span>
                <span className="text-[13px] font-bold text-slate-900 font-mono">{item.documentNumber}</span>
              </div>
            )}
            {item?.issuer && (
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-slate-500 font-medium">Issued By</span>
                <span className="text-[13px] font-bold text-slate-900">{item.issuer}</span>
              </div>
            )}
          </div>

          {/* Decorative document watermark strip */}
          <div
            className="rounded-xl p-4 mt-2 flex flex-col items-center justify-center gap-1 border border-dashed"
            style={{ borderColor: `${meta.color}40`, backgroundColor: meta.bg }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-1" style={{ backgroundColor: `${meta.color}20` }}>
              {ICONS[docKey]}
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Official Document</p>
            <p className="text-[10px] text-slate-400">Government of India · Parivahan Sewa</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white transition-colors"
            style={{ backgroundColor: meta.color }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Coming Soon Modal ──────────────────────────────────────────────────────
const ComingSoonModal = ({ onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-6 pt-8 pb-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
        <p className="text-[13px] text-slate-500 leading-relaxed">
          This feature is under development and will be available shortly. Stay tuned!
        </p>
      </div>
      <div className="px-6 pb-6 mt-2">
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const ComplianceStatus = () => {
  const { dashboard } = useDashboard();
  const { t } = useLanguage();
  const compliance = dashboard?.compliance;

  const [docModal, setDocModal] = useState(null);   // { key, item, title }
  const [showComingSoon, setShowComingSoon] = useState(false);

  if (!compliance) return null;

  const TITLES = {
    rc: t.dash?.rc || "RC",
    puc: t.dash?.puc || "PUC",
    insurance: t.dash?.insurance || "Insurance",
    tax: t.dash?.tax || "Tax",
    permit: t.dash?.permit || "Permit",
    fitness: t.dash?.fitness || "Fitness",
  };

  const keys = ["rc", "puc", "insurance", "tax", "permit", "fitness"];

  const handleAction = (key) => {
    if (key === "permit" || key === "fitness") {
      setShowComingSoon(true);
    } else {
      setDocModal({ key, item: compliance[key], title: TITLES[key] });
    }
  };

  return (
    <>
      <div className="bg-white rounded-[1.25rem] border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[17px] font-bold text-[#1e293b] flex items-center gap-2">
            {t.dash?.complianceStatus || "Compliance Status"} <Info className="w-4 h-4 text-slate-300" />
          </h2>
          <button className="text-[13px] font-bold text-blue-600 hover:underline flex items-center gap-1">
            {t.dash?.viewAllCompliance || "View All Compliance"} <span className="text-lg leading-none mb-0.5">&rsaquo;</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {keys.map((key) => {
            const { statusText, statusColor, actionColor, validText } = resolveItem(key, compliance[key], t);

            const actionLabels = {
              rc: t.dash?.viewRc || "View RC",
              puc: t.dash?.renewPuc || "Renew PUC",
              insurance: t.dash?.viewInsurance || "View Insurance",
              tax: t.dash?.viewTax || "View Tax",
              permit: t.dash?.applyPermit || "Apply Permit",
              fitness: t.dash?.applyFitness || "Apply Fitness",
            };

            return (
              <div key={key} className="border border-slate-100 rounded-[1.25rem] p-4 flex flex-col hover:shadow-md transition-shadow bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ICON_BG[key]}`}>
                    {ICONS[key]}
                  </div>
                  <Info className="w-4 h-4 text-slate-300" />
                </div>
                <h3 className="text-[15px] font-bold text-slate-900 mb-2">{TITLES[key]}</h3>
                <div className="flex-grow flex flex-col justify-end">
                  <span className={`text-[11px] font-bold ${statusColor} mb-1 block`}>{statusText}</span>
                  <span className="text-[11px] text-slate-500 font-medium mb-4 block leading-relaxed">{validText}</span>
                  <button
                    onClick={() => handleAction(key)}
                    className={`w-full py-2 rounded-xl text-[12px] font-bold transition-colors border ${actionColor}`}
                  >
                    {actionLabels[key]}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {docModal && (
        <DocumentModal
          docKey={docModal.key}
          item={docModal.item}
          title={docModal.title}
          onClose={() => setDocModal(null)}
        />
      )}

      {showComingSoon && <ComingSoonModal onClose={() => setShowComingSoon(false)} />}
    </>
  );
};

export default ComplianceStatus;
