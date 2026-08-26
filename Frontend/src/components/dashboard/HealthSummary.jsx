import React from 'react';
import { Info, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const HealthSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
      
      {/* Score Card */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-5 lg:p-6 flex flex-col justify-between">
        <h3 className="text-[13px] font-semibold text-slate-500 mb-3">Vehicle Health Score</h3>
        <div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-[2.5rem] font-bold text-[#10B981] leading-none tracking-tight">91</span>
            <span className="text-xl font-semibold text-slate-400">/ 100</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#10B981] font-bold text-[13px]">Vehicle Healthy</span>
            <div className="w-7 h-7 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] flex items-center justify-center">
               <CheckCircle className="w-4 h-4 text-[#10B981]" />
            </div>
          </div>
        </div>
      </div>

      {/* 30-Second Summary Card */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-5 lg:p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-semibold text-slate-600">30-Second Summary</h3>
          <Info className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <ul className="space-y-2.5 text-[12px] font-semibold">
           <li className="flex items-start gap-2 text-[#F59E0B]">
             <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 shrink-0"></span> 
             PUC expires in 17 days
           </li>
           <li className="flex items-start gap-2 text-[#EF4444]">
             <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 shrink-0"></span> 
             1 challan pending
           </li>
           <li className="flex items-start gap-2 text-[#10B981]">
             <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0"></span> 
             Everything else is OK
           </li>
        </ul>
      </div>

      {/* Total Alerts Card */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-5 lg:p-6 flex flex-col justify-between">
        <h3 className="text-[13px] font-semibold text-slate-500 mb-3">Total Alerts</h3>
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[2.5rem] font-bold text-[#EF4444] leading-none tracking-tight">2</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#EF4444] font-bold text-[13px]">Needs Attention</span>
            <div className="w-7 h-7 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-[#F97316]" />
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated Card */}
      <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-5 lg:p-6 flex flex-col justify-between">
        <h3 className="text-[13px] font-semibold text-slate-500 mb-3">Last Updated</h3>
        <div>
          <div className="flex items-baseline gap-2 mb-5">
            <span className="text-2xl font-bold text-slate-900 leading-none">2 min ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium text-[11px]">Today, 10:30 AM</span>
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
