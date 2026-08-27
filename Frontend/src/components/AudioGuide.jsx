import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AudioGuide = ({ textToRead }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { language } = useLanguage();
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
    }
    
    // Stop speaking when component unmounts
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // When text changes, stop current audio if playing
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  }, [textToRead]);

  const toggleSpeech = () => {
    if (!isSupported) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      if (!textToRead) return;
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      
      // Attempt to map our language code (en, hi, bn) to browser voices
      let langCode = 'en-US';
      if (language === 'hi') langCode = 'hi-IN';
      if (language === 'bn') langCode = 'bn-IN';
      // etc for other languages, defaulting to generic if unsupported
      
      utterance.lang = langCode;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      setIsPlaying(true);
      synthRef.current.speak(utterance);
    }
  };

  if (!isSupported) return null;

  return (
    <button
      onClick={toggleSpeech}
      title={isPlaying ? "Stop Audio Guide" : "Play Audio Guide"}
      className={`p-2 rounded-full transition-colors flex items-center justify-center shadow-sm border ${
        isPlaying 
          ? 'bg-blue-100 text-blue-700 border-blue-300 animate-pulse' 
          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
      }`}
    >
      {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
};

export default AudioGuide;
