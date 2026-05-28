import React from 'react';
import { WordAnalysis, RelatedWord, QuranicVerse, LayoutTheme } from '../types';
import { BookOpen, HelpCircle, Star, Sparkles, Languages, ChevronRight } from 'lucide-react';

interface WordDetailCardsProps {
  analysis: WordAnalysis;
  selectedNode: { type: string; id: string; data: any } | null;
  onExploreWord: (word: string) => void;
  theme: LayoutTheme;
}

export default function WordDetailCards({
  analysis,
  selectedNode,
  onExploreWord,
  theme
}: WordDetailCardsProps) {
  // If no specific node is selected, default to the search word node
  const activeType = selectedNode?.type || 'query';
  const activeData = selectedNode?.data || analysis;

  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Overall outer box theme classes
  const outerBoxClass = isParchment
    ? 'bg-[#f4ebe1] border-[#ebdcc3] text-[#2c241e] shadow-md'
    : isCosmic
      ? 'bg-slate-950/80 border-indigo-950 shadow-indigo-950/20 text-indigo-50'
      : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl';

  // Secondary subheaders
  const secondaryHeaderClass = isParchment ? 'text-[#705e52]' : 'text-slate-400';
  const paragraphClass = isParchment ? 'text-[#4d3a2a]' : 'text-slate-300';
  const innerCardBgClass = isParchment 
    ? 'bg-[#fdfbf7] border-[#ebdcc3]' 
    : isCosmic 
      ? 'bg-indigo-950/20 border-indigo-900/40' 
      : 'bg-slate-950/60 border-slate-800/85';

  return (
    <div className={`border rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-300 ${outerBoxClass}`}>
      <div>
        {/* Card Header & Concept Category Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
            isParchment
              ? 'text-[#8c6239] bg-[#ebd8c3]/40 border-[#dfd2be]'
              : isCosmic
                ? 'text-cyan-400 bg-cyan-950/60 border-cyan-900/60'
                : 'text-emerald-400 bg-emerald-950/60 border-emerald-900/60'
          }`}>
            {activeType === 'root' && 'Shared Core Root'}
            {activeType === 'query' && 'Searched Word Analysis'}
            {activeType === 'explanation' && 'Semantic Concept'}
            {activeType === 'word' && 'Derived Word Family'}
            {activeType === 'verse' && 'Quranic Verification'}
          </span>
          <span className={`text-xs font-mono opacity-60 ${isParchment ? 'text-[#705e52]' : 'text-slate-500'}`}>
            Focus Panel
          </span>
        </div>

        {/* 1. ROOT NODE DETAIL PANEL */}
        {activeType === 'root' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <div className={`text-4xl font-bold font-sans tracking-wider ${
                isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'
              }`}>
                {analysis.root}
              </div>
              <div className={`text-sm font-mono mt-1 ${secondaryHeaderClass}`}>
                Root Letters: {analysis.rootTransliteration}
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${innerCardBgClass}`}>
              <h4 className={`text-xs font-semibold uppercase tracking-wider mb-1.5 flex items-center ${
                isParchment ? 'text-[#8c6239]' : 'text-slate-300'
              }`}>
                <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${isParchment ? 'text-[#8c6239]' : 'text-emerald-400'}`} /> Core Concept Meaning
              </h4>
              <p className={`text-sm font-medium font-sans leading-relaxed ${isParchment ? 'text-[#2c241e]' : 'text-slate-200'}`}>
                {analysis.rootMeaning}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className={`text-xs font-semibold uppercase tracking-wider ${secondaryHeaderClass}`}>
                Morphology Insights
              </h4>
              <p className={`text-xs leading-relaxed ${paragraphClass}`}>
                In classical Arabic methodology (Sarf), the absolute core meaning is carried by these root letters. High-precision conjugation, verb forms (Forms I to X), and nominal derivations produce everything from commands to agents and location nouns.
              </p>
            </div>
          </div>
        )}

        {/* 2. MAIN SEARCHED WORD NODE PANEL */}
        {activeType === 'query' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-baseline justify-between">
              <div>
                <div className={`text-4xl font-bold font-sans tracking-wide ${
                  isParchment ? 'text-[#4f3824]' : isCosmic ? 'text-pink-400' : 'text-amber-400'
                }`}>
                  {analysis.wordArabic}
                </div>
                <div className={`text-xs font-mono mt-1 ${secondaryHeaderClass}`}>
                  Transliteration: <span className="font-semibold">{analysis.wordTransliteration}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-mono ${secondaryHeaderClass}`}>Form Pattern</div>
                <div className={`text-xs font-semibold px-2 py-0.5 rounded mt-1 border ${
                  isParchment
                    ? 'text-[#4f3824] bg-[#ebd8c3]/40 border-[#dfd2be]'
                    : isCosmic
                      ? 'text-pink-300 bg-pink-950/40 border-pink-900/60'
                      : 'text-amber-200 bg-amber-950/40 border-amber-900/60'
                }`}>
                  {analysis.morphologyForm}
                </div>
              </div>
            </div>

            {/* Arabic Part of Speech / Grammatical Classification Row */}
            <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
              isParchment 
                ? 'bg-[#ebd8c3]/30 border-[#dfd2be]' 
                : isCosmic 
                  ? 'bg-indigo-950/20 border-indigo-900/40' 
                  : 'bg-slate-950/70 border-slate-800'
            }`}>
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-mono font-bold uppercase ${isParchment ? 'text-[#8c6239]' : 'text-slate-400'}`}>
                  Grammar Class:
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1.5 ${
                  analysis.wordType === 'Fi\'l'
                    ? (isParchment
                        ? 'bg-amber-100 border border-amber-200 text-amber-800'
                        : 'bg-amber-950/55 border border-amber-500/30 text-amber-300')
                    : analysis.wordType === 'Ism' || !analysis.wordType
                      ? (isParchment
                          ? 'bg-emerald-100 border border-emerald-200 text-emerald-800'
                          : 'bg-emerald-950/55 border border-emerald-500/30 text-emerald-300')
                      : (isParchment
                          ? 'bg-blue-100 border border-blue-200 text-blue-800'
                          : 'bg-blue-950/55 border border-blue-500/30 text-blue-300')
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{
                    backgroundColor: (analysis.wordType === 'Fi\'l') ? '#f59e0b' : (analysis.wordType === 'Harf' ? '#3b82f6' : '#10b981')
                  }} />
                  <span className="font-semibold">{analysis.wordType || 'Ism'}</span>
                </span>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className={`text-[10px] font-mono ${isParchment ? 'text-[#705e52]' : 'text-slate-500'}`}>Linguistic Division</span>
                <span className={`text-xs font-bold ${isParchment ? 'text-[#2c241e]' : 'text-white'}`}>
                  {analysis.wordType === 'Fi\'l' && 'فِعْل (Verb / Action)'}
                  {analysis.wordType === 'Ism' && 'اِسْم (Noun / Concept)'}
                  {analysis.wordType === 'Harf' && 'حَرْف (Particle / Linker)'}
                  {!analysis.wordType && 'اِسْم (Noun / Concept)'}
                </span>
              </div>
            </div>

            <p className={`text-[11px] leading-relaxed italic ${isParchment ? 'text-[#705e52]' : 'text-slate-400'} px-1`}>
              {analysis.wordType === 'Fi\'l' && "• Classified as a Verb (فِعْل / Fa-al) because it represents an action, process, or state occurring in a past, present, or future tense-frame."}
              {analysis.wordType === 'Ism' || !analysis.wordType && "• Classified as a Noun (اِسْم) which covers names, pronouns, adjectives, descriptive terms, and concepts independent of reference time."}
              {analysis.wordType === 'Harf' && "• Classified as a Particle (حَرْف) which doesn't convey secondary standalone meaning unless coupled with nouns or verbs (such as prepositions or conjunctions)."}
            </p>

            <div className={`p-4 rounded-xl border ${innerCardBgClass}`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center ${
                isParchment ? 'text-[#4f3824]' : 'text-slate-300'
              }`}>
                <Languages className={`w-4 h-4 mr-1.5 ${isParchment ? 'text-[#8c6239]' : 'text-amber-500'}`} /> English Verse Meaning
              </h4>
              <p className={`text-sm font-semibold font-sans leading-relaxed ${
                isParchment ? 'text-[#4f3824]' : 'text-amber-100'
              }`}>
                {analysis.meaning}
              </p>
            </div>

            {/* Morphological Wazan & Pattern Card */}
            {analysis.wazan && (
              <div className={`p-4 rounded-xl border ${innerCardBgClass} space-y-2.5`}>
                <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
                  isParchment ? 'text-[#4f3824]' : 'text-slate-300'
                }`}>
                  <span className="flex items-center">
                    <Sparkles className={`w-4 h-4 mr-1.5 ${isParchment ? 'text-[#8c6239]' : 'text-amber-400'}`} /> Pattern Shape (وزن / Wazan)
                  </span>
                  <span className={`text-xl font-serif tracking-normal px-2 py-0.5 rounded bg-black/10 select-all border border-current/10 ${isParchment ? 'text-[#8c6239] bg-[#fbf9f4]' : 'text-amber-400 font-bold'}`}>
                    {analysis.wazan}
                  </span>
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-current/5 pb-2">
                  <div>
                    <span className={`block text-[9px] font-mono uppercase ${isParchment ? 'text-[#705e52]' : 'text-slate-500'}`}>Pronunciation Weight</span>
                    <span className="font-semibold text-amber-500">{analysis.wazanTransliteration}</span>
                  </div>
                  <div>
                    <span className={`block text-[9px] font-mono uppercase ${isParchment ? 'text-[#705e52]' : 'text-slate-500'}`}>Semantic Function</span>
                    <span className={`font-semibold ${isParchment ? 'text-[#2c241e]' : 'text-slate-200'}`}>{analysis.wazanMeaning}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className={`text-[9px] font-mono uppercase block ${isParchment ? 'text-[#705e52]' : 'text-slate-500'}`}>
                    How it Alters the Root Meaning:
                  </span>
                  <p className={`text-xs leading-relaxed ${isParchment ? 'text-[#4d3a2a]' : 'text-slate-300'}`}>
                    {analysis.wazanEffect}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className={`text-xs font-semibold uppercase tracking-wider ${secondaryHeaderClass}`}>
                Morphological Derivation Path
              </h4>
              <div className={`text-xs p-3 rounded-lg border leading-relaxed max-h-[140px] overflow-y-auto ${
                isParchment 
                  ? 'bg-[#fcfbf9]/60 border-[#ebdcc3] text-[#2c241e]' 
                  : 'bg-slate-950/30 border-slate-800/50 text-slate-300'
              }`}>
                {analysis.derivationExplanation}
              </div>
            </div>
          </div>
        )}

        {/* 3. ROOT EXPLANATION CONCEPT BOX */}
        {activeType === 'explanation' && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <div className={`text-2xl font-bold ${
                isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-teal-400'
              }`}>
                {analysis.rootTransliteration}
              </div>
              <div className={`text-xs font-mono mt-0.5 ${secondaryHeaderClass}`}>
                General Conceptual Backdrop
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${innerCardBgClass}`}>
              <h4 className={`text-xs font-semibold uppercase mb-1.5 ${secondaryHeaderClass}`}>Shared Base Meaning</h4>
              <p className={`text-sm font-medium ${isParchment ? 'text-[#2c241e]' : 'text-slate-200'}`}>
                {analysis.rootMeaning}
              </p>
            </div>

            <p className={`text-xs leading-relaxed ${paragraphClass}`}>
              Every word linked in this diagram inherits the central theme: <span className={`font-semibold ${
                isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-teal-400'
              }`}>"{analysis.rootMeaning}"</span>. By learning this single root, you unlock a dynamic range of 20+ Quranic words instantly, facilitating rapid memorization and contextual comprehension.
            </p>
          </div>
        )}

        {/* 4. OTHER RELATED WORDS FROM SAME ROOT */}
        {activeType === 'word' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-baseline justify-between">
              <div>
                <div className={`text-3xl font-bold ${
                  isParchment ? 'text-[#2c241e]' : isCosmic ? 'text-cyan-400' : 'text-indigo-400'
                }`}>
                  {activeData.word}
                </div>
                <div className={`text-xs font-mono mt-1 ${secondaryHeaderClass}`}>
                  Transliteration: <span className="font-semibold">{activeData.transliteration}</span>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                isParchment
                  ? 'text-[#8c6239] bg-[#dfd3c3]/40 border-[#dfd2be]'
                  : isCosmic
                    ? 'text-cyan-200 bg-cyan-950/50 border-cyan-900/60'
                    : 'text-indigo-200 bg-indigo-950/50 border-indigo-900/60'
              }`}>
                Derived Form
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${innerCardBgClass} space-y-3`}>
              <div>
                <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${secondaryHeaderClass}`}>Derived Meaning</h4>
                <p className={`text-sm font-semibold ${isParchment ? 'text-[#2c241e]' : 'text-slate-200'}`}>
                  {activeData.meaning}
                </p>
              </div>
              <div className="pt-2 border-t border-current/5">
                <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 flex items-center ${secondaryHeaderClass}`}>
                  <Sparkles className={`w-3 h-3 mr-1 ${isParchment ? 'text-[#8c6239]' : 'text-amber-500'}`} /> Morphological Pattern / Grammar
                </h4>
                <p className={`text-xs font-medium leading-relaxed ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-cyan-300' : 'text-indigo-300'}`}>
                  {activeData.morphology}
                </p>
                <p className={`text-[11px] mt-1 ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
                  This specific pattern applied to the root yields the derived meaning shown above.
                </p>
              </div>
            </div>

            {activeData.quranicExample && (
              <div className={`p-3 rounded-xl border ${
                isParchment 
                  ? 'bg-[#ebd8c3]/20 border-[#dfd2be]/80' 
                  : isCosmic 
                    ? 'bg-indigo-950/20 border-indigo-900/40' 
                    : 'bg-indigo-950/20 border-indigo-900/40'
              }`}>
                <span className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                  isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-indigo-400'
                }`}>
                  Usage Note / Example
                </span>
                <p className={`text-xs italic ${isParchment ? 'text-[#4d3a2a]' : 'text-slate-300'}`}>
                  "{activeData.quranicExample}"
                </p>
              </div>
            )}

            <button
              onClick={() => onExploreWord(activeData.word)}
              className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl border text-xs font-semibold transition-all shadow-inner group mt-2 ${
                isParchment
                  ? 'bg-[#8c6239] hover:bg-[#a67c52] border-[#8c6239] text-[#fdfbf7]'
                  : isCosmic
                    ? 'bg-slate-950 hover:bg-slate-900 border-indigo-950 hover:border-indigo-800 text-cyan-400 hover:text-cyan-300'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 hover:border-slate-700 text-teal-400 hover:text-teal-300'
              }`}
            >
              <span>Explore "{activeData.word}" Map</span>
              <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}

        {/* 5. QURANIC OCCURRENCE / VERIFICATION */}
        {activeType === 'verse' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-xl font-bold ${
                  isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-cyan-400' : 'text-sky-400'
                }`}>
                  {activeData.surah}
                </div>
                <div className={`text-xs font-mono mt-0.5 ${secondaryHeaderClass}`}>
                  Verse Coordinate: {activeData.verseNum}
                </div>
              </div>
              <div className={`flex items-center border px-2 py-0.5 rounded text-xs select-none ${
                isParchment
                  ? 'text-[#ebd8c3] bg-[#8c6239] border-[#8c6239]'
                  : isCosmic
                    ? 'text-cyan-300 bg-cyan-950/40 border-cyan-900/60'
                    : 'text-sky-300 bg-sky-950/40 border-sky-900/60'
              }`}>
                <BookOpen className="w-3.5 h-3.5 mr-1" /> Quran Ayat
              </div>
            </div>

            {/* Arabic Verse Block */}
            <div className={`p-4 rounded-xl border text-right leading-loose ${
              isParchment 
                ? 'bg-[#fcfbf9] border-[#ebdcc3]' 
                : 'bg-slate-950 border-slate-800'
            }`}>
              <p className={`text-xl font-medium tracking-wide font-sans ${isParchment ? 'text-[#2c241e]' : 'text-slate-5.0'}`} dir="rtl">
                {activeData.arabic}
              </p>
            </div>

            {/* Translation Block */}
            <div className={`p-3 rounded-lg border ${
              isParchment 
                ? 'bg-[#fdfbf7]/60 border-[#dfd2be]/80' 
                : 'bg-slate-900 border-slate-800/80'
            }`}>
              <span className={`text-[9px] uppercase tracking-wider font-mono block mb-1 ${secondaryHeaderClass}`}>
                English Translation
              </span>
              <p className={`text-xs italic leading-relaxed ${isParchment ? 'text-[#4d3a2a]' : 'text-slate-300'}`}>
                "{activeData.translation}"
              </p>
            </div>

            {/* Explanation & Memorization Trick */}
            <div className={`p-3.5 border rounded-xl space-y-1 ${
              isParchment
                ? 'bg-[#ebd8c3]/30 border-[#dfd2be]'
                : isCosmic
                  ? 'bg-indigo-950/30 border-indigo-900/40'
                  : 'bg-emerald-950/25 border-emerald-900/40'
            }`}>
              <h4 className={`text-[10px] font-bold uppercase tracking-wider flex items-center ${
                isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'
              }`}>
                <Star className={`w-3 h-3 mr-1 ${isParchment ? 'fill-[#8c6239]' : 'fill-emerald-400'}`} /> Memorization Secret & Context
              </h4>
              <p className={`text-xs leading-relaxed ${paragraphClass}`}>
                {activeData.explanation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic educational footer */}
      <div className={`mt-6 pt-4 border-t flex items-center justify-between text-[11px] ${
        isParchment 
          ? 'border-[#dfd2be] text-[#705e52]' 
          : 'border-slate-800/80 text-slate-500'
      }`}>
        <span className="flex items-center">
          <BookOpen className={`w-3.5 h-3.5 mr-1.5 ${
            isParchment ? 'text-[#8c6239]' : 'text-emerald-500'
          }`} /> Memorize Root Framework
        </span>
        <span className="font-mono text-xs">
          {analysis.rootTransliteration} Family
        </span>
      </div>
    </div>
  );
}
