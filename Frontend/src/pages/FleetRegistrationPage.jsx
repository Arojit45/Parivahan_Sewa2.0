import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ArrowLeft, ArrowRight, CheckCircle2, Upload, Loader2, AlertCircle, X, Car, FileText, Briefcase, ClipboardList } from 'lucide-react';
import { submitFleetRegistration } from '../utils/fleetApi';
import { getMyVehicles } from '../utils/api';

const STEPS = [
  { id: 1, icon: Car, label: 'Vehicle' },
  { id: 2, icon: FileText, label: 'Documents' },
  { id: 3, icon: Briefcase, label: 'Business' },
  { id: 4, icon: ClipboardList, label: 'Review' },
];

const FleetRegistrationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fleetName: '',
    vehicleRegistrationNumber: '',
    document1Base64: null,
    document1Name: '',
    document2Base64: null,
    document2Name: '',
    businessProofBase64: null,
    businessProofName: '',
  });

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (file.size > 5 * 1024 * 1024) { reject(new Error('File must be under 5MB.')); return; }
      const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowed.includes(file.type)) { reject(new Error('Only JPG, PNG, or PDF files allowed.')); return; }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (field, nameField, file) => {
    if (!file) return;
    setError(null);
    try {
      const base64 = await readFileAsBase64(file);
      setForm(f => ({ ...f, [field]: base64, [nameField]: file.name }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await submitFleetRegistration({
        fleetName: form.fleetName,
        vehicleRegistrationNumber: form.vehicleRegistrationNumber,
        document1Base64: form.document1Base64,
        document2Base64: form.document2Base64,
        businessProofBase64: form.businessProofBase64,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit registration.');
    } finally {
      setLoading(false);
    }
  };

  const next = () => { setError(null); setStep(s => s + 1); };
  const back = () => { setError(null); setStep(s => s - 1); };

  // --- Submitted State ---
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
        <div className="max-w-lg w-full text-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100 shadow-sm">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Application Submitted!</h1>
          <p className="text-slate-600 mb-2">Your fleet registration for <span className="font-bold text-slate-900">{form.fleetName}</span> has been submitted.</p>
          <p className="text-slate-500 text-sm mb-10">Your application is now under authority review. You'll be notified once it's approved.</p>
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 mb-8 text-left space-y-3">
            {[{ label: 'âœ… Application Received', done: true }, { label: 'ðŸ” Document Verification', done: false, active: true }, { label: 'âœ… Authority Approval', done: false }, { label: 'ðŸšš Fleet Approved', done: false }].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-sm font-semibold ${s.done ? 'text-emerald-600' : s.active ? 'text-amber-600' : 'text-slate-400'}`}>{s.label}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/fleet')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all">
            Go to Fleet Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Topbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link to="/fleet" className="text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-600" />
          <span className="text-slate-900 font-bold">Fleet Registration</span>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${isDone ? 'bg-emerald-500 border-emerald-500' : isActive ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-slate-100'}`}>
                    {isDone ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Icon className={`w-4 h-4 ${isActive || isDone ? 'text-white' : 'text-slate-400'}`} />}
                  </div>
                  <span className={`text-xs font-bold ${isActive ? 'text-blue-600' : isDone ? 'text-emerald-600' : 'text-slate-500'}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${isDone ? 'bg-emerald-500' : 'bg-slate-200'} mb-4`} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center p-6 pt-10">
        <div className="w-full max-w-2xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-semibold shadow-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Step 1: Vehicle */}
          {step === 1 && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Vehicle Information</h2>
              <p className="text-slate-500 text-sm mb-6">Enter the details of the vehicle you want to add to this fleet.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Fleet Name *</label>
                  <input
                    type="text"
                    value={form.fleetName}
                    onChange={e => setForm(f => ({ ...f, fleetName: e.target.value }))}
                    placeholder="e.g. Sinha Transports"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Vehicle Registration Number *</label>
                  <input
                    type="text"
                    value={form.vehicleRegistrationNumber}
                    onChange={e => setForm(f => ({ ...f, vehicleRegistrationNumber: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') }))}
                    placeholder="e.g. WB12AB1234"
                    maxLength={10}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 font-mono tracking-widest uppercase"
                  />
                  <p className="text-xs text-slate-500 mt-2 font-medium">This vehicle must be linked to your account first.</p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!form.fleetName.trim() || !form.vehicleRegistrationNumber.trim()) {
                    setError('Please fill in all required fields.');
                    return;
                  }
                  next();
                }}
                className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Vehicle Documents */}
          {step === 2 && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Vehicle Documents</h2>
              <p className="text-slate-500 text-sm mb-6">Upload vehicle-related documents (RC copy, fitness certificate, etc.) JPG, PNG, or PDF â€” max 5MB each.</p>

              <div className="space-y-5">
                <FileUploadField label="Vehicle Document 1" name={form.document1Name}
                  onFile={f => handleFile('document1Base64', 'document1Name', f)}
                  onRemove={() => setForm(f => ({ ...f, document1Base64: null, document1Name: '' }))} />
                <FileUploadField label="Vehicle Document 2" name={form.document2Name}
                  onFile={f => handleFile('document2Base64', 'document2Name', f)}
                  onRemove={() => setForm(f => ({ ...f, document2Base64: null, document2Name: '' }))} />
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={back} className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-3.5 rounded-xl shadow-sm transition-all">Back</button>
                <button onClick={next} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Business Proof */}
          {step === 3 && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Business Verification</h2>
              <p className="text-slate-500 text-sm mb-6">Upload your business license or commercial trade certificate. JPG, PNG, or PDF â€” max 5MB.</p>

              <FileUploadField label="Business License / Trade Proof" name={form.businessProofName}
                onFile={f => handleFile('businessProofBase64', 'businessProofName', f)}
                onRemove={() => setForm(f => ({ ...f, businessProofBase64: null, businessProofName: '' }))} />

              <div className="flex gap-3 mt-8">
                <button onClick={back} className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-3.5 rounded-xl shadow-sm transition-all">Back</button>
                <button onClick={next} className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                  Review <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Review & Submit</h2>
              <p className="text-slate-500 text-sm mb-6">Please verify your details before submitting.</p>

              <div className="space-y-4 mb-8 bg-slate-50 rounded-xl p-4 border border-slate-200">
                <ReviewRow label="Fleet Name" value={form.fleetName} />
                <ReviewRow label="Vehicle Reg. No." value={form.vehicleRegistrationNumber} mono />
                <ReviewRow label="Vehicle Document 1" value={form.document1Name || '(Not uploaded)'} />
                <ReviewRow label="Vehicle Document 2" value={form.document2Name || '(Not uploaded)'} />
                <ReviewRow label="Business Proof" value={form.businessProofName || '(Not uploaded)'} borderless />
              </div>

              <div className="flex gap-3">
                <button onClick={back} className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-3.5 rounded-xl shadow-sm transition-all">Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Submit Fleet Registration</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FileUploadField = ({ label, name, onFile, onRemove }) => {
  const inputRef = useRef(null);
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      {name ? (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <FileText className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-emerald-700 font-semibold text-sm flex-1 truncate">{name}</span>
          <button onClick={onRemove} className="text-emerald-400 hover:text-emerald-600 transition-colors"><X className="w-4 h-4" /></button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
        >
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-700 font-bold">Click to upload</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">JPG, PNG, PDF Â· Max 5MB</p>
          <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden"
            onChange={e => onFile(e.target.files[0])} />
        </div>
      )}
    </div>
  );
};

const ReviewRow = ({ label, value, mono, borderless }) => (
  <div className={`flex items-center justify-between py-3 ${borderless ? '' : 'border-b border-slate-200'}`}>
    <span className="text-sm text-slate-500 font-medium">{label}</span>
    <span className={`text-sm font-bold text-slate-900 ${mono ? 'font-mono tracking-wider' : ''}`}>{value}</span>
  </div>
);

export default FleetRegistrationPage;
