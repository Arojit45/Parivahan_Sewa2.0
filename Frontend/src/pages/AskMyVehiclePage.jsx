import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Send, ArrowLeft, Sparkles, MapPin, FileText, AlertCircle, 
         Heart, Car, Zap, Globe, ChevronDown, RotateCcw, ExternalLink } from 'lucide-react';
import { askVehicle, resolveActionRoute } from '../utils/assistantApi';
import { useLanguage } from '../contexts/LanguageContext';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

// TODO: Replace with real vehicleId from auth context / route params
const VEHICLE_ID = 1;

const VEHICLE_NAME  = 'Hyundai Creta';
const VEHICLE_REG   = 'WB12AB1234';

const QUICK_QUESTIONS = [
  { label: 'Is my vehicle okay?',         icon: Heart },
  { label: 'What needs my attention?',    icon: AlertCircle },
  { label: 'When does my PUC expire?',    icon: FileText },
  { label: 'Do I have pending challans?', icon: Zap },
  { label: 'Where is my vehicle?',        icon: MapPin },
  { label: 'What should I do today?',     icon: Sparkles },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
];

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

const TypingIndicator = () => (
  <div className="flex gap-3 mb-4">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
      <div className="flex gap-1.5 items-center h-5">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

const ActionButton = ({ action, label, navigate }) => {
  const route = resolveActionRoute(action);
  if (!route) return null;
  return (
    <button
      onClick={() => navigate(route)}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 
                 px-3 py-1.5 rounded-full hover:bg-blue-100 hover:border-blue-300 transition-all"
    >
      {label}
      <ExternalLink className="w-3 h-3" />
    </button>
  );
};

const AssistantBubble = ({ msg, navigate }) => (
  <div className="flex gap-3 mb-4">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-md">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="max-w-[85%]">
      <div className={`rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap
        ${msg.fallback ? 'bg-amber-50 border border-amber-200 text-amber-900' : 'bg-white border border-slate-200 text-slate-800'}`}>
        {msg.answer}
      </div>
      {/* Sources */}
      {msg.sources && msg.sources.length > 0 && (
        <p className="text-[10px] text-slate-400 font-medium mt-1.5 px-1">
          Based on: {msg.sources.join(' · ')}
        </p>
      )}
      {/* Action buttons */}
      {msg.actions && msg.actions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {msg.actions.map((a, i) => (
            <ActionButton key={i} action={a.action} label={a.label} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  </div>
);

const UserBubble = ({ text }) => (
  <div className="flex gap-3 mb-4 justify-end">
    <div className="max-w-[80%] bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm text-sm leading-relaxed">
      {text}
    </div>
    <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden shrink-0 mt-1">
      <img src="https://i.pravatar.cc/150?img=11" alt="You" className="w-full h-full object-cover" />
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

const AskMyVehiclePage = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      answer: `Hi! 👋 I'm your vehicle assistant for ${VEHICLE_NAME} (${VEHICLE_REG}).\n\nI can help you understand your vehicle's health, documents, challans, alerts, and live status. What would you like to know?`,
      actions: [],
      sources: [],
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    if (!text?.trim() || isLoading) return;
    const question = text.trim();
    setInput('');

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setIsLoading(true);

    // Build conversation history (last 6 turns for context)
    const history = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-6)
      .map(m => ({
        role: m.role,
        content: m.role === 'user' ? m.text : m.answer,
      }));

    try {
      const response = await askVehicle(VEHICLE_ID, question, history);
      setMessages(prev => [...prev, { role: 'assistant', ...response }]);
    } catch (err) {
      const isAccessDenied = err.message === 'ACCESS_DENIED';
      setMessages(prev => [...prev, {
        role: 'assistant',
        answer: isAccessDenied
          ? "You don't have access to this vehicle's information."
          : "I'm unable to reach the vehicle assistant right now. Your vehicle information is still available on the dashboard.",
        actions: [{ label: 'Back to Dashboard', action: 'OPEN_DASHBOARD' }],
        sources: [],
        fallback: true,
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    setMessages([{
      role: 'assistant',
      answer: `Hi! 👋 I'm your vehicle assistant for ${VEHICLE_NAME} (${VEHICLE_REG}).\n\nI can help you understand your vehicle's health, documents, challans, alerts, and live status. What would you like to know?`,
      actions: [], sources: [],
    }]);
  };

  const currentLangLabel = LANGUAGES.find(l => l.code === language)?.label || 'English';

  return (
    <div className="flex h-screen bg-slate-50 font-['Poppins'] overflow-hidden">

      {/* ── Left Panel (branding + quick questions) ── */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-col bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white shrink-0">
        
        {/* Back button */}
        <div className="p-6 pb-0">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="p-6 flex-1">
          {/* AI Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">ASK MY VEHICLE</h1>
              <p className="text-xs text-blue-400 font-medium">Your vehicle, explained simply.</p>
            </div>
          </div>

          {/* Vehicle badge */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Car className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-sm">{VEHICLE_NAME}</p>
              <p className="font-mono text-xs text-slate-400">{VEHICLE_REG}</p>
            </div>
          </div>

          {/* Quick questions */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Questions</p>
            <div className="space-y-2">
              {QUICK_QUESTIONS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(label)}
                  disabled={isLoading}
                  className="w-full text-left text-sm text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 
                             border border-white/10 hover:border-white/20 rounded-xl px-4 py-2.5 transition-all 
                             flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Language selector in panel */}
        <div className="p-6 border-t border-white/10">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="w-full flex items-center justify-between gap-2 text-sm text-slate-300 hover:text-white 
                         bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="font-medium">{currentLangLabel}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>
            {showLangMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1e293b] border border-white/10 rounded-xl py-2 shadow-2xl max-h-64 overflow-y-auto">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      language === lang.code
                        ? 'text-blue-400 font-semibold bg-blue-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Panel (chat) ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat topbar */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile back */}
            <button
              onClick={() => navigate('/dashboard')}
              className="lg:hidden text-slate-400 hover:text-slate-700 mr-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Ask My Vehicle</h2>
              <p className="text-[11px] text-slate-400">{VEHICLE_NAME} · {VEHICLE_REG}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AI Online
            </span>
            <button
              onClick={handleReset}
              title="New conversation"
              className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto">
            {messages.map((msg, idx) =>
              msg.role === 'user'
                ? <UserBubble key={idx} text={msg.text} />
                : <AssistantBubble key={idx} msg={msg} navigate={navigate} />
            )}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Mobile quick questions */}
        <div className="lg:hidden px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {QUICK_QUESTIONS.map(({ label }) => (
              <button
                key={label}
                onClick={() => sendMessage(label)}
                disabled={isLoading}
                className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full 
                           hover:bg-blue-100 whitespace-nowrap shrink-0 transition-all disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div className="bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-4 shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  id="ask-my-vehicle-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your vehicle..."
                  rows={1}
                  disabled={isLoading}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-4 py-3 text-sm 
                             focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 
                             transition-all shadow-inner resize-none disabled:opacity-60 leading-relaxed"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                id="ask-my-vehicle-send"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white 
                           flex items-center justify-center shadow-lg hover:shadow-blue-200 hover:scale-105 
                           transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2">
              Powered by Gemini · Answers based on your vehicle data only
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AskMyVehiclePage;
