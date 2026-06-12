import React, { useState, useEffect, useMemo } from 'react';
import { appStorage } from '../lib/appStorage';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SURAH_MAPPING_LIST, 
  SurahDefinition 
} from '../data/surahMapping';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Compass, 
  Award, 
  Check, 
  X, 
  ArrowRight, 
  Map, 
  Layers, 
  Calendar,
  Sliders,
  Filter,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Brain,
  Hash,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface SurahVocabularyMapsProps {
  theme: 'emerald' | 'cosmic' | 'parchment';
}

interface VocabWord {
  word: string;
  transliteration: string;
  wordType: "Ism" | "Fi'l" | "Harf";
  isIsmFail: boolean;
  isHarf: boolean;
  root: string;
  meanings: string[];
  occurrences: string[];
  frequency: number;
  explanations: { verse: string; text: string }[];
}

interface VocabMapResponse {
  surahName: string;
  surahNumber: number;
  isPlaceholder: boolean;
  totalVersesInDb: number;
  vocabList: VocabWord[];
  isOfflineFallback?: boolean;
  offlineFallbackNotice?: string;
}

interface IrabCase {
  state: string;
  vowelMark: string;
  grammaticalFunction: string;
  meaningShift: string;
  example: string;
}

interface IrabAnalysisResponse {
  word: string;
  cases: IrabCase[];
  irregularNotes: string;
}

export default function SurahVocabularyMaps({ theme }: SurahVocabularyMapsProps) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Determine correct solid backgrounds and text classes to override 'bg-background' / 'text-foreground'
  const solidBgClass = isParchment 
    ? 'bg-[#fbf9f4]' 
    : isCosmic 
      ? 'bg-[#0a0b1d]' 
      : 'bg-slate-900';

  const solidBgHoverClass = isParchment
    ? 'bg-[#faf6ed] hover:bg-[#ebdcc3]/35'
    : isCosmic
      ? 'bg-[#111235] hover:bg-indigo-500/10'
      : 'bg-slate-900/60 hover:bg-slate-800';

  const modalBorderClass = isParchment 
    ? 'border-[#dfd2be]/80 text-[#2c241e]' 
    : isCosmic 
      ? 'border-indigo-500/30 text-indigo-50' 
      : 'border-slate-700/80 text-slate-100';

  const inputBgClass = isParchment
    ? 'bg-[#eae3d2] text-[#2c241e] placeholder-[#2c241e]/50 border-[#dfd2be]'
    : isCosmic
      ? 'bg-[#0e0f2c] text-indigo-50 placeholder-indigo-300/40 border-indigo-500/20'
      : 'bg-slate-950 text-slate-100 placeholder-slate-400 border-slate-800';

  const listBgClass = isParchment
    ? 'bg-[#faf6ed]'
    : isCosmic
      ? 'bg-[#0a0b1d]'
      : 'bg-slate-900';

  const dropdownListBgClass = isParchment
    ? 'bg-[#f5eedf]'
    : isCosmic
      ? 'bg-[#0e0f2b]'
      : 'bg-slate-950';

  const backdropClass = isParchment
    ? 'bg-amber-950/45 backdrop-blur-sm'
    : 'bg-black/75 backdrop-blur-sm';

  // Navigation & State
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(114);
  const [surahSearchText, setSurahSearchText] = useState<string>('');
  
  // Ayah range constraints
  const [useRange, setUseRange] = useState<boolean>(false);
  const [ayahStart, setAyahStart] = useState<number>(1);
  const [ayahEnd, setAyahEnd] = useState<number>(6);

  // Database loading
  const [vocabData, setVocabData] = useState<VocabMapResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compileProgress, setCompileProgress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search & Filter state
  const [wordSearchText, setWordSearchText] = useState<string>('');
  const [activeWordTypeFilter, setActiveWordTypeFilter] = useState<'all' | 'Ism' | "Fi'l" | 'Harf'>('all');
  const [sortBy, setSortBy] = useState<'frequency' | 'appearance' | 'alphabetical'>('frequency');
  const [isGroupedByRoot, setIsGroupedByRoot] = useState<boolean>(true);

  // Selected Detail Modal
  const [activeDetailWord, setActiveDetailWord] = useState<VocabWord | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'dna' | 'irab' | 'rhetoric'>('dna');
  
  // Custom API keys if entered in global scope
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    try {
      return appStorage.getItem('quranic_arabic_custom_api_key') || '';
    } catch {
      return '';
    }
  });

  // Dynamic I'rab Shifts AI generator
  const [irabAnalysis, setIrabAnalysis] = useState<IrabAnalysisResponse | null>(null);
  const [isGeneratingIrab, setIsGeneratingIrab] = useState<boolean>(false);

  // Get active Surah meta
  const activeSurahMeta = useMemo(() => {
    return SURAH_MAPPING_LIST.find(s => s.number === selectedSurahNumber) || SURAH_MAPPING_LIST[SURAH_MAPPING_LIST.length - 1];
  }, [selectedSurahNumber]);

  // Handle syncing start/end when selection shifts
  useEffect(() => {
    setAyahStart(1);
    setAyahEnd(activeSurahMeta.totalVerses);
    setUseRange(false);
  }, [selectedSurahNumber, activeSurahMeta]);

  // Load Vocab Map
  const loadVocabMap = async (forceNoAi: boolean = false) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const activeMeta = SURAH_MAPPING_LIST.find(s => s.number === selectedSurahNumber);
      const res = await fetch('/api/surah-vocab-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          surahNum: selectedSurahNumber,
          totalVerses: activeMeta ? activeMeta.totalVerses : undefined
        })
      });
      if (!res.ok) throw new Error('Failed to retrieve vocabulary data from database.');
      const data: VocabMapResponse = await res.json();
      
      setVocabData(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred while communicating with the database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVocabMap();
  }, [selectedSurahNumber]);

  // Compile with Gemini on-the-fly
  const compileWithGemini = async (forceRefresh: boolean = false) => {
    setIsCompiling(true);
    setErrorMessage(null);
    setCompileProgress('Contacting Gemini and analyzing roots...');
    try {
      const res = await fetch('/api/compile-surah-vocab-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surahNum: selectedSurahNumber,
          surahName: activeSurahMeta.transliteration,
          totalVerses: activeSurahMeta.totalVerses,
          customApiKey: customApiKey,
          forceRefresh
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || 'Failed compiling vocabulary map.');
      }

      const data: VocabMapResponse = await res.json();
      setVocabData(data);
      setCompileProgress('');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed during AI compilation. Ensure your API Key is configured correctly under settings.');
    } finally {
      setIsCompiling(false);
    }
  };

  // Generate deep inflection (I'rab) Shifts with AI
  const loadDeepIrabShifts = async (word: VocabWord) => {
    setIsGeneratingIrab(true);
    setIrabAnalysis(null);
    try {
      const res = await fetch('/api/word-irab-shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: word.word,
          root: word.root,
          wordType: word.wordType,
          customApiKey: customApiKey
        })
      });

      if (!res.ok) throw new Error('AI was unable to compile syntactic shifts.');
      const data: IrabAnalysisResponse = await res.json();
      setIrabAnalysis(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsGeneratingIrab(false);
    }
  };

  // Process word details selection
  const handleSelectWord = (word: VocabWord) => {
    setActiveDetailWord(word);
    setActiveDetailTab('dna');
    setIrabAnalysis(null);
  };

  // Filter and constraint lists
  const filteredWords = useMemo(() => {
    if (!vocabData || vocabData.isPlaceholder) return [];

    let list = [...vocabData.vocabList];

    // Filter by ayah range
    if (useRange) {
      list = list.filter(w => {
        return w.occurrences.some(o => {
          const ayah = parseInt(o.split(':')[1] || o);
          return ayah >= ayahStart && ayah <= ayahEnd;
        });
      });
    }

    // Filter by parts of speech
    if (activeWordTypeFilter !== 'all') {
      list = list.filter(w => w.wordType === activeWordTypeFilter);
    }

    // Filter by word search
    if (wordSearchText.trim()) {
      const q = wordSearchText.toLowerCase().trim();
      list = list.filter(w => {
        return w.word.includes(q) || 
               w.transliteration.toLowerCase().includes(q) || 
               w.root.toLowerCase().includes(q) ||
               w.meanings.some(m => m.toLowerCase().includes(q));
      });
    }

    // Sort
    if (sortBy === 'frequency') {
      list.sort((a, b) => b.frequency - a.frequency);
    } else if (sortBy === 'alphabetical') {
      list.sort((a, b) => a.word.localeCompare(b.word));
    } else if (sortBy === 'appearance') {
      // sort based on first appearance verse
      list.sort((a, b) => {
        const getFirstVal = (oList: string[]) => {
          if (!oList || oList.length === 0) return 9999;
          const first = oList[0];
          const splits = first.split(':');
          const ay = parseInt(splits[1] || splits[0]);
          return isNaN(ay) ? 9999 : ay;
        };
        return getFirstVal(a.occurrences) - getFirstVal(b.occurrences);
      });
    }

    return list;
  }, [vocabData, useRange, ayahStart, ayahEnd, activeWordTypeFilter, wordSearchText, sortBy]);

  // Group by roots view
  const rootGroupedMap = useMemo(() => {
    const map: Record<string, VocabWord[]> = {};
    filteredWords.forEach(w => {
      const rKey = w.root && w.root !== 'None' ? w.root : 'Particles / Non-Lexical';
      if (!map[rKey]) map[rKey] = [];
      map[rKey].push(w);
    });
    return Object.entries(map).sort((a, b) => {
      if (a[0] === 'Particles / Non-Lexical') return 1;
      if (b[0] === 'Particles / Non-Lexical') return -1;
      return b[1].length - a[1].length; // order by number of derived terms in the Surah
    });
  }, [filteredWords]);

  // Stats calculation
  const metrics = useMemo(() => {
    if (!vocabData || vocabData.isPlaceholder || filteredWords.length === 0) {
      return { totalUnique: 0, totalInstances: 0, nouns: 0, verbs: 0, particles: 0, topRoot: 'None' };
    }

    let instances = 0;
    let nouns = 0;
    let verbs = 0;
    let particles = 0;
    const rootCounts: Record<string, number> = {};

    filteredWords.forEach(w => {
      instances += w.frequency;
      if (w.wordType === 'Ism') nouns++;
      else if (w.wordType === "Fi'l") verbs++;
      else if (w.wordType === 'Harf') particles++;

      if (w.root && w.root !== 'None') {
        rootCounts[w.root] = (rootCounts[w.root] || 0) + w.frequency;
      }
    });

    let maxRoot = 'None';
    let maxCount = 0;
    Object.entries(rootCounts).forEach(([r, c]) => {
      if (c > maxCount) {
        maxCount = c;
        maxRoot = r;
      }
    });

    return {
      totalUnique: filteredWords.length,
      totalInstances: instances,
      nouns,
      verbs,
      particles,
      topRoot: maxRoot !== 'None' ? `${maxRoot} (${maxCount}x)` : 'Various'
    };
  }, [vocabData, filteredWords]);

  // Surahs mapping filtered list for search dropdown
  const filteredSurahsList = useMemo(() => {
    const q = surahSearchText.toLowerCase().trim();
    if (!q) return SURAH_MAPPING_LIST;
    return SURAH_MAPPING_LIST.filter(s => {
      return s.number.toString().includes(q) ||
             s.transliteration.toLowerCase().includes(q) ||
             s.name.includes(q);
    });
  }, [surahSearchText]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8" id="surah-vocab-maps-root">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-current/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded text-xs uppercase font-bold tracking-wider font-mono bg-indigo-500/10 text-indigo-400">
              Vocabulary Engine
            </span>
            <span className="flex items-center gap-1 text-xs opacity-50 font-mono">
              <Compass className="w-3 h-3" /> Academically Verified
            </span>
          </div>
          <h1 className="text-3xl font-serif font-black tracking-tight select-none">
            Surah Vocabulary Maps
          </h1>
          <p className="text-sm opacity-60 leading-relaxed max-w-2xl">
            Analyze the complete lexicon of any Chapter, categorize words by grammatical class, explore morpho-semantic roots, and run dynamic AI inflections.
          </p>
        </div>

        {/* Global Settings Indicator / API Key warning helper */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-mono font-bold uppercase tracking-wider opacity-60">Database Status</p>
            <p className="text-xs text-xs opacity-40">Offline datasets preferred</p>
          </div>
          <div className="p-2.5 rounded-lg border border-current/10 bg-current/5 flex items-center justify-center">
            <Map className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Grid Layout: Config panel & Results map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 border border-current/10 bg-current/5 rounded-2xl space-y-6 shadow-sm">
            
            {/* Step 1: Select Surah */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" /> 1. Select Quranic Surah
              </label>
              
              {/* Custom Searchable Surah dropdown list */}
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none opacity-40">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Type Surah Name or Number (e.g. Al-Kawthar)"
                  className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${inputBgClass}`}
                  value={surahSearchText}
                  onChange={(e) => setSurahSearchText(e.target.value)}
                  onFocus={() => setSurahSearchText('')}
                />
                {surahSearchText.trim() && (
                  <button 
                    onClick={() => setSurahSearchText('')}
                    className="absolute inset-y-0 right-2 flex items-center px-1.5 opacity-50 hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Scrollable list of matched surahs */}
              <div className={`max-h-48 overflow-y-auto border border-current/10 rounded-xl divide-y divide-current/5 scrollbar-thin ${dropdownListBgClass}`}>
                {filteredSurahsList.length === 0 ? (
                  <div className="p-4 text-center text-xs opacity-50">No matching chapters found.</div>
                ) : (
                  filteredSurahsList.map((surah) => {
                    const isSelected = selectedSurahNumber === surah.number;
                    return (
                      <button
                        key={surah.number}
                        type="button"
                        onClick={() => {
                          setSelectedSurahNumber(surah.number);
                          setSurahSearchText(`${surah.number}. ${surah.transliteration}`);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs transition-colors duration-150 ${
                          isSelected 
                            ? 'bg-indigo-500/10 text-indigo-400 font-bold' 
                            : 'hover:bg-current/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[10px] ${
                            isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-current/5 opacity-60'
                          }`}>
                            {surah.number}
                          </span>
                          <span className="font-medium tracking-tight h-[15px] leading-[15px]">{surah.transliteration}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-serif text-right">{surah.name}</span>
                          <span className="opacity-40 text-[9px] font-mono">{surah.totalVerses} Ayas</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Active Surah Card */}
            <div className="p-4 border border-indigo-500/10 bg-indigo-500/[0.02] rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs opacity-50">Selected Chapter</p>
                <p className="text-lg font-serif font-black">{activeSurahMeta.transliteration}</p>
                <p className="text-xs opacity-40 font-mono">Surah {activeSurahMeta.number} • {activeSurahMeta.totalVerses} Ayas</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-serif font-medium">{activeSurahMeta.name}</span>
              </div>
            </div>

            {/* Step 2: Ayah range selector */}
            <div className="space-y-3 pt-2 border-t border-current/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> 2. Ayah Boundary Constraints
                </label>
                <button
                  type="button"
                  onClick={() => setUseRange(!useRange)}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded transition-all ${
                    useRange ? 'bg-indigo-500 text-white' : 'bg-current/10 opacity-60'
                  }`}
                >
                  {useRange ? 'BOUND ACTIVE' : 'ALL VERSES'}
                </button>
              </div>

              {useRange && (
                <div className="space-y-4 p-4 border border-current/10 rounded-xl bg-current/5 animate-slideDown">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span>Ayah {ayahStart}</span>
                    <span className="opacity-40">to</span>
                    <span>Ayah {ayahEnd}</span>
                  </div>
                  
                  {/* Slider limits */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={1}
                      max={activeSurahMeta.totalVerses}
                      value={ayahStart}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setAyahStart(val);
                        if (val > ayahEnd) setAyahEnd(val);
                      }}
                      className="w-full accent-indigo-500 h-1 bg-current/10 rounded-lg cursor-pointer"
                    />
                    <input
                      type="range"
                      min={1}
                      max={activeSurahMeta.totalVerses}
                      value={ayahEnd}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setAyahEnd(val);
                        if (val < ayahStart) setAyahStart(val);
                      }}
                      className="w-full accent-indigo-500 h-1 bg-current/10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] opacity-40 text-center font-mono">Drag sliders to isolate a specific section of the Surah (e.g. first 5 Ayahs)</p>
                </div>
              )}
            </div>

            {/* Custom API Key input helper if user has issues with limit */}
            <div className="space-y-1.5 pt-2 border-t border-current/10">
              <details className="text-xs">
                <summary className="font-mono text-[10px] font-bold cursor-pointer opacity-40 hover:opacity-100 select-none">
                  Custom settings & API configurations
                </summary>
                <div className="mt-2 space-y-2 p-3 border border-current/10 bg-current/5 rounded-lg">
                  <p className="text-[10px] opacity-60">If the server encounters API limits or if you want to use your personal, high-speed model keys, enter them here:</p>
                  <input
                    type="password"
                    placeholder="Enter Custom GEMINI_API_KEY"
                    className={`w-full px-2.5 py-1.5 rounded border text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 ${inputBgClass}`}
                    value={customApiKey}
                    onChange={(e) => {
                      setCustomApiKey(e.target.value);
                      try { appStorage.setItem('quranic_arabic_custom_api_key', e.target.value); } catch {}
                    }}
                  />
                  <p className="text-[9px] opacity-30 font-mono">Saved dynamically to localized client session storage.</p>
                </div>
              </details>
            </div>

          </div>
        </div>

        {/* Right column: Main Dashboard (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Display Loader */}
          {isLoading && (
            <div className="p-16 text-center border border-current/10 bg-current/5 rounded-2xl space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-400 mx-auto" />
              <p className="text-sm font-mono opacity-60">Indexing Surah files & compiling localized inventories...</p>
            </div>
          )}

          {/* Placeholder/Compile State Banner */}
          {!isLoading && vocabData && vocabData.isPlaceholder && (
            <div className="p-8 md:p-12 text-center border border-yellow-500/20 bg-yellow-500/[0.02] rounded-2xl space-y-6">
              <div className="p-4 rounded-full bg-yellow-500/10 text-yellow-400 w-16 h-16 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-lg mx-auto space-y-2">
                <h3 className="text-xl font-serif font-black">AI Lexical Compilation Recommended</h3>
                <p className="text-sm opacity-60">
                  This Surah's vocabulary metadata has not been pre-compiled in the offline package. Register a complete word-by-word structural study utilizing the Gemini LLM compiler.
                </p>
                {errorMessage && (
                  <div className="p-3.5 border border-red-500/30 bg-red-500/5 text-xs text-red-400 font-mono rounded-lg break-words text-left flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>{errorMessage}</div>
                  </div>
                )}
              </div>

              {isCompiling ? (
                <div className="space-y-3 max-w-xs mx-auto">
                  <div className="flex items-center justify-center gap-2 text-sm font-mono text-indigo-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Linguistic parsing active...</span>
                  </div>
                  <p className="text-xs opacity-50 font-mono leading-none">{compileProgress}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={compileWithGemini}
                  className="px-6 py-3 rounded-xl font-mono text-xs font-bold bg-indigo-500 hover:bg-indigo-600 text-white transition-all transform shadow-md flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> COMPILE WITH GEMINI AI (FLASH-3.5)
                </button>
              )}
            </div>
          )}

          {/* Active Worksite */}
          {!isLoading && vocabData && !vocabData.isPlaceholder && (
            <div className="space-y-6">
              
              {/* Fallback Warning block */}
              {vocabData.isOfflineFallback && (
                <div className="p-4 border border-yellow-500/30 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 rounded-2xl space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-500 animate-pulse" />
                    <div>
                      <p className="font-bold text-xs uppercase tracking-wider font-mono">Resident Lexicon Mode Active</p>
                      <p className="text-xs opacity-80 leading-normal">
                        {vocabData.offlineFallbackNotice || "Gemini API limits reached or key missing. High-quality resident morphological profiles have been served so your workspace remains fully interactive."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Bento Bento Metrics Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div className="p-4 border border-current/10 bg-current/5 rounded-xl space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider opacity-50">Unique Vocabulary</p>
                  <p className="text-2xl font-serif font-black">{metrics.totalUnique}</p>
                  <p className="text-[10px] opacity-40 font-mono">Consolidated Root-terms</p>
                </div>

                <div className="p-4 border border-current/10 bg-current/5 rounded-xl space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider opacity-50">Word Count (Segmented)</p>
                  <p className="text-2xl font-serif font-black">{metrics.totalInstances}</p>
                  <p className="text-[10px] opacity-40 font-mono">Tokens in selected range</p>
                </div>

                <div className="p-4 border border-current/10 bg-current/5 rounded-xl space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider opacity-50">Lexical Parts of Speech</p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded" title="Nouns">N:{metrics.nouns}</span>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded" title="Verbs">V:{metrics.verbs}</span>
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded" title="Particles">P:{metrics.particles}</span>
                  </div>
                  <p className="text-[10px] opacity-40 font-mono">Semantic division (Nahw)</p>
                </div>

                <div className="p-4 border border-current/10 bg-current/5 rounded-xl space-y-1">
                  <p className="text-[10px] font-mono uppercase tracking-wider opacity-50">Top Root Semantic Key</p>
                  <p className="text-sm font-serif font-black truncate h-8 pt-1">{metrics.topRoot}</p>
                  <p className="text-[10px] opacity-40 font-mono">Dominator of this section</p>
                </div>

              </div>

              {/* Filtering Toolbar */}
              <div className="p-4 border border-current/10 bg-current/5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Text Filter */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none opacity-40">
                    <Filter className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search word, meaning, or root..."
                    className={`w-full pl-9 pr-6 py-2 rounded-xl border focus:outline-none text-xs ${inputBgClass}`}
                    value={wordSearchText}
                    onChange={(e) => setWordSearchText(e.target.value)}
                  />
                  {wordSearchText.trim() && (
                    <button onClick={() => setWordSearchText('')} className="absolute inset-y-0 right-2 flex items-center px-1 opacity-50 hover:opacity-100">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {/* Word type toggle */}
                  <div className={`flex border border-current/10 rounded-lg p-0.5 font-mono text-[10px] ${listBgClass}`}>
                    {(['all', 'Ism', 'Fi\'l', 'Harf'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setActiveWordTypeFilter(opt)}
                        className={`px-2 py-1 rounded-md capitalize font-bold transition-all ${
                          activeWordTypeFilter === opt ? 'bg-indigo-500 text-white' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        {opt === 'all' ? 'All Classes' : opt}
                      </button>
                    ))}
                  </div>

                  {/* Grouping mode */}
                  <button
                    onClick={() => setIsGroupedByRoot(!isGroupedByRoot)}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-mono text-[10px] uppercase font-black transition-all ${
                      isGroupedByRoot 
                        ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400' 
                        : `border-current/10 hover:bg-current/5 opacity-80 ${inputBgClass}`
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> {isGroupedByRoot ? 'By Root keys' : 'By Flat terms'}
                  </button>

                  {/* Sorting dropdown */}
                  <select
                    className={`p-1.5 rounded-lg border font-mono text-[10px] focus:outline-none ${inputBgClass}`}
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                  >
                    <option value="frequency">Most Frequent</option>
                    <option value="appearance">Ayah Order</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>

                  {/* Force Refresh Button */}
                  <button
                    onClick={() => compileWithGemini(true)}
                    className="px-2 py-1.5 rounded-lg border border-indigo-500/40 text-indigo-500 hover:bg-indigo-500/10 transition-colors uppercase font-mono text-[10px] font-bold flex items-center gap-1"
                    title="Invalidate cache and generate a fresh analysis for this Surah"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Force Refresh
                  </button>
                </div>

              </div>

              {/* Master Vocabulary View */}
              {filteredWords.length === 0 ? (
                <div className="p-16 text-center border border-dashed border-current/10 rounded-2xl opacity-50 text-sm font-mono">
                  No vocabulary match found with current search or range constraints.
                </div>
              ) : !isGroupedByRoot ? (
                
                /* FLAT WORD CARD GRID */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="vocab-word-grid">
                  {filteredWords.map((word) => {
                    return (
                      <motion.div
                        key={word.word}
                        layoutId={`card-${word.word}`}
                        onClick={() => handleSelectWord(word)}
                        className="p-4 border border-current/10 bg-current/5 hover:border-indigo-500/30 rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md transition-all transform hover:-translate-y-0.5 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              word.wordType === 'Ism' ? 'bg-emerald-500/15 text-emerald-400' :
                              word.wordType === "Fi'l" ? 'bg-amber-500/15 text-amber-400' :
                              'bg-indigo-500/15 text-indigo-400'
                            }`}>
                              {word.wordType === 'Ism' ? 'Noun' : word.wordType === "Fi'l" ? 'Verb' : 'Particle'}
                            </span>
                            <span className="text-[10px] font-mono text-xs opacity-50">
                              {word.frequency}x in Surah
                            </span>
                          </div>

                          <div className="flex items-baseline justify-between pt-1">
                            {/* Giant Arabic word */}
                            <p className="text-2xl font-serif font-black tracking-wide text-right leading-none group-hover:scale-105 transition-transform origin-right">
                              {word.word}
                            </p>
                          </div>

                          <div className="space-y-0.5">
                            <p className="text-xs font-mono font-bold opacity-80">{word.transliteration}</p>
                            <p className="text-xs opacity-60 line-clamp-1 italic">{word.meanings.join(', ')}</p>
                          </div>
                        </div>

                        {/* Root display section */}
                        <div className="mt-3 pt-2.5 border-t border-current/5 flex items-center justify-between text-[10px] font-mono opacity-50 group-hover:opacity-100 transition-opacity">
                          <span>Root: <strong className="font-serif">{word.root}</strong></span>
                          <span className="flex items-center gap-0.5 text-[9px] opacity-60 uppercase tracking-widest font-bold">
                            Details <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                
                /* ROOT-GROUPED ACCORDION VIEW */
                <div className="space-y-4" id="vocab-root-accordion">
                  {rootGroupedMap.map(([root, words]) => {
                    return (
                      <div key={root} className="p-4 border border-current/10 bg-current/5 rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b border-current/5 pb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500/30 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            </div>
                            <span className="text-xs font-mono opacity-50 uppercase tracking-wider">Semantic Root Origin:</span>
                            <span className="font-serif text-lg font-black tracking-wider text-indigo-400">{root}</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold opacity-40 uppercase bg-current/10 px-2 py-0.5 rounded">
                            {words.length} derived terms
                          </span>
                        </div>

                        {/* Derived words under this root */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {words.map((word) => (
                            <div
                              key={word.word}
                              onClick={() => handleSelectWord(word)}
                              className={`p-3 border border-current/5 rounded-lg flex items-center justify-between cursor-pointer group hover:border-indigo-500/20 transition-all ${solidBgHoverClass}`}
                            >
                              <div className="space-y-0.5">
                                <p className="text-sm font-mono font-black">{word.transliteration}</p>
                                <p className="text-[11px] opacity-60 line-clamp-1 italic">{word.meanings[0]}</p>
                              </div>
                              <div className="text-right flex flex-col items-end gap-1">
                                <p className="text-lg font-serif font-black">{word.word}</p>
                                <span className="text-[10px] font-mono opacity-40">{word.frequency}x</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* POPUP DRAWER MODAL FOR WORD DETAILS */}
      <AnimatePresence>
        {activeDetailWord && (
          <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${backdropClass}`}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-2xl border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh] ${solidBgClass} ${modalBorderClass}`}
            >
              
              {/* Header card with big Arabic script */}
              <div className="p-6 border-b border-current/10 bg-current/5 relative flex items-center justify-between">
                <div className="space-y-1.5 flex-1 pr-6">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      activeDetailWord.wordType === 'Ism' ? 'bg-emerald-500/20 text-emerald-400' :
                      activeDetailWord.wordType === "Fi'l" ? 'bg-amber-500/20 text-amber-400' :
                      'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {activeDetailWord.wordType === 'Ism' ? 'Ism (Noun)' : activeDetailWord.wordType === "Fi'l" ? 'Fi\'l (Verb)' : 'Harf (Particle)'}
                    </span>
                    {activeDetailWord.isIsmFail && (
                      <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-400 animate-spin" /> Ism Fā'il Participle
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-serif font-black select-none tracking-tight h-[32px] leading-[32px]">{activeDetailWord.transliteration}</h3>
                  <p className="text-sm opacity-60 leading-none">{activeDetailWord.meanings.join(' / ')}</p>
                </div>

                <div className="text-right flex flex-col items-end gap-1 justify-center min-w-[120px]">
                  <p className="text-4xl font-serif font-black tracking-widest leading-none select-all">{activeDetailWord.word}</p>
                  <p className="text-[10px] font-mono opacity-50">Appears {activeDetailWord.frequency} times here</p>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveDetailWord(null);
                    setIrabAnalysis(null);
                  }}
                  className="absolute top-4 right-4 p-1 rounded-full border border-current/10 hover:bg-current/10 opacity-70 hover:opacity-100 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs list inside modal */}
              <div className="flex border-b border-current/10 bg-current/[0.02] font-mono text-xs select-none">
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('dna')}
                  className={`flex-1 py-3 text-center border-b-2 font-bold transition-all ${
                    activeDetailTab === 'dna' ? 'border-indigo-500 text-indigo-500 bg-current/5' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  🧬 Morphological DNA
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDetailTab('irab');
                    // auto trigger if empty and type isn't Harf
                    if (!irabAnalysis && activeDetailWord.wordType !== 'Harf' && !isGeneratingIrab) {
                      loadDeepIrabShifts(activeDetailWord);
                    }
                  }}
                  className={`flex-1 py-3 text-center border-b-2 font-bold transition-all ${
                    activeDetailTab === 'irab' ? 'border-indigo-500 text-indigo-500 bg-current/5' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  ⚖️ I'rab Case Shifts
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDetailTab('rhetoric')}
                  className={`flex-1 py-3 text-center border-b-2 font-bold transition-all ${
                    activeDetailTab === 'rhetoric' ? 'border-indigo-500 text-indigo-500 bg-current/5' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  🏛️ Rhetorical Analysis
                </button>
              </div>

              {/* Modal scroll area */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
                
                {/* TAB 1: MORPHOLOGY DNA */}
                {activeDetailTab === 'dna' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Morph details grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border border-current/10 rounded-xl bg-current/5">
                        <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block leading-none mb-1">Semantic Root</span>
                        <span className="text-lg font-serif font-bold text-indigo-400">{activeDetailWord.root}</span>
                      </div>
                      <div className="p-3 border border-current/10 rounded-xl bg-current/5">
                        <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block leading-none mb-1">Functional Class</span>
                        <span className="text-sm font-mono font-bold capitalize">{activeDetailWord.wordType === 'Ism' ? 'Noun / Substantive' : activeDetailWord.wordType === "Fi'l" ? 'Verb Conjugation' : 'Conjunction / Particle'}</span>
                      </div>
                      <div className="p-3 border border-current/10 rounded-xl bg-current/5">
                        <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block leading-none mb-1">Surah Occurrences</span>
                        <span className="text-xs font-mono font-bold">Ayahs: {activeDetailWord.occurrences.join(', ')}</span>
                      </div>
                      <div className="p-3 border border-current/10 rounded-xl bg-current/5">
                        <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block leading-none mb-1">Unique Index ID</span>
                        <span className="text-xs font-mono font-bold">VOCAB-{activeDetailWord.transliteration.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* Explanations listing */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5 border-b border-current/5 pb-2">
                        <BookOpen className="w-3.5 h-3.5" /> Parse Explanation (Contextual)
                      </h4>
                      <div className="space-y-3.5">
                        {activeDetailWord.explanations.map((exp, idx) => (
                          <div key={idx} className="p-4 border border-current/10 bg-current/5 rounded-xl space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-mono opacity-50">
                              <span>Occurrence {idx + 1}</span>
                              <span className="bg-current/10 px-1.5 py-0.5 rounded">Ayah {exp.verse}</span>
                            </div>
                            <p className="text-xs opacity-70 leading-relaxed text-left">
                              {exp.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 2: I'RAB SHIFTS */}
                {activeDetailTab === 'irab' && (
                  <div className="space-y-6 animate-fadeIn">
                    <p className="text-xs opacity-60 leading-relaxed">
                      In classical Quranic Arabic, nouns and verbs inflect their final vowels based on their syntax cases. Explore how changing vowels change the structural DNA.
                    </p>

                    {isGeneratingIrab ? (
                      <div className="p-12 text-center border rounded-xl border-current/10 bg-current/5 space-y-3">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-400" />
                        <p className="text-xs font-mono opacity-50">Running deep morphological paradigm shifts with Gemini...</p>
                      </div>
                    ) : irabAnalysis ? (
                      <div className="space-y-6 animate-slideDown text-left">
                        
                        <div className="border border-current/15 rounded-xl overflow-hidden divide-y divide-current/10 bg-current/[0.02]">
                          {irabAnalysis.cases.map((cs) => (
                            <div key={cs.state} className="p-4 hover:bg-current/[0.01] transition-all grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                              <div className="md:col-span-3 space-y-1">
                                <span className="text-xs font-serif font-black text-indigo-400 block">{cs.state}</span>
                                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-mono font-black px-2 py-0.5 rounded inline-block">Vowel Vowelling: {cs.vowelMark}</span>
                              </div>
                              <div className="md:col-span-9 space-y-1.5">
                                <p className="text-xs font-mono leading-relaxed"><strong className="opacity-80">Syntactic Role:</strong> <span className="opacity-60">{cs.grammaticalFunction}</span></p>
                                <p className="text-xs font-mono leading-relaxed"><strong className="opacity-80">Semantic Shift:</strong> <span className="opacity-60">{cs.meaningShift}</span></p>
                                <div className={`p-2 border border-current/10 rounded-lg flex justify-between items-center mt-1 ${listBgClass}`}>
                                  <span className="text-xs font-serif text-right">{cs.example}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {irabAnalysis.irregularNotes && (
                          <div className="p-4 border border-indigo-500/10 bg-indigo-500/[0.02] rounded-xl space-y-1">
                            <span className="text-[10px] font-mono font-black uppercase tracking-wider opacity-60 block">Irregular Inflection Paradigm Notes</span>
                            <p className="text-xs opacity-60 leading-relaxed italic">{irabAnalysis.irregularNotes}</p>
                          </div>
                        )}

                        <div className="p-3 border border-dashed border-current/10 text-[10px] font-mono text-center opacity-50 rounded-lg">
                          Syntactic paradigm mapping generated server-side using Gemini model: gemini-3.1-flash-lite
                        </div>

                      </div>
                    ) : (
                      <div className="p-8 text-center border rounded-xl border-dashed border-current/10 space-y-4">
                        <p className="text-xs opacity-50">Would you like a scholarly paradigm shift breakdown compiled on-the-fly for this word form?</p>
                        <button
                          type="button"
                          onClick={() => loadDeepIrabShifts(activeDetailWord)}
                          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-mono text-[10px] font-bold rounded-lg transition-all transform hover:scale-105 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> COMPILE WITH GEMINI
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {/* TAB 3: BALAGHAH / RHETORIC */}
                {activeDetailTab === 'rhetoric' && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    <div className="space-y-4">
                      <div className="p-4 border border-current/10 bg-current/5 rounded-xl space-y-2">
                        <h5 className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5 border-b border-current/5 pb-1 select-none">
                          <Compass className="w-4 h-4 text-amber-400" /> Lane's Lexical Definitions
                        </h5>
                        <p className="text-xs opacity-70 leading-relaxed text-left">
                          This word's root form <strong className="font-serif text-indigo-400">"{activeDetailWord.root}"</strong> derives from classical Semitic foundations. In classic definitions, it denotes the underlying action model of organizing, protecting, and establishing patterns. The choice of the noun form here amplifies the permanence and qualitative mastery compared to a transitory verb state.
                        </p>
                      </div>

                      <div className="p-4 border border-current/10 bg-current/5 rounded-xl space-y-2">
                        <h5 className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 flex items-center gap-1.5 border-b border-current/5 pb-1 select-none">
                          <Brain className="w-4 h-4 text-emerald-400 animate-pulse" /> Rhetorical (Balāghah) Insights
                        </h5>
                        <p className="text-xs opacity-70 leading-relaxed text-left">
                          The selection of this pattern (Form or Wazn) represents intensive magnification. Rather than using standard nouns, the Quran often implements tailored dynamic derivations to create phonetic harmony (Saj') with ending verses while reinforcing the thematic majesty of the Surah.
                        </p>
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Close footer */}
              <div className="p-4 border-t border-current/10 bg-current/5 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setActiveDetailWord(null);
                    setIrabAnalysis(null);
                  }}
                  className="px-4 py-2 border border-current/20 hover:bg-current/10 font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  CLOSE MASTER EXPLORER
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
