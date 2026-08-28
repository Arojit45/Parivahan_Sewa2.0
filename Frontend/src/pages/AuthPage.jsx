import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Mail, Lock, User, Phone, Globe, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState(!location.state?.register);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const from = location.state?.from?.pathname || '/dashboard';

  // Form States
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    preferredLanguage: 'English',
    profilePhoto: ''
  });

  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  
  const handleRegisterChange = (e) => setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRegisterForm({ ...registerForm, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://parivahan-sewa2-0-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      
      login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://parivahan-sewa2-0-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registerForm,
          role: 'CITIZEN' // Default role for now
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      
      login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-50">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[120%] -z-10 pointer-events-none opacity-50">
        <img src="/heroSectionbackground.png" alt="Background pattern" className="w-full h-full object-cover mix-blend-multiply" />
      </div>
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-green-100/40 to-emerald-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white flex overflow-hidden relative z-10 min-h-[600px]">
        
        {/* Left Side - Graphic (Hidden on mobile) */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('/heroSectionbackground.png')] opacity-20 mix-blend-overlay object-cover"></div>
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-12">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-white p-2 rounded-xl">
                <img src="/govtLogo.png" alt="Govt Logo" className="h-12 w-auto" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">PARIVAHAN SEWA</h2>
                <p className="text-[10px] text-blue-200 uppercase tracking-widest font-medium">Govt. of India</p>
              </div>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight mb-6">
              {isLogin ? 'Welcome Back.' : 'Join Parivahan.'}<br />
              <span className="text-blue-200">
                {isLogin ? 'Manage your transport services effortlessly.' : 'Your journey begins here.'}
              </span>
            </h1>
          </div>

          <div className="relative z-10 flex items-center gap-3">
             <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-500 overflow-hidden relative">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-100">Join <span className="font-bold text-white">3.2M+</span> happy citizens.</p>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 relative">
          
          <Link to="/" className="lg:hidden absolute top-6 left-6 text-slate-400 hover:text-slate-800 transition-colors">
             <ArrowLeft className="w-6 h-6" />
          </Link>

          <div className="flex justify-center mb-10">
            <div className="bg-slate-100 p-1 rounded-xl inline-flex relative shadow-inner">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out ${isLogin ? 'left-1' : 'left-[calc(50%+2px)]'}`}
              ></div>
              <button 
                onClick={() => setIsLogin(true)}
                className={`relative z-10 px-8 py-2.5 text-sm font-semibold transition-colors ${isLogin ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`relative z-10 px-8 py-2.5 text-sm font-semibold transition-colors ${!isLogin ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Register
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Sign in to your account</h3>
                  <p className="text-sm text-slate-500">Access all your vehicle details in one place.</p>
                </div>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        name="email"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        placeholder="john@example.com" 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium text-slate-700">Password</label>
                      <a href="#" className="text-xs text-blue-600 font-semibold hover:underline">Forgot password?</a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="password" 
                        name="password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-4 disabled:opacity-70">
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    Sign In
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Create an account</h3>
                  <p className="text-sm text-slate-500">Join Parivahan Sewa to manage your vehicles.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" name="fullName" value={registerForm.fullName} onChange={handleRegisterChange}
                          placeholder="John Doe" 
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all" required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" name="email" value={registerForm.email} onChange={handleRegisterChange}
                          placeholder="john@example.com" 
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all" required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="tel" name="mobileNumber" value={registerForm.mobileNumber} onChange={handleRegisterChange}
                          placeholder="+91 9876543210" 
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all" required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="password" name="password" value={registerForm.password} onChange={handleRegisterChange}
                          placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" 
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all" required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Preferred Language</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select 
                        name="preferredLanguage" value={registerForm.preferredLanguage} onChange={handleRegisterChange}
                        className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Marathi">Marathi</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-700">Profile Photo (Optional)</label>
                    <label className="flex items-center gap-3 w-full px-3 py-2 bg-slate-50 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                         {registerForm.profilePhoto ? <img src={registerForm.profilePhoto} alt="Preview" className="w-full h-full rounded-full object-cover" /> : <ImageIcon className="w-4 h-4" />}
                       </div>
                       <span className="text-xs text-slate-500 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                         {registerForm.profilePhoto ? "Photo selected. Click to change." : "Upload a photo (Max 2MB)"}
                       </span>
                       <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>

                  <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all mt-6 disabled:opacity-70">
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    Create Account
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
