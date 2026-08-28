import React from 'react';
import { Users, BookOpen, FileBadge, Truck } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const PopularServices = () => {
  const { t } = useLanguage();
  const services = [
    {
      icon: <Users className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50/80 border-blue-100',
      title: t.dash?.transferOwnership || 'Ownership Transfer',
      desc: t.dash?.transferDesc || 'Transfer vehicle ownership'
    },
    {
      icon: <BookOpen className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50/80 border-blue-100',
      title: t.dash?.drivingLicence || 'Driving Licence',
      desc: t.dash?.applyDl || 'Apply / Renew DL'
    },
    {
      icon: <FileBadge className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50/80 border-blue-100',
      title: t.dash?.learnerLicence || 'Learner Licence',
      desc: t.dash?.applyLl || 'Apply for LL'
    },
    {
      icon: <Truck className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50/80 border-blue-100',
      title: t.dash?.nationalPermit || 'National Permit',
      desc: t.dash?.applyPermit || 'Apply for Permit'
    }
  ];

  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-200 p-5 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[14px] font-bold text-[#1e293b]">{t.dash?.popularServices || "Popular Services"}</h2>
        <button className="text-[12px] font-bold text-blue-600 hover:underline">{t.dash?.viewAll || "View All"}</button>
      </div>

      <div className="space-y-4 flex-1">
        {services.map((service, idx) => (
          <div key={idx} className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-8 h-8 rounded-[10px] border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${service.bg}`}>
              {service.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[12px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{service.title}</h4>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularServices;
