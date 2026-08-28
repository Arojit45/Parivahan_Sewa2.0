import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, XCircle, Loader2, FileText, MapPin, Car, Calendar, Package } from 'lucide-react';
import { useDLWizard } from '../../contexts/DLWizardContext';

const STATUS_CONFIG = {
  DRAFT:         { color: 'slate',   icon: FileText,    label: 'Draft' },
  SUBMITTED:     { color: 'blue',    icon: Clock,       label: 'Submitted' },
  UNDER_REVIEW:  { color: 'amber',   icon: Clock,       label: 'Under Review' },
  TEST_SCHEDULED:{ color: 'purple',  icon: Calendar,    label: 'Test Scheduled' },
  PASS:          { color: 'emerald', icon: CheckCircle2,label: 'Test Passed' },
  FAIL:          { color: 'red',     icon: XCircle,     label: 'Test Failed' },
  DL_DISPATCHED: { color: 'emerald', icon: Package,     label: 'DL Dispatched' },
  REJECTED:      { color: 'red',     icon: XCircle,     label: 'Rejected' },
};

const TIMELINE_STEPS = [
  { key: 'SUBMITTED',      label: 'Application Submitted',    desc: 'Your application was received successfully.' },
  { key: 'UNDER_REVIEW',   label: 'Under Review',             desc: 'The RTO is reviewing your documents.' },
  { key: 'TEST_SCHEDULED', label: 'Driving Test Scheduled',   desc: 'Your slot has been confirmed at the RTO.' },
  { key: 'PASS',           label: 'Test Result',              desc: 'Driving test completed.' },
  { key: 'DL_DISPATCHED',  label: 'DL Dispatched',            desc: 'Your Driving Licence has been sent by post.' },
];

const colorClasses = {
  slate:   'bg-slate-100 text-slate-700 border-slate-200',
  blue:    'bg-blue-100 text-blue-700 border-blue-200',
  amber:   'bg-amber-100 text-amber-700 border-amber-200',
  purple:  'bg-purple-100 text-purple-700 border-purple-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  red:     'bg-red-100 text-red-700 border-red-200',
};

const Step9Tracking = () => {
  const { wizard } = useDLWizard();
  const [trackNumber, setTrackNumber] = useState(wizard.applicationNumber || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If we have a number from the context, auto-load
  React.useEffect(() => {
    if (wizard.applicationNumber && !result) {
      handleTrack(wizard.applicationNumber);
    }
  }, [wizard.applicationNumber]);

  const handleTrack = async (num) => {
    const n = num || trackNumber;
    if (!n?.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`https://parivahan-sewa2-0-backend.onrender.com/api/v1/dl/track/${encodeURIComponent(n.trim())}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Application not found');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError('Application not found. Please check the number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStatusIdx = result
    ? TIMELINE_STEPS.findIndex(t => t.key === result.applicationStatus)
    : -1;

  const statusConfig = result ? STATUS_CONFIG[result.applicationStatus] || STATUS_CONFIG.SUBMITTED : null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">9</div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Step 9 of 9</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Track your application.</h2>
        <p className="text-slate-500 text-sm font-medium">Use your application number to check the real-time status.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-6 space-y-5">
        {/* Search box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Application Number</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. DL-MH-2025-012345"
                value={trackNumber}
                onChange={e => setTrackNumber(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
            <button
              onClick={() => handleTrack()}
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Track
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2 font-medium">âš ï¸ {error}</p>}
        </div>

        {/* Result */}
        {result && statusConfig && (
          <>
            {/* Status banner */}
            <div className={`rounded-2xl p-5 border-2 ${colorClasses[statusConfig.color]}`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm`}>
                  <statusConfig.icon className={`w-6 h-6 text-${statusConfig.color}-600`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Current Status</p>
                  <h4 className="text-lg font-extrabold">{statusConfig.label}</h4>
                  <p className="text-xs font-medium opacity-80 mt-0.5">{result.statusMessage}</p>
                </div>
              </div>
            </div>

            {/* Application details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm mb-3">Application Details</h4>
              {[
                { icon: FileText,  label: "Application No.", value: result.applicationNumber },
                { icon: MapPin,    label: "State & RTO",     value: `${result.state} â€” ${result.rtoName}` },
                { icon: Car,       label: "Vehicle Class",   value: result.vehicleClass },
                { icon: Calendar,  label: "Test Date",       value: result.appointmentDate ? new Date(result.appointmentDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                    <p className="font-semibold text-slate-700">{item.value || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h4 className="font-bold text-slate-900 text-sm mb-5">Application Timeline</h4>
              <div className="flex flex-col gap-0">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStatusIdx;
                  const isActive = idx === currentStatusIdx;
                  const isLast = idx === TIMELINE_STEPS.length - 1;
                  return (
                    <div key={step.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-all
                          ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' :
                            isActive ? 'bg-blue-500 border-blue-500 text-white' :
                            'bg-white border-slate-200 text-slate-300'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                        </div>
                        {!isLast && <div className={`w-0.5 h-8 mt-1 ${isDone ? 'bg-emerald-300' : 'bg-slate-100'}`} />}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-bold ${isDone ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</p>
                        <p className={`text-xs font-medium mt-0.5 ${isDone ? 'text-slate-500' : 'text-slate-300'}`}>{step.desc}</p>
                        {step.key === 'PASS' && result.testResult === 'FAIL' && (
                          <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded">FAILED â€” Re-test required</span>
                        )}
                        {step.key === 'PASS' && result.testResult === 'PASS' && (
                          <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-600 font-bold px-2 py-0.5 rounded">PASSED âœ“</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Step9Tracking;
