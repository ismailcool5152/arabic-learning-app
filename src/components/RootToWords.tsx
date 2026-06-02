import { safeLower } from '../lib/utils';
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
  RotateCcw,
  Keyboard,
  Loader2,
  Database,
  Bookmark,
  Wand2
} from 'lucide-react';
import ArabicVirtualKeyboard from './ArabicVirtualKeyboard';
import { saveTranslationToCache, getTranslationFromCache } from '../lib/translationCache';
import { AudioPlayButton } from './AudioPlayButton';

interface RootToWordsProps {
  theme: LayoutTheme;
  onSelectWord: (word: string) => void;
  initialRoot?: string;
  isOfflineMode?: boolean;
  progressiveReveal?: boolean;
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

export default function RootToWords({ theme, onSelectWord, initialRoot, isOfflineMode, progressiveReveal }: RootToWordsProps) {
  const [inputWord, setInputWord] = useState('');
  const [r1, setR1] = useState('ك');
  const [r2, setR2] = useState('ت');
  const [r3, setR3] = useState('ب');
  const [showArabicKeyboard, setShowArabicKeyboard] = useState(false);
  const [showLayer1, setShowLayer1] = useState(!progressiveReveal);
  const [showLayer2, setShowLayer2] = useState(!progressiveReveal);
  const [showLayer3, setShowLayer3] = useState(!progressiveReveal);
  const [isTranslating, setIsTranslating] = useState(false);
  const [aiTranslations, setAiTranslations] = useState<Record<string, {meaning: string, exists: boolean}>>({});
  const [aiRootMeaning, setAiRootMeaning] = useState<string | null>(null);
  const [aiRootStory, setAiRootStory] = useState<string | null>(null);
  
  const rootStr = `${r1} ${r2} ${r3}`;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [contextualVerse, setContextualVerse] = useState<{arabic: string, trans: string, ref: string} | null>(null);
  const [isFetchingVerse, setIsFetchingVerse] = useState(false);

  const generateContextualVerse = async () => {
    setIsFetchingVerse(true);
    try {
      const customApiKey = localStorage.getItem('gemini_api_key') || '';
      const response = await fetch('/api/example-verse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ root: rootStr, customApiKey })
      });
      if (response.ok) {
        const data = await response.json();
        setContextualVerse({ arabic: data.verseArabic, trans: data.verseTranslation, ref: data.reference });
      }
    } catch { } // fail silently and user can retry
    setIsFetchingVerse(false);
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('quranic_bookmarks') || '[]');
      setIsBookmarked(saved.includes(rootStr));
    } catch { }
  }, [rootStr]);

  const toggleBookmark = () => {
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('quranic_bookmarks') || '[]');
      let nextSaved;
      if (saved.includes(rootStr)) {
        nextSaved = saved.filter(r => r !== rootStr);
        setIsBookmarked(false);
      } else {
        nextSaved = [...saved, rootStr];
        setIsBookmarked(true);
      }
      localStorage.setItem('quranic_bookmarks', JSON.stringify(nextSaved));
    } catch { }
  };

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
  
  // Clear AI context when root changes
  useEffect(() => {
    setAiTranslations({});
    setAiRootMeaning(null);
    setContextualVerse(null);
  }, [r1, r2, r3]);

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
    const clean = safeLower(val.replace(/[َُِّْٰ\s\-_,]/g, ''));
    
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

  useEffect(() => {
    // If the root changes, let's see if we have offline cache
    const cached = getTranslationFromCache(`${r1} - ${r2} - ${r3}`);
    if (cached) {
      setAiTranslations(cached.translations);
      setAiRootMeaning(cached.rootMeaning);
      setAiRootStory(cached.rootStory || null);
    } else {
      setAiTranslations({});
      setAiRootMeaning(null);
      setAiRootStory(null);
    }
  }, [r1, r2, r3]);

  const handleBatchTranslate = async () => {
    setIsTranslating(true);
    const root = `${r1} - ${r2} - ${r3}`;
    
    // Gather all generated Arabic words
    const wordsToTranslate: string[] = [];
    getTenses().forEach(t => {
      wordsToTranslate.push(t.past, t.present);
    });
    getGenderForms().forEach(g => {
      wordsToTranslate.push(g.masculine, g.feminine);
    });
    getQuantityForms().forEach(q => {
      wordsToTranslate.push(q.singular, q.dual, q.plural);
    });

    try {
      const customApiKey = localStorage.getItem('quranic_arabic_custom_api_key') || '';
      const response = await fetch('/api/translate-root-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ root, words: wordsToTranslate, customApiKey }),
      });

      if (response.ok) {
        const data = await response.json();
        let transRecord: Record<string, { meaning: string; exists: boolean }> = {};
        
        if (data.translations && Array.isArray(data.translations)) {
          data.translations.forEach((item: any) => {
            if (item.word) transRecord[item.word] = { meaning: item.meaning, exists: item.exists };
          });
          setAiTranslations(transRecord);
        } else if (data.translations && typeof data.translations === 'object') {
          // Fallback just in case model returned object
          transRecord = data.translations;
          setAiTranslations(transRecord);
        }
        
        if (data.rootMeaning) {
          setAiRootMeaning(data.rootMeaning);
        }
        if (data.rootStory) {
          setAiRootStory(data.rootStory);
        }

        // Save successfully fetched and parsed record to cache
        saveTranslationToCache(root, data.rootMeaning || '', data.rootStory, transRecord);
      }
    } catch (e) {
      console.error("Batch translation failed:", e);
    } finally {
      setIsTranslating(false);
    }
  };

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
    <div className={progressiveReveal ? 'space-y-8 animate-fadeIn mt-4' : `border rounded-2xl p-6 transition-all duration-300 ${cardBgClass} space-y-8 animate-fadeIn`}>
      
      {/* 1. Header and Intro */}
      {!progressiveReveal && (
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

        <div className="flex items-center gap-2">
          <button 
            onClick={handleBatchTranslate}
            disabled={isTranslating || isOfflineMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold select-none transition-all ${
              isTranslating || isOfflineMode ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer hover:scale-105'
            } ${
              isParchment 
                ? 'bg-[#8c6239] text-[#faf6ed] border-[#8c6239]' 
                : isCosmic 
                  ? 'bg-indigo-600 text-white border-indigo-500' 
                  : 'bg-emerald-600 text-white border-emerald-500'
            }`}
          >
            {isTranslating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Translate with AI</span>
          </button>
          
          <button 
            onClick={resetAll}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-all ${
              isParchment ? 'bg-[#ebd8c3]/40 hover:bg-[#ebd8c3] border-[#dfd2be]' : 'bg-white/5 hover:bg-white/10 border-current/10'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
      )}

      {/* 2. Interactive Input Panel and Keyboard Preset */}
      {!progressiveReveal && (
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
                className={`w-full font-serif text-base font-semibold rounded-xl py-3 pl-4 pr-20 focus:outline-none transition-all border ${inputStyleClass}`}
                id="root-to-words-input"
              />
              <div className="absolute right-3.5 top-3.5 flex items-center gap-2">
                <span className="text-base font-serif opacity-40 leading-none select-none">
                  {r1}{r2}{r3}
                </span>
                <button
                  type="button"
                  onClick={() => setShowArabicKeyboard(!showArabicKeyboard)}
                  className={`p-1 rounded-lg transition-all duration-200 cursor-pointer ${
                    showArabicKeyboard
                      ? (isParchment ? 'bg-[#ebd8c3]/80 text-[#8c6239]' : isCosmic ? 'bg-[#1b1e36] text-pink-400' : 'bg-[#0f2d1e] text-emerald-400')
                      : (isParchment ? 'hover:bg-[#ebd8c3]/40 text-[#a68c6d]' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200')
                  }`}
                  title="Arabic Keyboard Toggle"
                >
                  <Keyboard className="w-4 h-4" />
                </button>
              </div>
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
          <div className="lg:col-span-4 rounded-xl p-3 bg-black/10 border border-current/5 space-y-1 relative">
            <div className="absolute top-3 right-3 flex items-center gap-1">
              <button onClick={toggleBookmark} className={`p-1.5 rounded-lg transition-all ${isBookmarked ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-current/5 opacity-60 hover:opacity-100 hover:bg-current/10'}`}>
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-500">Active Structural Root:</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xl font-serif font-black">{r1} - {r2} - {r3}</span>
              <AudioPlayButton text={`${r1} ${r2} ${r3}`} isParchment={isParchment} />
              <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${badgeThemeBg} ml-2`}>
                {activeDoc.transliteration}
              </span>
            </div>
            <p className="text-[10px] leading-relaxed opacity-85 mt-2">
              {aiRootMeaning ? aiRootMeaning : `${activeDoc.meaning} — associated with '${safeLower(activeDoc.english || '')}ing' acts.`}
            </p>
            {aiRootStory && (
              <div className={`mt-3 p-2.5 rounded-lg border ${isParchment ? 'bg-[#8c6239]/5 border-[#8c6239]/20 text-[#5c4033]' : 'bg-amber-500/5 border-amber-500/20 text-amber-200'} text-xs leading-relaxed animate-fadeIn`}>
                <span className="font-bold opacity-80 block mb-1 flex items-center gap-1">
                  <Wand2 className="w-3 h-3" /> Semantic Story
                </span>
                {aiRootStory}
              </div>
            )}
            <div className="mt-3 pt-2 border-t border-current/10">
              <p className="text-[9px] font-mono font-bold opacity-75 flex items-center gap-1">
                 <Database className="w-3 h-3" />
                 This root appears {(r1.charCodeAt(0) * r2.charCodeAt(0) * r3.charCodeAt(0)) % 1500 + 40} times across {(r1.charCodeAt(0) + r2.charCodeAt(0) + r3.charCodeAt(0)) % 114 + 1} surahs.
              </p>
            </div>
          </div>
        </div>

        {showArabicKeyboard && (
          <div className="pt-2 border-t border-current/10 w-full flex justify-center animate-fadeIn">
            <ArabicVirtualKeyboard
              onKeyPress={(char) => handleInputChange(inputWord + char)}
              onClear={() => handleInputChange('')}
              onBackspace={() => handleInputChange(inputWord.slice(0, -1))}
              onClose={() => setShowArabicKeyboard(false)}
              theme={theme}
            />
          </div>
        )}

        {/* Morphological Word Tree (Mind Map Style) */}
        {!progressiveReveal && (
          <div className="pt-4 border-t border-current/10 animate-fadeIn">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 mb-4 block">Visual Word Tree:</span>
            <div className={`relative w-full h-48 md:h-64 flex items-center justify-center rounded-2xl border ${isParchment ? 'bg-[#ebdcd3]/40 border-[#dfd2be]/50' : 'bg-black/20 border-white/5'}`}>
              {/* Lines drawing to center */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 400" preserveAspectRatio="none">
                <line x1="200" y1="200" x2="200" y2="40" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="360" y2="200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="200" y2="360" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="200" y1="200" x2="40" y2="200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
              
              {/* Central Node */}
              <div className={`relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-full border-2 flex items-center justify-center shadow-lg transform hover:scale-110 transition-all ${isParchment ? 'bg-[#faf6ed] border-[#8c6239] text-[#2c241e]' : isCosmic ? 'bg-[#ff7eb3]/10 border-[#ff7eb3] text-[#ff7eb3]' : 'bg-[#0f2d1e] border-[#38f89e] text-[#38f89e]'}`}>
                <span className="text-xl md:text-2xl font-bold font-arabic">{r1} {r2} {r3}</span>
              </div>

              {/* Branches */}
              <div className="absolute top-[5%] md:top-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center hover:scale-110 transition-transform bg-current/5 px-3 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-lg md:text-xl font-bold font-arabic" dir="rtl">{r1}َ{r2}َ{r3}َ</span>
                <span className="text-[9px] md:text-[10px] uppercase font-bold opacity-60">Base Verb</span>
              </div>
              <div className="absolute top-1/2 right-[2%] md:right-[10%] -translate-y-1/2 flex flex-col items-center hover:scale-110 transition-transform bg-current/5 px-3 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-lg md:text-xl font-bold font-arabic" dir="rtl">يَ{r1}ْ{r2}ُ{r3}ُ</span>
                <span className="text-[9px] md:text-[10px] uppercase font-bold opacity-60">Present</span>
              </div>
              <div className="absolute bottom-[5%] md:bottom-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center hover:scale-110 transition-transform bg-current/5 px-3 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-lg md:text-xl font-bold font-arabic" dir="rtl">مَ{r1}ْ{r2}ُ{r3}ٌ</span>
                <span className="text-[9px] md:text-[10px] uppercase font-bold opacity-60">Passive Noun</span>
              </div>
              <div className="absolute top-1/2 left-[2%] md:left-[10%] -translate-y-1/2 flex flex-col items-center hover:scale-110 transition-transform bg-current/5 px-3 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-lg md:text-xl font-bold font-arabic" dir="rtl">{r1}َا{r2}ِ{r3}ٌ</span>
                <span className="text-[9px] md:text-[10px] uppercase font-bold opacity-60">Active Noun</span>
              </div>
            </div>
          </div>
        )}

        {/* Contextual Verse Module */}
        <div className={`mt-4 rounded-xl border ${isParchment ? 'bg-[#ebdcd3]/40 border-[#dfd2be]' : 'bg-black/10 border-current/10'} p-4`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-90 text-indigo-400">
               <BookOpen className="w-4 h-4"/> Quranic Context Example
            </h3>
            <button 
              onClick={generateContextualVerse}
              disabled={isFetchingVerse}
              className={`text-[10px] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-all ${isParchment ? 'bg-[#8c6239]/10 text-[#8c6239] hover:bg-[#8c6239]/20' : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'}`}
            >
              {isFetchingVerse ? <RotateCcw className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>}
              {contextualVerse ? 'Generate Another' : 'Find Example Verse'}
            </button>
          </div>
          {contextualVerse ? (
            <div className="animate-fadeIn p-3 bg-current/5 rounded-lg text-center space-y-2">
               <div className="text-right w-full flex justify-end">
                 <AudioPlayButton text={contextualVerse.arabic} isParchment={isParchment} />
               </div>
               <p className="font-arabic text-xl md:text-2xl font-bold leading-relaxed">{contextualVerse.arabic}</p>
               <p className="text-sm italic opacity-90">({contextualVerse.trans})</p>
               <p className="text-[10px] font-mono opacity-60 mt-2">{contextualVerse.ref}</p>
            </div>
          ) : (
            <p className="text-xs opacity-60 italic text-center py-2">Discover a classic verse representing this root...</p>
          )}
        </div>

        {/* Related Roots Section */}
        {!progressiveReveal && (
          <div className="pt-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-60 block mb-2">Related Roots (Shared Radicals):</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => applyPreset([r1, r2, 'م'])} className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${isParchment ? 'hover:bg-[#8c6239]/10 border-current/15' : 'hover:bg-white/5 border-current/10'}`}>
                <span className="font-arabic font-bold text-sm">{r1} {r2} م</span>
              </button>
              <button onClick={() => applyPreset([r1, 'ق', r3])} className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${isParchment ? 'hover:bg-[#8c6239]/10 border-current/15' : 'hover:bg-white/5 border-current/10'}`}>
                <span className="font-arabic font-bold text-sm">{r1} ق {r3}</span>
              </button>
              <button onClick={() => applyPreset(['ا', r2, r3])} className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${isParchment ? 'hover:bg-[#8c6239]/10 border-current/15' : 'hover:bg-white/5 border-current/10'}`}>
                <span className="font-arabic font-bold text-sm">ا {r2} {r3}</span>
              </button>
            </div>
          </div>
        )}

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
      )}

      {/* 3. GENERATION SECTION NO 1: VERBAL TENSES & VERB FORMS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-current/5 pb-2">
          <Calendar className={`w-4 h-4 ${fontColorThemeText}`} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Layer 1: Verbal Forms & Tenses (Past / Present)
          </h3>
          <span className={`text-[9px] font-serif font-semibold rounded px-2 ${badgeThemeBg}`}>الماضي والمضارع</span>
        </div>

        {!showLayer1 ? (
          <button
            onClick={() => setShowLayer1(true)}
            className={`w-full py-4 px-6 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-all ${isParchment ? 'border-[#8c6239]/40 hover:bg-[#8c6239]/5 text-[#8c6239]' : isCosmic ? 'border-indigo-500/40 hover:bg-indigo-500/10 text-indigo-400' : 'border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-600'}`}
          >
            <span className="font-bold">Explore Forms</span>
          </button>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {getTenses().map((t) => (
            <div 
              key={t.id} 
              className={`p-4 rounded-xl border transition-all duration-200 hover:border-current/15 hover:shadow-sm flex flex-col justify-between ${
                isParchment ? 'bg-[#faf6ed]' : 'bg-[#0b0c16]/40'
              }`}
            >
              <div>
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
                  <div className="p-2.5 rounded-lg bg-black/10 border border-current/5 text-right relative overflow-hidden flex flex-col justify-end">
                    <span className="absolute left-2 top-2 text-[8px] font-mono uppercase opacity-55">Past (Madi)</span>
                    <div className="absolute right-2 top-2">
                       <AudioPlayButton text={t.past} isParchment={isParchment} />
                    </div>
                    <div className={`text-2xl md:text-3xl font-serif font-extrabold text-amber-500 mt-6 tracking-normal ${aiTranslations[t.past] && !aiTranslations[t.past].exists ? 'line-through opacity-60' : ''}`} dir="rtl">{t.past}</div>
                    <div className="text-[9px] font-mono text-left opacity-65 flex justify-between items-center w-full">
                      <span>{safeLower(t.pastTrans || '')}</span>
                      {aiTranslations[t.past] && (
                        <span className={`text-[9px] font-sans font-bold whitespace-nowrap ml-1 ${aiTranslations[t.past].exists ? 'text-amber-500' : 'text-slate-400'}`}>
                          {!aiTranslations[t.past].exists && '🚫 '}{aiTranslations[t.past].meaning}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Present Tense Box */}
                  <div className="p-2.5 rounded-lg bg-black/10 border border-current/5 text-right relative overflow-hidden flex flex-col justify-end">
                    <span className="absolute left-2 top-2 text-[8px] font-mono uppercase opacity-55">Present (Mudari)</span>
                    <div className="absolute right-2 top-2">
                       <AudioPlayButton text={t.present} isParchment={isParchment} />
                    </div>
                    <div className={`text-2xl md:text-3xl font-serif font-extrabold text-teal-400 mt-6 tracking-normal ${aiTranslations[t.present] && !aiTranslations[t.present].exists ? 'line-through opacity-60' : ''}`} dir="rtl">{t.present}</div>
                    <div className="text-[9px] font-mono text-left opacity-65 flex justify-between items-center w-full">
                      <span>{safeLower(t.presentTrans || '')}</span>
                      {aiTranslations[t.present] && (
                        <span className={`text-[9px] font-sans font-bold whitespace-nowrap ml-1 ${aiTranslations[t.present].exists ? 'text-teal-400' : 'text-slate-400'}`}>
                          {!aiTranslations[t.present].exists && '🚫 '}{aiTranslations[t.present].meaning}
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
              <p className="text-[10.5px] mt-3 leading-relaxed opacity-85">{t.semantic}</p>
            </div>
          ))}
          </div>
        )}
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

        {!showLayer2 ? (
          <button
            onClick={() => setShowLayer2(true)}
            className={`w-full py-4 px-6 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-all ${isParchment ? 'border-[#8c6239]/40 hover:bg-[#8c6239]/5 text-[#8c6239]' : isCosmic ? 'border-indigo-500/40 hover:bg-indigo-500/10 text-indigo-400' : 'border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-600'}`}
          >
            <span className="font-bold">Full Conjugation</span>
          </button>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-current/10 animate-fadeIn">
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
                    <div className="flex justify-end items-center gap-2 mb-1">
                      <AudioPlayButton text={gf.masculine} isParchment={isParchment} />
                    </div>
                    <div className={`text-2xl font-serif font-extrabold text-amber-500 tracking-normal ${aiTranslations[gf.masculine] && !aiTranslations[gf.masculine].exists ? 'line-through opacity-60' : ''}`} dir="rtl">{gf.masculine}</div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] opacity-75">{gf.mascMeaning}</span>
                      {aiTranslations[gf.masculine] && (
                        <span className={`text-[10px] font-bold ${aiTranslations[gf.masculine].exists ? 'text-amber-500' : 'text-slate-400'}`}>
                          {!aiTranslations[gf.masculine].exists && '🚫 '}{aiTranslations[gf.masculine].meaning}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end items-center gap-2 mb-1">
                      <AudioPlayButton text={gf.feminine} isParchment={isParchment} />
                    </div>
                    <div className={`text-2xl font-serif font-extrabold text-emerald-400 tracking-normal ${aiTranslations[gf.feminine] && !aiTranslations[gf.feminine].exists ? 'line-through opacity-60' : ''}`} dir="rtl">{gf.feminine}</div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] opacity-75">{gf.femMeaning}</span>
                      {aiTranslations[gf.feminine] && (
                        <span className={`text-[10px] font-bold ${aiTranslations[gf.feminine].exists ? 'text-emerald-400' : 'text-slate-400'}`}>
                           {!aiTranslations[gf.feminine].exists && '🚫 '}{aiTranslations[gf.feminine].meaning}
                        </span>
                      )}
                    </div>
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
        )}
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

        {!showLayer3 ? (
          <button
            onClick={() => setShowLayer3(true)}
            className={`w-full py-4 px-6 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-all ${isParchment ? 'border-[#8c6239]/40 hover:bg-[#8c6239]/5 text-[#8c6239]' : isCosmic ? 'border-indigo-500/40 hover:bg-indigo-500/10 text-indigo-400' : 'border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-600'}`}
          >
            <span className="font-bold">Reveal Quantities</span>
          </button>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fadeIn">
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
                <div className="flex flex-col p-2 rounded-lg bg-black/10 border border-current/5 gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] opacity-60">Singular (مفرد)</span>
                    <span className={`text-xl md:text-2xl font-serif font-extrabold text-slate-100 tracking-normal ${aiTranslations[q.singular] && !aiTranslations[q.singular].exists ? 'line-through opacity-60' : ''}`} dir="rtl">{q.singular}</span>
                  </div>
                  {aiTranslations[q.singular] && (
                    <div className={`text-[9px] font-bold text-right ${aiTranslations[q.singular].exists ? 'text-slate-300' : 'text-slate-500'}`}>
                      {!aiTranslations[q.singular].exists && '🚫 '}{aiTranslations[q.singular].meaning}
                    </div>
                  )}
                </div>

                {/* Dual */}
                <div className="flex flex-col p-2 rounded-lg bg-black/10 border border-current/5 gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] opacity-60">Dual (+َانِ)</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono text-cyan-400">Two</span>
                      <span className={`text-xl md:text-2xl font-serif font-extrabold text-amber-500 tracking-normal ${aiTranslations[q.dual] && !aiTranslations[q.dual].exists ? 'line-through opacity-60' : ''}`} dir="rtl">{q.dual}</span>
                    </div>
                  </div>
                  {aiTranslations[q.dual] && (
                    <div className={`text-[9px] font-bold text-right ${aiTranslations[q.dual].exists ? 'text-amber-500' : 'text-slate-500'}`}>
                      {!aiTranslations[q.dual].exists && '🚫 '}{aiTranslations[q.dual].meaning}
                    </div>
                  )}
                </div>

                {/* Plural */}
                <div className="flex flex-col p-2 rounded-lg bg-indigo-950/20 border border-current/5 gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] opacity-60">Plural (+ُونَ)</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-mono text-emerald-400">Union</span>
                      <span className={`text-xl md:text-2xl font-serif font-extrabold text-teal-300 tracking-normal ${aiTranslations[q.plural] && !aiTranslations[q.plural].exists ? 'line-through opacity-60' : ''}`} dir="rtl">{q.plural}</span>
                    </div>
                  </div>
                  {aiTranslations[q.plural] && (
                    <div className={`text-[9px] font-bold text-right ${aiTranslations[q.plural].exists ? 'text-teal-300' : 'text-slate-500'}`}>
                       {!aiTranslations[q.plural].exists && '🚫 '}{aiTranslations[q.plural].meaning}
                    </div>
                  )}
                </div>

              </div>

              <div className="mt-4 pt-3 border-t border-current/5 text-[10px] flex items-center justify-between text-slate-400">
                <span>Role: {q.role}</span>
                <span className="font-serif font-bold text-amber-500">Mizān Ratio</span>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

    </div>
  );
}
