import React, { useState, useEffect, useRef } from 'react';
import { LayoutTheme } from '../types';
import { Sparkles, Calendar, BookOpen, Clock, Activity, History, ArrowRight, Book, Layers, RotateCcw, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import RootToWords from './RootToWords';
import { AudioPlayButton } from './AudioPlayButton';
import { appStorage } from '../lib/appStorage';
import { EXPANDED_ROOTS, ExpandedRoot } from '../data/expandedRoots';

interface Props {
  theme: LayoutTheme;
  isOfflineMode: boolean;
  onSelectWord: (word: string) => void;
  onWordSeen?: (wordArabic: string, wordEnglish: string) => void;
  onStartQuiz?: () => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export default function WordOfTheDayWidget({ theme, isOfflineMode, onSelectWord, onWordSeen, onStartQuiz }: Props) {
  const onWordSeenRef = useRef(onWordSeen);
  onWordSeenRef.current = onWordSeen;

  const isCosmic = theme === 'cosmic';
  const isParchment = theme === 'parchment';
  
  const today = new Date();
  
  // Track currently viewed month/year in the calendar
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed
  
  // Track selected date
  const [selectedDate, setSelectedDate] = useState<{year: number, month: number, day: number}>(() => {
    return { year: today.getFullYear(), month: today.getMonth(), day: today.getDate() };
  });

  const [dailyRoot, setDailyRoot] = useState<string>('');
  const [dailyInfo, setDailyInfo] = useState<ExpandedRoot | null>(null);
  const [showExplore, setShowExplore] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(1);
  
  const colors = {
    bg: isParchment ? 'bg-[#f4efe8]' : isCosmic ? 'bg-[#0f1225]' : 'bg-slate-50',
    cardLayout: isParchment ? 'bg-gradient-to-br from-[#ebd8c3] to-[#f4efe8] shadow-sm border border-[#e8dcc8]' : isCosmic ? 'bg-gradient-to-br from-indigo-900/40 to-[#1a1f3c] shadow-lg shadow-black/40 border border-white/5' : 'bg-gradient-to-br from-emerald-50 to-white shadow-xl shadow-slate-200/50 border border-slate-100',
    text: isParchment ? 'text-[#2c241e]' : isCosmic ? 'text-slate-200' : 'text-slate-800',
    accentText: isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-600',
    header: isParchment ? 'bg-gradient-to-r from-[#e8dcc8] to-[#faf6ed] border-b border-[#d8c8b8]' : isCosmic ? 'bg-gradient-to-r from-indigo-950 to-[#1a1f3c] border-b border-indigo-900/50' : 'bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100'
  };

  // Helper to determine the deterministic root for any given date
  const getRootForDate = (year: number, month: number, day: number): ExpandedRoot => {
    const start = new Date(2026, 0, 1); // fixed start date: Jan 1, 2026
    const date = new Date(year, month, day);
    const diffTime = date.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Use a deterministic scramble / hash to mix up the order beautifully
    // so consecutive days don't just follow the alphabet strictly but are shuffled
    const seed = Math.max(0, diffDays);
    const hash = (seed * 9301 + 49297) % 233280;
    const idx = hash % EXPANDED_ROOTS.length;
    return EXPANDED_ROOTS[idx];
  };

  // Helper to calculate the true consecutive streak from history
  const calculateStreak = (historyObj: Record<string, string>) => {
    try {
      let currentStreak = 0;
      const checkDate = new Date();
      
      // Check if today has been visited
      let hasToday = false;
      const todayKey = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
      if (historyObj[todayKey]) {
        hasToday = true;
      }
      
      if (!hasToday) {
        // start checking from yesterday
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      while (true) {
        const key = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
        if (historyObj[key]) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      return hasToday ? currentStreak : Math.max(1, currentStreak);
    } catch (e) {
      return 1;
    }
  };

  // Load the root for selected date
  useEffect(() => {
    const info = getRootForDate(selectedDate.year, selectedDate.month, selectedDate.day);
    setDailyRoot(info.root);
    setDailyInfo(info);
    setShowExplore(false); // reset explorer view when switching days
  }, [selectedDate]);

  // Track WOTD history and update streak
  useEffect(() => {
    if (dailyRoot) {
      const key = `${selectedDate.year}-${selectedDate.month + 1}-${selectedDate.day}`;
      try {
        const raw = appStorage.getItem('quranic_arabic_wotd_history');
        const history = raw ? JSON.parse(raw) : {};
        if (!history[key] || history[key] !== dailyRoot) {
          history[key] = dailyRoot;
          appStorage.setItem('quranic_arabic_wotd_history', JSON.stringify(history));
        }
        
        // Recalculate streak
        const currentStreak = calculateStreak(history);
        setStreak(currentStreak);
      } catch (e) {
        console.error("Failed to track WOTD history", e);
      }
      
      if (dailyInfo && onWordSeenRef.current) {
        onWordSeenRef.current(dailyInfo.root, dailyInfo.meaning);
      }
    }
  }, [dailyRoot, selectedDate]);

  const isSelectedToday = selectedDate.year === today.getFullYear() && 
                          selectedDate.month === today.getMonth() && 
                          selectedDate.day === today.getDate();

  const handleBackToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate({ year: today.getFullYear(), month: today.getMonth(), day: today.getDate() });
  };

  if (!dailyRoot) return null;

  // Calendar calculations
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 space-y-6 ${colors.bg}`}>
      {/* Header Widget */}
      <div className={`p-8 md:p-12 rounded-3xl ${colors.cardLayout} animate-fadeIn flex flex-col md:flex-row gap-8 items-center md:items-stretch`}>
        
        {/* Left column: Root & Quiz / Breakdown */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
             <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${isParchment ? 'bg-[#8c6239] text-[#faf6ed]' : isCosmic ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
               {isSelectedToday ? "Word of the Day" : `Archive Word`}
             </span>
             <span className={`text-xs font-bold opacity-60 font-mono ${colors.accentText}`}>
               {selectedDate.day} {MONTH_NAMES[selectedDate.month]} {selectedDate.year}
             </span>
             {!isSelectedToday && (
               <button
                 onClick={handleBackToToday}
                 className={`px-3 py-1 text-xs font-bold rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
                   isParchment 
                     ? 'bg-white border-[#8c6239]/40 text-[#8c6239] hover:bg-[#ebdcc3]' 
                     : isCosmic 
                       ? 'bg-indigo-950 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900' 
                       : 'bg-emerald-50 border-emerald-500/40 text-emerald-600 hover:bg-emerald-100'
                 }`}
               >
                 <RotateCcw className="w-3 h-3" /> Back to Today
               </button>
             )}
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

          <div className="space-y-6 animate-fadeIn max-w-lg mx-auto md:mx-0">
              <div>
                <h3 className="text-sm font-bold opacity-50 uppercase tracking-widest mb-1">Root Meaning</h3>
                <p className={`text-2xl font-serif font-bold ${colors.accentText}`}>
                  {dailyInfo?.meaning}
                </p>
              </div>

              {dailyInfo?.words && dailyInfo.words.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                     <BookOpen className="w-3 h-3"/> Derived Words
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {dailyInfo.words.map((w: any, idx: number) => (
                      <div key={idx} className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${isParchment ? 'bg-white/40 border-[#d8c8b8]' : isCosmic ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                         <span className="text-2xl font-arabic font-bold text-amber-500" dir="rtl">{w.ar}</span>
                         <span className="text-[10px] font-mono mt-1 opacity-70 whitespace-nowrap">{w.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={`p-5 rounded-2xl border ${isParchment ? 'bg-white/50 border-[#d8c8b8]' : isCosmic ? 'bg-black/30 border-white/5' : 'bg-slate-50/50 border-slate-200'}`}>
                <h3 className="text-[10px] font-bold opacity-50 uppercase tracking-widest mb-2 flex items-center gap-1.5"><BookOpen className="w-3 h-3"/> Example Usage in Quran</h3>
                <div className="relative">
                  <div className="absolute top-0 right-0">
                     <AudioPlayButton text={dailyInfo?.verse?.split('(')[0] || ''} isParchment={isParchment} />
                  </div>
                  <p className="font-arabic text-lg md:text-xl font-bold leading-relaxed mb-2 mt-6" dir="rtl">
                    {dailyInfo?.verse?.split('(')[0]}
                  </p>
                  <p className="text-sm italic opacity-80 font-serif">
                    ({dailyInfo?.verse?.split('(')[1] || ''}
                  </p>
                </div>
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
        </div>
        
        {/* Right column: Streak & Calendar Progress */}
        <div className={`md:w-64 p-6 rounded-2xl border shrink-0 flex flex-col justify-between ${isParchment ? 'bg-[#fdfbf7] border-[#e8dcc8]' : isCosmic ? 'bg-black/20 border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="text-center mb-6">
            <div className="inline-flex justify-center items-center w-12 h-12 rounded-full mb-3 bg-amber-500/10">
              <span className="text-2xl">🔥</span>
            </div>
            <h3 className="text-2xl font-bold">Streak: {streak} Day{streak !== 1 ? 's' : ''}</h3>
            <p className="text-sm font-medium opacity-60 uppercase tracking-wider mt-1">Keep learning daily!</p>
          </div>
          
          <div className="space-y-4">
            {/* Header / Month Selection */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isParchment 
                    ? 'border-[#ebd8c3] text-[#8c6239] hover:bg-[#ebdcc3]' 
                    : isCosmic 
                      ? 'border-white/10 text-indigo-300 hover:bg-white/5' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold font-mono">
                {MONTH_NAMES[currentMonth].substring(0, 3)} {currentYear}
              </span>
              <button
                onClick={() => {
                  if (currentYear > today.getFullYear() || (currentYear === today.getFullYear() && currentMonth >= today.getMonth())) {
                    return; // disabled
                  }
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
                disabled={currentYear === today.getFullYear() && currentMonth === today.getMonth()}
                className={`p-1.5 rounded-lg border transition-all ${
                  currentYear === today.getFullYear() && currentMonth === today.getMonth()
                    ? 'opacity-25 cursor-not-allowed'
                    : 'cursor-pointer'
                } ${
                  isParchment 
                    ? 'border-[#ebd8c3] text-[#8c6239] hover:bg-[#ebdcc3]' 
                    : isCosmic 
                      ? 'border-white/10 text-indigo-300 hover:bg-white/5' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-mono opacity-50 uppercase font-bold">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Padding for first day of week */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="w-full aspect-square" />
              ))}
              
              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const isFuture = (currentYear > today.getFullYear()) || 
                                 (currentYear === today.getFullYear() && currentMonth > today.getMonth()) || 
                                 (currentYear === today.getFullYear() && currentMonth === today.getMonth() && dayNum > today.getDate());
                
                const isSelected = selectedDate.year === currentYear && 
                                   selectedDate.month === currentMonth && 
                                   selectedDate.day === dayNum;
                
                const isCurrentToday = today.getFullYear() === currentYear && 
                                       today.getMonth() === currentMonth && 
                                       today.getDate() === dayNum;
                
                let dotClass = 'w-full aspect-square rounded-full flex items-center justify-center transition-all text-[10px] font-bold relative cursor-pointer hover:scale-110';
                if (isSelected) {
                  dotClass += isParchment ? ' bg-[#8c6239] text-white ring-2 ring-[#8c6239]/40 ring-offset-2 ring-offset-[#fdfbf7]' : isCosmic ? ' bg-indigo-500 text-white ring-2 ring-indigo-400/40 ring-offset-2 ring-offset-[#1a1f3c]' : ' bg-emerald-600 text-white ring-2 ring-emerald-500/40 ring-offset-2 ring-offset-white';
                } else if (isCurrentToday) {
                  dotClass += isParchment ? ' bg-[#ebd8c3] text-[#8c6239] border border-[#8c6239]/30 animate-pulse' : isCosmic ? ' bg-indigo-950 text-indigo-300 border border-indigo-500/30 animate-pulse' : ' bg-emerald-50 text-emerald-600 border border-emerald-500/30 animate-pulse';
                } else if (!isFuture) {
                  dotClass += isParchment ? ' bg-[#f4efe8] text-[#8c6239] border border-[#ebd8c3] hover:bg-[#ebdcc3]' : isCosmic ? ' bg-slate-900 text-indigo-400 border border-indigo-950 hover:bg-slate-800' : ' bg-slate-50 text-emerald-600 border border-slate-200 hover:bg-slate-100';
                } else {
                  dotClass += ' opacity-20 cursor-not-allowed text-slate-400 border border-dashed border-slate-300';
                }
                
                return (
                  <button 
                    key={dayNum} 
                    disabled={isFuture}
                    onClick={() => {
                      setSelectedDate({ year: currentYear, month: currentMonth, day: dayNum });
                    }}
                    className={dotClass} 
                    title={isCurrentToday ? `Today` : `${MONTH_NAMES[currentMonth]} ${dayNum}, ${currentYear}`}
                  >
                     <span>{dayNum}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {onStartQuiz && (
            <button 
              onClick={onStartQuiz}
              className={`mt-6 w-full py-2.5 rounded-xl border text-xs font-bold transition-all shadow-sm cursor-pointer ${
                isParchment ? 'bg-transparent border-[#8c6239]/30 text-[#8c6239] hover:bg-[#8c6239]/5' : isCosmic ? 'bg-transparent border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10' : 'bg-transparent border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/5'
              }`}
            >
              Quiz Previous Days
            </button>
          )}
        </div>
      </div>

      {/* Embedding RootToWords for full generation and morphology forms */}
      {showExplore && (
        <div className="animate-fadeIn">
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
