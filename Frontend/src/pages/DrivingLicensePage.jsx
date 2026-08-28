import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import Topbar from '../components/dashboard/Topbar';
import Footer from '../components/layout/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { Play, Pause, Headphones, ChevronDown, ChevronRight, MapPin, Building2, Car, ClipboardCheck, CreditCard, Crosshair, ArrowRight, ArrowLeft, MessageCircle, Phone, Map, Video, Search, CheckCircle2, Bot, Sparkles, Navigation, Shield, Globe, RotateCcw, Loader2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { askApplicationProcess, resolveActionRoute } from '../utils/assistantApi';

const DL_ASSISTANT_STORAGE_KEY = 'drivingLicenseAssistantMessages';

const makeAssistantGreeting = () => ({
  role: 'assistant',
  answer: "Hi! I can help with Driving Licence applications, documents, eligibility, appointment booking, payment, tracking, and re-test questions.",
  actions: [],
  sources: [],
});

const DrivingLicensePage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [audioState, setAudioState] = useState('IDLE'); // 'IDLE', 'PLAYING', 'PAUSED'
  const [activeStep, setActiveStep] = useState(0);
  const [assistantMessages, setAssistantMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(DL_ASSISTANT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [makeAssistantGreeting()];
    } catch (e) {
      return [makeAssistantGreeting()];
    }
  });
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);
  const assistantEndRef = useRef(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('https://parivahan-sewa2-0-backend.onrender.com/api/v1/dl/application/in-progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.lastCompletedStep !== undefined) {
            setActiveStep(Math.min(data.lastCompletedStep, 5)); // max idx 5 (step 6)
          }
        }
      } catch (e) {}
    };
    fetchProgress();
  }, []);

  // 2. ADD THIS HERE
  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const voices = synth.getVoices();

      console.log(
        'Available voices:',
        voices.map(v => `${v.name} - ${v.lang}`)
      );
    };

    // Try immediately
    loadVoices();

    // Browser may load voices asynchronously
    synth.addEventListener(
      'voiceschanged',
      loadVoices
    );

    return () => {
      synth.removeEventListener(
        'voiceschanged',
        loadVoices
      );

      synth.cancel();
    };
  }, []);

  const audioScripts = {
    en: "Namaste Amit Kumar. Welcome to the Parivahan Sewa Driving License Portal. I am your audio guide. To get your driving license, you need to follow a few simple steps. First, select your State and RTO. Next, choose the type of vehicle. Then, verify your eligibility and apply for a Learner's License if you don't have one. Make sure to keep your Aadhaar Card and other necessary documents clearly scanned and ready. Do not upload blurry images. You can pause this audio anytime by clicking the button again. Let's start your journey!",
    hi: "à¤¨à¤®à¤¸à¥à¤¤à¥‡ à¤…à¤®à¤¿à¤¤ à¤•à¥à¤®à¤¾à¤°à¥¤ à¤ªà¤°à¤¿à¤µà¤¹à¤¨ à¤¸à¥‡à¤µà¤¾ à¤¡à¥à¤°à¤¾à¤‡à¤µà¤¿à¤‚à¤— à¤²à¤¾à¤‡à¤¸à¥‡à¤‚à¤¸ à¤ªà¥‹à¤°à¥à¤Ÿà¤² à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¤¾ à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤¹à¥ˆà¥¤ à¤®à¥ˆà¤‚ à¤†à¤ªà¤•à¤¾ à¤‘à¤¡à¤¿à¤¯à¥‹ à¤—à¤¾à¤‡à¤¡ à¤¹à¥‚à¤à¥¤ à¤…à¤ªà¤¨à¤¾ à¤¡à¥à¤°à¤¾à¤‡à¤µà¤¿à¤‚à¤— à¤²à¤¾à¤‡à¤¸à¥‡à¤‚à¤¸ à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤, à¤†à¤ªà¤•à¥‹ à¤•à¥à¤› à¤¸à¤°à¤² à¤šà¤°à¤£à¥‹à¤‚ à¤•à¤¾ à¤ªà¤¾à¤²à¤¨ à¤•à¤°à¤¨à¤¾ à¤¹à¥‹à¤—à¤¾à¥¤ à¤¸à¤¬à¤¸à¥‡ à¤ªà¤¹à¤²à¥‡, à¤…à¤ªà¤¨à¤¾ à¤°à¤¾à¤œà¥à¤¯ à¤”à¤° à¤†à¤°à¤Ÿà¥€à¤“ à¤šà¥à¤¨à¥‡à¤‚à¥¤ à¤‡à¤¸à¤•à¥‡ à¤¬à¤¾à¤¦, à¤µà¤¾à¤¹à¤¨ à¤•à¤¾ à¤ªà¥à¤°à¤•à¤¾à¤° à¤šà¥à¤¨à¥‡à¤‚à¥¤ à¤«à¤¿à¤°, à¤…à¤ªà¤¨à¥€ à¤ªà¤¾à¤¤à¥à¤°à¤¤à¤¾ à¤•à¥€ à¤œà¤¾à¤‚à¤š à¤•à¤°à¥‡à¤‚ à¤”à¤° à¤¯à¤¦à¤¿ à¤†à¤ªà¤•à¥‡ à¤ªà¤¾à¤¸ à¤²à¤°à¥à¤¨à¤°à¥à¤¸ à¤²à¤¾à¤‡à¤¸à¥‡à¤‚à¤¸ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆ à¤¤à¥‹ à¤‰à¤¸à¤•à¥‡ à¤²à¤¿à¤ à¤†à¤µà¥‡à¤¦à¤¨ à¤•à¤°à¥‡à¤‚à¥¤ à¤¸à¥à¤¨à¤¿à¤¶à¥à¤šà¤¿à¤¤ à¤•à¤°à¥‡à¤‚ à¤•à¤¿ à¤†à¤ªà¤•à¤¾ à¤†à¤§à¤¾à¤° à¤•à¤¾à¤°à¥à¤¡ à¤”à¤° à¤…à¤¨à¥à¤¯ à¤†à¤µà¤¶à¥à¤¯à¤• à¤¦à¤¸à¥à¤¤à¤¾à¤µà¥‡à¤œ à¤¸à¥à¤ªà¤·à¥à¤Ÿ à¤°à¥‚à¤ª à¤¸à¥‡ à¤¸à¥à¤•à¥ˆà¤¨ à¤•à¤¿à¤ à¤—à¤ à¤”à¤° à¤¤à¥ˆà¤¯à¤¾à¤° à¤¹à¥‹à¤‚à¥¤ à¤§à¥à¤‚à¤§à¤²à¥€ à¤›à¤µà¤¿à¤¯à¤¾à¤‚ à¤…à¤ªà¤²à¥‹à¤¡ à¤¨ à¤•à¤°à¥‡à¤‚à¥¤ à¤†à¤ª à¤¬à¤Ÿà¤¨ à¤•à¥‹ à¤«à¤¿à¤° à¤¸à¥‡ à¤•à¥à¤²à¤¿à¤• à¤•à¤°à¤•à¥‡ à¤‡à¤¸ à¤‘à¤¡à¤¿à¤¯à¥‹ à¤•à¥‹ à¤•à¤¿à¤¸à¥€ à¤­à¥€ à¤¸à¤®à¤¯ à¤°à¥‹à¤• à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤ à¤šà¤²à¤¿à¤ à¤†à¤ªà¤•à¥€ à¤¯à¤¾à¤¤à¥à¤°à¤¾ à¤¶à¥à¤°à¥‚ à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚!",
    bn: "à¦¨à¦®à¦¸à§à¦•à¦¾à¦° à¦…à¦®à¦¿à¦¤ à¦•à§à¦®à¦¾à¦°à¥¤ à¦ªà¦°à¦¿à¦¬à¦¹à¦¨ à¦¸à§‡à¦¬à¦¾ à¦¡à§à¦°à¦¾à¦‡à¦­à¦¿à¦‚ à¦²à¦¾à¦‡à¦¸à§‡à¦¨à§à¦¸ à¦ªà§‹à¦°à§à¦Ÿà¦¾à¦²à§‡ à¦†à¦ªà¦¨à¦¾à¦•à§‡ à¦¸à§à¦¬à¦¾à¦—à¦¤à¦®à¥¤ à¦†à¦®à¦¿ à¦†à¦ªà¦¨à¦¾à¦° à¦…à¦¡à¦¿à¦“ à¦—à¦¾à¦‡à¦¡à¥¤ à¦†à¦ªà¦¨à¦¾à¦° à¦¡à§à¦°à¦¾à¦‡à¦­à¦¿à¦‚ à¦²à¦¾à¦‡à¦¸à§‡à¦¨à§à¦¸ à¦ªà§‡à¦¤à§‡, à¦†à¦ªà¦¨à¦¾à¦•à§‡ à¦•à¦¯à¦¼à§‡à¦•à¦Ÿà¦¿ à¦¸à¦¹à¦œ à¦§à¦¾à¦ª à¦…à¦¨à§à¦¸à¦°à¦£ à¦•à¦°à¦¤à§‡ à¦¹à¦¬à§‡à¥¤ à¦ªà§à¦°à¦¥à¦®à§‡, à¦†à¦ªà¦¨à¦¾à¦° à¦°à¦¾à¦œà§à¦¯ à¦à¦¬à¦‚ à¦†à¦°à¦Ÿà¦¿à¦“ à¦¨à¦¿à¦°à§à¦¬à¦¾à¦šà¦¨ à¦•à¦°à§à¦¨à¥¤ à¦à¦°à¦ªà¦°, à¦—à¦¾à¦¡à¦¼à¦¿à¦° à¦§à¦°à¦¨ à¦¬à§‡à¦›à§‡ à¦¨à¦¿à¦¨à¥¤ à¦¤à¦¾à¦°à¦ªà¦°, à¦†à¦ªà¦¨à¦¾à¦° à¦¯à§‹à¦—à§à¦¯à¦¤à¦¾ à¦¯à¦¾à¦šà¦¾à¦‡ à¦•à¦°à§à¦¨ à¦à¦¬à¦‚ à¦²à¦¾à¦°à§à¦¨à¦¾à¦°à§à¦¸ à¦²à¦¾à¦‡à¦¸à§‡à¦¨à§à¦¸ à¦¨à¦¾ à¦¥à¦¾à¦•à¦²à§‡ à¦†à¦¬à§‡à¦¦à¦¨ à¦•à¦°à§à¦¨à¥¤ à¦¨à¦¿à¦¶à§à¦šà¦¿à¦¤ à¦•à¦°à§à¦¨ à¦¯à§‡ à¦†à¦ªà¦¨à¦¾à¦° à¦†à¦§à¦¾à¦° à¦•à¦¾à¦°à§à¦¡ à¦à¦¬à¦‚ à¦…à¦¨à§à¦¯à¦¾à¦¨à§à¦¯ à¦ªà§à¦°à¦¯à¦¼à§‹à¦œà¦¨à§€à¦¯à¦¼ à¦¨à¦¥à¦¿à¦—à§à¦²à¦¿ à¦ªà¦°à¦¿à¦·à§à¦•à¦¾à¦°à¦­à¦¾à¦¬à§‡ à¦¸à§à¦•à§à¦¯à¦¾à¦¨ à¦•à¦°à¦¾ à¦à¦¬à¦‚ à¦ªà§à¦°à¦¸à§à¦¤à§à¦¤ à¦†à¦›à§‡à¥¤ à¦…à¦¸à§à¦ªà¦·à§à¦Ÿ à¦›à¦¬à¦¿ à¦†à¦ªà¦²à§‹à¦¡ à¦•à¦°à¦¬à§‡à¦¨ à¦¨à¦¾à¥¤ à¦†à¦ªà¦¨à¦¿ à¦¬à§‹à¦¤à¦¾à¦®à¦Ÿà¦¿ à¦†à¦¬à¦¾à¦° à¦•à§à¦²à¦¿à¦• à¦•à¦°à§‡ à¦¯à§‡à¦•à§‹à¦¨à§‹ à¦¸à¦®à¦¯à¦¼ à¦à¦‡ à¦…à¦¡à¦¿à¦“à¦Ÿà¦¿ à¦ªà¦œ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¦¨à¥¤ à¦šà¦²à§à¦¨ à¦†à¦ªà¦¨à¦¾à¦° à¦¯à¦¾à¦¤à§à¦°à¦¾ à¦¶à§à¦°à§ à¦•à¦°à¦¿!",
    mr: "à¤¨à¤®à¤¸à¥à¤•à¤¾à¤° à¤…à¤®à¤¿à¤¤ à¤•à¥à¤®à¤¾à¤°. à¤ªà¤°à¤¿à¤µà¤¹à¤¨ à¤¸à¥‡à¤µà¤¾ à¤¡à¥à¤°à¤¾à¤¯à¤µà¥à¤¹à¤¿à¤‚à¤— à¤²à¤¾à¤¯à¤¸à¤¨à¥à¤¸ à¤ªà¥‹à¤°à¥à¤Ÿà¤²à¤µà¤° à¤†à¤ªà¤²à¥‡ à¤¸à¥à¤µà¤¾à¤—à¤¤ à¤†à¤¹à¥‡. à¤®à¥€ à¤¤à¥à¤®à¤šà¤¾ à¤‘à¤¡à¤¿à¤“ à¤®à¤¾à¤°à¥à¤—à¤¦à¤°à¥à¤¶à¤• à¤†à¤¹à¥‡. à¤¤à¥à¤®à¤šà¤¾ à¤¡à¥à¤°à¤¾à¤¯à¤µà¥à¤¹à¤¿à¤‚à¤— à¤ªà¤°à¤µà¤¾à¤¨à¤¾ à¤®à¤¿à¤³à¤µà¤£à¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€, à¤¤à¥à¤®à¥à¤¹à¤¾à¤²à¤¾ à¤•à¤¾à¤¹à¥€ à¤¸à¥‹à¤ªà¥à¤¯à¤¾ à¤šà¤°à¤£à¤¾à¤‚à¤šà¥‡ à¤ªà¤¾à¤²à¤¨ à¤•à¤°à¤¾à¤µà¥‡ à¤²à¤¾à¤—à¥‡à¤². à¤ªà¥à¤°à¤¥à¤®, à¤¤à¥à¤®à¤šà¥‡ à¤°à¤¾à¤œà¥à¤¯ à¤†à¤£à¤¿ à¤†à¤°à¤Ÿà¥€à¤“ à¤¨à¤¿à¤µà¤¡à¤¾. à¤¤à¥à¤¯à¤¾à¤¨à¤‚à¤¤à¤°, à¤µà¤¾à¤¹à¤¨à¤¾à¤šà¤¾ à¤ªà¥à¤°à¤•à¤¾à¤° à¤¨à¤¿à¤µà¤¡à¤¾. à¤®à¤—, à¤¤à¥à¤®à¤šà¥€ à¤ªà¤¾à¤¤à¥à¤°à¤¤à¤¾ à¤¤à¤ªà¤¾à¤¸à¤¾ à¤†à¤£à¤¿ à¤¤à¥à¤®à¤šà¥à¤¯à¤¾à¤•à¤¡à¥‡ à¤¶à¤¿à¤•à¤¾à¤Š à¤ªà¤°à¤µà¤¾à¤¨à¤¾ à¤¨à¤¸à¤²à¥à¤¯à¤¾à¤¸ à¤¤à¥à¤¯à¤¾à¤¸à¤¾à¤ à¥€ à¤…à¤°à¥à¤œ à¤•à¤°à¤¾. à¤¤à¥à¤®à¤šà¥‡ à¤†à¤§à¤¾à¤° à¤•à¤¾à¤°à¥à¤¡ à¤†à¤£à¤¿ à¤‡à¤¤à¤° à¤†à¤µà¤¶à¥à¤¯à¤• à¤•à¤¾à¤—à¤¦à¤ªà¤¤à¥à¤°à¥‡ à¤¸à¥à¤ªà¤·à¥à¤Ÿà¤ªà¤£à¥‡ à¤¸à¥à¤•à¥…à¤¨ à¤•à¤°à¥‚à¤¨ à¤¤à¤¯à¤¾à¤° à¤ à¥‡à¤µà¤²à¥à¤¯à¤¾à¤šà¥€ à¤–à¤¾à¤¤à¥à¤°à¥€ à¤•à¤°à¤¾. à¤…à¤¸à¥à¤ªà¤·à¥à¤Ÿ à¤šà¤¿à¤¤à¥à¤°à¥‡ à¤…à¤ªà¤²à¥‹à¤¡ à¤•à¤°à¥‚ à¤¨à¤•à¤¾. à¤¤à¥à¤®à¥à¤¹à¥€ à¤ªà¥à¤¨à¥à¤¹à¤¾ à¤¬à¤Ÿà¤£à¤¾à¤µà¤° à¤•à¥à¤²à¤¿à¤• à¤•à¤°à¥‚à¤¨ à¤¹à¤¾ à¤‘à¤¡à¤¿à¤“ à¤•à¤§à¥€à¤¹à¥€ à¤¥à¤¾à¤‚à¤¬à¤µà¥‚ à¤¶à¤•à¤¤à¤¾. à¤šà¤²à¤¾ à¤¤à¥à¤®à¤šà¤¾ à¤ªà¥à¤°à¤µà¤¾à¤¸ à¤¸à¥à¤°à¥‚ à¤•à¤°à¥‚à¤¯à¤¾!",
    ta: "à®µà®£à®•à¯à®•à®®à¯ à®…à®®à®¿à®¤à¯ à®•à¯à®®à®¾à®°à¯. à®ªà®°à®¿à®µà®¹à®©à¯ à®šà¯‡à®µà®¾ à®“à®Ÿà¯à®Ÿà¯à®¨à®°à¯ à®‰à®°à®¿à®®à®®à¯ à®¤à®³à®¤à¯à®¤à®¿à®±à¯à®•à¯ à®‰à®™à¯à®•à®³à¯ˆ à®µà®°à®µà¯‡à®±à¯à®•à®¿à®±à¯‹à®®à¯. à®¨à®¾à®©à¯ à®‰à®™à¯à®•à®³à¯ à®†à®Ÿà®¿à®¯à¯‹ à®µà®´à®¿à®•à®¾à®Ÿà¯à®Ÿà®¿. à®‰à®™à¯à®•à®³à¯ à®“à®Ÿà¯à®Ÿà¯à®¨à®°à¯ à®‰à®°à®¿à®®à®¤à¯à®¤à¯ˆà®ªà¯ à®ªà¯†à®±, à®šà®¿à®² à®Žà®³à®¿à®¯ à®µà®´à®¿à®®à¯à®±à¯ˆà®•à®³à¯ˆà®ªà¯ à®ªà®¿à®©à¯à®ªà®±à¯à®± à®µà¯‡à®£à¯à®Ÿà¯à®®à¯. à®®à¯à®¤à®²à®¿à®²à¯, à®‰à®™à¯à®•à®³à¯ à®®à®¾à®¨à®¿à®²à®®à¯ à®®à®±à¯à®±à¯à®®à¯ à®†à®°à¯.à®Ÿà®¿.à®“-à®µà¯ˆ à®¤à¯‡à®°à¯à®¨à¯à®¤à¯†à®Ÿà¯à®•à¯à®•à®µà¯à®®à¯. à®…à®Ÿà¯à®¤à¯à®¤à¯, à®µà®¾à®•à®©à®¤à¯à®¤à®¿à®©à¯ à®µà®•à¯ˆà®¯à¯ˆà®¤à¯ à®¤à¯‡à®°à¯à®µà¯ à®šà¯†à®¯à¯à®¯à®µà¯à®®à¯. à®ªà®¿à®©à¯à®©à®°à¯, à®‰à®™à¯à®•à®³à¯ à®¤à®•à¯à®¤à®¿à®¯à¯ˆà®šà¯ à®šà®°à®¿à®ªà®¾à®°à¯à®¤à¯à®¤à¯, à®‰à®™à¯à®•à®³à®¿à®Ÿà®®à¯ à®ªà®´à®•à¯à®¨à®°à¯ à®‰à®°à®¿à®®à®®à¯ à®‡à®²à¯à®²à¯ˆà®¯à¯†à®©à¯à®±à®¾à®²à¯ à®…à®¤à®±à¯à®•à¯ à®µà®¿à®£à¯à®£à®ªà¯à®ªà®¿à®•à¯à®•à®µà¯à®®à¯. à®‰à®™à¯à®•à®³à¯ à®†à®¤à®¾à®°à¯ à®…à®Ÿà¯à®Ÿà¯ˆ à®®à®±à¯à®±à¯à®®à¯ à®ªà®¿à®± à®¤à¯‡à®µà¯ˆà®¯à®¾à®© à®†à®µà®£à®™à¯à®•à®³à¯ˆ à®¤à¯†à®³à®¿à®µà®¾à®• à®¸à¯à®•à¯‡à®©à¯ à®šà¯†à®¯à¯à®¤à¯ à®¤à®¯à®¾à®°à®¾à®• à®µà¯ˆà®¤à¯à®¤à®¿à®°à¯à®ªà¯à®ªà®¤à¯ˆ à®‰à®±à¯à®¤à®¿ à®šà¯†à®¯à¯à®¯à®µà¯à®®à¯. à®®à®™à¯à®•à®²à®¾à®© à®ªà®Ÿà®™à¯à®•à®³à¯ˆ à®ªà®¤à®¿à®µà¯‡à®±à¯à®± à®µà¯‡à®£à¯à®Ÿà®¾à®®à¯. à®®à¯€à®£à¯à®Ÿà¯à®®à¯ à®ªà®Ÿà¯à®Ÿà®©à¯ˆ à®•à®¿à®³à®¿à®•à¯ à®šà¯†à®¯à¯à®µà®¤à®©à¯ à®®à¯‚à®²à®®à¯ à®Žà®¨à¯à®¤ à®¨à¯‡à®°à®¤à¯à®¤à®¿à®²à¯à®®à¯ à®‡à®¨à¯à®¤ à®†à®Ÿà®¿à®¯à¯‹à®µà¯ˆ à®‡à®Ÿà¯ˆà®¨à®¿à®±à¯à®¤à¯à®¤à®²à®¾à®®à¯. à®‰à®™à¯à®•à®³à¯ à®ªà®¯à®£à®¤à¯à®¤à¯ˆà®¤à¯ à®¤à¯Šà®Ÿà®™à¯à®•à¯à®µà¯‹à®®à¯!",
    te: "à°¨à°®à°¸à±à°•à°¾à°°à°‚ à°…à°®à°¿à°¤à± à°•à±à°®à°¾à°°à±. à°ªà°°à°¿à°µà°¹à°¨à± à°¸à±‡à°µà°¾ à°¡à±à°°à±ˆà°µà°¿à°‚à°—à± à°²à±ˆà°¸à±†à°¨à±à°¸à± à°ªà±‹à°°à±à°Ÿà°²à±à°•à± à°¸à±à°µà°¾à°—à°¤à°‚. à°¨à±‡à°¨à± à°®à±€ à°†à°¡à°¿à°¯à±‹ à°—à±ˆà°¡à±. à°®à±€ à°¡à±à°°à±ˆà°µà°¿à°‚à°—à± à°²à±ˆà°¸à±†à°¨à±à°¸à± à°ªà±Šà°‚à°¦à°¡à°¾à°¨à°¿à°•à°¿, à°®à±€à°°à± à°•à±Šà°¨à±à°¨à°¿ à°¸à°¾à°§à°¾à°°à°£ à°¦à°¶à°²à°¨à± à°…à°¨à±à°¸à°°à°¿à°‚à°šà°¾à°²à°¿. à°®à±à°‚à°¦à±à°—à°¾, à°®à±€ à°°à°¾à°·à±à°Ÿà±à°°à°‚ à°®à°°à°¿à°¯à± à°†à°°à±à°Ÿà±€à°“à°¨à°¿ à°Žà°‚à°šà±à°•à±‹à°‚à°¡à°¿. à°† à°¤à°°à±à°µà°¾à°¤, à°µà°¾à°¹à°¨à°‚ à°°à°•à°¾à°¨à±à°¨à°¿ à°Žà°‚à°šà±à°•à±‹à°‚à°¡à°¿. à°†à°ªà±ˆ, à°®à±€ à°…à°°à±à°¹à°¤à°¨à± à°¤à°¨à°¿à°–à±€ à°šà±‡à°¸à°¿, à°®à±€à°•à± à°²à±†à°°à±à°¨à°°à±à°¸à± à°²à±ˆà°¸à±†à°¨à±à°¸à± à°²à±‡à°•à±à°‚à°Ÿà±‡ à°¦à°°à°–à°¾à°¸à±à°¤à± à°šà±‡à°¯à°‚à°¡à°¿. à°®à±€ à°†à°§à°¾à°°à± à°•à°¾à°°à±à°¡à± à°®à°°à°¿à°¯à± à°‡à°¤à°° à°…à°µà°¸à°°à°®à±ˆà°¨ à°ªà°¤à±à°°à°¾à°²à°¨à± à°¸à±à°ªà°·à±à°Ÿà°‚à°—à°¾ à°¸à±à°•à°¾à°¨à± à°šà±‡à°¸à°¿ à°¸à°¿à°¦à±à°§à°‚à°—à°¾ à°‰à°‚à°šà°‚à°¡à°¿. à°…à°¸à±à°ªà°·à±à°Ÿà°®à±ˆà°¨ à°šà°¿à°¤à±à°°à°¾à°²à°¨à± à°…à°ªà±â€Œà°²à±‹à°¡à± à°šà±‡à°¯à°µà°¦à±à°¦à±. à°®à±€à°°à± à°¬à°Ÿà°¨à±â€Œà°¨à± à°®à°³à±à°²à±€ à°•à±à°²à°¿à°•à± à°šà±‡à°¯à°¡à°‚ à°¦à±à°µà°¾à°°à°¾ à°Žà°ªà±à°ªà±à°¡à±ˆà°¨à°¾ à°ˆ à°†à°¡à°¿à°¯à±‹à°¨à± à°ªà°¾à°œà± à°šà±‡à°¯à°µà°šà±à°šà±. à°®à±€ à°ªà±à°°à°¯à°¾à°£à°¾à°¨à±à°¨à°¿ à°ªà±à°°à°¾à°°à°‚à°­à°¿à°¦à±à°¦à°¾à°‚!",
    kn: "à²¨à²®à²¸à³à²•à²¾à²° à²…à²®à²¿à²¤à³ à²•à³à²®à²¾à²°à³. à²ªà²°à²¿à²µà²¾à²¹à²¨à³ à²¸à³‡à²µà²¾ à²¡à³à²°à³ˆà²µà²¿à²‚à²—à³ à²²à³ˆà²¸à³†à²¨à³à²¸à³ à²ªà³‹à²°à³à²Ÿà²²à³â€Œà²—à³† à²¸à³à²¸à³à²µà²¾à²—à²¤. à²¨à²¾à²¨à³ à²¨à²¿à²®à³à²® à²†à²¡à²¿à²¯à³‹ à²®à²¾à²°à³à²—à²¦à²°à³à²¶à²¿. à²¨à²¿à²®à³à²® à²¡à³à²°à³ˆà²µà²¿à²‚à²—à³ à²²à³ˆà²¸à³†à²¨à³à²¸à³ à²ªà²¡à³†à²¯à²²à³, à²¨à³€à²µà³ à²•à³†à²²à²µà³ à²¸à²°à²³ à²¹à²‚à²¤à²—à²³à²¨à³à²¨à³ à²…à²¨à³à²¸à²°à²¿à²¸à²¬à³‡à²•à³. à²®à³Šà²¦à²²à³, à²¨à²¿à²®à³à²® à²°à²¾à²œà³à²¯ à²®à²¤à³à²¤à³ à²†à²°à³â€Œà²Ÿà²¿à²’ à²†à²¯à³à²•à³†à²®à²¾à²¡à²¿. à²®à³à²‚à²¦à³†, à²µà²¾à²¹à²¨à²¦ à²ªà³à²°à²•à²¾à²°à²µà²¨à³à²¨à³ à²†à²°à²¿à²¸à²¿. à²¨à²‚à²¤à²°, à²¨à²¿à²®à³à²® à²…à²°à³à²¹à²¤à³†à²¯à²¨à³à²¨à³ à²ªà²°à²¿à²¶à³€à²²à²¿à²¸à²¿ à²®à²¤à³à²¤à³ à²¨à²¿à²®à³à²® à²¬à²³à²¿ à²²à²°à³à²¨à²°à³à²¸à³ à²²à³ˆà²¸à³†à²¨à³à²¸à³ à²‡à²²à³à²²à²¦à²¿à²¦à³à²¦à²°à³† à²…à²°à³à²œà²¿ à²¸à²²à³à²²à²¿à²¸à²¿. à²¨à²¿à²®à³à²® à²†à²§à²¾à²°à³ à²•à²¾à²°à³à²¡à³ à²®à²¤à³à²¤à³ à²‡à²¤à²° à²…à²—à²¤à³à²¯ à²¦à²¾à²–à²²à³†à²—à²³à²¨à³à²¨à³ à²¸à³à²ªà²·à³à²Ÿà²µà²¾à²—à²¿ à²¸à³à²•à³à²¯à²¾à²¨à³ à²®à²¾à²¡à²¿ à²¸à²¿à²¦à³à²§à²µà²¾à²—à²¿à²Ÿà³à²Ÿà³à²•à³Šà²³à³à²³à²¿. à²…à²¸à³à²ªà²·à³à²Ÿ à²šà²¿à²¤à³à²°à²—à²³à²¨à³à²¨à³ à²…à²ªà³â€Œà²²à³‹à²¡à³ à²®à²¾à²¡à²¬à³‡à²¡à²¿. à²¨à³€à²µà³ à²®à²¤à³à²¤à³† à²¬à²Ÿà²¨à³ à²•à³à²²à²¿à²•à³ à²®à²¾à²¡à³à²µ à²®à³‚à²²à²• à²¯à²¾à²µà³à²¦à³‡ à²¸à²®à²¯à²¦à²²à³à²²à²¿ à²ˆ à²†à²¡à²¿à²¯à³Šà²µà²¨à³à²¨à³ à²µà²¿à²°à²¾à²®à²—à³Šà²³à²¿à²¸à²¬à²¹à³à²¦à³. à²¨à²¿à²®à³à²® à²ªà³à²°à²¯à²¾à²£à²µà²¨à³à²¨à³ à²ªà³à²°à²¾à²°à²‚à²­à²¿à²¸à³‹à²£!",
    ml: "à´¨à´®à´¸àµà´•à´¾à´°à´‚ à´…à´®à´¿à´¤àµ à´•àµà´®à´¾àµ¼. à´ªà´°à´¿à´µà´¾à´¹àµ» à´¸àµ‡à´µà´¾ à´¡àµà´°àµˆà´µà´¿à´‚à´—àµ à´²àµˆà´¸àµ»à´¸àµ à´ªàµ‹àµ¼à´Ÿàµà´Ÿà´²à´¿à´²àµ‡à´•àµà´•àµ à´¸àµà´µà´¾à´—à´¤à´‚. à´žà´¾àµ» à´¨à´¿à´™àµà´™à´³àµà´Ÿàµ† à´“à´¡à´¿à´¯àµ‹ à´—àµˆà´¡à´¾à´£àµ. à´¨à´¿à´™àµà´™à´³àµà´Ÿàµ† à´¡àµà´°àµˆà´µà´¿à´‚à´—àµ à´²àµˆà´¸àµ»à´¸àµ à´²à´­à´¿à´•àµà´•àµà´¨àµà´¨à´¤à´¿à´¨àµ, à´•àµà´±à´šàµà´šàµ à´²à´³à´¿à´¤à´®à´¾à´¯ à´˜à´Ÿàµà´Ÿà´™àµà´™àµ¾ à´ªà´¾à´²à´¿à´•àµà´•àµ‡à´£àµà´Ÿà´¤àµà´£àµà´Ÿàµ. à´†à´¦àµà´¯à´‚, à´¨à´¿à´™àµà´™à´³àµà´Ÿàµ† à´¸à´‚à´¸àµà´¥à´¾à´¨à´µàµà´‚ à´†àµ¼à´Ÿà´¿à´’à´¯àµà´‚ à´¤à´¿à´°à´žàµà´žàµ†à´Ÿàµà´•àµà´•àµà´•. à´…à´Ÿàµà´¤àµà´¤à´¤à´¾à´¯à´¿, à´µà´¾à´¹à´¨à´¤àµà´¤à´¿à´¨àµà´±àµ† à´¤à´°à´‚ à´¤à´¿à´°à´žàµà´žàµ†à´Ÿàµà´•àµà´•àµà´•. à´¤àµà´Ÿàµ¼à´¨àµà´¨àµ, à´¨à´¿à´™àµà´™à´³àµà´Ÿàµ† à´¯àµ‹à´—àµà´¯à´¤ à´ªà´°à´¿à´¶àµ‹à´§à´¿à´šàµà´šàµ à´¨à´¿à´™àµà´™àµ¾à´•àµà´•àµ à´²àµ‡à´£àµ‡à´´àµà´¸àµ à´²àµˆà´¸àµ»à´¸àµ à´‡à´²àµà´²àµ†à´™àµà´•à´¿àµ½ à´…à´ªàµ‡à´•àµà´·à´¿à´•àµà´•àµà´•. à´¨à´¿à´™àµà´™à´³àµà´Ÿàµ† à´†à´§à´¾àµ¼ à´•à´¾àµ¼à´¡àµà´‚ à´®à´±àµà´±àµ à´†à´µà´¶àµà´¯à´®à´¾à´¯ à´°àµ‡à´–à´•à´³àµà´‚ à´µàµà´¯à´•àµà´¤à´®à´¾à´¯à´¿ à´¸àµà´•à´¾àµ» à´šàµ†à´¯àµà´¤àµ à´¤à´¯àµà´¯à´¾à´±à´¾à´•àµà´•à´¿ à´µàµ†à´•àµà´•àµà´•. à´µàµà´¯à´•àµà´¤à´¤à´¯à´¿à´²àµà´²à´¾à´¤àµà´¤ à´šà´¿à´¤àµà´°à´™àµà´™àµ¾ à´…à´ªàµâ€Œà´²àµ‹à´¡àµ à´šàµ†à´¯àµà´¯à´°àµà´¤àµ. à´¬à´Ÿàµà´Ÿàµº à´µàµ€à´£àµà´Ÿàµà´‚ à´•àµà´²à´¿à´•àµà´•àµà´šàµ†à´¯àµà´¤àµ à´¨à´¿à´™àµà´™àµ¾à´•àµà´•àµ à´Žà´ªàµà´ªàµ‹àµ¾ à´µàµ‡à´£à´®àµ†à´™àµà´•à´¿à´²àµà´‚ à´ˆ à´“à´¡à´¿à´¯àµ‹ à´¤à´¾àµ½à´•àµà´•à´¾à´²à´¿à´•à´®à´¾à´¯à´¿ à´¨à´¿àµ¼à´¤àµà´¤à´¾à´‚. à´¨à´¿à´™àµà´™à´³àµà´Ÿàµ† à´¯à´¾à´¤àµà´° à´†à´°à´‚à´­à´¿à´•àµà´•à´¾à´‚!",
    gu: "àª¨àª®àª¸à«àª¤à«‡ àª…àª®àª¿àª¤ àª•à«àª®àª¾àª°. àªªàª°àª¿àªµàª¹àª¨ àª¸à«‡àªµàª¾ àª¡à«àª°àª¾àª‡àªµàª¿àª‚àª— àª²àª¾àª‡àª¸àª¨à«àª¸ àªªà«‹àª°à«àªŸàª²àª®àª¾àª‚ àª¤àª®àª¾àª°à«àª‚ àª¸à«àªµàª¾àª—àª¤ àª›à«‡. àª¹à«àª‚ àª¤àª®àª¾àª°à«‹ àª‘àª¡àª¿àª“ àª®àª¾àª°à«àª—àª¦àª°à«àª¶àª• àª›à«àª‚. àª¤àª®àª¾àª°à«àª‚ àª¡à«àª°àª¾àª‡àªµàª¿àª‚àª— àª²àª¾àª‡àª¸àª¨à«àª¸ àª®à«‡àª³àªµàªµàª¾ àª®àª¾àªŸà«‡, àª¤àª®àª¾àª°à«‡ àª¥à«‹àª¡àª¾ àª¸àª°àª³ àªªàª—àª²àª¾àª‚àª“àª¨à«àª‚ àªªàª¾àª²àª¨ àª•àª°àªµàª¾àª¨à«€ àªœàª°à«‚àª° àª›à«‡. àªªà«àª°àª¥àª®, àª¤àª®àª¾àª°à«àª‚ àª°àª¾àªœà«àª¯ àª…àª¨à«‡ àª†àª°àªŸà«€àª“ àªªàª¸àª‚àª¦ àª•àª°à«‹. àª†àª—àª³, àªµàª¾àª¹àª¨àª¨à«‹ àªªà«àª°àª•àª¾àª° àªªàª¸àª‚àª¦ àª•àª°à«‹. àªªàª›à«€, àª¤àª®àª¾àª°à«€ àªªàª¾àª¤à«àª°àª¤àª¾ àªšàª•àª¾àª¸à«‹ àª…àª¨à«‡ àªœà«‹ àª¤àª®àª¾àª°à«€ àªªàª¾àª¸à«‡ àª²àª°à«àª¨àª°à«àª¸ àª²àª¾àª‡àª¸àª¨à«àª¸ àª¨ àª¹à«‹àª¯ àª¤à«‹ àª…àª°àªœà«€ àª•àª°à«‹. àª–àª¾àª¤àª°à«€ àª•àª°à«‹ àª•à«‡ àª¤àª®àª¾àª°à«àª‚ àª†àª§àª¾àª° àª•àª¾àª°à«àª¡ àª…àª¨à«‡ àª…àª¨à«àª¯ àªœàª°à«‚àª°à«€ àª¦àª¸à«àª¤àª¾àªµà«‡àªœà«‹ àª¸à«àªªàª·à«àªŸ àª°à«€àª¤à«‡ àª¸à«àª•à«‡àª¨ àª•àª°à«‡àª²àª¾ àª…àª¨à«‡ àª¤à«ˆàª¯àª¾àª° àª›à«‡. àª…àª¸à«àªªàª·à«àªŸ àª›àª¬à«€àª“ àª…àªªàª²à«‹àª¡ àª•àª°àª¶à«‹ àª¨àª¹à«€àª‚. àª¤àª®à«‡ àª«àª°à«€àª¥à«€ àª¬àªŸàª¨ àªªàª° àª•à«àª²àª¿àª• àª•àª°à«€àª¨à«‡ àª•à«‹àªˆàªªàª£ àª¸àª®àª¯à«‡ àª† àª‘àª¡àª¿àª“ àª¥à«‹àª­àª¾àªµà«€ àª¶àª•à«‹ àª›à«‹. àªšàª¾àª²à«‹ àª¤àª®àª¾àª°à«€ àª®à«àª¸àª¾àª«àª°à«€ àª¶àª°à«‚ àª•àª°à«€àª!",
    pa: "à¨¸à¨¤à¨¿ à¨¸à©à¨°à©€ à¨…à¨•à¨¾à¨² à¨…à¨®à¨¿à¨¤ à¨•à©à¨®à¨¾à¨°à¥¤ à¨ªà¨°à¨¿à¨µà¨¹à¨¨ à¨¸à©‡à¨µà¨¾ à¨¡à¨°à¨¾à¨ˆà¨µà¨¿à©°à¨— à¨²à¨¾à¨‡à¨¸à©ˆà¨‚à¨¸ à¨ªà©‹à¨°à¨Ÿà¨² à¨µà¨¿à©±à¨š à¨¤à©à¨¹à¨¾à¨¡à¨¾ à¨¸à©à¨†à¨—à¨¤ à¨¹à©ˆà¥¤ à¨®à©ˆà¨‚ à¨¤à©à¨¹à¨¾à¨¡à¨¾ à¨†à¨¡à©€à¨“ à¨—à¨¾à¨ˆà¨¡ à¨¹à¨¾à¨‚à¥¤ à¨†à¨ªà¨£à¨¾ à¨¡à¨°à¨¾à¨ˆà¨µà¨¿à©°à¨— à¨²à¨¾à¨‡à¨¸à©ˆà¨‚à¨¸ à¨ªà©à¨°à¨¾à¨ªà¨¤ à¨•à¨°à¨¨ à¨²à¨ˆ, à¨¤à©à¨¹à¨¾à¨¨à©‚à©° à¨•à©à¨ à¨¸à¨§à¨¾à¨°à¨¨ à¨•à¨¦à¨®à¨¾à¨‚ à¨¦à©€ à¨ªà¨¾à¨²à¨£à¨¾ à¨•à¨°à¨¨à©€ à¨ªà¨µà©‡à¨—à©€à¥¤ à¨ªà¨¹à¨¿à¨²à¨¾à¨‚, à¨†à¨ªà¨£à¨¾ à¨°à¨¾à¨œ à¨…à¨¤à©‡ à¨†à¨°.à¨Ÿà©€.à¨“ à¨šà©à¨£à©‹à¥¤ à¨…à©±à¨—à©‡, à¨µà¨¾à¨¹à¨¨ à¨¦à©€ à¨•à¨¿à¨¸à¨® à¨šà©à¨£à©‹à¥¤ à¨«à¨¿à¨°, à¨†à¨ªà¨£à©€ à¨¯à©‹à¨—à¨¤à¨¾ à¨¦à©€ à¨œà¨¾à¨‚à¨š à¨•à¨°à©‹ à¨…à¨¤à©‡ à¨œà©‡à¨•à¨° à¨¤à©à¨¹à¨¾à¨¡à©‡ à¨•à©‹à¨² à¨²à¨°à¨¨à¨° à¨²à¨¾à¨‡à¨¸à©ˆà¨‚à¨¸ à¨¨à¨¹à©€à¨‚ à¨¹à©ˆ à¨¤à¨¾à¨‚ à¨…à¨°à¨œà¨¼à©€ à¨¦à¨¿à¨“à¥¤ à¨‡à¨¹ à¨¯à¨•à©€à¨¨à©€ à¨¬à¨£à¨¾à¨“ à¨•à¨¿ à¨¤à©à¨¹à¨¾à¨¡à¨¾ à¨†à¨§à¨¾à¨° à¨•à¨¾à¨°à¨¡ à¨…à¨¤à©‡ à¨¹à©‹à¨° à¨²à©‹à©œà©€à¨‚à¨¦à©‡ à¨¦à¨¸à¨¤à¨¾à¨µà©‡à¨œà¨¼ à¨¸à¨ªà¨¸à¨¼à¨Ÿ à¨¤à©Œà¨° 'à¨¤à©‡ à¨¸à¨•à©ˆà¨¨ à¨•à©€à¨¤à©‡ à¨—à¨ à¨…à¨¤à©‡ à¨¤à¨¿à¨†à¨° à¨¹à¨¨à¥¤ à¨§à©à©°à¨¦à¨²à©€à¨†à¨‚ à¨¤à¨¸à¨µà©€à¨°à¨¾à¨‚ à¨…à©±à¨ªà¨²à©‹à¨¡ à¨¨à¨¾ à¨•à¨°à©‹à¥¤ à¨¤à©à¨¸à©€à¨‚ à¨¬à¨Ÿà¨¨ 'à¨¤à©‡ à¨¦à©à¨¬à¨¾à¨°à¨¾ à¨•à¨²à¨¿à©±à¨• à¨•à¨°à¨•à©‡ à¨•à¨¿à¨¸à©‡ à¨µà©€ à¨¸à¨®à©‡à¨‚ à¨‡à¨¸ à¨†à¨¡à©€à¨“ à¨¨à©‚à©° à¨°à©‹à¨• à¨¸à¨•à¨¦à©‡ à¨¹à©‹à¥¤ à¨†à¨“ à¨¤à©à¨¹à¨¾à¨¡à¨¾ à¨¸à¨«à¨¼à¨° à¨¸à¨¼à©à¨°à©‚ à¨•à¨°à©€à¨!",
    or: "à¬¨à¬®à¬¸à­à¬•à¬¾à¬° à¬…à¬®à¬¿à¬¤ à¬•à­à¬®à¬¾à¬°à¥¤ à¬ªà¬°à¬¿à¬¬à¬¹à¬¨ à¬¸à­‡à¬¬à¬¾ à¬¡à­à¬°à¬¾à¬‡à¬­à¬¿à¬‚ à¬²à¬¾à¬‡à¬¸à­‡à¬¨à­à¬¸ à¬ªà­‹à¬°à­à¬Ÿà¬¾à¬²à¬•à­ à¬¸à­à­±à¬¾à¬—à¬¤à¥¤ à¬®à­à¬ à¬†à¬ªà¬£à¬™à­à¬•à¬° à¬…à¬¡à¬¿à¬“ à¬—à¬¾à¬‡à¬¡à­à¥¤ à¬†à¬ªà¬£à¬™à­à¬•à¬° à¬¡à­à¬°à¬¾à¬‡à¬­à¬¿à¬‚ à¬²à¬¾à¬‡à¬¸à­‡à¬¨à­à¬¸ à¬ªà¬¾à¬‡à¬¬à¬¾à¬•à­, à¬†à¬ªà¬£à¬™à­à¬•à­ à¬•à¬¿à¬›à¬¿ à¬¸à¬°à¬³ à¬ªà¬¦à¬•à­à¬·à­‡à¬ª à¬…à¬¨à­à¬¸à¬°à¬£ à¬•à¬°à¬¿à¬¬à¬¾à¬•à­ à¬ªà¬¡à¬¿à¬¬à¥¤ à¬ªà­à¬°à¬¥à¬®à­‡, à¬†à¬ªà¬£à¬™à­à¬• à¬°à¬¾à¬œà­à­Ÿ à¬à¬¬à¬‚ à¬†à¬°à¬Ÿà¬¿à¬“ à¬¬à¬¾à¬›à¬¨à­à¬¤à­à¥¤ à¬ªà¬°à¬¬à¬°à­à¬¤à­à¬¤à­€ à¬¸à¬®à­Ÿà¬°à­‡, à¬¯à¬¾à¬¨à¬° à¬ªà­à¬°à¬•à¬¾à¬° à¬¬à¬¾à¬›à¬¨à­à¬¤à­à¥¤ à¬¤à¬¾à¬ªà¬°à­‡, à¬†à¬ªà¬£à¬™à­à¬•à¬° à¬¯à­‹à¬—à­à­Ÿà¬¤à¬¾ à¬¯à¬¾à¬žà­à¬š à¬•à¬°à¬¨à­à¬¤à­ à¬à¬¬à¬‚ à¬¯à¬¦à¬¿ à¬†à¬ªà¬£à¬™à­à¬• à¬ªà¬¾à¬–à¬°à­‡ à¬²à¬°à­à¬£à­à¬£à¬°à­à¬¸ à¬²à¬¾à¬‡à¬¸à­‡à¬¨à­à¬¸ à¬¨à¬¾à¬¹à¬¿à¬ à¬¤à­‡à¬¬à­‡ à¬†à¬¬à­‡à¬¦à¬¨ à¬•à¬°à¬¨à­à¬¤à­à¥¤ à¬¨à¬¿à¬¶à­à¬šà¬¿à¬¤ à¬•à¬°à¬¨à­à¬¤à­ à¬¯à­‡ à¬†à¬ªà¬£à¬™à­à¬•à¬° à¬†à¬§à¬¾à¬° à¬•à¬¾à¬°à­à¬¡ à¬à¬¬à¬‚ à¬…à¬¨à­à­Ÿà¬¾à¬¨à­à­Ÿ à¬†à¬¬à¬¶à­à­Ÿà¬•à­€à­Ÿ à¬¦à¬¸à­à¬¤à¬¾à¬¬à­‡à¬œà¬—à­à¬¡à¬¿à¬• à¬¸à­à¬ªà¬·à­à¬Ÿ à¬­à¬¾à¬¬à¬°à­‡ à¬¸à­à¬•à¬¾à¬¨ à¬¹à­‹à¬‡à¬›à¬¿ à¬à¬¬à¬‚ à¬ªà­à¬°à¬¸à­à¬¤à­à¬¤ à¬…à¬›à¬¿à¥¤ à¬…à¬¸à­à¬ªà¬·à­à¬Ÿ à¬šà¬¿à¬¤à­à¬° à¬…à¬ªà¬²à­‹à¬¡à­ à¬•à¬°à¬¨à­à¬¤à­ à¬¨à¬¾à¬¹à¬¿à¬à¥¤ à¬¬à¬Ÿà¬¨à­ à¬•à­ à¬ªà­à¬¨à¬°à­à¬¬à¬¾à¬° à¬•à­à¬²à¬¿à¬•à­ à¬•à¬°à¬¿ à¬†à¬ªà¬£ à¬¯à­‡à¬•à­Œà¬£à¬¸à¬¿ à¬¸à¬®à­Ÿà¬°à­‡ à¬à¬¹à¬¿ à¬…à¬¡à¬¿à¬“ à¬•à­ à¬¬à¬¿à¬°à¬¤à¬¿ à¬¦à­‡à¬‡à¬ªà¬¾à¬°à¬¿à¬¬à­‡à¥¤ à¬†à¬¸à¬¨à­à¬¤à­ à¬†à¬ªà¬£à¬™à­à¬• à¬¯à¬¾à¬¤à­à¬°à¬¾ à¬†à¬°à¬®à­à¬­ à¬•à¬°à¬¿à¬¬à¬¾!"
  };

  const audioRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(DL_ASSISTANT_STORAGE_KEY, JSON.stringify(assistantMessages));
    assistantEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [assistantMessages]);

  const startSpeech = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const text = audioScripts[language] || audioScripts.en;
    
    setAudioState('PLAYING');
    
    try {
      // Calls the backend to securely synthesize speech using a Cloud TTS provider (e.g. Azure TTS)
      // that supports all 11 required Indian languages natively.
      const response = await fetch('https://parivahan-sewa2-0-backend.onrender.com/api/v1/tts/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: JSON.stringify({ text, language })
      });
      
      if (!response.ok) {
        console.error("TTS configuration is missing or backend failed. Please configure your Cloud TTS provider API keys in the backend.");
        setAudioState('IDLE');
        return;
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const audio = new Audio(url);
      
      audio.onended = () => {
        setAudioState('IDLE');
      };
      
      audio.onerror = (e) => {
        console.error("TTS Audio Playback Error", e);
        setAudioState('IDLE');
      };

      audioRef.current = audio;
      audio.play().catch(e => {
        console.error("Autoplay blocked or error:", e);
        setAudioState('IDLE');
      });
    } catch (error) {
      console.error("Failed to connect to TTS backend service. Ensure /api/v1/tts/synthesize is implemented.");
      setAudioState('IDLE');
    }
  };

  const handlePlayPause = () => {
    if (audioState === 'PLAYING') {
      if (audioRef.current) audioRef.current.pause();
      setAudioState('PAUSED');
    } else if (audioState === 'PAUSED') {
      if (audioRef.current) audioRef.current.play();
      setAudioState('PLAYING');
    } else {
      startSpeech();
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioState('IDLE');
    setTimeout(startSpeech, 100);
  };

  const handleAssistantAction = (actionCode) => {
    const route = resolveActionRoute(actionCode);
    if (route) navigate(route);
  };

  const sendAssistantMessage = async (text) => {
    const question = text?.trim();
    if (!question || assistantLoading) return;

    setAssistantInput('');
    const history = assistantMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .slice(-8)
      .map((m) => ({ role: m.role, content: m.role === 'user' ? m.text : m.answer }));

    setAssistantMessages(prev => [...prev, { role: 'user', text: question }]);
    setAssistantLoading(true);

    try {
      const response = await askApplicationProcess(question, history, language);
      setAssistantMessages(prev => [...prev, { role: 'assistant', ...response }]);
    } catch (err) {
      setAssistantMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          answer: err.message === 'UNAUTHORIZED'
            ? 'Please log in again to use the application assistant.'
            : 'I am unable to reach the assistant right now. You can still continue the DL application from the Start Application button.',
          actions: [{ label: 'Start DL Application', action: 'START_DL_APPLICATION' }],
          sources: [],
          fallback: true,
        },
      ]);
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleAssistantKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendAssistantMessage(assistantInput);
    }
  };

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
              Start Application <ArrowRight className="w-5 h-5" />
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
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePlayPause}
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md shrink-0"
              >
                {audioState === 'PLAYING' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              {(audioState === 'PLAYING' || audioState === 'PAUSED') && (
                <button
                  onClick={handleReplay}
                  title="Replay"
                  className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1 h-8 px-2 overflow-hidden w-32 md:w-48">
               {[...Array(24)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={audioState === 'PLAYING' ? { height: [8, Math.random() * 24 + 8, 8] } : { height: 4 }}
                    transition={audioState === 'PLAYING' ? { repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" } : {}}
                    className={`w-1 rounded-full ${audioState === 'PLAYING' ? 'bg-blue-500' : 'bg-slate-300'}`}
                  />
               ))}
            </div>
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
          <div className="w-full lg:w-[400px] bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col relative min-h-[520px]">
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

             <div className="flex flex-col gap-2 mb-4">
               {[t.dl.q1, t.dl.q2, t.dl.q3, t.dl.q4].map((question) => (
                 <button
                   key={question}
                   onClick={() => sendAssistantMessage(question)}
                   disabled={assistantLoading}
                   className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-100 hover:border-blue-200 text-xs font-medium py-2 px-4 rounded-full text-left transition-colors truncate disabled:opacity-60"
                 >
                   {question}
                 </button>
               ))}
             </div>

             <div className="flex-1 overflow-y-auto pr-1 space-y-3 mb-4 min-h-[170px] max-h-[260px]">
               {assistantMessages.map((msg, index) => (
                 <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   {msg.role === 'assistant' && (
                     <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                       <Bot className="w-3.5 h-3.5 text-blue-600" />
                     </div>
                   )}
                   <div className={`max-w-[86%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                     msg.role === 'user'
                       ? 'bg-blue-600 text-white rounded-tr-sm'
                       : msg.fallback
                         ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-tl-sm'
                         : 'bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-sm'
                   }`}>
                     {msg.role === 'user' ? msg.text : msg.answer}
                     {msg.actions?.length > 0 && (
                       <div className="mt-2 flex flex-wrap gap-1.5">
                         {msg.actions.map((action, actionIndex) => (
                           <button
                             key={`${action.action}-${actionIndex}`}
                             onClick={() => handleAssistantAction(action.action)}
                             className="inline-flex items-center gap-1 rounded-full bg-white/80 border border-blue-200 text-blue-700 px-2 py-1 text-[10px] font-bold hover:bg-blue-50"
                           >
                             {action.label}
                             <ExternalLink className="w-3 h-3" />
                           </button>
                         ))}
                       </div>
                     )}
                   </div>
                 </div>
               ))}
               {assistantLoading && (
                 <div className="flex gap-2 justify-start">
                   <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                     <Bot className="w-3.5 h-3.5 text-blue-600" />
                   </div>
                   <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-3 py-2">
                     <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                   </div>
                 </div>
               )}
               <div ref={assistantEndRef} />
             </div>

             <div className="mt-auto relative">
               <input 
                 type="text" 
                 value={assistantInput}
                 onChange={(e) => setAssistantInput(e.target.value)}
                 onKeyDown={handleAssistantKeyDown}
                 placeholder={t.dl.typeQ} 
                 disabled={assistantLoading}
                 className="w-full bg-slate-50 border border-slate-200 rounded-full py-3 pl-5 pr-12 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-60"
               />
               <button
                 onClick={() => sendAssistantMessage(assistantInput)}
                 disabled={!assistantInput.trim() || assistantLoading}
                 className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
               >
                 {assistantLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
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
