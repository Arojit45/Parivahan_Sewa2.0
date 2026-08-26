import React, { useMemo } from 'react';
import { CheckCircle2, XCircle, User, Calendar, Home, CreditCard } from 'lucide-react';
import { useDLWizard } from '../../contexts/DLWizardContext';
import { VEHICLE_CLASSES } from '../../data/indiaData';
import WizardNav from './WizardNav';

const Step5Eligibility = () => {
  const { wizard, updateFields, saveAndNext } = useDLWizard();

  const selectedClass = VEHICLE_CLASSES.find(v => v.code === wizard.vehicleClass);
  const minAge = selectedClass?.minAge || 18;

  const age = useMemo(() => {
    if (!wizard.dob) return null;
    const today = new Date();
    const dob = new Date(wizard.dob);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }, [wizard.dob]);

  const isAgeEligible = age !== null && age >= minAge;
  const isFormComplete = wizard.applicantName && wizard.dob && wizard.address && wizard.aadharNumber?.length === 12;
  const isEligible = isFormComplete && isAgeEligible;

  const handleNext = () => {
    if (!isFormComplete) return;
    saveAndNext({
      applicantName: wizard.applicantName,
      dob: wizard.dob,
      address: wizard.address,
      aadharNumber: wizard.aadharNumber,
      isEligible,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">5</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 5 of 9</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Are you eligible to proceed?</h2>
        <p className="text-slate-500 text-sm font-medium">Fill in your details. We'll check your eligibility automatically.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Full Name (as per Aadhaar)</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={wizard.applicantName}
                onChange={e => updateFields({ applicantName: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Date of Birth</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={wizard.dob || ''}
                max={new Date().toISOString().split('T')[0]}
                onChange={e => updateFields({ dob: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            {/* Age check result */}
            {age !== null && (
              <div className={`flex items-center gap-2 mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg
                ${isAgeEligible ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {isAgeEligible
                  ? <><CheckCircle2 className="w-3.5 h-3.5" /> Age {age} — Eligible for {wizard.vehicleClass}</>
                  : <><XCircle className="w-3.5 h-3.5" /> Age {age} — Must be at least {minAge} years old for {wizard.vehicleClass}</>
                }
              </div>
            )}
          </div>

          {/* Aadhaar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Aadhaar Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="12-digit Aadhaar number"
                value={wizard.aadharNumber}
                onChange={e => updateFields({ aadharNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                maxLength={12}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
            {wizard.aadharNumber && wizard.aadharNumber.length < 12 && (
              <p className="text-xs text-amber-600 mt-1 font-medium">{12 - wizard.aadharNumber.length} digits remaining</p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Address (as per Aadhaar)</label>
            <div className="relative">
              <Home className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <textarea
                rows={3}
                placeholder="Enter your complete address"
                value={wizard.address}
                onChange={e => updateFields({ address: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Eligibility summary */}
        {isFormComplete && (
          <div className={`mt-6 rounded-2xl p-5 border-2 ${isEligible ? 'border-emerald-300 bg-emerald-50' : 'border-red-300 bg-red-50'}`}>
            <div className="flex items-center gap-3">
              {isEligible
                ? <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                : <XCircle className="w-8 h-8 text-red-500 shrink-0" />
              }
              <div>
                <h4 className={`font-bold text-base ${isEligible ? 'text-emerald-800' : 'text-red-800'}`}>
                  {isEligible ? '✅ You are eligible to proceed!' : '❌ Eligibility issue found'}
                </h4>
                <p className={`text-xs mt-0.5 font-medium ${isEligible ? 'text-emerald-700' : 'text-red-700'}`}>
                  {isEligible
                    ? `All requirements are met for ${selectedClass?.name}.`
                    : `You must be at least ${minAge} years old for ${wizard.vehicleClass}.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <WizardNav onNext={handleNext} disabledNext={!isFormComplete || !isEligible} />
    </div>
  );
};

export default Step5Eligibility;
