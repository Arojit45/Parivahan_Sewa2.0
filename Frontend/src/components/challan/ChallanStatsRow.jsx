import React from 'react';
import { FileText, Wallet, Clock, CheckCircle2 } from 'lucide-react';
import { challanStats } from '../../data/mockChallans';

const ChallanStatsRow = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {/* Total Challans */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[13px] font-bold text-slate-500 tracking-wide uppercase">Total Challans</span>
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-red-500">{challanStats.total}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">All time</p>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <span className="text-[13px] font-bold text-orange-500 tracking-wide uppercase">Pending Amount</span>
          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-orange-500">₹ {challanStats.pendingAmount.toLocaleString()}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">To be paid</p>
        </div>
      </div>

      {/* Overdue Challans */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[13px] font-bold text-red-500 tracking-wide uppercase">Overdue Challans</span>
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-red-500">{String(challanStats.overdueCount).padStart(2, '0')}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Total ₹ {challanStats.overdueAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Paid Challans */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[13px] font-bold text-emerald-600 tracking-wide uppercase">Paid Challans</span>
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-emerald-600">{String(challanStats.paidCount).padStart(2, '0')}</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Total ₹ {challanStats.paidAmount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ChallanStatsRow;
