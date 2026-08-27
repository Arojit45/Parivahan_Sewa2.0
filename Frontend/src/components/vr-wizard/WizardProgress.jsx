import React from 'react';
import { Check } from 'lucide-react';
import { useVRWizard } from '../../contexts/VRWizardContext';
import { useLanguage } from '../../contexts/LanguageContext';

const STEPS = [
  { num: 1 },
  { num: 2 },
  { num: 3 },
  { num: 4 },
  { num: 5 },
  { num: 6 },
  { num: 7 },
  { num: 8 }
];

const WizardProgress = () => {
  const { wizard, goToStep } = useVRWizard();
  const { t } = useLanguage();
  const { currentStep, lastCompletedStep } = wizard;

  return (
    <div className="relative pl-2 py-4">
      <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-100" />
      
      <div className="space-y-6">
        {STEPS.map((s, idx) => {
          const isCompleted = s.num <= lastCompletedStep;
          const isActive = s.num === currentStep;
          const isFuture = s.num > lastCompletedStep + 1 && !isActive;
          const isClickable = s.num <= lastCompletedStep + 1;
          
          let stateColor = 'bg-white border-slate-200 text-slate-300';
          let textColor = 'text-slate-400';
          let lineClasses = 'bg-slate-100';

          if (isActive) {
            stateColor = 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100';
            textColor = 'text-blue-700 font-bold';
            lineClasses = 'bg-blue-600';
          } else if (isCompleted) {
            stateColor = 'bg-emerald-500 border-emerald-500 text-white';
            textColor = 'text-emerald-700 font-semibold';
            lineClasses = 'bg-emerald-500';
          }

          return (
            <div key={s.num} className="relative z-10 group">
              <button
                onClick={() => isClickable && goToStep(s.num)}
                disabled={!isClickable}
                className={`flex items-start gap-4 text-left w-full ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'} ${isFuture ? 'opacity-60' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all duration-300 ${stateColor} shrink-0 mt-0.5`}>
                  {isCompleted && !isActive ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isActive ? 'text-blue-500' : 'text-slate-400'}`}>
                    Step {s.num}
                  </p>
                  <p className={`text-xs ${textColor} leading-tight`}>
                    {t.vr.progress[s.num]}
                  </p>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;
