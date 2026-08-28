import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { useVRWizard } from '../../contexts/VRWizardContext';
import WizardNav from './WizardNav';

const VEHICLE_CATEGORIES = ['New Vehicle', 'Used Vehicle', 'Imported Vehicle', 'Other'];
const USAGE_TYPES = ['Private', 'Commercial'];
const VEHICLE_TYPES = ['Two Wheeler', 'Car', 'Transport Vehicle', 'Other'];

const Step3Eligibility = () => {
  const { wizard, updateFields, saveAndNext } = useVRWizard();
  const { vehicleCategory, usageType, vehicleType, isEligible } = wizard;

  const handleNext = () => {
    saveAndNext({ 
      vehicleCategory, 
      usageType, 
      vehicleType, 
      isEligible: true // Auto-eligible for now as per requirements
    });
  };

  const isFormComplete = vehicleCategory && usageType && vehicleType;

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">3</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 3 of 8</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Check Vehicle Eligibility</h2>
        <p className="text-slate-500 text-sm font-medium">Provide details about the vehicle to confirm your registration eligibility.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-4 space-y-6">
        {/* Vehicle Category */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700">What are you registering?</label>
          <div className="grid grid-cols-2 gap-3">
            {VEHICLE_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => updateFields({ vehicleCategory: cat })}
                className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  vehicleCategory === cat
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Usage Type */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700">Private or Commercial?</label>
          <div className="grid grid-cols-2 gap-3">
            {USAGE_TYPES.map(type => (
              <button
                key={type}
                onClick={() => updateFields({ usageType: type })}
                className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  usageType === type
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700">Vehicle Type</label>
          <div className="grid grid-cols-2 gap-3">
            {VEHICLE_TYPES.map(type => (
              <button
                key={type}
                onClick={() => updateFields({ vehicleType: type })}
                className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  vehicleType === type
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Eligibility Result (Simulated) */}
        {isFormComplete && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 mt-4">
            <div className="mt-0.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800">You are eligible to register!</p>
              <p className="text-xs text-emerald-600 mt-1">
                Based on the provided details ({vehicleCategory}, {usageType}, {vehicleType}), you can proceed with the registration process.
              </p>
            </div>
          </div>
        )}
      </div>

      <WizardNav onNext={handleNext} disabledNext={!isFormComplete} />
    </div>
  );
};

export default Step3Eligibility;
