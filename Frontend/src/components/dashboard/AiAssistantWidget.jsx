import React from 'react';
import { Bot, Send } from 'lucide-react';

const AiAssistantWidget = () => {
  return (
    <div className="bg-[#F8FAFC] rounded-[1.25rem] border border-slate-200 p-6 flex flex-col flex-1 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
           <img src="/Ai asistance.png" alt="AI" className="w-full h-full object-contain drop-shadow-md" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Ask My Vehicle <span className="text-slate-500 font-normal">(AI Assistant)</span></h2>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-4">
        <div className="flex gap-3">
           <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
             <Bot className="w-3 h-3 text-blue-600" />
           </div>
           <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3 shadow-sm">
             <p className="text-xs text-slate-700"><strong>Hello Amit! 👋</strong><br/><br/>I can help you with your vehicle. Ask me anything!</p>
           </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <button className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">When is my PUC expiry?</button>
          <button className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">Do I have any pending challans?</button>
          <button className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">When is my insurance renewal?</button>
          <button className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">What documents do I need for RC renewal?</button>
        </div>
      </div>

      <div className="relative mt-auto">
        <input 
          type="text" 
          placeholder="Type your question..." 
          className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all shadow-inner"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AiAssistantWidget;
