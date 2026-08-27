import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Square } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AudioGuide = ({ textToRead, readElementId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { language } = useLanguage();
  const synthRef = useRef(window.speechSynthesis);

  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      synthRef.current.cancel();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // When text changes, stop current audio if playing
  useEffect(() => {
    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  }, [textToRead]);

  const toggleSpeech = async () => {
    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      let finalContent = textToRead;
      
      if (readElementId) {
        const el = document.getElementById(readElementId);
        if (el) finalContent = el.textContent || el.innerText;
      }

      if (!finalContent) return;
      
      setIsPlaying(true);
      
      try {
        const utterance = new SpeechSynthesisUtterance(finalContent);
        
        // Try to match language
        if (voices.length > 0) {
           let match = voices.find(v => v.lang.startsWith(language));
           if (!match) match = voices.find(v => v.lang.startsWith('en'));
           if (match) utterance.voice = match;
        }

        utterance.onend = () => {
          setIsPlaying(false);
        };

        utterance.onerror = (e) => {
          console.error("TTS Audio Playback Error", e);
          setIsPlaying(false);
        };

        synthRef.current.speak(utterance);
      } catch (error) {
        console.error("Failed to play TTS audio.", error);
        setIsPlaying(false);
      }
    }
  };

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
      {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
};

export default AudioGuide;
