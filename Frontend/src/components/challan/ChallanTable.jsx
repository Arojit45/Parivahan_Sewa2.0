import React, { useState } from 'react';
import { Eye, Download, Printer, MoreVertical, SlidersHorizontal, Scale, AlertCircle } from 'lucide-react';
import { useChallan } from '../../contexts/ChallanContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { downloadChallanPdf, downloadReceiptPdf } from '../../utils/challanPdf';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'OVERDUE':
        return 'bg-red-50 text-red-600 border-red-200';
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
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStyles()}`}>
      {status}
    </span>
  );
};

const ChallanTable = () => {
  const { challans, stats, openPaymentModal, openDetailModal, openDisputeModal } = useChallan();
  const { t } = useLanguage();
  const c = t.challan || {};
  const [activeTab, setActiveTab] = useState('ALL');

  const tabs = [
    { id: 'ALL', label: c.allChallans || 'All Challans', count: stats.total },
    { id: 'PENDING', label: c.pending || 'Pending', count: stats.pendingCount },
    { id: 'OVERDUE', label: c.overdue || 'Overdue', count: stats.overdueCount },
    { id: 'PAID', label: c.paid || 'Paid', count: stats.paidCount },
    { id: 'DISPUTED', label: c.disputed || 'Disputed', count: stats.disputedCount },
  ];

  const filteredChallans = challans.filter(ch => {
    const isOverdue = ch.status === 'PENDING' && ch.dueDate && new Date(ch.dueDate) < new Date();
    if (activeTab === 'ALL') return true;
    if (activeTab === 'OVERDUE') return isOverdue;
    if (activeTab === 'PENDING') return ch.status === 'PENDING' && !isOverdue; // Explicitly non-overdue pending
    return ch.status === activeTab;
  });

  const getComputedStatus = (ch) => {
    if (ch.status === 'PENDING' && ch.dueDate && new Date(ch.dueDate) < new Date()) return 'OVERDUE';
    return ch.status;
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-sm mt-6 flex flex-col h-[700px]">
      {/* Tabs and Actions Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-slate-100 gap-4">
        <div className="flex space-x-1 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label} <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left min-w-[1000px]">
          <thead className="text-xs text-slate-500 bg-slate-50/50 sticky top-0 border-b border-slate-100 z-10">
            <tr>
              <th className="px-6 py-4 font-semibold">{c.challanNumber || 'Challan Number'}</th>
              <th className="px-6 py-4 font-semibold">{c.violation || 'Violation'}</th>
              <th className="px-6 py-4 font-semibold flex items-center gap-1">Date <span className="text-[10px]">↓</span></th>
              <th className="px-6 py-4 font-semibold">{c.location || 'Location'}</th>
              <th className="px-6 py-4 font-semibold">{c.amount || 'Amount'} (₹)</th>
              <th className="px-6 py-4 font-semibold">{c.dueDate || 'Due Date'}</th>
              <th className="px-6 py-4 font-semibold">{c.status || 'Status'}</th>
              <th className="px-6 py-4 font-semibold text-right">{c.actions || 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredChallans.map((challan, index) => {
              const compStatus = getComputedStatus(challan);
              
              return (
              <tr key={challan.id} className={`hover:bg-slate-50/80 transition-colors ${index % 2 === 0 ? '' : 'bg-slate-50/30'}`}>
                <td className="px-6 py-4 font-semibold text-slate-700">
                  <div className="flex flex-col">
                    <span>CH-{String(challan.id).padStart(8, '0')}</span>
                    <span className="text-xs font-normal text-slate-500 mt-0.5">{challan.registrationNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{challan.offence}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-700 font-medium">
                    {new Date(challan.challanDate).toLocaleDateString('en-IN')}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]" title={challan.location}>{challan.location || 'Bengaluru'}</td>
                <td className="px-6 py-4 font-semibold text-slate-800">{Number(challan.amount).toLocaleString('en-IN')}</td>
                <td className="px-6 py-4">
                  <div className={`font-medium ${compStatus === 'OVERDUE' ? 'text-red-600' : 'text-slate-700'}`}>
                    {challan.dueDate ? new Date(challan.dueDate).toLocaleDateString('en-IN') : '—'}
                  </div>
                  {compStatus === 'OVERDUE' && <div className="text-xs text-red-500 mt-0.5 font-medium">Overdue</div>}
                  {compStatus === 'PENDING' && <div className="text-xs text-orange-500 mt-0.5 font-medium">Pending</div>}
                  {challan.status === 'PAID' && <div className="text-xs text-emerald-500 mt-0.5 font-medium">Paid on {new Date(challan.paymentDate).toLocaleDateString('en-IN')}</div>}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={compStatus} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3 text-slate-400">
                    <button onClick={() => openDetailModal(challan)} className="hover:text-blue-600" title={c.viewDetails || 'View Details'}><Eye className="w-4 h-4" /></button>
                    
                    {challan.status === 'PENDING' && (
                      <button onClick={() => openPaymentModal(challan)} className="hover:text-emerald-600" title={c.payNow || 'Pay Now'}>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="5" width="20" height="14" rx="2" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                      </button>
                    )}
                    
                    {challan.status === 'PAID' && (
                       <button onClick={() => downloadReceiptPdf({
                         receiptNumber: `RCPT-${challan.transactionId}`,
                         transactionId: challan.transactionId,
                         paymentDate: challan.paymentDate,
                         registrationNumber: challan.registrationNumber,
                         offence: challan.offence,
                         amountPaid: challan.amount
                       })} className="hover:text-blue-600 text-emerald-500" title={c.receipt || 'Receipt'}>
                         <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                         </svg>
                       </button>
                    )}
                     
                    {challan.status === 'PENDING' && !challan.hasActiveDispute && (
                       <button onClick={() => openDisputeModal(challan)} className="hover:text-purple-600" title="Dispute">
                         <Scale className="w-4 h-4" />
                       </button>
                    )}
                    {challan.status === 'DISPUTED' && (
                       <button className="text-purple-500 cursor-default" title="Under Dispute">
                         <Scale className="w-4 h-4" />
                       </button>
                    )}
                    
                    <button onClick={() => downloadChallanPdf(challan)} className="hover:text-blue-600" title={c.download || 'Download PDF'}><Download className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            )})}
            
            {filteredChallans.length === 0 && (
              <tr>
                <td colSpan="8">
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <AlertCircle className="w-12 h-12 mb-3 text-slate-300" />
                    <p className="font-medium text-slate-600">{c.noChallans || 'No challans found'}</p>
                    <p className="text-xs">{c.noChallansDesc || 'You have no challans in this category.'}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 bg-white rounded-b-xl shrink-0">
        <div>{(c.showingCount || "Showing 1 to {count} of {total} challans").replace("{count}", filteredChallans.length).replace("{total}", filteredChallans.length)}</div>
        <div className="flex items-center gap-2">
           <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-300 cursor-not-allowed">&lt;</button>
           <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white font-medium">1</button>
           <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-300 cursor-not-allowed">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default ChallanTable;
