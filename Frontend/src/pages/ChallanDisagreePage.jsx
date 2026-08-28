import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Scale, UploadCloud, X, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import { useChallan } from '../contexts/ChallanContext';
import { useLanguage } from '../contexts/LanguageContext';
import { raiseDispute } from '../utils/challanApi';

const DisputeReasons = [
  { id: 'WRONG_VEHICLE_NUMBER_PLATE', label: 'Wrong Vehicle / Number Plate' },
  { id: 'VEHICLE_NOT_AT_LOCATION', label: 'Vehicle was not at the location' },
  { id: 'VIOLATION_DID_NOT_OCCUR', label: 'Violation did not occur' },
  { id: 'ALREADY_PAID', label: 'Challan already paid offline' },
  { id: 'DUPLICATE_CHALLAN', label: 'Duplicate challan issued' },
  { id: 'INCORRECT_INFORMATION', label: 'Incorrect information on challan' },
  { id: 'OTHER', label: 'Other Issue' }
];

const ChallanDisagreePage = () => {
  const [searchParams] = useSearchParams();
  const challanId = searchParams.get('id');
  const { challans, markDisputed, openDisputeHistoryModal } = useChallan();
  const { t } = useLanguage();
  const g = t.challan?.guide || {};

  const challan = challans.find(c => String(c.id) === challanId);

  // Form State
  const [reason, setReason] = useState('');
  const [explanation, setExplanation] = useState('');
  const [image, setImage] = useState(null);
  
  // Submission State
  const [step, setStep] = useState('FORM'); // FORM -> REVIEW -> SUCCESS
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [disputeResult, setDisputeResult] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage({ file, url, name: file.name });
    }
  };

  const handleRemoveImage = () => {
    if (image?.url) URL.revokeObjectURL(image.url);
    setImage(null);
  };

  const proceedToReview = () => {
    if (!reason) {
      setError('Please select a reason.');
      return;
    }
    if (explanation.length < 20) {
      setError('Explanation must be at least 20 characters.');
      return;
    }
    setError(null);
    setStep('REVIEW');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await raiseDispute(challan.id, { reason, explanation });
      markDisputed(challan.id);
      setDisputeResult(result);
      setStep('SUCCESS');
    } catch (err) {
      setError(err.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12 animate-in fade-in">
      
      {/* Header */}
      <div>
        <Link to="/challans" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> {g.backToChallans || 'Back to Challans'}
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">{g.disagreeTitle || 'Do You Disagree With Your Challan?'}</h1>
        <p className="text-slate-600 mt-2 text-lg">
          {g.disagreeSubtitle || 'If you believe something is incorrect, understand the issue and submit the appropriate grievance through the available channel.'}
        </p>
      </div>

      {!challan ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 flex flex-col items-center justify-center text-center shadow-sm">
          <Scale className="w-12 h-12 text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Select a Challan</h2>
          <p className="text-slate-500 max-w-md mb-6">
            To file a grievance, you must first select the specific challan you wish to dispute from your dashboard.
          </p>
          <div className="flex gap-4">
            <Link to="/challans" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
              {g.checkMyChallans || 'Check My Challans'}
            </Link>
            <button onClick={openDisputeHistoryModal} className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors border border-slate-200">
              View My Grievance History
            </button>
          </div>
        </div>
      ) : step === 'SUCCESS' ? (
        
        /* SUCCESS VIEW */
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center shadow-sm max-w-2xl mx-auto w-full">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{g.grievanceSubmitted || 'Grievance Submitted'}</h2>
          
          <div className="bg-slate-50 rounded-xl p-4 my-6 inline-block text-left border border-slate-200 w-full max-w-sm">
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Complaint / Grievance ID</p>
            <p className="text-xl font-bold text-slate-800">GRV-{String(disputeResult?.id || '000').padStart(8, '0')}</p>
          </div>

          <div className="flex flex-col items-center mb-8 relative px-4 max-w-xs mx-auto">
             <div className="absolute top-3 left-4 right-4 h-0.5 bg-emerald-100 -z-10"></div>
             <div className="flex justify-between w-full">
               <div className="flex flex-col items-center">
                 <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-white"></div>
                 <span className="text-[10px] font-bold text-emerald-600 mt-2">Submitted</span>
               </div>
               <div className="flex flex-col items-center">
                 <div className="w-6 h-6 rounded-full bg-orange-200 border-4 border-white"></div>
                 <span className="text-[10px] font-bold text-slate-400 mt-2">Under Review</span>
               </div>
               <div className="flex flex-col items-center">
                 <div className="w-6 h-6 rounded-full bg-slate-200 border-4 border-white"></div>
                 <span className="text-[10px] font-bold text-slate-400 mt-2">Decision</span>
               </div>
             </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed bg-blue-50 p-4 rounded-lg text-left">
            Your grievance has been successfully submitted through the available official process. 
            <strong> Any review or decision is made by the appropriate traffic authority.</strong> 
            This application acts solely as an interface and does not decide whether your challan is correct.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link to="/challans" className="px-6 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors">
              {g.backToChallans || 'Back to Challans'}
            </Link>
            <button onClick={openDisputeHistoryModal} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              Track Grievance
            </button>
          </div>
        </div>

      ) : step === 'REVIEW' ? (

        /* REVIEW VIEW */
        <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-200 shadow-sm max-w-3xl mx-auto w-full">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">{g.reviewSubmission || 'Review Your Grievance'}</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Challan Number</p>
                <p className="font-semibold text-slate-800 mt-1">CH-{String(challan.id).padStart(8, '0')}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Vehicle</p>
                <p className="font-semibold text-slate-800 mt-1">{challan.registrationNumber}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Issue / Reason</p>
              <p className="font-semibold text-slate-800 bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg inline-block">
                {DisputeReasons.find(r => r.id === reason)?.label || reason}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Description</p>
              <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100">
                "{explanation}"
              </div>
            </div>

            {image && (
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Attachment</p>
                <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl bg-white w-max">
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{image.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
            )}

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

            <div className="flex gap-4 pt-6 border-t border-slate-100">
              <button 
                onClick={() => setStep('FORM')} 
                disabled={submitting}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Edit Details
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-[2] flex items-center justify-center gap-2 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-70 shadow-sm"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? 'Submitting...' : 'Submit Grievance'}
              </button>
            </div>
          </div>
        </div>

      ) : (

        /* FORM VIEW */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-8 flex flex-col gap-6">
            
            {/* SECTION 1 - WHY DO YOU DISAGREE? */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4">{g.whyDisagree || 'Why do you disagree?'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DisputeReasons.map(r => (
                  <button 
                    key={r.id} 
                    onClick={() => setReason(r.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      reason === r.id 
                        ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600' 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      reason === r.id ? 'border-purple-600 bg-purple-600' : 'border-slate-300'
                    }`}>
                      {reason === r.id && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>
                    <span className={`text-sm font-medium ${reason === r.id ? 'text-purple-900' : 'text-slate-700'}`}>
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 3 - EXPLAIN YOUR ISSUE */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-1">{g.explainIssue || 'Explain Your Issue'}</h2>
              <p className="text-sm text-slate-500 mb-4">Provide clear details to help the authority review your case.</p>
              
              <textarea 
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                placeholder={g.explainPlaceholder || "Briefly explain what you believe is incorrect..."}
                rows={5}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none text-sm"
              />
              <div className="flex justify-between mt-2 px-1">
                <span className={`text-xs ${explanation.length > 0 && explanation.length < 20 ? 'text-red-500' : 'text-slate-400'}`}>
                  {explanation.length > 0 && explanation.length < 20 ? 'At least 20 characters required' : ''}
                </span>
                <span className="text-xs text-slate-400">{explanation.length}/1000</span>
              </div>
            </div>

            {/* SECTION 4 - SUPPORTING EVIDENCE */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-1">{g.supportingEvidence || 'Add Supporting Evidence'}</h2>
              <p className="text-sm text-slate-500 mb-4">Upload a photo proving your claim (e.g. toll receipt, number plate). Accepted formats: JPG / PNG.</p>
              
              {!image ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 text-slate-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-600">Click to upload image</span>
                  <span className="text-xs text-slate-400 mt-1">Max 5MB</span>
                  <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="relative rounded-xl border border-slate-200 p-2 inline-block">
                  <img src={image.url} alt="Evidence Preview" className="h-40 rounded-lg object-cover" />
                  <button 
                    onClick={handleRemoveImage}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white text-slate-600 border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}

            {/* SUBMIT BUTTON */}
            <button 
              onClick={proceedToReview}
              className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors shadow-sm text-lg"
            >
              Review & Proceed
            </button>

          </div>

          <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* SECTION 2 - WHAT TO PROVIDE (Context Sidebar) */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-sm text-white sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-purple-200">{g.whatToProvide || 'YOUR INFORMATION'}</h3>
              <p className="text-xs text-slate-400 mb-6">The following information will be submitted securely as part of your grievance.</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Challan Number</p>
                    <p className="text-sm font-medium">CH-{String(challan.id).padStart(8, '0')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Vehicle</p>
                    <p className="text-sm font-medium">{challan.registrationNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Location</p>
                    <p className="text-sm font-medium">{challan.location || 'Bengaluru'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 opacity-60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">Description of issue</p>
                </div>
                <div className="flex items-start gap-3 opacity-60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">Supporting evidence</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Bottom Nav */}
      <div className="flex justify-between mt-4 border-t border-slate-200 pt-8">
        <Link to={challan ? `/challan/how-to-pay?id=${challan.id}` : '/challan/how-to-pay'} className="text-blue-600 font-semibold hover:underline">
          â† {g.payTitle || 'How to pay your challan'}
        </Link>
        <Link to={challan ? `/challan/why-do-i-have-this-challan?id=${challan.id}` : '/challan/why-do-i-have-this-challan'} className="text-blue-600 font-semibold hover:underline">
          {g.understandTitle || 'Understand this challan'} â†’
        </Link>
      </div>

    </div>
  );
};

export default ChallanDisagreePage;
