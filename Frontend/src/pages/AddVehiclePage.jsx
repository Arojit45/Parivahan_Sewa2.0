import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Car, ArrowLeft, Loader2, ShieldCheck, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch, getMyVehicles } from '../utils/api';

const AddVehiclePage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [otp, setOtp] = useState('');

  // Limit state
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);

  // Captcha states
  const [captcha, setCaptcha] = useState(null);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);

  // Fetch Captcha
  const fetchCaptcha = async () => {
    setLoadingCaptcha(true);
    setError(null);
    try {
      const data = await apiFetch('/captcha', { method: 'GET' });
      if (data) {
        setCaptcha(data);
        setCaptchaAnswer('');
      } else {
        setError('Failed to load CAPTCHA. Please refresh.');
      }
    } catch (err) {
      setError('Network error loading CAPTCHA.');
    } finally {
      setLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      try {
        const vehicles = await getMyVehicles();
        if (vehicles && vehicles.length >= 3) {
          setIsLimitReached(true);
          setError('Maximum limit of 3 vehicles reached. Please remove a vehicle from your dashboard before linking a new one.');
        } else {
          fetchCaptcha();
        }
      } catch (err) {
        console.error("Failed to fetch vehicles:", err);
        // Default to allowing fetch captcha if vehicle check fails, backend will still enforce it
        fetchCaptcha();
      } finally {
        setCheckingLimit(false);
      }
    };
    initPage();
  }, []);

  // Format Reg No to uppercase automatically
  const handleRegNoChange = (e) => {
    setRegistrationNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
    if (error && !error.includes('limit')) setError(null);
  };

  // Step 1: Init Register
  const handleInitRegister = async (e) => {
    e.preventDefault();
    if (isLimitReached) return;
    if (!registrationNumber || !captchaAnswer) {
      setError('Please provide both Registration Number and CAPTCHA.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await apiFetch('/vehicles/init-register', {
        method: 'POST',
        headers: {
          'X-Captcha-Id': captcha?.captchaId || '',
          'X-Captcha-Answer': captchaAnswer,
        },
        body: JSON.stringify({ registrationNumber }),
      });
      // Success, move to OTP step
      setStep(2);
      // Fetch new captcha for step 2 because the old one is consumed
      await fetchCaptcha();
    } catch (err) {
      if (err.message.includes('403')) {
        setError('Invalid CAPTCHA. Please try again.');
      } else if (err.message.includes('404')) {
        setError('Registration number not found in authoritative database.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again later.');
      }
      await fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Register
  const handleVerifyRegister = async (e) => {
    e.preventDefault();
    if (!otp || !captchaAnswer) {
      setError('Please provide both OTP and CAPTCHA.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await apiFetch('/vehicles/verify-register', {
        method: 'POST',
        headers: {
          'X-Captcha-Id': captcha?.captchaId || '',
          'X-Captcha-Answer': captchaAnswer,
        },
        body: JSON.stringify({ registrationNumber, otp }),
      });
      // Successfully linked!
      navigate('/dashboard');
      // Refresh the page or dashboard context to fetch new vehicles (the dashboard context will handle this on remount)
      window.location.reload(); 
    } catch (err) {
      if (err.message.includes('403')) {
        setError('Invalid CAPTCHA or OTP. Please try again.');
      } else {
        setError(err.message || 'Verification failed. Please try again.');
      }
      await fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Poppins']">
      {/* Simple Topbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <Car className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">Parivahan<span className="text-blue-600">Sewa</span></span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-black/10 blur-2xl"></div>
            
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30 shadow-inner">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Add Your Vehicle</h2>
            <p className="text-blue-100 text-sm relative z-10">Link an existing vehicle to your account</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800 leading-relaxed">{error}</p>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleInitRegister} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Registration Number</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={handleRegNoChange}
                    placeholder="e.g. MH12AB1234"
                    disabled={isLimitReached}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold uppercase tracking-wider text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    maxLength={10}
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2">Enter your vehicle registration number without spaces.</p>
                </div>

                <div className={`bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 ${isLimitReached ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Security Check</label>
                    <button type="button" onClick={fetchCaptcha} className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors" title="Reload CAPTCHA">
                      <RefreshCw className={`w-4 h-4 ${loadingCaptcha ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  
                  {captcha ? (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm select-none">
                        <span className="font-mono font-bold text-lg tracking-widest text-slate-800">{captcha.challenge}</span>
                      </div>
                      <span className="text-slate-400 font-bold">=</span>
                      <input
                        type="text"
                        value={captchaAnswer}
                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                        placeholder="?"
                        disabled={isLimitReached}
                        className="w-20 px-4 py-3 text-center bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  ) : (
                    <div className="h-14 flex items-center justify-center text-sm text-slate-500 border border-slate-200 rounded-lg bg-white">
                      {isLimitReached ? 'CAPTCHA Disabled' : 'Loading CAPTCHA...'}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !captcha || isLimitReached}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyRegister} className="space-y-5 animate-in slide-in-from-right-4 fade-in">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-blue-800 font-medium">OTP sent to the registered mobile number for vehicle <span className="font-bold">{registrationNumber}</span></p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); if (error && !error.includes('limit')) setError(null); }}
                    placeholder="Enter 6-digit OTP (e.g. 123456)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold tracking-widest text-center text-xl text-slate-900"
                    maxLength={6}
                    required
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">Security Check</label>
                    <button type="button" onClick={fetchCaptcha} className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors" title="Reload CAPTCHA">
                      <RefreshCw className={`w-4 h-4 ${loadingCaptcha ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  
                  {captcha ? (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 text-center shadow-sm select-none">
                        <span className="font-mono font-bold text-lg tracking-widest text-slate-800">{captcha.challenge}</span>
                      </div>
                      <span className="text-slate-400 font-bold">=</span>
                      <input
                        type="text"
                        value={captchaAnswer}
                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                        placeholder="?"
                        className="w-20 px-4 py-3 text-center bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-bold text-lg"
                        required
                      />
                    </div>
                  ) : (
                    <div className="h-14 flex items-center justify-center text-sm text-slate-500 border border-slate-200 rounded-lg bg-white">
                      Loading CAPTCHA...
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(null); fetchCaptcha(); }}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 font-semibold py-3.5 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !captcha}
                    className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehiclePage;
