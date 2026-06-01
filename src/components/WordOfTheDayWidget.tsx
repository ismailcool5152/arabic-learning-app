import React, { useState, useEffect } from 'react';
import { LayoutTheme, WordAnalysis } from '../types';
import { Sparkles, Calendar, BookOpen, Clock, Activity, History, ArrowRight, Book, Layers, RotateCcw, Check } from 'lucide-react';
import RootToWords from './RootToWords';
import { AudioPlayButton } from './AudioPlayButton';

interface Props {
  theme: LayoutTheme;
  isOfflineMode: boolean;
  onSelectWord: (word: string) => void;
  onWordSeen?: (wordArabic: string, wordEnglish: string) => void;
  onStartQuiz?: () => void;
}

// 28 Roots representing each letter
const ALPHABET_ROOTS = [
  { root: "أ م ر", meaning: "To command, matter, affair", letter: "ا" },
  { root: "ب ر ك", meaning: "To bless, multiply", letter: "ب" },
  { root: "ت و ب", meaning: "To repent, turn back", letter: "ت" },
  { root: "ث ب ت", meaning: "To be firm, steady", letter: "ث" },
  { root: "ج ع ل", meaning: "To make, place, set", letter: "ج" },
  { root: "ح م د", meaning: "To praise, commend", letter: "ح" },
  { root: "خ ل ق", meaning: "To create, shape", letter: "خ" },
  { root: "د ع و", meaning: "To call, invite, pray", letter: "د" },
  { root: "ذ ك ر", meaning: "To remember, mention", letter: "ذ" },
  { root: "ر ح م", meaning: "To have mercy, compassion", letter: "ر" },
  { root: "ز ك و", meaning: "To purify, grow", letter: "ز" },
  { root: "س ل م", meaning: "To be safe, submit, peace", letter: "س" },
  { root: "ش ك ر", meaning: "To thank, be grateful", letter: "ش" },
  { root: "ص ب ر", meaning: "To be patient, endure", letter: "ص" },
  { root: "ض ر ب", meaning: "To strike, travel, set forth", letter: "ض" },
  { root: "ط ه ر", meaning: "To purify, cleanse", letter: "ط" },
  { root: "ظ ل م", meaning: "To wrong, oppress, darkness", letter: "ظ" },
  { root: "ع ل م", meaning: "To know, learn", letter: "ع" },
  { root: "غ ف ر", meaning: "To forgive, cover", letter: "غ" },
  { root: "ف ع ل", meaning: "To do, act", letter: "ف" },
  { root: "ق و ل", meaning: "To say, speak", letter: "ق" },
  { root: "ك ت ب", meaning: "To write, ordain", letter: "ك" },
  { root: "ل ق ي", meaning: "To meet, encounter", letter: "ل" },
  { root: "م ل ك", meaning: "To possess, rule", letter: "م" },
  { root: "ن ص ر", meaning: "To help, give victory", letter: "ن" },
  { root: "ه د ي", meaning: "To guide, direct", letter: "ه" },
  { root: "و ج د", meaning: "To find, to exist", letter: "و" },
  { root: "ي ق ن", meaning: "To be certain, sure", letter: "ي" }
];

export default function WordOfTheDayWidget({ theme, isOfflineMode, onSelectWord, onWordSeen, onStartQuiz }: Props) {
  const [dailyRoot, setDailyRoot] = useState<string>('');
  const [dailyInfo, setDailyInfo] = useState<any>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [hasRevealedMeaning, setHasRevealedMeaning] = useState<boolean>(false);
  const [showExplore, setShowExplore] = useState<boolean>(false);
  
  const isCosmic = theme === 'cosmic';
  const isParchment = theme === 'parchment';
  const activeDay = Math.min(new Date().getDate(), 28);
  const streak = activeDay > 1 ? activeDay : 1;
  
  const colors = {
    bg: isParchment ? 'bg-[#f4efe8]' : isCosmic ? 'bg-[#0f1225]' : 'bg-slate-50',
    cardLayout: isParchment ? 'bg-gradient-to-br from-[#ebd8c3] to-[#f4efe8] shadow-sm border border-[#e8dcc8]' : isCosmic ? 'bg-gradient-to-br from-indigo-900/40 to-[#1a1f3c] shadow-lg shadow-black/40 border border-white/5' : 'bg-gradient-to-br from-emerald-50 to-white shadow-xl shadow-slate-200/50 border border-slate-100',
    text: isParchment ? 'text-[#2c241e]' : isCosmic ? 'text-slate-200' : 'text-slate-800',
    accentText: isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-600',
    header: isParchment ? 'bg-gradient-to-r from-[#e8dcc8] to-[#faf6ed] border-b border-[#d8c8b8]' : isCosmic ? 'bg-gradient-to-r from-indigo-950 to-[#1a1f3c] border-b border-indigo-900/50' : 'bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100'
  };

  useEffect(() => {
    const today = new Date();
    const dayOfMonth = today.getDate(); // 1 - 31
    let idx = 0;
    if (dayOfMonth <= 28) {
      idx = dayOfMonth - 1;
    } else {
      const seed = today.getFullYear() * 1000 + today.getMonth() * 100 + dayOfMonth;
      idx = seed % ALPHABET_ROOTS.length;
    }
    
    const info = ALPHABET_ROOTS[idx];
    setDailyRoot(info.root);
    setDailyInfo({ ...info, verse: getExampleVerse(info.root) });
    
    // Generate quiz options
    const options = [info.meaning];
    while(options.length < 3) {
      const randIdx = Math.floor(Math.random() * ALPHABET_ROOTS.length);
      const randMeaning = ALPHABET_ROOTS[randIdx].meaning;
      if (!options.includes(randMeaning)) {
        options.push(randMeaning);
      }
    }
    // Shuffle
    setQuizOptions(options.sort(() => Math.random() - 0.5));
    
  }, []);

  const handleReveal = async () => {
    setHasRevealedMeaning(true);
    
    // Check if we need to fetch a dynamic verse
    if (dailyInfo?.verse?.includes("unavailable")) {
      setDailyInfo(prev => ({ ...prev, isFetchingVerse: true }));
      try {
        const customApiKey = localStorage.getItem('gemini_api_key') || '';
        const response = await fetch('/api/example-verse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ root: dailyRoot, customApiKey })
        });
        
        if (!response.ok) {
           const errorData = await response.json().catch(() => ({}));
           console.error("Verse API failed:", errorData);
           setDailyInfo(prev => ({
             ...prev,
             verse: `Failed to generate example (${response.status} ${response.statusText}). Load explorer for derivatives.`,
             isFetchingVerse: false
           }));
           return;
        }

        const data = await response.json();
        
        if (data && data.verseArabic) {
          setDailyInfo(prev => ({
            ...prev,
            verse: `${data.verseArabic} (${data.verseTranslation} - ${data.reference})`,
            isFetchingVerse: false
          }));
        } else {
          setDailyInfo(prev => ({
            ...prev,
            verse: "Could not retrieve classic example. (API Limit or Formating Issue) Load Explorer.",
            isFetchingVerse: false
          }));
        }
      } catch (error) {
        setDailyInfo(prev => ({
          ...prev,
          verse: "Could not reach server to fetch example. Please try again.",
          isFetchingVerse: false
        }));
      }
    }
  };
  const getExampleVerse = (root: string) => {
    const verses: Record<string, string> = {
      "ك ت ب": "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ (This is the Book about which there is no doubt - 2:2)",
      "ع ل م": "وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا (And He taught Adam the names - all of them - 2:31)",
      "خ ل ق": "خَلَقَ الْإِنسَانَ مِن عَلَقٍ (Created man from a clinging substance - 96:2)",
      "ن ص ر": "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ (When the victory of Allah has come and the conquest - 110:1)",
      "س ج د": "وَاسْجُدْ وَاقْتَرِب (And prostrate and draw near [to Allah] - 96:19)"
    };
    return verses[root] || "Classical example unavailable for this specific root in offline mode. Load explorer for derivatives.";
  };

  // Track WOTD history
  useEffect(() => {
    if (dailyRoot) {
      const today = new Date();
      const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      try {
        const raw = localStorage.getItem('quranic_arabic_wotd_history');
        const history = raw ? JSON.parse(raw) : {};
        if (!history[dateKey] || history[dateKey] !== dailyRoot) {
          history[dateKey] = dailyRoot;
          localStorage.setItem('quranic_arabic_wotd_history', JSON.stringify(history));
        }
      } catch (e) {
        console.error("Failed to track WOTD history", e);
      }
      if (dailyInfo && onWordSeen) {
        onWordSeen(dailyInfo.root, dailyInfo.meaning);
      }
    }
  }, [dailyInfo, onWordSeen, dailyRoot]);

  if (!dailyRoot) return null;

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 space-y-6 ${colors.bg}`}>
      {/* Header Widget */}
      <div className={`p-8 md:p-12 rounded-3xl ${colors.cardLayout} animate-fadeIn flex flex-col md:flex-row gap-8 items-center md:items-stretch`}>
        
        {/* Left column: Root & Quiz / Breakdown */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
             <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${isParchment ? 'bg-[#8c6239] text-[#faf6ed]' : isCosmic ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
               Word of the Day
             </span>
             <span className={`text-sm font-bold opacity-60 ${colors.accentText}`}>
               Day {activeDay} of 28
             </span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-6 mb-8">
            <span className={`text-6xl md:text-7xl font-bold font-arabic drop-shadow-sm ${colors.text}`} dir="rtl">
              {dailyRoot}
            </span>
            <div className="flex flex-col gap-2">
              <AudioPlayButton text={dailyRoot} isParchment={isParchment} />
              {dailyInfo && (
                <div className={`px-3 py-1 rounded-full text-xs font-bold text-center ${isParchment ? 'bg-[#ebd8c3]/80 text-[#8c6239] border border-[#d8c8b8]' : isCosmic ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/10 text-emerald-600'}`}>
                  {dailyInfo.letter}
                </div>
              )}
            </div>
          </div>

          {!hasRevealedMeaning ? (
            <div className="space-y-4 animate-fadeIn max-w-md mx-auto md:mx-0">
               <h3 className="text-sm font-bold opacity-70 uppercase tracking-wider mb-2">What does it mean?</h3>
               <div className="grid gap-2">
                 {quizOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={handleReveal}
                      className={`p-4 rounded-xl text-sm font-medium border transition-all text-left group ${
                        isParchment ? 'bg-[#8c6239]/5 border-[#8c6239]/20 hover:bg-[#8c6239]/10 text-[#5c3d2e]' : isCosmic ? 'bg-indigo-950/40 border-indigo-500/30 hover:bg-indigo-900/60 text-indigo-200' : 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-800'
                      }`}
                    >
                       <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2">❔</span> {opt}
                    </button>
                 ))}
               </div>
               <button onClick={handleReveal} className="text-xs opacity-50 hover:underline pt-2">Skip & Reveal Meaning</button>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn max-w-lg mx-auto md:mx-0">
              <div>
                <h3 className="text-sm font-bold opacity-50 uppercase tracking-widest mb-1">Meaning</h3>
                <p className={`text-2xl font-serif font-bold ${colors.accentText}`}>
                  {dailyInfo?.meaning}
                </p>
              </div>
              
              <div className={`p-5 rounded-2xl border ${isParchment ? 'bg-white/50 border-[#d8c8b8]' : isCosmic ? 'bg-black/30 border-white/5' : 'bg-slate-50/50 border-slate-200'}`}>
                <h3 className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-2 flex items-center gap-1.5"><BookOpen className="w-3 h-3"/> Example Usage in Quran</h3>
                {dailyInfo?.isFetchingVerse ? (
                  <div className="py-4 flex flex-col items-center justify-center gap-2 opacity-60">
                     <RotateCcw className="w-4 h-4 animate-spin text-amber-500" />
                     <span className="text-[10px] font-mono uppercase tracking-widest">Generating classic example from Gemini Server...</span>
                  </div>
                ) : (
                  <>
                    <p className="font-arabic text-lg md:text-xl font-bold leading-relaxed mb-2" dir="rtl">
                      {dailyInfo?.verse?.split('(')[0]}
                    </p>
                    <p className="text-sm italic opacity-80 font-serif">
                      ({dailyInfo?.verse?.split('(')[1] || ''}
                    </p>
                  </>
                )}
              </div>
              
              {!showExplore && (
                <button 
                  onClick={() => setShowExplore(true)}
                  className={`w-full py-3.5 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    isParchment ? 'bg-[#8c6239] text-[#faf6ed] hover:bg-[#7a5431]' : isCosmic ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                  }`}
                >
                  <Layers className="w-4 h-4" /> Open Root Explorer
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Right column: Streak & Calendar Progress */}
        <div className={`md:w-64 p-6 rounded-2xl border shrink-0 flex flex-col justify-between ${isParchment ? 'bg-[#fdfbf7] border-[#e8dcc8]' : isCosmic ? 'bg-black/20 border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="text-center mb-6">
            <div className="inline-flex justify-center items-center w-12 h-12 rounded-full mb-3 bg-amber-500/10">
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="text-2xl font-bold">Day {streak}</h3>
            <p className="text-sm font-medium opacity-60 uppercase tracking-wider mt-1">Keep going!</p>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Monthly Progress</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{activeDay}/28</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }).map((_, i) => {
                const dayNum = i + 1;
                const isPast = dayNum <= activeDay;
                const isCurrent = dayNum === activeDay;
                
                let dotClass = 'w-full aspect-square rounded-full flex items-center justify-center transition-all text-transparent relative';
                if (isCurrent) {
                  dotClass += isParchment ? ' bg-[#8c6239] animate-pulse ring-2 ring-[#8c6239]/40 ring-offset-2 ring-offset-[#fdfbf7]' : isCosmic ? ' bg-indigo-400 animate-pulse ring-2 ring-indigo-400/40 ring-offset-2 ring-offset-[#1a1f3c]' : ' bg-emerald-500 animate-pulse ring-2 ring-emerald-500/40 ring-offset-2 ring-offset-white';
                } else if (isPast) {
                  dotClass += isParchment ? ' bg-[#8c6239]/80' : isCosmic ? ' bg-indigo-500/80' : ' bg-emerald-500/80';
                } else {
                  dotClass += isParchment ? ' bg-[#e8dcc8]/40' : isCosmic ? ' bg-white/5' : ' bg-slate-100';
                }
                
                return (
                  <div key={i} className={dotClass} title={`Day ${dayNum}`}>
                     {isPast && !isCurrent && <Check className="absolute inset-0 m-auto w-2.5 h-2.5 text-white/90" />}
                  </div>
                );
              })}
            </div>
          </div>
          
          {onStartQuiz && (
            <button 
              onClick={onStartQuiz}
              className={`mt-6 w-full py-2.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                isParchment ? 'bg-transparent border-[#8c6239]/30 text-[#8c6239] hover:bg-[#8c6239]/5' : isCosmic ? 'bg-transparent border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' : 'bg-transparent border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/5'
              }`}
            >
              Quiz Previous Days
            </button>
          )}
        </div>
      </div>

      {/* Embedding RootToWords for full generation and morphology forms */}
      {showExplore && hasRevealedMeaning && (
        <div className="animate-fadeIn">
          {/* We reuse the RootToWords generator directly inside the daily widget! */}
          <RootToWords 
            theme={theme}
            initialRoot={dailyRoot}
            isOfflineMode={isOfflineMode}
            onSelectWord={onSelectWord}
            progressiveReveal={true}
          />
        </div>
      )}
    </div>
  );
}
