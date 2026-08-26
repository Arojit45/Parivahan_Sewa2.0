import React from 'react';
import { Car, Users, UserCheck, FileText, Truck } from 'lucide-react';

const GuidedProcesses = () => {
  const processes = [
    { icon: <Car className="w-5 h-5 text-blue-500" />, title: 'Vehicle Registration', subtitle: 'New Registration', color: 'text-blue-700 bg-blue-50 border-blue-100' },
    { icon: <Users className="w-5 h-5 text-emerald-500" />, title: 'Ownership Transfer', subtitle: 'Transfer Ownership', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { icon: <UserCheck className="w-5 h-5 text-purple-500" />, title: 'Learner Licence', subtitle: 'Apply for LL', color: 'text-purple-700 bg-purple-50 border-purple-100' },
    { icon: <FileText className="w-5 h-5 text-indigo-500" />, title: 'Driving Licence', subtitle: 'Apply / Renew DL', color: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
    { icon: <Truck className="w-5 h-5 text-amber-500" />, title: 'National Permit', subtitle: 'Apply for Permit', color: 'text-amber-700 bg-amber-50 border-amber-100' }
  ];

  return (
    <div className="bg-[#F8FAFC] rounded-[1.25rem] border border-slate-200 p-6 mb-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[15px] font-bold text-[#1e293b]">Guided Processes</h2>
        <button className="text-[13px] font-bold text-blue-600 hover:underline">View All Processes &rsaquo;</button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {processes.map((proc, idx) => (
          <button key={idx} className="flex-1 min-w-[200px] flex items-center gap-3 border border-slate-200 rounded-[1.25rem] p-3 hover:shadow-md transition-shadow text-left bg-white shadow-sm">
            <div className={`w-10 h-10 rounded-[0.8rem] border flex items-center justify-center shrink-0 ${proc.color}`}>
              {proc.icon}
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-slate-900">{proc.title}</h4>
              <p className="text-[11px] text-slate-500 font-medium">{proc.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GuidedProcesses;
