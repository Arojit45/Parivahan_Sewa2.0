import React from 'react';

const ChallanPayOnlineWidget = () => {
  return (
    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 shadow-sm mt-6 relative overflow-hidden">
      <div className="relative z-10 w-2/3">
        <h3 className="font-bold text-slate-900 mb-2">Pay Challan Online</h3>
        <p className="text-[11px] text-emerald-800 font-medium mb-4 pr-4">
          Pay securely using UPI, Cards, Net Banking and Wallets.
        </p>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm">
          Pay Now
        </button>
      </div>
      
      {/* Decorative UPI/Payment Graphic */}
      <div className="absolute right-0 bottom-0 h-full w-1/2 flex items-center justify-end pr-2 opacity-90 pointer-events-none">
         <div className="w-16 h-24 bg-white rounded-xl shadow-md border border-slate-100 flex flex-col items-center justify-center relative translate-y-2 translate-x-2">
            <div className="text-sm font-black text-slate-800 tracking-tighter">UPI</div>
            <div className="w-10 h-1 bg-slate-200 mt-2 rounded"></div>
            <div className="w-6 h-1 bg-slate-200 mt-1 rounded"></div>
            <div className="absolute -left-4 -bottom-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
               ₹
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChallanPayOnlineWidget;
