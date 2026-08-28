import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useChallan } from '../contexts/ChallanContext';
import { useLanguage } from '../contexts/LanguageContext';

const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <span className="font-medium text-slate-800">{question}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
      </button>
      {open && (
        <div className="p-4 bg-white text-slate-600 text-sm leading-relaxed border-t border-slate-100">
          {answer}
        </div>
      )}
    </div>
  );
};

const ChallanUnderstandPage = () => {
  const [searchParams] = useSearchParams();
  const challanId = searchParams.get('id');
  const { challans } = useChallan();
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
        <h1 className="text-3xl font-bold text-slate-900">{g.understandTitle || 'Why Do I Have This Challan?'}</h1>
        <p className="text-slate-600 mt-2 text-lg">
          {g.understandSubtitle || 'Understand why your challan was issued, what it means, and what you can do next.'}
        </p>
      </div>

      {/* SECTION 1 - CHALLAN SUMMARY */}
      {challan ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Your Challan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Challan Number</p>
              <p className="font-semibold text-slate-800">CH-{String(challan.id).padStart(8, '0')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Vehicle</p>
              <p className="font-semibold text-slate-800">{challan.registrationNumber}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Date</p>
              <p className="font-semibold text-slate-800">{new Date(challan.challanDate).toLocaleDateString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Location</p>
              <p className="font-semibold text-slate-800 truncate">{challan.location || 'Bengaluru'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Amount</p>
              <p className="font-semibold text-red-600">â‚¹{Number(challan.amount).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Violation</p>
              <p className="font-semibold text-slate-800">{challan.offence}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">No Specific Challan Selected</h3>
          <p className="text-sm text-slate-600 max-w-md mb-6">
            You are viewing the general guide. To see specific details about a violation, please select a challan from your dashboard.
          </p>
          <Link to="/challans" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
            {g.checkMyChallans || 'Check My Challans'}
          </Link>
        </div>
      )}

      {/* SECTION 2 - WHAT HAPPENED? */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{g.whatHappened || 'What Happened?'}</h2>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          {/* Connecting Line (hidden on mobile, visible on sm+) */}
          <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
          
          {[
            { step: '1', title: 'Traffic Violation', desc: 'A rule was broken' },
            { step: '2', title: 'Violation Recorded', desc: 'By camera or officer' },
            { step: '3', title: 'Challan Generated', desc: 'Sent to the system' },
            { step: '4', title: 'Citizen Action', desc: 'Pay or dispute' }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center bg-white sm:px-2 w-full sm:w-1/4">
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold mb-3 shadow-md z-10 border-4 border-white">
                {item.step}
              </div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SECTION 3 - WHY ARE CHALLANS ISSUED? */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{g.whyIssued || 'Why Are Challans Issued?'}</h2>
          <ul className="space-y-3">
            {[
              'Encourage compliance with traffic rules.',
              'Improve overall road safety for everyone.',
              'Record violations digitally and transparently.',
              'Help authorities manage traffic efficiently.'
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION 4 - UNDERSTAND YOUR VIOLATION */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{g.understandViolation || 'What Does Your Violation Mean?'}</h2>
          
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <h3 className="font-bold text-orange-800 mb-2">{challan ? challan.offence : 'Example: Over Speeding'}</h3>
            <p className="text-sm text-orange-700 mb-3">
              This means your vehicle was recorded traveling above the legally prescribed speed limit for that specific road.
            </p>
            <div className="bg-white/60 p-3 rounded-lg text-xs text-orange-800">
              <strong>What you should know:</strong> Speed limits vary by road type. Ensure you always look for speed limit signs to avoid future penalties.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5 - WHAT SHOULD I DO NOW? */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">{g.whatNow || 'What Should I Do Now?'}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            to={challan ? `/challan/how-to-pay?id=${challan.id}` : '/challan/how-to-pay'} 
            className="flex flex-col p-5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors group text-left"
          >
            <span className="text-xs font-bold text-emerald-600 tracking-wider mb-2">ðŸŸ¢ {g.iAgree || 'I AGREE'}</span>
            <span className="font-semibold text-slate-800 mb-1">{g.payChallan || 'Pay Challan'}</span>
            <span className="text-xs text-slate-600">{g.iAgreeDesc || 'Pay your challan online securely'}</span>
          </Link>

          <div className="flex flex-col p-5 rounded-xl border border-blue-200 bg-blue-50 text-left opacity-70">
            <span className="text-xs font-bold text-blue-600 tracking-wider mb-2">ðŸŸ¡ {g.iDontUnderstand || "I DON'T UNDERSTAND"}</span>
            <span className="font-semibold text-slate-800 mb-1">You are here</span>
            <span className="text-xs text-slate-600">Reading the violation guide</span>
          </div>

          <Link 
            to={challan ? `/challan/disagree?id=${challan.id}` : '/challan/disagree'} 
            className="flex flex-col p-5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 transition-colors group text-left"
          >
            <span className="text-xs font-bold text-red-600 tracking-wider mb-2">ðŸ”´ {g.iDisagree || 'I DISAGREE'}</span>
            <span className="font-semibold text-slate-800 mb-1">{g.raiseGrievance || 'Challenge / Raise Grievance'}</span>
            <span className="text-xs text-slate-600">{g.iDisagreeDesc || 'Submit a formal dispute request'}</span>
          </Link>
        </div>
      </div>

      {/* SECTION 6 - COMMON QUESTIONS */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">{g.commonQuestions || 'Common Questions'}</h2>
        <div className="flex flex-col gap-3">
          <FAQItem 
            question="What is a challan?" 
            answer="A challan is an official notice issued for violating a traffic rule. It carries a penalty fine that must be paid within a specified time." 
          />
          <FAQItem 
            question="How do I know whether my challan is genuine?" 
            answer="Always check your challan through official portals or this authenticated application. Verify your vehicle number, location, and date of offence." 
          />
          <FAQItem 
            question="What can I do if I believe the challan is incorrect?" 
            answer="You have the right to challenge it. Gather your evidence (like photos or toll receipts proving your vehicle was elsewhere) and use the 'I Disagree' grievance form." 
          />
        </div>
      </div>

      {/* SECTION 7 - SAFETY */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-start gap-4">
        <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
        <div>
          <h3 className="font-bold text-lg mb-1">{g.safety || 'STAY SAFE'}</h3>
          <p className="text-sm text-slate-300">
            {g.safetyDesc || 'Use trusted/official payment channels. Never share your OTP, password or payment credentials with anyone.'}
          </p>
        </div>
      </div>

    </div>
  );
};

export default ChallanUnderstandPage;
