import React, { useState } from 'react';
import { LayoutTheme } from '../types';
import { BookOpen, Search, Info, HelpCircle, Link2, Sparkles, ChevronRight } from 'lucide-react';

interface HarfItem {
  id: string;
  arabic: string; // The Arabic script representation (e.g., بِـ)
  transliteration: string; // (e.g., Bi-)
  englishMeaning: string; // (e.g., "In, with, by")
  attachmentType: 'prefixed' | 'suffixed' | 'standalone';
  category: 'preposition' | 'conjunction' | 'interrogative' | 'negation' | 'emphasis' | 'vocative';
  grammaticalEffect: string; // e.g. "Causes the following Ism (noun) to go into the Genitive state (Majroor)."
  syntacticRule: string; // Tells the user where and how it binds (e.g., "Attached directly to the beginning of the noun word - no spaces.")
  quranicExampleArabic: string; // بِسْمِ اللَّهِ
  quranicExampleTranslation: string; // "In the Name of Allah"
}

// Classical collection of highly famous Quranic Huruf (Particles) & particles
const CLASSICAL_HURUF: HarfItem[] = [
  // 1. Prefixed Prepositions
  {
    id: "bi",
    arabic: "بِـ",
    transliteration: "Bi-",
    englishMeaning: "In / By / With / At",
    attachmentType: "prefixed",
    category: "preposition",
    grammaticalEffect: "Forces the following noun into the Genitive (Majrūr) case, ending in a Kasrah.",
    syntacticRule: "Fused immediately as a prefix to the start of the following Ism (Noun). No spaces are allowed.",
    quranicExampleArabic: "بِسْمِ اللَّهِ",
    quranicExampleTranslation: "In the name of Allah"
  },
  {
    id: "li",
    arabic: "لِـ",
    transliteration: "Li-",
    englishMeaning: "For / To / Belonging to",
    attachmentType: "prefixed",
    category: "preposition",
    grammaticalEffect: "Forces the noun into Genitive (Majrūr). If attached to 'Al-' (definite article), the Alif drop-merges into 'Lil-'.",
    syntacticRule: "Prefixed directly to the noun. Fuses with the following word.",
    quranicExampleArabic: "الْحَمْدُ لِلَّهِ",
    quranicExampleTranslation: "All praise belongs to Allah (belonging to)"
  },
  {
    id: "ka",
    arabic: "كَـ",
    transliteration: "Ka-",
    englishMeaning: "Like / As (comparison)",
    attachmentType: "prefixed",
    category: "preposition",
    grammaticalEffect: "Forces the noun into Genitive (Majrūr). Used for direct morphological comparisons.",
    syntacticRule: "Attached as a direct prefix on nouns. Cannot be used with freestanding particles.",
    quranicExampleArabic: "كَعَصْفٍ مَأْكُولٍ",
    quranicExampleTranslation: "Like chewed straw/husks"
  },
  {
    id: "ta",
    arabic: "تَـ",
    transliteration: "Ta-",
    englishMeaning: "By... (Solely for swearing oaths to Allah)",
    attachmentType: "prefixed",
    category: "emphasis",
    grammaticalEffect: "Forces the word 'Allah' (and only Allah) into Genitive oath state (Majrūr suffix).",
    syntacticRule: "Direct prefix. Exclusively attached to string 'الله' to execute an oath designation.",
    quranicExampleArabic: "تَاللَّهِ لَقَدْ آثَرَكَ اللَّهُ",
    quranicExampleTranslation: "By Allah, indeed Allah has preferred you"
  },
  {
    id: "wa_conjunction",
    arabic: "وَ",
    transliteration: "Wa",
    englishMeaning: "And (Conjunction) / Or 'By...' (Oath particle)",
    attachmentType: "prefixed",
    category: "conjunction",
    grammaticalEffect: "As conjunction: does not affect noun cases directly. As Oath: acts as a preposition causing Genitive casing.",
    syntacticRule: "Always written adjacent to the subsequent word. Looks like a prefix but is grammatically independent.",
    quranicExampleArabic: "وَالْعَصْرِ",
    quranicExampleTranslation: "By the passage of time (Oath usage)"
  },
  {
    id: "fa",
    arabic: "فَـ",
    transliteration: "Fa-",
    englishMeaning: "So / Then / And thus",
    attachmentType: "prefixed",
    category: "conjunction",
    grammaticalEffect: "Connects two events, phrases, or verbs sequentially. Does not alter grammatical cases.",
    syntacticRule: "Fused immediately as a prefix to the next word (whether verb, noun, or particle) to express quick sequence.",
    quranicExampleArabic: "فَإِذَا جَاءَ وَعْدُ رَبِّي",
    quranicExampleTranslation: "So when the promise of my Lord comes..."
  },

  // 2. Standalone particles (Prepositions, Negations, Vocative)
  {
    id: "min",
    arabic: "مِنْ",
    transliteration: "Min",
    englishMeaning: "From / Out of / Among",
    attachmentType: "standalone",
    category: "preposition",
    grammaticalEffect: "Forces the following noun into Genitive case. Vowel changes to (مِنَ) if preceding a word with sukun/definitive 'Al'.",
    syntacticRule: "Stands alone as a separate word preceding the governed noun. Not attached directly.",
    quranicExampleArabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
    quranicExampleTranslation: "From among the Jinn and mankind"
  },
  {
    id: "ila",
    arabic: "إِلَىٰ",
    transliteration: "Ilā",
    englishMeaning: "To / Towards / Onto",
    attachmentType: "standalone",
    category: "preposition",
    grammaticalEffect: "Classical preposition causing Majrūr (Genitive) casing on the nominal word that follows it.",
    syntacticRule: "Voted as a standalone particle. Changes final Alif Maqsurah to standard Ya 'ay' when pronouns are attached.",
    quranicExampleArabic: "إِلَى اللَّهِ الْمَصِيرُ",
    quranicExampleTranslation: "Towards Allah is the final return"
  },
  {
    id: "ila_pronoun",
    arabic: "إِلَيْـ",
    transliteration: "Ilay-",
    englishMeaning: "To / Towards (With Attached Pronoun)",
    attachmentType: "prefixed",
    category: "preposition",
    grammaticalEffect: "Preposition variant. Pronoun attaches directly as a suffix (e.g. إِلَيْهِ - to Him).",
    syntacticRule: "Grammar modifies the spelling of إِلَىٰ to إِلَيْـ before attaching a suffix pronoun.",
    quranicExampleArabic: "إِلَيْهِ يَرْجِعُ الْأَمْرُ",
    quranicExampleTranslation: "Unto Him all affairs are returned"
  },
  {
    id: "ala",
    arabic: "عَلَىٰ",
    transliteration: "'Alā",
    englishMeaning: "On / Upon / Over / Against",
    attachmentType: "standalone",
    category: "preposition",
    grammaticalEffect: "Directly causes Genitive casing. Indicates high authority, base ground, or responsibility.",
    syntacticRule: "Freestanding word. Modifies spelling to (عَلَيْـ) if suffix pronouns are attached.",
    quranicExampleArabic: "عَلَى الْعَرْشِ اسْتَوَىٰ",
    quranicExampleTranslation: "Established Himself upon the divine Throne"
  },
  {
    id: "fi",
    arabic: "فِي",
    transliteration: "Fī",
    englishMeaning: "In / Inside of / Regarding",
    attachmentType: "standalone",
    category: "preposition",
    grammaticalEffect: "Forces the next noun into Genitive (Majrūr). Frequently used spatial particle.",
    syntacticRule: "Written as a standalone word. Can have attached suffix pronouns connected directly to it.",
    quranicExampleArabic: "فِي قُلُوبِهِمْ مَرَضٌ",
    quranicExampleTranslation: "In their hearts is a disease"
  },
  {
    id: "hatta",
    arabic: "حَتَّىٰ",
    transliteration: "Hattā",
    englishMeaning: "Until / Up to / Even",
    attachmentType: "standalone",
    category: "preposition",
    grammaticalEffect: "Governs the next noun into Genitive state, or makes present verbs subjunctive (with concealed an).",
    syntacticRule: "Stands alone. Placed before nouns or action verbs.",
    quranicExampleArabic: "حَتَّىٰ مَطْلَعِ الْفَجْرِ",
    quranicExampleTranslation: "Until the emergence of the dawn"
  },
  {
    id: "la",
    arabic: "لَا",
    transliteration: "Lā",
    englishMeaning: "No / Not (Absolute Negation or Prohibition)",
    attachmentType: "standalone",
    category: "negation",
    grammaticalEffect: "Categorical Negation (Lā li-Nafiyil Jins) makes nouns accusative (Mansūb) with single fathah. Prohibition makes verbs jussive.",
    syntacticRule: "Freestanding particle. Precedes nouns (for negation of category) or verbs (for do not/will not).",
    quranicExampleArabic: "لَا رَيْبَ فِيهِ",
    quranicExampleTranslation: "No doubt whatsoever inside it"
  },
  {
    id: "ya",
    arabic: "يَا",
    transliteration: "Yā",
    englishMeaning: "O...! (Vocative Direct Addressing)",
    attachmentType: "standalone",
    category: "vocative",
    grammaticalEffect: "Forces the addressed noun into a nominative with a single dammah, or genitive if in an idafa construct.",
    syntacticRule: "Standalone vocative particle written immediately before the targeted person or coordinate name.",
    quranicExampleArabic: "يَا أَيُّهَا النَّاسُ",
    quranicExampleTranslation: "O mankind...!"
  },
  {
    id: "kum_suffix",
    arabic: "ـكُمْ",
    transliteration: "-kum",
    englishMeaning: "Your / You plural (Attached Pronoun Suffix)",
    attachmentType: "suffixed",
    category: "emphasis",
    grammaticalEffect: "Acts as Genitive possessive when attached to Nouns, or Accusative object when attached to Verbs.",
    syntacticRule: "Direct suffix. Appended directly onto the end of a core noun, verb, or preposition.",
    quranicExampleArabic: "رَبُّكُمْ",
    quranicExampleTranslation: "Your Lord (owner)"
  },
  {
    id: "inna",
    arabic: "إِنَّ",
    transliteration: "Inna",
    englishMeaning: "Indeed / Verily",
    attachmentType: "standalone",
    category: "emphasis",
    grammaticalEffect: "Known as 'Harf al-Tawkīd'. Makes the subject noun that follows it accusative (Mansūb) as 'Ism Inna', while keeping the predicate nominative (Marfū').",
    syntacticRule: "Stands alone preceding a nominal sentence (Mubtada and Khabar) to affirm absolute certainty.",
    quranicExampleArabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    quranicExampleTranslation: "Indeed, Allah is with those who are patient."
  },
  {
    id: "hal",
    arabic: "هَلْ",
    transliteration: "Hal",
    englishMeaning: "Is / Are / Do",
    attachmentType: "standalone",
    category: "interrogative",
    grammaticalEffect: "Known as 'Harf al-Istifhām'. No direct case-ending effect on follows. Solicits a positive or negative yes/no statement.",
    syntacticRule: "Precedes a nominal or verbal sentence as a freestanding word.",
    quranicExampleArabic: "هَلْ أَتَىٰ عَلَى الْإِنسَانِ حِينٌ مِّنَ الدَّهْرِ",
    quranicExampleTranslation: "Has there [not] come upon man a period of time..."
  },
  {
    id: "an",
    arabic: "أَنْ",
    transliteration: "An",
    englishMeaning: "That / To",
    attachmentType: "standalone",
    category: "conjunction",
    grammaticalEffect: "Known as 'Harf al-Masdariyah'. Forces the subsequent present tense verb into the Subjunctive state (Mansūb), usually replacing dammah with fathah.",
    syntacticRule: "Standalone particle that sits immediately before a present tense (Mudāri') action verb to construct an infinitive node.",
    quranicExampleArabic: "وَأَن تَصُومُوا خَيْرٌ لَّكُمْ",
    quranicExampleTranslation: "And that you fast (to fast) is better for you."
  },
  {
    id: "lan",
    arabic: "لَنْ",
    transliteration: "Lan",
    englishMeaning: "Never",
    attachmentType: "standalone",
    category: "negation",
    grammaticalEffect: "Known as 'Harf al-Nafy wal-Nasb'. Negates the future state absolutely and changes the following present verb to Subjunctive (Mansūb).",
    syntacticRule: "Standalone particle that precedes a present tense verb for intensive, permanent-focused future negation.",
    quranicExampleArabic: "لَن تَنَالُوا الْبِرَّ حَتَّىٰ تُنفِقُوا",
    quranicExampleTranslation: "Never will you attain righteousness until you spend [from what you love]..."
  },
  {
    id: "lam",
    arabic: "لَمْ",
    transliteration: "Lam",
    englishMeaning: "Did not",
    attachmentType: "standalone",
    category: "negation",
    grammaticalEffect: "Known as 'Harf al-Jazm'. Negates present tense action and flips its temporal context into the past, forcing the verb into the Jussive state (Majzūm), normally with a sukun.",
    syntacticRule: "Standalone particle that sits immediately before present tense verbs. Flipping chronological flow to simple past negation.",
    quranicExampleArabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    quranicExampleTranslation: "He neither begets nor is born"
  },
  {
    id: "thumma",
    arabic: "ثُمَّ",
    transliteration: "Thumma",
    englishMeaning: "Then / Afterward",
    attachmentType: "standalone",
    category: "conjunction",
    grammaticalEffect: "Known as 'Harf al-'Atf'. Coordinates two sentences or nouns. The second term assumes identical case-marking (nominative/accusative/genitive) as the first.",
    syntacticRule: "Freestanding coordinating conjunction that introduces a chronologically delayed sequence with an explicit period of delay.",
    quranicExampleArabic: "ثُمَّ خَلَقْنَا النُّطْفَةَ عَلَقَةً",
    quranicExampleTranslation: "Then We made the sperm-drop into a clinging clot"
  }
];

interface HurufLibraryProps {
  theme: LayoutTheme;
}

export default function HurufLibrary({ theme }: HurufLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'preposition' | 'conjunction' | 'interrogative' | 'negation' | 'emphasis' | 'vocative'>('all');
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
                className={`w-full font-medium rounded-xl py-1.5 pl-8 pr-3 text-xs focus:outline-none transition-all border ${
                  isParchment
                    ? 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e] focus:border-[#8c6239]'
                    : isCosmic
                      ? 'bg-black border-indigo-950 text-indigo-100 placeholder-indigo-300/40 focus:border-indigo-500'
                      : 'bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-emerald-500'
                }`}
              />
            </div>

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
              {(['all', 'preposition', 'conjunction', 'interrogative', 'negation', 'vocative', 'emphasis'] as const).map(cat => (
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
