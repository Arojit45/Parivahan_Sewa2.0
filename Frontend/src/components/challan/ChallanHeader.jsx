import React from 'react';
import { Plus, X } from 'lucide-react';

const ChallanHeader = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Top section: Title and Alert */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Challans</h1>
          <p className="text-slate-500 text-sm mt-1">View, pay and manage all your vehicle challans</p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 text-blue-700 px-4 py-2.5 rounded-lg flex items-center justify-between gap-4 border border-blue-100">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11.9941 16H12.0031" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Pay on time, stay compliant and avoid extra charges.</span>
          </div>
          <button className="text-blue-500 hover:text-blue-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selectors Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 bg-white p-2 rounded-xl shadow-sm border border-slate-100 w-full sm:w-auto">
          {/* Vehicle Dropdown */}
          <div className="px-3 py-1 flex flex-col justify-center min-w-[200px]">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">All Vehicles</label>
            <div className="flex items-center justify-between cursor-pointer">
              <span className="text-slate-800 font-semibold text-sm">All Vehicles</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          
          <div className="hidden sm:block w-px bg-slate-100 my-1"></div>

          {/* Total Vehicles Info */}
          <div className="px-3 py-1 flex flex-col justify-center min-w-[120px]">
            <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">Total Vehicles</label>
            <span className="text-slate-800 font-semibold text-sm">3</span>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>
    </div>
  );
};

export default ChallanHeader;
