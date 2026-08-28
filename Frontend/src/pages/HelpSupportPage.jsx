import React, { useState } from 'react';
import { Search, Car, FileText, Bell, Headphones, Download, ArrowRight, Activity, ShieldAlert, Shield, Radio, MessageSquare, PlayCircle, Book, ExternalLink, ChevronRight, Upload, HelpCircle, FileQuestion, MapPin, Receipt } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import { Link } from 'react-router-dom';

const HelpSupportPage = () => {

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-['Poppins']">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto">
          {/* Hero Section */}
          <div className="bg-blue-50/50 pt-12 pb-16 px-4 lg:px-8 border-b border-blue-100 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40" style={{
              backgroundImage: 'url(/heroSectionbackground.png)',
              backgroundPosition: 'bottom center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}></div>
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10">
              <div className="w-full lg:w-3/5">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">Help & Support</h1>
                <p className="text-slate-600 text-lg mb-8 max-w-xl">
                  We are here to help you. Find answers, guides and support for all your vehicle and driving related needs.
                </p>
              </div>

              <div className="hidden lg:flex w-2/5 justify-end items-center pr-8 relative">
                <div className="absolute top-4 right-28 bg-white text-blue-600 text-sm font-semibold py-2 px-4 rounded-t-xl rounded-bl-xl rounded-br-none shadow-md border border-slate-100 z-20">
                  How can we help you today?
                </div>
                <img src="/Ai asistance.png" alt="Help Assistant" className="w-64 h-auto object-contain relative z-10" />
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-12">

            {/* How can we help you? */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6">How can we help you?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { icon: Car, color: "text-emerald-500", bg: "bg-emerald-50", title: "Vehicle Help", desc: "RC, PUC, Insurance, Tax, Tracking & more" },
                  { icon: FileText, color: "text-blue-500", bg: "bg-blue-50", title: "Services & Applications", desc: "Registration, DL, LL, Appointments & more" },
                  { icon: FileQuestion, color: "text-purple-500", bg: "bg-purple-50", title: "Documents & Corrections", desc: "Report document errors & track status" },
                  { icon: Bell, color: "text-amber-500", bg: "bg-amber-50", title: "Alerts & Notifications", desc: "Understand alerts & what to do" },
                  { icon: Headphones, color: "text-red-500", bg: "bg-red-50", title: "Contact Support", desc: "Raise a request or talk to our team" }
                ].map((item, idx) => (
                  <Link to="#" key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow group flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-full ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 mb-4 flex-1">{item.desc}</p>
                    <div className="flex justify-end mt-auto text-slate-300 group-hover:text-blue-600 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Popular Guides */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-slate-900">Popular Guides</h2>
                <Link to="#" className="text-sm font-semibold text-blue-600 flex items-center hover:underline">
                  View all guides <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Car, text: "How to add a vehicle in Parivahan Sewa?" },
                  { icon: Download, text: "How to download RC, PUC & Insurance?" },
                  { icon: Search, text: "How to track your application?" },
                  { icon: ShieldAlert, text: "How to report a document mistake?", color: "text-amber-500", bg: "bg-amber-50" },
                  { icon: FileText, text: "What do different application statuses mean?", color: "text-blue-500", bg: "bg-blue-50" },
                  { icon: Activity, text: "How does Vehicle Health Score work?", color: "text-emerald-500", bg: "bg-emerald-50" }
                ].map((guide, idx) => (
                  <Link to="#" key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${guide.bg || 'bg-blue-50'} ${guide.color || 'text-blue-600'}`}>
                        <guide.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{guide.text}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Understand your alerts */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-slate-900">Understand your alerts</h2>
                <Link to="#" className="text-sm font-semibold text-blue-600 flex items-center hover:underline">
                  View all alerts <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: ShieldAlert, title: "PUC Expiring", desc: "1 vehicle", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
                  { icon: Shield, title: "Insurance Expiring", desc: "1 vehicle", color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
                  { icon: Receipt, title: "Challan Pending", desc: "2 challans", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
                  { icon: Radio, title: "GPS Offline", desc: "1 vehicle", color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" }
                ].map((alert, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${alert.bg} border ${alert.border} ${alert.color} flex items-center justify-center shrink-0`}>
                        <alert.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm mb-1">{alert.title}</h3>
                        <p className="text-xs text-slate-500 mb-2">{alert.desc}</p>
                        <Link to="#" className="text-xs font-semibold text-blue-600 flex items-center hover:underline">
                          Learn more <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Support Forms & Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Still need help? */}
              <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-6 right-6 opacity-10">
                  <Headphones className="w-16 h-16 text-blue-500" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Still need help?</h2>
                <p className="text-sm text-slate-500 mb-6">Raise a support request and we will get back to you.</p>

                <div className="space-y-4 relative z-10">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Category</label>
                    <select className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
                      <option>Select category</option>
                      <option>Application Related</option>
                      <option>Document Correction</option>
                      <option>Technical Issue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tell us your problem</label>
                    <textarea
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-28"
                      placeholder="Describe your issue in detail..."
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Add attachment (Optional)</label>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 border border-slate-300 bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors">
                        <Upload className="w-4 h-4" /> Upload File
                      </button>
                      <span className="text-xs text-slate-400">JPG, PNG, PDF up to 5MB</span>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors mt-2 flex justify-center items-center gap-2">
                    Submit Request
                  </button>
                </div>
              </section>

              {/* Track your support requests */}
              <section>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Track your support requests</h2>
                  <Link to="#" className="text-sm font-semibold text-blue-600 flex items-center hover:underline">
                    View all <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {[
                    { id: "REQ-2026-000123", type: "Application Related", desc: "Vehicle Registration showing pending for long time.", status: "Under Review", date: "28 Aug 2026", bg: "bg-amber-100 text-amber-700 border-amber-200" },
                    { id: "REQ-2026-000122", type: "Document Correction", desc: "Wrong name printed in RC document.", status: "Resolved", date: "26 Aug 2026", bg: "bg-emerald-100 text-emerald-700 border-emerald-200" }
                  ].map((req, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800 text-sm">{req.id}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${req.bg}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mb-1">{req.type}</p>
                      <p className="text-xs text-slate-500 mb-4">{req.desc}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Submitted on {req.date}</span>
                        <Link to="#" className="font-semibold text-blue-600 flex items-center hover:underline">
                          View Details <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* More ways to get help */}
            <section className="pb-12">
              <h2 className="text-lg font-bold text-slate-900 mb-6">More ways to get help</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: MessageSquare, title: "Chat with Assistant", desc: "Get instant answers from our AI assistant.", link: "Start Chat", bg: "bg-emerald-50", color: "text-emerald-500" },
                  { icon: PlayCircle, title: "Video Guides", desc: "Watch step-by-step video tutorials.", link: "Watch Now", bg: "bg-amber-50", color: "text-amber-500" },
                  { icon: Book, title: "User Manual", desc: "Detailed information in our user manual.", link: "Download PDF", bg: "bg-purple-50", color: "text-purple-500" },
                  { icon: ExternalLink, title: "Parivahan Portal", desc: "Visit the official Parivahan website.", link: "Visit Now", bg: "bg-blue-50", color: "text-blue-500" }
                ].map((way, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col hover:shadow-sm transition-shadow">
                    <div className={`w-10 h-10 rounded-xl ${way.bg} ${way.color} flex items-center justify-center mb-4`}>
                      <way.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">{way.title}</h3>
                    <p className="text-xs text-slate-500 mb-4 flex-1">{way.desc}</p>
                    <Link to="#" className="text-xs font-semibold text-blue-600 flex items-center hover:underline mt-auto">
                      {way.link} <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer Text */}
            <div className="border-t border-slate-200 pt-6 pb-8 text-center flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
              <Shield className="w-4 h-4 text-blue-500" /> Your data is safe and secure with us. We respect your privacy.
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default HelpSupportPage;
