import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IdCard, Car, Search, MapPin, ShieldAlert, Truck, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <IdCard className="w-8 h-8 text-blue-600" />,
      bg: 'bg-blue-50',
      title: 'Driving License',
      desc: 'Apply, renew, update & download your Driving License online.'
    },
    {
      icon: <Car className="w-8 h-8 text-indigo-600" />,
      bg: 'bg-indigo-50',
      title: 'Vehicle Registration',
      desc: 'Register your vehicle, transfer ownership & manage RC services.'
    },
    {
      icon: <Search className="w-8 h-8 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: 'Vehicle Information',
      desc: 'Access RC details, PUC, Insurance, Tax, Challan & more in one place.'
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      bg: 'bg-blue-50',
      title: 'Smart Tracking',
      desc: 'Real-time GPS tracking, route history & live location updates.'
    },
    {
      icon: <ShieldAlert className="w-8 h-8 text-green-600" />,
      bg: 'bg-green-50',
      title: 'Guardian Mode',
      desc: 'Get alerts when your vehicle moves out of safe zone.'
    },
    {
      icon: <Truck className="w-8 h-8 text-teal-600" />,
      bg: 'bg-teal-50',
      title: 'Transport Services',
      desc: 'Permit, Fitness, NOC & all transport-related services.'
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-emerald-600 font-bold text-xs tracking-widest uppercase mb-3">Everything You Need</p>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">One Platform. Every Service.</h2>
          <div className="w-16 h-1.5 bg-blue-600 rounded-full mx-auto"></div>
        </div>

        <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2rem] p-5 lg:p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all flex flex-col h-full cursor-pointer group"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${service.bg}`}>
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">{service.title}</h3>
              <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">{service.desc}</p>
              
              <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                Explore <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/auth" className="bg-white hover:bg-slate-50 text-blue-700 border border-slate-200 hover:border-blue-300 px-8 py-3.5 rounded-xl font-semibold transition-all shadow-sm inline-flex items-center justify-center gap-2">
            View All Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Services;
