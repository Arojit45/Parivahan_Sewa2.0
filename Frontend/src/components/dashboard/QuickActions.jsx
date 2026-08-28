import React from 'react';
import { FileText, CheckSquare, Shield, Share2, MessageSquare, LayoutGrid, Receipt, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const QuickActions = () => {
  const { t } = useLanguage();
  const actions = [
    { icon: <FileText className="w-5 h-5 text-blue-500" />, label: t.dash?.viewRc || 'View RC', bg: 'bg-blue-50/80 border-blue-100' },
    { icon: <CheckSquare className="w-5 h-5 text-emerald-500" />, label: t.dash?.renewPuc || 'Renew PUC', bg: 'bg-emerald-50/80 border-emerald-100' },
    { icon: <AlertTriangle className="w-5 h-5 text-red-500" />, label: t.dash?.viewChallan || 'View Challan', bg: 'bg-red-50/80 border-red-100' },
    { icon: <Receipt className="w-5 h-5 text-emerald-500" />, label: t.dash?.payTax || 'Pay Tax', bg: 'bg-emerald-50/80 border-emerald-100' },
    { icon: <Shield className="w-5 h-5 text-red-500" />, label: t.dash?.guardianMode || 'Guardian Mode', bg: 'bg-red-50/80 border-red-100' },
    { icon: <Share2 className="w-5 h-5 text-blue-500" />, label: t.dash?.shareVehicle || 'Share Vehicle', bg: 'bg-blue-50/80 border-blue-100' },
    { icon: <MessageSquare className="w-5 h-5 text-purple-500" />, label: t.dash?.askMyVehicle || 'Ask My Vehicle', bg: 'bg-purple-50/80 border-purple-100' },
    { icon: <LayoutGrid className="w-5 h-5 text-slate-500" />, label: t.dash?.allServices || 'All Services', bg: 'bg-slate-50/80 border-slate-200' },
  ];

  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-200 p-5 shadow-sm h-full flex flex-col">
      <h2 className="text-[14px] font-bold text-[#1e293b] mb-5">{t.dash?.quickActions || "Quick Actions"}</h2>
      <div className="grid grid-cols-4 gap-y-5 gap-x-2 flex-1 place-content-start">
        {actions.map((action, idx) => (
          <button key={idx} className="flex flex-col items-center gap-1.5 group">
            <div className={`w-9 h-9 rounded-[10px] border flex items-center justify-center transition-transform group-hover:scale-105 ${action.bg}`}>
              {React.cloneElement(action.icon, { className: 'w-4 h-4 ' + action.icon.props.className.replace('w-5 h-5 ', '') })}
            </div>
            <span className="text-[10px] font-bold text-slate-700 text-center leading-[1.1] px-0.5">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
