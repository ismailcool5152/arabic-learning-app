import { safeLower } from '../lib/utils';
import React, { useState, useEffect, useMemo } from 'react';
import { appStorage } from '../lib/appStorage';
import { createPortal } from 'react-dom';
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
    },
    "يَـٰٓأَيُّهَا": {
      exact: "O! / O you who... (Composite Vocative Expression)",
      contextual: "O you (direct, majestic divine address calling for total focus and emotional response).",
      rootConcept: "A non-derived composite vocative calling structure. Combines the calling particle 'Yā' in Arabic (يَا) with the intermediary pronoun 'Ayyu' (أَيُّ) and the attention-alerting suffix 'Hā' (هَا).",
      formation: "A multi-layered vocative construct consisting of three distinct semantic layers: (1) 'Yā' (pre-vocative particle), (2) 'Ayyu' (a nominative-bound singular pronoun serving as the syntactical recipient of the call), and (3) 'Hā' (the focus-lock particle of visual/auditory attention)."
    },
    "يأيها": {
      exact: "O! / O you who... (Composite Vocative Expression)",
      contextual: "O you (direct, majestic divine address calling for total focus and emotional response).",
      rootConcept: "A non-derived composite vocative calling structure. Combines the calling particle 'Yā' in Arabic (يَا) with the intermediary pronoun 'Ayyu' (أَيُّ) and the attention-alerting suffix 'Hā' (هَا).",
      formation: "A multi-layered vocative construct consisting of three distinct semantic layers: (1) 'Yā' (pre-vocative particle), (2) 'Ayyu' (a nominative-bound singular pronoun serving as the syntactical recipient of the call), and (3) 'Hā' (the focus-lock particle of visual/auditory attention)."
    },
    "يـأيها": {
      exact: "O! / O you who... (Composite Vocative Expression)",
      contextual: "O you (direct, majestic divine address calling for total focus and emotional response).",
      rootConcept: "A non-derived composite vocative calling structure. Combines the calling particle 'Yā' in Arabic (يَا) with the intermediary pronoun 'Ayyu' (أَيُّ) and the attention-alerting suffix 'Hā' (هَا).",
      formation: "A multi-layered vocative construct consisting of three distinct semantic layers: (1) 'Yā' (pre-vocative particle), (2) 'Ayyu' (a nominative-bound singular pronoun serving as the syntactical recipient of the call), and (3) 'Hā' (the focus-lock particle of visual/auditory attention)."
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

  if (w.root === "None" || !w.root || w.root.trim() === "" || w.root.toLowerCase() === "none") {
    concept = "Non-derived structural element. It functions as a semantic connector, focus-marker, or pronoun, without a lexical root.";
    logic = `This is a grammatical or logical particle ('${w.wordType || 'Harf'}') providing structural context, sentence boundaries, or emphasis.`;
  }

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

  const wordTypeLower = w.wordType ? w.wordType.trim().toLowerCase() : '';
  if (w.root !== "None" && w.root && w.root.toLowerCase() !== "none") {
    if (wordTypeLower === "ism" || wordTypeLower === "noun" || wordTypeLower === "adjective") {
      concept = w.isIsmFail ? "Targeted agency / ACTIVE ACTOR" : "Substantive state / permanent quality.";
      logic = `This is an 'Ism' (Noun/Substantive name of concept). Root is '${w.root}'. Case structure is defined by its current position.`;
    } else if (wordTypeLower === "fi'l" || wordTypeLower === "fil" || wordTypeLower === "verb") {
      concept = "Active event / temporal transformation.";
      logic = `This is a 'Fi'l' (Verb) indicating active event propagation in physical space, anchored to the Root '${w.root}'.`;
    } else if (wordTypeLower === "harf" || wordTypeLower === "particle") {
      concept = "Relational connection / directional vector.";
      logic = "This is a fixed structural particle ('Harf') providing emphasis, containment, or direction to nouns or verbs.";
    }
  }

  return {
    exact: literal,
    contextual: contextual,
    rootConcept: concept,
    formation: logic
  };
}

function parseWordGrammar(w: VerseWordBreakdown): WordGrammarDetails {
  const explanation = safeLower(w.explanation || '');
  const meaning = safeLower(w.meaning || '');
  const wordTypeRaw = w.wordType || '';
  const wordType = wordTypeRaw.trim().toLowerCase();

  let tense = "N/A";
  let pattern = "Standard / General";
  let number = "Singular (Mufrad)";
  let gender = "Masculine (Mudhakkar)";
  let aspect = "N/A";
  let caseOrMood = "N/A";

  const isHarfType = wordType === "harf" || wordType === "particle" || w.isHarf;

  if (isHarfType) {
    pattern = "N/A (Fixed Particle)";
    number = "N/A (Particle)";
    gender = "N/A (Particle)";
    aspect = "N/A (Particle)";
    caseOrMood = "Indeclinable (Mabnī)";
  }

  // Check tense (mainly for verbs)
  if (wordType === "fi'l" || wordType === "fil" || wordType === "verb") {
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
  if (!isHarfType) {
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
  }

  // Check Number (singular / plural / dual)
  if (!isHarfType) {
    if (explanation.includes("plural") || meaning.includes("(pl.") || meaning.includes("plural")) {
      number = "Plural (Jam')";
    } else if (explanation.includes("dual") || meaning.includes("dual")) {
      number = "Dual (Muthannā)";
    } else if (explanation.includes("collective")) {
      number = "Collective Noun";
    } else {
      number = "Singular (Mufrad)";
    }
  }

  // Check Gender (masculine / feminine / common)
  if (!isHarfType) {
    if (explanation.includes("feminine") || explanation.includes("female") || explanation.includes("maternal")) {
      gender = "Feminine (Mu'annath)";
    } else if (explanation.includes("masculine") || explanation.includes("male")) {
      gender = "Masculine (Mudhakkar)";
    } else {
      if (wordType === "harf" || wordType === "particle") {
        gender = "N/A (Particle)";
      } else {
        gender = "Masculine (By Default)";
      }
    }
  }

  // Voice or derivation state
  if (!isHarfType) {
    if (wordType === "fi'l" || wordType === "fil" || wordType === "verb") {
      if (explanation.includes("passive")) {
        aspect = "Passive Voice (Majhūl)";
      } else {
        aspect = "Active Voice (Ma'rūf)";
      }
    } else {
      aspect = w.isIsmFail ? "Active Participle" : "Standard Noun derivation";
    }
  }

  // Case/State for Ism / Mood for Fi'l
  if (!isHarfType) {
    if (wordType === "ism" || wordType === "noun" || wordType === "adjective") {
      if (explanation.includes("genitive") || explanation.includes("majroor") || explanation.includes("majrir")) {
        caseOrMood = "Genitive (Majrūr)";
      } else if (explanation.includes("accusative") || explanation.includes("mansoob") || explanation.includes("mansub")) {
        caseOrMood = "Accusative (Manṣūb)";
      } else if (explanation.includes("nominative") || explanation.includes("marfoo") || explanation.includes("marfu")) {
        caseOrMood = "Nominative (Marfū')";
      } else {
        caseOrMood = "Nominative Base (Marfū')";
      }
    } else if (wordType === "fi'l" || wordType === "fil" || wordType === "verb") {
      if (explanation.includes("subjunctive") || explanation.includes("mansub")) {
        caseOrMood = "Subjunctive (Manṣūb)";
      } else if (explanation.includes("jussive") || explanation.includes("majzum")) {
        caseOrMood = "Jussive (Majzūm)";
      } else {
        caseOrMood = "Indicative (Marfū')";
      }
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

const getBismillahData = (surahNum: number, surahName: string): VerseBreakdownData => {
  return {
    surahName: surahName,
    surahNumber: surahNum,
    verseNumber: "0",
    fullVerseArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    fullVerseTranslation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    words: [
      {
        word: "بِ",
        transliteration: "Bi",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "In / With",
        explanation: "Inseparable preposition particle of connection representing instrumentality."
      },
      {
        word: "سْمِ",
        transliteration: "Ism",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "س - م - و",
        meaning: "Name",
        explanation: "Definite noun in genitive construction derived from the root S-M-W (to be lofty)."
      },
      {
        word: "اللَّهِ",
        transliteration: "Allāh",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "ء - ل - ه",
        meaning: "The God / Divine Creator",
        explanation: "The unique proper noun for God, combining al- (the) and ilah (deity)."
      },
      {
        word: "الرَّحْمَٰنِ",
        transliteration: "Ar-Raḥmān",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "ر - ح - م",
        meaning: "The Infinitely Merciful",
        explanation: "An intensive hyperbole pattern (Fa'lān) signifying immediate, boundless maternal-like mercy."
      },
      {
        word: "الرَّحِيمِ",
        transliteration: "Ar-Raḥīm",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "ر - ح - م",
        meaning: "The Especially Merciful",
        explanation: "Constant qualitative pattern (Fa'īl) signifying continuous and specifically tailored mercy."
      }
    ]
  };
};

export default function VerseBreakdown({ theme, onSelectRoot, onSelectWord }: VerseBreakdownProps) {
  // Input Selection
  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => {
    return appStorage.getItem('segmenter_last_preset') || '1:1';
  });
  const [customSurah, setCustomSurah] = useState<string>(() => {
    const savedNumStr = appStorage.getItem('segmenter_last_surah_num');
    const savedNum = savedNumStr ? parseInt(savedNumStr, 10) : 1;
    const sDef = SURAH_MAPPING_LIST.find(s => s.number === savedNum) || SURAH_MAPPING_LIST[0];
    return sDef ? `${sDef.number} - ${sDef.transliteration}` : '';
  });
  const [customVerse, setCustomVerse] = useState<string>(() => {
    return appStorage.getItem('segmenter_last_verse_num') || '1';
  });
  const [selectedSurah, setSelectedSurah] = useState<SurahDefinition | null>(() => {
    const savedNumStr = appStorage.getItem('segmenter_last_surah_num');
    const savedNum = savedNumStr ? parseInt(savedNumStr, 10) : 1;
    return SURAH_MAPPING_LIST.find(s => s.number === savedNum) || SURAH_MAPPING_LIST[0];
  });
  const [isFocused, setIsFocused] = useState<boolean>(false);
  
  // Session-saved custom verses in memory (no user-level cache or localStorage used)
  const [offlineSavedVerses, setOfflineSavedVerses] = useState<Record<string, VerseBreakdownData>>({});

  // App state
  const [isSearching, setIsSearching] = useState(false);
  const [activeVerseData, setActiveVerseData] = useState<VerseBreakdownData | null>(null);
  const [selectedWordToken, setSelectedWordToken] = useState<VerseWordBreakdown | null>(null);

  useEffect(() => {
    if (activeVerseData) {
      appStorage.setItem('segmenter_last_surah_num', activeVerseData.surahNumber.toString());
      appStorage.setItem('segmenter_last_verse_num', activeVerseData.verseNumber);
      appStorage.setItem('segmenter_last_preset', `${activeVerseData.surahNumber}:${activeVerseData.verseNumber}`);
    }
  }, [activeVerseData]);

  const currentWordIndex = useMemo(() => {
    if (!activeVerseData || !selectedWordToken) return -1;
    return activeVerseData.words.findIndex(w => w === selectedWordToken);
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

  const activeSurahDef = useMemo(() => {
    if (!activeVerseData) return null;
    return SURAH_MAPPING_LIST.find(s => s.number === activeVerseData.surahNumber) || null;
  }, [activeVerseData]);

  const handlePrevVerse = () => {
    if (!activeVerseData || !activeSurahDef) return;
    const currentV = parseInt(activeVerseData.verseNumber, 10);
    if (currentV > 0) {
      const prevVStr = (currentV - 1).toString();
      setCustomVerse(prevVStr);
      setSelectedPresetId(`${activeVerseData.surahNumber}:${prevVStr}`);
    }
  };

  const handleNextVerse = () => {
    if (!activeVerseData || !activeSurahDef) return;
    const currentV = parseInt(activeVerseData.verseNumber, 10);
    if (currentV < activeSurahDef.totalVerses) {
      const nextVStr = (currentV + 1).toString();
      setCustomVerse(nextVStr);
      setSelectedPresetId(`${activeVerseData.surahNumber}:${nextVStr}`);
    }
  };

  // Swipe gesture logic
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped right -> mentally move 'back/right' towards start of text -> prev word
        handlePrevWord();
      } else {
        // Swiped left -> mentally move 'forward/left' in text -> next word
        handleNextWord();
      }
    }
    setTouchStartX(null);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeVerseData || selectedWordToken === null) return;
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        handlePrevWord();
      }
      if (e.key === 'ArrowLeft') {
        handleNextWord();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVerseData, selectedWordToken, currentWordIndex]);

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
        dotIsm: 'bg-amber-600',
        dotFil: 'bg-emerald-600',
        dotHarf: 'bg-stone-500',
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
        dotIsm: 'bg-pink-400',
        dotFil: 'bg-violet-400',
        dotHarf: 'bg-cyan-400',
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
      dotIsm: 'bg-amber-400',
      dotFil: 'bg-emerald-400',
      dotHarf: 'bg-sky-400',
    };
  }, [isParchment, isCosmic]);

  // Real-time matched Surah list based on text typed (either number or partial transliterated/Arabic name)
  const surahSuggestions = useMemo<SurahDefinition[]>(() => {
    const query = safeLower(customSurah.trim());
    if (!query) return [];

    // If the input matches exactly a selectedSurah's text representation, don't show suggestions
    if (selectedSurah && `${selectedSurah.number} - ${selectedSurah.transliteration}` === customSurah.trim()) {
      return [];
    }

    const surahNum = parseInt(query, 10);
    if (!isNaN(surahNum)) {
      // Find surahs starting with or containing this number digits
      return SURAH_MAPPING_LIST.filter(s => s.number.toString().includes(query)).slice(0, 5);
    }

    // Otherwise match by transliteration name or Arabic name
    const cleanQuery = query.replace(/^(al|ar|an|ash|at|ad|az|as|aj|ad)-?/i, '');
    return SURAH_MAPPING_LIST.filter(s => {
      const cleanTrans = safeLower(s.transliteration).replace(/^(al|ar|an|ash|at|ad|az|as|aj|ad)-?/i, '');
      return cleanTrans.includes(cleanQuery) || 
             safeLower(s.transliteration).includes(query) || 
             s.name.includes(query);
    }).slice(0, 5);
  }, [customSurah, selectedSurah]);

  // Keep selectedSurah and customSurah in sync with the activeVerseData
  useEffect(() => {
    if (activeVerseData) {
      const surahDef = SURAH_MAPPING_LIST.find(s => s.number === activeVerseData.surahNumber) || null;
      if (surahDef) {
        setSelectedSurah(surahDef);
        setCustomSurah(`${surahDef.number} - ${surahDef.transliteration}`);
        setCustomVerse(activeVerseData.verseNumber.toString());
      }
    }
  }, [activeVerseData]);

  // Sync verse choice when matched Surah changes
  useEffect(() => {
    if (selectedSurah) {
      const currentVal = parseInt(customVerse, 10);
      if (isNaN(currentVal) || currentVal < 0 || currentVal > selectedSurah.totalVerses) {
        setCustomVerse('0'); // By default, load Ayat 0 (Bismillah)!!
      }
    } else {
      setCustomVerse('');
    }
  }, [selectedSurah]);

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
  const handleLiveQuery = async (e?: React.FormEvent, forceRefresh: boolean = false) => {
    if (e) e.preventDefault();
    if (!selectedSurah) {
      setErrorMessage('Please input or select a valid Surah first.');
      return;
    }
    // LOCAL OFFLINE ADVANTAGE: Check if this is already cached in our offline registry!
    const sQuery = selectedSurah.number.toString();
    const vQuery = customVerse.trim() || '0';
    
    const cacheKey = `${sQuery}:${vQuery}`;

    // INTERCEPT VERSE 0: load Bismillah locally and instantaneously!
    if (vQuery === '0' && !forceRefresh) {
      const bismillahData = getBismillahData(selectedSurah.number, selectedSurah.transliteration);
      setActiveVerseData(bismillahData);
      setSelectedWordToken(null);
      setSelectedPresetId(cacheKey);
      setErrorMessage(null);
      return;
    }

    // LOCAL OFFLINE ADVANTAGE: Check if this is already cached in our offline registry!
    if (allVersesMap[cacheKey] && !forceRefresh) {
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
      const cachedKey = appStorage.getItem('user_api_key') || appStorage.getItem('quranic_arabic_custom_api_key') || '';
      
      const response = await fetch('/api/breakdown-verse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surah: sQuery,
          verse: vQuery,
          customApiKey: cachedKey,
          forceRefresh
        })
      });

      if (!response.ok) {
        const errorVal = await response.json();
        throw new Error(errorVal.error || 'Failed to complete breakdown.');
      }

      const freshVerseData: VerseBreakdownData = await response.json();
      if (freshVerseData && freshVerseData.words && freshVerseData.words.length > 0) {
        // Guarantee clean, accurate names from local map
        freshVerseData.surahName = selectedSurah.transliteration;
        freshVerseData.surahNumber = selectedSurah.number;
        freshVerseData.verseNumber = vQuery;

        // Retain recently fetched verses only in in-memory list for this active browser session
        setOfflineSavedVerses(prev => ({
          ...prev,
          [cacheKey]: freshVerseData
        }));

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

  // Automated Loader on selection changes with a short debounce to support typing
  useEffect(() => {
    if (!selectedSurah) return;
    const vQuery = customVerse.trim();
    if (!vQuery) return;

    // Check if the current loaded verse matching
    if (activeVerseData && activeVerseData.surahNumber === selectedSurah.number && activeVerseData.verseNumber === vQuery) {
      return;
    }

    const timer = setTimeout(() => {
      handleLiveQuery();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedSurah?.number, customVerse]);

  // Switch preset directly
  const handleLoadPresetDirectly = (presetId: string) => {
    setSelectedPresetId(presetId);
    
    const parsed = presetId.split(':');
    if (parsed.length === 2) {
      const surahNum = parseInt(parsed[0], 10);
      const surahDef = SURAH_MAPPING_LIST.find(s => s.number === surahNum) || null;
      if (surahDef) {
        setSelectedSurah(surahDef);
        setCustomSurah(`${surahDef.number} - ${surahDef.transliteration}`);
      } else {
        setCustomSurah(parsed[0]);
      }
      setCustomVerse(parsed[1]);
    } else {
      setCustomSurah('');
      setCustomVerse('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Input Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
        
        {/* Preset Select Controls and Cache */}
        <div className={`border rounded-2xl p-6 ${colors.cardBg} transition-all duration-300 shadow-sm flex flex-col h-full`}>
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
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Session Explored Verses ({Object.keys(offlineSavedVerses).length}):
                  </h4>
                  <button
                    onClick={() => {
                      if (window.confirm("Do you want to clear this session's recently loaded verses list?")) {
                        setOfflineSavedVerses({});
                      }
                    }}
                    className="text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                    title="Clear session explorer list"
                  >
                    <Trash2 className="w-3 h-3" /> Clear Session List
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
        </div>

        {/* Custom Search panel with real-time automatic loading and status */}
        <div className={`border rounded-2xl p-6 ${colors.cardBg} transition-all duration-300 shadow-sm flex flex-col h-full`}>
          <div className="flex-1 flex flex-col gap-5 justify-between">
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
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    onChange={(e) => {
                      setCustomSurah(e.target.value);
                      if (selectedSurah && e.target.value !== `${selectedSurah.number} - ${selectedSurah.transliteration}`) {
                        setSelectedSurah(null);
                      }
                    }}
                    className={`w-full text-xs rounded-xl py-2 px-3 pr-24 focus:outline-none border bg-black/5 ${colors.hoverPill}`}
                    required
                  />
                  {selectedSurah && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-serif">
                        {selectedSurah.transliteration}
                      </span>
                    </div>
                  )}
                </div>

                {/* Suggestions List Overlay */}
                {isFocused && surahSuggestions.length > 0 && (
                  <div className={`absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border shadow-xl p-1 max-h-56 overflow-y-auto ${
                    isParchment ? 'bg-[#f4efe6] border-[#dacbb5]' : 'bg-slate-950 border-slate-800'
                  }`}>
                    {surahSuggestions.map((s) => (
                      <button
                        key={s.number}
                        type="button"
                        onMouseDown={() => {
                          setSelectedSurah(s);
                          setCustomSurah(`${s.number} - ${s.transliteration}`);
                          setCustomVerse('0');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all text-left cursor-pointer ${
                          isParchment 
                            ? 'hover:bg-[#dacbb5]/50 text-[#3d3025]' 
                            : 'hover:bg-slate-800/80 text-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono opacity-50 px-1.5 py-0.5 rounded bg-black/10">
                            {s.number}
                          </span>
                          <span className="font-bold">{s.transliteration}</span>
                          <span className="opacity-60 text-[10px] italic">({s.translation})</span>
                        </div>
                        <span className="font-serif text-[11px] opacity-80">{s.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Visual indicator message & Inline interactive selector */}
                {selectedSurah ? (
                  <p className="text-[10px] text-emerald-500 font-semibold mt-1 flex items-center gap-1 animate-fadeIn">
                    <Check className="w-3 h-3" /> Selected: {selectedSurah.transliteration} ({selectedSurah.name}) - {selectedSurah.totalVerses} Ayas
                  </p>
                ) : customSurah.trim() ? (
                  <div className="space-y-1.5 mt-2 animate-fadeIn">
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider font-mono">
                      👉 Click to Select Surah:
                    </p>
                    <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
                      {surahSuggestions.map((s) => (
                        <button
                          key={s.number}
                          type="button"
                          onClick={() => {
                            setSelectedSurah(s);
                            setCustomSurah(`${s.number} - ${s.transliteration}`);
                            setCustomVerse('0');
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 text-xs rounded-xl border transition-all text-left w-full cursor-pointer ${
                            isParchment 
                              ? 'bg-[#ebd8c3]/20 border-[#dccbae] hover:bg-[#ebd8c3]/40 text-[#2c241e]' 
                              : 'bg-indigo-950/20 border-indigo-950/40 hover:bg-indigo-900/40 text-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-extrabold opacity-70 px-1.5 py-0.5 rounded bg-black/10">
                              {s.number}
                            </span>
                            <span className="font-bold">{s.transliteration}</span>
                            <span className="opacity-60 text-[10px] italic">({s.translation})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-emerald-500 font-bold">{s.totalVerses} Ayas</span>
                            <span className="font-serif text-[11px] font-bold">{s.name}</span>
                          </div>
                        </button>
                      ))}
                      {surahSuggestions.length === 0 && (
                        <p className="text-[10px] text-rose-400 font-medium">
                          No matching Surah found. Enter number 1-114 or name digits.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] opacity-40 mt-1">
                     Type name or number to open interactive choice list
                  </p>
                )}
              </div>

              {/* Dynamic Ayat / Verse Dropdown Selector */}
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="block text-[10px] font-bold font-mono tracking-wider opacity-60 uppercase mb-1 whitespace-nowrap">
                    Verse Selection
                  </label>
                  {selectedSurah ? (
                    <select
                      value={customVerse}
                      onChange={(e) => {
                        setCustomVerse(e.target.value);
                      }}
                      className={`w-full text-xs rounded-xl py-2 px-3 focus:outline-none border bg-black/5 ${colors.hoverPill}`}
                      required
                    >
                      {Array.from({ length: selectedSurah.totalVerses + 1 }, (_, idx) => idx).map((v) => (
                        <option 
                          key={v} 
                          value={v.toString()}
                          className={isParchment ? 'text-[#2c241e]' : 'text-slate-900'}
                        >
                          {v === 0 ? 'Ayat 0 (Bismillah)' : `Ayat ${v}`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      placeholder="Select Surah first..."
                      className="w-full text-xs rounded-xl py-2 px-3 opacity-50 border bg-black/10 cursor-not-allowed"
                    />
                  )}
                </div>
              </div>

            </div>

            {/* Auto-loading status block */}
            <div className={`p-4 rounded-xl border text-xs font-mono flex items-center gap-2.5 ${
              isSearching 
                ? 'border-amber-500/30 bg-amber-500/5 text-amber-500 animate-pulse' 
                : selectedSurah 
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500' 
                  : 'border-current/10 bg-current/5 opacity-55'
            }`}>
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0 text-amber-500" />
                  <div className="leading-snug">
                    <p className="font-bold">Analyzing Verse Complexities...</p>
                    <p className="text-[10px] opacity-75">Computing classical morphology and scales dynamically</p>
                  </div>
                </>
              ) : selectedSurah ? (
                <>
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  <div className="leading-snug">
                    <p className="font-bold">Segment Cache Confirmed</p>
                    <p className="text-[10px] opacity-75">Auto-loaded: S. {selectedSurah.number} ({selectedSurah.transliteration}):{customVerse}</p>
                  </div>
                  <div className="ml-auto">
                    <button
                      type="button"
                      onClick={() => handleLiveQuery(undefined, true)}
                      className={`px-2.5 py-1 text-[10px] rounded-lg border font-bold uppercase tracking-wider transition-colors ${
                        isParchment ? 'border-[#8c6239]/40 text-[#8c6239] hover:bg-[#8c6239]/10' : 'border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10'
                      }`}
                      title="Invalidate cache and generate a fresh analysis for this verse"
                    >
                      Force Refresh
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 shrink-0 opacity-60" />
                  <div className="leading-snug">
                    <p className="font-bold">Select Surah to Deconstruct</p>
                    <p className="text-[10px] opacity-75">Choose an option or type above to begin breakdown</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Informational Alert for Search state handling */}

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

      {/* Main Structural Display Panel */}
      {activeVerseData ? (
        <div 
          className="max-w-4xl mx-auto space-y-8"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* The Verse display card */}
          <div className={`border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all ${colors.cardBg} shadow-sm`}>
            <div className="w-full flex flex-col md:flex-row items-center justify-between border-b border-current/10 pb-4 mb-5 gap-4">
              <div className="text-left">
                <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block">
                  Quranic Arabic Orthography & Grammatical Wave
                </span>
              </div>
              
              {/* Verse / Ayat Navigation Controls */}
              <div className="flex items-center gap-2 select-none">
                <button
                  type="button"
                  onClick={handlePrevVerse}
                  disabled={!activeSurahDef || parseInt(activeVerseData.verseNumber, 10) <= 0}
                  className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 text-xs font-mono font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${colors.hoverPill}`}
                  title="Previous Verse (Ayat)"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                <span className={`text-xs font-mono font-extrabold uppercase rounded-xl py-1.5 px-3 border border-current/10 bg-current/5 shadow-sm`}>
                  {parseInt(activeVerseData.verseNumber, 10) === 0 ? 'Bismillah' : `Ayat ${activeVerseData.verseNumber} of ${activeSurahDef?.totalVerses || '?'}`}
                </span>

                <button
                  type="button"
                  onClick={handleNextVerse}
                  disabled={!activeSurahDef || parseInt(activeVerseData.verseNumber, 10) >= activeSurahDef.totalVerses}
                  className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 text-xs font-mono font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${colors.hoverPill}`}
                  title="Next Verse (Ayat)"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className={`text-[10.5px] font-mono font-bold uppercase rounded-lg p-1.5 px-2.5 border border-current/10 ${colors.accentText}`}>
                Surah {activeVerseData.surahName} ({activeVerseData.surahNumber}:{activeVerseData.verseNumber})
              </span>
            </div>

            {/* Word-by-Word Color-Coded Semantic Sentence Display */}
            <div 
              className="flex flex-wrap gap-x-2.5 md:gap-x-4 gap-y-2 md:gap-y-3.5 justify-center py-8 max-w-4xl mx-auto select-none" 
              dir="rtl"
            >
               {activeVerseData.words.map((w, idx) => {
                 const isSelected = selectedWordToken === w;
                 let typeColor = colors.textIsm;
                 const wTypeLower = w.wordType ? w.wordType.trim().toLowerCase() : '';
                 if (wTypeLower === "fi'l" || wTypeLower === "fil" || wTypeLower === "verb") {
                   typeColor = colors.textFil;
                 } else if (wTypeLower === "harf" || wTypeLower === "particle") {
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
                <span className={`w-3 h-3 rounded-full ${colors.dotIsm} border border-current/10 shrink-0`}></span>
                <span className="font-bold opacity-85">Ism (Noun)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${colors.dotFil} border border-current/10 shrink-0`}></span>
                <span className="font-bold opacity-85">Fi'l (Verb)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-3 h-3 rounded-full ${colors.dotHarf} border border-current/10 shrink-0`}></span>
                <span className="font-bold opacity-85">Harf (Particle)</span>
              </div>
            </div>

                      </div>

          {/* English Translation Card */}
          <div className={`border rounded-2xl p-6 text-center transition-all ${colors.cardBg} shadow-sm`}>
            <p className="text-[10px] font-mono opacity-40 uppercase tracking-wider mb-2 font-bold">
              Universal English Translation
            </p>
            <p className="text-[15px] md:text-base italic opacity-95 leading-relaxed font-serif text-current">
              "{activeVerseData.fullVerseTranslation}"
            </p>
          </div>

          <p className="text-center text-xs opacity-50 italic py-2">
            💡 TIP: Click on any Arabic word inside the Aayat to display its morphological deconstruction and contextual direct translation instantly!
          </p>

          {/* Hover Screen / Detached Modal for Word-by-Word details */}
          {selectedWordToken && createPortal((() => {
            const currentWordIndex = activeVerseData.words.findIndex(w => w === selectedWordToken);
            
            const parsedDetails = getDetailedWordMeanings(selectedWordToken);
            const info = parseWordGrammar(selectedWordToken);
            
            // Helpful descriptions for Part of Speech
            const wordTypeNorm = selectedWordToken.wordType ? selectedWordToken.wordType.trim().toLowerCase() : '';
            const isIsm = wordTypeNorm === 'ism' || wordTypeNorm === 'noun' || wordTypeNorm === 'adjective';
            const isFil = wordTypeNorm === "fi'l" || wordTypeNorm === 'fil' || wordTypeNorm === 'verb';

            const categoryDesc = 
              isIsm 
                ? "Noun / Adjective / Pronoun (Names a core entity or quality independently of active time)" 
                : isFil
                  ? "Action Verb (Represents a dynamic event bound to a past, present, or future timeline)"
                  : "Particle (Preposition/Conjunction. Yields semantic vectors only when linked to other words)";

            const typeColorClass = isIsm 
              ? colors.textIsm 
              : isFil 
                ? colors.textFil 
                : colors.textHarf;

            return (
              <div 
                className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn transition-colors ${theme === 'parchment' ? 'text-[#2c241e]' : theme === 'cosmic' ? 'text-slate-100' : 'text-slate-100'}`}
                onClick={() => setSelectedWordToken(null)}
              >
                <div 
                  className={`relative w-full max-w-2xl max-h-full flex flex-col rounded-2xl border shadow-2xl transition-all transform scale-100 overflow-hidden ${colors.cardBg} border-current/15`}
                  onClick={(e) => e.stopPropagation()} // Prevent close on card click
                >
                  {/* Top Header Row with Close Button */}
                  <div className="flex items-center justify-between shrink-0 border-b border-current/10 p-4 md:p-5 font-mono">
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

                  <div className="overflow-y-auto p-4 md:p-5 space-y-4">
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
                        <span className={`font-bold uppercase text-[10px] tracking-wider block mb-0.5 ${typeColorClass.split(' ')[0]}`}>
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
                  <div className="shrink-0 p-4 md:p-5 border-t border-current/10 bg-current/5 flex items-center justify-between gap-4">
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
          })(), document.body)}

        </div>
      ) : (
         <div className={`mt-8 border rounded-2xl p-12 text-center flex flex-col items-center justify-center transition-all min-h-[400px] ${colors.cardBg} shadow-sm animate-fadeIn`}>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-serif mb-6 opacity-85 leading-relaxed font-bold text-transparent bg-clip-text drop-shadow-sm ${
              isParchment ? 'bg-gradient-to-r from-[#8c6239] to-[#b38554]' : isCosmic ? 'bg-gradient-to-r from-indigo-400 to-pink-500' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
            }`} dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h2>
            <p className="text-sm opacity-60 font-medium font-mono uppercase tracking-widest">Select a Surah above to begin your exploration</p>
         </div>
      )}

    </div>
  );
}
