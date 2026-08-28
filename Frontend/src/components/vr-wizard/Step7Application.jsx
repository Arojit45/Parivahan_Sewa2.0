import React from 'react';
import { FileText, MapPin, Receipt, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useVRWizard } from '../../contexts/VRWizardContext';

const Step7Application = () => {
  const { wizard, processMockPayment } = useVRWizard();
  const { 
    state, rtoName, vehicleCategory, usageType, vehicleType, 
    feeAmount, appointmentDate, appointmentSlot, isSaving
  } = wizard;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(d);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-8 pt-8 pb-6 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">7</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 7 of 8</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Review & Submit</h2>
        <p className="text-slate-500 text-sm font-medium">Review your application details and pay the registration fee.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              RTO Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 font-medium">State</p>
                <p className="text-sm font-semibold text-slate-700">{state}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Selected RTO</p>
                <p className="text-sm font-semibold text-slate-700">{rtoName}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Vehicle Details
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 font-medium">Category</p>
                <p className="text-sm font-semibold text-slate-700">{vehicleCategory} - {usageType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Type</p>
                <p className="text-sm font-semibold text-slate-700">{vehicleType}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              Inspection Appointment
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 font-medium">Date & Time</p>
                <p className="text-sm font-semibold text-slate-700">{formatDate(appointmentDate)} | {appointmentSlot}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-blue-600" />
              Payment Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-sm text-slate-600">Total Fees</p>
                <p className="text-sm font-bold text-slate-900">₹{((feeAmount || 0) + 250).toLocaleString()}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-slate-100 bg-white px-8 py-4 flex items-center justify-end shrink-0">
        <button
          onClick={processMockPayment}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              Pay & Submit Application
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step7Application;
