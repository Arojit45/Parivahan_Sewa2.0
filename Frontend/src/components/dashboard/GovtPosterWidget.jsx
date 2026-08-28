import React from 'react';
import { ShieldAlert } from 'lucide-react';

const GovtPosterWidget = () => {
  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-200 overflow-hidden shadow-sm flex flex-col relative group cursor-pointer flex-1 min-h-[150px]">
      {/* Background Image Wrapper */}
      <div className="relative flex-1 w-full overflow-hidden bg-slate-900">
        <img 
          src="/road.png" 
          alt="Road Safety" 
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
             e.target.style.display = 'none';
             e.target.parentElement.classList.add('bg-gradient-to-br', 'from-blue-900', 'to-slate-900');
          }}
        />
        {/* Overlay content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
          <div className="flex justify-between items-start">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-2">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <img src="/govtLogo.png" alt="Govt Logo" className="h-8 brightness-0 invert opacity-90" />
          </div>
          
          <div>
            <h3 className="text-white font-bold text-[17px] leading-tight mb-1">
              Road Safety <br/> is No Accident
            </h3>
            <p className="text-white/80 text-[11px] font-medium max-w-[80%]">
              Follow traffic rules, wear seatbelts, and drive responsibly.
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom Action Bar */}
      <div className="bg-blue-600 p-3 flex justify-between items-center group-hover:bg-blue-700 transition-colors">
        <span className="text-white text-[11px] font-semibold tracking-wide">
          MINISTRY OF ROAD TRANSPORT & HIGHWAYS
        </span>
        <span className="text-white/80 text-[16px] leading-none">&rsaquo;</span>
      </div>
    </div>
  );
};

export default GovtPosterWidget;
