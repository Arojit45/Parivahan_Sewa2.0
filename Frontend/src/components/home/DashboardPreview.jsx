import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const DashboardPreview = () => {
  const benefits = [
    "Vehicle Health Score",
    "Compliance & Expiry Alerts",
    "Live Location & Speed",
    "Challan & Payments",
    "Smart Recommendations"
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="lg:w-1/3">
            <p className="text-blue-700 font-bold text-xs tracking-widest uppercase mb-4">Your Vehicle Command Center</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
              Your Personalized Dashboard
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              See everything that matters about your vehicle in a single, intelligent dashboard.
            </p>
            
            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-700 font-medium">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  {benefit}
                </li>
              ))}
            </ul>
            
            <button className="bg-white hover:bg-slate-50 text-blue-700 border-2 border-blue-100 hover:border-blue-200 px-8 py-3.5 rounded-xl font-semibold transition-all shadow-sm inline-flex items-center justify-center gap-2">
              View Dashboard Preview
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right Content - Mockup */}
          <div className="lg:w-2/3 relative w-full">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full blur-3xl -z-10"></div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
               <img src="/dashboard.png" alt="Dashboard Preview" className="w-full rounded-2xl shadow-2xl border border-slate-100" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
