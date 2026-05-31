import React, { useState, useEffect, useMemo } from 'react';
import { OFFLINE_VERSES_MAP, VerseBreakdownData, VerseWordBreakdown } from '../data/offlineVerses';
import { SURAH_MAPPING_LIST, SurahDefinition } from '../data/surahMapping';
import { Search, Loader2, Sparkles, BookOpen, AlertTriangle, ArrowRight, HelpCircle, FileText, Check, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LayoutTheme } from '../types';

interface VerseBreakdownProps {
  theme: LayoutTheme;
  onSelectRoot?: (root: string) => void;
  onSelectWord?: (word: string) => void;
}

interface WordGrammarDetails {
  wordType: string;
  tense: string;
  pattern: string;
  number: string;
  gender: string;
  aspect: string;
  caseOrMood: string;
}

interface WordMeaningSplit {
  exact: string;
  contextual: string;
  rootConcept: string;
  formation: string;
}

function getDetailedWordMeanings(w: VerseWordBreakdown): WordMeaningSplit {
  const normWord = w.word.trim();
  const meaning = w.meaning;

  // Let's match the exact words in our offline verses map
  const vocabularyDetails: Record<string, { exact: string; contextual: string; rootConcept: string; formation: string }> = {
    // Basics
    "بِ": {
      exact: "With / In / By means of (Preposition)",
      contextual: "Direct attachment of an ongoing action to a supreme source.",
      rootConcept: "Connecting agent (instrumentality).",
      formation: "Inseparable prefix particle ('Harf Jarr') that anchors the subsequent noun under absolute authority."
    },
    "سْمِ": {
      exact: "Name / Attribute / Label of loftiness",
      contextual: "To invoke and initiate a pathway through a prestigious brand of absolute power.",
      rootConcept: "Loftiness, high stature, or a distinctive signpost.",
      formation: "Derived from 'S-M-W' (to be high). Grammatically aligned here in the genitive state ('Majrūr')."
    },
    "اللَّهِ": {
      exact: "The Singular Supreme Creator & Deity",
      contextual: "Allah, the only source of absolute metaphysical and material coordination.",
      rootConcept: "Loving, awe-inspiring deity of perfect adoration.",
      formation: "The majestic proper noun. Combines the definite prefix 'al-' (The) with 'Inseparable Divine Entity'."
    },
    "الرَّحْمَٰنِ": {
      exact: "The Boundless, Universally Merciful (Immediate)",
      contextual: "The Entirely Merciful, immediately sustaining all cells and molecules proactively.",
      rootConcept: "Immediate, extreme, and maternal protection of growth.",
      formation: "Derived from 'R-H-M' (womb/compassion). Cast in the intensive active adjective form 'Fa'lān'."
    },
    "الرَّحِيمِ": {
      exact: "The Specially, Everlastingly Merciful (Sustained)",
      contextual: "The Especially Merciful, sustaining targeted guidance for human spiritual success.",
      rootConcept: "Continuous, targeted, and qualitative supportive protection.",
      formation: "Derived from 'R-H-M'. Cast in the steady constant-attribute form 'Fa'īl'."
    },
    // Al-Ikhlas
    "قُلْ": {
      exact: "Say! / Proclaim! / Declare with absolute certitude",
      contextual: "Say! (A direct divine command to articulate and broadcast monotheism explicitly).",
      rootConcept: "Speaking, voice, or declaring a verbal truth.",
      formation: "Form I active imperative command ('Amr') verb for second-person singular."
    },
    "هُوَ": {
      exact: "He (Detached personal third-person pronoun)",
      contextual: "He, the Transcendent Entity beyond gender, space, and local visual comprehension.",
      rootConcept: "The absent yet absolute singular core of reality.",
      formation: "A standard detached personal pronoun indicating complete metaphysical uniqueness."
    },
    "أَحَدٌ": {
      exact: "Indivisible, absolute and peerless One",
      contextual: "One, unique, and atomic deity who cannot be split, multiplied, or partnered.",
      rootConcept: "Oneness, uniqueness, and complete isolation from duplicates.",
      formation: "Formed from 'W-H-D' (Oneness), showing complete integrity and absolute unique singularity."
    },
    // Al-Asr
    "وَ": {
      exact: "Oath marker ('By...') / Conjunction ('And')",
      contextual: "I swear by... / Consequent witness (drawing immediate focus to witness temporal reality).",
      rootConcept: "Linking, swearing an oath with deep solemnity.",
      formation: "Oathtaking prefix particle ('Waw al-Qasam') which functions grammatically as a preposition."
    },
    "الْعَصْرِ": {
      exact: "Squeezing / Compression of time / Declining daylight",
      contextual: "The Declining Era / Squeezed Daylight (the finite container of human test cycles).",
      rootConcept: "Compressing juice from grapes or extracting meaning from historical lessons.",
      formation: "Definite noun in genitive state due to the oath of Waw. Derived from root 'A-S-R'."
    },
    "إِنَّ": {
      exact: "Verily / Certainly / Emphatic truth marker",
      contextual: "Indeed (establishing absolute physical and spiritual certainty of the claim).",
      rootConcept: "Solidifying, locking a statement down beyond dispute.",
      formation: "An inorganic emphatic particle ('Harf Mushabbah bil-Fi'l') that initiates a strong assertion."
    },
    "الْإِنْسَانَ": {
      exact: "The Companionable Being / Forgetful Creature",
      contextual: "Mankind / Human Being (vulnerable to natural decline, temporal entropy, and forgetfulness).",
      rootConcept: "Affinity, sociability, intimacy, or forgetfulness.",
      formation: "Definite collective noun in the accusative case ('Manṣūb'), derived from the root 'A-N-S'."
    },
    "لَ": {
      exact: "Surely / Truly / Emphatic prefix",
      contextual: "Is surely/truly (double-locking the truth of the subsequent condition of loss).",
      rootConcept: "Empowering, confirming, and highlighting a state.",
      formation: "Lām of emphasis ('Lām al-Muzahlaqah') prefixed to the predicate container to prevent doubt."
    },
    "فِي": {
      exact: "In / Inside of / Engulfed by",
      contextual: "Drowning in / Fully encapsulated inside (as if loss is a thick liquid surrounding him).",
      rootConcept: "Preposition of containing, surrounding, and spatial embedding.",
      formation: "Preposition particle ('Harf Jarr') establishing containment."
    },
    "خُسْرٍ": {
      exact: "Deficit / Bankruptcy / Structural waste and decay",
      contextual: "Severe spiritual and existential deficit, representing lost capital of time.",
      rootConcept: "Wasting investments, losing capital, or organic decay under entropy.",
      formation: "Indefinite singular noun in genitive state ('Majrūr'). Formed from root 'Kh-S-R'."
    },
    // Al-Baqarah (2:255)
    "لَا": {
      exact: "No / Absolute structural denial of alternative options",
      contextual: "There is absolutely no (extinguishing any claim of other potential sources of worship).",
      rootConcept: "Negation, sweeping cancellation, or refusal of authority.",
      formation: "Categorical Negation Particle ('Lā Nafiyah lil-Jins') which rules out any potential plural deities."
    },
    "إِلَٰهَ": {
      exact: "Object of adoration / Beautiful deity worthy of submission",
      contextual: "Deity, center of worship, or ultimate master of human coordinates.",
      rootConcept: "Adoring, seeking shelter in, or finding peace in a supreme master.",
      formation: "A generic singular noun in the accusative state of absolute negation. Derived from 'A-L-H'."
    },
    "إِلَّا": {
      exact: "Except / Save for (exclusivity operator)",
      contextual: "Except (shattering the previous negation to isolate and crown the single exception).",
      rootConcept: "Limiting, sorting, and narrowing down down to one absolute coordinate.",
      formation: "Surgical exception particle ('Harf Istithna') used to build absolute theological monotheism."
    },
    "الْحَيُّ": {
      exact: "The Everlastingly Alive / Source of life",
      contextual: "The Ever-Living (possessing self-originating continuous vitality without origin or end).",
      rootConcept: "Life, molecular growth, consciousness, and living coordinates.",
      formation: "Majestic Divine Attribute. Active noun derived from 'H-Y-Y' in the nominative state ('Marfū'')."
    },
    "الْقَيُّومُ": {
      exact: "The Absolute Self-Sustaining & Constant Protector of Cells",
      contextual: "The All-Sustainer (who handles gravity, orbits, and atomic structures constantly).",
      rootConcept: "Standing up, guarding, and keeping systems vertically upright.",
      formation: "Form II/Form IV derived intensive active participle ('Fa''ūl'/'Fay'ūl'). Derived from 'Q-W-M'."
    },
    // Ma'un & Kafirun
    "لِلْمُصَلِّينَ": {
      exact: "To those who perform standard prayers (Form II Participle)",
      contextual: "To those who perform physical prayers (yet are heedless of their inner justice coordinates).",
      rootConcept: "Performing connection, sending prayers, or aligning the spine during bowing.",
      formation: "Form II plural active participle ('Muṣallīna') preceded by the target preposition 'Li-' (For)."
    },
    "عَابِدٌ": {
      exact: "Active dedicated worshipper / Dedicated server",
      contextual: "An active worshipper (proclaiming independent, continuous, conscious monotheism).",
      rootConcept: "Serving, working as a slave, or dedicating work to a master.",
      formation: "Form I active agent participle ('Ism Fā'il') matching the rhythmic template 'Fā'il'."
    },
    "عَبَدتُّمْ": {
      exact: "You served / You chose to worship (plural past tense)",
      contextual: "You have spent your lives worshipping (temporary, cultural tribal deities).",
      rootConcept: "Submitting to custom, servitude, or worship.",
      formation: "Form I past active verb configured in second-person masculine plural form."
    }
  };

  // Check if we have exact preset data
  if (vocabularyDetails[normWord]) {
    return vocabularyDetails[normWord];
  }

  // Fallback heuristic calculations for custom words
  let literal = meaning;
  let contextual = meaning;
  let concept = "Universal Base Concept represented by root letters.";
  let logic = `Word represents direct morphological application of Category: ${w.wordType}.`;

  if (meaning.includes("/")) {
    const parts = meaning.split("/");
    literal = parts[0].trim();
    contextual = parts[1] ? parts[1].trim() : parts[0].trim();
  } else if (meaning.split(" / ").length > 1) {
    const parts = meaning.split(" / ");
    literal = parts[0].trim();
    contextual = parts[1] ? parts[1].trim() : parts[0].trim();
  } else if (meaning.includes("(")) {
    // split parenthesis context
    const idx = meaning.indexOf("(");
    literal = meaning.slice(0, idx).trim();
    contextual = meaning.trim();
  }

  if (w.wordType === "Ism") {
    concept = w.isIsmFail ? "Targeted agency / ACTIVE ACTOR" : "Substantive state / permanent quality.";
    logic = `This is an 'Ism' (Noun/Substantive name of concept). Root is '${w.root}'. Case structure is defined by its current position.`;
  } else if (w.wordType === "Fi'l") {
    concept = "Active event / temporal transformation.";
    logic = `This is a 'Fi'l' (Verb) indicating active event propagation in physical space, anchored to the Root '${w.root}'.`;
  } else if (w.wordType === "Harf") {
    concept = "Relational connection / directional vector.";
    logic = "This is a fixed structural particle ('Harf') providing emphasis, containment, or direction to nouns or verbs.";
  }

  return {
    exact: literal,
    contextual: contextual,
    rootConcept: concept,
    formation: logic
  };
}

function parseWordGrammar(w: VerseWordBreakdown): WordGrammarDetails {
  const explanation = w.explanation.toLowerCase();
  const meaning = w.meaning.toLowerCase();
  const wordType = w.wordType; // "Ism" | "Fi'l" | "Harf"

  let tense = "N/A";
  let pattern = "Standard / General";
  let number = "Singular (Mufrad)";
  let gender = "Masculine (Mudhakkar)";
  let aspect = "N/A";
  let caseOrMood = "N/A";

  // Check tense (mainly for verbs)
  if (wordType === "Fi'l") {
    tense = "Perfect Past (Māḍī)";
    if (explanation.includes("imperative") || explanation.includes("command") || explanation.includes("amr")) {
      tense = "Imperative Command (Amr)";
    } else if (explanation.includes("imperfect") || explanation.includes("present") || explanation.includes("future") || explanation.includes("mudari")) {
      tense = "Imperfect Present-Future (Muḍāri')";
    } else if (explanation.includes("perfect") || explanation.includes("madi") || explanation.includes("past")) {
      tense = "Perfect Past (Māḍī)";
    }
  }

  // Check pattern
  const patternMatch = w.explanation.match(/(pattern\s+\([^)]+\)|fa'lān|fa'īl|muf'il|tā'īr|form\s+[ivxldcm]+)/i);
  if (patternMatch) {
    pattern = patternMatch[0];
  } else if (explanation.includes("form i ")) {
    pattern = "Form I (Basic)";
  } else if (explanation.includes("form ii")) {
    pattern = "Form II (Derived)";
  } else if (explanation.includes("intensive hyperbole")) {
    pattern = "Fa'lān (Intense)";
  } else if (explanation.includes("constant qualitative")) {
    pattern = "Fa'īl (Constant quality)";
  } else if (w.isIsmFail) {
    pattern = "Fā'il (Active Participle)";
  }

  // Check Number (singular / plural / dual)
  if (explanation.includes("plural") || meaning.includes("(pl.") || meaning.includes("plural")) {
    number = "Plural (Jam')";
  } else if (explanation.includes("dual") || meaning.includes("dual")) {
    number = "Dual (Muthannā)";
  } else if (explanation.includes("collective")) {
    number = "Collective Noun";
  } else {
    number = "Singular (Mufrad)";
  }

  // Check Gender (masculine / feminine / common)
  if (explanation.includes("feminine") || explanation.includes("female") || explanation.includes("maternal")) {
    gender = "Feminine (Mu'annath)";
  } else if (explanation.includes("masculine") || explanation.includes("male")) {
    gender = "Masculine (Mudhakkar)";
  } else {
    if (wordType === "Harf") {
      gender = "N/A (Particle)";
    } else {
      gender = "Masculine (By Default)";
    }
  }

  // Voice or derivation state
  if (wordType === "Fi'l") {
    if (explanation.includes("passive")) {
      aspect = "Passive Voice (Majhūl)";
    } else {
      aspect = "Active Voice (Ma'rūf)";
    }
  } else {
    aspect = w.isIsmFail ? "Active Participle" : "Standard Noun derivation";
  }

  // Case/State for Ism / Mood for Fi'l
  if (wordType === "Ism") {
    if (explanation.includes("genitive") || explanation.includes("majroor") || explanation.includes("majrir")) {
      caseOrMood = "Genitive (Majrūr)";
    } else if (explanation.includes("accusative") || explanation.includes("mansoob") || explanation.includes("mansub")) {
      caseOrMood = "Accusative (Manṣūb)";
    } else if (explanation.includes("nominative") || explanation.includes("marfoo") || explanation.includes("marfu")) {
      caseOrMood = "Nominative (Marfū')";
    } else {
      caseOrMood = "Nominative Base (Marfū')";
    }
  } else if (wordType === "Fi'l") {
    if (explanation.includes("subjunctive") || explanation.includes("mansub")) {
      caseOrMood = "Subjunctive (Manṣūb)";
    } else if (explanation.includes("jussive") || explanation.includes("majzum")) {
      caseOrMood = "Jussive (Majzūm)";
    } else {
      caseOrMood = "Indicative (Marfū')";
    }
  }

  return {
    wordType,
    tense,
    pattern,
    number,
    gender,
    aspect,
    caseOrMood
  };
}

export default function VerseBreakdown({ theme, onSelectRoot, onSelectWord }: VerseBreakdownProps) {
  // Input Selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>('2:255');
  const [customSurah, setCustomSurah] = useState<string>('');
  const [customVerse, setCustomVerse] = useState<string>('');
  
  // Offline-saved custom verses from localStorage
  const [offlineSavedVerses, setOfflineSavedVerses] = useState<Record<string, VerseBreakdownData>>(() => {
    try {
      const stored = localStorage.getItem('offline_saved_verses');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Failed to load offline saved verses from localStorage:', e);
      return {};
    }
  });

  // App state
  const [isSearching, setIsSearching] = useState(false);
  const [activeVerseData, setActiveVerseData] = useState<VerseBreakdownData | null>(null);
  const [selectedWordToken, setSelectedWordToken] = useState<VerseWordBreakdown | null>(null);

  const currentWordIndex = useMemo(() => {
    if (!activeVerseData || !selectedWordToken) return -1;
    return activeVerseData.words.findIndex(w => w.word === selectedWordToken.word);
  }, [activeVerseData, selectedWordToken]);

  const handlePrevWord = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeVerseData && currentWordIndex > 0) {
      setSelectedWordToken(activeVerseData.words[currentWordIndex - 1]);
    }
  };

  const handleNextWord = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeVerseData && currentWordIndex < activeVerseData.words.length - 1) {
      setSelectedWordToken(activeVerseData.words[currentWordIndex + 1]);
    }
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [apiSuccessTriggered, setApiSuccessTriggered] = useState(false);

  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Merge shipped offline presets and user-saved offline verses
  const allVersesMap = useMemo(() => {
    return {
      ...OFFLINE_VERSES_MAP,
      ...offlineSavedVerses
    };
  }, [offlineSavedVerses]);

  // Card Backgrounds and Accents
  const colors = React.useMemo(() => {
    if (isParchment) {
      return {
        cardBg: 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e]',
        innerBg: 'bg-[#ebd8c3]/20 border-[#dfd2be]/50',
        accentText: 'text-[#8c6239]',
        accentBorder: 'border-[#8c6239]',
        hoverPill: 'hover:bg-[#ebd8c3]/40 border-current/10',
        activePill: 'bg-[#8c6239] text-[#faf6ed] border-[#8c6239]',
        btnPrimary: 'bg-[#8c6239] hover:bg-[#724f2d] text-white',
        ismFailBorder: 'border-amber-600 bg-amber-500/5 text-amber-900',
        harfBorder: 'border-[#5c4033] bg-[#5c4033]/5 text-[#5c4033]',
        regularBorder: 'border-current/10 bg-[#ebd8c3]/10',

        // 3 parts of speech colors
        bgIsmBadge: 'bg-amber-100 text-amber-805 border-amber-300 font-bold',
        bgFilBadge: 'bg-emerald-100 text-emerald-805 border-emerald-300 font-bold',
        bgHarfBadge: 'bg-stone-200 text-stone-705 border-stone-300 font-bold',
        textIsm: 'text-amber-700 hover:text-amber-850',
        textFil: 'text-emerald-700 hover:text-emerald-850',
        textHarf: 'text-stone-500 hover:text-stone-650',
      };
    }
    if (isCosmic) {
      return {
        cardBg: 'bg-[#05060f] border-indigo-950/80 text-indigo-50',
        innerBg: 'bg-indigo-950/20 border-indigo-900/40',
        accentText: 'text-pink-400',
        accentBorder: 'border-pink-500',
        hoverPill: 'hover:bg-indigo-900/30 border-white/5',
        activePill: 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-950/50',
        btnPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50',
        ismFailBorder: 'border-pink-500 bg-pink-500/10 text-pink-300',
        harfBorder: 'border-cyan-500/60 bg-cyan-500/5 text-cyan-300',
        regularBorder: 'border-white/10 bg-indigo-950/20',

        // 3 parts of speech colors
        bgIsmBadge: 'bg-pink-950/40 text-pink-300 border-pink-900/30',
        bgFilBadge: 'bg-violet-950/40 text-violet-300 border-violet-900/30',
        bgHarfBadge: 'bg-cyan-950/40 text-cyan-300 border-cyan-900/30',
        textIsm: 'text-pink-400 hover:text-pink-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.3)]',
        textFil: 'text-violet-400 hover:text-violet-300 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]',
        textHarf: 'text-cyan-400 hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]',
      };
    }
    return {
      cardBg: 'bg-slate-900 border-slate-800 text-slate-100',
      innerBg: 'bg-slate-950/40 border-slate-800/80',
      accentText: 'text-emerald-400',
      accentBorder: 'border-emerald-500',
      hoverPill: 'hover:bg-slate-800 border-white/5',
      activePill: 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50',
      btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      ismFailBorder: 'border-amber-500 bg-amber-500/10 text-amber-300',
      harfBorder: 'border-emerald-500/60 bg-emerald-500/5 text-emerald-300',
      regularBorder: 'border-slate-800 bg-slate-950/20',

      // 3 parts of speech colors
      bgIsmBadge: 'bg-amber-955/40 text-amber-300 border-amber-900/20',
      bgFilBadge: 'bg-emerald-955/40 text-emerald-300 border-emerald-900/20',
      bgHarfBadge: 'bg-sky-955/40 text-sky-300 border-sky-900/20',
      textIsm: 'text-amber-400 hover:text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.2)]',
      textFil: 'text-emerald-400 hover:text-emerald-300 drop-shadow-[0_0_6px_rgba(16,185,129,0.2)]',
      textHarf: 'text-sky-400 hover:text-sky-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.2)]',
    };
  }, [isParchment, isCosmic]);

  // Real-time matched Surah based on text typed (either number or partial transliterated/Arabic name)
  const matchedSurah = useMemo<SurahDefinition | null>(() => {
    const query = customSurah.trim().toLowerCase();
    if (!query) return null;

    const surahNum = parseInt(query, 10);
    if (!isNaN(surahNum)) {
      return SURAH_MAPPING_LIST.find(s => s.number === surahNum) || null;
    }

    // Try finding by name, stripping common phonetic prefixes like Al-, Ar-
    const cleanQuery = query.replace(/^(al|ar|an|ash|at|ad|az|as|aj|ad)-?/i, '');
    return SURAH_MAPPING_LIST.find(s => {
      const cleanTrans = s.transliteration.toLowerCase().replace(/^(al|ar|an|ash|at|ad|az|as|aj|ad)-?/i, '');
      return cleanTrans.includes(cleanQuery) || 
             s.transliteration.toLowerCase().includes(query) || 
             s.name.includes(query);
    }) || null;
  }, [customSurah]);

  // Sync verse choice when matched Surah changes
  useEffect(() => {
    if (matchedSurah) {
      const currentVal = parseInt(customVerse, 10);
      if (isNaN(currentVal) || currentVal < 1 || currentVal > matchedSurah.totalVerses) {
        setCustomVerse('1'); // Automatically select Verse 1 as default safe step
      }
    } else {
      setCustomVerse('');
    }
  }, [matchedSurah]);

  // Load preset or offline saved verse initially
  useEffect(() => {
    const defaultData = allVersesMap[selectedPresetId];
    if (defaultData) {
      setActiveVerseData(defaultData);
      setSelectedWordToken(null);
      setErrorMessage(null);
    }
  }, [selectedPresetId, allVersesMap]);

  // Handle custom search query via /api/breakdown-verse
  const handleLiveQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedSurah) {
      setErrorMessage('Please type a valid Surah number or name (e.g. "112" or "Al-Ikhlas") first.');
      return;
    }
    const sQuery = matchedSurah.number.toString();
    const vQuery = customVerse.trim() || '1';

    const cacheKey = `${sQuery}:${vQuery}`;

    // LOCAL OFFLINE ADVANTAGE: Check if this is already cached in our offline registry!
    if (allVersesMap[cacheKey]) {
      setActiveVerseData(allVersesMap[cacheKey]);
      setSelectedWordToken(null);
      setSelectedPresetId(cacheKey);
      setApiSuccessTriggered(true);
      setErrorMessage(null);
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);
    setApiSuccessTriggered(false);

    try {
      const cachedKey = localStorage.getItem('user_api_key') || '';
      
      const response = await fetch('/api/breakdown-verse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surah: sQuery,
          verse: vQuery,
          customApiKey: cachedKey
        })
      });

      if (!response.ok) {
        const errorVal = await response.json();
        throw new Error(errorVal.error || 'Failed to complete breakdown.');
      }

      const freshVerseData: VerseBreakdownData = await response.json();
      if (freshVerseData && freshVerseData.words && freshVerseData.words.length > 0) {
        // Guarantee clean, accurate names from local map
        freshVerseData.surahName = matchedSurah.transliteration;
        freshVerseData.surahNumber = matchedSurah.number;
        freshVerseData.verseNumber = parseInt(vQuery, 10) || 1;

        // Auto-save offline by default: update local storage cache immediately!
        const updatedOffline = {
          ...offlineSavedVerses,
          [cacheKey]: freshVerseData
        };
        setOfflineSavedVerses(updatedOffline);
        localStorage.setItem('offline_saved_verses', JSON.stringify(updatedOffline));

        setActiveVerseData(freshVerseData);
        setSelectedWordToken(null);
        setSelectedPresetId(cacheKey);
        setApiSuccessTriggered(true);
      } else {
        throw new Error('Retrieved an empty morphological payload.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Trouble connecting to active search parser.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Switch preset directly
  const handleLoadPresetDirectly = (presetId: string) => {
    setSelectedPresetId(presetId);
    
    const parsed = presetId.split(':');
    if (parsed.length === 2) {
      setCustomSurah(parsed[0]);
      setCustomVerse(parsed[1]);
    } else {
      setCustomSurah('');
      setCustomVerse('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Input Widget */}
      <div className={`border rounded-2xl p-5 ${colors.cardBg} transition-all duration-300 shadow-sm animate-fadeIn`}>
        <div className="flex flex-col xl:flex-row items-stretch xl:items-start justify-between gap-6">
          
          {/* Preset Select Controls and Cache */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xs font-bold opacity-85 flex items-center gap-1.5 mb-2 font-mono uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Shipped Offline Presets:
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(OFFLINE_VERSES_MAP).map((id) => {
                  const data = OFFLINE_VERSES_MAP[id];
                  return (
                    <button
                      key={id}
                      onClick={() => handleLoadPresetDirectly(id)}
                      type="button"
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        selectedPresetId === id && !Object.keys(offlineSavedVerses).includes(id)
                          ? colors.activePill
                          : colors.hoverPill
                      }`}
                    >
                      Surah {data.surahName} {data.surahNumber}:{data.verseNumber}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Offline Saved / Cached Verses Section */}
            {Object.keys(offlineSavedVerses).length > 0 && (
              <div className="pt-3 border-t border-current/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold opacity-85 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Your Offline Saved Verses ({Object.keys(offlineSavedVerses).length}):
                  </h4>
                  <button
                    onClick={() => {
                      if (window.confirm("Do you want to clear your local offline-saved verses cache?")) {
                        setOfflineSavedVerses({});
                        localStorage.removeItem('offline_saved_verses');
                      }
                    }}
                    className="text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                    title="Clear offline storage cache"
                  >
                    <Trash2 className="w-3 h-3" /> Clear Saved Cache
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(offlineSavedVerses).map((id) => {
                    const data = offlineSavedVerses[id];
                    return (
                      <button
                        key={`custom-${id}`}
                        onClick={() => handleLoadPresetDirectly(id)}
                        type="button"
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          selectedPresetId === id
                            ? colors.activePill
                            : colors.hoverPill
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        S. {data.surahName} ({id})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="h-px xl:h-28 w-full xl:w-px bg-current opacity-10 shrink-0"></div>

          {/* Custom Search Form with real-time Lookups */}
          <form onSubmit={handleLiveQuery} className="flex-1 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* Surah text/number field */}
              <div className="relative">
                <label className="block text-[10px] font-bold font-mono tracking-wider opacity-60 uppercase mb-1">
                  Surah (Type Number or Name)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. 112 or Al-Ikhlas"
                    value={customSurah}
                    onChange={(e) => setCustomSurah(e.target.value)}
                    className={`w-full text-xs rounded-xl py-2 px-3 pr-24 focus:outline-none border bg-black/5 ${colors.hoverPill}`}
                    required
                  />
                  {matchedSurah && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-serif">
                        {matchedSurah.transliteration}
                      </span>
                    </div>
                  )}
                </div>
                {/* Visual indicator message */}
                {matchedSurah ? (
                  <p className="text-[10px] text-emerald-500 font-semibold mt-1 flex items-center gap-1 animate-fadeIn">
                    <Check className="w-3 h-3" /> Auto-lookup: {matchedSurah.transliteration} ({matchedSurah.name}) - {matchedSurah.totalVerses} Ayas
                  </p>
                ) : customSurah.trim() ? (
                  <p className="text-[10px] text-rose-400 font-medium mt-1">
                    🔍 Unrecognized Surah. Keep typing...
                  </p>
                ) : (
                  <p className="text-[10px] opacity-40 mt-1">
                     Translate number directly (e.g. "112" shows "Al-Ikhlas")
                  </p>
                )}
              </div>

              {/* Dynamic Ayat / Verse Dropdown Selector */}
              <div>
                <label className="block text-[10px] font-bold font-mono tracking-wider opacity-60 uppercase mb-1">
                  Verse Selection (Ayat No.)
                </label>
                {matchedSurah ? (
                  <select
                    value={customVerse}
                    onChange={(e) => setCustomVerse(e.target.value)}
                    className={`w-full text-xs rounded-xl py-2 px-3 focus:outline-none border bg-black/5 ${colors.hoverPill}`}
                    required
                  >
                    {Array.from({ length: matchedSurah.totalVerses }, (_, idx) => idx + 1).map((v) => (
                      <option 
                        key={v} 
                        value={v.toString()}
                        className={isParchment ? 'text-[#2c241e]' : 'text-slate-900'}
                      >
                        Ayat {v} of {matchedSurah.totalVerses}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    disabled
                    placeholder="Provide a valid Surah first..."
                    className="w-full text-xs rounded-xl py-2 px-3 opacity-50 border bg-black/10 cursor-not-allowed"
                  />
                )}
                <p className="text-[10px] opacity-45 mt-1">
                   Allows selection only for valid verses in {matchedSurah ? matchedSurah.transliteration : 'selected Surah'}
                </p>
              </div>

            </div>

            <button
              type="submit"
              disabled={isSearching || !matchedSurah}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wide flex items-center justify-center gap-1.5 transition-all w-full cursor-pointer disabled:opacity-40 select-none ${colors.btnPrimary}`}
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Building offline segmented token database...
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  {allVersesMap[`${matchedSurah?.number}:${customVerse}`] 
                    ? 'Load Instantly (Offline Cache Ready)' 
                    : 'Fetch & Save Offline by Default'}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Informational Alert for Search state handling */}
        {errorMessage && (
          <div className="mt-4 p-3 border border-red-500/20 bg-red-500/5 text-red-400 text-xs rounded-xl flex items-start gap-2.5 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <div>
              <p className="font-bold">Parsing Issue</p>
              <p className="opacity-80 mt-0.5">{errorMessage}</p>
              <p className="opacity-60 text-[10px] mt-1">
                Notice: Live queries require Gemini API clearance. We have loaded our default offline presets below as a fallback.
              </p>
            </div>
          </div>
        )}

        {apiSuccessTriggered && (
          <div className="mt-4 p-2.5 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs rounded-xl flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 shrink-0" />
            <span className="font-semibold">Verse segment analysis matched successfully. Copy saved dynamically offline by default!</span>
          </div>
        )}
      </div>

      {/* Main Structural Display Panel */}
      {activeVerseData && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* The Verse display card */}
          <div className={`border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all ${colors.cardBg} shadow-sm`}>
            <div className="w-full flex items-center justify-between border-b border-current/10 pb-3 mb-5">
              <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">
                Quranic Arabic Orthography & Grammatical Wave
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase rounded p-1 px-2 border border-current/10 ${colors.accentText}`}>
                Surah {activeVerseData.surahName} ({activeVerseData.surahNumber}:{activeVerseData.verseNumber})
              </span>
            </div>

            {/* Word-by-Word Color-Coded Semantic Sentence Display */}
            <div 
              className="flex flex-wrap gap-x-2.5 md:gap-x-4 gap-y-2 md:gap-y-3.5 justify-center py-8 max-w-4xl mx-auto select-none" 
              dir="rtl"
            >
              {activeVerseData.words.map((w, idx) => {
                const isSelected = selectedWordToken?.word === w.word;
                let typeColor = colors.textIsm;
                if (w.wordType === "Fi'l") {
                  typeColor = colors.textFil;
                } else if (w.wordType === "Harf") {
                  typeColor = colors.textHarf;
                }

                return (
                  <button
                    key={`aayat-word-inline-${idx}`}
                    onClick={() => setSelectedWordToken(w)}
                    type="button"
                    className={`font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-relaxed transition-all duration-150 transform hover:scale-110 active:scale-95 cursor-pointer rounded-xl px-2 py-0.5 ${typeColor} ${
                      isSelected 
                        ? 'bg-current/10 ring-2 ring-current/25 scale-110 shadow-sm' 
                        : 'hover:bg-current/10'
                    }`}
                    title={`Click to deconstruct: "${w.transliteration} - ${w.meaning}"`}
                  >
                    {w.word}
                  </button>
                );
              })}
            </div>

            {/* Parts of Speech Legend Guide */}
            <div className="w-full mt-3 mb-5 py-2.5 px-4 bg-current/5 rounded-xl border border-current/10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono">
              <span className="opacity-60 text-[10px] uppercase font-bold tracking-wider">Parts of Speech Coloring:</span>
              <div className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${colors.bgIsmBadge.split(' ')[0]} border border-current/10 shrink-0`}></span>
                <span className="font-bold opacity-85">Ism (Noun)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${colors.bgFilBadge.split(' ')[0]} border border-current/10 shrink-0`}></span>
                <span className="font-bold opacity-85">Fi'l (Verb)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${colors.bgHarfBadge.split(' ')[0]} border border-current/10 shrink-0`}></span>
                <span className="font-bold opacity-85">Harf (Particle)</span>
              </div>
            </div>

            {/* English Translation */}
            <div className="mt-2 border-t border-current/5 pt-4 w-full">
              <p className="text-[10px] font-mono opacity-40 uppercase tracking-wider mb-1.5">
                Universal English Translation
              </p>
              <p className="text-sm italic opacity-85 leading-relaxed font-serif text-current/90">
                "{activeVerseData.fullVerseTranslation}"
              </p>
            </div>
          </div>

          <p className="text-center text-xs opacity-50 italic py-2">
            💡 TIP: Click on any Arabic word inside the Aayat to display its morphological deconstruction and contextual direct translation instantly!
          </p>

          {/* Hover Screen / Detached Modal for Word-by-Word details */}
          {selectedWordToken && (() => {
            const parsedDetails = getDetailedWordMeanings(selectedWordToken);
            const info = parseWordGrammar(selectedWordToken);
            
            // Helpful descriptions for Part of Speech
            const categoryDesc = 
              selectedWordToken.wordType === "Ism" 
                ? "Noun / Adjective / Pronoun (Names a core entity or quality independently of active time)" 
                : selectedWordToken.wordType === "Fi'l"
                  ? "Action Verb (Represents a dynamic event bound to a past, present, or future timeline)"
                  : "Particle (Preposition/Conjunction. Yields semantic vectors only when linked to other words)";

            return (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn"
                onClick={() => setSelectedWordToken(null)}
              >
                <div 
                  className={`relative w-full max-w-2xl rounded-2xl border p-5 md:p-7 shadow-2xl transition-all transform scale-100 max-h-[92vh] overflow-y-auto ${colors.cardBg} border-current/15`}
                  onClick={(e) => e.stopPropagation()} // Prevent close on card click
                >
                  {/* Top Header Row with Close Button */}
                  <div className="flex items-center justify-between border-b border-current/10 pb-3.5 mb-4 font-mono">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse animate-duration-1000" />
                      <span className="text-[11px] font-mono opacity-65 uppercase tracking-wider font-semibold">
                        Linguistic Deconstruction & Commentary
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedWordToken(null)}
                      type="button"
                      className="p-1 px-3 rounded-lg bg-current/5 hover:bg-current/10 border border-current/10 transition-all text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Close</span> <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Orthography, Transliteration, and Word Type */}
                    <div className={`p-4 md:p-6 rounded-2xl text-center border relative overflow-hidden flex flex-col items-center justify-center ${colors.innerBg} border-current/5 shadow-inner`}>
                      <div className="absolute top-2 right-3 text-[8px] font-mono opacity-40 uppercase tracking-widest">
                        Word Orthography
                      </div>
                      
                      <span className="text-5xl md:text-6xl font-serif font-bold text-current drop-shadow-sm leading-snug">
                        {selectedWordToken.word}
                      </span>
                      <span className={`block font-bold tracking-wider text-sm mt-1.5 ${colors.accentText}`}>
                        / {selectedWordToken.transliteration} /
                      </span>

                      {/* Part of Speech Mini-card */}
                      <div className="mt-3.5 px-3 py-1.5 rounded-xl bg-current/5 border border-current/10 text-[11px] text-current/80 max-w-md w-full">
                        <span className="font-bold uppercase text-[10px] tracking-wider text-emerald-500 block mb-0.5">
                          Part of Speech: {selectedWordToken.wordType}
                        </span>
                        <span className="opacity-75 block text-center leading-normal">
                          {categoryDesc}
                        </span>
                      </div>
                    </div>

                    {/* TWO-COLUMN MEANING SPECTRA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                      {/* Exact Literal Translation */}
                      <div className="p-4 rounded-xl border border-current/10 bg-current/5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-[10px] font-mono opacity-60 uppercase tracking-wider font-bold">
                              Exact Root Translation
                            </span>
                          </div>
                          <p className="text-sm font-semibold opacity-95 leading-relaxed text-current/95 font-serif">
                            {parsedDetails.exact}
                          </p>
                        </div>
                        <p className="text-[9px] opacity-45 mt-3 leading-relaxed">
                          💡 The pure etymological core meaning of the root in classical lexicons.
                        </p>
                      </div>

                      {/* Precise Contextual Meaning */}
                      <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 animate-pulse" />
                            <span className="text-[10px] font-mono opacity-85 uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                              Contextual Verse Meaning
                            </span>
                          </div>
                          <p className="text-sm font-extrabold opacity-100 leading-relaxed text-emerald-600 dark:text-emerald-400 font-serif">
                            {parsedDetails.contextual}
                          </p>
                        </div>
                        <p className="text-[9px] opacity-45 mt-3 leading-relaxed">
                          🎯 The tailored translation of this token as it functions inside this sentence.
                        </p>
                      </div>
                    </div>

                    {/* Word Formation & Core Concept */}
                    <div className={`p-4 rounded-xl border border-current/10 ${colors.innerBg} space-y-3`}>
                      <div className="flex items-center justify-between border-b border-current/5 pb-2">
                        <span className="text-[10px] font-mono opacity-65 uppercase tracking-wider font-bold">
                          Word Formation & Morphemics
                        </span>
                        {selectedWordToken.root !== "None" && (
                          <span className="text-[9px] font-mono bg-current/5 px-2 py-0.5 rounded-md text-current/60">
                            Root-Derived
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                        <div>
                          <span className="block text-[9px] font-mono opacity-50 uppercase mb-0.5">Morpheme Root Group</span>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-lg font-bold tracking-wider bg-current/10 border border-current/15 rounded-lg p-1.5 px-3">
                              {selectedWordToken.root}
                            </span>
                            {selectedWordToken.root !== "None" && onSelectRoot && (
                              <button
                                onClick={() => {
                                  if (onSelectRoot) onSelectRoot(selectedWordToken.root.replace(/\s+/g, ''));
                                  setSelectedWordToken(null);
                                }}
                                type="button"
                                className={`p-1.5 px-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-450 transition-all font-mono text-[9px] flex items-center gap-1.5 cursor-pointer`}
                                title="Synthesize root derivatives"
                              >
                                <span>Synthesize</span> <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="block text-[9px] font-mono opacity-50 uppercase mb-0.5">Base Root Core Semantic</span>
                          <p className="font-serif text-current/90 italic font-medium">
                            "{parsedDetails.rootConcept}"
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-current/5 text-xs text-current/80">
                        <span className="block text-[9px] font-mono opacity-50 uppercase mb-1">Structural Formation Mechanics</span>
                        <p className="leading-relaxed font-sans text-xs">
                          {parsedDetails.formation}
                        </p>
                      </div>
                    </div>

                    {/* Morphological specification Grid */}
                    <div className="border-t border-current/10 pt-3">
                      <span className="block text-[10px] font-mono opacity-50 uppercase tracking-wider mb-2 font-bold">
                        Morphological Characteristics
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        <div className="p-2 border border-current/5 rounded-xl bg-current/5">
                          <span className="block text-[8px] font-mono opacity-40 uppercase tracking-wider mb-0.5">Grammatical State</span>
                          <span className="text-xs font-bold text-current">{info.caseOrMood}</span>
                        </div>
                        <div className="p-2 border border-current/5 rounded-xl bg-current/5">
                          <span className="block text-[8px] font-mono opacity-40 uppercase tracking-wider mb-0.5">Grammatical Number</span>
                          <span className="text-xs font-bold text-current">{info.number}</span>
                        </div>
                        <div className="p-2 border border-current/5 rounded-xl bg-current/5">
                          <span className="block text-[8px] font-mono opacity-40 uppercase tracking-wider mb-0.5">Gender / Class</span>
                          <span className="text-xs font-bold text-current">{info.gender}</span>
                        </div>
                        <div className="p-2 border border-current/5 rounded-xl bg-current/5">
                          <span className="block text-[8px] font-mono opacity-40 uppercase tracking-wider mb-0.5">Sarf Pattern Blueprint</span>
                          <span className="text-xs font-bold text-current font-serif italic text-emerald-500 dark:text-emerald-400">{info.pattern}</span>
                        </div>
                        <div className="p-2 border border-current/5 rounded-xl bg-current/5">
                          <span className="block text-[8px] font-mono opacity-40 uppercase tracking-wider mb-0.5">Tense</span>
                          <span className="text-xs font-bold text-current">{info.tense}</span>
                        </div>
                        <div className="p-2 border border-current/5 rounded-xl bg-current/5">
                          <span className="block text-[8px] font-mono opacity-40 uppercase tracking-wider mb-0.5">Voice / Aspect</span>
                          <span className="text-xs font-bold text-current">{info.aspect}</span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Syntax / Contextual Grammar Commentary */}
                    <div className="border-t border-current/10 pt-3">
                      <span className="block text-[10px] font-mono opacity-50 uppercase tracking-wider mb-1.5 font-bold">
                        Detailed Morphological & Syntax Explanation
                      </span>
                      <div className={`p-3 md:p-4 rounded-xl text-xs leading-relaxed max-h-32 overflow-y-auto font-sans ${colors.innerBg} border border-current/5 shadow-inner`}>
                        {selectedWordToken.explanation}
                      </div>
                    </div>
                  </div>

                  {/* Prev & Next Word Buttons Row */}
                  <div className="mt-5 pt-3.5 border-t border-current/10 flex items-center justify-between gap-4">
                    {/* Previous Button */}
                    <button
                      onClick={handlePrevWord}
                      disabled={currentWordIndex <= 0}
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-mono border border-current/15 hover:bg-current/5 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> <span>Previous</span>
                    </button>

                    {/* Word Counter info */}
                    <span className="text-[10px] font-mono opacity-40">
                      Word {currentWordIndex + 1} of {activeVerseData.words.length}
                    </span>

                    {/* Next Button */}
                    <button
                      onClick={handleNextWord}
                      disabled={currentWordIndex >= activeVerseData.words.length - 1}
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold font-mono border border-current/15 hover:bg-current/5 disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
                    >
                      <span>Next</span> <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
}
