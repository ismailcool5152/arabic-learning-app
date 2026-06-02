import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutTheme } from '../types';
import { 
  Compass, 
  Brain, 
  Sparkles, 
  RefreshCw, 
  Eye, 
  BookOpen, 
  ArrowRight, 
  CornerDownRight, 
  Mic, 
  Quote, 
  Search, 
  Activity, 
  Sparkle, 
  AlertCircle,
  HelpCircle,
  Volume2
} from 'lucide-react';

interface Props {
  theme: LayoutTheme;
}

interface Taster {
  id: string;
  title: string;
  device: string;
  arabicDevice: string;
  category: 'bayan' | 'maani' | 'badi';
  verseRef: string;
  arabicText: string;
  highlightedText: string;
  translation: string;
  plainSpeech: string;
  academicExplanation: string;
  rhetoricalImpact: string;
}

const TASTERS_DATA: Taster[] = [
  {
    id: "night-breath",
    title: "The Breathing Night",
    device: "Metaphor (Istiʿārah)",
    arabicDevice: "استعارة مكنية",
    category: "bayan",
    verseRef: "Surah At-Takwir 81:18",
    arabicText: "وَالَّيْلِ إِذَا تَنَفَّسَ",
    highlightedText: "تَنَفَّسَ",
    translation: "And by the night when it breathes.",
    plainSpeech: "And by the night when the morning light gradually arrives.",
    academicExplanation: "The night is personified as a living soul taking a slow, awakening sigh. By applying 'tanaffasa' (breathing) to the transition of twilight, the Quran links the biological necessity of life-giving oxygen with the cosmic rise of morning light. It converts a physical event (the movement of air and dawn) into a highly deliberate, spiritual act of breathing, reminding of divine consciousness.",
    rhetoricalImpact: "Evokes an intense feeling of comfort, tranquility, and rebirth. It removes the fear of crushing, static night by transforming darkness into a living medium that gracefully expands to yield light."
  },
  {
    id: "igniting-head",
    title: "The Fire of Age",
    device: "Metaphor (Istiʿārah)",
    arabicDevice: "استعارة",
    category: "bayan",
    verseRef: "Surah Maryam 19:4",
    arabicText: "وَاشْتَعَلَ الرَّأْسُ شَيْبًا",
    highlightedText: "وَاشْتَعَلَ الرَّأْسُ",
    translation: "And the head flared/ignited with grey hair.",
    plainSpeech: "And my hair turned grey due to old age.",
    academicExplanation: "Prophet Zechariah expresses his severe weakness. Instead of stating 'grey hair spread across my head,' the noun 'head' is made the direct subject of 'ishta'ala' (ignited/flared up). Specifying grey hair (shayba) as a clarifying accusative particle portrays grey locks as fierce, uncontrollable flames consuming dry wood. Fire spreads rapidly, silently, and irreversibly; so too did frailty consume his vitality.",
    rhetoricalImpact: "Conveys an overwhelming visual sense of urgency, physical decay, and absolute humility, explaining why his prayer for an heir was so deeply intense and vulnerable."
  },
  {
    id: "shift-intimacy",
    title: "The Shift of Communion",
    device: "Perspective Shift (Iltifāt)",
    arabicDevice: "التفات",
    category: "maani",
    verseRef: "Surah Al-Fatihah 1:1-5",
    arabicText: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ... إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    highlightedText: "إِيَّاكَ نَعْبُدُ",
    translation: "All praise belongs to Allah... Thee alone we worship and Thee alone we ask for help.",
    plainSpeech: "All praise belongs to Him, Lord of the Worlds... We worship Him and ask Him for help.",
    academicExplanation: "The Surah begins by addressing Allah in the third person: 'All praise belongs to Allah (Him)... Master of the Day (His).' This establishes a objective, awe-filled baseline of theology. However, as the human heart aligns its praise and enters a state of near-presence, the grammar suddenly shifts to direct second-person address: 'Thee (You) alone we worship!' This sudden syntactic transition from 'talking about Him' to 'talking to Him' represents the spiritual ascent of the believer.",
    rhetoricalImpact: "Brings immediate emotional warmth and safety. It mirrors the transition from theological knowledge (objective) to ecstatic personal prayer (relational communion)."
  },
  {
    id: "exclusivity-order",
    title: "Sole Devotion",
    device: "Restriction (Qaṣr & Haṣr)",
    arabicDevice: "قصر / حصر",
    category: "maani",
    verseRef: "Surah Al-Fatihah 1:5",
    arabicText: "إِيَّاكَ نَعْبُدُ",
    highlightedText: "إِيَّاكَ نَعْبُدُ",
    translation: "Thee alone we worship (Exclusive Restriction).",
    plainSpeech: "Na'budu iyyāka (We worship You).",
    academicExplanation: "In standard Arabic, the verb precedes the object: 'Na'budu-ka' (We worship You). While semantically correct, this does not grammatically rule out worshipping others alongside. By pulling the object 'Iyyāka' (You/Thee) to the very front (Taqdim al-Ma'ful), the clause converts into exclusive restrictiveness. It dictates: 'Only You we worship, and none else.'",
    rhetoricalImpact: "Asserts absolute Monotheism (Tawhid) in a single sentence structure. Every time the worshipper recites this, the syntax itself guards them from associating partners with God."
  },
  {
    id: "hand-neck",
    title: "The Visuals of Greed",
    device: "Metonymy (Kināyah)",
    arabicDevice: "كناية",
    category: "bayan",
    verseRef: "Surah Al-Isra 17:29",
    arabicText: "وَلَا تَجْعَلْ يَدَكَ مَغْلُولَةً إِلَىٰ عُنُقِكَ وَلَا تَبْسُطْهَا",
    highlightedText: "يَدَكَ مَغْلُولَةً إِلَىٰ عُنُقِكَ",
    translation: "And do not make your hand chained to your neck, nor stretch it out completely.",
    plainSpeech: "Do not be excessively stingy, and do not be excessively wasteful.",
    academicExplanation: "The Quran replaces conceptual instructions with dramatic, muscular postures. Stinginess is illustrated as a hand chained or handcuffed to one's neck, expressing the physical inability of a greedy person to perform charitable acts. Recklessness is drawn as a flat, completely open palm from which everything slides out, leaving absolutely nothing behind.",
    rhetoricalImpact: "Deters both harmful extreme postures through visceral, uncomfortable physical metaphors, urging the human mind to settle in the beautiful middle path of ease."
  },
  {
    id: "mirrored-cycles",
    title: "Mirror Antithesis",
    device: "Opposition (Ṭibāq)",
    arabicDevice: "طباق السلب والايجاب",
    category: "badi",
    verseRef: "Surah Al-Najm 53:43-44",
    arabicText: "وَأَنَّهُۥ هُوَ أَضْحَكَ وَأَبْكَىٰ... وَأَنَّهُۥ هُوَ أَمَاتَ وَأَحْيَا",
    highlightedText: "أَضْحَكَ وَأَبْكَىٰ ... أَمَاتَ وَأَحْيَا",
    translation: "And that He it is who makes laugh and makes weep... and makes die and gives life.",
    plainSpeech: "God controls laughter, weeping, death, and life.",
    academicExplanation: "Ṭibāq is the juxtaposition of semantic antonyms. Here, the absolute extremes of feelings (laughter vs. tears) and bio-existential states (death vs. life) are structurally aligned. Re-affirming 'Annahu Huwa' (And that He, Himself...) separates these forces from mechanical nature and attributes them to a singular, caring Divine will.",
    rhetoricalImpact: "Instills a grand perspective of divine comfort during times of weeping or loss, showing that human emotional and biological cycles are intentional steps within a masterfully designed tapestry."
  }
];

export default function BalaghahTasters({ theme }: Props) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // State
  const [activeCategory, setActiveCategory] = useState<'all' | 'bayan' | 'maani' | 'badi'>('all');
  const [selectedTaster, setSelectedTaster] = useState<Taster | null>(TASTERS_DATA[0]);
  const [isShowingComparison, setIsShowingComparison] = useState<boolean>(true);

  // AI Live Custom Analyzer State
  const [userVerse, setUserVerse] = useState<string>('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [customKey, setCustomKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  // Theme Stylings
  const themeStyles = {
    card: isParchment 
      ? 'bg-[#faf6ed] border-[#ebd8c3]/80 text-[#2c241e]' 
      : isCosmic 
        ? 'bg-[#0a0b22] border-indigo-500/15 text-indigo-50 shadow-indigo-950/20 shadow-md' 
        : 'bg-white border-emerald-100 text-slate-800 shadow-slate-100 shadow-md',
    itemHover: isParchment
      ? 'hover:bg-[#ebd8c3]/45'
      : isCosmic
        ? 'hover:bg-indigo-500/10'
        : 'hover:bg-emerald-500/5',
    activeTab: isParchment
      ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm'
      : isCosmic
        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/30'
        : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20',
    inactiveTab: isParchment
      ? 'bg-[#dfceb6]/40 text-[#2c241e] hover:bg-[#dfceb6]/75'
      : isCosmic
        ? 'bg-[#11122d]/60 text-indigo-300 hover:bg-indigo-900/30'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80',
    titleGradient: isParchment
      ? 'text-[#483320]'
      : isCosmic
        ? 'bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent'
        : 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent',
    glowingBadge: isParchment
      ? 'bg-[#dfceb6] text-[#2c241e] border-[#8c6239]/20 font-bold'
      : isCosmic
        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 font-semibold'
        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-semibold',
    accentText: isParchment
      ? 'text-[#8c6239] font-semibold'
      : isCosmic
        ? 'text-indigo-400 font-semibold'
        : 'text-emerald-600 font-semibold',
    contrastCard: isParchment
      ? 'bg-[#dfceb6]/25 border border-[#8c6239]/10'
      : isCosmic
        ? 'bg-indigo-950/15 border border-indigo-500/5'
        : 'bg-slate-50 border border-slate-100',
    inputField: isParchment
      ? 'bg-[#eae3d2] text-[#2c241e] placeholder-[#2c241e]/50 border-[#dfd2be] focus:ring-[#8c6239] focus:border-[#8c6239]'
      : isCosmic
        ? 'bg-[#0b0c20] text-indigo-100 placeholder-indigo-300/30 border-indigo-500/20 focus:ring-indigo-500 focus:border-indigo-500'
        : 'bg-slate-50 text-slate-800 placeholder-slate-400 border-slate-200 focus:ring-emerald-500 focus:border-emerald-500',
    categoryIcon: (cat: string) => {
      switch(cat) {
        case 'bayan':
          return isParchment ? 'bg-[#c99a63]/20 text-[#8c6239]' : isCosmic ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-500/10 text-amber-600';
        case 'maani':
          return isParchment ? 'bg-cyan-900/15 text-cyan-800' : isCosmic ? 'bg-cyan-500/15 text-cyan-400' : 'bg-cyan-500/10 text-cyan-600';
        case 'badi':
          return isParchment ? 'bg-purple-900/15 text-purple-800' : isCosmic ? 'bg-purple-500/15 text-purple-400' : 'bg-purple-500/10 text-purple-600';
        default:
          return 'bg-slate-100 text-slate-600';
      }
    }
  };

  // Preset verses for user ease
  const VERSE_PRESETS = [
    { text: "وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ", ref: "Duha 93:1-2" },
    { text: "وَالْقَمَرِ إِذَا تَلَاهَا", ref: "Shams 91:2" },
    { text: "فَلَا أُقْسِمُ بِالْخُنَّسِ ٱلْجَوَارِ ٱلْكُنَّسِ", ref: "Takwir 81:15-16" },
    { text: "أَلَمْ نَجْعَلِ ٱلْأَرْضَ مِهَـٰدًا وَٱلْجِبَالَ أَوْتَادًا", ref: "Naba 78:6-7" }
  ];

  const handleAiAnalyze = async () => {
    if (!userVerse.trim()) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/analyze-balaghah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verseText: userVerse,
          customApiKey: customKey || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to the analysis engine.');
      }
      setAiResult(data);
    } catch (err: any) {
      setAnalysisError(err.message || 'An unexpected error occurred during AI analysis. Confirm your API key configuration.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredTasters = TASTERS_DATA.filter(item => 
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  return (
    <div className="space-y-8 select-none">
      
      {/* Header Intro Banner */}
      <div className={`p-6 md:p-8 rounded-2xl border ${themeStyles.card} text-center space-y-3 relative overflow-hidden bg-radial-at-t`}>
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Sparkle className="w-40 h-40" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Mic className="w-5 h-5" />
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">Classical Rhetoric</span>
        </div>
        <h3 className={`text-2xl md:text-3xl font-serif font-black tracking-tight ${themeStyles.titleGradient}`}>
          Balāghah (Rhetoric) Tasters
        </h3>
        <p className="text-xs md:text-sm opacity-70 max-w-2xl mx-auto leading-relaxed">
          Embark on an archaeological study of the Quranic language. Balāghah represents the ultimate pinnacle of Arabic eloquence, mapping literary genius, word placement dynamics, and psychological resonance.
        </p>
      </div>

      {/* Grid containing Curated Tasters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Curated List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
              <Compass className="w-4 h-4" /> 1. Select a Taster
            </h4>
          </div>

          {/* Filtering buttons */}
          <div className="grid grid-cols-4 gap-1 p-0.5 border border-current/10 bg-current/[0.02] rounded-xl font-mono text-[9px] font-bold text-center">
            {(['all', 'bayan', 'maani', 'badi'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                  activeCategory === cat ? themeStyles.activeTab : 'opacity-70 hover:opacity-100 hover:bg-current/5'
                }`}
              >
                {cat === 'all' ? 'All' : cat === 'bayan' ? 'Bayān' : cat === 'maani' ? 'Maʿānī' : 'Badīʿ'}
              </button>
            ))}
          </div>

          {/* Core Tasters List */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1 select-none scrollbar-thin">
            {filteredTasters.map((taste) => {
              const isActive = selectedTaster?.id === taste.id;
              return (
                <div
                  key={taste.id}
                  onClick={() => {
                    setSelectedTaster(taste);
                    setAiResult(null); // Clear custom AI when selecting static taster
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden group ${
                    isActive 
                      ? isParchment 
                        ? 'bg-[#dfceb6] border-[#8c6239]/50 text-[#2c241e]' 
                        : isCosmic 
                          ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-100' 
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900'
                      : `${themeStyles.card} ${themeStyles.itemHover}`
                  }`}
                >
                  <div className={`p-2 rounded-lg text-xs font-mono font-bold font-black ${themeStyles.categoryIcon(taste.category)}`}>
                    {taste.category === 'bayan' ? 'BY' : taste.category === 'maani' ? 'MN' : 'BD'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-serif font-black truncate">{taste.title}</p>
                      <span className="text-[9px] font-mono opacity-50">{taste.verseRef}</span>
                    </div>
                    <p className="text-[10px] opacity-60 truncate font-mono">{taste.device}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Taster Detail */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedTaster && !aiResult && (
              <motion.div
                key={selectedTaster.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`p-5 md:p-6 rounded-2xl border ${themeStyles.card} h-full flex flex-col justify-between space-y-6`}
              >
                {/* Header card info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-current/5 pb-3">
                    <div className="space-y-0.5">
                      <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 border rounded-full ${themeStyles.glowingBadge}`}>
                        {selectedTaster.category === 'bayan' ? 'Al-Bayān (Imagery)' : selectedTaster.category === 'maani' ? 'Al-Maʿānī (Grammatical Mechanics)' : 'Al-Badīʿ (Ornaments)'}
                      </span>
                      <h4 className="text-xl font-serif font-black mt-1.5">{selectedTaster.title}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-serif italic text-indigo-400 font-bold block">{selectedTaster.arabicDevice}</span>
                      <span className="text-[10px] font-mono opacity-40">{selectedTaster.verseRef}</span>
                    </div>
                  </div>

                  {/* Gigantic Callout of the Arabic text */}
                  <div className={`p-5 rounded-2xl ${themeStyles.contrastCard} text-center space-y-2 relative overflow-hidden flex flex-col items-center justify-center`}>
                    <p className="text-4xl font-serif font-black leading-relaxed tracking-wide text-center">
                      {selectedTaster.arabicText.split(" ").map((word, idx) => {
                        const cleanWord = word.replace(/[|()]/g, '');
                        const isMatch = cleanWord.includes(selectedTaster.highlightedText) || selectedTaster.highlightedText.includes(cleanWord);
                        return (
                          <span 
                            key={idx} 
                            className={`mx-1 inline-block select-all transition-all duration-300 ${
                              isMatch ? themeStyles.accentText : 'opacity-80'
                            }`}
                          >
                            {word}
                          </span>
                        );
                      })}
                    </p>
                    <p className="text-xs opacity-70 italic font-mono text-center">"{selectedTaster.translation}"</p>
                  </div>

                  {/* Contrast comparison playground */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold tracking-wider uppercase opacity-55">Rhetorical Elevation</span>
                      <button 
                        onClick={() => setIsShowingComparison(prev => !prev)}
                        className={`text-[9px] font-mono underline hover:text-indigo-400 font-bold px-2 py-0.5 cursor-pointer`}
                      >
                        {isShowingComparison ? "Hide Plain Speech" : "Show Plain Speech Comparison"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isShowingComparison && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`grid grid-cols-1 md:grid-cols-2 gap-3.5`}
                        >
                          {/* Standard plain statement */}
                          <div className={`p-3 rounded-xl border border-current/10 bg-current/[0.01]`}>
                            <p className="text-[9px] font-mono font-bold uppercase opacity-40 flex items-center gap-1">
                              <Eye className="w-3 h-3 text-rose-400" /> Standard/Plain Arabic phrasings
                            </p>
                            <p className="text-xs font-serif mt-1 opacity-70">{selectedTaster.plainSpeech}</p>
                          </div>

                          {/* Sublime elevated statement */}
                          <div className={`p-3 rounded-xl border border-indigo-500/10 bg-indigo-500/[0.02]`}>
                            <p className="text-[9px] font-mono font-bold uppercase text-indigo-400 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 animate-spin duration-3000" /> Quranic Rhetoric (Balāghah)
                            </p>
                            <p className="text-xs font-serif mt-1 font-extrabold text-indigo-300">{selectedTaster.translation}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* scholastic explanation tabs */}
                  <div className="space-y-4 pt-2">
                    <div className="p-4 rounded-xl border border-current/5 bg-current/[0.01] space-y-2">
                      <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 border-b border-current/5 pb-1 select-none">
                        <Brain className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> 1. Scholastic Analytical Commentary
                      </h5>
                      <p className="text-xs opacity-80 leading-relaxed text-left font-serif whitespace-pre-line">
                        {selectedTaster.academicExplanation}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-current/5 bg-current/[0.01] space-y-2">
                      <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 border-b border-current/5 pb-1 select-none">
                        <Quote className="w-3.5 h-3.5 text-indigo-400" /> 2. Impact on the Human Conscience
                      </h5>
                      <p className="text-xs opacity-80 leading-relaxed text-left italic font-serif">
                        {selectedTaster.rhetoricalImpact}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-current/5 pt-3.5 flex items-center justify-between text-[10px] font-mono opacity-50">
                  <span>Traditional Source: Balāghah Classical Manuals</span>
                  <span>Click left items to explore other styles</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Interactive API Explorer Section */}
      <div className={`p-6 md:p-8 rounded-2xl border ${themeStyles.card} space-y-6 relative overflow-hidden bg-radial-at-b`}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Brain className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-black uppercase opacity-65 tracking-widest">Interactive Laboratory</span>
          </div>
          <h4 className="text-lg font-serif font-black">AI Live Rhetoric Verse Analyzer</h4>
          <p className="text-xs opacity-70 leading-relaxed">
            Have a custom verse or phrase you're inspecting? Input any physical Arabic verse or script, and our expert AI system will index, classify, and isolate its rhetorical features dynamically in accordance with traditional models of eloquence.
          </p>
        </div>

        {/* Input box */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold">Paste Arabic Verse text:</span>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="e.g. أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَـٰبِ ٱلْفِيلِ... or scroll presets"
                className={`flex-1 py-3 px-4 rounded-xl border text-sm font-serif ${themeStyles.inputField}`}
                value={userVerse}
                onChange={(e) => {
                  setUserVerse(e.target.value);
                  setAiResult(null); // Clear previous
                }}
              />
              <button
                type="button"
                onClick={handleAiAnalyze}
                disabled={isAnalyzing || !userVerse.trim()}
                className={`py-3 px-6 rounded-xl font-mono text-xs font-bold transition-all text-white flex items-center justify-center gap-2 cursor-pointer select-none ${
                  isAnalyzing || !userVerse.trim()
                    ? 'bg-slate-700/50 opacity-50 cursor-not-allowed'
                    : isParchment
                      ? 'bg-[#8c6239] hover:bg-[#724f2d] shadow-sm'
                      : isCosmic
                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-950/20'
                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-950/20'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    SCHOLASTIC ANALYSIS IN PROGRESS...
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    DECODE BALĀGHAH WITH AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Presets and Key Configuration */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono opacity-50">Verse Presets:</span>
              {VERSE_PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setUserVerse(p.text);
                    setAiResult(null);
                  }}
                  className={`px-2 py-1 rounded bg-current/5 border border-current/10 hover:border-indigo-500/30 font-mono text-[9px] cursor-pointer transition-all`}
                >
                  {p.ref}
                </button>
              ))}
            </div>

            <div className="relative font-mono text-[10px]">
              <button
                onClick={() => setShowKeyInput(p => !p)}
                className="opacity-60 underline hover:opacity-100 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3 h-3" /> {showKeyInput ? "Hide API Details" : "Use Custom API Key (Optional)"}
              </button>
              
              {showKeyInput && (
                <div className={`absolute bottom-full right-0 mb-2 p-3 rounded-lg border shadow-xl w-64 space-y-1.5 z-40 ${themeStyles.card}`}>
                  <p className="text-[9px] opacity-75">Provide a custom GEMINI_API_KEY from your Google AI Studio if the system credentials are unconfigured:</p>
                  <input
                    type="password"
                    placeholder="Enter Custom Key..."
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    className={`w-full text-[10px] px-2 py-1 rounded border ${themeStyles.inputField}`}
                  />
                  <p className="text-[8px] opacity-40">Stored temporarily inside client local state memory.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Analysis Result Board */}
        <div className="relative">
          {isAnalyzing && (
            <div className="border border-indigo-500/10 bg-indigo-505/[0.01] p-12 rounded-xl text-center flex flex-col items-center justify-center space-y-4">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full animate-ping" />
                <div className="absolute inset-2 border-4 border-indigo-500/40 rounded-full animate-pulse" />
                <Brain className="w-5 h-5 text-indigo-400 animate-spin duration-3000" />
              </div>
              <div className="space-y-1">
                <h5 className="font-serif font-black text-xs text-indigo-400">Consulting Classical Rhetorics...</h5>
                <p className="text-[10px] opacity-60">Leveraging traditional linguistic principles of Al-Jurjani & Al-Balāghah manuals.</p>
              </div>
            </div>
          )}

          {analysisError && (
            <div className="border border-red-500/20 bg-red-500/5 p-4 rounded-xl flex items-start gap-2 text-rose-400 text-xs text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Analysis Terminated</p>
                <p className="opacity-80 mt-0.5">{analysisError}</p>
                <p className="text-[10px] opacity-50 mt-1">If the system key is empty, consider plugging your own key using the "Use Custom API Key" option above.</p>
              </div>
            </div>
          )}

          {aiResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5 animate-fadeIn text-left pt-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border border-current/10 bg-current/5 rounded-xl text-center space-y-1">
                  <span className="text-[9px] font-mono opacity-50 uppercase block">Queried Phrasing</span>
                  <span className="text-sm font-serif font-black truncate block Arabic font-extrabold text-right">{aiResult.verseText || userVerse}</span>
                </div>
                <div className="p-3 border border-current/10 bg-current/5 rounded-xl text-center space-y-1">
                  <span className="text-[9px] font-mono opacity-50 uppercase block">Overall Rhetorical Tone</span>
                  <span className="text-xs font-serif font-bold text-indigo-400 capitalize block">{aiResult.overallTone || "Majestic"}</span>
                </div>
                <div className="p-3 border border-current/10 bg-current/5 rounded-xl text-center space-y-1">
                  <span className="text-[9px] font-mono opacity-50 uppercase block">Thematic Connection</span>
                  <span className="text-xs font-serif opacity-80 leading-tight block">{aiResult.thematicConnection || "Demonstrating divine majesty & power."}</span>
                </div>
              </div>

              {/* Devices found bento grid */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold opacity-50 uppercase">Rhetorical Devices Detected ({aiResult.devices?.length || 0})</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiResult.devices?.map((dev: any, i: number) => {
                    const isBayan = dev.category === 'bayan';
                    const isMaani = dev.category === 'maani';
                    return (
                      <div key={i} className={`p-4 border border-current/10 bg-current/5 rounded-xl space-y-4 flex flex-col justify-between`}>
                        <div className="space-y-3">
                          
                          {/* Device labels */}
                          <div className="flex items-center justify-between border-b border-current/5 pb-2">
                            <div>
                              <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isBayan 
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' 
                                  : isMaani 
                                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' 
                                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/25'
                              }`}>
                                {isBayan ? 'Al-Bayān' : isMaani ? 'Al-Maʿānī' : 'Al-Badīʿ'}
                              </span>
                              <h5 className="text-sm font-serif font-black mt-1.5">{dev.deviceName}</h5>
                            </div>
                            <span className="text-xs font-serif font-bold opacity-75">{dev.arabicTerm}</span>
                          </div>

                          {/* Words highlighted */}
                          <div className={`p-2.5 rounded-lg text-center ${themeStyles.contrastCard}`}>
                            <p className="text-xl font-serif text-indigo-400 font-extrabold">{dev.targetPhrase}</p>
                            <span className="text-[10px] font-mono opacity-60">"{dev.literalTranslation}"</span>
                          </div>

                          {/* Academic Details */}
                          <div className="space-y-2 text-xs">
                            <p className="leading-relaxed font-serif opacity-80 text-left">
                              <strong className="font-mono text-[10px] opacity-50 block uppercase">Analytical Commentary</strong>
                              {dev.academicExplanation}
                            </p>
                            <p className="leading-relaxed font-serif opacity-80 text-left italic">
                              <strong className="font-mono text-[10px] opacity-50 block uppercase not-italic">Rhetorical Conscience Impact</strong>
                              "{dev.rhetoricalImpact}"
                            </p>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
}
