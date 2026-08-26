import React, { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { Play, Pause, Headphones, ChevronDown, ChevronRight, MapPin, Building2, Car, ClipboardCheck, CreditCard, Crosshair, ArrowRight, ArrowLeft, MessageCircle, Phone, Map, Video, Search, CheckCircle2, Bot, Sparkles, Navigation, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DrivingLicensePage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(2);

  const steps = [
    { num: "01", title: t.dl.steps.s1.title, desc: t.dl.steps.s1.desc, icon: MapPin },
    { num: "02", title: t.dl.steps.s2.title, desc: t.dl.steps.s2.desc, icon: Building2 },
    { num: "03", title: t.dl.steps.s3.title, desc: t.dl.steps.s3.desc, icon: Car },
    { num: "04", title: t.dl.steps.s4.title, desc: t.dl.steps.s4.desc, icon: ClipboardCheck },
    { num: "05", title: t.dl.steps.s5.title, desc: t.dl.steps.s5.desc, icon: CreditCard },
    { num: "06", title: t.dl.steps.s6.title, desc: t.dl.steps.s6.desc, icon: Crosshair },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden bg-slate-50">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white"></div>
           
           {/* The Image */}
           <img 
             src="/drivinglicensesHeroSection.png" 
             alt="Hero Background" 
             className="absolute bottom-0 right-0 w-[120%] md:w-[75%] h-auto object-contain object-bottom opacity-100"
             onError={(e) => e.target.style.display = 'none'}
           />
           
           {/* Gradient fades to protect text legibility (Left side and bottom) */}
           <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent w-full md:w-[65%]"></div>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent h-32 mt-auto"></div>
           
           {/* Subtle texture overlay */}
           <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl relative">
            {/* Optional text-shadow or backdrop blur can be added here if needed, but gradient is usually enough */}
            <h3 className="text-blue-600 font-bold text-sm md:text-base tracking-wide uppercase mb-3 drop-shadow-sm">Get Your Driving Licence</h3>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 drop-shadow-sm">
              {t.dl.heroTitle1} <br/>
              <span className="text-blue-600">{t.dl.heroTitle2}</span>
            </h1>
            <p className="text-lg text-slate-700 mb-8 max-w-xl font-medium leading-relaxed drop-shadow-sm bg-white/40 md:bg-transparent p-2 md:p-0 rounded-lg backdrop-blur-sm md:backdrop-blur-none">
              {t.dl.heroSubtitle}
            </p>
            
            <button
              onClick={() => navigate('/driving-license/apply')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold text-lg flex items-center gap-3 transition-colors shadow-xl shadow-blue-600/20"
            >
              {t.dl.startJourney} <ArrowRight className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mt-8 text-sm font-semibold text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {t.dl.features}
            </div>
          </div>
        </div>
      </section>

      {/* Audio Guide Bar */}
      <section className="relative z-20 -mt-8 max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 leading-tight">{t.dl.audioGuide}</h4>
              <p className="text-xs text-slate-500 font-medium">{t.dl.listenFollow}</p>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center gap-6 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-700">
              <img src="https://flagcdn.com/w20/gb.png" alt="English" className="w-4" /> English
            </div>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md shrink-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <div className="hidden sm:flex items-center gap-1 h-8 px-2 overflow-hidden w-32 md:w-48">
               {[...Array(24)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={isPlaying ? { height: [8, Math.random() * 24 + 8, 8] } : { height: 4 }}
                    transition={isPlaying ? { repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" } : {}}
                    className={`w-1 rounded-full ${isPlaying ? 'bg-blue-500' : 'bg-slate-300'}`}
                  />
               ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {['हिंदी', 'বাংলা', 'मराठी', 'தமிழ்', 'తెలుగు'].map((lang, idx) => (
              <button key={idx} className="px-3 py-1.5 border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                {lang}
              </button>
            ))}
            <button className="px-3 py-1.5 border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1 transition-colors">
              {t.dl.more} <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Journey Stepper */}
      <section className="py-16 max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.dl.journeyTitle}</h2>
              <p className="text-slate-500 font-medium">{t.dl.journeySubtitle}</p>
            </div>
            <button className="hidden sm:block border border-slate-300 hover:border-blue-600 text-slate-700 hover:text-blue-600 font-semibold px-6 py-2 rounded-lg transition-colors">
              {t.dl.viewAllSteps}
            </button>
          </div>

          <div className="relative">
             {/* Progress Line */}
             <div className="hidden lg:block absolute top-[40px] left-[5%] right-[5%] h-0.5 bg-slate-100 -z-10"></div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
               {steps.map((step, idx) => (
                 <div key={idx} className="flex flex-col items-center text-center relative group">
                   {/* Step Icon */}
                   <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-sm border-4 border-white ${
                     idx < activeStep ? 'bg-emerald-100 text-emerald-600' : 
                     idx === activeStep ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600 ring-offset-2' : 
                     'bg-slate-100 text-slate-400'
                   }`}>
                     <step.icon className={`w-8 h-8 ${idx === activeStep ? 'animate-pulse' : ''}`} />
                   </div>
                   
                   {/* Tooltip for Active Step */}
                   {idx === activeStep && (
                     <div className="absolute -bottom-8 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                       {t.dl.youAreHere}
                       <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"></div>
                     </div>
                   )}

                   <div className={`text-lg font-bold mb-1 ${idx <= activeStep ? 'text-slate-900' : 'text-slate-400'}`}>{step.num}</div>
                   <div className={`text-sm font-bold mb-1 ${idx <= activeStep ? 'text-slate-800' : 'text-slate-500'}`}>{step.title}</div>
                   <div className="text-xs text-slate-500 font-medium px-2">{step.desc}</div>

                   {/* Connector Arrow (Desktop) */}
                   {idx < steps.length - 1 && (
                     <div className="hidden lg:block absolute top-[40px] right-[-20%] text-slate-300">
                       <ArrowRight className="w-5 h-5" />
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </div>

          <div className="mt-16 text-center text-sm font-medium text-slate-500 bg-slate-50 py-3 rounded-xl border border-slate-100">
            {t.dl.tip}
          </div>
        </div>
      </section>

      {/* Path & Smart Assistant */}
      <section className="py-8 max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Choose Your Path */}
          <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.dl.choosePath}</h2>
            <p className="text-slate-500 font-medium mb-8">{t.dl.pathSubtitle}</p>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4 w-full">
                {/* Path 1 */}
                <div className="group border border-slate-200 hover:border-blue-400 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors">{t.dl.haveLL}</h4>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug">{t.dl.haveLLDesc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                
                {/* Path 2 */}
                <div className="group border border-slate-200 hover:border-emerald-400 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                      <Navigation className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">{t.dl.noLL}</h4>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug">{t.dl.noLLDesc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                </div>
              </div>

              {/* Road Illustration */}
              <div className="hidden md:flex w-56 lg:w-64 shrink-0 items-center justify-center relative">
                 <img src="/road.png" alt="Path Illustration" className="w-full h-auto object-contain drop-shadow-md hover:scale-105 transition-transform duration-500" onError={(e) => e.target.style.display = 'none'} />
              </div>
            </div>
          </div>

          {/* Smart Assistant */}
          <div className="w-full lg:w-[400px] bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -z-10"></div>
             
             {/* Floating AI Illustration */}
             <div className="absolute -top-4 -right-2 w-28 h-28 pointer-events-none z-10 animate-bounce" style={{ animationDuration: '3s' }}>
                <img src="/Ai asistance.png" alt="AI Assistant" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
             </div>
             
             <div className="flex items-center justify-between mb-6 relative z-20">
               <div className="pr-16">
                 <h3 className="text-xl font-bold text-slate-900">{t.dl.smartAssistant}</h3>
                 <p className="text-xs text-slate-500 font-medium mt-1">{t.dl.askAnything}</p>
               </div>
             </div>

             <div className="flex-1 flex flex-col gap-3 mb-6">
               <button className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-100 hover:border-blue-200 text-xs font-medium py-2 px-4 rounded-full text-left transition-colors truncate">
                 {t.dl.q1}
               </button>
               <button className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-100 hover:border-blue-200 text-xs font-medium py-2 px-4 rounded-full text-left transition-colors truncate">
                 {t.dl.q2}
               </button>
               <button className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-100 hover:border-blue-200 text-xs font-medium py-2 px-4 rounded-full text-left transition-colors truncate">
                 {t.dl.q3}
               </button>
               <button className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-100 hover:border-blue-200 text-xs font-medium py-2 px-4 rounded-full text-left transition-colors truncate">
                 {t.dl.q4}
               </button>
             </div>

             <div className="mt-auto relative">
               <input 
                 type="text" 
                 placeholder={t.dl.typeQ} 
                 className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-5 pr-12 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
               />
               <button className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm">
                 <ArrowRight className="w-4 h-4" />
               </button>
             </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8 max-w-[1600px] mx-auto px-4 md:px-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">{t.dl.whyChoose}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
           {/* F1 */}
           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center hover:-translate-y-1 transition-transform">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
               <Globe className="w-6 h-6" />
             </div>
             <h4 className="font-bold text-slate-800 text-sm mb-1">{t.dl.w1Title}</h4>
             <p className="text-[10px] text-slate-500 font-medium">{t.dl.w1Desc}</p>
           </div>
           {/* F2 */}
           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center hover:-translate-y-1 transition-transform">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
               <Headphones className="w-6 h-6" />
             </div>
             <h4 className="font-bold text-slate-800 text-sm mb-1">{t.dl.w2Title}</h4>
             <p className="text-[10px] text-slate-500 font-medium">{t.dl.w2Desc}</p>
           </div>
           {/* F3 */}
           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center hover:-translate-y-1 transition-transform">
             <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4">
               <ClipboardCheck className="w-6 h-6" />
             </div>
             <h4 className="font-bold text-slate-800 text-sm mb-1">{t.dl.w3Title}</h4>
             <p className="text-[10px] text-slate-500 font-medium">{t.dl.w3Desc}</p>
           </div>
           {/* F4 */}
           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center hover:-translate-y-1 transition-transform">
             <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
               <MapPin className="w-6 h-6" />
             </div>
             <h4 className="font-bold text-slate-800 text-sm mb-1">{t.dl.w4Title}</h4>
             <p className="text-[10px] text-slate-500 font-medium">{t.dl.w4Desc}</p>
           </div>
           {/* F5 */}
           <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center hover:-translate-y-1 transition-transform">
             <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-4">
               <Shield className="w-6 h-6" />
             </div>
             <h4 className="font-bold text-slate-800 text-sm mb-1">{t.dl.w5Title}</h4>
             <p className="text-[10px] text-slate-500 font-medium">{t.dl.w5Desc}</p>
           </div>
        </div>
      </section>

      {/* Need Help Banner */}
      <section className="py-8 max-w-[1600px] mx-auto px-4 md:px-8 pb-16">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/30 rounded-3xl p-6 md:p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-8 shadow-inner relative overflow-hidden">
          
          <div className="flex items-center gap-6 relative z-10">
            {/* Help Character Illustration */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-md flex items-center justify-center shrink-0 overflow-hidden bg-white">
               <img src="/needHelp.png" alt="Support" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{t.dl.needHelp}</h2>
              <p className="text-slate-600 font-medium mt-1">{t.dl.weAreHere}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 relative z-10 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-3 flex items-center gap-3 transition-colors shadow-sm">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><MessageCircle className="w-5 h-5" /></div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">{t.dl.chat}</div>
                <div className="text-[10px] text-slate-500 font-medium">{t.dl.chatDesc}</div>
              </div>
            </button>
            <button className="flex-1 md:flex-none bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-3 flex items-center gap-3 transition-colors shadow-sm">
              <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><Phone className="w-5 h-5" /></div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">{t.dl.call}</div>
                <div className="text-[10px] text-slate-500 font-medium">{t.dl.callDesc}</div>
              </div>
            </button>
            <button className="flex-1 md:flex-none bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-3 flex items-center gap-3 transition-colors shadow-sm">
              <div className="bg-amber-50 p-2 rounded-lg text-amber-600"><Map className="w-5 h-5" /></div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">{t.dl.locate}</div>
                <div className="text-[10px] text-slate-500 font-medium">{t.dl.locateDesc}</div>
              </div>
            </button>
            <button className="flex-1 md:flex-none bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-3 flex items-center gap-3 transition-colors shadow-sm">
              <div className="bg-red-50 p-2 rounded-lg text-red-600"><Video className="w-5 h-5" /></div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800">{t.dl.video}</div>
                <div className="text-[10px] text-slate-500 font-medium">{t.dl.videoDesc}</div>
              </div>
            </button>
          </div>

        </div>

        {/* Bottom Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm font-semibold text-slate-600">
           <div className="flex items-center gap-2"><div className="text-blue-500"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg></div> Trusted by Millions of Indians</div>
           <div className="flex items-center gap-2"><div className="text-blue-500"><Building2 className="w-5 h-5" /></div> Used in 36 States / UTs</div>
           <div className="flex items-center gap-2"><div className="text-blue-500"><Clock className="w-5 h-5" /></div> 24x7 Online Services</div>
           <div className="flex items-center gap-2"><div className="text-blue-500"><Shield className="w-5 h-5" /></div> Secure & Government Verified</div>
        </div>
      </section>
        </main>
      </div>
    </div>
  );
};

// Simple Clock Icon fallback for trust badge
const Clock = (props) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
)

export default DrivingLicensePage;
