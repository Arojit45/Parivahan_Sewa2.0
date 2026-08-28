import React, { useState } from 'react';
import { Car, Users, UserCheck, FileText, Truck, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

// ── Coming Soon Popup ──────────────────────────────────────────────────────
const ComingSoonPopup = ({ onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-6 pt-8 pb-4">
        <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
        <p className="text-[13px] text-slate-500 leading-relaxed">
          This feature is under development and will be available shortly. Stay tuned!
        </p>
      </div>
      <div className="px-6 pb-6 mt-2">
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────
const GuidedProcesses = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const processes = [
    {
      icon: <Car className="w-5 h-5 text-blue-500" />,
      title: t.dash?.vehicleRegistration || 'Vehicle Registration',
      subtitle: t.dash?.newRegistration || 'New Registration',
      color: 'text-blue-700 bg-blue-50 border-blue-100',
      action: () => navigate('/register-vehicle'),
    },
    {
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      title: t.dash?.transferOwnership || 'Ownership Transfer',
      subtitle: t.dash?.transferDesc || 'Transfer vehicle ownership',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
      action: () => setShowComingSoon(true),
    },
    {
      icon: <UserCheck className="w-5 h-5 text-purple-500" />,
      title: t.dash?.learnerLicence || 'Learner Licence',
      subtitle: t.dash?.applyLl || 'Apply for LL',
      color: 'text-purple-700 bg-purple-50 border-purple-100',
      action: () => navigate('/driving-license'),
    },
    {
      icon: <FileText className="w-5 h-5 text-indigo-500" />,
      title: t.dash?.drivingLicence || 'Driving Licence',
      subtitle: t.dash?.applyDl || 'Apply / Renew DL',
      color: 'text-indigo-700 bg-indigo-50 border-indigo-100',
      action: () => navigate('/driving-license'),
    },
    {
      icon: <Truck className="w-5 h-5 text-amber-500" />,
      title: t.dash?.nationalPermit || 'National Permit',
      subtitle: t.dash?.applyPermit || 'Apply Permit',
      color: 'text-amber-700 bg-amber-50 border-amber-100',
      action: () => setShowComingSoon(true),
    },
  ];

  return (
    <>
      <div className="bg-[#F8FAFC] rounded-[1.25rem] border border-slate-200 p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[15px] font-bold text-[#1e293b]">{t.dash?.guidedProcesses || "Guided Processes"}</h2>
          <button className="text-[13px] font-bold text-blue-600 hover:underline">{t.dash?.viewAllProcesses || "View All Processes"} &rsaquo;</button>
        </div>

        <div className="flex flex-wrap gap-4">
          {processes.map((proc, idx) => (
            <button
              key={idx}
              onClick={proc.action}
              className="flex-1 min-w-[200px] flex items-center gap-3 border border-slate-200 rounded-[1.25rem] p-3 hover:shadow-md transition-shadow text-left bg-white shadow-sm"
            >
              <div className={`w-10 h-10 rounded-[0.8rem] border flex items-center justify-center shrink-0 ${proc.color}`}>
                {proc.icon}
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-slate-900">{proc.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">{proc.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showComingSoon && <ComingSoonPopup onClose={() => setShowComingSoon(false)} />}
    </>
  );
};

export default GuidedProcesses;
