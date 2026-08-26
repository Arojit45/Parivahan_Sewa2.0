import React from 'react';
import { FileText, Scale, Settings, ChevronRight } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm mt-6">
      <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-1">
        <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">Payment History</div>
              <div className="text-[11px] text-slate-500">View all payments</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
        </a>

        <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 group-hover:text-red-600 transition-colors">Dispute History</div>
              <div className="text-[11px] text-slate-500">Track your disputes</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
        </a>

        <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">Challan Preferences</div>
              <div className="text-[11px] text-slate-500">Manage notifications</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </a>
      </div>
    </div>
  );
};

export default QuickActions;
