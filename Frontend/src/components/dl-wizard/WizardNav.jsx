import React from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useDLWizard } from '../../contexts/DLWizardContext';

const WizardNav = ({ onNext, nextLabel = 'Save & Continue', disabledNext = false }) => {
  const { wizard, goBack } = useDLWizard();
  const { currentStep, isSaving, error } = wizard;

  return (
    <div className="border-t border-slate-100 bg-white px-8 py-4 flex items-center justify-between gap-4 shrink-0">
      {/* Error message */}
      <div className="flex-1">
        {error && (
          <p className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
            ⚠️ {error}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {currentStep > 1 && (
          <button
            onClick={goBack}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <button
          onClick={onNext}
          disabled={isSaving || disabledNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-md shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {nextLabel}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WizardNav;
