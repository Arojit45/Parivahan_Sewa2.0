import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import { VRWizardProvider, useVRWizard } from '../contexts/VRWizardContext';
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

const STEP_TITLES = {
  1: "Where are you registering?",
  2: "Select your RTO",
  3: "Check Vehicle Eligibility",
  4: "Upload Required Documents",
  5: "Fee Estimation",
  6: "Book RTO Inspection",
  7: "Review & Submit",
  8: "Track Registration Status",
};

const WizardContent = () => {
  const { wizard } = useVRWizard();
  const { currentStep, isResuming } = wizard;

  const ActiveStep = STEP_COMPONENTS[currentStep] || Step1State;

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
              Resuming your previous application from Step {currentStep} — your progress has been restored.
            </div>
          )}

          <div className="flex-1 flex overflow-hidden">
            {/* Left Rail — Steps Progress */}
            <div className="w-56 xl:w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 overflow-hidden">
              {/* Header */}
              <div className="px-4 pt-5 pb-3 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehicle Registration</p>
                  <h2 className="text-sm font-bold text-slate-800 mt-0.5">Registration Wizard</h2>
                </div>
                <AudioGuide textToRead={STEP_TITLES[currentStep]} />
              </div>

              {/* Progress */}
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <WizardProgress />
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                Step {currentStep} of 8
              </div>
            </div>

            {/* Right — Active Step */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
              <div className="flex-1 overflow-hidden bg-white m-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
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
