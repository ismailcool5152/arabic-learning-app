import React, { useState } from 'react';
import { LayoutTheme } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  Compass, 
  Award, 
  BookMarked, 
  Check, 
  RotateCcw,
  Volume2, 
  Play, 
  Pause, 
  Info,
  HelpCircle,
  AlertCircle,
  HelpCircle as QuizIcon,
  ChevronRight,
  Sparkle,
  Layers,
  ArrowRight
} from 'lucide-react';

interface TajweedRulesProps {
  theme: LayoutTheme;
}

// Color scheme mapper for tajweed tags
const TAJWEED_COLORS = {
  madd: 'text-red-500 font-extrabold',
  ghunnah: 'text-emerald-500 font-extrabold dark:text-emerald-400',
  qalqalah: 'text-blue-500 font-extrabold dark:text-blue-400',
  izhar: 'text-amber-500 font-bold dark:text-amber-400',
  idgham: 'text-slate-400 line-through opacity-70',
  iqlab: 'text-indigo-500 font-semibold dark:text-indigo-400'
};

interface RuleExample {
  phrase: string;
  transliteration: string;
  translation: string;
  ruleKey: 'izhar' | 'idgham' | 'iqlab' | 'ikhfa' | 'qalqalah' | 'madd' | 'shafawi' | 'tafkheem' | 'lam';
  audioSimulatedText: string;
  explanation: string;
}

interface TajweedCategory {
  id: string;
  title: string;
  arabicTitle: string;
  summary: string;
  letterSummary: string;
  details: string[];
  examples: RuleExample[];
}

const TAJWEED_DATABASE: TajweedCategory[] = [
  {
    id: 'noon_sakinah',
    title: 'Noon Sākinah & Tanween',
    arabicTitle: 'أحكام النون الساكنة والتنوين',
    summary: 'Rules governing the unvoweled Noon (نْ) or the double vowels (Tanween: ً  ٌ  ٍ) when followed by any Arabic letter.',
    letterSummary: 'Varies by rule, covers all 28 letters of the Arabic alphabet.',
    details: [
      'Izhār (Clarity): Pronounce the "N" sound clearly without extra nasalization if followed by Throat Letters: ء (Hamzah), هـ (Ha), ع (Ayn), ح (Haa), غ (Ghayn), خ (Khaa).',
      'Idghām (Merging): Merge the "N" or Tanween into the next letter. With Ghunnah (nasalization) for letters: ي , ن , م , و (Y-N-M-W). Without Ghunnah for letters: ل , ر (L-R).',
      'Iqlāb (Conversion): Convert the "N" sound into a soft "M" sound (with a 2-beat ghunnah) when followed by the letter ب (Ba). This is often indicated by a tiny م above.',
      'Ikhfā (Hiding/Nasalization): Hide the "N" sound in the nasal cavity, holding for 2 beats, when followed by any of the remaining 15 letters.'
    ],
    examples: [
      {
        phrase: 'مَنْ عَمِلَ',
        transliteration: "Man 'amila",
        translation: "Whoever does (righteousness)",
        ruleKey: 'izhar',
        audioSimulatedText: "Man... 'amila (Sharp, clear, no nasal holding)",
        explanation: "Rule: Izhār. Noon Sākinah (نْ) is followed by the throat letter Ayn (ع). The Noon is pronounced clearly from its articulation point without holding."
      },
      {
        phrase: 'مَن يَقُولُ',
        transliteration: "May-yaqūlu",
        translation: "Those who say",
        ruleKey: 'idgham',
        audioSimulatedText: "May-y-y-yaqoolu (With 2 beats of beautiful nasal sound)",
        explanation: "Rule: Idghām Ma'al Ghunnah (Merging with Nasalization). Noon Sākinah (نْ) is followed by the letter Ya (ي), merging completely into a doubled Ya sound with a resonance in the nose."
      },
      {
        phrase: 'مِن بَعْدِ',
        transliteration: "Mim-ba'di",
        translation: "After...",
        ruleKey: 'iqlab',
        audioSimulatedText: "Mim...ba'di (Transform न् into म् with nasal humming)",
        explanation: "Rule: Iqlāb (Conversion). Noon Sākinah is followed directly by Ba (ب). The Noon is converted into a Meem, keeping lips closed lightly with a 2-count nasal ghunnah."
      },
      {
        phrase: 'أَنفُسَكُمْ',
        transliteration: "Anfusakum",
        translation: "Your processes / Yourselves",
        ruleKey: 'ikhfa',
        audioSimulatedText: "An...fusakum (Air flow split between nose and mouth)",
        explanation: "Rule: Ikhfā Haqeeqi (Hiding). The Noon is followed by Fa (ف). The tongue is kept ready near, but not touching, the lower lip for Fa, causing a beautiful concealed hum."
      }
    ]
  },
  {
    id: 'meem_sakinah',
    title: 'Meem Sākinah Rules',
    arabicTitle: 'أحكام الميم الساكنة',
    summary: 'Rules governing the unvoweled Meem (مْ) when followed by general letters. Proper articulation relies on lip adjustments.',
    letterSummary: 'Strictly grouped into 3 outcomes depending on the following letter.',
    details: [
      'Ikhfā Shafawi (Oral Hiding): Conceal the Meem sound with Ghunnah (2 beats) when followed directly by the letter ب (Ba).',
      'Idghām Shafawi / Idgham Mithlayn: Merge the Meem into a second vocal Meem with a beautiful Ghunnah (2 beats) when followed by another م (Meem).',
      'Izhār Shafawi (Oral Clarity): Pronounce the Meem clearly and cleanly from the lips without any nasal extra beats when followed by any of the details remaining 26 letters.'
    ],
    examples: [
      {
        phrase: 'تَرْمِيهِم بِحِجَارَةٍ',
        transliteration: "Tarmeehim-bihijārah",
        translation: "Striking them with stones",
        ruleKey: 'shafawi',
        audioSimulatedText: "Tarmeehim...bihijarah (Humming nasalization with closed lips)",
        explanation: "Rule: Ikhfā Shafawi. Meem Sākinah (مْ) is followed by the letter Ba (ب). The lips are touching lightly to hide the Meem with a 2-beat nasal resonance."
      },
      {
        phrase: 'لَهُم مَّا يَشَاءُونَ',
        transliteration: "Lahum-mā yashā'ūn",
        translation: "For them is whatever they wish",
        ruleKey: 'idgham',
        audioSimulatedText: "Lahum-m-m-mā yashā'oon (Complete merging of the double Meem)",
        explanation: "Rule: Idghām Shafawi/Mithlayn. Two Meems join together. The second Meem has a Shaddah (ّ), and we hold this joined sound in the nasal cavity for 2 beats."
      },
      {
        phrase: 'أَمْ لَمْ تُنذِرْهُمْ',
        transliteration: "Am lam tundhirhum",
        translation: "Or whether you did not warn them",
        ruleKey: 'izhar',
        audioSimulatedText: "Am (clear) lam (clear) tundhirhum (no holding)",
        explanation: "Rule: Izhār Shafawi. Meem Sākinah is followed by Lam (ل) and Ta (ت). We pronounce the Meem swiftly and clearly without any extra vibration or nasal humming."
      }
    ]
  },
  {
    id: 'qalqalah',
    title: 'Qalqalah (Echo & Vibration)',
    arabicTitle: 'أحكام القلقلة',
    summary: 'Echo or bouncing vibration in the vocal cords when a Qalqalah letter is Sākinah (unvoweled) or stopped on.',
    letterSummary: 'Five letters grouped in the classic phrase: قُطْبُ جَدٍ (Qaf, Ta, Ba, Jeem, Dal).',
    details: [
      'Qalqalah Kubra (Greatest): Occurs when stopping on a Qalqalah letter at the end of a verse, especially if it has a Shaddah (ّ). Requires a strong, distinct bounce.',
      'Qalqalah Wusta (Medium): Occurs when stopping on a Qalqalah letter that is unvoweled (Sākin) at the end of a word but has no Shaddah.',
      'Qalqalah Sughra (Smallest): Occurs when the Qalqalah letter is in the middle of a word. The bounce is minor, letting you proceed swiftly to the next letter.'
    ],
    examples: [
      {
        phrase: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        transliteration: "Qul huwa-llāhu ahad(bounced)",
        translation: "Say, 'He is Allah, [who is] One'",
        ruleKey: 'qalqalah',
        audioSimulatedText: "Ahad--d (Distinct vocal bounce at the stop)",
        explanation: "Rule: Qalqalah Kubra (at stop). The Dal (د) is at the very end of the verse. When we stop on it, it becomes Sākin, triggering a deep resonance and release."
      },
      {
        phrase: 'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ',
        transliteration: "hablum-mim-masad(stopped)",
        translation: "Around her neck is a rope of twisted fiber",
        ruleKey: 'qalqalah',
        audioSimulatedText: "Masad--d (Medium released vocal bounce)",
        explanation: "Rule: Qalqalah Wusta. Stop on the Dal at the end of 'Masad' which doesn't have a Shaddah."
      },
      {
        phrase: 'يَقْتُلُونَ',
        transliteration: "Yaq-tulūn",
        translation: "They kill / execute",
        ruleKey: 'qalqalah',
        audioSimulatedText: "Yaq!tuloon (Quick internal release on the Qaf)",
        explanation: "Rule: Qalqalah Sughra. The Qaf (ق) is in the middle of the word 'Yaqtulun' and has a Sukoone (ْ). We vibrate the articulation point briefly and proceed smoothly."
      },
      {
        phrase: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
        transliteration: "Lahabiw-wa tabb(strong stop)",
        translation: "Ruined are both hands of Abu Lahab...",
        ruleKey: 'qalqalah',
        audioSimulatedText: "Wa tabb-b-b! (Super strong stop on the double Ba)",
        explanation: "Rule: Qalqalah Akbar/Kubra with Shaddah. The Ba has a Shaddah at stop. We press on the letter first (tasgdeed representation) then bounce it out with great strength."
      }
    ]
  },
  {
    id: 'mudood',
    title: 'Al-Mudood (Prolongation)',
    arabicTitle: 'أحكام المدود',
    summary: 'Elongation of the voice through the three natural Madd vowels: Alif (ا), Waw (و), or Ya (ي) under specific circumstances.',
    letterSummary: 'Governed by voweled Alif after Fatha, Waw after Dammah, and Ya after Kasrah.',
    details: [
      'Madd Tabee\'ee (Natural): The default vowel elongation. Held for exactly 2 counts/beats (e.g. نُوحِيهَا).',
      'Madd Wajib Muttasil (Obligatory Connected): Occurs when a Madd letter is followed by a Hamzah (ء) in the SAME word. Held for 4 to 5 counts (indicated by a thick wave line ~).',
      'Madd Jaiz Munfasil (Permissible Disconnected): Occurs when the Madd letter ends a word, and the Hamzah is at the START of the next word. Held for 2, 4 or 5 counts.',
      'Madd \'Arid Lis-Sukoon (Temporary Stop): Occurs when a natural Madd is followed by a letter made Sākin temporarily due to pausing at a verse. Held for 2, 4, or 6 counts.',
      'Madd Lāzim (Necessary Constant): Occurs when a Madd letter is followed by a Sukoon or a Shaddah in the same word. Held strictly for 6 long counts.'
    ],
    examples: [
      {
        phrase: 'جَاءَ نَصْرُ اللَّهِ',
        transliteration: "Jāāā'a nasrullah",
        translation: "When the victory of Allah has come",
        ruleKey: 'madd',
        audioSimulatedText: "Jaaaa-a (4 to 5 ticks of voice extension)",
        explanation: "Rule: Madd Wajib Muttasil. Alif Madd and Hamzah are inside the single word 'Jā'a' (جاء). To honor the Hamzah, we stretch our vocal path generously."
      },
      {
        phrase: 'فِي أَحْسَنِ تَقْوِيمٍ',
        transliteration: "Fīīī ahsani taqwīm",
        translation: "In the best of stature",
        ruleKey: 'madd',
        audioSimulatedText: "Fēēē ahsani (4 counts of extension crossing words)",
        explanation: "Rule: Madd Jaiz Munfasil. The word 'Fī' ends with Madd letter Yah, and the next word 'Ahsani' starts with Hamzah. We stretch the sound gracefully."
      },
      {
        phrase: 'وَلَا الضَّالِّينَ',
        transliteration: "Wa lād-dāāāāālleen",
        translation: "Nor of those who are astray",
        ruleKey: 'madd',
        audioSimulatedText: "Wa lad-Daaaaaalleen (6 absolute counts of powerful epic elongation)",
        explanation: "Rule: Madd Lāzim Kalimee Muthaqqal. The Alif Madd is followed directly by a letter with Shaddah (اللام المشددة). We must stretch this for 6 full beats without fail."
      }
    ]
  },
  {
    id: 'ra_lam',
    title: 'Ra & Lam Attributes',
    arabicTitle: 'أحكام الراء واللام',
    summary: 'The vocal style of the letter Ra (ر) and the Lām (ل) in the Majestic word "Allah". They switch dynamically between Heavy and Light.',
    letterSummary: 'Strictly based on surrounding Harakat (vowels) like Fatha, Dammah, and Kasrah.',
    details: [
      'Tafkheem (Thickening - 🌲 Heavy): Pronounce the letter with a raised back tongue, filling the mouth with sound. Applicable to Ra with Fatha/Dammah (رَ, رُ) or Lam of "Allah" preceded by Fatha/Dammah.',
      'Tarqeeq (Thinning - 🌱 Light): Pronounce the letter flatly without raising the tongue. Applicable to Ra with Kasrah (رِ) or Lam of "Allah" preceded by Kasrah.'
    ],
    examples: [
      {
        phrase: 'قُلْ هُوَ اللَّهُ',
        transliteration: "Qul huwa-LLAHU (Heavy)",
        translation: "Say, 'He is Allah'",
        ruleKey: 'lam',
        audioSimulatedText: "Huwa-LLLAHH (Deep, thick, glorious majestic echo)",
        explanation: "Rule: Tafkheem of Lam of Allah. The majestic word is preceded by a Fatha (on the Waw of 'huwa'). Thus, we pronounce the Lām with a heavy velarized tone."
      },
      {
        phrase: 'بِسْمِ اللَّهِ',
        transliteration: "Bismi-llāhi (Light)",
        translation: "In the name of Allah",
        ruleKey: 'lam',
        audioSimulatedText: "Bismi-llah (Thin, sweet, humble articulation, flat tongue)",
        explanation: "Rule: Tarqeeq of Lam of Allah. The majestic word is preceded by a Kasrah (on the Meem of 'Bismi'). The Lām is made thin and sweet."
      },
      {
        phrase: 'رَبِّ الْعَالَمِينَ',
        transliteration: "Rabbil 'ālamīn (Thick R)",
        translation: "Lord of the worlds",
        ruleKey: 'tafkheem',
        audioSimulatedText: "Rrrabbil (Deep throat backing, heavy vibrate)",
        explanation: "Rule: Tafkheem of Ra. The Ra starts with a Fatha (رَ). We curve our tongue tip up and push back the sound to create a royal, heavy echo."
      }
    ]
  }
];

interface QuizQuestion {
  id: number;
  verseSnippet: string;
  surahRef: string;
  highlightPart: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  ruleExplanation: string;
}

const TAJWEED_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    verseSnippet: "مَن يَقُولُ آمَنَّا",
    surahRef: "Surah Al-Baqarah 2:8",
    highlightPart: "مَن يَقُولُ",
    questionText: "What Tajweed rule applies to the highlighted segment where a Noon Sākinah is followed by the letter Ya (ي)?",
    options: [
      "Izhār (Clear pronunciation)",
      "Idghām Ma'al Ghunnah (Merging with nasal sound)",
      "Iqlāb (Changing to Meem)",
      "Ikhfā Shafawi (Oral Hiding)"
    ],
    correctIndex: 1,
    ruleExplanation: "Since the letter Ya (ي) is from the group 'Y-N-M-W' (يَنْمُو), it triggers Idghām Ma'al Ghunnah. The Noon is merged into the Ya and held in the nose for 2 counts."
  },
  {
    id: 2,
    verseSnippet: "مِن بَعْدِ مَا جَاءَتْهُمُ",
    surahRef: "Surah Al-Baqarah 2:109",
    highlightPart: "مِن بَعْدِ",
    questionText: "Which rule changes the 'N' sound into a nasal 'M' when Noon Sākinah faces the letter Ba (ب)?",
    options: [
      "Ikhfā (Hiding)",
      "Izhār (Clarity)",
      "Iqlāb (Conversion)",
      "Qalqalah (Echo)"
    ],
    correctIndex: 2,
    ruleExplanation: "This is Iqlāb. The letter Ba (ب) converts Noon or Tanween into a simulated Meem with closed lips and a 2-beat ghunnah."
  },
  {
    id: 3,
    verseSnippet: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    surahRef: "Surah Al-Ikhlas 112:1",
    highlightPart: "أَحَدٌ (at stop)",
    questionText: "When stopping on the word 'أَحَدٌ', the letter Dal (د) becomes Sākin. Which rule causes a bold vibration bounce here?",
    options: [
      "Qalqalah Kubra (Great bounce on pause)",
      "Madd Lāzim (Necessary prolongation)",
      "Izhār Shafawi (Oral clarity)",
      "Tarqeeq (Thinning Ra)"
    ],
    correctIndex: 0,
    ruleExplanation: "This is Qalqalah Kubra. Sakuun is temporary on stop, and Dal (د) is one of the echo letters ('Qutb Jad'). The pause makes the echo loud and clear."
  },
  {
    id: 4,
    verseSnippet: "فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ",
    surahRef: "Surah Al-Masad 111:5",
    highlightPart: "حَبْلٌ",
    questionText: "The letter Ba (ب) in the middle of 'حَبْلٌ' has a permanent Sukoon. Which level of Qalqalah applies here?",
    options: [
      "Qalqalah Kubra (Greatest)",
      "Qalqalah Wusta (Medium)",
      "Qalqalah Sughra (Smallest/Internal)",
      "No Qalqalah applies"
    ],
    correctIndex: 2,
    ruleExplanation: "It is Qalqalah Sughra (Smallest) because the Sākin letter is in the middle of a continuous word. It gets a brief internal bounce without pause."
  },
  {
    id: 5,
    verseSnippet: "جَاءَ نَصْرُ اللَّهِ",
    surahRef: "Surah An-Nasr 110:1",
    highlightPart: "جَاءَ",
    questionText: "In the word 'جَاءَ', we have an Alif Madd followed immediately by Hamzah in the SAME word. What class of projection is this?",
    options: [
      "Madd Tabee'ee (2 counts)",
      "Madd Wajib Muttasil (Connected, 4-5 counts)",
      "Madd Jaiz Munfasil (Disconnected, 4-5 counts)",
      "Madd Lāzim (6 counts)"
    ],
    correctIndex: 1,
    ruleExplanation: "It is Madd Wajib Muttasil (Obligatory Connected) because the Madd letter and Hamzah reside together inside one single Arabic word. It must be held for 4-5 counts."
  },
  {
    id: 6,
    verseSnippet: "تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ",
    surahRef: "Surah Al-Fil 105:4",
    highlightPart: "تَرْمِيهِم بِحِجَارَةٍ",
    questionText: "When Meem Sākinah (مْ) meets the letter Ba (ب) across the words 'تَرْمِيهِم بِحِجَارَةٍ', which rule requires nasalized hiding with light lip closure?",
    options: [
      "Izhār Shafawi (Oral clarity)",
      "Idghām Mithlayn (Oral merging)",
      "Ikhfā Shafawi (Oral hiding)",
      "Iqlāb (Conversion)"
    ],
    correctIndex: 2,
    ruleExplanation: "This is Ikhfā Shafawi. Meem Sākinah meets Ba, requiring a 2-beat nasal tone with light lip contact."
  }
];

export const TajweedRules: React.FC<TajweedRulesProps> = ({ theme }) => {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  const [activeCategory, setActiveCategory] = useState<string>('noon_sakinah');
  
  // Audio state simulation
  const [playingExampleIndex, setPlayingExampleIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioInterval, setAudioInterval] = useState<any>(null);
  const [wavePositions, setWavePositions] = useState<number[]>([10, 20, 15, 30, 25, 40, 10, 25]);

  // Quiz states
  const [quizScore, setQuizScore] = useState<number>(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [hasAnsweredQuiz, setHasAnsweredQuiz] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Stop simulated audio
  const stopAudioSim = () => {
    if (audioInterval) {
      clearInterval(audioInterval);
      setAudioInterval(null);
    }
    setIsPlaying(false);
    setPlayingExampleIndex(null);
  };

  // Play simulated audio (visual wave effects rendering classical beats description)
  const playExampleSim = (index: number) => {
    if (playingExampleIndex === index && isPlaying) {
      stopAudioSim();
      return;
    }

    stopAudioSim();
    setPlayingExampleIndex(index);
    setIsPlaying(true);

    const interval = setInterval(() => {
      setWavePositions(prev => prev.map(() => Math.floor(Math.random() * 35) + 10));
    }, 150);

    setAudioInterval(interval);

    // Stop after 4 seconds automatically
    setTimeout(() => {
      stopAudioSim();
    }, 4500);
  };

  // Quiz logic
  const handleQuizAnswer = (optionIdx: number) => {
    if (hasAnsweredQuiz) return;
    setSelectedQuizOption(optionIdx);
    setHasAnsweredQuiz(true);
    
    if (optionIdx === TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].correctIndex) {
      setQuizScore(score => score + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedQuizOption(null);
    setHasAnsweredQuiz(false);
    
    if (currentQuizIndex < TAJWEED_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex(idx => idx + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleResetQuiz = () => {
    setQuizScore(0);
    setCurrentQuizIndex(0);
    setSelectedQuizOption(null);
    setHasAnsweredQuiz(false);
    setQuizCompleted(false);
  };

  const activeCategoryData = TAJWEED_DATABASE.find(c => c.id === activeCategory) || TAJWEED_DATABASE[0];

  return (
    <div className={`rounded-3xl border p-4 md:p-8 shadow-sm transition-all ${
      isParchment 
        ? 'bg-[#faf6ed] border-[#ebdcc3] text-[#2c241e]' 
        : isCosmic 
          ? 'bg-slate-900/80 border-slate-800 text-slate-100 backdrop-blur-md' 
          : 'bg-white border-slate-200 text-slate-800'
    }`}>
      
      {/* Decorative Title Badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              isParchment 
                ? 'bg-[#8c6239]/10 text-[#8c6239]' 
                : isCosmic 
                  ? 'bg-indigo-600/20 text-indigo-400' 
                  : 'bg-emerald-600/10 text-emerald-600'
            }`}>
              Recitation Artistry (Tajweed)
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 animate-pulse">
              <Sparkles className="w-3 h-3" /> Enhanced
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-serif">
            Fundamental Recitation Rules <span className="opacity-60 text-lg md:text-xl font-normal block md:inline md:ml-2">أحكام التجويد - Tajweed Ahkām</span>
          </h1>
          <p className={`text-xs md:text-sm mt-1 max-w-2xl leading-relaxed ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
            Tajweed literally means "sweetening" or "beautification". It comprises rules to pronounce every single letter from its natural anatomical articulation point (Makhraj) with all its inherent attributes (Sifaat). Use this interactive manual to explore, listen, and practice proper cadence and rhythm.
          </p>
        </div>

        {/* Traditional ornament wrapper */}
        <div className={`p-4 rounded-2xl hidden lg:block border ${
          isParchment 
            ? 'bg-[#ebd8c3]/10 border-[#dfd2be]' 
            : 'bg-slate-800/40 border-slate-800'
        }`}>
          <div className="text-center font-serif">
            <span className="text-2xl block text-amber-500">۞</span>
            <span className="text-[10.5px] font-bold font-serif opacity-75">Tarteel Guidance</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Categories navigation */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-extrabold opacity-60 px-1 font-mono">
            🔀 Select Module Category
          </h2>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none snap-x w-full">
            {TAJWEED_DATABASE.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  stopAudioSim();
                }}
                className={`w-auto lg:w-full shrink-0 text-left px-4 py-3.5 rounded-2xl transition-all cursor-pointer snap-start border ${
                  activeCategory === category.id
                    ? isParchment
                      ? 'bg-[#8c6239] text-white border-[#8c6239] shadow-md'
                      : isCosmic
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/10'
                        : 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/10'
                    : isParchment
                      ? 'bg-[#f5eeda] hover:bg-[#ebd8c3]/50 border-[#ebdcc3]/70'
                      : 'bg-slate-800/30 border-slate-800/50 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className={`text-[10px] uppercase font-bold tracking-wider opacity-60 font-mono`}>
                      {category.id.replace('_', ' ')}
                    </p>
                    <p className="font-bold text-sm truncate">{category.title}</p>
                  </div>
                  <span className={`text-[13px] font-bold font-serif ${activeCategory === category.id ? 'text-amber-200' : 'text-amber-500'}`}>
                    {category.arabicTitle.split(' ').pop()}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Vocal Technique Tip Panel */}
          <div className={`p-4 rounded-2xl border ${
            isParchment 
              ? 'bg-[#ebd8c3]/20 border-[#dfd2be]/80 text-[#54463a]' 
              : 'bg-emerald-950/20 border-emerald-950/40 text-slate-300'
          }`}>
            <h3 className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
              <Info className="w-3.5 h-3.5 text-amber-500" /> Key Quranic Cadences (Recitation Pacings)
            </h3>
            <div className="mt-2 space-y-2 text-xs leading-relaxed">
              <p>
                <strong className={isParchment ? 'text-[#8c6239]' : 'text-emerald-400'}>1. At-Tahqeeq (التَّحْقِيق):</strong> Very slow, deliberate pace used for learning. Pronounces letters with absolute precision.
              </p>
              <p>
                <strong className={isParchment ? 'text-[#8c6239]' : 'text-emerald-400'}>2. At-Tarteel (التَّرْتِيل):</strong> Ideal, steady, moderate pacing. Combines proper rhythmic timing with emotional contemplation.
              </p>
              <p>
                <strong className={isParchment ? 'text-[#8c6239]' : 'text-emerald-400'}>3. Al-Hadr (الْحَدْر):</strong> Fast recitation pacing while strictly respecting all active Tajweed lengths and rules.
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right Content Area: Interactive Rules Display */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`p-5 md:p-6 rounded-3xl border ${
            isParchment 
              ? 'bg-amber-50/40 border-[#dfd2be]/70' 
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            
            {/* Category header inside dashboard */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-current/10 mb-5 gap-3">
              <div>
                <p className={`text-[10px] font-mono tracking-widest font-extrabold uppercase ${
                  isParchment ? 'text-[#8c6239]' : 'text-amber-500'
                }`}>
                  Selected Rule Set
                </p>
                <h2 className="text-xl font-extrabold font-serif">{activeCategoryData.title}</h2>
              </div>
              <div className="text-right">
                <span className="text-base font-bold font-serif opacity-90 block">
                  {activeCategoryData.arabicTitle}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
                  Target Letters: {activeCategoryData.letterSummary}
                </span>
              </div>
            </div>

            {/* General explanation text */}
            <p className="text-xs leading-relaxed opacity-90 mb-6">
              {activeCategoryData.summary}
            </p>

            {/* Sub-rules breakdown */}
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 opacity-80">
              <Layers className="w-3.5 h-3.5 text-amber-500" /> Complete Rule Manifest & Sub-Rules
            </h3>
            
            <div className="grid grid-cols-1 gap-2.5 mb-8">
              {activeCategoryData.details.map((detail, idx) => {
                const parts = detail.split(':');
                const ruleTitle = parts[0];
                const ruleDesc = parts[1] || '';

                return (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-transform hover:translate-x-0.5 ${
                      isParchment 
                        ? 'bg-[#faf6ed] hover:bg-[#faf6ed] border-[#ebdcc3]/70' 
                        : 'bg-slate-800/10 hover:bg-slate-800/20 border-slate-800/60'
                    }`}
                  >
                    <span className={`shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                      isParchment ? 'bg-[#8c6239]/15 text-[#8c6239]' : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="text-xs leading-relaxed">
                      <strong className={isParchment ? 'text-[#2c241e] font-serif font-extrabold' : 'text-slate-100 font-bold'}>
                        {ruleTitle}
                      </strong>
                      {ruleDesc}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Color-coded Word Segmenter / Examples */}
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 opacity-80">
              <Volume2 className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> Interactive Oral Examples (Listen & Deep Dive)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCategoryData.examples.map((example, idx) => {
                const isThisPlaying = playingExampleIndex === idx && isPlaying;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all hover:shadow-sm flex flex-col justify-between ${
                      isThisPlaying
                        ? isParchment
                          ? 'bg-[#ebd8c3]/40 border-[#8c6239]/60 ring-2 ring-[#8c6239]/20'
                          : 'bg-indigo-950/40 border-indigo-500/60 ring-2 ring-indigo-500/20'
                        : isParchment
                          ? 'bg-white border-[#ebdcc3]'
                          : 'bg-slate-900/60 border-slate-800/70'
                    }`}
                  >
                    <div>
                      {/* Top bar with tag */}
                      <div className="flex items-center justify-between gap-1.5 mb-2.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-black ${
                          example.ruleKey === 'izhar' ? 'bg-amber-500/10 text-amber-600' :
                          example.ruleKey === 'idgham' ? 'bg-slate-400/10 text-slate-400' :
                          example.ruleKey === 'iqlab' ? 'bg-indigo-500/10 text-indigo-400' :
                          example.ruleKey === 'ikhfa' ? 'bg-emerald-500/10 text-emerald-600' :
                          example.ruleKey === 'qalqalah' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-pink-500/10 text-pink-500'
                        }`}>
                          {example.ruleKey}
                        </span>
                        
                        {/* Audio simulate toggle button */}
                        <button
                          type="button"
                          onClick={() => playExampleSim(idx)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold cursor-pointer select-none transition-all ${
                            isThisPlaying
                              ? isParchment ? 'bg-red-600 text-white' : 'bg-rose-500 text-white'
                              : isParchment
                                ? 'bg-[#ebdff3]/10 border border-[#dfd2be] text-[#8c6239] hover:bg-[#8c6239] hover:text-white'
                                : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {isThisPlaying ? (
                            <>
                              <Pause className="w-3 h-3" /> Stop
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" /> Listen Beat
                            </>
                          )}
                        </button>
                      </div>

                      {/* Display Arabic Text Card inside */}
                      <div className="bg-black/5 dark:bg-white/5 rounded-xl p-3.5 text-center relative overflow-hidden mb-3">
                        <span className="text-[10px] font-mono absolute top-1 left-2 opacity-35 tracking-wider">AAYAT WORDING</span>
                        <p className="text-2xl font-extrabold tracking-wide font-serif py-1.5 leading-snug">
                          {/* We apply a color indicator specifically in the text */}
                          {example.phrase}
                        </p>
                        <p className="text-[11px] font-mono opacity-80 mt-1 italic tracking-tight">{example.transliteration}</p>
                      </div>

                      {/* Translation */}
                      <p className={`text-[11px] leading-relaxed italic ${isParchment ? 'text-slate-600' : 'text-slate-400'} mb-3`}>
                        &ldquo;{example.translation}&rdquo;
                      </p>

                      {/* Animated audio timeline simulation when active */}
                      {isThisPlaying && (
                        <div className="flex items-center gap-3 py-1.5 px-2 bg-current/5 border border-current/10 rounded-xl mb-3 animate-pulse">
                          {/* Simple bar graphs to represent the voice frequencies */}
                          <div className="flex items-center gap-[3px] h-6 shrink-0">
                            {wavePositions.map((h, i) => (
                              <div 
                                key={i} 
                                style={{ height: `${h}px` }} 
                                className={`w-[3px] rounded-full transition-all duration-150 ${
                                  isParchment ? 'bg-[#8c6239]' : 'bg-indigo-400'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">CADENCE TIMING (TARTEEL)</p>
                            <p className="text-[10px] font-bold truncate opacity-95">{example.audioSimulatedText}</p>
                          </div>
                        </div>
                      )}

                      {/* Conceptual Breakdown Overlay Text */}
                      <div className="text-[11px] leading-relaxed p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
                        <p className="opacity-90">{example.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Segment 2: Interactive Tajweed Practice Arena / Game */}
      <div className={`mt-10 p-6 md:p-8 rounded-3xl border ${
        isParchment 
          ? 'bg-gradient-to-br from-[#ebd8c3]/30 to-amber-50/20 border-[#dfd2be]' 
          : 'bg-gradient-to-br from-indigo-950/20 to-slate-900/30 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-current/10 pb-4 mb-6">
          <div className="flex items-start gap-3">
            <span className={`p-2.5 rounded-xl text-lg ${
              isParchment ? 'bg-[#8c6239]/10 text-[#8c6239]' : 'bg-indigo-600/20 text-indigo-400'
            }`}>
              ✍️
            </span>
            <div>
              <h2 className="text-xl font-bold font-serif">Tajweed Rules Practice Arena</h2>
              <p className={`text-xs ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
                Test your expertise with our authentic Quranic Tajweed quiz and learn to spot rules instantly of classic verses!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold opacity-75">Your Score:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-black ${
              isParchment ? 'bg-[#8c6239] text-white' : 'bg-indigo-600 text-white'
            }`}>
              {quizScore} / {TAJWEED_QUIZ_QUESTIONS.length}
            </span>
          </div>
        </div>

        {/* Quiz screen states */}
        {!quizCompleted ? (
          <div>
            {/* Main Question Card */}
            <div className={`p-5 rounded-2xl border mb-6 ${
              isParchment ? 'bg-white border-[#dfd2be]/80' : 'bg-slate-950/40 border-slate-800/80'
            }`}>
              
              {/* Question Reference Tag */}
              <div className="flex items-center justify-between gap-1.5 text-[10px] font-mono tracking-widest font-black opacity-60 mb-3 uppercase">
                <span>QUESTION {currentQuizIndex + 1} OF {TAJWEED_QUIZ_QUESTIONS.length}</span>
                <span className="text-amber-500">{TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].surahRef}</span>
              </div>

              {/* Big highlighted Arabic portion */}
              <div className="text-center py-6 mb-4 px-4 bg-current/5 border border-current/10 rounded-2xl relative overflow-hidden">
                <span className="absolute top-1 left-2 text-[9px] font-mono opacity-30 text-amber-500 uppercase tracking-widest font-bold">🎯 SPOT THE TAJWEED</span>
                <p className="text-3xl font-extrabold tracking-wide font-serif mb-2 text-amber-600 dark:text-amber-400">
                  {TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].highlightPart}
                </p>
                <p className="text-xs opacity-60 leading-relaxed font-serif">
                  From verse segment: &ldquo;{TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].verseSnippet}&rdquo;
                </p>
              </div>

              {/* Ask */}
              <p className="text-sm font-semibold mb-5 leading-normal">
                {TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].questionText}
              </p>

              {/* MCQ Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].options.map((option, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = idx === TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].correctIndex;
                  const showSuccessBorder = hasAnsweredQuiz && isCorrect;
                  const showDangerBorder = hasAnsweredQuiz && isSelected && !isCorrect;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={hasAnsweredQuiz}
                      onClick={() => handleQuizAnswer(idx)}
                      className={`px-4 py-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        hasAnsweredQuiz ? 'cursor-default' : 'cursor-pointer'
                      } ${
                        showSuccessBorder
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/20'
                          : showDangerBorder
                            ? 'bg-rose-500/10 border-rose-500 text-rose-500 dark:text-rose-400 ring-2 ring-rose-500/20'
                            : isSelected
                              ? 'border-indigo-500 bg-indigo-500/10'
                              : isParchment
                                ? 'bg-[#faf6ed] border-[#ebdcc3] hover:bg-[#ebdcc3]/30 text-slate-800'
                                : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-mono font-black shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : isParchment ? 'bg-[#8c6239]/10 text-[#8c6239]' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-tight">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer feedback panel */}
            {hasAnsweredQuiz && (
              <div className={`p-5 rounded-2xl border mb-6 animate-fadeIn ${
                selectedQuizOption === TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].correctIndex
                  ? 'bg-emerald-550/10 border-emerald-550/40'
                  : 'bg-rose-550/10 border-rose-550/40'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-full ${
                    selectedQuizOption === TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].correctIndex
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {selectedQuizOption === TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].correctIndex ? (
                      <Check className="w-5 h-5 font-black" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-1">
                      {selectedQuizOption === TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].correctIndex 
                        ? '✨ Stellar Spot! Correct Choice.' 
                        : '💡 Good Attempt! See rule below.'
                      }
                    </h3>
                    <p className="text-xs leading-relaxed opacity-95">
                      {TAJWEED_QUIZ_QUESTIONS[currentQuizIndex].ruleExplanation}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={handleNextQuiz}
                    className={`flex items-center gap-1 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border shadow-md ${
                      isParchment
                        ? 'bg-[#8c6239] text-[#faf6ed] border-[#8c6239] hover:bg-[#7a5431]'
                        : 'bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-500'
                    }`}
                  >
                    <span>{currentQuizIndex < TAJWEED_QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Complete Arena'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Quiz completion splash screen */
          <div className="text-center py-8 space-y-5 animate-pulse-once">
            <div className="flex justify-center">
              <div className={`p-4 rounded-full ${isParchment ? 'bg-[#8c6239]/10' : 'bg-indigo-600/20'}`}>
                <Award className={`w-12 h-12 ${isParchment ? 'text-[#8c6239]' : 'text-indigo-400'}`} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold font-serif">Aayat Tajweed Arena Complete!</h3>
              <p className={`text-xs mt-1 max-w-md mx-auto leading-relaxed ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
                You scored <strong className="text-indigo-500 dark:text-indigo-400 font-mono text-sm">{quizScore} out of {TAJWEED_QUIZ_QUESTIONS.length}</strong>! Continuous practice refined classical listening and safeguards proper recitation weights.
              </p>
            </div>

            {/* Performance status message */}
            <div className="inline-block px-4 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-xs font-bold max-w-sm">
              {quizScore === TAJWEED_QUIZ_QUESTIONS.length 
                ? "👑 Mastery Achieved! Beautiful spots of both Noon sacinah and prolongations."
                : quizScore >= 4 
                  ? "🌟 Excellent work! Most core attributes and vibrations are mastered."
                  : "📖 Re-read rule cards above and keep practicing with active verse examples."
              }
            </div>

            <div>
              <button
                type="button"
                onClick={handleResetQuiz}
                className={`flex items-center gap-1 px-5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer select-none mx-auto border transition-all ${
                  isParchment
                    ? 'border-[#dfd2be] text-[#8c6239] hover:bg-[#ebdcc3]/30'
                    : 'border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" /> <span>Retry Practice</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
