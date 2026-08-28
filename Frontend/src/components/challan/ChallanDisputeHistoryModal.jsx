import React, { useState, useEffect } from 'react';
import { X, Scale, Loader2, RefreshCw, ChevronRight } from 'lucide-react';
import { useChallan } from '../../contexts/ChallanContext';
import { getAllDisputes } from '../../utils/challanApi';

const StatusBadge = ({ status }) => {
  const styles = {
    'PENDING_REVIEW': 'bg-orange-50 text-orange-600 border-orange-200',
    'IN_PROGRESS': 'bg-blue-50 text-blue-600 border-blue-200',
    'RESOLVED': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'REJECTED': 'bg-red-50 text-red-600 border-red-200'
  };
  const labels = {
    'PENDING_REVIEW': 'Under Review',
    'IN_PROGRESS': 'In Progress',
    'RESOLVED': 'Resolved',
    'REJECTED': 'Rejected'
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${styles[status] || 'bg-slate-50 border-slate-200 text-slate-600'}`}>
      {labels[status] || status}
    </span>
  );
};

const ChallanDisputeHistoryModal = () => {
  const { disputeHistoryModal, closeDisputeHistoryModal } = useChallan();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDisputes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDisputes();
      setDisputes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (disputeHistoryModal?.open) {
      fetchDisputes();
    }
  }, [disputeHistoryModal?.open]);

  if (!disputeHistoryModal?.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Scale className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-xl">Dispute History</h2>
              <p className="text-sm text-slate-500 mt-0.5">Track the status of your raised disputes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchDisputes} 
              disabled={loading}
              className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={closeDisputeHistoryModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50/30 p-6">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-red-500 mb-2">Failed to load disputes</div>
              <div className="text-sm text-slate-500">{error}</div>
              <button onClick={fetchDisputes} className="mt-4 text-purple-600 font-medium hover:underline">Try Again</button>
            </div>
          ) : disputes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Scale className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-lg font-medium text-slate-600">No disputes found</p>
              <p className="text-sm">You haven't raised any challan disputes.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {disputes.map(dispute => (
                <div key={dispute.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-purple-200 hover:shadow-md transition-all overflow-hidden group">
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-slate-800">CH-{String(dispute.challanId).padStart(8, '0')}</span>
                        <StatusBadge status={dispute.status} />
                      </div>
                      <p className="text-sm text-slate-500">
                        Raised on {new Date(dispute.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <p className="text-xs text-slate-400 font-semibold uppercase">Reason</p>
                      <p className="text-sm font-medium text-slate-700">{dispute.reason.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="px-5 py-4 bg-slate-50/50">
                    <p className="text-sm text-slate-600">"{dispute.explanation}"</p>
                    
                    {dispute.authorityRemarks && (
                      <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Authority Remarks</p>
                        <p className="text-sm font-medium text-slate-800">{dispute.authorityRemarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallanDisputeHistoryModal;
