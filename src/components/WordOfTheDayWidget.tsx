import React, { useState, useEffect, useRef } from 'react';
import { LayoutTheme, WordAnalysis } from '../types';
import { Sparkles, Calendar, BookOpen, Clock, Activity, History, ArrowRight, Book, Layers, RotateCcw, Check } from 'lucide-react';
import RootToWords from './RootToWords';
import { AudioPlayButton } from './AudioPlayButton';
import { appStorage } from '../lib/appStorage';

interface Props {
  theme: LayoutTheme;
  isOfflineMode: boolean;
  onSelectWord: (word: string) => void;
  onWordSeen?: (wordArabic: string, wordEnglish: string) => void;
  onStartQuiz?: () => void;
}

// 28 Roots representing each letter
const ALPHABET_ROOTS = [
  { root: "أ م ر", meaning: "To command, matter, affair", letter: "ا", words: [{ar: "أَمْر", en: "Command / Matter"}, {ar: "يَأْمُرُ", en: "He commands"}] },
  { root: "ب ر ك", meaning: "To bless, multiply", letter: "ب", words: [{ar: "بَرَكَة", en: "Blessing"}, {ar: "يُبَارِكُ", en: "He blesses"}] },
  { root: "ت و ب", meaning: "To repent, turn back", letter: "ت", words: [{ar: "تَوْبَة", en: "Repentance"}, {ar: "يَتُوبُ", en: "He repents"}] },
  { root: "ث ب ت", meaning: "To be firm, steady", letter: "ث", words: [{ar: "ثَابِت", en: "Firm / Steady"}, {ar: "يُثَبِّتُ", en: "He makes firm"}] },
  { root: "ج ع ل", meaning: "To make, place, set", letter: "ج", words: [{ar: "جَعَلَ", en: "He made"}, {ar: "يَجْعَلُ", en: "He makes"}] },
  { root: "ح م د", meaning: "To praise, commend", letter: "ح", words: [{ar: "حَمْد", en: "Praise"}, {ar: "يَحْمَدُ", en: "He praises"}] },
  { root: "خ ل ق", meaning: "To create, shape", letter: "خ", words: [{ar: "خَالِق", en: "Creator"}, {ar: "يَخْلُقُ", en: "He creates"}] },
  { root: "د ع و", meaning: "To call, invite, pray", letter: "د", words: [{ar: "دُعَاء", en: "Supplication"}, {ar: "يَدْعُو", en: "He calls/prays"}] },
  { root: "ذ ك ر", meaning: "To remember, mention", letter: "ذ", words: [{ar: "ذِكْر", en: "Remembrance"}, {ar: "يَذْكُرُ", en: "He remembers"}] },
  { root: "ر ح م", meaning: "To have mercy, compassion", letter: "ر", words: [{ar: "رَحْمَة", en: "Mercy"}, {ar: "رَحْمَٰن", en: "Entirely Merciful"}] },
  { root: "ز ك و", meaning: "To purify, grow", letter: "ز", words: [{ar: "زَكَاة", en: "Charity"}, {ar: "يُزَكِّي", en: "He purifies"}] },
  { root: "س ل م", meaning: "To be safe, submit, peace", letter: "س", words: [{ar: "سَلَام", en: "Peace"}, {ar: "إِسْلَام", en: "Submission"}] },
  { root: "ش ك ر", meaning: "To thank, be grateful", letter: "ش", words: [{ar: "شُكْر", en: "Gratitude"}, {ar: "شَاكِر", en: "Thankful"}] },
  { root: "ص ب ر", meaning: "To be patient, endure", letter: "ص", words: [{ar: "صَبْر", en: "Patience"}, {ar: "يَصْبِرُ", en: "He is patient"}] },
  { root: "ض ر ب", meaning: "To strike, travel, set forth", letter: "ض", words: [{ar: "ضَرَبَ", en: "He struck"}, {ar: "يَضْرِبُ", en: "He strikes"}] },
  { root: "ط ه ر", meaning: "To purify, cleanse", letter: "ط", words: [{ar: "طَهَارَة", en: "Purity"}, {ar: "يُطَهِّرُ", en: "He purifies"}] },
  { root: "ظ ل م", meaning: "To wrong, oppress, darkness", letter: "ظ", words: [{ar: "ظُلْم", en: "Oppression"}, {ar: "ظَالِم", en: "Oppressor"}] },
  { root: "ع ل م", meaning: "To know, learn", letter: "ع", words: [{ar: "عِلْم", en: "Knowledge"}, {ar: "عَالِم", en: "Scholar"}] },
  { root: "غ ف ر", meaning: "To forgive, cover", letter: "غ", words: [{ar: "مَغْفِرَة", en: "Forgiveness"}, {ar: "غَفُور", en: "Oft-Forgiving"}] },
  { root: "ف ع ل", meaning: "To do, act", letter: "ف", words: [{ar: "فِعْل", en: "Action/Verb"}, {ar: "فَاعِل", en: "Doer"}] },
  { root: "ق و ل", meaning: "To say, speak", letter: "ق", words: [{ar: "قَوْل", en: "Speech/Saying"}, {ar: "قَائِل", en: "Speaker"}] },
  { root: "ك ت ب", meaning: "To write, ordain", letter: "ك", words: [{ar: "كِتَاب", en: "Book/Record"}, {ar: "كَاتِب", en: "Writer"}] },
  { root: "ل ق ي", meaning: "To meet, encounter", letter: "ل", words: [{ar: "لِقَاء", en: "Meeting"}, {ar: "يَلْقَى", en: "He meets"}] },
  { root: "م ل ك", meaning: "To possess, rule", letter: "م", words: [{ar: "مَلِك", en: "King"}, {ar: "مُلْك", en: "Kingdom"}] },
  { root: "ن ص ر", meaning: "To help, give victory", letter: "ن", words: [{ar: "نَصْر", en: "Victory"}, {ar: "نَصِير", en: "Helper"}] },
  { root: "ه د ي", meaning: "To guide, direct", letter: "ه", words: [{ar: "هُدًى", en: "Guidance"}, {ar: "هَادٍ", en: "Guide"}] },
  { root: "و ج د", meaning: "To find, to exist", letter: "و", words: [{ar: "وُجُود", en: "Existence"}, {ar: "وَجَدَ", en: "He found"}] },
  { root: "ي ق ن", meaning: "To be certain, sure", letter: "ي", words: [{ar: "يَقِين", en: "Certainty"}, {ar: "مُوقِن", en: "One who is certain"}] }
];

export default function WordOfTheDayWidget({ theme, isOfflineMode, onSelectWord, onWordSeen, onStartQuiz }: Props) {
  const onWordSeenRef = useRef(onWordSeen);
  onWordSeenRef.current = onWordSeen;

  const isCosmic = theme === 'cosmic';
  const isParchment = theme === 'parchment';
  
  const activeDay = Math.min(new Date().getDate(), 28);
  const streak = activeDay > 1 ? activeDay : 1;
  const [selectedDay, setSelectedDay] = useState<number>(activeDay);

  const [dailyRoot, setDailyRoot] = useState<string>('');
  const [dailyInfo, setDailyInfo] = useState<any>(null);
  const [showExplore, setShowExplore] = useState<boolean>(false);
  
  const colors = {
    bg: isParchment ? 'bg-[#f4efe8]' : isCosmic ? 'bg-[#0f1225]' : 'bg-slate-50',
    cardLayout: isParchment ? 'bg-gradient-to-br from-[#ebd8c3] to-[#f4efe8] shadow-sm border border-[#e8dcc8]' : isCosmic ? 'bg-gradient-to-br from-indigo-900/40 to-[#1a1f3c] shadow-lg shadow-black/40 border border-white/5' : 'bg-gradient-to-br from-emerald-50 to-white shadow-xl shadow-slate-200/50 border border-slate-100',
    text: isParchment ? 'text-[#2c241e]' : isCosmic ? 'text-slate-200' : 'text-slate-800',
    accentText: isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-600',
    header: isParchment ? 'bg-gradient-to-r from-[#e8dcc8] to-[#faf6ed] border-b border-[#d8c8b8]' : isCosmic ? 'bg-gradient-to-r from-indigo-950 to-[#1a1f3c] border-b border-indigo-900/50' : 'bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100'
  };

  useEffect(() => {
    let idx = selectedDay - 1;
    if (idx < 0 || idx >= ALPHABET_ROOTS.length) {
      idx = 0;
    }
    
    const info = ALPHABET_ROOTS[idx];
    setDailyRoot(info.root);
    setDailyInfo({ ...info, verse: getExampleVerse(info.root) });
    setShowExplore(false); // reset explorer view when switching days
  }, [selectedDay]);

  const getExampleVerse = (root: string) => {
    const verses: Record<string, string> = {
      "أ م ر": "أَوْ أَمَرَ بِالتَّقْوَىٰ (Or commanded righteousness - 96:12)",
      "ب ر ك": "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ (Blessed is He in whose hand is the dominion - 67:1)",
      "ت و ب": "إِنَّهُ كَانَ تَوَّابًا (Indeed, He is ever accepting of repentance - 110:3)",
      "ث ب ت": "يُثَبِّتُ اللَّهُ الَّذِينَ آمَنُوا (Allah keeps firm those who believe - 14:27)",
      "ج ع ل": "أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا (Have We not made the earth a resting place - 78:6)",
      "ح م د": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (All praise is due to Allah, Lord of the worlds - 1:2)",
      "خ ل ق": "خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ (Created man from a clinging substance - 96:2)",
      "د ع و": "ادْعُونِي أَسْتَجِبْ لَكُمْ (Call upon Me; I will respond to you - 40:60)",
      "ذ ك ر": "فَاذْكُرُونِي أَذْكُرْكُمْ (So remember Me; I will remember you - 2:152)",
      "ر ح م": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ (In the name of Allah, the Entirely Merciful, the Especially Merciful - 1:1)",
      "ز ك و": "قَدْ أَفْلَحَ مَن زَكَّاهَا (He has succeeded who purifies it - 91:9)",
      "س ل م": "سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ (Peace it is until the emergence of dawn - 97:5)",
      "ش ك ر": "وَسَيَجْزِي اللَّهُ الشَّاكِرِينَ (And Allah will reward the grateful - 3:144)",
      "ص ب ر": "وَاصْبِرْ لِحُكْمِ رَبِّكَ (And be patient for the decision of your Lord - 52:48)",
      "ض ر ب": "ضُرِبَتْ عَلَيْهِمُ الذِّلَّةُ (Shame is pitched over them - 3:112)",
      "ط ه ر": "وَثِيَابَكَ فَطَهِّرْ (And your clothing purify - 74:4)",
      "ظ ل م": "وَمَا ظَلَمْنَاهُمْ وَلَٰكِن كَانُوا هُمُ الظَّالِمِينَ (And We did not wrong them, but it was they who were the wrongdoers - 43:76)",
      "ع ل م": "عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ (Taught man that which he knew not - 96:5)",
      "غ ف ر": "وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا (And ask forgiveness of Him; indeed, He is ever-accepting of repentance - 110:3)",
      "ف ع ل": "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ (Have you not seen how your Lord dealt - 105:1)",
      "ق و ل": "قُلْ هُوَ اللَّهُ أَحَدٌ (Say, 'He is Allah, [who is] One.' - 112:1)",
      "ك ت ب": "كِتَابٌ مَرْقُومٌ (A register inscribed - 83:9)",
      "ل ق ي": "يَا أَيُّهَا الْإِنسَانُ إِنَّكَ كَادِحٌ إِلَىٰ رَبِّكَ كَدْحًا فَمُلَاقِيهِ (O mankind, indeed you are laboring toward your Lord with exertion and will meet Him - 84:6)",
      "م ل ك": "مَالِكِ يَوْمِ الدِّينِ (Sovereign of the Day of Recompense - 1:4)",
      "ن ص ر": "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ (When the victory of Allah has come and the conquest - 110:1)",
      "ه د ي": "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (Guide us to the straight path - 1:6)",
      "و ج د": "وَوَجَدَكَ ضَالًّا فَهَدَىٰ (And He found you lost and guided - 93:7)",
      "ي ق ن": "وَبِالْآخِرَةِ هُمْ يُوقِنُونَ (And of the Hereafter they are certain - 2:4)"
    };
    return verses[root] || "Classical example unavailable for this specific root in offline mode. Load explorer for derivatives.";
  };

  // Track WOTD history
  useEffect(() => {
    if (dailyRoot) {
      const today = new Date();
      const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      try {
        const raw = appStorage.getItem('quranic_arabic_wotd_history');
        const history = raw ? JSON.parse(raw) : {};
        if (!history[dateKey] || history[dateKey] !== dailyRoot) {
          history[dateKey] = dailyRoot;
          appStorage.setItem('quranic_arabic_wotd_history', JSON.stringify(history));
        }
      } catch (e) {
        console.error("Failed to track WOTD history", e);
      }
      if (dailyInfo && onWordSeenRef.current) {
        onWordSeenRef.current(dailyInfo.root, dailyInfo.meaning);
      }
    }
  }, [dailyRoot]);

  if (!dailyRoot) return null;

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 space-y-6 ${colors.bg}`}>
      {/* Header Widget */}
      <div className={`p-8 md:p-12 rounded-3xl ${colors.cardLayout} animate-fadeIn flex flex-col md:flex-row gap-8 items-center md:items-stretch`}>
        
        {/* Left column: Root & Quiz / Breakdown */}
        <div className="flex-1 flex flex-col justify-center text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
             <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${isParchment ? 'bg-[#8c6239] text-[#faf6ed]' : isCosmic ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
               {selectedDay === activeDay ? "Word of the Day" : `Day ${selectedDay} Word`}
             </span>
             <span className={`text-sm font-bold opacity-60 ${colors.accentText}`}>
               {selectedDay === activeDay ? `Day ${activeDay} of 28` : "Archive View"}
             </span>
             {selectedDay !== activeDay && (
               <button
                 onClick={() => setSelectedDay(activeDay)}
                 className={`px-3 py-1 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                   isParchment 
                     ? 'bg-[#fdfbf7] border-[#8c6239]/40 text-[#8c6239] hover:bg-[#ebdcc3]' 
                     : isCosmic 
                       ? 'bg-indigo-950 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900' 
                       : 'bg-emerald-50 border-emerald-500/40 text-emerald-600 hover:bg-emerald-100'
                 }`}
               >
                 Back to Today
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
                {dailyInfo?.isFetchingVerse ? (
                  <div className="py-4 flex flex-col items-center justify-center gap-2 opacity-60">
                     <RotateCcw className="w-4 h-4 animate-spin text-amber-500" />
                     <span className="text-[10px] font-mono uppercase tracking-widest">Generating classic example from Gemini Server...</span>
                  </div>
                ) : (
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
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Study Archive (Click Any Day)</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{activeDay}/28 Days</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }).map((_, i) => {
                const dayNum = i + 1;
                const isPast = dayNum <= activeDay;
                const isCurrent = dayNum === activeDay;
                const isSelected = dayNum === selectedDay;
                
                let dotClass = 'w-full aspect-square rounded-full flex items-center justify-center transition-all text-[10px] font-bold relative cursor-pointer hover:scale-110';
                if (isSelected) {
                  dotClass += isParchment ? ' bg-[#8c6239] text-white ring-2 ring-[#8c6239]/40 ring-offset-2 ring-offset-[#fdfbf7]' : isCosmic ? ' bg-indigo-500 text-white ring-2 ring-indigo-400/40 ring-offset-2 ring-offset-[#1a1f3c]' : ' bg-emerald-600 text-white ring-2 ring-emerald-500/40 ring-offset-2 ring-offset-white';
                } else if (isCurrent) {
                  dotClass += isParchment ? ' bg-[#ebd8c3] text-[#8c6239] border border-[#8c6239]/30 animate-pulse' : isCosmic ? ' bg-indigo-950 text-indigo-300 border border-indigo-500/30 animate-pulse' : ' bg-emerald-50 text-emerald-600 border border-emerald-500/30 animate-pulse';
                } else if (isPast) {
                  dotClass += isParchment ? ' bg-[#f4efe8] text-[#8c6239] border border-[#ebd8c3] hover:bg-[#ebd8c3]' : isCosmic ? ' bg-slate-900 text-indigo-400 border border-indigo-950 hover:bg-slate-800' : ' bg-slate-50 text-emerald-600 border border-slate-200 hover:bg-slate-100';
                } else {
                  dotClass += isParchment ? ' bg-transparent text-[#ebd8c3]/60 border border-dashed border-[#ebdcc3] hover:border-[#8c6239]/40 hover:text-[#8c6239]' : isCosmic ? ' bg-transparent text-white/10 border border-dashed border-white/5 hover:border-indigo-800 hover:text-indigo-400' : ' bg-transparent text-slate-300 border border-dashed border-slate-200 hover:border-emerald-500 hover:text-emerald-600';
                }
                
                return (
                  <button 
                    key={i} 
                    onClick={() => setSelectedDay(dayNum)}
                    className={dotClass} 
                    title={isCurrent ? `Today: Day ${dayNum}` : `Day ${dayNum} Word`}
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
      {showExplore && (
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
