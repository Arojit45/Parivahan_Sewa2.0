import React from 'react';
import { ShieldCheck, Zap, Globe, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      title: 'Secure & Trusted',
      desc: 'Government of India initiative with highest security standards.'
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      title: 'Fast & Convenient',
      desc: 'Digital, paperless and available 24x7 from anywhere.'
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      title: 'Unified Platform',
      desc: 'All transport services integrated across India.'
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      title: 'Citizen First',
      desc: 'Designed to simplify lives and enhance road safety for all.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-12">
          <p className="text-emerald-600 font-bold text-xs tracking-widest uppercase mb-3">Why Parivahan Sewa?</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
