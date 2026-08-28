import React from 'react';
import { CheckCircle2, FileText, Activity } from 'lucide-react';
import { useVRWizard } from '../../contexts/VRWizardContext';

const Step8Tracking = () => {
  const { wizard } = useVRWizard();
  const { applicationNumber, paymentTransactionId } = wizard;

  return (
    <div className="flex flex-col h-full bg-slate-50 items-center justify-center p-8">
      
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Application Submitted!</h2>
      <p className="text-slate-500 text-sm font-medium text-center mb-8 max-w-md">
        Your vehicle registration application has been successfully submitted. You can track its progress from your dashboard.
      </p>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md space-y-4">
        
        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Application Number</p>
            <p className="text-lg font-bold text-slate-800 tracking-tight">{applicationNumber || 'VR-XX-2026-000000'}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
           <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Payment Transaction</p>
            <p className="text-sm font-semibold text-slate-700">{paymentTransactionId || 'MOCK-TXN-12345'}</p>
            <p className="text-xs font-bold text-emerald-600 mt-0.5">Payment Successful</p>
          </div>
        </div>

      </div>

      <div className="mt-8 flex gap-4">
        <a 
          href="/"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
        >
          Go to Dashboard
        </a>
      </div>

    </div>
  );
};

export default Step8Tracking;
