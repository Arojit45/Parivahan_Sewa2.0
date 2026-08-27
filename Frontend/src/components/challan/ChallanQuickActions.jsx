import React from 'react';
import { FileText, Scale } from 'lucide-react';
import { useChallan } from '../../contexts/ChallanContext';

const QuickActions = () => {
  const { openPaymentHistoryModal, openDisputeHistoryModal } = useChallan();

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm mt-6">
      <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-4">
        
        <button 
          onClick={openPaymentHistoryModal}
          className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Payment History</h4>
              <p className="text-xs text-slate-500">View all payments</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button 
          onClick={openDisputeHistoryModal}
          className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-red-200 hover:bg-red-50/50 transition-all group text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Dispute History</h4>
              <p className="text-xs text-slate-500">Track your disputes</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-slate-300 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>
    </div>
  );
};

export default QuickActions;
