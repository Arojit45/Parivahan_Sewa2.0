import { useLanguage } from '../../contexts/LanguageContext';
import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, Download, ShieldCheck, Loader2 } from 'lucide-react';
import { useChallan } from '../../contexts/ChallanContext';
import { downloadReceiptPdf } from '../../utils/challanPdf';

const PaymentConfirmationModal = () => {
  const { t } = useLanguage();
  const c = t.challan || {};
  const { paymentModal, closePaymentModal, confirmPayment } = useChallan();
  const { open, challan, receipt, step } = paymentModal;
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!open || !challan) return null;

  const handlePay = async () => {
    setProcessing(true);
    setError(null);
    try {
      // Simulate network/payment gateway delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      await confirmPayment(challan.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (step === 'success' && receipt) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
          <p className="text-slate-500 text-sm mb-6">Your challan has been cleared.</p>

          <div className="bg-slate-50 rounded-xl p-4 w-full text-left space-y-3 mb-6 border border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-semibold text-emerald-600">₹{Number(receipt.amountPaid).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-semibold text-slate-700">{receipt.transactionId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Vehicle</span>
              <span className="font-semibold text-slate-700">{receipt.registrationNumber}</span>
            </div>
          </div>

          <div className="flex w-full gap-3">
            <button 
              onClick={closePaymentModal}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={() => downloadReceiptPdf(receipt)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
            >
              <Download className="w-4 h-4" /> Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default step: confirm
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-lg">Confirm Payment</h2>
          <button onClick={closePaymentModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100/50 flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Amount</p>
              <div className="text-3xl font-bold text-slate-800 mt-1">₹{Number(challan.amount).toLocaleString('en-IN')}</div>
            </div>
            <CreditCard className="w-8 h-8 text-blue-500 opacity-80" />
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-500">Challan Number</span>
              <span className="font-medium text-slate-800">CH-{String(challan.id).padStart(8, '0')}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-3">
              <span className="text-slate-500">Vehicle</span>
              <span className="font-medium text-slate-800">{challan.registrationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Offence</span>
              <span className="font-medium text-slate-800">{challan.offence}</span>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div className="mt-8">
            <button 
              onClick={handlePay}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {processing ? 'Processing Payment...' : `Pay ₹${Number(challan.amount).toLocaleString('en-IN')}`}
            </button>
            <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Secure Payment Gateway (Mock)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;
