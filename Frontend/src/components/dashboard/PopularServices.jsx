import React from 'react';
import { Users, BookOpen, FileBadge, Truck } from 'lucide-react';

const PopularServices = () => {
  const services = [
    {
      icon: <Users className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50/80 border-blue-100',
      title: 'Ownership Transfer',
      desc: 'Transfer vehicle ownership'
    },
    {
      icon: <BookOpen className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50/80 border-blue-100',
      title: 'Driving Licence',
      desc: 'Apply / Renew DL'
    },
    {
      icon: <FileBadge className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50/80 border-blue-100',
      title: 'Learner Licence',
      desc: 'Apply for LL'
    },
    {
      icon: <Truck className="w-4 h-4 text-blue-600" />,
      bg: 'bg-blue-50/80 border-blue-100',
      title: 'National Permit',
      desc: 'Apply for Permit'
    }
  ];

  return (
    <div className="bg-white rounded-[1.25rem] border border-slate-200 p-5 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[14px] font-bold text-[#1e293b]">Popular Services</h2>
        <button className="text-[12px] font-bold text-blue-600 hover:underline">View All</button>
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
