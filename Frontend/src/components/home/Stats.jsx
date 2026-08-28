import React from 'react';
import { Users, FileText, Activity, ShieldCheck, Map } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      bg: 'bg-green-100',
      value: '3.2M+',
      label: 'Happy Users'
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-100',
      value: '120+',
      label: 'Online Services'
    },
    {
      icon: <Activity className="w-6 h-6 text-orange-600" />,
      bg: 'bg-orange-100',
      value: '28 Cr+',
      label: 'Transactions'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-100',
      value: '100%',
      label: 'Secure & Trusted'
    },
    {
      icon: <Map className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-100',
      value: 'All India',
      label: 'Unified Platform'
    }
  ];

  return (
    <section className="pb-16 pt-8">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 divide-x-0 lg:divide-x divide-slate-100">
            {stats.map((stat, index) => (
              <div key={index} className={`flex items-center gap-4 ${index !== 0 ? 'lg:pl-8' : ''}`}>
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
