import React, { useState, useEffect } from 'react';
import { AlertTriangle, Send, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Topbar from '../components/dashboard/Topbar';
import Sidebar from '../components/dashboard/Sidebar';


const CorrectionBadge = ({ status }) => {
  if (status === 'APPROVED') return <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded border border-emerald-200">APPROVED</span>;
  if (status === 'REJECTED') return <span className="text-xs font-bold bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200">REJECTED</span>;
  return <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200">{status.replace(/_/g, ' ')}</span>;
};

const CorrectionsPage = () => {
  const [searchParams] = useSearchParams();
  const initTargetType = searchParams.get('targetType') || 'VEHICLE_REGISTRATION_APPLICATION';
  const initTargetId = searchParams.get('targetId') || '';

  const [loading, setLoading] = useState(true);
  const [corrections, setCorrections] = useState([]);
  const [form, setForm] = useState({
    targetType: initTargetType,
    targetId: initTargetId,
    fieldName: '',
    currentValue: '',
    requestedValue: '',
    reason: '',
    evidenceBase64: 'mock_base64_string' // Mock evidence for simplicity
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCorrections = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      const res = await fetch('https://parivahan-sewa2-0-backend.onrender.com/api/v1/corrections/mine', { headers });
      if (res.ok) {
        setCorrections(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorrections();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        const res = await fetch('https://parivahan-sewa2-0-backend.onrender.com/api/v1/corrections', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Failed to submit correction request');
      
      setSuccess('Correction request submitted successfully! An authority will review it shortly.');
      setForm({ ...form, fieldName: '', currentValue: '', requestedValue: '', reason: '' });
      fetchCorrections();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Form */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Corrections Center</h1>
                <p className="text-slate-500 font-medium">Found a mistake in your application or documents? Request a correction here.</p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 font-medium leading-relaxed">
                    You cannot directly edit official government data. Submitting this form will send a request to the Regional Transport Authority. If approved, your documents will be automatically updated.
                  </p>
                </div>

                {error && <div className="mb-4 text-sm font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
                {success && <div className="mb-4 text-sm font-semibold text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Target Type</label>
                      <select name="targetType" value={form.targetType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-medium">
                        <option value="VEHICLE_REGISTRATION_APPLICATION">Vehicle Registration App</option>
                        <option value="DRIVING_LICENSE_APPLICATION">Driving License App</option>
                        <option value="VEHICLE">Registered Vehicle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Target ID</label>
                      <input required type="number" name="targetId" value={form.targetId} onChange={handleChange} placeholder="e.g. 12" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-medium" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Incorrect Field Name</label>
                    <input required type="text" name="fieldName" value={form.fieldName} onChange={handleChange} placeholder="e.g. applicantName, address, vehicleClass" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-medium" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Current Value</label>
                      <input type="text" name="currentValue" value={form.currentValue} onChange={handleChange} placeholder="What is it currently?" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-medium text-red-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Requested Value</label>
                      <input required type="text" name="requestedValue" value={form.requestedValue} onChange={handleChange} placeholder="What should it be?" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-medium text-emerald-600" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Reason for Correction</label>
                    <textarea required name="reason" value={form.reason} onChange={handleChange} rows="3" placeholder="Briefly explain why this correction is needed..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-medium resize-none"></textarea>
                  </div>

                  <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2">
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit Correction Request</>}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: History */}
            <div>
              <div className="mb-6 lg:mt-12">
                <h2 className="text-xl font-bold text-slate-900 mb-2">My Correction Requests</h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : corrections.length === 0 ? (
                <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">No Requests</h3>
                  <p className="text-slate-500 text-xs">You haven't submitted any corrections yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {corrections.map(c => (
                    <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{c.targetType.replace(/_/g, ' ')} #{c.targetId}</p>
                          <h4 className="text-base font-bold text-slate-800">Correcting "{c.fieldName}"</h4>
                        </div>
                        <CorrectionBadge status={c.status} />
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm font-medium mb-3">
                        <span className="text-red-500 line-through truncate max-w-[120px]">{c.currentValue || 'N/A'}</span>
                        <span className="text-slate-300">â†’</span>
                        <span className="text-emerald-600 truncate max-w-[120px]">{c.requestedValue}</span>
                      </div>
                      
                      <p className="text-xs text-slate-500 italic">"{c.reason}"</p>
                      
                      {c.status === 'APPROVED' && (
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" /> Official record updated successfully.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default CorrectionsPage;
