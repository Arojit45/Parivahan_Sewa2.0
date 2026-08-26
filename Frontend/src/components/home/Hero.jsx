import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Bell, Shield, Bot, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import CarModelViewer from '../CarModelViewer';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 overflow-hidden relative">
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-[120%] -z-10 pointer-events-none opacity-50">
        <img src="/heroSectionbackground.png" alt="Background pattern" className="w-full h-full object-cover mix-blend-multiply" />
      </div>
      
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-emerald-600 font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Connected. Intelligent. Citizen First.
            </p>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6">
              India Moves.<br/>
              <span className="text-blue-700">We Power Every Journey.</span>
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              Parivahan Sewa is India's comprehensive digital platform for all vehicle & transport services — empowering citizens with smart technology, real-time insights and seamless access to government services.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                Explore Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-white hover:bg-slate-50 text-blue-600 border-2 border-blue-100 hover:border-blue-200 px-8 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-sm">
                View All Services
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden z-[${6-i}] relative`}>
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">3.2M+</span>
                  <span className="text-sm text-slate-600 font-medium">Happy Users</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Abstract Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] lg:h-[600px] w-full"
          >
            {/* Illustration Base */}
            <div className="absolute inset-0 m-auto flex items-center justify-center z-10 w-full h-[450px] lg:h-[600px]">
               <CarModelViewer />
            </div>

            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-20 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 z-20"
            >
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-slate-800 pr-2">Smart Alerts<br/><span className="text-xs font-normal text-slate-500">& Notifications</span></div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/4 left-0 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 z-20"
            >
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-slate-800 pr-2">Real-time GPS<br/><span className="text-xs font-normal text-slate-500">Tracking</span></div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-1/4 left-10 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 z-20"
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-slate-800 pr-2">AI Assistant<br/><span className="text-xs font-normal text-slate-500">Ask My Vehicle</span></div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-20 right-10 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 z-20"
            >
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-slate-800 pr-2">Guardian Mode<br/><span className="text-xs font-normal text-slate-500">Stay Protected</span></div>
            </motion.div>

             <motion.div 
              animate={{ y: [0, 8, 0] }} 
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute top-1/2 right-0 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100 z-20"
            >
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-slate-800 pr-2">Paperless<br/><span className="text-xs font-normal text-slate-500">Processes</span></div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
