import React, { useState } from 'react';
import { LayoutTheme } from '../types';
import { BookOpen, Search, Info, HelpCircle, Link2, Sparkles, ChevronRight, Keyboard } from 'lucide-react';
import ArabicVirtualKeyboard from './ArabicVirtualKeyboard';

interface HarfItem {
  id: string;
  arabic: string; // The Arabic script representation (e.g., بِـ)
  transliteration: string; // (e.g., Bi-)
  englishMeaning: string; // (e.g., "In, with, by")
  attachmentType: 'prefixed' | 'suffixed' | 'standalone';
  category: 'preposition' | 'conjunction' | 'interrogative' | 'negation' | 'emphasis' | 'vocative' | 'conditional' | 'exception';
  grammaticalEffect: string; // e.g. "Causes the following Ism (noun) to go into the Genitive state (Majroor)."
  syntacticRule: string; // Tells the user where and how it binds (e.g., "Attached directly to the beginning of the noun word - no spaces.")
  quranicExampleArabic: string; // بِسْمِ اللَّهِ
  quranicExampleTranslation: string; // "In the Name of Allah"
  mnemonic?: string; // Memory aid or grouping rule
}

// Classical collection of highly famous Quranic Huruf (Particles) & particles
const CLASSICAL_HURUF: HarfItem[] = [
  // 1. Haroof al-Jarr (Prepositions of Genitive)
  {
    id: "bi",
    arabic: "بِـ",
    transliteration: "Bi-",
    englishMeaning: "In / By / With / At",
    attachmentType: "prefixed",
    category: "preposition",
    grammaticalEffect: "Forces noun into Genitive (Majrūr) case.",
    syntacticRule: "Fused immediately as a prefix.",
    quranicExampleArabic: "بِسْمِ اللَّهِ",
    quranicExampleTranslation: "In the name of Allah",
    mnemonic: "Bi connects with Kasrah"
  },
  {
    id: "ta",
    arabic: "تَـ",
    transliteration: "Ta-",
    englishMeaning: "By... (Oath to Allah)",
    attachmentType: "prefixed",
    category: "preposition",
    grammaticalEffect: "Forces the word 'Allah' into Genitive oath state (Majrūr).",
    syntacticRule: "Direct prefix, exclusively attached to string 'الله'.",
    quranicExampleArabic: "تَاللَّهِ لَقَدْ آثَرَكَ اللَّهُ",
    quranicExampleTranslation: "By Allah, indeed Allah has preferred you",
    mnemonic: "Only used with Allah for Oaths"
  },
  {
    id: "wa_oath",
    arabic: "وَ",
    transliteration: "Wa (Oath)",
    englishMeaning: "By... (Oath)",
    attachmentType: "prefixed",
    category: "preposition",
    grammaticalEffect: "Preposition for an oath causing Genitive (Majrūr).",
    syntacticRule: "Written adjacent to the subsequent word like a prefix.",
    quranicExampleArabic: "وَالْعَصْرِ",
    quranicExampleTranslation: "By the passage of time",
    mnemonic: "Cosmic Oaths (Sun, Moon, Time)"
  },
  {
    id: "ka",
    arabic: "كَـ",
    transliteration: "Ka-",
    englishMeaning: "Like / As (comparison)",
    attachmentType: "prefixed",
    category: "preposition",
    grammaticalEffect: "Forces noun into Genitive (Majrūr). Used for direct comparison.",
    syntacticRule: "Attached as a direct prefix.",
    quranicExampleArabic: "كَعَصْفٍ مَأْكُولٍ",
    quranicExampleTranslation: "Like chewed straw/husks",
    mnemonic: "'Ka' is for morphing/comparison"
  },
  {
    id: "li",
    arabic: "لِـ",
    transliteration: "Li-",
    englishMeaning: "For / To / Belonging to",
    attachmentType: "prefixed",
    category: "preposition",
    grammaticalEffect: "Forces noun into Genitive (Majrūr).",
    syntacticRule: "Prefixed directly to the noun.",
    quranicExampleArabic: "الْحَمْدُ لِلَّهِ",
    quranicExampleTranslation: "All praise belongs to Allah",
    mnemonic: "Li means 'Leans to'"
  },
  {
    id: "min",
    arabic: "مِنْ",
    transliteration: "Min",
    englishMeaning: "From / Out of / Among",
    attachmentType: "standalone",
    category: "preposition",
    grammaticalEffect: "Forces noun into Genitive case. Vowel changes to (مِنَ) if preceding sukun.",
    syntacticRule: "Stands alone.",
    quranicExampleArabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
    quranicExampleTranslation: "From among the Jinn and mankind",
    mnemonic: "Origin / Extraction"
  },
  {
    id: "fi",
    arabic: "فِي",
    transliteration: "Fī",
    englishMeaning: "In / Inside of",
    attachmentType: "standalone",
    category: "preposition",
    grammaticalEffect: "Forces noun into Genitive (Majrūr). Spatial particle.",
    syntacticRule: "Written standalone.",
    quranicExampleArabic: "فِي قُلُوبِهِمْ مَرَضٌ",
    quranicExampleTranslation: "In their hearts is a disease",
    mnemonic: "Fi fills the inside"
  },
  {
    id: "an",
    arabic: "عَنْ",
    transliteration: "'An",
    englishMeaning: "About / Away from",
    attachmentType: "standalone",
    category: "preposition",
    grammaticalEffect: "Governs noun into Genitive state.",
    syntacticRule: "Stands alone.",
    quranicExampleArabic: "رَضِيَ اللَّهُ عَنْهُمْ",
    quranicExampleTranslation: "Allah is pleased with them",
    mnemonic: "Distancing / 'away from'"
  },
  {
    id: "ala",
    arabic: "عَلَىٰ",
    transliteration: "'Alā",
    englishMeaning: "On / Upon",
    attachmentType: "standalone",
    category: "preposition",
    grammaticalEffect: "Causes Genitive casing. Indicates high authority.",
    syntacticRule: "Freestanding word. Modifies spelling to (عَلَيْـ) if suffix pronouns attached.",
    quranicExampleArabic: "عَلَى الْعَرْشِ اسْتَوَىٰ",
    quranicExampleTranslation: "Established Himself upon the Throne",
    mnemonic: "Elevated / On top of"
  },
  {
    id: "hatta",
    arabic: "حَتَّىٰ",
    transliteration: "Hattā",
    englishMeaning: "Until / Up to",
    attachmentType: "standalone",
    category: "preposition",
    grammaticalEffect: "Governs next noun into Genitive, or makes present verbs subjunctive.",
    syntacticRule: "Stands alone.",
    quranicExampleArabic: "حَتَّىٰ مَطْلَعِ الْفَجْرِ",
    quranicExampleTranslation: "Until the emergence of the dawn",
    mnemonic: "Halted at the limit (until)"
  },
  {
    id: "ila",
    arabic: "إِلَىٰ",
    transliteration: "Ilā",
    englishMeaning: "To / Towards",
    attachmentType: "standalone",
    category: "preposition",
    grammaticalEffect: "Causes Majrūr (Genitive) casing.",
    syntacticRule: "Changes to إِلَيْـ before suffix pronouns.",
    quranicExampleArabic: "إِلَى اللَّهِ الْمَصِيرُ",
    quranicExampleTranslation: "Towards Allah is the final return",
    mnemonic: "Directional target"
  },

  // 2. Conjunctions (Haroof al-Atf)
  {
    id: "wa_conj",
    arabic: "وَ",
    transliteration: "Wa",
    englishMeaning: "And",
    attachmentType: "prefixed",
    category: "conjunction",
    grammaticalEffect: "Coordinates grammar identically.",
    syntacticRule: "Always written adjacent to the subsequent word.",
    quranicExampleArabic: "الْإِنسِ وَالْجِنِّ",
    quranicExampleTranslation: "Mankind and Jinn",
    mnemonic: "Creates a linked pair"
  },
  {
    id: "fa",
    arabic: "فَـ",
    transliteration: "Fa-",
    englishMeaning: "So / Then",
    attachmentType: "prefixed",
    category: "conjunction",
    grammaticalEffect: "Connects two events sequentially",
    syntacticRule: "Fused immediately as a prefix.",
    quranicExampleArabic: "فَإِذَا جَاءَ وَعْدُ رَبِّي",
    quranicExampleTranslation: "So when the promise of my Lord comes...",
    mnemonic: "Fast / Immediate cause and effect"
  },
  {
    id: "thumma",
    arabic: "ثُمَّ",
    transliteration: "Thumma",
    englishMeaning: "Then / Afterward",
    attachmentType: "standalone",
    category: "conjunction",
    grammaticalEffect: "Coordinates two sentences or nouns.",
    syntacticRule: "Introduces chronologically delayed sequence.",
    quranicExampleArabic: "ثُمَّ خَلَقْنَا النُّطْفَةَ عَلَقَةً",
    quranicExampleTranslation: "Then We made the sperm-drop into a clinging clot",
    mnemonic: "Delayed transition"
  },
  {
    id: "aw",
    arabic: "أَوْ",
    transliteration: "Aw",
    englishMeaning: "Or / Either",
    attachmentType: "standalone",
    category: "conjunction",
    grammaticalEffect: "Offers alternative options.",
    syntacticRule: "Freestanding.",
    quranicExampleArabic: "أَوْ كَصَيِّبٍ مِّنَ السَّمَاءِ",
    quranicExampleTranslation: "Or like a rainstorm from the sky",
    mnemonic: "Another Way (Alternative)"
  },
  {
    id: "bal",
    arabic: "بَلْ",
    transliteration: "Bal",
    englishMeaning: "Rather / But",
    attachmentType: "standalone",
    category: "conjunction",
    grammaticalEffect: "Corrects/Cancels previous statement.",
    syntacticRule: "Freestanding.",
    quranicExampleArabic: "بَلْ هُمْ فِي شَكٍّ يَلْعَبُونَ",
    quranicExampleTranslation: "Rather, they are in doubt, amusing themselves",
    mnemonic: "Backtracks to state reality"
  },

  // 3. Haroof al-Nasb 'Inna and her sisters'
  {
    id: "inna",
    arabic: "إِنَّ",
    transliteration: "Inna",
    englishMeaning: "Indeed / Verily",
    attachmentType: "standalone",
    category: "emphasis",
    grammaticalEffect: "Makes the subject noun accusative (Mansūb).",
    syntacticRule: "Precedes a nominal sentence.",
    quranicExampleArabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    quranicExampleTranslation: "Indeed, Allah is with those who are patient.",
    mnemonic: "Maximum certainty at the start"
  },
  {
    id: "anna",
    arabic: "أَنَّ",
    transliteration: "Anna",
    englishMeaning: "That (Indeed)",
    attachmentType: "standalone",
    category: "emphasis",
    grammaticalEffect: "Makes subject noun accusative (Mansūb).",
    syntacticRule: "Occurs within a sentence to connect thoughts.",
    quranicExampleArabic: "وَاعْلَمُوا أَنَّ اللَّهَ سَمِيعٌ عَلِيمٌ",
    quranicExampleTranslation: "And know that Allah is Hearing and Knowing",
    mnemonic: "Connects clauses firmly"
  },
  {
    id: "ka_anna",
    arabic: "كَأَنَّ",
    transliteration: "Ka'anna",
    englishMeaning: "As if",
    attachmentType: "standalone",
    category: "emphasis",
    grammaticalEffect: "Makes subject noun accusative.",
    syntacticRule: "Freestanding comparison.",
    quranicExampleArabic: "كَأَنَّهُمْ خُشُبٌ مُّسَنَّدَةٌ",
    quranicExampleTranslation: "As if they were propped up timbers",
    mnemonic: "Ka (Like) + Anna (That) = As if"
  },
  {
    id: "lakinna",
    arabic: "لَٰكِنَّ",
    transliteration: "Lākinna",
    englishMeaning: "But / However",
    attachmentType: "standalone",
    category: "emphasis",
    grammaticalEffect: "Makes subject noun accusative.",
    syntacticRule: "Freestanding contrast.",
    quranicExampleArabic: "لَٰكِنَّ اللَّهَ ذُو فَضْلٍ",
    quranicExampleTranslation: "But Allah is the possessor of bounty",
    mnemonic: "Lacks/Looks for contrast"
  },
  {
    id: "la_alla",
    arabic: "لَعَلَّ",
    transliteration: "La'alla",
    englishMeaning: "Perhaps / So that",
    attachmentType: "standalone",
    category: "emphasis",
    grammaticalEffect: "Makes subject accusative.",
    syntacticRule: "Freestanding expression of hope.",
    quranicExampleArabic: "لَعَلَّكُمْ تَتَّقُونَ",
    quranicExampleTranslation: "So that you may become righteous",
    mnemonic: "Leaves hope/expectation"
  },
  {
    id: "layta",
    arabic: "لَيْتَ",
    transliteration: "Layta",
    englishMeaning: "If only / Would that",
    attachmentType: "standalone",
    category: "emphasis",
    grammaticalEffect: "Makes subject accusative.",
    syntacticRule: "Freestanding impossible desire.",
    quranicExampleArabic: "يَا لَيْتَنِي كُنتُ تُرَابًا",
    quranicExampleTranslation: "Oh, I wish I were dust",
    mnemonic: "Lamenting the impossible"
  },

  // 4. Negation & Interrogation
  {
    id: "la_nafy",
    arabic: "لَا",
    transliteration: "Lā",
    englishMeaning: "No / Not",
    attachmentType: "standalone",
    category: "negation",
    grammaticalEffect: "Negation makes nouns accusative. Prohibition makes verbs jussive.",
    syntacticRule: "Freestanding particle.",
    quranicExampleArabic: "لَا رَيْبَ فِيهِ",
    quranicExampleTranslation: "No doubt whatsoever inside it",
    mnemonic: "Absolute Void"
  },
  {
    id: "ma",
    arabic: "مَا",
    transliteration: "Mā",
    englishMeaning: "Not / What",
    attachmentType: "standalone",
    category: "negation",
    grammaticalEffect: "Negates past tense verbs or acts as relative pronoun.",
    syntacticRule: "Freestanding.",
    quranicExampleArabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
    quranicExampleTranslation: "Your Lord has not taken leave of you, nor has He detested",
    mnemonic: "Missing action in the past"
  },
  {
    id: "lam",
    arabic: "لَمْ",
    transliteration: "Lam",
    englishMeaning: "Did not",
    attachmentType: "standalone",
    category: "negation",
    grammaticalEffect: "Negates present tense action and flips to past, forcing Jussive (Majzūm).",
    syntacticRule: "Standalone before present verbs.",
    quranicExampleArabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    quranicExampleTranslation: "He neither begets nor is born",
    mnemonic: "Leaps back to the past"
  },
  {
    id: "lan",
    arabic: "لَنْ",
    transliteration: "Lan",
    englishMeaning: "Never",
    attachmentType: "standalone",
    category: "negation",
    grammaticalEffect: "Negates future absolutely. Next verb becomes Subjunctive (Mansūb).",
    syntacticRule: "Standalone before present verbs.",
    quranicExampleArabic: "لَن تَنَالُوا الْبِرَّ",
    quranicExampleTranslation: "Never will you attain righteousness",
    mnemonic: "Locks the future"
  },
  {
    id: "hal",
    arabic: "هَلْ",
    transliteration: "Hal",
    englishMeaning: "Is / Are / Do",
    attachmentType: "standalone",
    category: "interrogative",
    grammaticalEffect: "No direct case-ending effect.",
    syntacticRule: "Precedes sentence.",
    quranicExampleArabic: "هَلْ أَتَىٰ عَلَى الْإِنسَانِ حِينٌ مِّنَ الدَّهْرِ",
    quranicExampleTranslation: "Has there [not] come upon man a period of time...",
    mnemonic: "Harvests a Yes/No"
  },
  {
    id: "a",
    arabic: "أَ",
    transliteration: "A-",
    englishMeaning: "Is / Are / Do",
    attachmentType: "prefixed",
    category: "interrogative",
    grammaticalEffect: "No case effect.",
    syntacticRule: "Prefixed directly to ask yes/no.",
    quranicExampleArabic: "أَأَنتُمْ أَشَدُّ خَلْقًا أَمِ السَّمَاءُ",
    quranicExampleTranslation: "Are you a more difficult creation or is the heaven?",
    mnemonic: "A sharp, quick inquiry"
  },

  // 5. Exception, Vocative, and Conditionals
  {
    id: "illa",
    arabic: "إِلَّا",
    transliteration: "Illā",
    englishMeaning: "Except / But",
    attachmentType: "standalone",
    category: "exception",
    grammaticalEffect: "Can force noun to accusative.",
    syntacticRule: "Freestanding.",
    quranicExampleArabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    quranicExampleTranslation: "There is no deity except Allah",
    mnemonic: "Isolates the exception"
  },
  {
    id: "ya",
    arabic: "يَا",
    transliteration: "Yā",
    englishMeaning: "O...! (Vocative)",
    attachmentType: "standalone",
    category: "vocative",
    grammaticalEffect: "Forces addressed noun to nominative.",
    syntacticRule: "Standalone vocative.",
    quranicExampleArabic: "يَا أَيُّهَا النَّاسُ",
    quranicExampleTranslation: "O mankind...!",
    mnemonic: "Yells out to call someone"
  },
  {
    id: "in_cond",
    arabic: "إِنْ",
    transliteration: "In",
    englishMeaning: "If / Not",
    attachmentType: "standalone",
    category: "conditional",
    grammaticalEffect: "Causes conditional clauses to become jussive.",
    syntacticRule: "Precedes verbs.",
    quranicExampleArabic: "إِن يَنصُرْكُمُ اللَّهُ فَلَا غَالِبَ لَكُمْ",
    quranicExampleTranslation: "If Allah should aid you, no one can overcome you",
    mnemonic: "Initiates conditions"
  },

  // 6. Tense / Emphasis
  {
    id: "qad",
    arabic: "قَدْ",
    transliteration: "Qad",
    englishMeaning: "Already / Indeed",
    attachmentType: "standalone",
    category: "emphasis",
    grammaticalEffect: "Before past verbs: denotes certainty.",
    syntacticRule: "Freestanding before verbs.",
    quranicExampleArabic: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ",
    quranicExampleTranslation: "Certainly will the believers have succeeded",
    mnemonic: "Quantifies certainty"
  },
  {
    id: "sawfa",
    arabic: "سَوْفَ",
    transliteration: "Sawfa",
    englishMeaning: "Will / Soon (Far future)",
    attachmentType: "standalone",
    category: "emphasis",
    grammaticalEffect: "Forces present verb to future tense.",
    syntacticRule: "Standalone before present verbs.",
    quranicExampleArabic: "وَسَوْفَ تَعْلَمُونَ",
    quranicExampleTranslation: "And you will come to know",
    mnemonic: "Sweeps into the distant future"
  },
  {
    id: "sa",
    arabic: "سَـ",
    transliteration: "Sa-",
    englishMeaning: "Will / Very Soon",
    attachmentType: "prefixed",
    category: "emphasis",
    grammaticalEffect: "Changes to immediate future.",
    syntacticRule: "Prefixed to present tense verbs.",
    quranicExampleArabic: "سَيَقُولُ السُّفَهَاءُ",
    quranicExampleTranslation: "The foolish among the people will say",
    mnemonic: "Soon..."
  }
];

interface HurufLibraryProps {
  theme: LayoutTheme;
}

export default function HurufLibrary({ theme }: HurufLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showArabicKeyboard, setShowArabicKeyboard] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'preposition' | 'conjunction' | 'interrogative' | 'negation' | 'emphasis' | 'vocative' | 'conditional' | 'exception'>('all');
  const [selectedAttachmentFilter, setSelectedAttachmentFilter] = useState<'all' | 'prefixed' | 'suffixed' | 'standalone'>('all');
  const [activeHarfId, setActiveHarfId] = useState<string>("bi");

  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Base list styles
  const cardBgClass = isParchment
    ? 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e]'
    : isCosmic
      ? 'bg-[#05060f] border-indigo-950/80 text-indigo-50'
      : 'bg-slate-900 border-slate-800 text-slate-100';

  const innerCardBgClass = isParchment
    ? 'bg-[#ebd8c3]/25 border-[#dfd2be]'
    : isCosmic
      ? 'bg-indigo-950/30 border-indigo-900/40'
      : 'bg-slate-950/50 border-slate-800/60';

  const selectedRingClass = isParchment
    ? 'border-[#8c6239] bg-[#f4ebe1]/60'
    : isCosmic
      ? 'border-pink-500 bg-pink-950/15 shadow-pink-500/5'
      : 'border-emerald-500 bg-emerald-950/25 shadow-emerald-500/5';

  const textMutedClass = isParchment ? 'text-[#705e52]' : 'text-slate-400';
  const textActionClass = isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-pink-400' : 'text-emerald-400';

  // Filter classical particles
  const filteredHuruf = CLASSICAL_HURUF.filter(h => {
    const matchesCategory = selectedCategory === 'all' || h.category === selectedCategory;
    const matchesAttachment = selectedAttachmentFilter === 'all' || h.attachmentType === selectedAttachmentFilter;
    const matchesSearch = 
      h.arabic.includes(searchQuery) ||
      h.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.grammaticalEffect.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesAttachment && matchesSearch;
  });

  const activeHarf = CLASSICAL_HURUF.find(h => h.id === activeHarfId) || CLASSICAL_HURUF[0];

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 ${cardBgClass}`}>
      
      {/* Header Info Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-current/10 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className={`w-5 h-5 ${textActionClass}`} />
            <h2 className="text-lg font-bold tracking-tight">
              Al-Hurūf al-Mu'rabah <span className="font-sans font-normal text-xs">(Classical Particles Index)</span>
            </h2>
          </div>
          <p className={`text-xs mt-0.5 ${textMutedClass}`}>
            Identify, classify, and apply Arabic particles (Conjunctions, sworn oaths, prepositions) with accurate structural rules.
          </p>
        </div>

        {/* Counter of active index */}
        <div className={`px-3 py-1 text-xs font-semibold rounded-xl border ${
          isParchment ? 'bg-[#ebdcd3]/40 border-[#dfd2be]' : 'bg-current/5 border-current/15'
        }`}>
          Total Tracked Particles: <strong className={textActionClass}>{CLASSICAL_HURUF.length}</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Filters & Scrolling Harf List directory */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="space-y-2">
            {/* 1. Searching filter */}
            <div className="relative">
              <Search className={`absolute left-3 top-2.5 h-3.5 w-3.5 ${isParchment ? 'text-[#8c6239]/80' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search particles (e.g. بِـ, min, to)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full font-medium rounded-xl py-1.5 pl-8 pr-8 text-xs focus:outline-none transition-all border ${
                  isParchment
                    ? 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e] focus:border-[#8c6239]'
                    : isCosmic
                      ? 'bg-black border-indigo-950 text-indigo-100 placeholder-indigo-300/40 focus:border-indigo-500'
                      : 'bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-emerald-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowArabicKeyboard(!showArabicKeyboard)}
                className={`absolute right-2 top-2 p-0.5 rounded transition-all duration-200 cursor-pointer ${
                  showArabicKeyboard
                    ? (isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-pink-400' : 'text-emerald-400')
                    : (isParchment ? 'text-[#a68c6d]' : 'text-slate-400 hover:text-slate-200')
                }`}
                title="Arabic Keyboard Toggle"
              >
                <Keyboard className="w-3.5 h-3.5" />
              </button>
            </div>

            {showArabicKeyboard && (
              <div className="p-3 border rounded-xl border-current/10 w-full flex justify-center animate-fadeIn">
                <ArabicVirtualKeyboard
                  onKeyPress={(char) => setSearchQuery(prev => prev + char)}
                  onClear={() => setSearchQuery('')}
                  onBackspace={() => setSearchQuery(prev => prev.slice(0, -1))}
                  onClose={() => setShowArabicKeyboard(false)}
                  theme={theme}
                />
              </div>
            )}

            {/* 2. Attachment position filter */}
            <div className="flex flex-wrap gap-1">
              <span className={`text-[9px] font-bold block w-full uppercase mb-0.5 opacity-65 ${textMutedClass}`}>
                Sentence Attachment Position:
              </span>
              <button
                type="button"
                onClick={() => setSelectedAttachmentFilter('all')}
                className={`px-2 py-0.5 rounded text-[9.5px] font-semibold border cursor-pointer transition-all ${
                  selectedAttachmentFilter === 'all'
                    ? (isParchment ? 'bg-[#8c6239] text-[#faf6ed] border-[#8c6239]' : isCosmic ? 'bg-pink-600 text-white border-pink-700' : 'bg-emerald-600 text-white border-emerald-700')
                    : 'border-current/10 hover:bg-current/5'
                }`}
              >
                All States
              </button>
              <button
                type="button"
                onClick={() => setSelectedAttachmentFilter('prefixed')}
                className={`px-2 py-0.5 rounded text-[9.5px] font-semibold border cursor-pointer transition-all ${
                  selectedAttachmentFilter === 'prefixed'
                    ? (isParchment ? 'bg-[#8c6239] text-[#faf6ed] border-[#8c6239]' : isCosmic ? 'bg-pink-600 text-white border-pink-700' : 'bg-emerald-600 text-white border-emerald-700')
                    : 'border-current/10 hover:bg-current/5'
                }`}
              >
                Prefixed (بِـ, لِـ)
              </button>
              <button
                type="button"
                onClick={() => setSelectedAttachmentFilter('standalone')}
                className={`px-2 py-0.5 rounded text-[9.5px] font-semibold border cursor-pointer transition-all ${
                  selectedAttachmentFilter === 'standalone'
                    ? (isParchment ? 'bg-[#8c6239] text-[#faf6ed] border-[#8c6239]' : isCosmic ? 'bg-pink-600 text-white border-pink-700' : 'bg-emerald-600 text-white border-emerald-700')
                    : 'border-current/10 hover:bg-current/5'
                }`}
              >
                Standalone (مِنْ, فِي)
              </button>
              <button
                type="button"
                onClick={() => setSelectedAttachmentFilter('suffixed')}
                className={`px-2 py-0.5 rounded text-[9.5px] font-semibold border cursor-pointer transition-all ${
                  selectedAttachmentFilter === 'suffixed'
                    ? (isParchment ? 'bg-[#8c6239] text-[#faf6ed] border-[#8c6239]' : isCosmic ? 'bg-pink-600 text-white border-pink-700' : 'bg-emerald-600 text-white border-emerald-700')
                    : 'border-current/10 hover:bg-current/5'
                }`}
              >
                Suffixes (ـكُمْ)
              </button>
            </div>

            {/* 3. Category filters */}
            <div className="flex flex-wrap gap-1 pt-1">
              <span className={`text-[9px] font-bold block w-full uppercase mb-0.5 opacity-65 ${textMutedClass}`}>
                Grammatical Type:
              </span>
              {(['all', 'preposition', 'conjunction', 'interrogative', 'negation', 'vocative', 'emphasis', 'conditional', 'exception'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border cursor-pointer uppercase transition-all ${
                    selectedCategory === cat
                      ? (isParchment ? 'bg-[#8c6239] hover:bg-[#a67c52] border-[#8c6239] text-white' : isCosmic ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-teal-600 text-white border-teal-700')
                      : 'border-current/10 hover:bg-current/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible scrolled list */}
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
            {filteredHuruf.length === 0 ? (
              <div className="text-center py-8 text-xs opacity-55 font-sans">
                No matching Particles found in Codex filters.
              </div>
            ) : (
              filteredHuruf.map(h => {
                const isActive = h.id === activeHarfId;

                return (
                  <button
                    key={h.id}
                    onClick={() => setActiveHarfId(h.id)}
                    type="button"
                    className={`w-full text-right p-2 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                      isActive ? selectedRingClass : 'bg-transparent border-current/5 hover:bg-current/5'
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-xs font-bold font-sans flex items-center gap-1.5">
                        <span className="text-sm font-bold">{h.transliteration}</span>
                        <span className={`text-[8px] font-mono uppercase px-1 py-0.2 rounded border ${
                          h.attachmentType === 'prefixed'
                            ? 'bg-amber-400/15 border-amber-400/20 text-amber-500'
                            : h.attachmentType === 'suffixed'
                              ? 'bg-blue-400/15 border-blue-400/20 text-blue-500'
                              : 'bg-emerald-400/15 border-emerald-400/20 text-emerald-500'
                        }`}>
                          {h.attachmentType}
                        </span>
                      </div>
                      <div className={`text-[10px] truncate max-w-[170px] ${textMutedClass}`}>
                        {h.englishMeaning}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold font-serif px-1 block leading-none">
                        {h.arabic}
                      </span>
                      <span className="text-[8px] opacity-50 block font-mono mt-0.5">
                        {h.category}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Detailed Harf linguistic rules & workspace */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className={`p-5 rounded-2xl border flex-1 space-y-4 ${innerCardBgClass} animate-fadeIn`}>
            
            {/* Header layout */}
            <div className="flex items-center justify-between border-b pb-3 border-current/10">
              <div>
                <span className={`text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded uppercase ${
                  activeHarf.attachmentType === 'prefixed'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}>
                  Structural Rule: {activeHarf.attachmentType.toUpperCase()}
                </span>
                <h3 className="text-sm font-bold mt-1.5 leading-none">
                  {activeHarf.transliteration} (Arabic Particle Details)
                </h3>
              </div>

              <div className="text-right">
                <span className="text-3xl font-bold font-serif text-amber-500 dark:text-amber-400 block tracking-normal">
                  {activeHarf.arabic}
                </span>
                <span className={`text-[10px] font-mono ${textMutedClass}`}>
                  Syntax form
                </span>
              </div>
            </div>

            {/* Core attachment rules */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs leading-relaxed">
                <div className="p-3 bg-neutral-950/20 rounded-xl border border-current/5 space-y-1">
                  <span className={`text-[10px] font-mono uppercase block ${textMutedClass}`}>
                    English Equivalent:
                  </span>
                  <span className="font-bold block text-sm">
                    {activeHarf.englishMeaning}
                  </span>
                </div>
                <div className="p-3 bg-neutral-950/20 rounded-xl border border-current/5 space-y-1">
                  <span className={`text-[10px] font-mono uppercase block ${textMutedClass}`}>
                    Grammar Category:
                  </span>
                  <span className="font-bold uppercase block text-sm">
                    {activeHarf.category}
                  </span>
                </div>
              </div>

              {/* Syntactic attachment guide */}
              <div className="space-y-1 p-3.5 bg-black/10 rounded-xl border border-current/5">
                <h4 className="text-[10.5px] font-bold uppercase tracking-wide text-amber-400 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" /> Sentence Integration Guide (Binding)
                </h4>
                <p className="text-xs font-semibold leading-relaxed">
                  {activeHarf.syntacticRule}
                </p>
              </div>

              {/* Grammatical influence casing details */}
              <div className="space-y-1.5">
                <h4 className={`text-[10px] font-bold uppercase tracking-wider ${textMutedClass}`}>
                  Linguistic Case Governess (I'rab effect):
                </h4>
                <p className="text-xs leading-relaxed">
                  {activeHarf.grammaticalEffect}
                </p>
              </div>

              {/* Mnemonic / Memorization Tip */}
              {activeHarf.mnemonic && (
                <div className="space-y-1 p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/20">
                  <h4 className="text-[10.5px] font-bold uppercase tracking-wide text-amber-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Memorization Tip (Mnemonic)
                  </h4>
                  <p className="text-xs font-semibold leading-relaxed text-amber-600 dark:text-amber-400">
                    {activeHarf.mnemonic}
                  </p>
                </div>
              )}

              {/* Sample illustrative Quranic coordinate verse usage */}
              <div className={`p-4 rounded-xl border ${
                isParchment ? 'bg-[#fdfbf7] border-[#ebdcc3]' : 'bg-black/35 border-current/10'
              } space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] uppercase tracking-wider font-semibold ${textMutedClass}`}>
                    Sample Elegant Quranic Usage:
                  </span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/10`}>
                    Harf Applied
                  </span>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <p className={`text-base font-bold font-serif text-right pr-2 leading-loose ${isParchment ? 'text-[#8c6239]' : 'text-slate-100'}`} dir="rtl">
                      {activeHarf.quranicExampleArabic}
                    </p>
                    <p className={`text-[11px] leading-snug mt-1 italic ${textMutedClass}`}>
                      &ldquo;{activeHarf.quranicExampleTranslation}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Instructional info tip */}
              <div className="pt-1.5 text-[10px] flex items-center space-x-1.5 space-x-reverse opacity-70">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  In classical Sarf & Nahw linguistic rules, Particles (Huruf) are absolute immutable entities (Mabni) whose spelling forms never conjugate directly.
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
