import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import { DLWizardProvider, useDLWizard } from '../contexts/DLWizardContext';
import WizardProgress from '../components/dl-wizard/WizardProgress';
import Step1State from '../components/dl-wizard/Step1State';
import Step2RTO from '../components/dl-wizard/Step2RTO';
import Step3VehicleClass from '../components/dl-wizard/Step3VehicleClass';
import Step4LLCheck from '../components/dl-wizard/Step4LLCheck';
import Step5Eligibility from '../components/dl-wizard/Step5Eligibility';
import Step6Documents from '../components/dl-wizard/Step6Documents';
import Step7Appointment from '../components/dl-wizard/Step7Appointment';
import Step8Application from '../components/dl-wizard/Step8Application';
import Step9Tracking from '../components/dl-wizard/Step9Tracking';
import { RotateCcw } from 'lucide-react';
import AudioGuide from '../components/AudioGuide';

const STEP_COMPONENTS = {
  1: Step1State,
  2: Step2RTO,
  3: Step3VehicleClass,
  4: Step4LLCheck,
  5: Step5Eligibility,
  6: Step6Documents,
  7: Step7Appointment,
  8: Step8Application,
  9: Step9Tracking,
};

const STEP_TITLES = {
  1: "Where are you applying?",
  2: "Which RTO?",
  3: "What vehicle do you want to drive?",
  4: "Do you already have a Learner's Licence?",
  5: "Are you eligible to proceed?",
  6: "Here's exactly what you need.",
  7: "Book your appointment.",
  8: "Complete your application.",
  9: "Track your application.",
};

const WizardContent = () => {
  const { wizard } = useDLWizard();
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
              Resuming your previous application from Step {currentStep} â€” your progress has been restored.
            </div>
          )}

          <div className="flex-1 flex overflow-hidden">
            {/* Left Rail â€” Steps Progress */}
            <div className="w-56 xl:w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 overflow-hidden">
              {/* Header */}
              <div className="px-4 pt-5 pb-3 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Driving Licence</p>
                  <h2 className="text-sm font-bold text-slate-800 mt-0.5">Application Wizard</h2>
                </div>
                <AudioGuide textToRead={STEP_TITLES[currentStep]} readElementId="dl-step-content" />
              </div>

              {/* Progress */}
              <div className="flex-1 overflow-y-auto px-3 py-3">
                <WizardProgress />
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                Step {currentStep} of 9
              </div>
            </div>

            {/* Right â€” Active Step */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
              <div id="dl-step-content" className="flex-1 overflow-hidden bg-white m-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                <ActiveStep />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// The page wraps content in DLWizardProvider
const DrivingLicenseWizardPage = () => (
  <DLWizardProvider>
    <WizardContent />
  </DLWizardProvider>
);

export default DrivingLicenseWizardPage;
