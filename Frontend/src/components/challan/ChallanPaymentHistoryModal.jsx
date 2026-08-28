import React from 'react';
import { X, CheckCircle2, Download, CreditCard, Search } from 'lucide-react';
import { useChallan } from '../../contexts/ChallanContext';
import { downloadReceiptPdf } from '../../utils/challanPdf';

const ChallanPaymentHistoryModal = () => {
  const { paymentHistoryModal, closePaymentHistoryModal, challans } = useChallan();

  if (!paymentHistoryModal?.open) return null;

  const paidChallans = challans.filter(c => c.status === 'PAID').sort((a, b) => {
    return new Date(b.paymentDate) - new Date(a.paymentDate);
  });

  const totalPaid = paidChallans.reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-xl">Payment History</h2>
              <p className="text-sm text-slate-500 mt-0.5">Track all your past challan payments</p>
            </div>
          </div>
          <button onClick={closePaymentHistoryModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
           <div className="flex gap-8">
             <div>
               <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Payments</p>
               <p className="text-lg font-bold text-slate-800">{paidChallans.length}</p>
             </div>
             <div>
               <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Amount Paid</p>
               <p className="text-lg font-bold text-emerald-600">â‚¹{totalPaid.toLocaleString('en-IN')}</p>
             </div>
           </div>
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
                type="text" 
                placeholder="Search transaction ID..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
             />
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50/30">
          {paidChallans.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <CreditCard className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-lg font-medium text-slate-600">No payment history found</p>
              <p className="text-sm">You haven't made any challan payments yet.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-100 shadow-sm z-10 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Challan / Vehicle</th>
                  <th className="px-6 py-4">Payment Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paidChallans.map(challan => (
                  <tr key={challan.id} className="hover:bg-blue-50/30 transition-colors bg-white">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-mono text-slate-700 font-medium">{challan.transactionId || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">CH-{String(challan.id).padStart(8, '0')}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{challan.registrationNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(challan.paymentDate).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      â‚¹{Number(challan.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => downloadReceiptPdf({
                          receiptNumber: `RCPT-${challan.transactionId}`,
                          transactionId: challan.transactionId,
                          paymentDate: challan.paymentDate,
                          registrationNumber: challan.registrationNumber,
                          offence: challan.offence,
                          amountPaid: challan.amount
                        })}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600 font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallanPaymentHistoryModal;
