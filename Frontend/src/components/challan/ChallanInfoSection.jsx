import React from 'react';
import { Link } from 'react-router-dom';
import { Info, Settings, Scale, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const ChallanInfoSection = () => {
  const { t } = useLanguage();
  const c = t.challan || {};
  const g = c.guide || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-[#FFF9E5] rounded-xl p-5 border border-[#FFEAB5] flex gap-4">
        <div className="w-10 h-10 rounded-full bg-[#FFEAB5] text-[#D97706] flex items-center justify-center shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-1">{g.understandTitle || 'Why do I have this challan?'}</h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            Traffic rules are in place to ensure everyone's safety.
          </p>
          <Link to="/challan/why-do-i-have-this-challan" className="text-blue-600 text-xs font-semibold flex items-center hover:underline">
            {g.understandViolation || 'Learn more about common violations'} <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>

      <div className="bg-[#F0F9FF] rounded-xl p-5 border border-[#BAE6FD] flex gap-4">
        <div className="w-10 h-10 rounded-full bg-[#BAE6FD] text-[#0284C7] flex items-center justify-center shrink-0">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-1">{g.payTitle || 'How to pay?'}</h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            You can pay online instantly and get digital receipt.
          </p>
          <Link to="/challan/how-to-pay" className="text-blue-600 text-xs font-semibold flex items-center hover:underline">
            {g.viewPaymentGuide || 'View payment guide'} <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>

      <div className="bg-[#F8FAFC] rounded-xl p-5 border border-[#E2E8F0] flex gap-4">
        <div className="w-10 h-10 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center shrink-0">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-1">{g.disagreeTitle || 'Disagree with challan?'}</h3>
          <p className="text-xs text-slate-600 mb-3 leading-relaxed">
            You can challenge this challan if you believe it is incorrect.
          </p>
          <Link to="/challan/disagree" className="text-blue-600 text-xs font-semibold flex items-center hover:underline">
            {g.knowHowToChallenge || 'Know how to challenge'} <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChallanInfoSection;
