import { safeLower } from '../lib/utils';
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Settings2 } from 'lucide-react';

interface AudioPlayButtonProps {
  text: string;
  isParchment?: boolean;
}

export function AudioPlayButton({ text, isParchment }: AudioPlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [repeats, setRepeats] = useState<number>(1);
  const [rate, setRate] = useState<number>(0.75); // Slower default for learners
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleVoices = () => window.speechSynthesis?.getVoices();
    handleVoices(); // initial call
    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = handleVoices;
    }
    
    const clickOutside = (e: MouseEvent) => {
        if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
            setShowSettings(false);
        }
    };
    document.addEventListener('mousedown', clickOutside);
    
    return () => {
      document.removeEventListener('mousedown', clickOutside);
      window.speechSynthesis?.cancel(); // cleanup on unmount
    };
  }, []);

  const handlePlay = () => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Cancel any previous
    window.speechSynthesis.cancel(); 
    
    const voices = window.speechSynthesis.getVoices();
    // Try to find an Arabic voice
    const arabicVoice = voices.find(v => v.lang.startsWith('ar')) || voices.find(v => safeLower(v.name).includes('arabic'));

    setIsPlaying(true);
    
    for (let i = 0; i < repeats; i++) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = rate; 
        if (arabicVoice) utterance.voice = arabicVoice;
        
        // On the final repeat, we unset the isPlaying state
        if (i === repeats - 1) {
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);
        }
        
        window.speechSynthesis.speak(utterance);
    }
  };

  const themeClasses = isParchment 
    ? 'text-[#8c6239] hover:bg-[#8c6239]/10' 
    : 'text-amber-500 hover:bg-amber-500/10';

  const menuBg = isParchment ? 'bg-[#faf6ed] border-[#ebdcc3] shadow-md' : 'bg-[#0f172a] border-slate-700 text-slate-200 shadow-xl';
  const dividerBorder = isParchment ? 'border-amber-900/10' : 'border-white/10';
  const hoverBg = isParchment ? 'hover:bg-amber-900/5' : 'hover:bg-white/5';

  return (
    <div className="relative inline-flex items-center gap-0.5" ref={settingsRef} onClick={e => e.stopPropagation()}>
      <button 
        onClick={handlePlay}
        className={`p-2 rounded-full transition-colors flex items-center justify-center ${themeClasses} ${isPlaying ? 'bg-current/10 opacity-100' : 'opacity-80 hover:opacity-100'}`}
        title="Listen to pronunciation"
      >
        {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
      
      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded-full transition-colors opacity-40 hover:opacity-100 focus:outline-none ${themeClasses} ${showSettings ? 'opacity-100 bg-current/10' : ''}`}
          title="Audio settings"
        >
           <Settings2 className="w-3.5 h-3.5" />
        </button>
        
        {showSettings && (
          <div className={`absolute top-full right-0 mt-1 p-3 rounded-xl border z-50 min-w-[180px] space-y-4 ${menuBg}`} style={{ direction: 'ltr' }}>
             <div className="space-y-2">
               <label className="text-[10px] font-mono opacity-80 uppercase block tracking-wider font-bold">Playback Speed</label>
               <div className={`flex rounded-lg overflow-hidden border text-[10px] font-bold ${dividerBorder}`}>
                 <button onClick={() => setRate(0.5)} className={`flex-1 py-1.5 transition-colors ${rate === 0.5 ? 'bg-amber-500 text-white' : hoverBg}`}>Slow</button>
                 <button onClick={() => setRate(0.75)} className={`flex-1 py-1.5 transition-colors border-l ${dividerBorder} ${rate === 0.75 ? 'bg-amber-500 text-white' : hoverBg}`}>Learn</button>
                 <button onClick={() => setRate(1.0)} className={`flex-1 py-1.5 transition-colors border-l ${dividerBorder} ${rate === 1.0 ? 'bg-amber-500 text-white' : hoverBg}`}>Norm</button>
               </div>
             </div>
             
             <div className="space-y-2">
               <label className="text-[10px] font-mono opacity-80 uppercase block tracking-wider font-bold">Auto-Repeat</label>
               <div className={`flex rounded-lg overflow-hidden border text-[10px] font-bold ${dividerBorder}`}>
                 <button onClick={() => setRepeats(1)} className={`flex-1 py-1.5 transition-colors ${repeats === 1 ? 'bg-amber-500 text-white' : hoverBg}`}>1x</button>
                 <button onClick={() => setRepeats(3)} className={`flex-1 py-1.5 transition-colors border-l ${dividerBorder} ${repeats === 3 ? 'bg-amber-500 text-white' : hoverBg}`}>3x</button>
                 <button onClick={() => setRepeats(5)} className={`flex-1 py-1.5 transition-colors border-l ${dividerBorder} ${repeats === 5 ? 'bg-amber-500 text-white' : hoverBg}`}>5x</button>
               </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
