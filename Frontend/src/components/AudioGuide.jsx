import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AudioGuide = ({ textToRead, readElementId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { language } = useLanguage();
  const synthRef = useRef(window.speechSynthesis);

  const audioRef = useRef(null);
  const queueRef = useRef([]);
  const isPausedRef = useRef(false);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // When text changes, stop current audio if playing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, [textToRead]);

  const toggleSpeech = async () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
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
        const response = await fetch('/api/v1/tts/synthesize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
          },
          body: JSON.stringify({ text: finalContent, language })
        });
        
        if (!response.ok) {
          console.error("TTS configuration is missing or backend failed. Please configure your Cloud TTS provider API keys in the backend.");
          setIsPlaying(false);
          return;
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        const audio = new Audio(url);
        
        audio.onended = () => {
          setIsPlaying(false);
        };
        
        audio.onerror = (e) => {
          console.error("TTS Audio Playback Error", e);
          setIsPlaying(false);
        };

        audioRef.current = audio;
        audio.play().catch(e => {
          console.error("Autoplay blocked or error:", e);
          setIsPlaying(false);
        });
      } catch (error) {
        console.error("Failed to connect to TTS backend service. Ensure /api/v1/tts/synthesize is implemented.");
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
      {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
    </button>
  );
};

export default AudioGuide;
