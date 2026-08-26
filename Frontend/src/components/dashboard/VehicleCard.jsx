import React from 'react';
import { ChevronLeft, Edit2, Copy, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import CarModelViewer from '../CarModelViewer';

const VehicleCard = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row gap-8 relative overflow-hidden">
      
      {/* Title & Actions */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
         <button className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:underline">
           <ChevronLeft className="w-4 h-4" /> Back to My Vehicles
         </button>
      </div>

      {/* Image Area - Make it 360 viewer ready */}
      <div className="w-full md:w-1/3 pt-12 flex flex-col items-center justify-center relative cursor-grab active:cursor-grabbing">
        {/* 3D model */}
        <div className="w-[120%] h-48 relative flex items-center justify-center -ml-[10%]">
          <CarModelViewer />
        </div>
        <button className="mt-4 text-xs font-semibold text-slate-500 flex items-center gap-1 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors">
          <RefreshCw className="w-3 h-3" /> View 360°
        </button>
      </div>

      {/* Details */}
      <div className="w-full md:w-2/3 pt-12 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">Hyundai Creta</h1>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wider uppercase">Active</span>
              <button className="text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-3">
              <div className="border-2 border-slate-900 rounded px-3 py-1 font-mono font-bold text-lg bg-slate-50 shadow-sm flex items-center gap-3">
                 <span className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center p-[2px]"><div className="w-full h-full rounded-full bg-blue-600"></div></span>
                 WB12AB1234
              </div>
              <button className="text-slate-400 hover:text-blue-600"><Copy className="w-4 h-4" /></button>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-3">Petrol • LMV • SUV</p>
          </div>
          <button className="text-sm font-semibold text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            More Details <span className="text-slate-400">&gt;</span>
          </button>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Nickname</span>
            <span className="font-semibold text-slate-900">My Car</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Owner</span>
            <span className="font-semibold text-slate-900">Amit Kumar</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Registration Date</span>
            <span className="font-semibold text-slate-900">11 Sep 2022</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">RTO</span>
            <span className="font-semibold text-slate-900">Kolkata (WB-12)</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="text-slate-500">Insurance Provider</span>
            <span className="font-semibold text-slate-900">HDFC ERGO</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
