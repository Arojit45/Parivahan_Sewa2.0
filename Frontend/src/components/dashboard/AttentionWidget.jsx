import React from 'react';
import { Receipt, Leaf } from 'lucide-react';

const AttentionWidget = () => {
  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[15px] font-bold text-[#1e293b]">Things That Need Your Attention</h2>
        <button className="text-[13px] font-bold text-blue-600 hover:underline">View All &rsaquo;</button>
      </div>

      <div className="space-y-4">
        {/* Pending Challan */}
        <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-[0.8rem] bg-white border border-[#FEE2E2] shadow-sm text-red-500 flex items-center justify-center shrink-0">
            <Receipt className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-[13px] font-bold text-red-700">Pending Challan</h4>
            <p className="text-[11px] text-red-600/80 font-medium mt-0.5">1 challan pending</p>
            <p className="text-[11px] text-slate-700 font-bold mt-1">Amount: ₹1,000</p>
          </div>
          <button className="bg-white border border-red-200 text-red-600 text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
            View Challan
          </button>
        </div>

        {/* PUC Expiring */}
        <div className="bg-[#FEF3C7]/40 border border-[#FEF3C7] rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-[0.8rem] bg-white border border-[#FEF3C7] shadow-sm text-amber-500 flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-[13px] font-bold text-amber-700">PUC Expiring Soon</h4>
            <p className="text-[11px] text-amber-600/80 font-medium mt-0.5">Expires in 17 days on 11 Jun 2025</p>
          </div>
          <button className="bg-white border border-amber-200 text-amber-600 text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors">
            Renew PUC
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttentionWidget;
