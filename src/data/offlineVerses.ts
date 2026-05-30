export interface VerseWordBreakdown {
  word: string;
  transliteration: string;
  isIsmFail: boolean;
  isHarf: boolean;
  wordType: "Ism" | "Fi'l" | "Harf";
  root: string;
  meaning: string;
  explanation: string;
}

export interface VerseBreakdownData {
  surahName: string;
  surahNumber: number;
  verseNumber: number;
  fullVerseArabic: string;
  fullVerseTranslation: string;
  words: VerseWordBreakdown[];
}

export const OFFLINE_VERSES_MAP: Record<string, VerseBreakdownData> = {
  "1:1": {
    surahName: "Al-Fatihah",
    surahNumber: 1,
    verseNumber: 1,
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
  },
  "112:1": {
    surahName: "Al-Ikhlas",
    surahNumber: 112,
    verseNumber: 1,
    fullVerseArabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    fullVerseTranslation: "Say, 'He is Allah, [who is] One.'",
    words: [
      {
        word: "قُلْ",
        transliteration: "Qul",
        isIsmFail: false,
        isHarf: false,
        wordType: "Fi'l",
        root: "ق - و - ل",
        meaning: "Say! / Declares!",
        explanation: "Form I imperative active verb addressing the messenger to state the core truth."
      },
      {
        word: "هُوَ",
        transliteration: "Huwa",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "None",
        meaning: "He / It",
        explanation: "3rd person masculine singular detached personal pronoun."
      },
      {
        word: "اللَّهُ",
        transliteration: "Allāh",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "ء - ل - ه",
        meaning: "The Supreme Deity",
        explanation: "The majestic proper noun representing the One True God."
      },
      {
        word: "أَحَدٌ",
        transliteration: "Aḥadun",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "و - ح - د",
        meaning: "The Sole One",
        explanation: "Unique numerical description of absolute, indivisible oneness with root W-H-D."
      }
    ]
  },
  "103:1": {
    surahName: "Al-Asr",
    surahNumber: 103,
    verseNumber: 1,
    fullVerseArabic: "وَالْعَصْرِ",
    fullVerseTranslation: "By time / By declining daylight.",
    words: [
      {
        word: "وَ",
        transliteration: "Wa",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "By / Oath of",
        explanation: "Oathtaking particle (Waw al-Qasam) which functions as a preposition."
      },
      {
        word: "الْعَصْرِ",
        transliteration: "Al-Asr",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "ع - ص - ر",
        meaning: "The Declining Day / Era / Squeezing daylight",
        explanation: "Definite singular noun in genitive because of oathtaking (Waw). Root A-S-R means extraction/compression."
      }
    ]
  },
  "103:2": {
    surahName: "Al-Asr",
    surahNumber: 103,
    verseNumber: 2,
    fullVerseArabic: "إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ",
    fullVerseTranslation: "Indeed, mankind is in loss,",
    words: [
      {
        word: "إِنَّ",
        transliteration: "Inna",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "Indeed / For sure",
        explanation: "Emphatic structural particle of certainty (Harf tawkid) that places the noun in accusative case."
      },
      {
        word: "الْإِنْسَانَ",
        transliteration: "Al-Insān",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "ء - ن - س",
        meaning: "The Human Being / Mankind",
        explanation: "Definite collective noun inaccusative state, derived from root A-N-S denoting intimacy or sociability."
      },
      {
        word: "لَ",
        transliteration: "La",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "Surely / Truly",
        explanation: "Emphatic prefix particle (Lām al-Muzahlaqah) verifying the absolute status of loss."
      },
      {
        word: "فِي",
        transliteration: "Fī",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "In / Engulfed in",
        explanation: "Preposition particle of context and containment (Harf Jarr)."
      },
      {
        word: "خُسْرٍ",
        transliteration: "Khusrin",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "خ - س - ر",
        meaning: "Substantial loss / Ruin",
        explanation: "Indefinite singular noun in genitive representing absolute encompassing deficit."
      }
    ]
  },
  "2:255": {
    surahName: "Al-Baqarah",
    surahNumber: 2,
    verseNumber: 255,
    fullVerseArabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    fullVerseTranslation: "Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence.",
    words: [
      {
        word: "اللَّهُ",
        transliteration: "Allāh",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "ء - ل - ه",
        meaning: "Allah",
        explanation: "Majestic proper name of the singular divine sovereign creator of everything."
      },
      {
        word: "لَا",
        transliteration: "Lā",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "No / Absolute denial of",
        explanation: "The Particle of Absolute Negation (Lā Nafiyah lil-Jins) which denies any possibility of a deity."
      },
      {
        word: "إِلَٰهَ",
        transliteration: "Ilāha",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "ء - ل - ه",
        meaning: "Deity / God to worship",
        explanation: "The noun under absolute negation, in the open accusative case (Mansub by Fathah)."
      },
      {
        word: "إِلَّا",
        transliteration: "Illā",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "Except",
        explanation: "Particle of absolute restriction and exception (Harf Istithna)."
      },
      {
        word: "هُوَ",
        transliteration: "Huwa",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "None",
        meaning: "Him / He",
        explanation: "Third person singular masculine detached subject pronoun."
      },
      {
        word: "الْحَيُّ",
        transliteration: "Al-Ḥayyu",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "ح - ي - ي",
        meaning: "The Ever-Living",
        explanation: "Attribute representing absolute, infinite, biological and metaphysical constant life."
      },
      {
        word: "الْقَيُّومُ",
        transliteration: "Al-Qayyūmu",
        isIsmFail: true,
        isHarf: false,
        wordType: "Ism",
        root: "ق - و - م",
        meaning: "The Self-Sustaining / Eternal Guardian",
        explanation: "Intensive active participle form representing One who is constantly upholding and sustaining all cells."
      }
    ]
  },
  "107:4": {
    surahName: "Al-Ma'un",
    surahNumber: 107,
    verseNumber: 4,
    fullVerseArabic: "فَوَيْلٌ لِلْمُصَلِّينَ",
    fullVerseTranslation: "So woe to those who pray",
    words: [
      {
        word: "فَ",
        transliteration: "Fa",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "So / Consequently",
        explanation: "Resumptive coordination particle indicating connection."
      },
      {
        word: "وَيْلٌ",
        transliteration: "Waylun",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "و - ي - ل",
        meaning: "destruction / woe",
        explanation: "Noun representing total despair or severe warnings."
      },
      {
        word: "لِ",
        transliteration: "Li",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "For / To",
        explanation: "Preposition denoting allocation or target audience."
      },
      {
        word: "الْمُصَلِّينَ",
        transliteration: "Al-Muṣallīna",
        isIsmFail: true, // Form II Active Participle (Mu-falli) ! PERFECT MATCH !
        isHarf: false,
        wordType: "Ism",
        root: "ص - ل - و",
        meaning: "Those who regularly perform prayers",
        explanation: "Plural Form II active participle (Ism Fā'il) starting with prefix Mu- with Kasrah on second root letter, representing performers of prayer."
      }
    ]
  },
  "109:4": {
    surahName: "Al-Kafirun",
    surahNumber: 109,
    verseNumber: 4,
    fullVerseArabic: "وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ",
    fullVerseTranslation: "Nor will I indeed worship what you have worshipped.",
    words: [
      {
        word: "وَ",
        transliteration: "Wa",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "And / Nor",
        explanation: "Coordination particle representing conjunction."
      },
      {
        word: "لَا",
        transliteration: "Lā",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "Not / Ever won't",
        explanation: "Denial particle of negating status."
      },
      {
        word: "أَنَا",
        transliteration: "Anā",
        isIsmFail: false,
        isHarf: false,
        wordType: "Ism",
        root: "None",
        meaning: "I",
        explanation: "First person nominative singular detached subject pronoun."
      },
      {
        word: "عَابِدٌ",
        transliteration: "Ābidun",
        isIsmFail: true, // Form I Active Participle (Ism al-Fa'il!) ! PERFECT MATCH !
        isHarf: false,
        wordType: "Ism",
        root: "ع - ب - د",
        meaning: "One who actively serves / worships",
        explanation: "Form I active participle (Ism Fā'il) following template Fā'il, denoting the dedicated worshipper."
      },
      {
        word: "مَا",
        transliteration: "Mā",
        isIsmFail: false,
        isHarf: true,
        wordType: "Harf",
        root: "None",
        meaning: "What / That which",
        explanation: "Relative conjunct pronoun particle (Ism Mawsool)."
      },
      {
        word: "عَبَدتُّمْ",
        transliteration: "Abadtum",
        isIsmFail: false,
        isHarf: false,
        wordType: "Fi'l",
        root: "ع - ب - د",
        meaning: "You worship / have worshipped",
        explanation: "Perfect Form I active past verb in second-person masculine plural form."
      }
    ]
  }
};
