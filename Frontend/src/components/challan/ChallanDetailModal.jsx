import React from 'react';
import { Link } from 'react-router-dom';
import { X, Calendar, MapPin, AlertCircle, Scale, ShieldAlert, Download, Printer, Info } from 'lucide-react';
import { useChallan } from '../../contexts/ChallanContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { downloadChallanPdf } from '../../utils/challanPdf';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'PAID':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'DISPUTED':
        return 'bg-purple-50 text-purple-600 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStyles()}`}>
      {status}
    </span>
  );
};

const ChallanDetailModal = () => {
  const { detailModal, closeDetailModal, openPaymentModal, openDisputeModal } = useChallan();
  const { t } = useLanguage();
  const c = t.challan || {};
  const { open, challan } = detailModal;

  if (!open || !challan) return null;

  const isOverdue = challan.status === 'PENDING' && challan.dueDate && new Date(challan.dueDate) < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="font-bold text-slate-800 text-lg">{c.challanDetails || "Challan Details"}</h2>
            <p className="text-xs text-slate-500 mt-0.5">CH-{String(challan.id).padStart(8, '0')}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={isOverdue ? 'OVERDUE' : challan.status} />
            <button onClick={closeDetailModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          <div className="flex flex-col gap-6">
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100/50 flex flex-col items-center justify-center text-center">
              <ShieldAlert className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Fine Amount</h3>
              <div className="text-4xl font-bold text-slate-800 mt-1 mb-2">â‚¹{Number(challan.amount).toLocaleString('en-IN')}</div>
              <p className="text-slate-700 font-medium mb-3">{challan.offence}</p>
              
              <Link 
                to={`/challan/why-do-i-have-this-challan?id=${challan.id}`}
                onClick={closeDetailModal}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-100/50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
              >
                <Info className="w-3.5 h-3.5" /> Understand this violation
              </Link>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Vehicle</p>
                <p className="font-semibold text-slate-700 mt-1">{challan.registrationNumber}</p>
                <p className="text-xs text-slate-500 mt-0.5">{challan.vehicleModel}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase">Date of Offence</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">
                    {new Date(challan.challanDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="col-span-2">
                <p className="text-xs font-medium text-slate-400 uppercase">Location</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">{challan.location || 'Bengaluru, Karnataka'}</span>
                </div>
              </div>

              {challan.status === 'PENDING' && (
                <div className="col-span-2">
                  <div className={`flex items-center gap-2 p-3 rounded-lg border ${isOverdue ? 'bg-red-50 border-red-200 text-red-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {isOverdue 
                        ? `Overdue since ${new Date(challan.dueDate).toLocaleDateString()}` 
                        : `Due on ${new Date(challan.dueDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
              )}

              {challan.status === 'PAID' && (
                <div className="col-span-2">
                  <p className="text-xs font-medium text-slate-400 uppercase">Payment Info</p>
                  <div className="bg-slate-50 rounded-lg p-3 mt-1 border border-slate-100 flex justify-between items-center text-sm">
                    <span className="text-slate-500">Paid on {new Date(challan.paymentDate).toLocaleDateString()}</span>
                    <span className="font-medium text-slate-700">{challan.transactionId}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-3 sm:flex-nowrap">
          <button 
            onClick={() => downloadChallanPdf(challan)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition-colors text-sm"
          >
            <Download className="w-4 h-4" /> PDF
          </button>
          
          <button 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 transition-colors text-sm"
          >
            <Printer className="w-4 h-4" /> Print
          </button>

          {challan.status === 'PENDING' && !challan.hasActiveDispute && (
            <button 
              onClick={() => {
                closeDetailModal();
                openDisputeModal(challan);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
            >
              <Scale className="w-4 h-4" /> Dispute
            </button>
          )}

          {challan.status === 'PENDING' && (
            <button 
              onClick={() => {
                closeDetailModal();
                openPaymentModal(challan);
              }}
              className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors text-sm shadow-sm"
            >
              Pay â‚¹{Number(challan.amount).toLocaleString('en-IN')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallanDetailModal;
