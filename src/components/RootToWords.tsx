import React, { useState, useEffect } from 'react';
import { LayoutTheme } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Layers, 
  ArrowRight, 
  GitBranch, 
  ChevronRight,
  Info,
  Calendar,
  Users,
  Grid,
  Check,
  RotateCcw
} from 'lucide-react';

interface RootToWordsProps {
  theme: LayoutTheme;
  onSelectWord: (word: string) => void;
  initialRoot?: string;
}

// Map English characters to Arabic equivalent for phonetic type support
const ENG_TO_ARA: Record<string, string> = {
  'k': 'ك', 't': 'ت', 'b': 'ب',
  'a': 'ع', 'l': 'ل', 'm': 'م',
  'x': 'خ', 'q': 'ق', 'n': 'ن',
  's': 'س', 'j': 'ج', 'd': 'د',
  'g': 'غ', 'f': 'ف', 'r': 'ر',
  'h': 'ح', 'z': 'ز', 'y': 'ي',
  'w': 'و', 'u': 'و', 'i': 'ي',
  'c': 'ص', 'p': 'ب', 'v': 'ف',
  'sh': 'ش', 'th': 'ث', 'kh': 'خ', 'dh': 'ذ', 'gh': 'غ'
};

const COGNATE_PRESETS = [
  { letters: ['ك', 'ت', 'ب'], transliteration: 'K-T-B', meaning: 'Writing & Prescribing Laws', english: 'Write' },
  { letters: ['ع', 'ل', 'م'], transliteration: 'A-L-M', meaning: 'Knowledge, Science & Signs', english: 'Know' },
  { letters: ['خ', 'ل', 'ق'], transliteration: 'Kh-L-Q', meaning: 'Creation, Smooth Splitting & Fashioning', english: 'Create' },
  { letters: ['ن', 'ص', 'ر'], transliteration: 'N-S-R', meaning: 'Aiding to Victory & Defending', english: 'Help' },
  { letters: ['س', 'ج', 'د'], transliteration: 'S-J-D', meaning: 'Submit, Bowing with Face on Earth', english: 'Submit' },
  { letters: ['غ', 'ف', 'ر'], transliteration: 'Gh-F-R', meaning: 'Forgive, Cover & Shield Errors', english: 'Forgive' },
  { letters: ['ف', 'ع', 'ل'], transliteration: 'F-A-L', meaning: 'Action, Performance & Making', english: 'Act' },
  { letters: ['ض', 'ر', 'ب'], transliteration: 'D-R-B', meaning: 'Strike, Travel & Projecting Examples', english: 'Strike' }
];

export default function RootToWords({ theme, onSelectWord, initialRoot }: RootToWordsProps) {
  const [inputWord, setInputWord] = useState('');
  const [r1, setR1] = useState('ك');
  const [r2, setR2] = useState('ت');
  const [r3, setR3] = useState('ب');

  useEffect(() => {
    if (initialRoot) {
      const cleanLetters = initialRoot.replace(/[\s\-_]/g, '').split('');
      if (cleanLetters.length >= 3) {
        setR1(cleanLetters[0]);
        setR2(cleanLetters[1]);
        setR3(cleanLetters[2]);
        setInputWord(cleanLetters.join(' '));
      }
    }
  }, [initialRoot]);
  
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Quick preset trigger
  const applyPreset = (letters: string[]) => {
    if (letters.length >= 3) {
      setR1(letters[0]);
      setR2(letters[1]);
      setR3(letters[2]);
      setInputWord(letters.join(' '));
    }
  };

  // Synchronize typing in the input field
  const handleInputChange = (val: string) => {
    setInputWord(val);
    
    // Clean vowels/symbols
    const clean = val.replace(/[َُِّْٰ\s\-_,]/g, '').toLowerCase();
    
    if (clean.length > 0) {
      // Determine if inputs are Arabic or English
      const arabicOnly = clean.replace(/[a-z]/gi, '');
      
      if (arabicOnly.length >= 3) {
        setR1(arabicOnly[0]);
        setR2(arabicOnly[1]);
        setR3(arabicOnly[2]);
      } else if (clean.length >= 3) {
        // Map English to Arabic letters sequentially
        const letters: string[] = [];
        let i = 0;
        while (i < clean.length && letters.length < 3) {
          // Check dual-char letters like sh, th, kh, dh, gh
          if (i + 1 < clean.length) {
            const di = clean.substring(i, i + 2);
            if (ENG_TO_ARA[di]) {
              letters.push(ENG_TO_ARA[di]);
              i += 2;
              continue;
            }
          }
          const si = clean[i];
          letters.push(ENG_TO_ARA[si] || 'ف');
          i++;
        }
        
        if (letters.length >= 1) setR1(letters[0]);
        if (letters.length >= 2) setR2(letters[1]);
        if (letters.length >= 3) setR3(letters[2]);
      } else {
        // Partial matches
        const letters: string[] = [];
        let i = 0;
        while (i < clean.length) {
          if (i + 1 < clean.length) {
            const di = clean.substring(i, i + 2);
            if (ENG_TO_ARA[di]) {
              letters.push(ENG_TO_ARA[di]);
              i += 2;
              continue;
            }
          }
          letters.push(clean[i]);
          i++;
        }
        
        if (letters.length >= 1) {
          const isAra = !/[a-z]/i.test(letters[0]);
          setR1(isAra ? letters[0] : (ENG_TO_ARA[letters[0]] || 'ف'));
        }
        if (letters.length >= 2) {
          const isAra = !/[a-z]/i.test(letters[1]);
          setR2(isAra ? letters[1] : (ENG_TO_ARA[letters[1]] || 'ع'));
        }
        if (letters.length >= 3) {
          const isAra = !/[a-z]/i.test(letters[2]);
          setR3(isAra ? letters[2] : (ENG_TO_ARA[letters[2]] || 'ل'));
        }
      }
    }
  };

  const resetAll = () => {
    setR1('ك');
    setR2('ت');
    setR3('ب');
    setInputWord('');
  };

  // Determine current active root transliteration details
  const getActiveKeyword = () => {
    const lettersCombined = `${r1}${r2}${r3}`;
    const presetMatch = COGNATE_PRESETS.find(p => p.letters.join('') === lettersCombined);
    return presetMatch ? presetMatch : {
      letters: [r1, r2, r3],
      transliteration: `${r1}-${r2}-${r3}`,
      meaning: 'Generic triliteral linguistic coordinate',
      english: 'Synthesize'
    };
  };

  const activeDoc = getActiveKeyword();

  // Core Word Generation Engine (based on patterns we have defined)
  // 1. TENSES (Show tenses first)
  const getTenses = () => {
    // Check known mappings for perfect vocabulary accuracy
    const wordKey = `${r1}${r2}${r3}`;
    
    // We establish the 10 verb forms with past and present tenses
    return [
      {
        id: "form1",
        label: "Form I (Basic Unconditioned)",
        pattern: "فَعَلَ / يَفْعُلُ",
        past: wordKey === "كتب" ? "كَتَبَ" : wordKey === "علم" ? "عَلِمَ" : wordKey === "خلق" ? "خَلَقَ" : wordKey === "نصر" ? "نَصَرَ" : wordKey === "سجد" ? "سجَدَ" : wordKey === "غفر" ? "غَفَرَ" : wordKey === "ضرب" ? "ضَرَبَ" : `${r1}َ${r2}َ${r3}َ`,
        present: wordKey === "كتب" ? "يَكْتُبُ" : wordKey === "علم" ? "يَعْلَمُ" : wordKey === "خلق" ? "يَخْلُقُ" : wordKey === "نصر" ? "يَنْصُرُ" : wordKey === "سجد" ? "يَسْجُدُ" : wordKey === "غفر" ? "يَغْفِرُ" : wordKey === "ضرب" ? "يَضْرِبُ" : `يَ${r1}ْ${r2}ُ${r3}ُ`,
        pastTrans: wordKey === "علم" ? "Alima" : "Fa'ala",
        presentTrans: wordKey === "علم" ? "Ya'lamu" : "Yaf'ulu",
        semantic: "Expresses the raw unconditioned core action of the root concept."
      },
      {
        id: "form2",
        label: "Form II (Intensive / Causative)",
        pattern: "فَعَّلَ / يُفَعِّلُ",
        past: wordKey === "كتب" ? "كَتَّبَ" : wordKey === "علم" ? "عَلَّمَ" : wordKey === "خلق" ? "خَلَّقَ" : wordKey === "نصر" ? "نَصَّرَ" : wordKey === "سجد" ? "سَجَّدَ" : `${r1}َ${r2}َّ${r3}َ`,
        present: wordKey === "كتب" ? "يُكَتِّبُ" : wordKey === "علم" ? "يُعَلِّمُ" : wordKey === "خلق" ? "يُخَلِّقُ" : wordKey === "نصر" ? "يُنَصِّرُ" : `يُ${r1}َ${r2}ِّ${r3}ُ`,
        pastTrans: "Fa''ala",
        presentTrans: "Yufa''ilu",
        semantic: "Intensifies action thoroughly or causes another to acquire the root's quality."
      },
      {
        id: "form3",
        label: "Form III (Reciprocal)",
        pattern: "فَاعَلَ / يُفَاعِلُ",
        past: `${r1}َا${r2}َ${r3}َ`,
        present: `يُ${r1}َا${r2}ِ${r3}ُ`,
        pastTrans: "Fā'ala",
        presentTrans: "Yufā'ilu",
        semantic: "Expresses interactive engagement, direction, or reciprocity towards an entity."
      },
      {
        id: "form4",
        label: "Form IV (Causative Agency)",
        pattern: "أَفْعَلَ / يُفْعِلُ",
        past: `أَ${r1}ْ${r2}َ${r3}َ`,
        present: `يُ${r1}ْ${r2}ِ${r3}ُ`,
        pastTrans: "Af'ala",
        presentTrans: "Yuf'ilu",
        semantic: "Acts transitively to execute or project the state onto another (e.g., Anzala)."
      },
      {
        id: "form5",
        label: "Form V (Reflexive Form II)",
        pattern: "تَفَعَّلَ / يَتَفَعَّلُ",
        past: `تَ${r1}َ${r2}َّ${r3}َ`,
        present: `يَ${r1}َ${r2}َّ${r3}ُ`,
        pastTrans: "Tafa''ala",
        presentTrans: "Yatafa''alu",
        semantic: "Represents self-directed effort, slowly internalizing or taking on the quality."
      },
      {
        id: "form6",
        label: "Form VI (Mutual)",
        pattern: "تَفَاعَلَ / يَتَفَاعَلُ",
        past: `تَ${r1}َا${r2}َ${r3}َ`,
        present: `يَ${r1}َا${r2}َ${r3}ُ`,
        pastTrans: "Tafā'ala",
        presentTrans: "Yatafā'alu",
        semantic: "Points to together-based reciprocity, simulated behavior list, or team assembly."
      },
      {
        id: "form8",
        label: "Form VIII (Earnest Attempt)",
        pattern: "اِفْتَعَلَ / يَفْتَعِلُ",
        past: `اِ${r1}ْتَ${r2}َ${r3}َ`,
        present: `يَ${r1}ْتَ${r2}ِ${r3}ُ`,
        pastTrans: "Ifta'ala",
        presentTrans: "Yafta'ilu",
        semantic: "Performing the action meticulously for personal acquisition, benefit or gain."
      },
      {
        id: "form10",
        label: "Form X (Seeking / Requestative)",
        pattern: "اِسْتَفْعَلَ / يَسْتَفْعِلُ",
        past: `اِسْتَ${r1}ْ${r2}َ${r3}َ`,
        present: `يَسْتَ${r1}ْ${r2}ِ${r3}ُ`,
        pastTrans: "Istaf'ala",
        presentTrans: "Yastaf'ilu",
        semantic: "Seeking, begging, requesting, or calling forward the root's core active state (e.g. Istaghfara)."
      }
    ];
  };

  // 2. GENDER (Show gender next)
  const getGenderForms = () => {
    return [
      {
        aspect: "Ism al-Fā'il (Active Participle / Agent of Action)",
        masculine: `${r1}َا${r2}ِ${r3}ٌ`,
        feminine: `${r1}َا${r2}ِ${r3}َةٌ`,
        mascMeaning: "The singular male executor/agent of the action",
        femMeaning: "The singular female executor/agent of the action",
        basePattern: "Fā'il (Masculine) vs Fā'ilah (Feminine)"
      },
      {
        aspect: "Ism al-Maf'ūl (Passive Participle / Object Undergoing Action)",
        masculine: `مَ${r1}ْ${r2}ُ${r3}ٌ`,
        feminine: `مَ${r1}ْ${r2}ُ${r3}َةٌ`,
        mascMeaning: "The entity receiving the action (Masculine)",
        femMeaning: "The entity receiving the action (Feminine)",
        basePattern: "Maf'ūl (Masculine) vs Maf'ūlah (Feminine)"
      },
      {
        aspect: "Ism al-Makān (Noun of coordinate Place / Time)",
        masculine: `مَ${r1}ْ${r2}َ${r3}ٌ`,
        feminine: `مَ${r1}ْ${r2}َ${r3}َةٌ`,
        mascMeaning: "Core masculine coordinate venue / local frame",
        femMeaning: "Common collective institution / container of coordinate activities (e.g. library)",
        basePattern: "Maf'al (Masculine) vs Maf'alah (Feminine)"
      },
      {
        aspect: "Sifah Mushabbahah (Constant Epithet / Continuous Attribute)",
        masculine: `${r1}َ${r2}ِي${r3}ٌ`,
        feminine: `${r1}َ${r2}ِي${r3}َةٌ`,
        mascMeaning: "One possessing an intrinsic, steady custom trait",
        femMeaning: "One possessing an intrinsic, steady custom trait (Feminine)",
        basePattern: "Fa'īl (Masculine) vs Fa'īlah (Feminine)"
      }
    ];
  };

  // 3. PLURAL / QUANTITY DEVIATION (Show singular, dual, plural last)
  const getQuantityForms = () => {
    return [
      {
        aspect: "Active Agent Paradigm (Ism al-Fā'il)",
        singular: `${r1}َا${r2}ِ${r3}ٌ`,
        dual: `${r1}َا${r2}ِ${r3}َانِ`,
        plural: `${r1}َا${r2}ِ${r3}ُونَ`,
        transliteration: "Fā'ilun ➔ Fā'ilāni ➔ Fā'ilūna",
        role: "Performers of action"
      },
      {
        aspect: "Passive Object Paradigm (Ism al-Maf'ūl)",
        singular: `مَ${r1}ْ${r2}ُ${r3}ٌ`,
        dual: `مَ${r1}ْ${r2}ُ${r3}َانِ`,
        plural: `مَ${r1}ْ${r2}ُ${r3}ُونَ`,
        transliteration: "Maf'ūlun ➔ Maf'ūlāni ➔ Maf'ūlūna",
        role: "Recipients of action"
      },
      {
        aspect: "Epithet Continuous Characteristic (Constant Epithet)",
        singular: `${r1}َ${r2}ِي${r3}ٌ`,
        dual: `${r1}َ${r2}ِي${r3}َانِ`,
        plural: `${r1}َ${r2}ِي${r3}ُونَ`,
        transliteration: "Fa'īlun ➔ Fa'īlāni ➔ Fa'īlūna",
        role: "Attributes / Adjectives"
      }
    ];
  };

  // Color classes
  const cardBgClass = isParchment
    ? 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e]'
    : isCosmic
      ? 'bg-[#05060f] border-indigo-950/80 text-indigo-50'
      : 'bg-slate-900 border-slate-800 text-slate-100';

  const innerCardBgClass = isParchment
    ? 'bg-[#ebd8c3]/20 border-[#dfd2be]/60'
    : isCosmic
      ? 'bg-indigo-950/30 border-indigo-900/40'
      : 'bg-slate-950/50 border-slate-800/60';

  const inputStyleClass = isParchment
    ? 'bg-white border-[#ebdcc3] focus:border-[#8c6239] text-[#2c241e]'
    : isCosmic
      ? 'bg-[#0f0e26] border-indigo-950 text-indigo-200 focus:border-indigo-500'
      : 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white';

  const fontColorThemeText = isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400';
  const badgeThemeBg = isParchment ? 'bg-[#dfd3c3]/40 border-[#a68c6d]/30 text-[#5c3d2e]' : isCosmic ? 'bg-indigo-950/40 border-indigo-900/30 text-indigo-300' : 'bg-emerald-950/30 border-emerald-900/40 text-emerald-300';

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 ${cardBgClass} space-y-8 animate-fadeIn`}>
      
      {/* 1. Header and Intro */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-current/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className={`w-5 h-5 ${fontColorThemeText}`} />
            <h2 className="text-xl font-bold tracking-tight">Root-to-Words Morphological Synthesizer</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Input any classical triliteral root to generate three distinct structural layers: core Verbal Tenses, Gender dualisms, and Quantities (singular, dual, sound plural) offline.
          </p>
        </div>

        <button 
          onClick={resetAll}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-all ${
            isParchment ? 'bg-[#ebd8c3]/40 hover:bg-[#ebd8c3] border-[#dfd2be]' : 'bg-white/5 hover:bg-white/10 border-current/10'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Conjugator</span>
        </button>
      </div>

      {/* 2. Interactive Input Panel and Keyboard Preset */}
      <div className={`p-5 rounded-2xl border ${innerCardBgClass} space-y-6`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          
          {/* Typable Input Field */}
          <div className="lg:col-span-4 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-90">
              <Search className="w-3.5 h-3.5 text-current/80" /> Type Root or Transliteration:
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputWord}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="e.g. k-t-b, كتب, gh-f-r, غ ف ر"
                className={`w-full font-serif text-base font-semibold rounded-xl py-3 pl-4 pr-10 focus:outline-none transition-all border ${inputStyleClass}`}
                id="root-to-words-input"
              />
              <span className="absolute right-3.5 top-3.5 text-lg font-serif opacity-40">
                {r1}{r2}{r3}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Accepts typed Arabic characters (e.g. كتب) or phonetics separated by spaces or hyphens (e.g. k t b).
            </p>
          </div>

          {/* Root Radicals Splitting Indicator Grid */}
          <div className="lg:col-span-4 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider opacity-95 block">
              Radical Consonants Vector:
            </label>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className={`p-3.5 rounded-xl border text-xl font-bold font-serif ${isParchment ? 'bg-[#ebdcd3]/40 border-[#dfd2be]' : 'bg-black/40 border-current/10'}`} title="1st Radical Letter (R1)">
                <div className="text-[9px] font-sans uppercase font-normal opacity-50 mb-0.5">R1 (Fa)</div>
                {r1}
              </div>
              <div className={`p-3.5 rounded-xl border text-xl font-bold font-serif ${isParchment ? 'bg-[#ebdcd3]/40 border-[#dfd2be]' : 'bg-black/40 border-current/10'}`} title="2nd Radical Letter (R2)">
                <div className="text-[9px] font-sans uppercase font-normal opacity-50 mb-0.5">R2 (Ayn)</div>
                {r2}
              </div>
              <div className={`p-3.5 rounded-xl border text-xl font-bold font-serif ${isParchment ? 'bg-[#ebdcd3]/40 border-[#dfd2be]' : 'bg-black/40 border-current/10'}`} title="3rd Radical Letter (R3)">
                <div className="text-[9px] font-sans uppercase font-normal opacity-50 mb-0.5">R3 (Lam)</div>
                {r3}
              </div>
            </div>
          </div>

          {/* Visual Meaning Explanation Card */}
          <div className="lg:col-span-4 rounded-xl p-3 bg-black/10 border border-current/5 space-y-1">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-500">Active Structural Root:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-serif font-black">{r1} - {r2} - {r3}</span>
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${badgeThemeBg}`}>
                {activeDoc.transliteration}
              </span>
            </div>
            <p className="text-[10px] leading-relaxed opacity-85">
              {activeDoc.meaning} — associated with '{activeDoc.english.toLowerCase()}ing' acts.
            </p>
          </div>
        </div>

        {/* Clickable Quick Classical Root Presets */}
        <div className="space-y-2 pt-2 border-t border-current/10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60">Classical Root Shortcuts:</span>
          <div className="flex flex-wrap gap-2">
            {COGNATE_PRESETS.map((preset) => (
              <button
                key={preset.transliteration}
                onClick={() => applyPreset(preset.letters)}
                type="button"
                className={`py-1.5 px-3 rounded-xl border text-xs transition-all duration-200 cursor-pointer text-left flex items-center space-x-2 space-x-reverse ${
                  r1 === preset.letters[0] && r2 === preset.letters[1] && r3 === preset.letters[2]
                    ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                    : 'bg-transparent border-current/10 hover:bg-current/5'
                }`}
              >
                <span className="font-serif font-semibold">{preset.letters.join(' ')}</span>
                <span className="font-mono text-[9px] opacity-75">({preset.transliteration})</span>
                <span className="text-[9px] font-sans opacity-85 pl-1.5 border-l border-current/25">{preset.english}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GENERATION SECTION NO 1: VERBAL TENSES & VERB FORMS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-current/5 pb-2">
          <Calendar className={`w-4 h-4 ${fontColorThemeText}`} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Layer 1: Verbal Forms & Tenses (Past / Present)
          </h3>
          <span className={`text-[9px] font-serif font-semibold rounded px-2 ${badgeThemeBg}`}>الماضي والمضارع</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getTenses().map((t) => (
            <div 
              key={t.id} 
              className={`p-4 rounded-xl border transition-all duration-200 hover:border-current/15 hover:shadow-sm ${
                isParchment ? 'bg-[#faf6ed]' : 'bg-[#0b0c16]/40'
              }`}
            >
              <div className="flex items-start justify-between gap-1.5 mb-3">
                <div>
                  <h4 className="font-bold text-xs">{t.label}</h4>
                  <code className="text-[10px] opacity-60 font-mono text-[9px]">{t.pattern}</code>
                </div>
                <span className={`text-[8.5px] font-mono uppercase bg-current/5 border border-current/10 rounded px-1.5`}>
                  {t.pastTrans}
                </span>
              </div>

              {/* Conjugated Tense Boxes */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                
                {/* Past Tense Box */}
                <div className="p-2.5 rounded-lg bg-black/10 border border-current/5 text-right relative overflow-hidden">
                  <span className="absolute left-2 top-1 text-[8px] font-mono uppercase opacity-55">Past (Madi)</span>
                  <div className="text-xl font-serif font-bold text-amber-500 mt-2 tracking-normal" dir="rtl">{t.past}</div>
                  <div className="text-[9px] font-mono text-left opacity-65">{t.pastTrans.toLowerCase()}</div>
                </div>

                {/* Present Tense Box */}
                <div className="p-2.5 rounded-lg bg-black/10 border border-current/5 text-right relative overflow-hidden">
                  <span className="absolute left-2 top-1 text-[8px] font-mono uppercase opacity-55">Present (Mudari)</span>
                  <div className="text-xl font-serif font-bold text-teal-400 mt-2 tracking-normal" dir="rtl">{t.present}</div>
                  <div className="text-[9px] font-mono text-left opacity-65">{t.presentTrans.toLowerCase()}</div>
                </div>

              </div>
              <p className="text-[10.5px] mt-2 leading-relaxed opacity-85">{t.semantic}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. GENERATION SECTION NO 2: GENDER TRANSITIONS */}
      <div className="space-y-4 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 border-b border-current/5 pb-2">
          <Users className={`w-4 h-4 ${fontColorThemeText}`} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Layer 2: Gender Dualisms (Masculine vs. Feminine Shift)
          </h3>
          <span className={`text-[9px] font-serif font-semibold rounded px-2 ${badgeThemeBg}`}>المذكر والمؤنث</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-current/10">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className={isParchment ? 'bg-[#f4efe1]/45 text-[#4f3a2b]' : 'bg-slate-950/60 text-slate-300'}>
                <th className="p-3 font-semibold">Morphological Aspect</th>
                <th className="p-3 font-semibold text-right">Masculine Model (مذكر)</th>
                <th className="p-3 font-semibold text-right">Feminine Model (مؤنث)</th>
                <th className="p-3 font-semibold">Syntactic Shift / Suffix Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {getGenderForms().map((gf, index) => (
                <tr key={index} className="hover:bg-current/5 transition-colors">
                  <td className="p-3">
                    <div className="font-semibold text-xs">{gf.aspect}</div>
                    <span className="text-[10px] font-mono opacity-65">{gf.basePattern}</span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="text-lg font-serif font-bold text-amber-500 tracking-normal" dir="rtl">{gf.masculine}</div>
                    <div className="text-[10px] opacity-75">{gf.mascMeaning}</div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="text-lg font-serif font-bold text-emerald-400 tracking-normal" dir="rtl">{gf.feminine}</div>
                    <div className="text-[10px] opacity-75">{gf.femMeaning}</div>
                  </td>
                  <td className="p-3">
                    <span className="inline-block text-[9px] font-mono bg-current/5 border border-current/10 rounded px-1.5 py-0.5 font-bold mb-1">
                      {index === 0 || index === 1 || index === 2 || index === 3 ? "Suffix-Ta Marbutah (ـة)" : "Active Ending"}
                    </span>
                    <p className="text-[10.5px] opacity-80 leading-relaxed">
                      Applying the feminine marker <strong className="font-serif text-amber-500 font-bold">ة</strong> at the end modifies the base masculine formula instantly.
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. GENERATION SECTION NO 3: QUANTITIES & NUMBERS */}
      <div className="space-y-4 pt-4 border-t border-current/10">
        <div className="flex items-center gap-2 border-b border-current/5 pb-2">
          <Grid className={`w-4 h-4 ${fontColorThemeText}`} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Layer 3: Quantity Conjugation Levels (Singular ➔ Dual ➔ Plural)
          </h3>
          <span className={`text-[9px] font-serif font-semibold rounded px-2 ${badgeThemeBg}`}>المفرد والتثنية والجمع</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {getQuantityForms().map((q, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d17]/40 border-current/15'
              }`}
            >
              <div className="mb-4">
                <h4 className="font-semibold text-xs">{q.aspect}</h4>
                <code className="text-[9.5px] text-amber-500 block mt-1 font-mono tracking-wide">{q.transliteration}</code>
              </div>

              {/* Steps Layout */}
              <div className="space-y-2.5">
                
                {/* Singular */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/10 border border-current/5">
                  <span className="text-[9px] opacity-60">Singular (مفرد)</span>
                  <span className="text-base font-serif font-bold text-slate-100 tracking-normal" dir="rtl">{q.singular}</span>
                </div>

                {/* Dual */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/10 border border-current/5">
                  <span className="text-[9px] opacity-60">Dual (+َانِ)</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono text-cyan-400">Two</span>
                    <span className="text-base font-serif font-bold text-amber-500 tracking-normal" dir="rtl">{q.dual}</span>
                  </div>
                </div>

                {/* Plural */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-indigo-950/20 border border-current/5">
                  <span className="text-[9px] opacity-60">Plural (+ُونَ)</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-mono text-emerald-400">Union</span>
                    <span className="text-base font-serif font-bold text-teal-300 tracking-normal" dir="rtl">{q.plural}</span>
                  </div>
                </div>

              </div>

              <div className="mt-4 pt-3 border-t border-current/5 text-[10px] flex items-center justify-between text-slate-400">
                <span>Role: {q.role}</span>
                <span className="font-serif font-bold text-amber-500">Mizān Ratio</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
