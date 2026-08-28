import React, { useState } from 'react';
import { MapPin, Car, Calendar, Clock, CreditCard, User, CheckCircle2, Loader2, PartyPopper } from 'lucide-react';
import { useDLWizard } from '../../contexts/DLWizardContext';
import { VEHICLE_CLASSES } from '../../data/indiaData';

const Step8Application = () => {
  const { wizard, processMockPayment } = useDLWizard();
  const [paymentStep, setPaymentStep] = useState('review'); // review | processing | success | failed

  const selectedClass = VEHICLE_CLASSES.find(v => v.code === wizard.vehicleClass);

  const handlePay = async () => {
    setPaymentStep('processing');
    // Simulated 2-second "payment processing" delay
    setTimeout(async () => {
      await processMockPayment();
      setPaymentStep('success');
    }, 2000);
  };

  const reviewItems = [
    { icon: MapPin, label: "State & RTO", value: `${wizard.state} â€” ${wizard.rtoName}` },
    { icon: Car, label: "Vehicle Class", value: `${selectedClass?.name || wizard.vehicleClass} (${wizard.vehicleClass})` },
    { icon: User, label: "Applicant", value: `${wizard.applicantName} | DOB: ${wizard.dob ? new Date(wizard.dob).toLocaleDateString('en-IN') : 'N/A'}` },
    { icon: Calendar, label: "Appointment", value: wizard.appointmentDate ? new Date(wizard.appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
    { icon: Clock, label: "Time Slot", value: wizard.appointmentSlot || 'N/A' },
    { icon: MapPin, label: "Aadhaar", value: wizard.aadharNumber ? `XXXX XXXX ${wizard.aadharNumber.slice(-4)}` : 'N/A' },
  ];

  if (paymentStep === 'processing') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 gap-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900">Processing Payment...</h3>
          <p className="text-slate-500 text-sm font-medium mt-1">Please do not close this window.</p>
        </div>
        <div className="w-64 bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-[progress_2s_linear_forwards] w-full origin-left" />
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 gap-6 text-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200">
          <CheckCircle2 className="w-14 h-14 text-emerald-600" />
        </div>
        <div>
          <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Payment Successful</p>
          <h3 className="text-3xl font-extrabold text-slate-900">â‚¹{wizard.feeAmount} Paid!</h3>
          <p className="text-slate-500 text-sm mt-2 font-medium">Your Driving Licence application has been submitted.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-sm text-left space-y-3 shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Application No.</span>
            <span className="font-bold text-blue-700 font-mono text-xs">{wizard.applicationNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Transaction ID</span>
            <span className="font-bold text-slate-700 font-mono text-xs">{wizard.paymentTransactionId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 font-medium">Status</span>
            <span className="font-bold text-emerald-600">SUBMITTED âœ“</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Your application number is <strong className="text-slate-600">{wizard.applicationNumber}</strong>. 
          Use it to track your application status in the next step.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">8</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 8 of 9</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Complete your application.</h2>
        <p className="text-slate-500 text-sm font-medium">Review your application details and proceed to payment.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-5">
        {/* Review Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <h4 className="font-bold text-slate-900 text-sm mb-4">Application Summary</h4>
          <div className="space-y-3">
            {reviewItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.label}</p>
                  <p className="font-semibold text-slate-800 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Box */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide">Application Fee</p>
              <p className="text-4xl font-extrabold mt-1">â‚¹{wizard.feeAmount || selectedClass?.fee || '700'}</p>
              <p className="text-blue-200 text-xs mt-1">For {selectedClass?.name} ({wizard.vehicleClass})</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="text-xs text-blue-200 font-medium mb-5 bg-white/10 rounded-xl px-3 py-2">
            ðŸ”’ Secure payment. This is a simulated payment â€” no real money will be charged.
          </div>

          <button
            onClick={handlePay}
            className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Pay â‚¹{wizard.feeAmount || selectedClass?.fee || '700'} Now
          </button>
        </div>

        {/* Trust note */}
        <div className="flex items-center justify-center gap-6 text-[10px] text-slate-400 font-semibold">
          <span>ðŸ”’ 256-bit SSL Encrypted</span>
          <span>ðŸ›ï¸ Government of India</span>
          <span>âœ… RBI Compliant</span>
        </div>
      </div>
    </div>
  );
};

export default Step8Application;
