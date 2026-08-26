import React from 'react';
import { Info, FileText, CheckSquare, Shield, Receipt, File, FileSpreadsheet } from 'lucide-react';

const ComplianceStatus = () => {
  const compliances = [
    {
      title: 'RC',
      status: 'VALID',
      statusColor: 'text-[#10B981]',
      validText: 'Valid till 11 Sep\n2027',
      actionText: 'View RC',
      actionColor: 'text-blue-600 border-blue-200 hover:bg-blue-50',
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      iconBg: 'bg-blue-50/50'
    },
    {
      title: 'PUC',
      status: '17 DAYS LEFT',
      statusColor: 'text-[#F59E0B]',
      validText: 'Valid till 11 Jun\n2025',
      actionText: 'Renew PUC',
      actionColor: 'text-[#F59E0B] border-[#FDE68A] bg-[#FEF3C7]/30 hover:bg-[#FEF3C7]',
      icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
      iconBg: 'bg-emerald-50/50'
    },
    {
      title: 'Insurance',
      status: 'VALID',
      statusColor: 'text-[#10B981]',
      validText: 'Valid till 25 Dec\n2025',
      actionText: 'View\nInsurance',
      actionColor: 'text-blue-600 border-blue-200 hover:bg-blue-50',
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      iconBg: 'bg-blue-50/50'
    },
    {
      title: 'Tax',
      status: 'VALID',
      statusColor: 'text-[#10B981]',
      validText: 'Valid till 31 Mar\n2026',
      actionText: 'View Tax',
      actionColor: 'text-blue-600 border-blue-200 hover:bg-blue-50',
      icon: <Receipt className="w-5 h-5 text-amber-500" />,
      iconBg: 'bg-amber-50/50'
    },
    {
      title: 'Permit',
      status: 'N/A',
      statusColor: 'text-slate-500',
      validText: 'Not Required',
      actionText: 'Apply Permit',
      actionColor: 'text-blue-600 border-blue-200 hover:bg-blue-50',
      icon: <File className="w-5 h-5 text-slate-400" />,
      iconBg: 'bg-slate-50'
    },
    {
      title: 'Fitness',
      status: 'N/A',
      statusColor: 'text-slate-500',
      validText: 'Not Required',
      actionText: 'Apply\nFitness',
      actionColor: 'text-blue-600 border-blue-200 hover:bg-blue-50',
      icon: <FileSpreadsheet className="w-5 h-5 text-slate-400" />,
      iconBg: 'bg-slate-50'
    }
  ];

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
        {compliances.map((item, idx) => (
          <div key={idx} className="border border-slate-100 rounded-[1.25rem] p-5 flex flex-col hover:shadow-md transition-shadow bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-6">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.iconBg}`}>
                 {item.icon}
               </div>
               <Info className="w-4 h-4 text-slate-300" />
            </div>
            
            <h3 className="text-[15px] font-bold text-slate-900 mb-6">{item.title}</h3>
            
            <div className="flex-grow flex flex-col justify-end">
              <span className={`text-[11px] font-bold ${item.statusColor} mb-1 block`}>{item.status}</span>
              <span className="text-[11px] text-slate-500 font-medium mb-6 block whitespace-pre-line leading-relaxed">
                {item.validText}
              </span>
              <button className={`w-full py-2.5 rounded-xl text-[12px] font-bold transition-colors border whitespace-pre-line leading-snug ${item.actionColor}`}>
                {item.actionText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceStatus;
