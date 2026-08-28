import React from 'react';
import { useDLWizard } from '../../contexts/DLWizardContext';
import { VEHICLE_CLASSES } from '../../data/indiaData';
import WizardNav from './WizardNav';
import { Info } from 'lucide-react';

const Step3VehicleClass = () => {
  const { wizard, updateFields, saveAndNext } = useDLWizard();

  const handleSelect = (vc) => {
    updateFields({ vehicleClass: vc.code });
  };

  const handleNext = () => {
    if (!wizard.vehicleClass) return;
    saveAndNext({ vehicleClass: wizard.vehicleClass });
  };

  const selected = VEHICLE_CLASSES.find(v => v.code === wizard.vehicleClass);

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">3</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 3 of 9</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">What vehicle do you want to drive?</h2>
        <p className="text-slate-500 text-sm font-medium">Choose the vehicle class you want to get licenced for.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VEHICLE_CLASSES.map(vc => {
            const isSelected = wizard.vehicleClass === vc.code;
            return (
              <button
                key={vc.code}
                onClick={() => handleSelect(vc)}
                className={`flex flex-col gap-2 p-4 rounded-2xl border-2 text-left transition-all
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl">{vc.icon}</span>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {vc.code}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Fee: ₹{vc.fee}</span>
                  </div>
                </div>

                <div>
                  <h4 className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>{vc.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{vc.description}</p>
                </div>

                <div className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2 py-1 mt-1
                  ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-50 text-slate-500'}`}>
                  <Info className="w-3 h-3 shrink-0" />
                  Min age: {vc.minAge} years
                </div>

                <p className="text-[10px] text-slate-400 font-medium truncate">{vc.examples}</p>
              </button>
            );
          })}
        </div>

        {/* Fee info */}
        {selected && (
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Application Fee for {selected.name}</p>
              <p className="text-2xl font-extrabold text-amber-700 mt-1">₹{selected.fee}</p>
              <p className="text-xs text-amber-600 mt-1">Payable at Step 8. You must be at least {selected.minAge} years old to apply.</p>
            </div>
          </div>
        )}
      </div>

      <WizardNav onNext={handleNext} disabledNext={!wizard.vehicleClass} />
    </div>
  );
};

export default Step3VehicleClass;
