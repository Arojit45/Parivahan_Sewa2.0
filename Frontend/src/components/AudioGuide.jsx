import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AudioGuide = ({ textToRead, readElementId }) => {
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
      let finalContent = textToRead;
      
      // If an element ID is provided, read the DOM text (which handles Google Translate)
      if (readElementId) {
        const el = document.getElementById(readElementId);
        // Use textContent instead of innerText because layout properties might make innerText empty
        if (el) finalContent = el.textContent || el.innerText;
      }

      if (!finalContent) return;
      
      const utterance = new SpeechSynthesisUtterance(finalContent);
      
      // Attempt to map our language code to browser voices
      let langCode = 'en-US';
      if (language === 'hi') langCode = 'hi-IN';
      if (language === 'bn') langCode = 'bn-IN';
      if (language === 'mr') langCode = 'mr-IN';
      if (language === 'ta') langCode = 'ta-IN';
      if (language === 'te') langCode = 'te-IN';
      
      const voices = window.speechSynthesis.getVoices();
      let matchingVoice = voices.find(v => v.lang.startsWith(langCode) || v.lang.startsWith(langCode.split('-')[0]));
      
      // Fallback logic for AudioGuide: Since text is already translated by Google Translate on the DOM,
      // if we fallback to Hindi/English voice to read Bengali text, it will sound like gibberish.
      // However, gibberish/accented speech is a better debug signal than absolute silence, and if they 
      // are lucky, Chrome's generic Google voice might attempt to parse it. 
      // Ideally, the user's OS should have the language pack installed.
      if (!matchingVoice && language !== 'en') {
        matchingVoice = voices.find(v => v.lang.startsWith('hi')) || voices.find(v => v.lang.startsWith('en'));
      }
      
      utterance.lang = matchingVoice ? matchingVoice.lang : langCode;
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      
      utterance.rate = 0.9;
      
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
