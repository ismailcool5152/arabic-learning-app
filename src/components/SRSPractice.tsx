import React, { useState } from 'react';
import { LayoutTheme, SRSRecord } from '../types';
import { Brain, CheckCircle2, XCircle, HelpCircle, ChevronRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { useSRS } from '../hooks/useSRS';

interface Props {
  theme: LayoutTheme;
}

export default function SRSPractice({ theme }: Props) {
  const { getDueReviews, submitReview, records } = useSRS();
  
  const [sessionActive, setSessionActive] = useState(false);
  const [dueCards, setDueCards] = useState<SRSRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const startSession = () => {
    setDueCards(getDueReviews());
    setCurrentIndex(0);
    setShowAnswer(false);
    setSessionActive(true);
  };

  const handleRate = (quality: number) => {
    const currentCard = dueCards[currentIndex];
    submitReview(currentCard.id, quality);
    
    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setSessionActive(false);
    }
  };

  const isCosmic = theme === 'cosmic';
  const isParchment = theme === 'parchment';
  
  const colors = {
    bg: isParchment ? 'bg-[#f4efe8]' : isCosmic ? 'bg-[#0f1225]' : 'bg-slate-50',
    card: isParchment ? 'bg-[#faf6ed] shadow-sm border-[#e8dcc8]' : isCosmic ? 'bg-[#1a1f3c] border-white/5 shadow-lg' : 'bg-white shadow-xl border-slate-100',
    text: isParchment ? 'text-[#2c241e]' : isCosmic ? 'text-slate-200' : 'text-slate-800',
    accent: isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-600',
  };

  if (sessionActive && dueCards.length > 0) {
    const card = dueCards[currentIndex];
    return (
      <div className={`w-full max-w-2xl mx-auto p-4 space-y-6 animate-fadeIn ${colors.text}`}>
        <div className="flex justify-between items-center opacity-60 text-sm font-bold uppercase tracking-wider mb-8">
          <span>Review Session</span>
          <span>{currentIndex + 1} / {dueCards.length}</span>
        </div>

        <div className={`p-10 justify-center items-center flex flex-col text-center border rounded-3xl min-h-[300px] transition-all transform duration-500 ${colors.card}`}>
          <div className="text-6xl font-arabic font-bold mb-8 leading-tight" dir="rtl">{card.wordArabic}</div>
          
          {showAnswer ? (
            <div className="animate-fadeIn w-full">
              <div className="h-px bg-current opacity-10 w-full my-6"></div>
              <div className="text-xl font-medium opacity-90">{card.wordEnglish}</div>
            </div>
          ) : (
            <button 
              onClick={() => setShowAnswer(true)}
              className={`mt-4 px-8 py-3 rounded-xl font-bold transition-all ${isParchment ? 'bg-[#ebd8c3]/40 hover:bg-[#dfd2be]/60' : 'bg-current/5 hover:bg-current/10'}`}
            >
              Reveal Translation
            </button>
          )}
        </div>

        {showAnswer && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 animate-fadeIn mt-6">
            <button onClick={() => handleRate(0)} className="flex flex-col items-center p-4 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-all active:scale-95">
              <span className="font-bold mb-1">Again</span>
              <span className="text-xs opacity-70">Blackout</span>
            </button>
            <button onClick={() => handleRate(3)} className="flex flex-col items-center p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-all active:scale-95">
              <span className="font-bold mb-1">Hard</span>
              <span className="text-xs opacity-70">Hesitated</span>
            </button>
            <button onClick={() => handleRate(4)} className="flex flex-col items-center p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-all active:scale-95">
              <span className="font-bold mb-1">Good</span>
              <span className="text-xs opacity-70">Remembered</span>
            </button>
            <button onClick={() => handleRate(5)} className="flex flex-col items-center p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-all active:scale-95">
              <span className="font-bold mb-1">Easy</span>
              <span className="text-xs opacity-70">Perfect</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  const due = getDueReviews().length;

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${colors.text} animate-fadeIn`}>
      <div className={`p-8 md:p-12 rounded-3xl border ${colors.card} flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left`}>
        <div>
          <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
            <div className={`p-3 rounded-2xl ${isParchment ? 'bg-[#ebd8c3]/50' : 'bg-current/10'}`}>
              <Brain className={`w-8 h-8 ${colors.accent}`} />
            </div>
            <h2 className="text-3xl font-bold font-serif tracking-tight">Spaced Repetition</h2>
          </div>
          <p className="opacity-75 max-w-lg leading-relaxed">
            Words you discover in the Daily Widget or Flashcards are automatically added to your SM-2 Review cycle. Establish deep neurological pathways for Islamic terminology.
          </p>
        </div>

        <div className={`p-6 rounded-2xl border flex flex-col items-center min-w-[200px] ${isParchment ? 'bg-[#f4efe8]/50 border-[#e8dcc8]' : 'bg-current/5 border-current/10'}`}>
          <div className="text-xs font-bold tracking-widest uppercase opacity-60 mb-2">Due For Review</div>
          <div className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br ${isParchment ? 'from-[#8c6239] to-[#b88645]' : isCosmic ? 'from-indigo-400 to-purple-400' : 'from-emerald-400 to-teal-500'}`}>
            {due}
          </div>
          
          <button 
            disabled={due === 0}
            onClick={startSession}
            className={`mt-6 w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
              due === 0 
                ? 'opacity-50 cursor-not-allowed bg-current/5 text-current/60' 
                : isParchment 
                  ? 'bg-[#8c6239] text-[#faf6ed] hover:bg-[#7a5431]' 
                  : isCosmic 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {due === 0 ? 'All Caught Up!' : 'Begin Session'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className={`p-6 border rounded-2xl ${colors.card}`}>
          <h3 className="font-bold flex items-center gap-2 mb-4"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Active Vocabulary ({records.length})</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-none">
            {records.map((r, i) => (
              <div key={i} className={`flex items-center justify-between p-3 border rounded-xl ${isParchment ? 'border-[#e8dcc8] bg-[#fdfbf7]/50' : 'border-current/10 bg-current/5'}`}>
                <div className="font-arabic text-xl" dir="rtl">{r.wordArabic}</div>
                <div className="text-xs opacity-60 capitalize">{r.wordEnglish}</div>
              </div>
            ))}
            {records.length === 0 && (
              <div className="text-center opacity-50 py-8 text-sm">
                No words added yet. Check the Word of the Day!
              </div>
            )}
          </div>
        </div>
        
        <div className={`p-6 border rounded-2xl ${colors.card}`}>
           <h3 className="font-bold flex items-center gap-2 mb-4"><HelpCircle className="w-5 h-5 opacity-60" /> About the Algorithm</h3>
           <p className="text-sm opacity-80 leading-relaxed mb-4">
             The SM-2 algorithm spaces out reviews over increasing intervals of time. If you remember a word easily, you won't see it for a long time. If you struggle, it will reappear sooner.
           </p>
           <ul className="text-sm space-y-2 opacity-80">
             <li>• Perfect retention extends memory trace</li>
             <li>• Scientifically limits study fatigue</li>
             <li>• Adapts to your individual recollection speed</li>
           </ul>
        </div>
      </div>
    </div>
  );
}
