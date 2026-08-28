import React, { useState } from 'react';
import { CreditCard, Navigation, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDLWizard } from '../../contexts/DLWizardContext';
import WizardNav from './WizardNav';

const LL_NUMBER_PATTERN = /^[A-Z]{2}[0-9]{13}$/;

const Step4LLCheck = () => {
  const { wizard, updateFields, saveAndNext } = useDLWizard();
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const handleChoice = (hasLL) => {
    updateFields({ hasLL, llNumber: '', verified: false });
    setVerified(false);
    setVerifyError('');
  };

  const handleVerifyLL = () => {
    if (!LL_NUMBER_PATTERN.test(wizard.llNumber || '')) {
      setVerifyError('Enter LL number in this format: DL0120240012345');
      return;
    }
    // Mock verification
    setVerifying(true);
    setVerifyError('');
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1500);
  };

  const handleNext = () => {
    if (wizard.hasLL === null) return;
    if (wizard.hasLL && (!verified || !LL_NUMBER_PATTERN.test(wizard.llNumber || ''))) {
      setVerifyError('Please verify a valid Learner\'s Licence number before continuing.');
      return;
    }
    saveAndNext({
      hasLL: wizard.hasLL,
      llNumber: wizard.hasLL ? wizard.llNumber : '',
    });
  };

  const isNextDisabled = wizard.hasLL === null || (wizard.hasLL === true && (!verified || !LL_NUMBER_PATTERN.test(wizard.llNumber || '')));

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">4</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 4 of 9</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Do you already have a Learner's Licence?</h2>
        <p className="text-slate-500 text-sm font-medium">A Learner's Licence is required before you can apply for a full Driving Licence.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-6 flex flex-col gap-5">
        {/* Choice cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Yes */}
          <button
            onClick={() => handleChoice(true)}
            className={`p-6 rounded-2xl border-2 text-left transition-all
              ${wizard.hasLL === true
                ? 'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
          >
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Yes, I have an LL</h4>
            <p className="text-xs text-slate-500 font-medium">I already hold a valid Learner's Licence and want to apply for a full DL.</p>
          </button>

          {/* No */}
          <button
            onClick={() => handleChoice(false)}
            className={`p-6 rounded-2xl border-2 text-left transition-all
              ${wizard.hasLL === false
                ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Navigation className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">No, I need an LL first</h4>
            <p className="text-xs text-slate-500 font-medium">I need to apply for a Learner's Licence before proceeding. I'll apply on the Sarathi portal.</p>
          </button>
        </div>

        {/* LL number input */}
        {wizard.hasLL === true && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h4 className="font-bold text-slate-800 text-sm mb-3">Enter your Learner's Licence Number</h4>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. DL0120240012345"
                value={wizard.llNumber}
                onChange={e => {
                  updateFields({ llNumber: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15) });
                  setVerified(false);
                  setVerifyError('');
                }}
                maxLength={15}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
              <button
                onClick={handleVerifyLL}
                disabled={verifying || verified}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shrink-0 
                  ${verified ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60'}`}
              >
                {verifying ? 'Verifying...' : verified ? '✓ Verified' : 'Verify'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-medium">Format: 2 letters followed by 13 digits, for example DL0120240012345.</p>
            {verifyError && <p className="text-red-500 text-xs mt-2 font-medium">{verifyError}</p>}
            {verified && (
              <div className="flex items-center gap-2 mt-3 text-emerald-600 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Learner's Licence verified successfully
              </div>
            )}
          </div>
        )}

        {/* No LL guidance */}
        {wizard.hasLL === false && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-800 text-sm mb-2">You'll need a Learner's Licence first</h4>
                <p className="text-xs text-amber-700 font-medium mb-3">Apply for your Learner's Licence on the official Sarathi portal. Once you receive it and hold it for 30 days, you can return here to continue your DL application.</p>
                <a
                  href="https://sarathi.parivahan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs font-bold bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Go to Sarathi Portal →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <WizardNav onNext={handleNext} disabledNext={isNextDisabled} />
    </div>
  );
};

export default Step4LLCheck;
