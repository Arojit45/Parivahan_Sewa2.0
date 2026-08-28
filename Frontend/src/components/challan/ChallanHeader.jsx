import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const ChallanHeader = () => {
  const { t } = useLanguage();
  // Fallback if t.challan is undefined for some languages
  const c = t.challan || {};

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">{c.challans || "Challans"}</h1>
        <p className="text-sm text-slate-500 mt-1">{c.challansSubtitle || "View, pay and manage all your vehicle challans"}</p>
      </div>

      <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl border border-blue-100">
        <ShieldAlert className="w-5 h-5" />
        <span className="text-sm font-medium">{c.payOnTimeMsg || "Pay on time, stay compliant and avoid extra charges."}</span>
        <button className="ml-2 hover:bg-blue-100 p-1 rounded-full transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChallanHeader;
