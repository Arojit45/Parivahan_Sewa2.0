import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import { VRWizardProvider, useVRWizard } from '../contexts/VRWizardContext';
import { useLanguage } from '../contexts/LanguageContext';
import WizardProgress from '../components/vr-wizard/WizardProgress';
import Step1State from '../components/vr-wizard/Step1State';
import Step2RTO from '../components/vr-wizard/Step2RTO';
import Step3Eligibility from '../components/vr-wizard/Step3Eligibility';
import Step4Documents from '../components/vr-wizard/Step4Documents';
import Step5Fees from '../components/vr-wizard/Step5Fees';
import Step6Appointment from '../components/vr-wizard/Step6Appointment';
import Step7Application from '../components/vr-wizard/Step7Application';
import Step8Tracking from '../components/vr-wizard/Step8Tracking';
import { RotateCcw } from 'lucide-react';
import AudioGuide from '../components/AudioGuide';

const STEP_COMPONENTS = {
  1: Step1State,
  2: Step2RTO,
  3: Step3Eligibility,
  4: Step4Documents,
  5: Step5Fees,
  6: Step6Appointment,
  7: Step7Application,
  8: Step8Tracking,
};

const WizardContent = () => {
  const { wizard } = useVRWizard();
  const { t } = useLanguage();
  const { currentStep, isResuming } = wizard;

  const ActiveStep = STEP_COMPONENTS[currentStep] || Step1State;
  
  const stepTitle = t.vr.steps[currentStep];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Resume banner */}
          {isResuming && (
            <div className="bg-blue-600 text-white text-center py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2 shrink-0">
              <RotateCcw className="w-4 h-4" />
              {t.vr.resumingBanner.replace('{step}', currentStep)}
            </div>
          )}

          <div className="flex-1 flex overflow-hidden">
            {/* Left Rail — Steps Progress */}
            <div className="w-56 xl:w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 overflow-hidden">
              {/* Header */}
              <div className="px-4 pt-5 pb-3 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.vr.wizardHeader}</p>
                  <h2 className="text-sm font-bold text-slate-800 mt-0.5">{t.vr.wizardTitle}</h2>
                </div>
                <AudioGuide textToRead={stepTitle} readElementId="vr-step-content" />
              </div>

              {/* Progress */}
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <WizardProgress />
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                {t.vr.stepOf.replace('{current}', currentStep).replace('{total}', '8')}
              </div>
            </div>

            {/* Right — Active Step */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
              <div id="vr-step-content" className="flex-1 overflow-hidden bg-white m-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                <ActiveStep />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const VehicleRegistrationWizardPage = () => (
  <VRWizardProvider>
    <WizardContent />
  </VRWizardProvider>
);

export default VehicleRegistrationWizardPage;
