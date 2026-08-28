import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState } from 'react';
import { X, Scale, AlertCircle, Loader2 } from 'lucide-react';
import { useChallan } from '../../contexts/ChallanContext';
import { raiseDispute } from '../../utils/challanApi';

const DisputeReasons = [
  { id: 'WRONG_VEHICLE_NUMBER_PLATE', label: 'Wrong Vehicle / Number Plate' },
  { id: 'VEHICLE_NOT_AT_LOCATION', label: 'Vehicle was not at the location' },
  { id: 'VIOLATION_DID_NOT_OCCUR', label: 'Violation did not occur' },
  { id: 'ALREADY_PAID', label: 'Challan already paid offline' },
  { id: 'DUPLICATE_CHALLAN', label: 'Duplicate challan issued' },
  { id: 'INCORRECT_INFORMATION', label: 'Incorrect information on challan' },
  { id: 'OTHER', label: 'Other Reason' }
];

const ChallanDisputeModal = () => {
  const { t } = useLanguage();
  const c = t.challan || {};
  const { disputeModal, closeDisputeModal, markDisputed } = useChallan();
  const { open, challan } = disputeModal;
  
  const [reason, setReason] = useState('');
  const [explanation, setExplanation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open || !challan) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      setError('Please select a dispute reason');
      return;
    }
    if (explanation.length < 20) {
      setError('Explanation must be at least 20 characters');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      await raiseDispute(challan.id, { reason, explanation });
      markDisputed(challan.id);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        closeDisputeModal();
        setReason('');
        setExplanation('');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Failed to submit dispute. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg">Raise a Dispute</h2>
              <p className="text-xs text-slate-500 mt-0.5">CH-{String(challan.id).padStart(8, '0')}</p>
            </div>
          </div>
          <button onClick={closeDisputeModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Scale className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Dispute Submitted!</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-[280px]">
                Your dispute has been logged successfully and is pending review by the authority.
              </p>
            </div>
          ) : (
            <form id="dispute-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex gap-3 text-sm text-orange-800">
                <AlertCircle className="w-5 h-5 shrink-0 text-orange-600 mt-0.5" />
                <p>False disputes may result in additional penalties. Please ensure your claim is genuine and you have supporting evidence.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Reason for Dispute <span className="text-red-500">*</span></label>
                <select 
                  value={reason} 
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-sm"
                >
                  <option value="" disabled>Select a reason...</option>
                  {DisputeReasons.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Explanation <span className="text-red-500">*</span></label>
                <textarea 
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  placeholder="Please describe why you are disputing this challan in detail (min 20 characters)..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none text-sm resize-none"
                />
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${explanation.length > 0 && explanation.length < 20 ? 'text-red-500' : 'text-slate-400'}`}>
                    {explanation.length < 20 ? `${20 - explanation.length} more characters required` : 'Looks good'}
                  </span>
                  <span className="text-xs text-slate-400">{explanation.length}/1000</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
                  {error}
                </div>
              )}

            </form>
          )}
        </div>

        {/* Footer Actions */}
        {!success && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
            <button 
              type="button"
              onClick={closeDisputeModal}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition-colors text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit"
              form="dispute-form"
              disabled={submitting}
              className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors text-sm shadow-sm disabled:opacity-70"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
              {submitting ? 'Submitting...' : 'Submit Dispute'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallanDisputeModal;
