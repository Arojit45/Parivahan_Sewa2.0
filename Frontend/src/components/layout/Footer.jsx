import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/govtLogo.png" alt="Parivahan Sewa Logo" className="h-14 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm text-slate-400 mb-6">
              A step towards Digital India.
              <br />
              A leap towards a Safer India.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-white transition-colors">Dashboard Preview</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Check RC Details</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Verify Documents</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Download Forms</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Fee Calculator</a></li>
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="text-white font-semibold mb-6">Popular Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-white transition-colors">Driving License</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Vehicle Registration</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Challan Status</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">PUC Certificate</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Insurance Validity</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Vehicle Transfer</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Grievance Redressal</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Feedback</a></li>
            </ul>
            
            <div className="mt-8">
              <h3 className="text-white font-semibold mb-4 text-sm">Download App</h3>
              <div className="flex gap-2">
                <div className="w-24 h-8 bg-slate-800 rounded border border-slate-700 flex flex-col justify-center items-center text-[8px]">
                  GET IT ON <br/><span className="text-xs font-bold text-white">Google Play</span>
                </div>
                <div className="w-24 h-8 bg-slate-800 rounded border border-slate-700 flex flex-col justify-center items-center text-[8px]">
                  Download on the <br/><span className="text-xs font-bold text-white">App Store</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>Â© 2026 Parivahan Sewa. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Use</a>
            <a href="#" className="hover:text-slate-300">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
