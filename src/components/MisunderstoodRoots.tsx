import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutTheme } from '../types';
import { 
  AlertTriangle, 
  HelpCircle, 
  Compass, 
  BookOpen, 
  Search, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  AlertCircle,
  CheckCircle,
  Layers,
  ChevronRight,
  Database
} from 'lucide-react';

interface Props {
  theme: LayoutTheme;
}

interface MisunderstoodRoot {
  id: string;
  rootLetters: string; // e.g. "ظ - ل - م"
  transliteration: string; // e.g. "Z-L-M"
  term: string; // e.g. "Zulm"
  flatTranslation: string; // e.g. "Oppression / Darkness"
  classicalLexiconMeaning: string; // "To place something in other than its proper place..."
  etymologicalOrigin: string; // "From desert speech where shifting water wells..."
  scholasticResolution: string; // Deep discussion
  verses: {
    verseRef: string;
    arabicText: string;
    translation: string;
    rhetoricalInsight: string;
  }[];
}

const STATIC_MISUNDERSTOOD_DATA: MisunderstoodRoot[] = [
  {
    id: "zlm",
    rootLetters: "ظ - ل - م",
    transliteration: "Z-L-M",
    term: "Zulm",
    flatTranslation: "Oppression / Sin / Wrongdoing",
    classicalLexiconMeaning: "To displace an element or force; putting a thing in other than its correct place (Wad'u al-shay' fi ghayri mawdi'ih). It is the absolute opposite of 'Adl (Justice/Equilibrium) which is keeping everything in its perfect balance.",
    etymologicalOrigin: "In classical Bedouin speech, 'Zalama al-Sadi' meant digging into soil that is not the natural reservoir of water. It represents violating structural equilibrium, disrupting nature's designated boundaries. Darkness (Zulmat) is simply the displacement of light.",
    scholasticResolution: "When the Quran states that Allah does not do 'Zulm' to anyone, it is not merely about emotional kindness. It means He is the Absolute Sovereign of cosmic order who never misplaces a atom or disrupts natural laws. Similarly, when a human commits 'Zulm' against themselves, they have displaced their own spiritual potential by putting vice into the container designed for virtue.",
    verses: [
      {
        verseRef: "Surah Al-Sharh / Luqman 31:13",
        arabicText: "إِنَّ ٱلشِّرْكَ لَظُلْمٌ عَظِيمٌ",
        translation: "Indeed, associating partners with Him is a monumental Zulm (displacement).",
        rhetoricalInsight: "Shirk (polytheism) is not a physical injury to God; it is the ultimate structural displacement: taking praise and worship designed for the Absolute Creator and placing them in the vessel of a creation."
      },
      {
        verseRef: "Surah Al-Baqarah 2:35",
        arabicText: "وَلَا تَقْرَبَا هَـٰذِهِ ٱلشَّجَرَةَ فَتَكُونَا مِنَ ٱلظَّـٰلِمِينَ",
        translation: "...lest you both become of the Zalimeen (displacers).",
        rhetoricalInsight: "Adam and Eve shifted their state of being from a designated boundless garden to a restrictive Earth through a misstep. They violated the boundary container set by God, hence displacing themselves from ease."
      }
    ]
  },
  {
    id: "fsq",
    rootLetters: "ف - س - ق",
    transliteration: "F-S-Q",
    term: "Fisq",
    flatTranslation: "Sin / Rebellion / Wickedness",
    classicalLexiconMeaning: "To exit or slip out of a natural protective casing, boundary, or shell.",
    etymologicalOrigin: "Derived from the ancient expression 'Fasaqati al-rutabah' (فَسَقَتِ الرُّطَبَةُ), describing a ripe date becoming so full of sweet pressure that it slips clean out of its protective skin. It was also used to describe a mouse exiting its burrow to cause quiet damage.",
    scholasticResolution: "Fisq is more than just raw sinning; it is when a creature attempts to survive outside of its designated divine protection law. The laws of Allah are not restrictive cages but a nurturing outer protective shell (like the date's skin). When a human commits Fisq, they tear through their own moral boundaries, leaving themselves exposed to corruption.",
    verses: [
      {
        verseRef: "Surah Al-Kahf 18:50",
        arabicText: "فَفَسَقَ عَنْ أَمْرِ رَبِّهِۦ",
        translation: "...so he slipped out (fasaqa) from the command of his Lord.",
        rhetoricalInsight: "Satan did not just 'disobey'; he burst through the boundary of grace and security of his Lord. It visualizes the tragedy of leaving the natural, life-safe environment of obedience for raw exposure."
      }
    ]
  },
  {
    id: "drb",
    rootLetters: "ض - ر - ب",
    transliteration: "D-R-B",
    term: "Daraba",
    flatTranslation: "To beat / To hit / To strike",
    classicalLexiconMeaning: "To project a trace, boundary, or pattern outward; to set forth a path or travel.",
    etymologicalOrigin: "In classical Arabic, 'Daraba' is used for travel ('daraba fi al-ard' - to strike out on the earth for trade), 'daraba al-dirham' (to strike/mint coins, establishing their stamp), and 'daraba al-khaymah' (to pitch a tent, laying down its boundaries). Only in narrow, physical contexts does it mean striking an object.",
    scholasticResolution: "Modern critics often cite 'Daraba' in marital resolution or instructions out of context. Classically, the word represents an outward projection of boundaries or separation. It represents laying down an active, visible halt or turning away, establishing clear demarcated territories to avoid physical collision, rather than raw physical beating. In Quranic rhetoric, parables are 'coined' (daraba mathal) to pitch conceptual templates into human hearts.",
    verses: [
      {
        verseRef: "Surah Al-Muzzammil 73:20",
        arabicText: "يَضْرِبُونَ فِى ٱلْأَرْضِ يَبْتَغُونَ مِن فَضْلِ ٱللَّهِ",
        translation: "...and others traveling (yadriboona) through the land seeking Allah's bounty.",
        rhetoricalInsight: "This beautiful verse highlights travel as physical strokes on the earth. It portrays the footsteps of merchant travelers as deliberate strokes of a brush, etching pathways of livelihood across the deserts."
      },
      {
        verseRef: "Surah Ibrahim 14:24",
        arabicText: "أَلَمْ تَرَ كَيْفَ ضَرَبَ ٱللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً",
        translation: "Have you not considered how Allah strikes/sets forth a parable...",
        rhetoricalInsight: "To 'strike' a parable implies minting it—making a profound concept solid and accessible, just like hot liquid gold is struck into currency to make it circulate."
      }
    ]
  },
  {
    id: "kfr",
    rootLetters: "ك - ف - ر",
    transliteration: "K-F-R",
    term: "Kafir / Kufr",
    flatTranslation: "Infidel / Unbeliever / Heretic",
    classicalLexiconMeaning: "To cover, conceal, or bury a bounty or truth in darkness. The opposite of Shukr (Gratitude, which means to exhibit and express bounty).",
    etymologicalOrigin: "In pre-Islamic desert culture, the farmer was literally called a 'Kafir' (كَافِر) because he buries seeds in the dark soil to conceal them from the sky. Night is also called a 'Kafir' because it covers everything in absolute shadow.",
    scholasticResolution: "Calling someone a 'Kafir' doesn't mean they are simply of a different group. It describes a psychological condition: someone who recognizes a truth, benefit, or blessing, yet deliberately covers and buries it. It refers to the conscious choice to hide divine signs and show ingratitude for life.",
    verses: [
      {
        verseRef: "Surah Al-Hadid 57:20",
        arabicText: "كَمَثَلِ غَيْثٍ أَعْجَبَ ٱلْكُفَّارَ نَبَاتُهُۥ",
        translation: "...like rain whose plant-growth pleases the farmers (al-kuffar)...",
        rhetoricalInsight: "The Quran neutralizes sectarian heat by using 'Kuffar' in its literal, physical sense here: farmers. It beautifully anchors the word back to its natural agricultural roots of concealing seeds in protective soil."
      }
    ]
  },
  {
    id: "jhd",
    rootLetters: "ج - ه - د",
    transliteration: "J-H-D",
    term: "Jihad / Juhd",
    flatTranslation: "Holy War / Physical Violence",
    classicalLexiconMeaning: "To exhaustively expend one's absolute limits of capacity and strength (Juhd) to overcome extreme friction or difficulty.",
    etymologicalOrigin: "Classical lexicons define 'Jahd' as the state of difficulty or exhaustion, and 'Juhd' as physical capacity. Bedouins used it to describe a beast of burden carrying the maximum weight possible, or the intense churning of milk to extract high-quality butter.",
    scholasticResolution: "Jihad is a lifelong process of resisting inertia. It is the active struggle to overcome internal spiritual weaknesses, societal stagnation, and moral friction near one's environment. Characterizing it merely as 'religious war' violates the expansive etymology of carrying heavy weight toward purification.",
    verses: [
      {
        verseRef: "Surah Al-Ankabut 29:6",
        arabicText: "وَمَن جَـٰهَدَ فَإِنَّمَا يُجَـٰهَدُ لِنَفْسِهِۦ",
        translation: "And whoever struggles (jahada), struggles only for his own soul.",
        rhetoricalInsight: "Struggling is portrayed as an internal distillation system. By expending effort against one's base ego, the believer purifies their spirit. The struggle flows inward before manifesting as beneficial outer work."
      }
    ]
  }
];

export default function MisunderstoodRoots({ theme }: Props) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Component States
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRootId, setSelectedRootId] = useState<string>(STATIC_MISUNDERSTOOD_DATA[0].id);

  // Dynamic AI Exploration State
  const [userQueryRoot, setUserQueryRoot] = useState<string>('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const [customKey, setCustomKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  // Core Style Mapper
  const styles = {
    card: isParchment 
      ? 'bg-[#faf6ed] border-[#ebd8c3]/80 text-[#2c241e]' 
      : isCosmic 
        ? 'bg-[#0a0b22] border-indigo-500/15 text-indigo-50 shadow-indigo-950/20 shadow-md' 
        : 'bg-white border-emerald-100 text-slate-800 shadow-slate-100 shadow-md',
    itemHover: isParchment
      ? 'hover:bg-[#ebd8c3]/40'
      : isCosmic
        ? 'hover:bg-indigo-500/10'
        : 'hover:bg-emerald-500/5',
    activeTab: isParchment
      ? 'bg-[#8c6239] text-[#faf6ed]'
      : isCosmic
        ? 'bg-indigo-600 text-white'
        : 'bg-emerald-600 text-white',
    accentText: isParchment
      ? 'text-[#8c6239] font-black'
      : isCosmic
        ? 'text-indigo-400 font-extrabold'
        : 'text-emerald-600 font-extrabold',
    contrastBg: isParchment
      ? 'bg-[#dfceb6]/20 border border-[#8c6239]/10'
      : isCosmic
        ? 'bg-indigo-950/15 border border-indigo-500/5'
        : 'bg-slate-50 border border-slate-100',
    inputStyle: isParchment
      ? 'bg-[#eae3d2] text-[#2c241e] placeholder-[#2c241e]/50 border-[#dfd2be] focus:ring-[#8c6239] focus:border-[#8c6239]'
      : isCosmic
        ? 'bg-[#0b0c20] text-indigo-100 placeholder-indigo-300/30 border-indigo-500/20 focus:ring-indigo-500'
        : 'bg-slate-50 text-slate-800 placeholder-slate-400 border-slate-200 focus:ring-emerald-500',
    titleGradient: isParchment
      ? 'text-[#483320]'
      : isCosmic
        ? 'bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent'
        : 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent',
    glowingBadge: isParchment
      ? 'bg-[#dfceb6] text-[#2c241e] border-[#8c6239]/20'
      : isCosmic
        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
  };

  const currentStaticRoot = STATIC_MISUNDERSTOOD_DATA.find(r => r.id === selectedRootId);

  // Filter static list based on search text
  const filteredRoots = STATIC_MISUNDERSTOOD_DATA.filter(item => 
    item.rootLetters.includes(searchText) || 
    item.term.toLowerCase().includes(searchText.toLowerCase()) ||
    item.flatTranslation.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAiExamine = async () => {
    if (!userQueryRoot.trim()) return;
    setIsAnalyzing(true);
    setErrorText(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/analyze-misunderstood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rootText: userQueryRoot,
          customApiKey: customKey || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to retrieve classical root definitions.');
      }
      setAiResult(data);
    } catch (err: any) {
      setErrorText(err.message || 'An error occurred during etymological look-up. Please check API Key configuration.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 select-none">
      
      {/* Intro Heading Banner */}
      <div className={`p-6 md:p-8 rounded-2xl border ${styles.card} text-center space-y-3 relative overflow-hidden bg-radial-at-t`}>
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <BookOpen className="w-40 h-40" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase opacity-65">Ishtiqaat & Lexicography</span>
        </div>
        <h3 className={`text-2xl md:text-3xl font-serif font-black tracking-tight ${styles.titleGradient}`}>
          Frequently Misunderstood Roots
        </h3>
        <p className="text-xs md:text-sm opacity-70 max-w-2xl mx-auto leading-relaxed">
          Unveil how modern translations can sometimes collapse rich, multidimensional Arabic physical metaphors into flat legal or moral concepts. Discover classical interpretations through the lens of ancient Bedouin pastures and early lexicons.
        </p>
      </div>

      {/* Main Grid: Selector & Content Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Curated list of 5 pillars */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
              <Database className="w-4 h-4 text-rose-400" /> Curated Lexical Pillars
            </h4>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 opacity-40" />
              <input
                type="text"
                placeholder="Search by root (e.g. ظ-ل-م) or term..."
                className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border focus:outline-none ${styles.inputStyle}`}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 select-none">
            {filteredRoots.map((item) => {
              const active = selectedRootId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedRootId(item.id);
                    setAiResult(null); // Clear custom AI results when navigating curated terms
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between relative overflow-hidden group ${
                    active 
                      ? isParchment 
                        ? 'bg-[#dfceb6] border-[#8c6239]/50 text-[#2c241e]' 
                        : isCosmic 
                          ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-100' 
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900'
                      : `${styles.card} ${styles.itemHover}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-serif font-black bg-current/10 px-2.5 py-1 rounded-lg">
                      {item.rootLetters}
                    </span>
                    <div>
                      <p className="text-xs font-serif font-bold mb-0.5">{item.term} ({item.transliteration})</p>
                      <p className="text-[10px] opacity-60 max-w-[170px] truncate font-mono">Modern flat: {item.flatTranslation}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-45 group-hover:translate-x-0.5 transition-transform" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Active Detail card or AI examine board */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {currentStaticRoot && !aiResult && (
              <motion.div
                key={currentStaticRoot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`p-5 md:p-6 rounded-2xl border ${styles.card} space-y-6 text-left h-full flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  
                  {/* Title card header */}
                  <div className="flex items-start justify-between border-b border-current/5 pb-3">
                    <div>
                      <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 border rounded-full ${styles.glowingBadge}`}>
                        {currentStaticRoot.term} Study
                      </span>
                      <h4 className="text-xl font-serif font-black mt-2">
                        Root: {currentStaticRoot.rootLetters} ({currentStaticRoot.transliteration})
                      </h4>
                    </div>
                    <div className="bg-rose-500/10 text-rose-400 p-2.5 rounded-xl border border-rose-500/15">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                    </div>
                  </div>

                  {/* Root contrasts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-rose-500/[0.02] border border-rose-500/10 space-y-1">
                      <p className="text-[9px] font-mono font-black uppercase text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Modern Flat Translations
                      </p>
                      <p className="text-xs font-serif italic opacity-85 leading-relaxed">
                        "{currentStaticRoot.flatTranslation}"
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-1">
                      <p className="text-[9px] font-mono font-black uppercase text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 animate-bounce" /> Lexical Classical Core
                      </p>
                      <p className="text-xs font-serif font-extrabold text-emerald-400 leading-relaxed">
                        {currentStaticRoot.classicalLexiconMeaning}
                      </p>
                    </div>
                  </div>

                  {/* Bedouin origin */}
                  <div className={`p-4 rounded-xl ${styles.contrastBg} space-y-2`}>
                    <h5 className="text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 border-b border-current/5 pb-1 select-none">
                      <Compass className="w-3.5 h-3.5 opacity-60" /> Bedouin Physical Etymology (Ishtiqaat)
                    </h5>
                    <p className="text-xs opacity-80 font-serif leading-relaxed text-left">
                      {currentStaticRoot.etymologicalOrigin}
                    </p>
                  </div>

                  {/* High commentary */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-current/5 bg-current/[0.01] space-y-2">
                      <h5 className="text-[11px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 border-b border-current/5 pb-1 select-none">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Academic Scholastic Resolution
                      </h5>
                      <p className="text-xs opacity-80 leading-relaxed text-left font-serif whitespace-pre-line">
                        {currentStaticRoot.scholasticResolution}
                      </p>
                    </div>
                  </div>

                  {/* Verses representation */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold opacity-50 uppercase">Manifestation in Quranic Verses</span>
                    <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                      {currentStaticRoot.verses.map((v, i) => (
                        <div key={i} className="p-3.5 border border-current/5 rounded-xl bg-current/[0.01] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono opacity-50 block">{v.verseRef}</span>
                          </div>
                          <p className="text-lg font-serif font-black text-right pr-2 leading-relaxed select-all">
                            {v.arabicText}
                          </p>
                          <p className="text-xs italic opacity-75 font-serif">"{v.translation}"</p>
                          <p className="text-[11px] opacity-70 leading-relaxed font-serif pl-2 border-l border-indigo-500/20">
                            <strong>Etymological Depth:</strong> {v.rhetoricalInsight}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="border-t border-current/5 pt-3 flex items-center justify-between text-[10px] font-mono opacity-50">
                  <span>Traditional Source: Lisan al-Arab & Taj al-Arus</span>
                  <span>Select left terms to study others</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Dynamic AI Exploration Laboratory */}
      <div className={`p-6 md:p-8 rounded-2xl border ${styles.card} space-y-6 relative overflow-hidden bg-radial-at-b`}>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Activity className="w-4 h-4 shrink-0" />
            </span>
            <span className="text-[10px] font-mono font-black uppercase opacity-65 tracking-widest">Interactive Laboratory</span>
          </div>
          <h4 className="text-lg font-serif font-black">AI Live Root Contrast Etymologist</h4>
          <p className="text-xs opacity-70 leading-relaxed">
            Have another Arabic root (e.g. ك-ف-ر , ق-ت-ل , ف-ت-ن , ص-ب-ر) you are studying? Enter the letters below, and our classical etymology AI will trace its ancient pastoral origins, compare its modern misconceptions, and parse its Quranic eloquence.
          </p>
        </div>

        {/* Input area */}
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold">Input Root letters (e.g., ك-ف-ر , ف-ت-ن):</span>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Type any root or arabic term..."
                className={`flex-1 py-3 px-4 rounded-xl border text-sm font-serif ${styles.inputStyle}`}
                value={userQueryRoot}
                onChange={(e) => {
                  setUserQueryRoot(e.target.value);
                  setAiResult(null); // Clear previous
                }}
              />
              <button
                type="button"
                onClick={handleAiExamine}
                disabled={isAnalyzing || !userQueryRoot.trim()}
                className={`py-3 px-6 rounded-xl font-mono text-xs font-bold transition-all text-white flex items-center justify-center gap-2 cursor-pointer select-none ${
                  isAnalyzing || !userQueryRoot.trim()
                    ? 'bg-slate-700/50 opacity-50 cursor-not-allowed'
                    : isParchment
                      ? 'bg-[#8c6239] hover:bg-[#724f2d]'
                      : isCosmic
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    DECODING CLASSICAL ROOT MEMORY...
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    DISSOLVE ROOT CONCEPT WITH AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Key Configurations & Preset Tasters */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono opacity-50">Quick presets:</span>
              {["ق - ت - ل", "ف - ت - ن", "ص - ب - ر", "ك - ت - ب"].map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUserQueryRoot(r);
                    setAiResult(null);
                  }}
                  className={`px-2 py-1 rounded bg-current/5 border border-current/10 hover:border-indigo-500/35 font-mono text-[9px] cursor-pointer transition-all`}
                >
                  {r}
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
                <div className={`absolute bottom-full right-0 mb-2 p-3 rounded-lg border shadow-xl w-64 space-y-1.5 z-40 ${styles.card}`}>
                  <p className="text-[9px] opacity-75">Provide a custom GEMINI_API_KEY if the baseline workspace credentials are unconfigured:</p>
                  <input
                    type="password"
                    placeholder="Enter Custom Key..."
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    className={`w-full text-[10px] px-2 py-1 rounded border ${styles.inputStyle}`}
                  />
                  <p className="text-[8px] opacity-40">Stored securely inside your local browser session.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Result Card output */}
        <div className="relative">
          {isAnalyzing && (
            <div className="border border-indigo-500/10 bg-indigo-505/[0.01] p-12 rounded-xl text-center flex flex-col items-center justify-center space-y-4">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-rose-500/20 rounded-full animate-ping" />
                <div className="absolute inset-2 border-4 border-rose-500/40 rounded-full animate-pulse" />
                <BookOpen className="w-5 h-5 text-rose-400 animate-spin duration-3000" />
              </div>
              <div className="space-y-1">
                <h5 className="font-serif font-black text-xs text-rose-400">Paging Classical Arabic Lexicographers...</h5>
                <p className="text-[10px] opacity-60">Revisiting Lisan al-Arab, Taj al-Arus, and ancient Semitic foundations.</p>
              </div>
            </div>
          )}

          {errorText && (
            <div className="border border-red-500/20 bg-red-500/5 p-4 rounded-xl flex items-start gap-2 text-rose-400 text-xs text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Lexical Query Misstep</p>
                <p className="opacity-80 mt-0.5">{errorText}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visual results blocks */}
                <div className="p-4 border border-rose-500/20 bg-rose-500/[0.02] rounded-xl space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-rose-400 font-bold block">Modern/Flat Misconceptions</span>
                  <p className="text-xs font-serif italic text-rose-300">"{aiResult.commonMisconception}"</p>
                </div>
                
                <div className="p-4 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-xl space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">Classical Lexical Reality</span>
                  <p className="text-xs font-serif font-extrabold text-emerald-400">{aiResult.classicCoreMeaning}</p>
                </div>
              </div>

              {/* Bedouin origin */}
              <div className={`p-4 border border-current/10 bg-current/5 rounded-xl space-y-1`}>
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-50 block">Ancient Desert Bedouin physical sense</span>
                <p className="text-xs font-serif opacity-85 leading-relaxed">{aiResult.etymologicalOrigin}</p>
              </div>

              {/* Contrasting details */}
              <div className={`p-4 border border-current/10 bg-current/5 rounded-xl space-y-1`}>
                <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">Academic Scholastic Contrast</span>
                <p className="text-xs font-serif opacity-80 leading-relaxed whitespace-pre-line">{aiResult.scholasticContrast}</p>
              </div>

              {/* Verses examples */}
              {aiResult.verses && aiResult.verses.length > 0 && (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono font-bold opacity-50 uppercase">Examples in early Quranic verses</span>
                  <div className="grid grid-cols-1 gap-4">
                    {aiResult.verses.map((v: any, idx: number) => (
                      <div key={idx} className="p-4 border border-current/10 bg-current/5 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono opacity-50">{v.verseRef}</span>
                        </div>
                        <p className="text-xl font-serif text-right pr-2 leading-relaxed tracking-wide select-all text-indigo-100 font-extrabold">
                          {v.arabic}
                        </p>
                        <p className="text-xs italic opacity-75 font-serif">"{v.translation}"</p>
                        <p className="text-xs opacity-80 leading-relaxed pl-2 border-l border-indigo-500/25 font-serif">
                          <strong>Classical Depth Context:</strong> {v.rhetoricalInsight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
}
