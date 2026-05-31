import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  X, 
  Info, 
  TrendingUp, 
  Bookmark, 
  Library, 
  SlidersHorizontal,
  HelpCircle
} from 'lucide-react';
import { LayoutTheme } from '../types';

interface Flashcard {
  id: string;
  word: string;
  transliteration: string;
  meaning: string;
  wordType: "Ism" | "Fi'l" | "Harf";
  wazan: string; // The Pattern (e.g. Fā'il, Maf'ūl, etc.)
  root: string; // Root in spaced letters (e.g. ك - ت - ب)
  quranAyah: string; // Dynamic Arabic Quran fragment
  quranTranslation: string; // English translation of the Quranic scene
  reference: string; // Surah & Verse number (e.g. 2:183)
  explanation: string; // Morphological insight
}

interface RootDeck {
  rootName: string; // Spaced root letters (e.g. ك - ت - ب)
  transliteration: string; // Phonetic (e.g. K-T-B)
  coreMeaning: string; // Universal meaning
  cards: Flashcard[];
}

interface RootFlashcardsProps {
  theme: LayoutTheme;
  onSelectWord?: (word: string) => void;
}

const ROOT_DECKS: RootDeck[] = [
  {
    rootName: "ك - ت - ب",
    transliteration: "K-T-B",
    coreMeaning: "Writing, Prescribing, Recording Laws & Decrees",
    cards: [
      {
        id: "ktb-1",
        word: "كُتِبَ",
        transliteration: "Kutiba",
        meaning: "It was prescribed / ordained",
        wordType: "Fi'l",
        wazan: "Passive Perfect Verb (Fu'ila)",
        root: "ك - ت - ب",
        quranAyah: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ",
        quranTranslation: "O you who have believed, decreed upon you is fasting as it was decreed upon those before you...",
        reference: "Al-Baqarah (2:183)",
        explanation: "Form I passive verb. In Quranic syntax, represents binding legal or moral obligations initiated by Divine decree."
      },
      {
        id: "ktb-2",
        word: "كِتَابٌ",
        transliteration: "Kitāb",
        meaning: "Book, Scripture, Decree or Document",
        wordType: "Ism",
        wazan: "Noun of action/object (Fi'āl)",
        root: "ك - ت - ب",
        quranAyah: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
        quranTranslation: "This is the Book about which there is no doubt, a guidance for those conscious of Allah.",
        reference: "Al-Baqarah (2:2)",
        explanation: "Common noun representing completed legislation, written record of life, or a physical holy scripture."
      },
      {
        id: "ktb-3",
        word: "مَكْتُوبٌ",
        transliteration: "Maktūb",
        meaning: "Written, documented or prescribed",
        wordType: "Ism",
        wazan: "Passive Participle (Maf'ūl)",
        root: "ك - ت - ب",
        quranAyah: "الَّذِينَ يَتَّبِعُونَ الرَّسُولَ النَّبِيَّ الْأُمِّيَّ الَّذِي يَجِدُونَهُ مَكْتُوبًا عِندَهُمْ فِي التَّوْرَاةِ وَالْإِنجِيلِ",
        quranTranslation: "Those who follow the Messenger, the unlettered prophet, whom they find written [i.e., described] in what they have of the Torah and the Gospel...",
        reference: "Al-A'raf (7:157)",
        explanation: "Form I passive adjective denoting that which is registered in celestial registers, tablets, or terrestrial texts."
      },
      {
        id: "ktb-4",
        word: "يَكْتُبُونَ",
        transliteration: "Yaktubūna",
        meaning: "They write / record",
        wordType: "Fi'l",
        wazan: "Action Verb Plural (Yaf'ulūna)",
        root: "ك - ت - ب",
        quranAyah: "فَوَيْلٌ لِّلَّذِينَ يَكْتُبُونَ الْكِتَابَ بِأَيْدِيهِمْ ثُمَّ يَقُولُونَ هَٰذَا مِنْ عِندِ اللَّهِ",
        quranTranslation: "Woe to those who write the book with their hands, then say, 'This is from Allah'...",
        reference: "Al-Baqarah (2:79)",
        explanation: "Form I active imperfect third-person masculine plural verb showing ongoing human script-composition."
      }
    ]
  },
  {
    rootName: "ع - ل - م",
    transliteration: "A-L-M",
    coreMeaning: "Comprehension, Knowledge, Signs & Distinguishing Marks",
    cards: [
      {
        id: "alm-1",
        word: "عَلِمَ",
        transliteration: "Alima",
        meaning: "He knew / realized",
        wordType: "Fi'l",
        wazan: "Form I Past (Fa'ila)",
        root: "ع - ل - م",
        quranAyah: "عَلِمَ اللَّهُ أَنَّكُمْ سَتَذْكُرُونَهُنَّ وَلَٰكِن لَّا تُوَاعِدُوهُنَّ سِرًّا",
        quranTranslation: "Allah knows that you will remember them. But do not make a promise to them secretly...",
        reference: "Al-Baqarah (2:235)",
        explanation: "Basic Form I past tense active verb signifying instantaneous or complete cognitive awareness of truth."
      },
      {
        id: "alm-2",
        word: "عَالِمُ",
        transliteration: "Ālim",
        meaning: "Knower, possessing absolute knowledge",
        wordType: "Ism",
        wazan: "Active Participle (Fā'il)",
        root: "ع - ل - م",
        quranAyah: "عَالِمُ الْغَيْبِ وَالشَّهَادَةِ الْكَبِيرُ الْمُتَعَالِ",
        quranTranslation: "[He is] Knower of the unseen and the witnessed, the Grand, the Exalted.",
        reference: "Ar-Ra'd (13:9)",
        explanation: "Active agentive participle denoting an entity holding continuous and perfect mastery of science and perception."
      },
      {
        id: "alm-3",
        word: "عَلَّمَ",
        transliteration: "Allama",
        meaning: "He taught / instructed",
        wordType: "Fi'l",
        wazan: "Form II Intensive Past (Fa''ala)",
        root: "ع - ل - م",
        quranAyah: "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنسَانَ",
        quranTranslation: "The Most Merciful ۝ Taught the Quran ۝ Created man.",
        reference: "Ar-Rahman (55:1-3)",
        explanation: "Form II causative intensive past verb. The double middle letter denotes active systematic transmission of wisdom."
      },
      {
        id: "alm-4",
        word: "مَعْلُومٌ",
        transliteration: "Ma'lūm",
        meaning: "Known / designated",
        wordType: "Ism",
        wazan: "Passive Participle (Maf'ūl)",
        root: "ع - ل - م",
        quranAyah: "إِلَّا عَلَىٰ أَزْوَاجِهِمْ أَوْ مَا مَلَكَتْ أَيْمَانُهُمْ فَإِنَّهُمْ غَيْرُ مَلُومِينَ ۝ فَمَنِ ابْتَغَىٰ وَرَاءَ ذَٰلِكَ ... ۝ وَالَّذِينَ فِي أَمْوَالِهِمْ حَقٌّ مَّعْلُومٌ",
        quranTranslation: "...And those within whose wealth is a known right [for the petitioner and deprived].",
        reference: "Al-Ma'arij (70:24)",
        explanation: "Noun of passive direction. Signals structured, pre-agreed, or legally defined entities."
      }
    ]
  },
  {
    rootName: "خ - ل - ق",
    transliteration: "Kh-L-Q",
    coreMeaning: "Creation, Proportioning, Soft Fashioning & Measuring Out",
    cards: [
      {
        id: "xlq-1",
        word: "خَلَقَ",
        transliteration: "Khalaqa",
        meaning: "He created / proportioned",
        wordType: "Fi'l",
        wazan: "Form I Past (Fa'ala)",
        root: "خ - ل - ق",
        quranAyah: "خَلَقَ الْإِنسَانَ مِنْ عَقَلٍ ۝ اقْرَأْ وَرَبُّكَ الْأَكْرَمُ",
        quranTranslation: "Created man from a clinging substance. Recite, and your Lord is the most Generous.",
        reference: "Al-Alaq (96:2)",
        explanation: "Form I active past verb denoting bringing something into perfectly proportioned creation from nothingness."
      },
      {
        id: "xlq-2",
        word: "خَلْقٌ",
        transliteration: "Khalq",
        meaning: "Creation, constitution or structure",
        wordType: "Ism",
        wazan: "Verbal Noun (Fa'l)",
        root: "خ - ل - ق",
        quranAyah: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ",
        quranTranslation: "Indeed, in the creation of the heavens and the earth and the alternation of night and day are signs for those of understanding.",
        reference: "Ali 'Imran (3:190)",
        explanation: "Abstract noun/masdar summarizing the physical structure, order, and overall outcome of creative processes."
      },
      {
        id: "xlq-3",
        word: "خَلَّاقٌ",
        transliteration: "Khallāq",
        meaning: "The Supreme Creator / Perpetual Maker",
        wordType: "Ism",
        wazan: "Intense Constant Attribute (Fa''āl)",
        root: "خ - ل - ق",
        quranAyah: "إِنَّ رَبَّكَ هُوَ الْخَلَّاقُ الْعَلِيمُ",
        quranTranslation: "Indeed, your Lord - He is the Supreme Creator, the Knower.",
        reference: "Al-Hijr (15:86)",
        explanation: "Form of supreme hyperbole representing an entity that creates constantly, perfectly, and limitlessly."
      },
      {
        id: "xlq-4",
        word: "خَالِقٌ",
        transliteration: "Khāliq",
        meaning: "Creator / Original Designer",
        wordType: "Ism",
        wazan: "Active Participle (Fā'il)",
        root: "خ - ل - ق",
        quranAyah: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ",
        quranTranslation: "He is Allah, the Creator, the Inventor, the Fashioner; to Him belong the best names.",
        reference: "Al-Hashr (59:24)",
        explanation: "Active agentive noun indicating origin agency. Signifies measuring out the initial exact geometric blueprint."
      }
    ]
  },
  {
    rootName: "ر - ح - م",
    transliteration: "R-H-M",
    coreMeaning: "Maternal Compassion, Womb, Loving Protection & Mercy",
    cards: [
      {
        id: "rhm-1",
        word: "الرَّحْمَٰنِ",
        transliteration: "Ar-Raḥmān",
        meaning: "The All-Merciful (Immediate & Boundless)",
        wordType: "Ism",
        wazan: "Noun of extreme state (Fa'lān)",
        root: "ر - ح - م",
        quranAyah: "الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ",
        quranTranslation: "The Entirely Merciful, the Especially Merciful, Sovereign of the Day of Recompense.",
        reference: "Al-Fatihah (1:3)",
        explanation: "Intense grammatical structure showing immediately active, global, unconditional compassion covering all life."
      },
      {
        id: "rhm-2",
        word: "الرَّحِيمِ",
        transliteration: "Ar-Raḥīm",
        meaning: "The Especially Merciful (Sustained & Targeted)",
        wordType: "Ism",
        wazan: "Constant Epithet (Fa'īl)",
        root: "ر - ح - م",
        quranAyah: "هُوَ الَّذِي يُصَلِّي عَلَيْكُمْ وَمَلَائِكَتُهُ لِيُخْرِجَكُم مِّنَ الظُّلُمَاتِ إِلَى النُّورِ ۚ وَكَانَ بِالْمُؤْمِنِينَ رَحِيمًا",
        quranTranslation: "He is who performs blessings upon you... to extract you from darkness into light. And He is to believers especially Merciful.",
        reference: "Al-Ahzab (33:43)",
        explanation: "Steady qualitative noun. Contrasting with Rahman, Rahim represents continuous, targeted, and everlasting mercy."
      },
      {
        id: "rhm-3",
        word: "رَحْمَةٌ",
        transliteration: "Raḥmah",
        meaning: "tenderness, divine grace or maternal mercy",
        wordType: "Ism",
        wazan: "Single instance/state noun (Fa'lah)",
        root: "ر - ح - م",
        quranAyah: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
        quranTranslation: "And of His signs is that He created for you spouses so you may find tranquility, and placed between you affection and mercy.",
        reference: "Ar-Rum (30:21)",
        explanation: "General noun signifying divine software of connection, security, shield, protective relief, and comfort."
      },
      {
        id: "rhm-4",
        word: "أَرْحَامٌ",
        transliteration: "Arḥām",
        meaning: "Wombs (Kindred ties/relational blood lines)",
        wordType: "Ism",
        wazan: "Plural noun (Af'āl)",
        root: "ر - ح - م",
        quranAyah: "يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ ... وَاتَّقُوا اللَّهَ الَّذِي تَسَاءَلُونَ بِهِ وَالْأَرْحَامَ",
        quranTranslation: "...And fear Allah, through whom you ask one another, and keep kindred ties of the wombs.",
        reference: "An-Nisa (4:1)",
        explanation: "Broken plural of Rahim (womb). Represents maternal sanctuary, symbolizing kinship duties under natural law."
      }
    ]
  },
  {
    rootName: "س - ج - د",
    transliteration: "S-J-D",
    coreMeaning: "Prostrating, Face on Ground, Lowly Wholesome Submission",
    cards: [
      {
        id: "sjd-1",
        word: "سَجَدَ",
        transliteration: "Sajada",
        meaning: "He prostrated / bowed directly to earth",
        wordType: "Fi'l",
        wazan: "Form I Past (Fa'ala)",
        root: "س - ج - د",
        quranAyah: "وَإِذْ قُلْنَا لِلْمَلَائِكَةِ اسْجُدُوا لِآدَمَ فَسَجَدُوا إِلَّا إِبْلِيسَ أَبَىٰ وَاسْتَكْبَرَ",
        quranTranslation: "And [mention] when We said to the angels, 'Prostrate before Adam'; so they prostrated except Iblees. He refused...",
        reference: "Al-Baqarah (2:34)",
        explanation: "Form I base past tense verb indicating physical, full-body surrender by placing the forehead on the earth."
      },
      {
        id: "sjd-2",
        word: "مَسْجِدٌ",
        transliteration: "Masjid",
        meaning: "Place of humble prostration",
        wordType: "Ism",
        wazan: "Noun of Location (Maf'il)",
        root: "س - ج - د",
        quranAyah: "سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى",
        quranTranslation: "Exalted is He who took His Servant by night from the Sacred Mosque (al-Masjid al-Haram) to the Furthest Mosque (al-Masjid al-Aqsa)...",
        reference: "Al-Isra (17:1)",
        explanation: "Structural location noun pointing to physical spaces where bowing commands are collectively regularized."
      },
      {
        id: "sjd-3",
        word: "سُجَّدًا",
        transliteration: "Sujjadan",
        meaning: "Prostrating (many/plural state)",
        wordType: "Ism",
        wazan: "Intense Plural Pattern (Fu''alan)",
        root: "س - ج - د",
        quranAyah: "وَعَهِدْنَا إِلَىٰ إِبْرَاهِيمَ وَإِسْمَاعِيلَ أَن طَهِّرَا بَيْتِيَ لِلطَّائِفِينَ وَالْعَاكِفِينَ وَالرُّكَّعِ السُّجُودِ",
        quranTranslation: "...And We charged Abraham and Ishmael, saying, 'Purify My House for those who perform Tawaf, those who seclude themselves, and those who bow and prostrate.'",
        reference: "Al-Baqarah (2:125)",
        explanation: "Grammatical plural descriptor showing collective physical state of prostration in direct worship."
      },
      {
        id: "sjd-4",
        word: "مَسَاجِدُ",
        transliteration: "Masājid",
        meaning: "Spaces assigned for prayers / mosques",
        wordType: "Ism",
        wazan: "Plural Noun of Place (Mafā'il)",
        root: "س - ج - د",
        quranAyah: "وَأَنَّ الْمَسَاجِدَ لِلَّهِ فَلَا تَدْعُوا مَعَ اللَّهِ أَحَدًا",
        quranTranslation: "And [revealed] that the places of prostration/mosques are for Allah, so do not invoke anyone with Allah.",
        reference: "Al-Jinn (72:18)",
        explanation: "Broken plural noun representing institutionalized venues of absolute monotheism."
      }
    ]
  },
  {
    rootName: "غ - ف - ر",
    transliteration: "Gh-F-R",
    coreMeaning: "Veiling, Shielding, Covering Faults & Protecting from Harm",
    cards: [
      {
        id: "gfr-1",
        word: "غَفَرَ",
        transliteration: "Ghafara",
        meaning: "He covered / forgave a deficiency",
        wordType: "Fi'l",
        wazan: "Form I Past (Fa'ala)",
        root: "غ - ف - ر",
        quranAyah: "قَالَ رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي فَغَفَرَ لَهُ ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ",
        quranTranslation: "He said, 'My Lord, indeed I have wronged myself, so forgive me,' and He forgave him. Indeed, He is the Forgiving, the Merciful.",
        reference: "Al-Qasas (28:16)",
        explanation: "Form I action verb. Literally translates as 'He placed a protective veil/armor over a structural crack'."
      },
      {
        id: "gfr-2",
        word: "مَغْفِرَةٌ",
        transliteration: "Maghfirah",
        meaning: "Forgiveness / Shielding protective envelope",
        wordType: "Ism",
        wazan: "Action Source Noun (Maf'ilah)",
        root: "غ - ف - ر",
        quranAyah: "سَابِقُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ وَجَنَّةٍ عَرْضُهَا كَعَرْضِ السَّمَاءِ وَالْأَرْضِ",
        quranTranslation: "Race toward forgiveness from your Lord and a Garden whose width is like the width of the sky and the earth...",
        reference: "Al-Hadid (57:21)",
        explanation: "Substantive noun indicating complete cancellation of toxic records and placement of divine protective armor."
      },
      {
        id: "gfr-3",
        word: "الْغَفَّارُ",
        transliteration: "Al-Ghaffār",
        meaning: "The Repeatedly Forgiving",
        wordType: "Ism",
        wazan: "Extreme Hyperbole (Fa''āl)",
        root: "غ - ف - ر",
        quranAyah: "فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ إِنَّهُ كَانَ غَفَّارًا ۝ يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَارًا",
        quranTranslation: "And I said, 'Ask forgiveness of your Lord. Indeed, He is ever a perpetual source of forgiveness.'",
        reference: "Nuh (71:10-11)",
        explanation: "Intense active epithet indicating one who continuously covers failures multiple times without exhaustion."
      },
      {
        id: "gfr-4",
        word: "اسْتَغْفِرْ",
        transliteration: "Istaghfir",
        meaning: "Seek forgiveness! (Beg to be covered)",
        wordType: "Fi'l",
        wazan: "Form X Imperative Request (Istaf'il)",
        root: "غ - ف - ر",
        quranAyah: "فَاصْبِرْ إِنَّ وَعْدَ اللَّهِ حَقٌّ وَاسْتَغْفِرْ لِذَنبِكَ وَسَبِّحْ بِحَمْدِ رَبِّكَ بِالْعَشِيِّ وَالْإِبْكَارِ",
        quranTranslation: "So be patient. Indeed, the promise of Allah is truth. And ask forgiveness for your sin and exalt with praise...",
        reference: "Ghafir (40:55)",
        explanation: "Form X (seeking form). Prefixes 'Ista' to ask, request, or actively pull the protective coverage of Ghafr."
      }
    ]
  },
  {
    rootName: "ن - ص - ر",
    transliteration: "N-S-R",
    coreMeaning: "Assisting to Victory, Championing, Supporting & Defending",
    cards: [
      {
        id: "nsr-1",
        word: "نَصَرَ",
        transliteration: "Nasara",
        meaning: "He aided / gave victory",
        wordType: "Fi'l",
        wazan: "Form I Past (Fa'ala)",
        root: "ن - ص - ر",
        quranAyah: "وَلَقَدْ نَصَرَكُمُ اللَّه بِبَدْرٍ وَأَنتُمْ أَذِلَّةٌ ۖ فَاتَّقُوا اللَّهَ لَعَلَّكُمْ تَشْكُرُونَ",
        quranTranslation: "And Allah had already given you victory at [the battle of] Badr while you were few in number...",
        reference: "Ali 'Imran (3:123)",
        explanation: "Basic Form I past active verb representing direct defensive intervention or granting overwhelming conquest."
      },
      {
        id: "nsr-2",
        word: "نَصْرُ",
        transliteration: "Nasr",
        meaning: "Victory, support or dynamic championing",
        wordType: "Ism",
        wazan: "Verbal Noun (Fa'l)",
        root: "ن - ص - ر",
        quranAyah: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ",
        quranTranslation: "When the victory of Allah has come and the conquest...",
        reference: "An-Nasr (110:1)",
        explanation: "The act of supportive intervention; yields ultimate triumph and breakthrough during deep distress."
      },
      {
        id: "nsr-3",
        word: "أَنصَارِ",
        transliteration: "Ansār",
        meaning: "Helpers / Dedicated defenders",
        wordType: "Ism",
        wazan: "Plural Noun (Af'āl)",
        root: "ن - ص - ر",
        quranAyah: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا أَنصَارَ اللَّهِ كَمَا قَالَ عِيسَى ابْنُ مَرْيَمَ لِلْحَوَارِيِّينَ مَنْ أَنصَارِي إِلَى اللَّهِ",
        quranTranslation: "O you who have believed, be supporters of Allah, as Jesus, the son of Mary, said to the disciples, 'Who are my supporters for Allah?'",
        reference: "As-Saff (61:14)",
        explanation: "Plural noun. Refers to allies who physically shelter and champion a vulnerable message."
      },
      {
        id: "nsr-4",
        word: "مَنصُورًا",
        transliteration: "Manṣūran",
        meaning: "Made victorious / supported by help",
        wordType: "Ism",
        wazan: "Passive Participle (Maf'ūl)",
        root: "ن - ص - ر",
        quranAyah: "وَلَا تَقْتُلُوا النَّفْسَ الَّتِي حَرَّمَ اللَّهُ إِلَّا بِالْحَقِّ ۗ وَمَن قُتِلَ مَظْلُومًا فَقَدْ جَعَلْنَا لِوَلِيِّهِ سُلْطَانًا فَلَا يُسْرِف فِّي الْقَتْلِ ۖ إِنَّهُ كَانَ مَنصُورًا",
        quranTranslation: "...And whoever is killed unjustly - We have given his heir authority... Indeed, he is helped [by Allah's law].",
        reference: "Al-Isra (17:33)",
        explanation: "Object noun. Refers to a victim of oppression promised ultimate victory and defense under cosmic justice."
      }
    ]
  },
  {
    rootName: "ض - ر - ب",
    transliteration: "D-R-B",
    coreMeaning: "Striking, Stamping, Journeying/Traveling & Projecting Analogies",
    cards: [
      {
        id: "drb-1",
        word: "ضَرَبَ",
        transliteration: "Daraba",
        meaning: "He set forth / coined / struck",
        wordType: "Fi'l",
        wazan: "Form I Past (Fa'ala)",
        root: "ض - ر - ب",
        quranAyah: "أَلَمْ تَرَ كَيْفَ ضَرَبَ اللَّهُ مَثَلًا كَلِمَةً طَيِّبَةً كَشَجَرَةٍ طَيِّبَةٍ أَصْلُهَا ثَابِتٌ وَفَرْعُهَا فِي السَّمَاءِ",
        quranTranslation: "Have you not considered how Allah presents a comparison: a good word is like a good tree, whose root is firmly fixed and its branches high in the sky...",
        reference: "Ibrahim (14:24)",
        explanation: "Form I active verb representing planting an anchor, coining a dynamic metaphor, or physically journeying."
      },
      {
        id: "drb-2",
        word: "يَضْرِبُ",
        transliteration: "Yadribu",
        meaning: "He presenting / striking",
        wordType: "Fi'l",
        wazan: "Form I Present-Future (Yaf'ilu)",
        root: "ض - ر - ب",
        quranAyah: "كَذَٰلِكَ يَضْرِبُ اللَّهُ الْأَمْثَالَ",
        quranTranslation: "...Thus does Allah present comparisons (parables).",
        reference: "Ar-Ra'd (13:17)",
        explanation: "Active continuous imperfect verb demonstrating ongoing projection of analogies to explain reality."
      },
      {
        id: "drb-3",
        word: "فَاضْرِبُوا",
        transliteration: "Fadribū",
        meaning: "So strike! (plural command)",
        wordType: "Fi'l",
        wazan: "Imperative Command (Fa'ilū)",
        root: "ض - ر - ب",
        quranAyah: "إِذْ يُوحِي رَبُّكَ إِلَى الْمَلَائِكَةِ أَنِّي مَعَكُمْ فَثَبِّتُوا الَّذِينَ آمَنُوا ۚ سَأُلْقِي فِي قُلُوبِ الَّذِينَ كَفَرُوا الرُّعْبَ فَاضْرِبُوا فَوْقَ الْأَعْنَاقِ",
        quranTranslation: "So strike [them] upon the necks and strike from them every fingertip.",
        reference: "Al-Anfal (8:12)",
        explanation: "Plural masculine command showing rigorous localized action or impact."
      },
      {
        id: "drb-4",
        word: "ضَرْبًا",
        transliteration: "Darban",
        meaning: "Journeying / physical striking (verbal noun)",
        wordType: "Ism",
        wazan: "Verbal Noun (Fa'lan)",
        root: "ض - ر - ب",
        quranAyah: "لِلْفُقَرَاءِ الَّذِينَ أُحْصِرُوا فِي سَبِيلِ اللَّهِ لَا يَسْتَطِيعُونَ ضَرْبًا فِي الْأَرْضِ يَحْسَبُهُمُ الْجَاهِلُ أَغْنِيَاءَ",
        quranTranslation: "[Charity is] for the poor who have been restricted in the way of Allah, unable to move about [travel] in the land...",
        reference: "Al-Baqarah (2:273)",
        explanation: "Verbal action noun. Striking the earth with feet, signifying travel for trade, migration, or safety."
      }
    ]
  }
];

export default function RootFlashcards({ theme, onSelectWord }: RootFlashcardsProps) {
  // Navigation / Filter States
  const [selectedDeckIndex, setSelectedDeckIndex] = useState<number>(0);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reviewMode, setReviewMode] = useState<'study' | 'list'>('study'); // study = flashcard mode, list = review all correct answers
  
  // Progress Track storage (local persistence)
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('quranic_arabic_master_flashcards');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [reviewedIds, setReviewedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('quranic_arabic_reviewed_flashcards');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Keep track of session score
  const [streak, setStreak] = useState<number>(0);

  // Sync Mastered card IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quranic_arabic_master_flashcards', JSON.stringify(masteredIds));
    } catch (e) {
      console.error(e);
    }
  }, [masteredIds]);

  // Sync Reviewed card IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quranic_arabic_reviewed_flashcards', JSON.stringify(reviewedIds));
    } catch (e) {
      console.error(e);
    }
  }, [reviewedIds]);

  const activeDeck = ROOT_DECKS[selectedDeckIndex];
  const activeCard = activeDeck.cards[currentCardIndex];

  // Calculated properties
  const deckStats = useMemo(() => {
    const total = activeDeck.cards.length;
    const mastered = activeDeck.cards.filter(c => masteredIds.includes(c.id)).length;
    const reviewed = activeDeck.cards.filter(c => reviewedIds.includes(c.id)).length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { total, mastered, reviewed, percent };
  }, [activeDeck, masteredIds, reviewedIds]);

  const overallStats = useMemo(() => {
    const total = ROOT_DECKS.reduce((acc, d) => acc + d.cards.length, 0);
    const mastered = ROOT_DECKS.reduce((acc, d) => 
      acc + d.cards.filter(c => masteredIds.includes(c.id)).length, 0);
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { total, mastered, percent };
  }, [masteredIds]);

  // Handle deck selection
  const handleSelectDeck = (idx: number) => {
    setSelectedDeckIndex(idx);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  // Switch to next card
  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % activeDeck.cards.length);
    }, 150);
  };

  // Switch to previous card
  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + activeDeck.cards.length) % activeDeck.cards.length);
    }, 150);
  };

  // Evaluate knowledge: Mastered
  const handleMarkMastered = (cardId: string) => {
    if (!masteredIds.includes(cardId)) {
      setMasteredIds((prev) => [...prev, cardId]);
    }
    if (!reviewedIds.includes(cardId)) {
      setReviewedIds((prev) => [...prev, cardId]);
    }
    setStreak((prev) => prev + 1);
    
    // Auto advance if there are more cards
    if (currentCardIndex < activeDeck.cards.length - 1) {
      handleNextCard();
    } else {
      setIsFlipped(false);
    }
  };

  // Evaluate knowledge: Needs Review (Got wrong)
  const handleMarkReview = (cardId: string) => {
    setMasteredIds((prev) => prev.filter(id => id !== cardId));
    if (!reviewedIds.includes(cardId)) {
      setReviewedIds((prev) => [...prev, cardId]);
    }
    setStreak(0); // reset streak
    
    // Auto advance if there are more cards
    if (currentCardIndex < activeDeck.cards.length - 1) {
      handleNextCard();
    } else {
      setIsFlipped(false);
    }
  };

  // Reset entire deck progress
  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset your study analytics for this deck?")) {
      const activeIds = activeDeck.cards.map(c => c.id);
      setMasteredIds((prev) => prev.filter(id => !activeIds.includes(id)));
      setReviewedIds((prev) => prev.filter(id => !activeIds.includes(id)));
      setStreak(0);
      setCurrentCardIndex(0);
      setIsFlipped(false);
    }
  };

  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Layout color setups mapping the parental theme
  const getThemeClasses = () => {
    if (isParchment) {
      return {
        cardBg: "bg-[#faf6ed] border-[#a68c6d]/50 text-[#2c241e]",
        innerBg: "bg-[#ebd8c3]/40 border-[#a68c6d]/20",
        tabActive: "bg-[#8c6239] text-[#faf6ed] shadow-sm",
        tabInactive: "text-[#705e52] hover:bg-[#ebd8c3]/30 border-transparent",
        accentText: "text-[#8c6239]",
        accentBg: "bg-[#8c6239]/10 text-[#8c6239]",
        correctBtn: "bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-950/10",
        wrongBtn: "bg-[#2c241e]/15 hover:bg-[#2c241e]/25 text-[#2c241e] border-[#2c241e]/10",
        badgeIsm: "bg-blue-200/50 text-blue-900 border-blue-300/30",
        badgeFil: "bg-amber-200/50 text-amber-900 border-amber-300/30",
        badgeHarf: "bg-purple-200/50 text-purple-900 border-purple-300/30",
      };
    } else if (isCosmic) {
      return {
        cardBg: "bg-slate-900/40 border-indigo-500/30 text-indigo-50",
        innerBg: "bg-indigo-950/40 border-indigo-500/20",
        tabActive: "bg-pink-600 text-white shadow-lg shadow-pink-950/40 border-pink-500",
        tabInactive: "text-slate-400 hover:text-white hover:bg-white/5 border-transparent",
        accentText: "text-pink-400",
        accentBg: "bg-[#ec4899]/10 text-pink-400",
        correctBtn: "bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-950/20",
        wrongBtn: "bg-[#ffffff]/5 hover:bg-[#ffffff]/10 text-[#e2e8f0] border-[#ffffff]/10",
        badgeIsm: "bg-blue-950/50 text-blue-300 border-blue-500/20",
        badgeFil: "bg-amber-950/50 text-amber-300 border-amber-500/20",
        badgeHarf: "bg-purple-950/50 text-purple-300 border-purple-500/20",
      };
    } else {
      return {
        cardBg: "bg-slate-920/40 border-emerald-500/30 text-emerald-50",
        innerBg: "bg-emerald-950/20 border-emerald-500/10",
        tabActive: "bg-emerald-600 text-white shadow-lg shadow-emerald-500/10 border-emerald-500",
        tabInactive: "text-slate-400 hover:text-[#10b981] hover:bg-emerald-950/10 border-transparent",
        accentText: "text-[#10b981]",
        accentBg: "bg-emerald-500/10 text-emerald-400",
        correctBtn: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/25",
        wrongBtn: "bg-[#ffffff]/5 hover:bg-[#ffffff]/10 text-[#e2e8f0] border-slate-700/60",
        badgeIsm: "bg-blue-950/30 text-blue-300 border-blue-500/10",
        badgeFil: "bg-amber-950/30 text-amber-300 border-amber-500/10",
        badgeHarf: "bg-purple-950/30 text-purple-300 border-purple-500/10",
      };
    }
  };

  const style = getThemeClasses();

  return (
    <div className="space-y-6">
      
      {/* SECTION 1: Top Dashboard Header & Statistics */}
      <div className={`p-5 md:p-6 rounded-2xl border ${style.cardBg} transition-all shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${style.accentBg}`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold tracking-tight flex items-center gap-2">
                Quranic Root Flashcard System
              </h2>
              <p className="text-xs opacity-70 mt-0.5 leading-normal max-w-xl">
                Master classical Arabic morphology through root families. Flip cards to test grammatical translation and real usage in Quranic verses.
              </p>
            </div>
          </div>

          {/* Persistent Overall Progress Metrics */}
          <div className={`p-3.5 px-4 rounded-xl border ${style.innerBg} shrink-0 text-center md:text-right flex items-center justify-between md:flex-col gap-4 md:gap-1.5`}>
            <div className="text-left md:text-right">
              <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block">Overall Progress</span>
              <span className="text-xl font-black font-mono tracking-tight">{overallStats.mastered} <span className="text-xs opacity-50 font-normal">/ {overallStats.total} Mastered</span></span>
            </div>
            {/* Visual Mini Progress Bar */}
            <div className="w-24 md:w-32 bg-current/10 h-2 rounded-full overflow-hidden relative">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${overallStats.percent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Root Deck Selection List */}
        <div className="mt-5 pt-4 border-t border-current/10">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider opacity-60 block mb-3 flex items-center gap-1.5">
            <Library className="w-3.5 h-3.5" /> Select an Arabic Root Deck to study:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {ROOT_DECKS.map((deck, idx) => {
              const belongsSelected = selectedDeckIndex === idx;
              const masteredCount = deck.cards.filter(c => masteredIds.includes(c.id)).length;
              const isDeckComplete = masteredCount === deck.cards.length;

              return (
                <button
                  key={`deck-selector-${idx}`}
                  onClick={() => handleSelectDeck(idx)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer relative flex flex-col justify-center items-center ${
                    belongsSelected 
                      ? style.tabActive + " ring-1 ring-current/20 scale-[1.02]" 
                      : `border-current/10 hover:bg-current/5 ${isParchment ? 'text-[#2c241e]' : 'text-slate-300'}`
                  }`}
                >
                  <span className="font-serif text-base font-bold whitespace-nowrap">{deck.rootName}</span>
                  <span className="text-[10px] font-mono opacity-60 block mt-0.5">{deck.transliteration}</span>
                  
                  {/* Mastered Fraction indicator */}
                  <div className={`mt-1.5 text-[8px] font-mono p-0.5 px-1.5 rounded-full ${
                    belongsSelected 
                      ? 'bg-black/20 text-white' 
                      : isDeckComplete 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-current/10 text-current'
                  }`}>
                    {masteredCount}/{deck.cards.length}
                  </div>

                  {/* Complete checkmark */}
                  {isDeckComplete && (
                    <span className="absolute top-1 right-1 text-emerald-500" title="Deck mastered!">
                      <CheckCircle2 className="w-3 h-3 fill-current stroke-white dark:stroke-slate-900" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: Selection Study Modes Tab switch */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex bg-current/5 border border-current/10 p-1.5 rounded-2xl w-max gap-1">
          <button
            onClick={() => { setReviewMode('study'); setIsFlipped(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              reviewMode === 'study' ? style.tabActive : style.tabInactive
            }`}
          >
            <Sparkles className="w-4 h-4" /> Active Study Session
          </button>
          <button
            onClick={() => setReviewMode('list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              reviewMode === 'list' ? style.tabActive : style.tabInactive
            }`}
          >
            <BookOpen className="w-4 h-4" /> List Overview & Answers
          </button>
        </div>

        {/* Current Deck Quick Level Stat */}
        <div className="hidden sm:flex items-center gap-2.5 text-xs font-mono opacity-80">
          <span>Deck Level:</span>
          <span className={`p-1 px-2.5 rounded font-bold ${style.accentBg}`}>
            {deckStats.percent === 100 ? "⭐️ Mastered" : deckStats.percent >= 50 ? "📈 Progressing" : "📖 Beginner"}
          </span>
        </div>
      </div>

      {/* SECTION 3: Main Render Board */}
      <div className="w-full">
        {reviewMode === 'study' ? (
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* The Flashcard wrapper container */}
            <div className="relative min-h-[420px] md:min-h-[450px] w-full perspective-1000">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={`card-${activeCard.id}-${isFlipped}`}
                  initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`w-full min-h-[420px] md:min-h-[450px] rounded-3xl border p-6 md:p-8 flex flex-col justify-between cursor-pointer select-none shadow-xl transform-style-3d relative transition-all duration-300 hover:shadow-2xl hover:border-current/30 ${
                    style.cardBg
                  }`}
                >
                  {/* Decorative card side indicators */}
                  <div className="absolute top-4 right-4 text-[10px] font-mono opacity-40 flex items-center gap-1 uppercase tracking-widest bg-current/5 p-1 px-2.5 rounded-lg border border-current/5">
                    {isFlipped ? "Back: Meaning & Detail" : "Front: Recite Word"}
                  </div>

                  {/* Top card description meta */}
                  <div className="flex items-center gap-3 w-full pb-3 border-b border-current/10">
                    <div className="text-left">
                      <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block">Root Coordination Coordinates</span>
                      <span className="text-base font-bold font-serif">{activeCard.root} <span className="font-sans font-normal text-xs opacity-50">({activeDeck.transliteration})</span></span>
                    </div>
                  </div>

                  {/* Main Centered Content */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                    {!isFlipped ? (
                      // FRONT SIDE
                      <div className="space-y-4 w-full">
                        <span className="block text-6xl md:text-7xl font-bold font-serif leading-none tracking-normal drop-shadow text-current animate-pulse">
                          {activeCard.word}
                        </span>
                        <div>
                          <p className={`text-base font-serif font-bold ${style.accentText}`}>{activeCard.transliteration}</p>
                          <span className={`inline-block text-[9px] uppercase font-bold tracking-widest font-mono p-1 px-2.5 rounded-full mt-2.5 border ${
                            activeCard.wordType === "Ism" ? style.badgeIsm : activeCard.wordType === "Fi'l" ? style.badgeFil : style.badgeHarf
                          }`}>
                            {activeCard.wordType} / {activeCard.wazan}
                          </span>
                        </div>
                        <p className="text-xs opacity-50 italic font-mono pt-4">Tautologically, can you translate this word? click to reveal translation.</p>
                      </div>
                    ) : (
                      // BACK SIDE (EXPLANATION & CORRECT ANSWERS)
                      <div className="space-y-4 w-full text-left">
                        {/* Word Meaning Translation badge */}
                        <div className={`p-4 rounded-xl text-center border ${style.innerBg}`}>
                          <span className="block text-[10px] font-mono opacity-50 uppercase tracking-widest mb-1">UNIVERSAL ARABIC MEANING</span>
                          <span className="text-xl md:text-2xl font-black italic block">
                            {activeCard.meaning}
                          </span>
                        </div>

                        {/* Morphological Breakdown context specs */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-current/5 border border-current/5 rounded-xl">
                            <span className="block text-[9px] font-mono opacity-50 uppercase mb-0.5">Grammar Aspect</span>
                            <span className="font-bold">{activeCard.wazan}</span>
                          </div>
                          <div className="p-2.5 bg-current/5 border border-current/5 rounded-xl">
                            <span className="block text-[9px] font-mono opacity-50 uppercase mb-0.5">Word Category</span>
                            <span className="font-bold">{activeCard.wordType} (Noun/Verb type)</span>
                          </div>
                        </div>

                        {/* Quranic Usage & Metaphor Context */}
                        <div className="border-t border-current/10 pt-3">
                          <span className="block text-[10px] font-mono opacity-50 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-bold">
                            <Bookmark className="w-3.5 h-3.5" /> Usage Occurrence in the Quran
                          </span>
                          <div className="space-y-2 p-3 rounded-lg bg-black/15 font-serif border border-current/5" dir="rtl">
                            <p className="text-base text-current/95 font-bold leading-relaxed text-right md:-text-lg">
                              "... {activeCard.quranAyah} ..."
                            </p>
                            <p className="text-xs italic leading-normal text-left opacity-80 mt-1 font-sans mt-2" dir="ltr">
                              "{activeCard.quranTranslation}"
                            </p>
                            <p className="text-[10px] font-mono opacity-50 text-left uppercase tracking-wider font-bold mt-1.5" dir="ltr">
                              {activeCard.reference} — morphological context model
                            </p>
                          </div>
                        </div>

                        {/* Direct Explanation */}
                        <div className="p-3 bg-[#10b981]/5 border border-[#10b981]/15 text-xs text-current/95 rounded-xl flex items-start gap-1.5 leading-relaxed font-sans">
                          <Info className={`w-4 h-4 shrink-0 mt-0.5 ${style.accentText}`} />
                          <p>{activeCard.explanation}</p>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Card bottom navigation or tap instructions */}
                  <div className="pt-3 border-t border-current/10 flex items-center justify-between text-xs text-current/60 font-mono">
                    <span>
                      Card {currentCardIndex + 1} of {activeDeck.cards.length}
                    </span>
                    <span className="font-sans italic">
                      Click anywhere on card to flip 🔄
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

            {/* SECTION 4: Feedback Evaluation & Memory actions */}
            <div className="p-4 rounded-2xl border border-current/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-center sm:text-left text-xs opacity-75 max-w-sm font-sans leading-normal">
                How did you perform? Marking <strong className="text-emerald-500 font-bold">"Mastered"</strong> persists progress, while <strong className="opacity-60">"Review"</strong> structures future iterations.
              </span>

              {/* Action Evaluators */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleMarkReview(activeCard.id)}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${style.wrongBtn}`}
                >
                  <X className="w-4 h-4 text-red-500 stroke-[2.5]" /> <span>Still Reviewing</span>
                </button>
                <button
                  onClick={() => handleMarkMastered(activeCard.id)}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold font-mono transition-all hover:scale-103 cursor-pointer ${style.correctBtn}`}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" /> <span>Got it right!</span>
                </button>
              </div>
            </div>

            {/* Deck control navigation row */}
            <div className="flex items-center justify-between gap-4 text-xs font-mono">
              <button
                onClick={handlePrevCard}
                className="p-2 px-3 rounded-xl border border-current/10 hover:bg-current/5 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> <span>Prev Card</span>
              </button>

              {/* Study Streak Display */}
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/15" title="Consecutive correct answers">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="font-bold">Streak: {streak}</span>
              </div>

              <button
                onClick={handleNextCard}
                className="p-2 px-3 rounded-xl border border-current/10 hover:bg-current/5 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Next Card</span> <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Progress anchor button */}
            <div className="text-center pt-2">
              <button
                onClick={handleResetProgress}
                type="button"
                className="text-[10px] font-mono uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-red-500 transition-all flex items-center gap-1.5 mx-auto"
              >
                <RotateCcw className="w-3 h-3" /> Reset study states for this deck
              </button>
            </div>

          </div>
        ) : (
          // LIST PREVIEW REVIEWER FOR CORRECT ANSWERS
          <div className={`p-5 md:p-6 rounded-2xl border ${style.cardBg} transition-all shadow-sm space-y-4`}>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-current/10 pb-4 gap-4">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Library className="w-5 h-5 text-emerald-500" /> Deck List: {activeDeck.rootName} ({activeDeck.transliteration}) Correct Answers
                </h3>
                <p className="text-xs opacity-60 mt-1">
                  Examine correct meanings, patterns (wazans), and scripture occurrences in a single overview. Perfect for final revisions.
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono opacity-50">Filter:</span>
                <span className="p-1 px-2 text-[10px] font-mono lowercase rounded border border-current/15 bg-current/5 font-bold text-current">
                  {deckStats.mastered} of {deckStats.total} mastered
                </span>
              </div>
            </div>

            {/* Cumulative Tabular Reviewer */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs leading-normal border-collapse">
                <thead>
                  <tr className="border-b border-current/15 opacity-70 text-[10px] uppercase font-mono tracking-wider">
                    <th className="py-2.5 px-3">Arabic Word</th>
                    <th className="py-2.5 px-3">Transliteration</th>
                    <th className="py-2.5 px-3">Word Type</th>
                    <th className="py-2.5 px-3">Wazan Pattern</th>
                    <th className="py-2.5 px-3">Immediate Arabic Meaning</th>
                    <th className="py-2.5 px-3">Quran Verse Code</th>
                    <th className="py-2.5 px-3 text-right">Mastery State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-current/5">
                  {activeDeck.cards.map((card, index) => {
                    const isCardMastered = masteredIds.includes(card.id);
                    
                    return (
                      <tr 
                        key={`list-row-${card.id}`} 
                        className={`hover:bg-current/5 transition-colors ${
                          isCardMastered ? 'bg-[#10b981]/5 text-current/95' : 'opacity-85'
                        }`}
                      >
                        {/* Word script */}
                        <td className="py-3 px-3 font-serif text-2xl font-bold font-serif" dir="rtl">
                          {card.word}
                        </td>
                        
                        {/* Transliteration */}
                        <td className="py-3 px-3 font-semibold">
                          {card.transliteration}
                        </td>
                        
                        {/* Word Category */}
                        <td className="py-3 px-3">
                          <span className={`inline-block text-[9px] uppercase font-bold tracking-widest font-mono p-0.5 px-2 rounded border ${
                            card.wordType === "Ism" ? style.badgeIsm : card.wordType === "Fi'l" ? style.badgeFil : style.badgeHarf
                          }`}>
                            {card.wordType}
                          </span>
                        </td>
                        
                        {/* Wazan morphology */}
                        <td className="py-3 px-3 italic opacity-85">
                          {card.wazan}
                        </td>
                        
                        {/* Meanings */}
                        <td className="py-3 px-3 font-bold">
                          {card.meaning}
                        </td>
                        
                        {/* Quran Reference */}
                        <td className="py-3 px-3">
                          <span className={`inline-block p-1 px-2 text-[10px] font-mono rounded bg-current/5 ${style.accentText}`}>
                            {card.reference}
                          </span>
                        </td>

                        {/* Mastery State indicators */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isCardMastered ? (
                              <div className="flex items-center gap-1 text-emerald-500 font-bold font-mono text-[10px]">
                                <CheckCircle2 className="w-4 h-4 fill-current stroke-white dark:stroke-slate-900" />
                                <span>Mastered</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-current/40 font-mono text-[10px]">
                                <HelpCircle className="w-4 h-4" />
                                <span>Studying</span>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Full Word Details expansion under directory table */}
            <div className="pt-4 border-t border-current/10 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 block font-bold">
                Detailed Quranic Usage & Metaphor Breakdown Reference (Scroll overview)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDeck.cards.map((c, i) => (
                  <div key={`detailed-card-ref-${c.id}`} className={`p-4 rounded-xl border ${style.innerBg} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-xl font-bold">{c.word} ({c.transliteration})</span>
                      <span className="text-[10px] font-mono opacity-50">{c.reference}</span>
                    </div>
                    <div className="p-3 bg-black/15 font-serif rounded border border-current/5 text-right" dir="rtl">
                      <span className="text-current/95 font-semibold text-sm leading-relaxed block mb-1">
                        "... {c.quranAyah} ..."
                      </span>
                      <span className="text-xs italic leading-normal text-left block opacity-80 font-sans mt-2" dir="ltr">
                        "{c.quranTranslation}"
                      </span>
                    </div>
                    <div className="text-xs leading-normal opacity-90 font-sans flex items-start gap-1">
                      <Info className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${style.accentText}`} />
                      <p><strong>Linguistic Note:</strong> {c.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
