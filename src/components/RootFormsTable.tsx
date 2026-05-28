import React from 'react';
import { WordAnalysis, RelatedWord, LayoutTheme } from '../types';
import { Search, Sparkles, Milestone, ArrowRight, Table } from 'lucide-react';

interface RootFormsTableProps {
  analysis: WordAnalysis;
  theme: LayoutTheme;
  onExploreWord: (word: string) => void;
}

export default function RootFormsTable({
  analysis,
  theme,
  onExploreWord
}: RootFormsTableProps) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Master container background card styles
  const cardBgClass = isParchment
    ? 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e]'
    : isCosmic
      ? 'bg-[#05060f] border-indigo-950 text-indigo-50 shadow-indigo-950/20'
      : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl';

  // Sub-headers
  const textMutedClass = isParchment ? 'text-[#705e52]' : 'text-slate-400';
  const textActionClass = isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400';
  
  // Table visual classes
  const tableBorderClass = isParchment ? 'border-[#ebdcc3]' : isCosmic ? 'border-indigo-950/60' : 'border-slate-800/80';
  const thBgClass = isParchment ? 'bg-[#f4efe1]/40 text-[#4f3a2b]' : isCosmic ? 'bg-[#12132b]/55 text-indigo-200' : 'bg-slate-950/65 text-slate-300';
  const trHoverClass = isParchment ? 'hover:bg-[#ebdcd3]/20' : isCosmic ? 'hover:bg-indigo-950/25' : 'hover:bg-slate-950/45';
  const badgeClass = isParchment 
    ? 'bg-[#dfd3c3]/50 text-[#5c3d2e] border-[#a68c6d]/30'
    : isCosmic
      ? 'bg-indigo-950/40 text-cyan-300 border-indigo-900/60'
      : 'bg-emerald-950/40 text-emerald-300 border-emerald-900/60';

  // Consolidate the main analyzed word and its relatedWords into a unified table rows array
  const mainWordRow: RelatedWord = {
    word: analysis.wordArabic,
    transliteration: analysis.wordTransliteration,
    meaning: analysis.meaning,
    morphology: analysis.morphologyForm,
    quranicExample: `Primary Searched Word (Wazan: ${analysis.wazan || 'N/A'})`
  };

  // Prevent duplicate items
  const uniqueWordsMap = new Map<string, RelatedWord>();
  uniqueWordsMap.set(analysis.wordArabic.trim(), mainWordRow);

  analysis.relatedWords.forEach(rw => {
    const key = rw.word.trim();
    if (!uniqueWordsMap.has(key)) {
      uniqueWordsMap.set(key, rw);
    }
  });

  const tableRows = Array.from(uniqueWordsMap.values());

  // Helper to get step-by-step mechanical recipe instructions for structural modifications
  const fetchPatternTransformation = (row: RelatedWord) => {
    const morph = row.morphology || '';
    const isMain = row.word.trim() === analysis.wordArabic.trim();

    // Check matching patterns
    if (morph.includes('Active Participle') || morph.includes('Fā\'il') || morph.includes('Ism al-Fā\'il')) {
      return {
        formula: "[R1] + ا + [R2] + ِ + [R3]",
        explanation: "Add prolonged Alif (ا) after 1st root letter, insert Kasrah (ِ) vowel on 2nd root letter."
      };
    }
    if (morph.includes('Passive Participle') || morph.includes('Maf\'ūl') || morph.includes('Ism al-Maf\'ūl')) {
      return {
        formula: "مَ + [R1] + [R2] + و + [R3]",
        explanation: "Add prefix Meem (مَ) at start, and insert a prolonged Waw (و) before the last root letter."
      };
    }
    if (morph.includes('Form II') || morph.includes('Fa\'\'al') || morph.includes('Fa\'ela')) {
      return {
        formula: "[R1] + [R2]ّ + [R3]",
        explanation: "Double the middle (2nd) root letter by adding a Shaddah (ّ) stress accent."
      };
    }
    if (morph.includes('Form III') || morph.includes('Fā\'ala')) {
      return {
        formula: "[R1] + ا + [R2] + [R3]",
        explanation: "Insert a mutual-aspect prolonged Alif (ا) between the 1st and 2nd root letters."
      };
    }
    if (morph.includes('Form IV') || morph.includes('Af\'ala')) {
      return {
        formula: "أَ + [R1]ْ + [R2] + [R3]",
        explanation: "Add prefix causative Hamzah (أَ) at start, and freeze 1st root letter with a silent Sukun (ْ)."
      };
    }
    if (morph.includes('Form V') || morph.includes('Tafa\'\'ala')) {
      return {
        formula: "تَ + [R1] + [R2]ّ + [R3]",
        explanation: "Add prefix Ta (تَ) at start, and double the middle root letter with a Shaddah (ّ)."
      };
    }
    if (morph.includes('Form VI') || morph.includes('Tafā\'ala')) {
      return {
        formula: "تَ + [R1] + ا + [R2] + [R3]",
        explanation: "Add prefix Ta (تَ) at start, and insert Alif (ا) elongation after the 1st root letter."
      };
    }
    if (morph.includes('Form VIII') || morph.includes('Ifta\'ala')) {
      return {
        formula: "اِ + [R1]ْ + تَ + [R2] + [R3]",
        explanation: "Add silent Alif (اِ) at start, silence 1st root letter, insert a reflexive Ta (تَ) infix before 2nd root."
      };
    }
    if (morph.includes('Form X') || morph.includes('Istaf\'ala')) {
      return {
        formula: "اِسْتَ + [R1]ْ + [R2] + [R3]",
        explanation: "Add prefix Alif-Seen-Ta (اِسْتَ) at start, and freeze 1st root letter with a Sukun (ْ)."
      };
    }
    if (morph.includes('Place') || morph.includes('Location') || morph.includes('Maf\'al')) {
      return {
        formula: "مَ + [R1]ْ + [R2] + [R3]",
        explanation: "Add spatial prefix Meem (مَ) at start, silence 1st root letter with a Sukun (ْ)."
      };
    }
    if (morph.includes('Instrument') || morph.includes('Mif\'āl')) {
      return {
        formula: "مِ + [R1]ْ + [R2] + ا + [R3]",
        explanation: "Add prefix Meem with kasrah (مِ) at start, and insert Alif (ا) before the final root letter."
      };
    }
    if (morph.includes('Hyperbolic') || morph.includes('Fa\'\'āl')) {
      return {
        formula: "[R1] + [R2]ّ + ا + [R3]",
        explanation: "Double the 2nd root letter with Shaddah (ّ) and add Alif (ا) before the final root."
      };
    }

    // Default primary analysis parsing fallback
    if (isMain && analysis.wazan) {
      return {
        formula: `${analysis.wazan} (${analysis.wazanTransliteration || 'N/A'})`,
        explanation: analysis.wazanEffect || "Vowelling weights assigned to R1, R2, or R3 consonants."
      };
    }

    return {
      formula: "[R1] + [R2] + [R3]",
      explanation: "Standard triliteral root vowelling mapping with basic thematic indicators."
    };
  };

  // Helper to extract a friendly "Pattern Use" text
  const fetchPatternNameText = (row: RelatedWord) => {
    // If it's the primary query, load its direct wazan properties
    if (row.word === analysis.wordArabic && analysis.wazan) {
      return `${analysis.wazan} (${analysis.wazanTransliteration || 'N/A'})`;
    }

    // Otherwise, check if morphology contains any indicative terms or try fuzzy matching
    const morph = row.morphology || '';
    
    // Attempt parsing patterns (e.g. "Form II Verb", "Active Participle")
    if (morph.includes('Active Participle') || morph.includes('Fā\'il') || morph.includes('Ism al-Fā\'il')) {
      return 'فَاعِل (Fā\'il)';
    }
    if (morph.includes('Passive Participle') || morph.includes('Maf\'ūl') || morph.includes('Ism al-Maf\'ūl')) {
      return 'مَفْعُول (Maf\'ūl)';
    }
    if (morph.includes('Form II') || morph.includes('Fa\'\'al') || morph.includes('Fa\'ela')) {
      return 'فَعَّلَ (Fa\'\'ala)';
    }
    if (morph.includes('Form III') || morph.includes('Fā\'ala')) {
      return 'فَاعَلَ (Fā\'ala)';
    }
    if (morph.includes('Form IV') || morph.includes('Af\'ala')) {
      return 'أَفْعَلَ (Af\'ala)';
    }
    if (morph.includes('Form V') || morph.includes('Tafa\'\'ala')) {
      return 'تَفَعَّلَ (Tafa\'\'ala)';
    }
    if (morph.includes('Form VI') || morph.includes('Tafā\'ala')) {
      return 'تَفَاعَلَ (Tafā\'ala)';
    }
    if (morph.includes('Form VIII') || morph.includes('Ifta\'ala')) {
      return 'اِفْتَعَلَ (Ifta\'ala)';
    }
    if (morph.includes('Form X') || morph.includes('Istaf\'ala')) {
      return 'اِسْتَفْعَلَ (Istaf\'ala)';
    }
    if (morph.includes('Place') || morph.includes('Location') || morph.includes('Maf\'al')) {
      return 'مَفْعَل (Maf\'al)';
    }
    if (morph.includes('Instrument') || morph.includes('Mif\'āl')) {
      return 'مِفْعَال (Mif\'āl)';
    }
    if (morph.includes('Hyperbolic') || morph.includes('Fa\'\'āl')) {
      return 'فَعَّال (Fa\'\'āl)';
    }

    // Default to displaying high level morphology
    return row.morphology.split(' / ')[0].split(' Verb')[0];
  };

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 ${cardBgClass}`}>
      
      {/* Table Title Banner Section */}
      <div className="flex items-center justify-between border-b pb-4 mb-5 border-current/10">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl bg-current/5 border border-current/10 ${textActionClass}`}>
            <Table className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight uppercase flex items-center gap-1.5">
              Root Derivatives & Structural Conjugations Table
            </h3>
            <p className={`text-xs mt-0.5 ${textMutedClass}`}>
              Unified view of primary word forms generated from the root <strong className="font-mono px-1 rounded bg-current/5">{analysis.root}</strong> ({analysis.rootTransliteration}).
            </p>
          </div>
        </div>

        <div className={`hidden sm:flex text-[10px] font-mono font-semibold px-2.5 py-1 rounded-xl border ${badgeClass} uppercase scale-95`}>
          {tableRows.length} Total Registered Forms
        </div>
      </div>

      {/* Main Responsive Table Container */}
      <div className="overflow-x-auto rounded-xl border border-current/10">
        <table className="w-full text-left font-sans text-xs border-collapse">
          <thead>
            <tr className="border-b border-current/10">
              <th className={`p-3 font-semibold ${thBgClass}`}>Word Pattern (Arabic)</th>
              <th className={`p-3 font-semibold ${thBgClass}`}>Transliteration</th>
              <th className={`p-3 font-semibold ${thBgClass}`}>English Meaning</th>
              <th className={`p-3 font-semibold ${thBgClass}`}>Grammatical Form / Wazan Pattern</th>
              <th className={`p-3 font-semibold ${thBgClass}`}>Pattern Action (Structure Changes)</th>
              <th className={`p-3 font-semibold ${thBgClass}`}>Action</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-current/5">
            {tableRows.map((row) => {
              const isMainWord = row.word.trim() === analysis.wordArabic.trim();
              const patternUsed = fetchPatternNameText(row);

              return (
                <tr 
                  key={row.word} 
                  className={`transition-all duration-150 ${trHoverClass} ${
                    isMainWord 
                      ? (isParchment ? 'bg-[#dfd3c3]/15' : isCosmic ? 'bg-[#ff007f]/5' : 'bg-[#10b981]/5') 
                      : ''
                  }`}
                >
                  {/* WORD ARABIC */}
                  <td className="p-3 font-bold">
                    <div className="flex items-center space-x-2 space-x-reverse justify-end md:justify-start">
                      <span className="text-lg font-serif tracking-normal font-bold" dir="rtl">
                        {row.word}
                      </span>
                      {isMainWord && (
                        <span className={`text-[8.5px] scale-90 font-mono font-semibold px-1.5 py-0.2 rounded border uppercase leading-none ${
                          isParchment 
                            ? 'bg-[#8c6239] text-white border-[#ebdcc3]' 
                            : isCosmic 
                              ? 'bg-pink-950/70 text-pink-300 border-pink-900/60' 
                              : 'bg-emerald-950/70 text-emerald-300 border-emerald-900/60'
                        }`}>
                          Searched
                        </span>
                      )}
                    </div>
                  </td>

                  {/* TRANSLITERATION */}
                  <td className="p-3 font-mono font-medium opacity-85">
                    {row.transliteration}
                  </td>

                  {/* ENGLISH TRANSLATION */}
                  <td className="p-3 font-medium">
                    <span className="leading-snug block">
                      {row.meaning}
                    </span>
                  </td>

                  {/* WAZAN PATTERN USED */}
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className={`font-semibold ${
                        isMainWord 
                          ? (isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-pink-400' : 'text-emerald-400') 
                          : textActionClass
                      }`}>
                        {patternUsed}
                      </span>
                      <span className="text-[10px] opacity-60 mt-0.5 max-w-[240px] truncate" title={row.morphology}>
                        {row.morphology}
                      </span>
                    </div>
                  </td>

                  {/* PATTERN ACTION (STRUCTURE CHANGES) */}
                  <td className="p-3">
                    {(() => {
                      const recipe = fetchPatternTransformation(row);
                      return (
                        <div className="space-y-1 max-w-[280px]">
                          <span className={`inline-block font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded leading-none ${
                            isParchment 
                              ? 'bg-[#dfd3c3]/40 text-[#5c3d2e] border border-[#a68c6d]/20' 
                              : isCosmic 
                                ? 'bg-indigo-950/60 text-cyan-300 border border-indigo-900/40' 
                                : 'bg-slate-950 text-emerald-300 border border-slate-800'
                          }`}>
                            {recipe.formula}
                          </span>
                          <p className={`text-[11px] leading-relaxed block ${isParchment ? 'text-[#4d3a2a]' : 'text-slate-300'}`}>
                            {recipe.explanation}
                          </p>
                        </div>
                      );
                    })()}
                  </td>

                  {/* ACTION HOOK */}
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => onExploreWord(row.word)}
                      className={`inline-flex items-center space-x-1.5 space-x-reverse px-2.5 py-1 rounded-lg border font-semibold text-[11px] transition-all cursor-pointer ${
                        isParchment
                          ? 'border-[#ebdcc3] bg-[#fdfbf7] hover:bg-[#8c6239] hover:text-white text-[#8c6239]'
                          : isCosmic
                            ? 'border-indigo-950 bg-black/40 text-cyan-400 hover:bg-indigo-600 hover:text-white'
                            : 'border-slate-800 bg-slate-950/60 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                      }`}
                      title={`Regenerate interactive map and detail specs for "${row.word}"`}
                    >
                      <span>Explore</span>
                      <Search className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Explanation tip text block */}
      <div className="mt-4 flex items-start space-x-1.5 space-x-reverse opacity-75">
        <span className="text-xs">💡</span>
        <p className="text-[10px] leading-relaxed">
          <strong>Linguistic Tip:</strong> The words shown here reside within the exact same root family tree. In Quranic Arabic semantics, although their grammatical patterns (Auzan) shift their syntactic roles (e.g. converting a verb into an active agent noun), they all branch from and keep the primary root's core lexical purpose.
        </p>
      </div>

    </div>
  );
}
