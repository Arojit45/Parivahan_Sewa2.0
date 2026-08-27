import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle2, CreditCard, ShieldCheck, Download, AlertCircle, FileText } from 'lucide-react';
import { useChallan } from '../contexts/ChallanContext';
import { useLanguage } from '../contexts/LanguageContext';

const ChallanHowToPayPage = () => {
  const [searchParams] = useSearchParams();
  const challanId = searchParams.get('id');
  const { challans, openPaymentModal, openPaymentHistoryModal } = useChallan();
  const { t } = useLanguage();
  const g = t.challan?.guide || {};

  const challan = challans.find(c => String(c.id) === challanId);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-12">
      
      {/* Header */}
      <div>
        <Link to="/challans" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> {g.backToChallans || 'Back to Challans'}
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">{g.payTitle || 'How To Pay Your Challan'}</h1>
        <p className="text-slate-600 mt-2 text-lg">
          {g.paySubtitle || 'Check your challan details, complete payment, and keep your receipt safely.'}
        </p>
      </div>

      {/* SECTION 1 - VISUAL PAYMENT JOURNEY */}
      <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-8 text-center">{g.paymentJourney || 'Payment Journey'}</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="hidden md:block absolute top-[40px] left-10 right-10 h-1 bg-slate-100 -z-10"></div>
          
          {[
            { step: '01', title: 'Find Challan', icon: <Search className="w-6 h-6" /> },
            { step: '02', title: 'Verify Details', icon: <CheckCircle2 className="w-6 h-6" /> },
            { step: '03', title: 'Make Payment', icon: <CreditCard className="w-6 h-6" /> },
            { step: '04', title: 'Save Receipt', icon: <Download className="w-6 h-6" /> }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center bg-white z-10">
              <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4 shadow-sm border-4 border-white relative">
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">{item.step}</span>
                {item.icon}
              </div>
              <h4 className="font-bold text-slate-800">{item.title}</h4>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SECTION 2 - FIND YOUR CHALLAN */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">{g.findChallan || 'Find Your Challan'}</h2>
            <p className="text-sm text-slate-600 mb-4">
              To pay, you must first locate your challan in the system. You can easily find it on your dashboard using your associated vehicles.
            </p>
          </div>
          {!challan && (
            <Link to="/challans" className="inline-flex items-center justify-center w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">
              {g.checkMyChallans || 'Check My Challans'}
            </Link>
          )}
        </div>

        {/* SECTION 3 - VERIFY BEFORE PAYING */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-3">{g.verifyDetails || 'Verify Before Paying'}</h2>
          <p className="text-sm text-slate-600 mb-4">{g.verifyDesc || 'Always verify the challan details before making a payment.'}</p>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Vehicle Number</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Challan Number</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Violation</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Amount</div>
          </div>
        </div>
      </div>

      {/* SECTION 4 - PAYMENT (Actual Action) */}
      <div className="bg-blue-50 rounded-2xl p-6 md:p-8 border border-blue-200 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{g.paymentProcess || 'Payment Process'}</h2>
        <p className="text-slate-600 max-w-xl mx-auto mb-8">
          The official payment integration allows you to securely pay your pending challans. Review the amount and complete the process using your preferred digital method.
        </p>

        {challan ? (
          <div className="bg-white rounded-xl p-6 shadow-sm max-w-sm mx-auto border border-blue-100">
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-2">Selected Challan</h3>
            <p className="text-2xl font-bold text-slate-800 mb-1">CH-{String(challan.id).padStart(8, '0')}</p>
            <p className="text-slate-500 mb-4">{challan.offence}</p>
            <div className="text-3xl font-bold text-blue-600 mb-6">₹{Number(challan.amount).toLocaleString('en-IN')}</div>
            
            {challan.status === 'PENDING' ? (
              <button 
                onClick={() => openPaymentModal(challan)}
                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Pay Now
              </button>
            ) : (
              <div className="w-full py-3 bg-slate-100 text-slate-500 font-semibold rounded-xl text-sm border border-slate-200">
                This challan is {challan.status}
              </div>
            )}
          </div>
        ) : (
          <div className="inline-block bg-white px-6 py-4 rounded-xl shadow-sm text-sm font-medium text-slate-500 border border-slate-200">
            Select a pending challan from the dashboard to initiate payment.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SECTION 5 & 7 - SUCCESS & RECEIPT */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-emerald-700 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" /> {g.paymentSuccess || 'Payment Success'}
          </h2>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-slate-600 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Payment confirmation</li>
            <li className="flex items-center gap-2 text-slate-600 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Transaction reference number</li>
            <li className="flex items-center gap-2 text-slate-600 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Updated payment status</li>
          </ul>
          
          <div className="pt-6 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" /> {g.keepReceipt || 'Keep Your Receipt'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">Always keep the digital receipt for your records.</p>
            <button 
              onClick={openPaymentHistoryModal}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors text-sm w-full"
            >
              View My Payment History
            </button>
          </div>
        </div>

        {/* SECTION 6 - PAYMENT FAILED */}
        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
          <h2 className="text-xl font-bold text-orange-800 mb-3 flex items-center gap-2">
            <AlertCircle className="w-6 h-6" /> {g.paymentFailed || 'Payment Failed or Pending?'}
          </h2>
          <p className="text-sm text-orange-700 mb-6 font-medium">
            {g.paymentFailedDesc || 'If money was deducted but your challan still appears unpaid, do not immediately pay again.'}
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-orange-900/80 mb-6">
            <li>Check payment/transaction status</li>
            <li>Keep your transaction number safe</li>
            <li>Verify whether the payment was successful</li>
            <li>Contact support if the issue remains</li>
          </ol>
          <button 
            onClick={openPaymentHistoryModal}
            className="px-5 py-2.5 bg-white text-orange-700 font-semibold rounded-lg hover:bg-orange-100 transition-colors text-sm w-full border border-orange-200"
          >
            Verify Payment Status
          </button>
        </div>

      </div>

      {/* SECTION 8 - SECURITY WARNING */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-blue-400 shrink-0" />
          <div>
            <h3 className="font-bold text-lg mb-1">{g.protectPayment || 'Protect Your Payment'}</h3>
            <p className="text-sm text-slate-300">
              Never share your OTP, Password, Card PIN, or Banking credentials.
            </p>
          </div>
        </div>
        <div className="shrink-0 text-sm font-medium text-slate-400 bg-slate-800 px-4 py-2 rounded-lg">
          Use only trusted official channels
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4 border-t border-slate-200 pt-8">
        <Link to={challan ? `/challan/why-do-i-have-this-challan?id=${challan.id}` : '/challan/why-do-i-have-this-challan'} className="text-blue-600 font-semibold hover:underline">
          ← {g.understandTitle || 'Why do I have this challan?'}
        </Link>
        <Link to={challan ? `/challan/disagree?id=${challan.id}` : '/challan/disagree'} className="text-blue-600 font-semibold hover:underline sm:text-right">
          {g.disagreeTitle || 'Do you disagree with this challan?'} →
        </Link>
      </div>

    </div>
  );
};

export default ChallanHowToPayPage;
