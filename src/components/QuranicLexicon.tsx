import React, { useState } from 'react';
import { LayoutTheme } from '../types';
import { BookOpen, Search, ArrowRight } from 'lucide-react';
import { LEXICON_WORDS } from '../data/lexiconData';

// Deduplicate and group by letter
const GROUPED_LEXICON = LEXICON_WORDS.reduce((acc, current) => {
  if (!acc[current.letter]) acc[current.letter] = [];
  acc[current.letter].push(current);
  return acc;
}, {} as Record<string, typeof LEXICON_WORDS>);

interface QuranicLexiconProps {
  theme: LayoutTheme;
  onSearch: (word: string) => void;
}

export default function QuranicLexicon({ theme, onSearch }: QuranicLexiconProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  const cardBgClass = isParchment
    ? 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e]'
    : isCosmic
      ? 'bg-[#05060f] border-indigo-950/80 text-indigo-50'
      : 'bg-slate-900 border-slate-800 text-slate-100';

  const innerCardBgClass = isParchment
    ? 'bg-[#ebd8c3]/30 text-[#4d3a2a] border-[#dfd2be]'
    : isCosmic
      ? 'bg-indigo-950/40 border-indigo-900/60 text-indigo-200'
      : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-200';

  const filterLexicon = () => {
    if (!searchQuery) return GROUPED_LEXICON;
    const q = searchQuery.toLowerCase();
    const filtered: Record<string, typeof LEXICON_WORDS> = {};
    for (const [letter, words] of Object.entries(GROUPED_LEXICON)) {
      const matchWords = words.filter(w => 
        w.word.includes(q) || 
        w.transliteration.toLowerCase().includes(q) || 
        w.meaning.toLowerCase().includes(q)
      );
      if (matchWords.length > 0) {
        filtered[letter] = matchWords;
      }
    }
    return filtered;
  };

  const displayedGroups = filterLexicon();

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 ${cardBgClass} animate-fadeIn`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-current/10 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className={`w-5 h-5 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-pink-400' : 'text-emerald-400'}`} />
            <h2 className="text-xl font-bold tracking-tight">Offline Lexicon (Roots & Concepts)</h2>
          </div>
          <p className="text-xs mt-1 opacity-70">
            A comprehensive, offline-ready dictionary of high-frequency Quranic vocabulary segregated by the starting Huruf.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-50" />
          <input
            type="text"
            placeholder="Search word or meaning..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none border ${isParchment ? 'bg-white border-[#ebdcc3] focus:border-[#8c6239]' : 'bg-black/50 border-white/10 focus:border-white/30'}`}
          />
        </div>
      </div>

      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2" dir="rtl">
        {Object.entries(displayedGroups).map(([letter, words]) => (
          <div key={letter} className="relative">
            {/* Letter Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b backdrop-blur-md ${isParchment ? 'bg-[#fdfbf7]/90 border-[#ebdcc3]' : 'bg-[#05060f]/90 border-white/10'}`} dir="ltr">
               <span className={`text-2xl font-serif font-bold ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'}`}>
                 {letter} <span className="text-xs font-sans font-normal opacity-60 ml-2">({words.length} forms)</span>
               </span>
            </div>
            
            {/* Words Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4" dir="ltr">
              {words.map((w, idx) => (
                <button
                  key={`${w.word}-${idx}`}
                  onClick={() => onSearch(w.word)}
                  className={`text-left p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${innerCardBgClass}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm tracking-wide uppercase opacity-80">{w.transliteration}</span>
                    <span className="text-xl font-bold font-serif leading-none text-right">{w.word}</span>
                  </div>
                  <div className="text-xs opacity-80 mb-2">{w.meaning}</div>
                  <div className="flex justify-between items-center text-[10px] w-full pt-2 border-t border-current/10 mt-auto">
                     <span className="font-mono">Root: {w.root}</span>
                     <div className="flex items-center gap-1 opacity-70 hover:opacity-100 font-bold uppercase transition-opacity">
                        Analyze <ArrowRight className="w-3 h-3" />
                     </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(displayedGroups).length === 0 && (
          <div className="py-12 text-center opacity-60">No matching words found in Lexicon.</div>
        )}
      </div>
    </div>
  );
}
