import React from 'react';
import { Check, Circle } from 'lucide-react';
import { useDLWizard } from '../../contexts/DLWizardContext';

const STEPS = [
  { num: 1, label: "State" },
  { num: 2, label: "RTO" },
  { num: 3, label: "Vehicle" },
  { num: 4, label: "Learner's Licence" },
  { num: 5, label: "Eligibility" },
  { num: 6, label: "Documents" },
  { num: 7, label: "Appointment" },
  { num: 8, label: "Payment" },
  { num: 9, label: "Tracking" },
];

const WizardProgress = () => {
  const { wizard, goToStep } = useDLWizard();
  const { currentStep, lastCompletedStep } = wizard;

  return (
    <div className="flex flex-col gap-1 py-2">
      {STEPS.map((step) => {
        const isCompleted = step.num <= lastCompletedStep;
        const isActive = step.num === currentStep;
        const isAccessible = step.num <= lastCompletedStep + 1;

        return (
          <button
            key={step.num}
            onClick={() => isAccessible && goToStep(step.num)}
            disabled={!isAccessible}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all w-full
              ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' :
                isCompleted ? 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-700' :
                isAccessible ? 'text-slate-500 hover:bg-slate-50' :
                'text-slate-300 cursor-not-allowed opacity-50'}`}
          >
            {/* Step indicator */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all
              ${isActive ? 'bg-white/20 text-white' :
                isCompleted ? 'bg-emerald-100 text-emerald-600' :
                'bg-slate-100 text-slate-400'}`}
            >
              {isCompleted && !isActive ? <Check className="w-3.5 h-3.5" /> : step.num}
            </div>

            <span className={`text-sm font-semibold truncate ${isActive ? 'text-white' : ''}`}>
              {step.label}
            </span>

            {isCompleted && !isActive && (
              <span className="ml-auto text-emerald-500 text-[10px] font-bold">✓</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default WizardProgress;
