import React, { useState } from 'react';
import { LayoutTheme, WordAnalysis, SavedWordMap } from '../types';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Search, 
  Info, 
  FlaskConical, 
  Sparkles, 
  Cpu, 
  Check, 
  Wand2, 
  FileCheck,
  ChevronRight,
  BookOpenCheck,
  HelpCircle,
  TableProperties,
  Clock,
  Users,
  Hash,
  Keyboard
} from 'lucide-react';
import ArabicVirtualKeyboard from './ArabicVirtualKeyboard';

interface PatternInfo {
  id: string;
  wazan: string; 
  wazanTransliteration: string; 
  englishName: string; 
  category: 'verb' | 'noun';
  rootTransformation: string; 
  semanticEffect: string; 
  quranicFormula: string; 
  classicalExampleArabic: string; 
  classicalExampleEnglish: string; 
  exampleQuranicVerse: string;
  exampleQuranicVerseEnglish: string;
  commonRootsTitle: string[];
  grammaticalWeightDescription: string;
}

// Extensive pre-defined classical Arabic grammatical template database (the core Auzan) enriched with quranic verse occurrences
const PREDEFINED_PATTERNS: PatternInfo[] = [
  {
    id: "active_participle",
    wazan: "فَاعِل",
    wazanTransliteration: "Fā'il",
    englishName: "Active Participle (Ism al-Fā'il)",
    category: "noun",
    rootTransformation: "Inserts a prolonged Alif (ا) after the first root letter and a Kasrah (ِ) under the second root letter.",
    semanticEffect: "Transforms the root meaning into the person, being, or entity who actively performs or embodies that action.",
    quranicFormula: "[R1] + ā + [R2] + i + [R3]",
    classicalExampleArabic: "سَاجِد",
    classicalExampleEnglish: "(Sājid) One who prostrates - from S-J-D (to prostrate)",
    exampleQuranicVerse: "وَكَلْبُهُم بَاسِطٌ ذِرَاعَيْهِ بِالْوَصِيدِ",
    exampleQuranicVerseEnglish: "And their dog stretched its forelegs at the entrance.",
    commonRootsTitle: ["S-J-D (Prostrate)", "K-T-B (Write)", "A-L-M (Know)", "Gh-F-R (Forgive)"],
    grammaticalWeightDescription: "Ism al-Fā'il represents the active instigator of action. Under specific syntax environments, it can govern secondary nouns into accusative cases (nasb) as direct objects, acting identical to an active verb."
  },
  {
    id: "passive_participle",
    wazan: "مَفْعُول",
    wazanTransliteration: "Maf'ūl",
    englishName: "Passive Participle (Ism al-Maf'ūl)",
    category: "noun",
    rootTransformation: "Prefixes a Meem with Fathah (مَ) and inserts a prolonged Waw (و) between the second and third root letters.",
    semanticEffect: "Signifies the direct recipient or object that undergoes the root action (e.g. the written entity).",
    quranicFormula: "ma + [R1] + [R2] + ū + [R3]",
    classicalExampleArabic: "مَكْتُوب",
    classicalExampleEnglish: "(Maktūb) Written/Decreed - from K-T-B (to write)",
    exampleQuranicVerse: "ذَٰلِكَ يَوْمٌ مَّجْمُوعٌ لَّهُ النَّاسُ وَذَٰلِكَ يَوْمٌ مَّشْهُودٌ",
    exampleQuranicVerseEnglish: "That is a Day for which mankind will be gathered, and that is a Day witnessed.",
    commonRootsTitle: ["K-T-B (Write)", "F-R-D (Separate)", "Kh-L-Q (Create)", "S-N-A (Make)"],
    grammaticalWeightDescription: "Ism al-Maf'ūl denotes the entity receiving or undergoing the verbal effect. Grammatically, it functions in the place of a passive-voice verb (Fi'l Majhūl), often elevating its target noun into a mock subject (Nā'ib al-Fā'il)."
  },
  {
    id: "form1_verb",
    wazan: "فَعَلَ",
    wazanTransliteration: "Fa'ala",
    englishName: "Form I (Basic Trilogy Verb)",
    category: "verb",
    rootTransformation: "The absolute basic pattern. Vowelled as fathah, fathah, fathah on the root letters.",
    semanticEffect: "Expresses the core, unconditioned meaning of the root. It carries no secondary aspect of agency, intensity, or request.",
    quranicFormula: "[R1]a + [R2]a + [R3]a",
    classicalExampleArabic: "خَلَقَ",
    classicalExampleEnglish: "(Khalaqa) He created - from Kh-L-Q (to split/smooth/create)",
    exampleQuranicVerse: "خَلَقَ الْإِنسَانَ مِنْ عَلَقٍ",
    exampleQuranicVerseEnglish: "Created man from a clinging substance.",
    commonRootsTitle: ["Kh-L-Q (Create)", "K-T-B (Write)", "N-S-R (Help)", "S-J-D (Prostrate)"],
    grammaticalWeightDescription: "Form I represents the unconditioned base template of the root. All secondary derived Forms II-X are derived through specific morphological operations overlaying this root baseline."
  },
  {
    id: "form2_verb",
    wazan: "فَعَّلَ",
    wazanTransliteration: "Fa''ala",
    englishName: "Form II (Intensive / Causative)",
    category: "verb",
    rootTransformation: "Doubles (adds shaddah ّ ) to the middle root letter.",
    semanticEffect: "Signifies intense frequency of the action, doing it thoroughly, or causing/directing another entity to do it.",
    quranicFormula: "[R1]a + [R2]ّa + [R3]a",
    classicalExampleArabic: "عَلَّمَ",
    classicalExampleEnglish: "('Allama) He taught thoroughly - from 'A-L-M (to know)",
    exampleQuranicVerse: "نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ",
    exampleQuranicVerseEnglish: "He has sent down upon you, [O Muhammad], the Book in truth.",
    commonRootsTitle: ["N-Z-L (Descend)", "A-L-M (Know)", "K-T-B (Write)", "M-Y-Z (Distinguish)"],
    grammaticalWeightDescription: "Form II conveys causation (making another act) or intensive multiplication of the action itself. The presence of the middle-radical shaddah represents concentrated physical or rhetorical energy."
  },
  {
    id: "form3_verb",
    wazan: "فَاعَلَ",
    wazanTransliteration: "Fā'ala",
    englishName: "Form III (Reciprocal / Directive)",
    category: "verb",
    rootTransformation: "Adds a prolonged Alif (ا) after the first root letter.",
    semanticEffect: "Indicates that the root action is done in relation to or interactively with another person (cooperative or mutual).",
    quranicFormula: "[R1]ā + [R2]a + [R3]a",
    classicalExampleArabic: "قَاتَلَ",
    classicalExampleEnglish: "(Qātala) He fought with/contended - from Q-T-L (to kill)",
    exampleQuranicVerse: "يُخَادِعُونَ اللَّهَ وَالَّذِينَ آمَنُوا",
    exampleQuranicVerseEnglish: "They [think to] deceive Allah and those who believe.",
    commonRootsTitle: ["Kh-D-A (Deceive)", "Q-T-L (Kill)", "K-T-B (Write)", "S-A-D (Assist)"],
    grammaticalWeightDescription: "Form III introduces an interactive, dual-party or reciprocal aspect. Historically, it implies striving to perform the action upon another, or participating in a mutual dynamic of engagement."
  },
  {
    id: "form4_verb",
    wazan: "أَفْعَلَ",
    wazanTransliteration: "Af'ala",
    englishName: "Form IV (Causative Agency)",
    category: "verb",
    rootTransformation: "Prefixes a hamza with fathah (أَ) and silences (sukun ْ ) the first root letter.",
    semanticEffect: "Makes an intransitive root highly transitive. Means to 'make someone perform the action' or initiate a process.",
    quranicFormula: "a + [R1]ْ + [R2]a + [R3]a",
    classicalExampleArabic: "أَنْزَلَ",
    classicalExampleEnglish: "(Anzala) He sent down / caused to descend - from N-Z-L (to descend)",
    exampleQuranicVerse: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ",
    exampleQuranicVerseEnglish: "Indeed, We sent it down during the Night of Decree.",
    commonRootsTitle: ["N-Z-L (Descend)", "S-L-M (Peace)", "H-S-N (Beautify)", "A-R-S (Anchor)"],
    grammaticalWeightDescription: "Form IV converts an intransitive state directly into causative transitive activation. The prefix hamza acts as a logical trigger to project the root core outward into the world as a singular decisive action."
  },
  {
    id: "form5_verb",
    wazan: "تَفَعَّلَ",
    wazanTransliteration: "Tafa''ala",
    englishName: "Form V (Reflexive Form II)",
    category: "verb",
    rootTransformation: "Prefixes a Ta (تَ) and doubles (shaddah ّ ) the middle root letter.",
    semanticEffect: "Represents the state of taking on the action gradually over time, or internalizing a learning process for oneself.",
    quranicFormula: "ta + [R1]a + [R2]ّa + [R3]a",
    classicalExampleArabic: "تَعَلَّمَ",
    classicalExampleEnglish: "(Ta'allama) He learned (taught himself gradually) - from 'A-L-M (to know)",
    exampleQuranicVerse: "وَيَتَفَكَّرُونَ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ",
    exampleQuranicVerseEnglish: "And give thought to the creation of the heavens and the earth.",
    commonRootsTitle: ["F-K-R (Reflect)", "A-L-M (Know)", "Q-B-L (Accept)", "T-H-R (Purify)"],
    grammaticalWeightDescription: "Form V is the reflexive counterpart to Form II. It denotes internalizing an intensive action gradually, undergoing self-transformation, or behaving with diligent intent."
  },
  {
    id: "form6_verb",
    wazan: "تَفَاعَلَ",
    wazanTransliteration: "Tafā'ala",
    englishName: "Form VI (Mutual / Simulated Interaction)",
    category: "verb",
    rootTransformation: "Prefixes a Ta (تَ) and inserts a prolonged Alif (ا) after the first root letter.",
    semanticEffect: "Signifies collective togetherness in action, mutual back-and-forth participation, or pretending to perform the state.",
    quranicFormula: "ta + [R1]ā + [R2]a + [R3]a",
    classicalExampleArabic: "تَعَاوَنَ",
    classicalExampleEnglish: "(Ta'āwana) He collaborated mutually - from 'A-W-N (to assist)",
    exampleQuranicVerse: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ",
    exampleQuranicVerseEnglish: "Blessed is He in whose hand is dominion.",
    commonRootsTitle: ["B-R-K (Bless)", "T-A-N (Interfere)", "A-W-N (Cooperate)", "Sh-B-H (Resemble)"],
    grammaticalWeightDescription: "Form VI indicates mutual reciprocity among multiple agents, or simulated pretense. The grammatical lengthening represents a shared, balanced exchange of the action."
  },
  {
    id: "form8_verb",
    wazan: "اِفْتَعَلَ",
    wazanTransliteration: "Ifta'ala",
    englishName: "Form VIII (Earnest Effort / Acquisitive)",
    category: "verb",
    rootTransformation: "Prefixes a silent Hamza (اِ), silences the 1st root, and inserts a Ta (تَ) before the 2nd root.",
    semanticEffect: "Represents performing the action with extreme personal focus, interest, or earning the benefit of that action.",
    quranicFormula: "i + [R1]ْ + ta + [R2]a + [R3]a",
    classicalExampleArabic: "اِكْتَسَبَ",
    classicalExampleEnglish: "(Iktasaba) He earned/acquired diligently - from K-S-B (to earn)",
    exampleQuranicVerse: "اِهْتَدَىٰ مَنِ اهْتَدَىٰ لِنَفْسِهِ",
    exampleQuranicVerseEnglish: "Whoever is guided is only guided for [the benefit of] his soul.",
    commonRootsTitle: ["H-D-Y (Guide)", "K-S-B (Earn)", "N-S-R (Victory)", "F-A-L (Act)"],
    grammaticalWeightDescription: "Form VIII represents highly earnest, diligent work aimed at acquiring or personalizing the root. The infixed Ta (ت) represents self-directed effort and deliberate adaptation."
  },
  {
    id: "form10_verb",
    wazan: "اِسْتَفْعَلَ",
    wazanTransliteration: "Istaf'ala",
    englishName: "Form X (Requestative / Seeking)",
    category: "verb",
    rootTransformation: "Prefixes the sequence Alif-Seen-Ta (اِسْتَ) and silences the first root letter.",
    semanticEffect: "Expresses seeking, asking for, or requesting the root's concept. (E.g. seeking protection, calling to stand up).",
    quranicFormula: "ista + [R1]ْ + [R2]a + [R3]a",
    classicalExampleArabic: "اِسْتَغْفَرَ",
    classicalExampleEnglish: "(Istaghfara) He sought forgiveness - from Gh-F-R (to forgive/cover)",
    exampleQuranicVerse: "وَاسْتَغْفِرُوا اللَّهَ ۖ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ",
    exampleQuranicVerseEnglish: "And seek forgiveness of Allah. Indeed, Allah is Forgiving and Merciful.",
    commonRootsTitle: ["Gh-F-R (Forgive)", "Q-W-M (Stand)", "A-M-R (Command)", "N-S-R (Help)"],
    grammaticalWeightDescription: "Form X denotes the request, pleading, or active seeking of the root's core noun. The triple prefix sequence 'Ista-' operates as an indicator of supplicatory yearning or cognitive judgment."
  },
  {
    id: "noun_of_place",
    wazan: "مَفْعَل",
    wazanTransliteration: "Maf'al",
    englishName: "Noun of Place/Time (Ism al-Makān)",
    category: "noun",
    rootTransformation: "Prefixes a Meem with fathah (مَ) and silences (sukun ْ ) the first root letter.",
    semanticEffect: "Denotes the geographical location or specific timeframe where the root's core action is repeatedly performed.",
    quranicFormula: "ma + [R1]ْ + [R2]a + [R3]",
    classicalExampleArabic: "مَسْجِد",
    classicalExampleEnglish: "(Masjid) Place of prostration - from S-J-D (to prostrate)",
    exampleQuranicVerse: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى",
    exampleQuranicVerseEnglish: "Exalted is He who took His Servant by night from al-Masjid al-Haram to al-Masjid al-Aqsa.",
    commonRootsTitle: ["S-J-D (Prostrate)", "K-T-B (Write)", "A-L-M (Know)", "W-Q-F (Stand)"],
    grammaticalWeightDescription: "Ism al-Makān anchors the verbal root into space & time dimensions. It transforms transient actions into a physical, recognized spatial or temporal container."
  },
  {
    id: "noun_of_instrument",
    wazan: "مِفْعَال",
    wazanTransliteration: "Mif'āl",
    englishName: "Noun of Instrument (Ism al-Ālah)",
    category: "noun",
    rootTransformation: "Prefixes a Meem with kasrah (مِ) and adds a prolonged Alif (ا) before the third root letter.",
    semanticEffect: "Determines the physical mechanism, device, or tool used to execute the underlying root action.",
    quranicFormula: "mi + [R1]ْ + [R2]ā + [R3]",
    classicalExampleArabic: "مِفْتَاح",
    classicalExampleEnglish: "(Miftāh) Key (tool to open) - from F-T-H (to open)",
    exampleQuranicVerse: "وَلَا تَنقُصُوا الْمِكْيَالَ وَالْمِيزَانَ",
    exampleQuranicVerseEnglish: "And do not decrease from the measure and the scale.",
    commonRootsTitle: ["K-Y-L (Measure)", "W-Z-N (Weigh)", "F-T-H (Open)", "S-B-H (Swim/Gear)"],
    grammaticalWeightDescription: "Ism al-Ālah outlines the instrumental vehicle or mechanical equipment used to invoke the action. It reflects the classical physical tools of measurement and activation."
  },
  {
    id: "hyperbolic_noun",
    wazan: "فَعَّال",
    wazanTransliteration: "Fa''āl",
    englishName: "Intense Hyperbolic (Sighat al-Mubālaghah)",
    category: "noun",
    rootTransformation: "Doubles the second root letter and adds a prolonged Alif (ا) before the third.",
    semanticEffect: "Indicates doing the root action in an absolute, ultimate, hyper-intensive, or professional persistent volume.",
    quranicFormula: "[R1]a + [R2]ّ + ā + [R3]",
    classicalExampleArabic: "غَفَّار",
    classicalExampleEnglish: "(Ghaffār) Ultimate Forgiver - from Gh-F-R (to forgive)",
    exampleQuranicVerse: "إِنَّ اللَّهَ كَانَ تَوَّابًا رَّحِيمًا",
    exampleQuranicVerseEnglish: "Indeed, Allah is ever Accepting of repentance and Merciful.",
    commonRootsTitle: ["T-W-B (Repent)", "Gh-F-R (Forgive)", "K-D-B (Lie)", "Q-H-R (Overpower)"],
    grammaticalWeightDescription: "Sighat al-Mubālaghah conveys either frequent repetition of an action or high density of a personal quality. Morphologically highly emphasized, it is most widely used in the Quran for divine attributes."
  },
  {
    id: "comparative_adjective",
    wazan: "أَفْعَل",
    wazanTransliteration: "Af'al",
    englishName: "Epithet / Comparative (Ism al-Tafdīl)",
    category: "noun",
    rootTransformation: "Prefixes a Hamza with Fathah (أَ) and silences the first root letter.",
    semanticEffect: "Represents the comparative ('greater/more') or superlative ('greatest/most') expression of a positive root attribute.",
    quranicFormula: "a + [R1]ْ + [R2]a + [R3]",
    classicalExampleArabic: "أَكْبَر",
    classicalExampleEnglish: "(Akbar) Greater / Greatest - from K-B-R (to be great)",
    exampleQuranicVerse: "وَلَذِكْرُ اللَّهِ أَكْبَرُ ۗ وَاللَّهُ يَعْلَمُ مَا تَصْنَعُونَ",
    exampleQuranicVerseEnglish: "And the remembrance of Allah is surely greater. And Allah knows what you do.",
    commonRootsTitle: ["K-B-R (Great)", "H-S-N (Beautify)", "S-G-R (Small)", "A-L-M (Know)"],
    grammaticalWeightDescription: "Ism al-Tafdīl is generally semi-declinable (Mamnoo' min as-Sarf), meaning it does not accept tanween and uses a single fathah for the genitive case instead of kasrah, except when it is defined by the prefix 'Al-' or acts as a first term in an annexing genitive construct (Idāfah)."
  },
  {
    id: "vocal_intensity",
    wazan: "فَعِيل",
    wazanTransliteration: "Fa'īl",
    englishName: "Constant Epithet (Sifah Mushabbahah)",
    category: "noun",
    rootTransformation: "Inserts a prolonged Ya (ي) with sukun between the second and third root letters.",
    semanticEffect: "Conveys a permanent, intrinsic, or absolute characteristic that is continuously active and present.",
    quranicFormula: "[R1]a + [R2]ī + [R3]",
    classicalExampleArabic: "رَحِيم",
    classicalExampleEnglish: "(Rahīm) Constantly Merciful - from R-H-M (to have mercy)",
    exampleQuranicVerse: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    exampleQuranicVerseEnglish: "In the Name of Allah, the Most Compassionate, the Most Merciful.",
    commonRootsTitle: ["R-H-M (Mercy)", "K-R-M (Noble)", "A-L-M (Know)", "S-M-E (Hear)"],
    grammaticalWeightDescription: "Sifah Mushabbahah mimics properties that behave like stable character designations, as opposed to temporary action indicators (Ism al-Fā'il). It anchors the underlying quality into a continuous, active state."
  }
];

// Interactive Substitution Lab Roots
const LAB_ROOTS = [
  { letters: ["ك", "ت", "ب"], transliteration: "K-T-B", meaning: "Writing / Decree", label: "ك ت ب (Write)" },
  { letters: ["ع", "ل", "م"], transliteration: "A-L-M", meaning: "Knowing / Sign", label: "ع ل م (Know)" },
  { letters: ["خ", "ل", "ق"], transliteration: "Kh-L-Q", meaning: "Creating / Splitting", label: "خ ل ق (Create)" },
  { letters: ["ن", "ص", "ر"], transliteration: "N-S-R", meaning: "Helping / Victory", label: "ن ص ر (Victoric Aid)" },
  { letters: ["س", "ج", "د"], transliteration: "S-J-D", meaning: "Submission / Prostrate", label: "س ج د (Submit)" },
  { letters: ["غ", "ف", "ر"], transliteration: "Gh-F-R", meaning: "Forgiving / Covering", label: "غ ف ر (Forgive)" }
];

// Dynamic output substitution table for precise spelling rules
const SUBSTITUTION_MATRIX: Record<string, Record<string, { word: string; meaning: string }>> = {
  active_participle: {
    "K-T-B": { word: "كَاتِب", meaning: "Writer / Scribe" },
    "A-L-M": { word: "عَالِم", meaning: "Scholar / Knower" },
    "Kh-L-Q": { word: "خَالِق", meaning: "Creator" },
    "N-S-R": { word: "نَاصِر", meaning: "Helper / Defender" },
    "S-J-D": { word: "سَاجِد", meaning: "Prostrator (one in prayer)" },
    "Gh-F-R": { word: "غَافِر", meaning: "Forgiver" }
  },
  passive_participle: {
    "K-T-B": { word: "مَكْتُوب", meaning: "Written / Decreed destiny" },
    "A-L-M": { word: "مَعْلُوم", meaning: "Known / Specified fact" },
    "Kh-L-Q": { word: "مَخْلُوق", meaning: "Created being / Creature" },
    "N-S-R": { word: "مَنْصُور", meaning: "Victor / Supported helper" },
    "S-J-D": { word: "مَسْجُود", meaning: "Worshipped / Object of prostration" },
    "Gh-F-R": { word: "مَغْفُور", meaning: "Forgiven one / Absolved" }
  },
  form1_verb: {
    "K-T-B": { word: "كَتَبَ", meaning: "He wrote / decreed" },
    "A-L-M": { word: "عَلِمَ", meaning: "He knew / learned" },
    "Kh-L-Q": { word: "خَلَقَ", meaning: "He created from nothing" },
    "N-S-R": { word: "نَصَرَ", meaning: "He aided / gave victory" },
    "S-J-D": { word: "سَجَدَ", meaning: "He bowed down / prostrated" },
    "Gh-F-R": { word: "غَفَرَ", meaning: "He covered / pardoned" }
  },
  form2_verb: {
    "K-T-B": { word: "كَتَّبَ", meaning: "He dictated / made write" },
    "A-L-M": { word: "عَلَّمَ", meaning: "He taught / instructed with wisdom" },
    "Kh-L-Q": { word: "خَلَّقَ", meaning: "He crafted repeatedly / fashioned" },
    "N-S-R": { word: "نَصَّرَ", meaning: "He christianized / aided intensively" },
    "S-J-D": { word: "سَجَّدَ", meaning: "He caused to bow down repeatedly" },
    "Gh-F-R": { word: "غَفَّرَ", meaning: "He absolved meticulously / repeatedly" }
  },
  form3_verb: {
    "K-T-B": { word: "كَاتَبَ", meaning: "He corresponded with / signed a treaty" },
    "A-L-M": { word: "عَالَمَ", meaning: "He entered reciprocity of teaching" },
    "Kh-L-Q": { word: "خَالَقَ", meaning: "He interacted with best characters" },
    "N-S-R": { word: "نَاصَرَ", meaning: "He allied with / entered pact" },
    "S-J-D": { word: "سَاجَدَ", meaning: "He joined in prostration" },
    "Gh-F-R": { word: "غَافَرَ", meaning: "He compromised mutually" }
  },
  form4_verb: {
    "K-T-B": { word: "أَكْتَبَ", meaning: "He made (him) write / dictated layout" },
    "A-L-M": { word: "أَعْلَمَ", meaning: "He informed / announced clearly" },
    "Kh-L-Q": { word: "أَخْلَقَ", meaning: "He wore out / made look old" },
    "N-S-R": { word: "أَنْصَرَ", meaning: "He made victorious / delivered aid" },
    "S-J-D": { word: "أَسْجَدَ", meaning: "He induced to prostrate / bow" },
    "Gh-F-R": { word: "أَغْفَرَ", meaning: "He led someone to pardon" }
  },
  form5_verb: {
    "K-T-B": { word: "تَكَتَّبَ", meaning: "He aligned in written scripts / drafted" },
    "A-L-M": { word: "تَعَلَّمَ", meaning: "He learned step-by-step / studied" },
    "Kh-L-Q": { word: "تَخَلَّقَ", meaning: "He assumed moral habits gradually" },
    "N-S-R": { word: "تَنَصَّرَ", meaning: "He localized as a dynamic helper" },
    "S-J-D": { word: "تَسَجَّدَ", meaning: "He fell into deep devotion" },
    "Gh-F-R": { word: "تَغَفَّرَ", meaning: "He sought coverage under wraps" }
  },
  form6_verb: {
    "K-T-B": { word: "تَكَاتَبَ", meaning: "They wrote to one another mutually" },
    "A-L-M": { word: "تَعَالَمَ", meaning: "He pretended to know / claimed wisdom" },
    "Kh-L-Q": { word: "تَخَالَقَ", meaning: "They compromised beautifully" },
    "N-S-R": { word: "تَنَاصَرَ", meaning: "They stood up with mutual assistance" },
    "S-J-D": { word: "تَسَاجَدَ", meaning: "They joined together in homage" },
    "Gh-F-R": { word: "تَغَافَرَ", meaning: "They forgave each other mutually" }
  },
  form8_verb: {
    "K-T-B": { word: "اِكْتَتَبَ", meaning: "He registered himself / subscribed" },
    "A-L-M": { word: "اِعْتَلَمَ", meaning: "He erected a pathway signpost" },
    "Kh-L-Q": { word: "اِخْتَلَقَ", meaning: "He fabricated / authored a tale" },
    "N-S-R": { word: "اِنْتَصَرَ", meaning: "He avenged himself / triumphed" },
    "S-J-D": { word: "اِسْتَجَدَ", meaning: "He bent over / submitted" }, // mapped phonetically
    "Gh-F-R": { word: "اِغْتَفَرَ", meaning: "He excused / overlooked error" }
  },
  form10_verb: {
    "K-T-B": { word: "اِسْتَكْتَبَ", meaning: "He demanded / ordered a copy writ" },
    "A-L-M": { word: "اِسْتَعْلَمَ", meaning: "He inquired / requested database" },
    "Kh-L-Q": { word: "اِسْتَخْلَقَ", meaning: "He asked for creation / renewal" },
    "N-S-R": { word: "اِسْتَنْصَرَ", meaning: "He implored for victory / aid" },
    "S-J-D": { word: "اِسْتَسْجَدَ", meaning: "He requested humbleness" },
    "Gh-F-R": { word: "اِسْتَغْفَرَ", meaning: "He implored forgiveness / begged covers" }
  },
  noun_of_place: {
    "K-T-B": { word: "مَكْتَب", "meaning": "Office / Library / Desk" },
    "A-L-M": { word: "مَعْلَم", "meaning": "Landmark / School / Signpost" },
    "Kh-L-Q": { word: "مَخْلَق", "meaning": "State or place of disposition" },
    "N-S-R": { word: "مَنْصَر", "meaning": "Point of military breakthrough" },
    "S-J-D": { word: "مَسْجِد", "meaning": "Mosque / Venue of divine homage" },
    "Gh-F-R": { word: "مَغْفَر", "meaning": "Helmet / Guarded shelter" }
  },
  noun_of_instrument: {
    "K-T-B": { word: "مِكْتَاب", meaning: "Typing gauge / Scriber instrument" },
    "A-L-M": { word: "مِعْلَام", meaning: "Indicator dial / Flag pointer" },
    "Kh-L-Q": { word: "مِخْلَاق", meaning: "Molding template / Form shape" },
    "N-S-R": { word: "مِنْصَار", meaning: "Banner of campaign / Trumpet" },
    "S-J-D": { word: "مِسْجَاد", meaning: "Prayer mat template" },
    "Gh-F-R": { word: "مِغْفَار", meaning: "Shield of protection / Screen" }
  },
  hyperbolic_noun: {
    "K-T-B": { word: "كَتَّاب", meaning: "Proficient scribe / Great compiler" },
    "A-L-M": { word: "عَلَّام", meaning: "All-Knowing authority / Omniscient" },
    "Kh-L-Q": { word: "خَلَّاق", meaning: "The Sovereign fashioner / Continuous Creator" },
    "N-S-R": { word: "نَصَّار", meaning: "Relentless champion / Great protector" },
    "S-J-D": { word: "سَجَّاد", meaning: "One who prostrates constantly" },
    "Gh-F-R": { word: "غَفَّار", meaning: "Sovereign Pardoner / All-Forgiving" }
  },
  comparative_adjective: {
    "K-T-B": { word: "أَكْتَب", meaning: "More proficient in writing" },
    "A-L-M": { word: "أَعْلَم", meaning: "More knowing / Most learned" },
    "Kh-L-Q": { word: "أَخْلَق", meaning: "More fitting / Most worthy" },
    "N-S-R": { word: "أَنْصَر", meaning: "More victorious / Stronger helper" },
    "S-J-D": { word: "أَسْجَد", meaning: "More constant in prostration" },
    "Gh-F-R": { word: "أَغْفَر", meaning: "More forgiving" }
  },
  vocal_intensity: {
    "K-T-B": { word: "كَتِيب", meaning: "Documentary document" },
    "A-L-M": { word: "عَلِيم", meaning: "Omniscient / Deep Knower" },
    "Kh-L-Q": { word: "خَلِيق", meaning: "Worthy/Suitable / Inherently adapted" },
    "N-S-R": { word: "نَصِير", meaning: "Bedrock Protector / Strong Helper" },
    "S-J-D": { word: "سَجِيد", meaning: "A persistent worshipper" },
    "Gh-F-R": { word: "غَفِير", meaning: "Abundant / Total" }
  }
};

interface PatternDatabaseProps {
  currentAnalysis: WordAnalysis | null;
  savedMaps: SavedWordMap[];
  theme: LayoutTheme;
  onSelectPatternExample: (word: string) => void;
}

export default function PatternDatabase({
  currentAnalysis,
  savedMaps,
  theme,
  onSelectPatternExample
}: PatternDatabaseProps) {
  const [filter, setFilter] = useState<'all' | 'verb' | 'noun'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArabicKeyboard, setShowArabicKeyboard] = useState(false);
  const [selectedPatternId, setSelectedPatternId] = useState<string>("active_participle");
  const [labRootIndex, setLabRootIndex] = useState(0);
  const [activeMatrixTab, setActiveMatrixTab] = useState<'tenses' | 'pronouns' | 'numbers'>('tenses');

  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Gather all unique Wazans encountered by the user based on search maps list + active analysis
  const getEncounteredWazansSet = () => {
    const encountered = new Set<string>();
    
    // 1. From current search
    if (currentAnalysis) {
      if (currentAnalysis.wazan) {
        encountered.add(currentAnalysis.wazan.trim());
      }
      const morph = currentAnalysis.morphologyForm?.toLowerCase() || '';
      PREDEFINED_PATTERNS.forEach(p => {
        if (morph.includes(p.wazanTransliteration.toLowerCase()) || morph.includes(p.englishName.toLowerCase())) {
          encountered.add(p.wazan);
        }
      });
    }

    // 2. From saved list
    savedMaps.forEach(item => {
      if (item.analysis.wazan) {
        encountered.add(item.analysis.wazan.trim());
      }
      const morph = item.analysis.morphologyForm?.toLowerCase() || '';
      PREDEFINED_PATTERNS.forEach(p => {
        if (morph.includes(p.wazanTransliteration.toLowerCase()) || morph.includes(p.englishName.toLowerCase())) {
          encountered.add(p.wazan);
        }
      });
    });

    return encountered;
  };

  const encounteredSet = getEncounteredWazansSet();

  // Filter patterns
  const filteredPatterns = PREDEFINED_PATTERNS.filter(p => {
    const matchesFilter = filter === 'all' || p.category === filter;
    const matchesSearch = 
      p.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.wazanTransliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.wazan.includes(searchQuery) ||
      p.semanticEffect.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedPattern = PREDEFINED_PATTERNS.find(p => p.id === selectedPatternId) || PREDEFINED_PATTERNS[0];
  const activeLabRoot = LAB_ROOTS[labRootIndex];
  const labResult = SUBSTITUTION_MATRIX[selectedPattern.id]?.[activeLabRoot.transliteration] || { word: "n/a", meaning: "n/a" };

  // Generate dynamic full-width conjugation matrix
  const renderConjugationTable = () => {
    if (selectedPattern.category === 'verb') {
      // Verb Conjugation Table entries
      const verbForms = [
        { pronoun: "هُوَ (He)", past: labResult.word, present: "يُ" + labResult.word.replace("أَ","").replace("اِ","").replace("تَ",""), state: "Third Person Singular Masculine" },
        { pronoun: "هُمَا (They Two)", past: labResult.word + "ا", present: "يُ" + labResult.word.replace("أَ","").replace("اِ","").replace("تَ","") + "انِ", state: "Third Person Dual Masculine" },
        { pronoun: "هُمْ (They Plural)", past: labResult.word + "وا", present: "يُ" + labResult.word.replace("أَ","").replace("اِ","").replace("تَ","") + "ونَ", state: "Third Person Plural Masculine" },
        { pronoun: "هِيَ (She)", past: labResult.word + "تْ", present: "تُ" + labResult.word.replace("أَ","").replace("اِ","").replace("تَ",""), state: "Third Person Singular Feminine" },
        { pronoun: "أَنْتَ (You)", past: labResult.word + "تَ", present: "تَ" + labResult.word.replace("أَ","").replace("اِ","").replace("تَ",""), state: "Second Person Singular Masculine" },
        { pronoun: "أَنْتُمْ (You Plural)", past: labResult.word + "تُمْ", present: "تَ" + labResult.word.replace("أَ","").replace("اِ","").replace("تَ","") + "ونَ", state: "Second Person Plural Masculine" },
        { pronoun: "أَنَا (I)", past: labResult.word + "تُ", present: "أَ" + labResult.word.replace("أَ","").replace("اِ","").replace("تَ",""), state: "First Person Singular Common" },
        { pronoun: "نَحْنُ (We)", past: labResult.word + "نَا", present: "نَ" + labResult.word.replace("أَ","").replace("اِ","").replace("تَ",""), state: "First Person Plural Common" }
      ];

      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className={`border-b border-current/10 ${isParchment ? 'text-[#8c6239]' : 'text-indigo-300'}`}>
                <th className="py-2.5 px-3">Subject Pronoun</th>
                <th className="py-2.5 px-3">Grammatical Aspect</th>
                <th className="py-2.5 px-3 text-right">Past Tense (الماضي)</th>
                <th className="py-2.5 px-3 text-right">Present/Future (المضارع)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {verbForms.map((vf, index) => (
                <tr key={index} className="hover:bg-current/5 transition-colors">
                  <td className="py-3 px-3 font-semibold">{vf.pronoun}</td>
                  <td className="py-3 px-3 opacity-70 font-mono text-[11px]">{vf.state}</td>
                  <td className="py-3 px-3 text-right font-serif text-lg font-bold text-amber-600 dark:text-amber-400">{vf.past}</td>
                  <td className="py-3 px-3 text-right font-serif text-lg font-bold text-teal-600 dark:text-teal-400">{vf.present}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Noun Declension Table entries
      const nounForms = [
        { state: "Singular (مفرد)", nominative: labResult.word + "ٌ", accusative: labResult.word + "ًا", genitive: labResult.word + "ٍ", expl: "Single instance doer/object" },
        { state: "Dual Masculine (مثنى مذكر)", nominative: labResult.word + "َانِ", accusative: labResult.word + "َيْنِ", genitive: labResult.word + "َيْنِ", expl: "Exactly two entities" },
        { state: "Sound Plural Masculine (جمع مذكر سالم)", nominative: labResult.word + "ُونَ", accusative: labResult.word + "ِينَ", genitive: labResult.word + "ِينَ", expl: "Three or more entities" },
        { state: "Singular Feminine (مفرد مؤنث)", nominative: labResult.word + "َةٌ", accusative: labResult.word + "َةً", genitive: labResult.word + "َةٍ", expl: "Feminine singular aspect" },
        { state: "Sound Plural Feminine (جمع مؤنث سالم)", nominative: labResult.word + "َاتٌ", accusative: labResult.word + "َاتٍ", genitive: labResult.word + "َاتٍ", expl: "Group of feminine entities" }
      ];

      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            <thead>
              <tr className={`border-b border-current/10 ${isParchment ? 'text-[#8c6239]' : 'text-indigo-300'}`}>
                <th className="py-2.5 px-3">Form Number & State</th>
                <th className="py-2.5 px-3">Syntactic Role</th>
                <th className="py-2.5 px-3 text-right">Nominative (مرفوع)</th>
                <th className="py-2.5 px-3 text-right">Accusative (منصوب)</th>
                <th className="py-2.5 px-3 text-right">Genitive (مجرور)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {nounForms.map((nf, index) => (
                <tr key={index} className="hover:bg-current/5 transition-colors">
                  <td className="py-3 px-3 font-semibold">{nf.state}</td>
                  <td className="py-3 px-3 opacity-70 font-mono text-[11px]">{nf.expl}</td>
                  <td className="py-3 px-3 text-right font-serif text-lg font-bold text-amber-600 dark:text-amber-400">{nf.nominative}</td>
                  <td className="py-3 px-3 text-right font-serif text-lg font-bold text-teal-600 dark:text-teal-400">{nf.accusative}</td>
                  <td className="py-3 px-3 text-right font-serif text-lg font-bold text-blue-600 dark:text-blue-400">{nf.genitive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  // Visual classes
  const cardBgClass = isParchment
    ? 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e]'
    : isCosmic
      ? 'bg-[#05060f] border-indigo-950/80 text-indigo-50'
      : 'bg-slate-900 border-slate-800 text-slate-100';

  const innerCardBgClass = isParchment
    ? 'bg-[#ebd8c3]/20 border-[#dfd2be]'
    : isCosmic
      ? 'bg-indigo-950/30 border-indigo-900/40'
      : 'bg-slate-950/50 border-slate-800/60';

  const selectedRingClass = isParchment
    ? 'border-[#8c6239] bg-[#f4ebe1]/80 shadow-sm'
    : isCosmic
      ? 'border-indigo-500 bg-indigo-950/45 shadow-indigo-500/10'
      : 'border-emerald-500 bg-emerald-950/40 shadow-emerald-500/10';

  const textMutedClass = isParchment ? 'text-[#705e52]' : 'text-slate-400';
  const textActionClass = isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400';

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 ${cardBgClass} space-y-8 animate-fadeIn`}>
      
      {/* 1. Header with Stats Dashboard */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-current/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className={`w-5 h-5 ${textActionClass}`} />
            <h2 className="text-xl font-bold tracking-tight">Mizān as-Sarf <span className="font-sans font-normal text-xs opacity-80">(Universal Morphology Codex)</span></h2>
          </div>
          <p className={`text-xs mt-1 ${textMutedClass}`}>
            Track, model, and simulate Quranic Arabic templates (Auzan) dynamically across customizable classical root radicals.
          </p>
        </div>

        {/* Unlocked score badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
          isParchment ? 'bg-[#ebdcd3]/40 border-[#dfd2be]' : 'bg-current/5 border-current/15'
        }`}>
          <Award className={`w-4 h-4 ${isParchment ? 'text-[#8c6239]' : 'text-amber-400'}`} />
          <span>Pattern Unlock Progress:</span>
          <span className={`px-2 py-0.5 font-mono rounded text-xs ${
            isParchment ? 'bg-[#8c6239] text-[#fdfbf7]' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {encounteredSet.size} / {PREDEFINED_PATTERNS.length} Unlocked
          </span>
        </div>
      </div>

      {/* 2. Horizontal Scrollable / Grid Directory Panel (Full Width) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-500" /> Choose Classical Structural Template:
          </h3>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search className={`absolute left-2.5 top-2 h-3.5 w-3.5 ${isParchment ? 'text-[#8c6239]/80' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Find design shape..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full font-medium rounded-lg py-1 pl-7 pr-7 text-[11px] focus:outline-none transition-all border ${
                  isParchment
                    ? 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e] focus:border-[#8c6239]'
                    : isCosmic
                      ? 'bg-black border-indigo-950 text-indigo-50 focus:border-indigo-500'
                      : 'bg-slate-950 border border-slate-800 text-slate-100 focus:border-emerald-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowArabicKeyboard(!showArabicKeyboard)}
                className={`absolute right-1 top-1 py-0.5 px-1 rounded transition-all duration-200 cursor-pointer ${
                  showArabicKeyboard
                    ? (isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-pink-400' : 'text-emerald-400')
                    : (isParchment ? 'text-[#a68c6d]' : 'text-slate-400 hover:text-slate-200')
                }`}
                title="Arabic Keyboard Toggle"
              >
                <Keyboard className="w-3 h-3" />
              </button>
            </div>

            {/* Sub-Filters */}
            <div className="flex bg-current/5 border border-current/10 p-0.5 rounded-lg text-[9px] font-semibold">
              {(['all', 'verb', 'noun'] as const).map((currF) => (
                <button 
                  key={currF}
                  onClick={() => setFilter(currF)} 
                  type="button"
                  className={`px-2 py-1 rounded cursor-pointer capitalize ${filter === currF ? (isParchment ? 'bg-[#8c6239] text-[#fdfbf7]' : 'bg-current/15 text-white') : 'opacity-60'}`}
                >
                  {currF}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showArabicKeyboard && (
          <div className="p-4 border rounded-xl border-current/10 w-full flex justify-center animate-fadeIn">
            <ArabicVirtualKeyboard
              onKeyPress={(char) => setSearchQuery(prev => prev + char)}
              onClear={() => setSearchQuery('')}
              onBackspace={() => setSearchQuery(prev => prev.slice(0, -1))}
              onClose={() => setShowArabicKeyboard(false)}
              theme={theme}
            />
          </div>
        )}

        {/* Directory cards row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {filteredPatterns.map(p => {
            const isSelected = p.id === selectedPatternId;
            const isEncountered = encounteredSet.has(p.wazan);

            return (
              <button
                key={p.id}
                onClick={() => setSelectedPatternId(p.id)}
                type="button"
                className={`text-left p-3 rounded-xl border flex flex-col justify-between h-24 transition-all duration-200 cursor-pointer ${
                  isSelected ? selectedRingClass : 'bg-transparent border-current/5 hover:bg-current/5'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[9px] font-mono font-bold uppercase ${p.category === 'verb' ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {p.category}
                  </span>
                  {isEncountered ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" title="Discovered in texts!" />
                  ) : (
                    <span className="text-[8px] font-mono opacity-40">?</span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mt-2 w-full">
                  <div className="text-[10px] font-bold truncate max-w-[70px]">{p.wazanTransliteration}</div>
                  <div className="text-xl font-bold font-serif leading-none">{p.wazan}</div>
                </div>

                <div className="text-[8px] opacity-75 truncate w-full mt-1">
                  {p.englishName.split(" (")[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. In-Depth Full Width Workspace (Formula + substitution lab + conjugate matrix table) */}
      <div className={`p-6 rounded-2xl border ${innerCardBgClass} space-y-8 animate-fadeIn`}>
        
        {/* Workspace Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 border-current/10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded">
                Active Classical Template Lab
              </span>
            </div>
            <h3 className="text-lg font-bold mt-2">
              {selectedPattern.englishName} ({selectedPattern.wazanTransliteration})
            </h3>
          </div>

          <div className="text-right">
            <span className="text-3xl font-serif font-black text-amber-500 dark:text-amber-400 block tracking-wide">
              {selectedPattern.wazan}
            </span>
            <span className={`text-[10px] font-mono ${textMutedClass}`}>
              Form Formula: {selectedPattern.quranicFormula}
            </span>
          </div>
        </div>

        {/* FULL WIDTH detailed workspace - stacked for detailed layout reading */}
        <div className="space-y-6">
          
          {/* Row A: Two equal full-width semantic & grammatical weight detail blocks side-by-side or simple stacked blocks with full-widths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Block 1: Morphological Weight & Semantic Details */}
            <div className={`p-5 rounded-2xl border ${isParchment ? 'bg-[#fcf7ed] border-[#ebdcc3]' : 'bg-current/5 border-current/10'} space-y-4 flex flex-col justify-between`}>
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase flex items-center">
                    <FlaskConical className="w-4 h-4 mr-1.5" /> Morphological Semantic Weight
                  </span>
                  <p className="text-xs leading-relaxed font-medium">
                    {selectedPattern.semanticEffect}
                  </p>
                </div>

                <div className="space-y-1.5 p-3.5 bg-black/10 rounded-xl border border-current/5">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${textMutedClass}`}>
                    Root Transformation Rule:
                  </span>
                  <p className="text-xs leading-relaxed">
                    {selectedPattern.rootTransformation}
                  </p>
                </div>
              </div>

              {/* Classical illustrative example launcher */}
              <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 mt-2 ${
                isParchment ? 'bg-[#fdfbf7] border-[#dfd2be]' : 'bg-black/30 border-current/10'
              }`}>
                <div>
                  <span className={`text-[9px] uppercase tracking-wider ${textMutedClass} block mb-0.5`}>
                    Classical Illustrative Word:
                  </span>
                  <div className="text-xs font-bold">
                    {selectedPattern.classicalExampleEnglish}
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => onSelectPatternExample(selectedPattern.classicalExampleArabic)}
                    className={`text-xs font-bold font-serif rounded-lg py-1.5 px-3.5 border transition-all flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 ${
                      isParchment
                        ? 'bg-[#8c6239] text-[#fdfbf7] border-[#8c6239] hover:bg-[#a67c52]'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40 hover:bg-emerald-900/40'
                    }`}
                    title="Analyze this classical word on the live interactive mind map"
                  >
                    {selectedPattern.classicalExampleArabic} 🔍
                  </button>
                </div>
              </div>
            </div>

            {/* Block 2: Advanced Grammatical Weight & Matching Roots */}
            <div className={`p-5 rounded-2xl border ${isParchment ? 'bg-[#fcf7ed] border-[#ebdcc3]' : 'bg-current/5 border-current/10'} space-y-4 flex flex-col justify-between`}>
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold tracking-wider text-teal-400 uppercase flex items-center">
                  <Info className="w-4 h-4 mr-1.5 text-teal-400" /> Advanced Sarf Case Influence
                </span>
                <p className="text-xs leading-relaxed opacity-95">
                  {selectedPattern.grammaticalWeightDescription}
                </p>
                
                <div className="space-y-1.5">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${textMutedClass}`}>
                    Prevalent Quranic Roots Matching This Wazan:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedPattern.commonRootsTitle.map((root, i) => (
                      <span key={i} className={`text-[10px] px-2.5 py-1 rounded bg-current/5 border border-current/10 font-medium`}>
                        {root}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 text-[10.5px] leading-relaxed">
                <span className="font-bold text-blue-400 block mb-0.5">Mizān Proportion Notice</span>
                The root letters bind strictly to positions F (Fa), ʿ (ʿAyn), and L (Lam) of the template.
              </div>
            </div>

          </div>

          {/* Row B: Quranic Context Integration (Full Width) */}
          {selectedPattern.exampleQuranicVerse && (
            <div className={`p-5 rounded-2xl border ${isParchment ? 'bg-[#fdfbf7] border-[#ebdcc3]' : 'bg-black/20 border-current/15'} space-y-3`}>
              <div className="flex items-center justify-between border-b pb-2 border-current/10">
                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase flex items-center gap-1.5">
                  <BookOpenCheck className="w-4 h-4" /> Living Quranic Evidence & Usage context
                </span>
                <span className="text-[10px] font-mono opacity-60">Authentication Anchor</span>
              </div>
              <div className="flex flex-col md:flex-row items-stretch justify-between gap-4">
                <div className="text-right order-first md:order-last shrink-0 flex items-center justify-end">
                  <p className="text-lg md:text-xl font-serif font-black text-amber-500 leading-loose" dir="rtl">
                    {selectedPattern.exampleQuranicVerse}
                  </p>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-xs leading-relaxed italic opacity-90 max-w-2xl">
                    &ldquo;{selectedPattern.exampleQuranicVerseEnglish}&rdquo;
                  </p>
                  <span className="text-[9.5px] font-mono tracking-wide opacity-50 mt-1">
                    * Morphological structure verified directly in classical recitation corpora.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Row C: Interactive Sustitutional Laboratory (Full Width) */}
          <div className="p-5 bg-gradient-to-br from-current/5 to-transparent rounded-2xl border border-current/10 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Wand2 className="w-4 h-4 text-amber-500" /> Interactive Root Substitution Laboratory
                </h4>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded font-mono font-semibold">
                  Live Simulator
                </span>
              </div>
              <p className={`text-xs ${textMutedClass} mb-4 leading-relaxed`}>
                Choose any classical Arabic root below to see how it fuses with the <strong>{selectedPattern.wazanTransliteration} ({selectedPattern.wazan})</strong> form formula.
              </p>

              {/* Roots Button selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-5">
                {LAB_ROOTS.map((r, index) => {
                  const isCur = index === labRootIndex;
                  return (
                    <button
                      key={index}
                      onClick={() => setLabRootIndex(index)}
                      type="button"
                      className={`py-2 px-2.5 text-xs text-center border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isCur
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-sm font-semibold'
                          : 'bg-transparent border-current/5 hover:bg-current/5 text-current'
                      }`}
                    >
                      <span className="text-sm font-serif font-black">{r.letters.join(" - ")}</span>
                      <span className="text-[9px] scale-90 opacity-80 mt-0.5">{r.transliteration}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Substitution Fused Result Widget */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isParchment ? 'bg-[#fcf7ed] border-[#efdfc6]' : 'bg-black/50 border-current/10'
            }`}>
              <div className="text-center sm:text-left space-y-1">
                <span className={`text-[9.5px] uppercase tracking-wider ${textMutedClass} font-mono`}>
                  Result word of substitution:
                </span>
                <div className="text-sm font-semibold text-current font-sans">
                  {activeLabRoot.transliteration} meaning: "{activeLabRoot.meaning}"
                </div>
                <div className="text-[10.5px] opacity-75">
                  {selectedPattern.wazanTransliteration} meaning: "{labResult.meaning}"
                </div>
              </div>

              {/* Large Fused Word Badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-3xl font-serif font-black text-amber-500 block" dir="rtl">
                    {labResult.word}
                  </span>
                  <span className={`text-[10px] font-mono tracking-wider ${textMutedClass}`}>
                     F-ʿ-L Substitution
                  </span>
                </div>
                <span className="text-xs bg-amber-500/10 text-amber-400 p-2 rounded-xl border border-amber-500/20 font-bold animate-pulse">
                  FUSED
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Expansive Full-Width Classical Conjugation Matrix & Grammatical Dimensions Section */}
        <div className="border-t pt-6 border-current/10 space-y-6">
          
          {/* Header of Grammatical Analysis */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold uppercase tracking-wider flex items-center gap-2">
                <TableProperties className="w-5 h-5 text-amber-500" />
                Mizān Dimensional Analysis (Grammatical Dimensions Explorer)
              </h4>
              <p className={`text-xs ${textMutedClass} mt-1`}>
                Understand how <strong>{selectedPattern.wazanTransliteration} ({selectedPattern.wazan})</strong> reshapes dynamically across three core grammatical dimensions:
              </p>
            </div>
            
            {/* Dimension Selection Buttons */}
            <div className={`flex p-1 rounded-xl border ${
              isParchment ? 'bg-[#f5ebd7]/50 border-[#ebdcc3]' : 'bg-black/40 border-current/10'
            }`}>
              <button
                type="button"
                onClick={() => setActiveMatrixTab('tenses')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMatrixTab === 'tenses'
                    ? (isParchment ? 'bg-[#8c6239] text-[#fdfbf7] shadow-sm' : 'bg-amber-500 text-slate-950 shadow-md')
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>⏳ Tenses & Aspects</span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveMatrixTab('pronouns')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMatrixTab === 'pronouns'
                    ? (isParchment ? 'bg-[#8c6239] text-[#fdfbf7] shadow-sm' : 'bg-amber-500 text-slate-950 shadow-md')
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>👥 Pronouns & Genders</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMatrixTab('numbers')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeMatrixTab === 'numbers'
                    ? (isParchment ? 'bg-[#8c6239] text-[#fdfbf7] shadow-sm' : 'bg-amber-500 text-slate-950 shadow-md')
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>🔢 Singular, Dual & Plural</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC CONTENT CONTAINER BASED ON ACTIVE TAB */}
          {activeMatrixTab === 'tenses' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-fadeIn">
              {/* Detailed Explanation on Left */}
              <div className="lg:col-span-4 p-5 rounded-xl border border-current/5 bg-current/5 flex flex-col justify-between space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Aspect & Temporal Weight
                  </h5>
                  <p className="text-xs mt-2.5 leading-relaxed font-sans">
                    {selectedPattern.category === 'verb' ? (
                      <>
                        In Classical Arabic, verbs conjugate under different <strong>Tenses / Aspects</strong>. 
                        The <strong>completed aspect (Past - الماضي)</strong> represents actions finished in time, while the 
                        <strong>incomplete aspect (Present/Future - المضارع)</strong> registers ongoing, habitual, or expected processes. 
                        The imperative aspect <strong>(Command - الأمر)</strong> represents direct intent or instructions.
                      </>
                    ) : (
                      <>
                        Nouns do not conjugate with tenses, but they carry distinct <strong>temporal & agency aspects</strong>. 
                        The <strong>Active Voice Agent (اسم الفاعل)</strong> acts in present logic, the <strong>Passive Voice (اسم المفعول)</strong> carries received actions, 
                        and the <strong>Locative State (اسم المكان والزمان)</strong> anchors the action to a specific space or time coordinate.
                      </>
                    )}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-black/10 border border-current/5 space-y-1 text-[11px]">
                  <span className="font-bold block text-current">Aspect Suffixes & Prefixes:</span>
                  <div className="space-y-1 opacity-80 font-mono text-[10px]">
                    <div>• Past (الماضي): Suffixed attachments only (e.g., -ta, -tu, -na, -at).</div>
                    <div>• Present (المضارع): Prefix indicators (Ya-, Ta-, A-, Na-) + variable suffixes.</div>
                    <div>• Command (الأمر): Truncation rules + silent ending (Sukun) markers.</div>
                  </div>
                </div>
              </div>

              {/* Tenses Action Table on Right */}
              <div className="lg:col-span-8 p-1.5 rounded-xl border border-current/10 bg-current/5 overflow-hidden">
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead>
                    <tr className={`border-b border-current/10 ${isParchment ? 'text-[#8c6239]' : 'text-indigo-300'}`}>
                      <th className="py-2.5 px-3">Grammatical Division</th>
                      <th className="py-2.5 px-3">Core Structural Meaning</th>
                      <th className="py-2.5 px-3 text-right">Formed Word (Active Root)</th>
                      <th className="py-2.5 px-3 text-right">Mizān Structure Map</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/5">
                    {selectedPattern.category === 'verb' ? (
                      <>
                        <tr className="hover:bg-current/5 transition-colors">
                          <td className="py-3 px-3 font-semibold">Perfect Past (الماضي)</td>
                          <td className="py-3 px-3 opacity-80">He completed the template action</td>
                          <td className="py-3 px-3 text-right font-serif text-lg font-bold text-amber-500" dir="rtl">{labResult.word}</td>
                          <td className="py-3 px-3 text-right font-mono text-[10px] opacity-75">{selectedPattern.wazanTransliteration} [Past Template]</td>
                        </tr>
                        <tr className="hover:bg-current/5 transition-colors">
                          <td className="py-3 px-3 font-semibold">Imperfect Present (المضارع)</td>
                          <td className="py-3 px-3 opacity-80">He executes or will execute the action</td>
                          <td className="py-3 px-3 text-right font-serif text-lg font-bold text-teal-400" dir="rtl">
                            {"يُ" + labResult.word.replace("أَ","").replace("اِ","").replace("تَ","")}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[10px] opacity-75">Yu-{selectedPattern.wazanTransliteration} [Imperfect]</td>
                        </tr>
                        <tr className="hover:bg-current/5 transition-colors">
                          <td className="py-3 px-3 font-semibold">Imperative Request (الأمر)</td>
                          <td className="py-3 px-3 opacity-80">Order or entreaty to execute the action</td>
                          <td className="py-3 px-3 text-right font-serif text-lg font-bold text-rose-400" dir="rtl">
                            {selectedPattern.id === 'form10_verb' ? "اِسْتَفْعِلْ" : (selectedPattern.id === 'form4_verb' ? "أَفْعِلْ" : (selectedPattern.id === 'form2_verb' ? "فَعِّلْ" : labResult.word + "ْ"))}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[10px] opacity-75">Form Command Template</td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr className="hover:bg-current/5 transition-colors">
                          <td className="py-3 px-3 font-semibold">Ism al-Fā'il (Ism Performer)</td>
                          <td className="py-3 px-3 opacity-80">The active actor who embodies the action</td>
                          <td className="py-3 px-3 text-right font-serif text-lg font-bold text-amber-500" dir="rtl">
                            {SUBSTITUTION_MATRIX["active_participle"]?.[activeLabRoot.transliteration]?.word || "كَاتِب"}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[10px] opacity-75">Fā'il (فَاعِل) Form</td>
                        </tr>
                        <tr className="hover:bg-current/5 transition-colors">
                          <td className="py-3 px-3 font-semibold">Ism al-Maf'ūl (Passive Object)</td>
                          <td className="py-3 px-3 opacity-80">The recipient entity that receives the action</td>
                          <td className="py-3 px-3 text-right font-serif text-lg font-bold text-teal-400" dir="rtl">
                            {SUBSTITUTION_MATRIX["passive_participle"]?.[activeLabRoot.transliteration]?.word || "مَكْتُوب"}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[10px] opacity-75">Maf'ūl (مَفْعُول) Form</td>
                        </tr>
                        <tr className="hover:bg-current/5 transition-colors">
                          <td className="py-3 px-3 font-semibold">Ism al-Makān (Locative Place)</td>
                          <td className="py-3 px-3 opacity-80">The physical room, workspace or location</td>
                          <td className="py-3 px-3 text-right font-serif text-lg font-bold text-rose-400" dir="rtl">
                            {SUBSTITUTION_MATRIX["noun_of_place"]?.[activeLabRoot.transliteration]?.word || "مَكْتَب"}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[10px] opacity-75">Maf'al (مَفْعَل) Form</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMatrixTab === 'pronouns' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-fadeIn">
              {/* Pronoun Map Information Column (Left) */}
              <div className="lg:col-span-4 p-5 rounded-xl border border-current/5 bg-current/5 flex flex-col justify-between space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Pronoun & Gender Paradigm
                  </h5>
                  <p className="text-xs mt-2.5 leading-relaxed font-sans">
                    Classical Arabic strictly tracks **Pronoun Persons** (First, Second, and Third Person) 
                    and **Genders** (Masculine/Male and Feminine/Female). 
                    While First Person is gender-neutral, Second and Third Person templates mandate unique prefixes and suffixes for Male vs. Female subjects.
                  </p>
                </div>

                <div className="p-3 bg-black/10 rounded-lg text-[11px] space-y-1.5 border border-current/5">
                  <div className="font-bold">Subject Categories:</div>
                  <div className="grid grid-cols-2 gap-1 text-[10px] font-mono opacity-80">
                    <div>• 1st Person: I & We</div>
                    <div>• 2nd Person: You (M/F)</div>
                    <div>• 3rd Person: He & She</div>
                    <div>• Plural: They & You-All</div>
                  </div>
                </div>
              </div>

              {/* Pronouns breakdown table (Right) */}
              <div className="lg:col-span-8 p-1.5 rounded-xl border border-current/10 bg-current/5 overflow-hidden">
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead>
                    <tr className={`border-b border-current/10 ${isParchment ? 'text-[#8c6239]' : 'text-indigo-300'}`}>
                      <th className="py-2.5 px-3">Subject Pronoun</th>
                      <th className="py-2.5 px-3">Gender / Person Details</th>
                      <th className="py-2.5 px-3 text-right">Formed Output</th>
                      <th className="py-2.5 px-3 text-right">Morphology Rule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/5">
                    {/* First Person */}
                    <tr className="hover:bg-current/5 transition-colors">
                      <td className="py-2.5 px-3 font-semibold">أَنَا (Anā - I)</td>
                      <td className="py-2.5 px-3 opacity-75">1st Person / Singular (Gender-Neutral)</td>
                      <td className="py-2.5 px-3 text-right font-serif text-lg font-bold text-amber-500" dir="rtl">
                        {selectedPattern.category === 'verb'
                          ? labResult.word + "تُ" 
                          : labResult.word + "ٌ"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[10px] opacity-75">
                        {selectedPattern.category === 'verb' ? "Suffixed -Tu" : "Nominative Base"}
                      </td>
                    </tr>
                    
                    {/* Second Person Male */}
                    <tr className="hover:bg-current/5 transition-colors">
                      <td className="py-2.5 px-3 font-semibold">أَنْتَ (Anta - You M.)</td>
                      <td className="py-2.5 px-3 opacity-75">2nd Person / Singular Masculine</td>
                      <td className="py-2.5 px-3 text-right font-serif text-lg font-bold text-emerald-400" dir="rtl">
                        {selectedPattern.category === 'verb'
                          ? labResult.word + "تَ" 
                          : labResult.word + "َ الْخِطَاب"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[10px] opacity-75">
                        {selectedPattern.category === 'verb' ? "Suffixed -Ta" : "Subjective Case"}
                      </td>
                    </tr>

                    {/* Second Person Female */}
                    <tr className="hover:bg-current/5 transition-colors">
                      <td className="py-2.5 px-3 font-semibold">أَنْتِ (Anti - You F.)</td>
                      <td className="py-2.5 px-3 opacity-75">2nd Person / Singular Feminine</td>
                      <td className="py-2.5 px-3 text-right font-serif text-lg font-bold text-pink-400" dir="rtl">
                        {selectedPattern.category === 'verb'
                          ? labResult.word + "تِ" 
                          : labResult.word + "َة"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[10px] opacity-75">
                        {selectedPattern.category === 'verb' ? "Suffixed -Ti" : "Suffixed Feminine Ta"}
                      </td>
                    </tr>

                    {/* Third Person Male */}
                    <tr className="hover:bg-current/5 transition-colors">
                      <td className="py-2.5 px-3 font-semibold">هُوَ (Huwa - He / It)</td>
                      <td className="py-2.5 px-3 opacity-75">3rd Person / Singular Masculine Base</td>
                      <td className="py-2.5 px-3 text-right font-serif text-lg font-bold text-amber-500" dir="rtl">{labResult.word}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-[10px] opacity-75">Absolute Root Form</td>
                    </tr>

                    {/* Third Person Female */}
                    <tr className="hover:bg-current/5 transition-colors">
                      <td className="py-2.5 px-3 font-semibold">هِيَ (Hiya - She / It)</td>
                      <td className="py-2.5 px-3 opacity-75">3rd Person / Singular Feminine</td>
                      <td className="py-2.5 px-3 text-right font-serif text-lg font-bold text-pink-400" dir="rtl">
                        {selectedPattern.category === 'verb'
                          ? labResult.word + "تْ" 
                          : labResult.word + "َةٌ"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[10px] opacity-75">
                        {selectedPattern.category === 'verb' ? "Suffixed -at (Silent Ta)" : "Feminine Ending"}
                      </td>
                    </tr>

                    {/* Plural They */}
                    <tr className="hover:bg-current/5 transition-colors">
                      <td className="py-2.5 px-3 font-semibold">هُمْ (Hum - They Plural)</td>
                      <td className="py-2.5 px-3 opacity-75">3rd Person / Plural Masculine</td>
                      <td className="py-2.5 px-3 text-right font-serif text-lg font-bold text-indigo-400" dir="rtl">
                        {selectedPattern.category === 'verb'
                          ? labResult.word + "وا" 
                          : labResult.word + "ُونَ"}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[10px] opacity-75">
                        {selectedPattern.category === 'verb' ? "Prolongal Waw Al-Jama'ah" : "Plural Suffix -ūna"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeMatrixTab === 'numbers' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-fadeIn">
              {/* Number Map Column (Left) */}
              <div className="lg:col-span-4 p-5 rounded-xl border border-current/5 bg-current/5 flex flex-col justify-between space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                    <Hash className="w-3.5 h-3.5" /> Singular, Dual & Plural Numbering
                  </h5>
                  <p className="text-xs mt-2.5 leading-relaxed font-sans">
                    Unlike modern systems which separate only singular and plural, Classical Arabic features three precise number classes:
                    <strong>Singular (واحد/مفرد)</strong> for exactly 1 item, 
                    <strong>Dual (مثنى)</strong> for exactly 2 items, and 
                    <strong>Plural (جمع)</strong> for 3 or more elements.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-black/10 border border-current/5 text-[11px] space-y-1">
                  <span className="font-semibold block text-current">Number Suffix Keys:</span>
                  <div className="space-y-1 opacity-80 font-mono text-[10px]">
                    <div>• Singular: Basic template vowel.</div>
                    <div>• Dual: Ends in -ān (ـانِ) or -ayn (ـَيْنِ).</div>
                    <div>• Plural M: Ends in -ūn (ـُونَ) or -īn (ـِينَ).</div>
                    <div>• Plural F: Ends in -āt (ـَاتٌ).</div>
                  </div>
                </div>
              </div>

              {/* Number paradigm table (Right) */}
              <div className="lg:col-span-8 p-1.5 rounded-xl border border-current/10 bg-current/5 overflow-hidden">
                <table className="w-full text-left text-xs font-sans border-collapse">
                  <thead>
                    <tr className={`border-b border-current/10 ${isParchment ? 'text-[#8c6239]' : 'text-indigo-300'}`}>
                      <th className="py-2.5 px-3">Number Category</th>
                      <th className="py-2.5 px-3">Quantity Context</th>
                      <th className="py-2.5 px-3 text-right">Formed Word (Subscribed)</th>
                      <th className="py-2.5 px-3 text-right">Grammar Mark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/5">
                    {/* Singular */}
                    <tr className="hover:bg-current/5 transition-colors">
                      <td className="py-3 px-3 font-semibold">Singular (المفرد)</td>
                      <td className="py-3 px-3 opacity-85">Refers to exactly one person or object</td>
                      <td className="py-3 px-3 text-right font-serif text-lg font-bold text-amber-500" dir="rtl">
                        {labResult.word}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[10px] opacity-75">Base form</td>
                    </tr>

                    {/* Dual */}
                    <tr className="hover:bg-current/5 transition-colors">
                      <td className="py-3 px-3 font-semibold">Dual (المثنى)</td>
                      <td className="py-3 px-3 opacity-85">Refers to exactly two persons or objects</td>
                      <td className="py-3 px-3 text-right font-serif text-lg font-bold text-teal-400" dir="rtl">
                        {selectedPattern.category === 'verb'
                          ? labResult.word + "ا" 
                          : labResult.word + "َانِ"}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[10px] opacity-75">
                        {selectedPattern.category === 'verb' ? "Alif of Dual (ـا)" : "Suffix -āni (ـانِ)"}
                      </td>
                    </tr>

                    {/* Plural Masculine */}
                    <tr className="hover:bg-current/5 transition-colors">
                      <td className="py-3 px-3 font-semibold">Sound Plural Masculine (الجمع مذكر)</td>
                      <td className="py-3 px-3 opacity-85">Refers to 3+ male/mixed persons or objects</td>
                      <td className="py-3 px-3 text-right font-serif text-lg font-bold text-indigo-400" dir="rtl">
                        {selectedPattern.category === 'verb'
                          ? labResult.word + "وا" 
                          : labResult.word + "ُونَ"}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[10px] opacity-75">
                        {selectedPattern.category === 'verb' ? "Waw Plural (ـوا)" : "Suffix -ūna (ـُونَ)"}
                      </td>
                    </tr>

                    {/* Plural Feminine */}
                    <tr className="hover:bg-current/5 transition-colors">
                      <td className="py-3 px-3 font-semibold">Sound Plural Feminine (الجمع مؤنث)</td>
                      <td className="py-3 px-3 opacity-85">Refers to 3+ distinct female persons or objects</td>
                      <td className="py-3 px-3 text-right font-serif text-lg font-bold text-pink-400" dir="rtl">
                        {selectedPattern.category === 'verb'
                          ? labResult.word + "ْنَ" 
                          : labResult.word + "َاتٌ"}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-[10px] opacity-75">
                        {selectedPattern.category === 'verb' ? "Noon an-Niswah (ـنَ)" : "Suffix -ātun (ـَاتٌ)"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Help tips annotation */}
          <div className="p-3.5 bg-blue-500/5 rounded-xl border border-blue-500/15 flex items-start gap-2.5 text-xs text-blue-400">
            <Info className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Mizān Help & Grammatical Rules:</strong> The colorful final letters highlight the precise spelling mutations demanded by Arabic conjugation. Observe how Arabic words adapt perfectly under the three axes of grammar, allowing you to formulate over 72 derivations from a single three-letter root in the Quran!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
