import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { MessageSquare } from 'lucide-react';

const ChallanHelpWidget = () => {
  const { t } = useLanguage();
  const c = t.challan || {};
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm mt-6 flex flex-col items-center text-center">
      <h3 className="font-bold text-slate-800 w-full text-left mb-4">{c.needHelp || "Need Help?"}</h3>
      
      <div className="w-32 h-32 mb-4">
        <img src="/need help.png" alt="Help Assistant" className="w-full h-full object-contain" />
      </div>
      
      <p className="text-sm text-slate-600 mb-5">
        {c.helpDesc || "Chat with our assistant for any challan related help."}
      </p>
      
      <button className="flex items-center gap-2 bg-white border border-blue-200 text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-sm">
        <MessageSquare className="w-4 h-4" /> {c.askAssistant || "Ask Assistant"}
      </button>
    </div>
  );
};

export default ChallanHelpWidget;
