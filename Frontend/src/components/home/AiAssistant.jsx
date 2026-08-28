import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, ArrowRight, MessageSquare } from 'lucide-react';

const AiAssistant = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50/50">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-white shadow-2xl relative overflow-hidden">
          
          {/* Decorative blur blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 relative z-10">
            
            {/* Left Image / Chat Mockup */}
            <div className="lg:w-1/2 w-full">
              <div className="relative">
                {/* AI Assistant Image */}
                <div className="w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center relative z-10">
                  <img src="/Ai asistance.png" alt="AI Assistant Robot" className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
                
                {/* Floating Chat Bubbles */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-10 -left-4 md:left-0 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl rounded-tl-sm shadow-xl border border-slate-100 max-w-[200px] z-20"
                >
                  <p className="text-sm font-medium text-slate-700">When is my insurance expiry?</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute top-24 -right-4 md:right-0 bg-blue-600/95 backdrop-blur-md px-5 py-3 rounded-2xl rounded-tr-sm shadow-xl shadow-blue-600/20 max-w-[220px] z-20"
                >
                  <p className="text-sm font-medium text-white">Your insurance expires on 25 Dec 2026.</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-20 -left-4 md:left-4 bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl rounded-tl-sm shadow-xl border border-slate-100 max-w-[200px] z-20"
                >
                  <p className="text-sm font-medium text-slate-700">Show my pending challans.</p>
                </motion.div>
                
                 <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-4 -right-4 md:right-8 bg-blue-600/95 backdrop-blur-md px-5 py-3 rounded-2xl rounded-tr-sm shadow-xl shadow-blue-600/20 max-w-[220px] z-20"
                >
                  <p className="text-sm font-medium text-white">You have 1 pending challan of ₹1,000.</p>
                </motion.div>

              </div>
            </div>

            {/* Right Content */}
            <div className="lg:w-1/2">
              <p className="text-indigo-600 font-bold text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                AI Assistant
              </p>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                Ask My Vehicle,<br/>
                <span className="text-blue-700">Get Instant Answers</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Your smart assistant for all vehicle & transport related queries. Fast. Accurate. Always available. Just ask or type.
              </p>
              
              <Link to="/auth" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 inline-flex items-center justify-center gap-2">
                <Bot className="w-5 h-5" />
                Chat with AI Assistant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AiAssistant;
