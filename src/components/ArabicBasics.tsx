import React, { useState } from 'react';
import { LayoutTheme } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Award, 
  Layers, 
  HelpCircle,
  Shuffle, 
  ArrowRight, 
  Info,
  BookMarked,
  Flame,
  Check,
  RotateCcw
} from 'lucide-react';

interface ArabicBasicsProps {
  theme: LayoutTheme;
}

interface GrammarConcept {
  arabic: string;
  english: string;
  definition: string;
  signs: string[];
  examples: Array<{ arabic: string; transliteration: string; english: string; context?: string }>;
}

export default function ArabicBasics({ theme }: ArabicBasicsProps) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // State for interactive sentence explorer
  const [activeSentenceId, setActiveSentenceId] = useState<number>(0);
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);

  // State for interactive mini-quiz
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  // Sub-navigation state
  const [activeSection, setActiveSection] = useState<string>(() => {
    try {
      return localStorage.getItem('quranic_arabic_basics_nav') || 'blocks';
    } catch {
      return 'blocks';
    }
  });

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    try {
      localStorage.setItem('quranic_arabic_basics_nav', sectionId);
    } catch (e) {
      // Ignore
    }
  };

  const navSections = [
    { id: 'blocks', label: 'Building Blocks', icon: Layers },
    { id: 'sentences', label: 'Sentence Lab', icon: Sparkles },
    { id: 'cases', label: 'Grammar Cases', icon: BookOpen },
    { id: 'awzan', label: 'Verb Forms', icon: Layers },
    { id: 'quiz', label: 'Quiz', icon: Award }
  ];

  // 1. Core Part of speech data (Ism, Fi'l, Harf)
  const codePartsOfSpeech: Record<string, GrammarConcept> = {
    ism: {
      arabic: "الاِسْم",
      english: "Al-Ism (Noun / Pronoun / Adjective / Adverb)",
      definition: "An Ism represents a person, place, thing, idea, characteristic, adjective, or time which is independent and not bound to any tense.",
      signs: [
        "Can accept 'Al-' (ال) prefix (e.g., Al-Kitab / الكتب).",
        "Accepts Tanween (ـٌ, ـٍ, ـً) at the end indicating indefiniteness.",
        "Can be preceded by a Harf Jarr (preposition), which drives it to Genitive state.",
        "Can have a feminine Ta Marbutah suffix (ة)."
      ],
      examples: [
        { arabic: "كِتَابٌ", transliteration: "Kitābun", english: "A Book", context: "Independent generic object" },
        { arabic: "ٱللَّه", transliteration: "Allāhu", english: "God / Allah", context: "Proper unique noun" },
        { arabic: "رَسُولٌ", transliteration: "Rasūlun", english: "A Messenger", context: "Common occupational noun" },
        { arabic: "عَلِيمٌ", transliteration: "‘Alīmun", english: "All-Knowing", context: "Adjective representing attribute" }
      ]
    },
    fil: {
      arabic: "الفِعْل",
      english: "Al-Fi'l (The Verb)",
      definition: "A Fi'l represents an action associated with one of three fundamental chronological tenses (Past, Present/Future, or Imperative). It cannot survive without an implicit helper subject (Fa'il).",
      signs: [
        "Past verbs are fixed (Mabni) often ending in Fathah (ـَ).",
        "Present verbs can start with the prefixes I-Y-T-A (أ، ت، ي، ن) as in 'Anaytu'.",
        "Can accept prefixed particles of future expectation: 'Sa-' (سَـ) or 'Sawfa' (سَوْفَ).",
        "Can be preceded by negative or conditional particles (e.g. Lam, Lan)."
      ],
      examples: [
        { arabic: "كَتَبَ", transliteration: "Kataba", english: "He wrote", context: "Past tense (Māḍī)" },
        { arabic: "يَقْرَأُ", transliteration: "Yaqra'u", english: "He reads / is reading", context: "Present/Future tense (Muḍāri‘)" },
        { arabic: "ٱعْبُدْ", transliteration: "I'bud", english: "Worship (you)!", context: "Imperative form (Amr)" },
        { arabic: "خَلَقَ", transliteration: "Khalaqa", english: "He created", context: "Past tense (Māḍī)" }
      ]
    },
    harf: {
      arabic: "الحَرْف",
      english: "Al-Harf (The Particle / Preposition / Conjunction)",
      definition: "A Harf is a word that does not have a complete independent meaning on its own until it attaches to an Ism or a Fi'l to construct a relative context.",
      signs: [
        "Cannot receive the signs of an Ism (no Tanween, no 'Al-').",
        "Cannot be conjugated into verbal past/present/future tenses.",
        "Remains invariant (fixed state / Mabni) with stable ending vowel sounds."
      ],
      examples: [
        { arabic: "فِي", transliteration: "Fī", english: "In / Inside", context: "Preposition of space/medium" },
        { arabic: "عَلَىٰ", transliteration: "‘Alā", english: "Upon / On top of", context: "Preposition of superiority/surface" },
        { arabic: "إِنَّ", transliteration: "Inna", english: "Indeed / Verily", context: "Accusative emphasis particle" },
        { arabic: "وَ", transliteration: "Wa", english: "And (Conjunction)", context: "Conjunction of accompaniment" }
      ]
    }
  };

  // 2. Sentences (Jumlah Ismiyyah & Jumlah Fi'liyyah)
  const interactiveSentences = [
    {
      type: "ismiyyah",
      typeArabic: "الجُمْلَةُ الاِسْمِيَّة",
      typeName: "Nominal Sentence",
      narrative: "An Ismiyyah sentence starts with an ISM (noun). It consists of two essential parts: Al-Mubtada' (The Subject / Starting point) and Al-Khabar (The Information / Predicate). Both natively default to the Nominative case (Raf' / ending in Dammah).",
      words: [
        { arabic: "ٱللَّهُ", analysis: "Mubtada' (The Subject - Nominative Raf' state)", english: "Allah" },
        { arabic: "غَفُورٌ", analysis: "Khabar (The Predicate / Information - Nominative Raf' state)", english: "is All-Forgiving" }
      ],
      transliteration: "Allāhu Ghafūrun",
      translation: "Allah is All-Forgiving.",
      quranContext: "Al-Baqarah 2:173 - Highlighting instant permanent states of existence"
    },
    {
      type: "filiyyah",
      typeArabic: "الجُمْلَةُ الفِعْلِيَّة",
      typeName: "Verbal Sentence",
      narrative: "A Fi'liyyah sentence is triggered by starting with a FI'L (verb). Its essential formula contains Al-Fi'l (Action), Al-Fā'il (The Subject / Agent who did it - always in Raf' state), and optional Al-Maf'ūl Bihi (The Object undergoing the action - in Nasb accusative state).",
      words: [
        { arabic: "خَلَقَ", analysis: "Fi'l Māḍī (Active Past Verb - Mabni on Fathah)", english: "He created" },
        { arabic: "ٱللَّهُ", analysis: "Fā'il (The Subject / Actor - Nominative Raf' with Dammah)", english: "Allah" },
        { arabic: "ٱلْإِنسَٰنَ", analysis: "Maf'ūl Bihi (The Direct Object - Accusative Nasb with Fathah)", english: "mankind" }
      ],
      transliteration: "Khalaqa Allāhu Al-Insāna",
      translation: "Allah created mankind.",
      quranContext: "Ar-Rahman 55:3 - Stating dynamic action, agency and divine focus"
    },
    {
      type: "ismiyyah",
      typeArabic: "الجُمْلَةُ الاِسْمِيَّة",
      typeName: "Nominal Sentence with Emphasis",
      narrative: "When emphasis particles like 'Inna' (Indeed) precede a Nominal sentence, they perform a grammatical operation: the Mubtada' is transformed from Raf' (nominative) into Nasb (accusative/fathah), while the Khabar remains in Raf' (dammah).",
      words: [
        { arabic: "إِنَّ", analysis: "Harf Tawkeed (Particle of absolute Emphasis / 'Verily')", english: "Indeed" },
        { arabic: "ٱللَّهَ", analysis: "Ism Inna (Subject now in Nasb / Accusative Fathah)", english: "Allah" },
        { arabic: "سَمِيعٌ", analysis: "Khabar Inna (Predicate remaining in Raf' / Dammah)", english: "is All-Hearing" }
      ],
      transliteration: "Inna Allāha Samī'un",
      translation: "Verily, Allah is All-Hearing.",
      quranContext: "Al-Baqarah 2:244 - Transitioning to emphasis state safely"
    }
  ];

  // 3. Mini Quiz Dataset
  const grammarQuiz = [
    {
      id: 1,
      question: "Which of the following is an absolute indicator sign of an 'Al-Ism' (Noun)?",
      options: [
        { id: "a", text: "Starting with 'Sa-' (سَ) or 'Sawfa' (سَوْفَ)" },
        { id: "b", text: "Ending with Tanween (ـٌ, ـٍ, ـً) or starting with 'Al-' (ال)" },
        { id: "c", text: "Being bound strictly by one of the three chronological tenses" },
        { id: "d", text: "Remaining invariant in active sentence contexts" }
      ],
      correct: "b",
      explanation: "Tanween and the definite article 'Al-' (ال) are exclusive signs of an Ism (noun) in classical Arabic grammar."
    },
    {
      id: 2,
      question: "In the sentence 'Khalaqa Allāhu Al-Insāna' (خَلَقَ ٱللَّهُ ٱلْإِنسَٰنَ), what is the grammatical role of 'Allāhu'?",
      options: [
        { id: "a", text: "The Fi'l (Action)" },
        { id: "b", text: "The Fā'il (Subject / Actor) - in Raf' (nominative) state" },
        { id: "c", text: "The Maf'ūl Bihi (Direct Object Undergoing Action)" },
        { id: "d", text: "The Hurūf preposition of placement" }
      ],
      correct: "b",
      explanation: "'Allāhu' ends with a Dammah (ـُ) indicating Raf' state, serving as the active actor (Fā'il) who performed the past tense creation verb 'Khalaqa'."
    },
    {
      id: 3,
      question: "What are the two essential elements required to form a Nominal Sentence (Jumlah Ismiyyah)?",
      options: [
        { id: "a", text: "Fi'l + Fā'il (Verb + Subject)" },
        { id: "b", text: "Fi'l + Maf'ūl Bihi (Verb + Object)" },
        { id: "c", text: "Mubtada' + Khabar (Subject + Predicate Info)" },
        { id: "d", text: "Ism + Harf Jarr (Noun + Connection)" }
      ],
      correct: "c",
      explanation: "A Jumlah Ismiyyah is initiated by a Subject (Mubtada') and completed by the information panel (Khabar)."
    }
  ];

  const handleSetAnswer = (quizId: number, optionId: string) => {
    setAnswers(prev => ({ ...prev, [quizId]: optionId }));
  };

  const getQuizScore = () => {
    let score = 0;
    grammarQuiz.forEach(q => {
      if (answers[q.id] === q.correct) score++;
    });
    return score;
  };

  // Theme Class derivations
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

  const fontColorThemeText = isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400';
  const badgeThemeBg = isParchment ? 'bg-[#dfd3c3]/40 border-[#a68c6d]/30 text-[#5c3d2e]' : isCosmic ? 'bg-indigo-950/40 border-indigo-900/30 text-indigo-300' : 'bg-emerald-950/30 border-emerald-900/40 text-emerald-300';
  const accentBorderTheme = isParchment ? 'border-[#8c6239]' : isCosmic ? 'border-indigo-500' : 'border-emerald-500';

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 ${cardBgClass} space-y-8 animate-fadeIn`}>
      
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <Compass className={`w-5 h-5 ${fontColorThemeText}`} />
            <h2 className="text-xl font-bold tracking-tight">Step 1: Classical Arabic Grammar Foundations</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build systematic mastery. Every classical Arabic sentence can be decoded by separating its structural parts of speech and case dynamics.
          </p>
        </div>
        
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono leading-none ${badgeThemeBg}`}>
          <BookMarked className="w-3.5 h-3.5" />
          <span>LEVEL: STARTER</span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-current/10 pb-4">
        {navSections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => handleSectionChange(sec.id)}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
              activeSection === sec.id
                ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                : 'bg-transparent border-current/10 hover:bg-current/5'
            }`}
          >
            <sec.icon className="w-3.5 h-3.5" />
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* 2. THREE WORD CLASSES INTRO */}
      {activeSection === 'blocks' && (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center gap-2">
          <Layers className={`w-4 h-4 ${fontColorThemeText}`} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Three Building Blocks (أقسام الكلمة)
          </h3>
        </div>
        <p className="text-xs opacity-90 leading-relaxed max-w-4xl">
          Unlike modern languages, classical Quranic Arabic classifies all human vocabulary into just <strong>three invariant categories</strong>. Once you classify an unknown word, you immediately narrowing down its semantic scope.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(codePartsOfSpeech).map(([key, part]) => (
            <div 
              key={key} 
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
                isParchment ? 'bg-[#faf6ed] hover:border-[#8c6239]/55' : 'bg-[#0a0d17]/40 hover:border-current/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-current/5 pb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Class Type</span>
                  <span className={`text-base font-serif font-black ${fontColorThemeText}`}>{part.arabic}</span>
                </div>
                
                <h4 className="font-bold text-sm mb-2">{part.english}</h4>
                <p className="text-[11.5px] opacity-85 leading-relaxed mb-4">{part.definition}</p>

                {/* Classical Recognition Markers */}
                <div className="space-y-1.5 mb-5">
                  <span className="text-[9px] font-mono font-bold uppercase opacity-60">Identification Markers:</span>
                  <ul className="text-[10.5px] space-y-1 pl-4 list-disc opacity-90">
                    {part.signs.map((sign, index) => (
                      <li key={index} className="leading-snug">{sign}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Word List Examples */}
              <div className="space-y-2 pt-3 border-t border-current/5 bg-black/5 p-2 rounded-lg">
                <span className="text-[9px] font-mono font-bold uppercase opacity-65 block">Lexicon Instances:</span>
                <div className="grid grid-cols-2 gap-2">
                  {part.examples.slice(0, 4).map((ex, idx) => (
                    <div key={idx} className="text-right p-1.5 rounded bg-black/10 border border-current/5">
                      <div className="text-sm font-serif font-black text-amber-500 overflow-hidden text-ellipsis whitespace-nowrap" dir="rtl">{ex.arabic}</div>
                      <div className="text-[9px] font-mono text-left block opacity-60">{ex.transliteration}</div>
                      <div className="text-[8.5px] text-left block font-sans font-medium opacity-80">{ex.english}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
      )}

      {/* 3. INTERACTIVE SENTENCE DECIPHER BUILDER */}
      {activeSection === 'sentences' && (
      <div className={`p-6 rounded-2xl border ${innerCardBgClass} space-y-5 animate-fadeIn`}>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Arabic Sentence Deciphering Lab</h3>
          </div>
          <p className="text-xs text-slate-400">
            Click on the tabs below to swap between sentence patterns. Hover over individual words to isolate their grammatical roles instantly!
          </p>
        </div>

        {/* Tab Buttons for Sentences */}
        <div className="flex flex-wrap gap-2 border-b border-current/10 pb-3">
          {interactiveSentences.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveSentenceId(idx);
                setHoveredWordIndex(null);
              }}
              className={`py-1.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                activeSentenceId === idx
                  ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                  : 'bg-transparent border-current/10 hover:bg-current/5'
              }`}
            >
              <span>{s.typeName} ({s.type === 'ismiyyah' ? 'Ismiyyah' : 'Fi\'liyyah'})</span>
            </button>
          ))}
        </div>

        {/* Exploding Sentence display and explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Visual Interactive Sentence Frame */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 flex items-center justify-between">
              <span>{interactiveSentences[activeSentenceId].typeArabic}</span>
              <span className={`px-2 py-0.5 rounded font-bold ${badgeThemeBg}`}>
                {interactiveSentenceIdStr(interactiveSentences[activeSentenceId].type)}
              </span>
            </div>

            {/* Big Arabic Words in Right to Left sequence */}
            <div 
              className={`p-6 rounded-2xl border flex flex-row-reverse justify-center items-center gap-6 md:gap-10 ${
                isParchment ? 'bg-white border-[#ebdcc3]' : 'bg-black/40 border-current/10'
              }`}
              style={{ direction: 'rtl' }}
            >
              {interactiveSentences[activeSentenceId].words.map((word, index) => {
                const isHovered = hoveredWordIndex === index;
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredWordIndex(index)}
                    onMouseLeave={() => setHoveredWordIndex(null)}
                    className={`relative p-3.5 rounded-xl border transition-all duration-300 cursor-help select-none ${
                      isHovered
                        ? 'bg-amber-500/10 border-amber-500 scale-105 shadow-md shadow-amber-500/15'
                        : 'border-transparent bg-transparent'
                    }`}
                  >
                    <div className="text-3xl md:text-5xl font-serif font-black text-center text-current antialiased tracking-wide">
                      {word.arabic}
                    </div>
                    <div className="text-center font-sans font-semibold text-xs text-amber-500 mt-2" style={{ direction: 'ltr' }}>
                      {word.english}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Translation and Pronunciation */}
            <div className="text-[11px] space-y-1 pl-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500">Transliteration:</span>
                <span className="font-mono font-bold text-yellow-500">{interactiveSentences[activeSentenceId].transliteration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500">English Translation:</span>
                <span className="font-sans font-semibold opacity-90">"{interactiveSentences[activeSentenceId].translation}"</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500 font-bold">Quranic Proof:</span>
                <span className="font-sans text-[10.5px] italic opacity-85 text-slate-400">{interactiveSentences[activeSentenceId].quranContext}</span>
              </div>
            </div>
          </div>

          {/* Word Role Metadata Box (Isolates hover action) */}
          <div className="lg:col-span-12 xl:col-span-5 h-full">
            <div className={`p-5 rounded-xl border h-full flex flex-col justify-between ${
              isParchment ? 'bg-[#f4efe1]/40 border-[#dfd2be]/80' : 'bg-black/20 border-current/5'
            }`}>
              <div className="space-y-4">
                <span className="text-[9.5px] font-mono font-bold uppercase text-amber-500 tracking-wider block">
                  Grammar Parsing Detail (إعراب):
                </span>

                {hoveredWordIndex !== null ? (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-current/10 pb-2">
                      <span className="text-xl font-serif font-black text-[#8c6239] dark:text-amber-500">
                        {interactiveSentences[activeSentenceId].words[hoveredWordIndex].arabic}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">Word #{hoveredWordIndex + 1}</span>
                    </div>
                    <p className="text-[11.5px] font-semibold leading-relaxed">
                      {interactiveSentences[activeSentenceId].words[hoveredWordIndex].analysis}
                    </p>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed">
                      This element's ending vocalization and linguistic prefix directly coordinate with preceding words to lock the sentence's absolute truth meaning.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-slate-400">
                    <p className="text-xs italic leading-relaxed">
                      💡 <strong>Hover over any Arabic word</strong> in the visual card to reveal its custom syntactic parsing summary (إعراب) and grammar details instantly!
                    </p>
                    <p className="text-[10px] leading-relaxed opacity-75">
                      Identifying whether a word acts as Mubtada', Khabar, or Fā'il allows you to know WHO is acting and WHAT statement is being established in the Quranic verse without guessing.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-current/5 text-[9.5px] italic text-slate-400">
                Pattern category rules: {interactiveSentences[activeSentenceId].narrative}
              </div>
            </div>
          </div>

        </div>
      </div>
      )}

      {/* 4. THE GRAMMATICAL CASE DECLENSIONS (Raf', Nasb, Jarr) */}
      {activeSection === 'cases' && (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center gap-2">
          <BookOpen className={`w-4 h-4 ${fontColorThemeText}`} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Linguistic Case States (الإعراب - Al-I‘rāb)
          </h3>
        </div>
        <p className="text-xs opacity-90 leading-relaxed max-w-4xl">
          In Arabic, nouns change their final vowel vowel sound to represent their grammatical role in a sentence. This is known as Al-I‘rāb. There are three primary states to track:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* RAF */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40 border-current/15'}`}>
            <div className="flex items-center justify-between mb-3 border-b border-current/5 pb-2">
              <span className="text-[9.5px] font-mono text-cyan-400">SUBJECTIVE</span>
              <span className="text-base font-serif font-black text-amber-500">الرَّفْع (Al-Raf‘)</span>
            </div>
            <h4 className="font-bold text-xs mb-1">Nominative Case</h4>
            <div className="text-[9px] font-mono text-slate-500 mb-2">Primary Indicator: Dammah (ـُ / ـٌ)</div>
            <p className="text-[11px] opacity-85 leading-relaxed">
              Assigned to the executor of an action (Fā'il) or the primary subjects in a nominal clause (Mubtada' and Khabar). Highlighting active presence.
            </p>
            <div className="mt-3 bg-black/5 p-2 rounded text-[10.5px]">
              <span className="font-bold">Example:</span> كِتَابُـ<strong className="text-amber-500 font-bold font-serif text-sm">هُ</strong> (KitābuHu - My/His book)
            </div>
          </div>

          {/* NASB */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40 border-current/15'}`}>
            <div className="flex items-center justify-between mb-3 border-b border-current/5 pb-2">
              <span className="text-[9.5px] font-mono text-emerald-400">OBJECTIVE</span>
              <span className="text-base font-serif font-black text-emerald-400">النَّصْب (Al-Naṣb)</span>
            </div>
            <h4 className="font-bold text-xs mb-1">Accusative Case</h4>
            <div className="text-[9px] font-mono text-slate-500 mb-2">Primary Indicator: Fathah (ـَ / ـً)</div>
            <p className="text-[11px] opacity-85 leading-relaxed">
              Assigned to the direct object (Maf'ūl) receiving the action, specification particles, or absolute modifiers. Describing how/on whom activity was forced.
            </p>
            <div className="mt-3 bg-black/5 p-2 rounded text-[10.5px]">
              <span className="font-bold">Example:</span> كِتَابَـ<strong className="text-[#10b981] font-bold font-serif text-sm">َ</strong> (Kitāba - ...Book)
            </div>
          </div>

          {/* JARR */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40 border-current/15'}`}>
            <div className="flex items-center justify-between mb-3 border-b border-current/5 pb-2">
              <span className="text-[9.5px] font-mono text-pink-400">PREPOSITIONAL</span>
              <span className="text-base font-serif font-black text-pink-400">الجَرّ (Al-Jarr)</span>
            </div>
            <h4 className="font-bold text-xs mb-1">Genitive Case</h4>
            <div className="text-[9px] font-mono text-slate-500 mb-2">Primary Indicator: Kasrah (ـِ / ـٍ)</div>
            <p className="text-[11px] opacity-85 leading-relaxed">
              Assigned to words that are preceded by prepositions (Harf Jarr) or act as the second possession coordinate in possessive phrasing (Idāfah).
            </p>
            <div className="mt-3 bg-black/5 p-2 rounded text-[10.5px]">
              <span className="font-bold">Example:</span> فِي كِتَابِـ<strong className="text-pink-500 font-bold font-serif text-sm">ـنِ</strong> (Fī Kitābin - In a book)
            </div>
          </div>
        </div>
      </div>
      )}

      {/* 5. ARABIC VERB FORMS (AWZAN) */}
      {activeSection === 'awzan' && (
      <div className="space-y-4 animate-fadeIn">
        <div className="flex items-center gap-2">
          <Layers className={`w-4 h-4 ${fontColorThemeText}`} />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Verb Forms (الأوزان - Al-Awzān)
          </h3>
        </div>
        <p className="text-xs opacity-90 leading-relaxed max-w-4xl">
          By adding specific letters to the 3-letter root, Arabic creates 10 derived verb forms (Roman numerals I to X). Each Form applies a consistent shift in meaning to the base root.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {/* Form I */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40'} border-current/10`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs uppercase text-slate-400">Form I - فَعَلَ</span>
              <span className={`text-[10px] font-mono font-bold ${fontColorThemeText}`}>Base Action</span>
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">The basic, native root action. Example: عَلِمَ (He knew).</p>
          </div>
          {/* Form II */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40'} border-current/10`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs uppercase text-slate-400">Form II - فَعَّلَ</span>
              <span className={`text-[10px] font-mono font-bold ${fontColorThemeText}`}>Intensify / Causative</span>
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">Emphasizes the action or makes someone do it. Example: عَلَّمَ (He taught / made known).</p>
          </div>
          {/* Form III */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40'} border-current/10`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs uppercase text-slate-400">Form III - فَاعَلَ</span>
              <span className={`text-[10px] font-mono font-bold ${fontColorThemeText}`}>Interactive</span>
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">Involves another person. Action applied to/with someone. Example: كَاتَبَ (He corresponded).</p>
          </div>
          {/* Form IV */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40'} border-current/10`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs uppercase text-slate-400">Form IV - أَفْعَلَ</span>
              <span className={`text-[10px] font-mono font-bold ${fontColorThemeText}`}>Causative (Transitive)</span>
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">Makes an intransitive verb transitive. Example: أَخْرَجَ (He expelled / brought out).</p>
          </div>
          {/* Form V */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40'} border-current/10`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs uppercase text-slate-400">Form V - تَفَعَّلَ</span>
              <span className={`text-[10px] font-mono font-bold ${fontColorThemeText}`}>Reflexive II (Gradual)</span>
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">Applying an action to oneself gradually. Reflexive of Form II. Example: تَعَلَّمَ (He learned).</p>
          </div>
          {/* Form VI */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40'} border-current/10`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs uppercase text-slate-400">Form VI - تَفَاعَلَ</span>
              <span className={`text-[10px] font-mono font-bold ${fontColorThemeText}`}>Mutual / Cooperative</span>
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">Mutual action between groups, or pretending. Example: تَسَاءَلَ (They asked each other).</p>
          </div>
          {/* Form VII */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40'} border-current/10`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs uppercase text-slate-400">Form VII - اِنْفَعَلَ</span>
              <span className={`text-[10px] font-mono font-bold ${fontColorThemeText}`}>Passive / Yielding</span>
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">Shows submitting to the action (never takes an object). Example: اِنْقَسَمَ (It got divided).</p>
          </div>
          {/* Form VIII */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40'} border-current/10`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs uppercase text-slate-400">Form VIII - اِفْتَعَلَ</span>
              <span className={`text-[10px] font-mono font-bold ${fontColorThemeText}`}>Reflexive Intentional</span>
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">Reflexive with effort or acting on behalf of oneself. Example: اِكْتَسَبَ (He earned for himself).</p>
          </div>
          {/* Form IX */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40'} border-current/10`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs uppercase text-slate-400">Form IX - اِفْعَلَّ</span>
              <span className={`text-[10px] font-mono font-bold ${fontColorThemeText}`}>Colors / Defects</span>
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">Exclusively used for physical traits, colors, or defects. Example: اِحْمَرَّ (He/it turned red).</p>
          </div>
          {/* Form X */}
          <div className={`p-4 rounded-xl border ${isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/40'} border-current/10`}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-xs uppercase text-slate-400">Form X - اِسْتَفْعَلَ</span>
              <span className={`text-[10px] font-mono font-bold ${fontColorThemeText}`}>Seeking / Deeming</span>
            </div>
            <p className="text-[11px] opacity-85 leading-relaxed">Seeking the action to be done, or considering something to be... Example: اِسْتَغْفَرَ (He sought forgiveness).</p>
          </div>
        </div>
      </div>
      )}

      {/* 6. INTERACTIVE MINI-QUIZ */}
      {activeSection === 'quiz' && (
      <div className={`p-6 rounded-2xl border ${isParchment ? 'bg-amber-100/30 border-amber-200/50' : 'bg-slate-950/40 border-current/15'} space-y-4 animate-fadeIn`}>
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-current/5 pb-2">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-yellow-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Arabic Basics Comprehension Check</h3>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#8c6239] dark:text-amber-500 font-bold">Self-Assessment</span>
        </div>

        <p className="text-xs opacity-90 leading-relaxed max-w-4xl">
          Test your memory on raw classic grammar properties! All verification occurs entirely in browser storage.
        </p>

        <div className="space-y-5 pt-2">
          {grammarQuiz.map((q) => (
            <div key={q.id} className="space-y-2.5">
              <div className="text-xs font-semibold flex items-start gap-2">
                <span className="font-mono bg-current/10 px-1.5 rounded py-0.5 mt-0.5">{q.id}</span>
                <span>{q.question}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.id;
                  const isCorrect = opt.id === q.correct;

                  let optionBtnClass = `p-2.5 rounded-xl border text-left text-xs transition-all pointer cursor-pointer flex items-center justify-between ${
                    isParchment ? 'bg-white hover:bg-[#ebdcc3]/20 border-current/10' : 'bg-black/20 hover:bg-white/5 border-current/10'
                  }`;

                  if (showResults) {
                    if (isCorrect) {
                      optionBtnClass = 'p-2.5 rounded-xl border text-left text-xs bg-emerald-500/20 border-emerald-500 text-emerald-300 font-medium cursor-default';
                    } else if (isSelected) {
                      optionBtnClass = 'p-2.5 rounded-xl border text-left text-xs bg-red-500/20 border-red-500 text-red-200 cursor-default';
                    } else {
                      optionBtnClass = 'p-2.5 rounded-xl border text-left text-xs opacity-40 cursor-default';
                    }
                  } else if (isSelected) {
                    optionBtnClass = isParchment
                      ? 'p-2.5 rounded-xl border text-left text-xs bg-[#8c6239] text-white border-[#8c6239] font-medium'
                      : isCosmic
                        ? 'p-2.5 rounded-xl border text-left text-xs bg-indigo-600 border-indigo-500 text-white font-medium'
                        : 'p-2.5 rounded-xl border text-left text-xs bg-emerald-600 border-emerald-500 text-white font-medium';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => !showResults && handleSetAnswer(q.id, opt.id)}
                      disabled={showResults}
                      type="button"
                      className={optionBtnClass}
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-[10px] select-none uppercase opacity-60">[{opt.id}]</span>
                        <span>{opt.text}</span>
                      </span>
                      {isSelected && !showResults && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div className="pl-6 pt-1 text-[11px] text-slate-400 flex items-start gap-1">
                  <Info className="w-3.5 h-3.5 text-current mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-[#8c6239] dark:text-amber-500">Grammar Rule:</strong> {q.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Panel for Quiz */}
        <div className="flex items-center gap-3 pt-4 border-t border-current/10">
          {!showResults ? (
            <button
              onClick={() => setShowResults(true)}
              className={`px-4 py-2 font-semibold text-xs rounded-xl cursor-pointer ${
                isParchment ? 'bg-[#8c6239] hover:bg-[#704d2b] text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              Verify Answers
            </button>
          ) : (
            <div className="flex items-center justify-between w-full flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Quiz Score: <strong className="text-amber-500 text-sm font-bold">{getQuizScore()}/{grammarQuiz.length}</strong> correct answers!</span>
              </div>
              <button
                onClick={() => {
                  setAnswers({});
                  setShowResults(false);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                  isParchment ? 'bg-[#ebd8c3]/40 border-[#dfd2be]' : 'bg-white/5 border-current/10 hover:bg-white/10'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          )}
        </div>
      </div>
      )}

    </div>
  );
}

// Simple layout identifier label generator
function interactiveSentenceIdStr(typ: string): string {
  if (typ === 'ismiyyah') {
    return "Mubtada' + Khabar Structure";
  }
  return "Fi'l + Fā'il + Maf'ūl Structure";
}