import React, { useState } from 'react';
import { LayoutTheme } from '../types';
import { 
  Sparkles, 
  Search, 
  Layers, 
  ChevronRight,
  Info,
  BookOpen,
  Award,
  Filter,
  CheckCircle2,
  Bookmark,
  RotateCcw
} from 'lucide-react';

interface AsmaAlHusnaProps {
  theme: LayoutTheme;
  onSelectRoot: (root: string) => void;
  onSelectWord: (word: string) => void;
}

interface DivineName {
  num: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  root: string;
  rootTrans: string;
  pattern: string;
  patternExpl: string;
  category: 'perpetual' | 'intensive' | 'active' | 'form-ii' | 'form-iv' | 'other';
}

const ALLAH_NAMES: DivineName[] = [
  {
    num: 1,
    arabic: "ٱللَّه",
    transliteration: "Allāh",
    meaning: "The Unique Deity worthiest of all worship",
    root: "أ ل ه",
    rootTrans: "A-L-H",
    pattern: "Al-Ilāh (Unique Pronunciation)",
    patternExpl: "Singular proper noun representing the supreme ultimate deity, un-pluralizable and unique.",
    category: "other"
  },
  {
    num: 2,
    arabic: "ٱلرَّحْمَٰن",
    transliteration: "Ar-Raḥmān",
    meaning: "The All-Beneficent / Infinitely Merciful to all creation",
    root: "ر ح م",
    rootTrans: "R-H-M",
    pattern: "Fa‘lān (فَعْلَان)",
    patternExpl: "Represents absolute abundance, instant dynamic overflow, and supreme intensity of mercy.",
    category: "intensive"
  },
  {
    num: 3,
    arabic: "ٱلرَّحِيم",
    transliteration: "Ar-Raḥīm",
    meaning: "The Most Merciful / Continuously Compassionate to the believers",
    root: "ر ح م",
    rootTrans: "R-H-M",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Represents a constant, perpetual, eternal and intrinsic trait that never ceases.",
    category: "perpetual"
  },
  {
    num: 4,
    arabic: "ٱلْمَلِك",
    transliteration: "Al-Malik",
    meaning: "The Sovereign Lord / Absolute King / Possessor of Dominion",
    root: "م ل ك",
    rootTrans: "M-L-K",
    pattern: "Fa‘il (فَعِل)",
    patternExpl: "Indicates intrinsic, steady, ruling state which is inherently part of the host.",
    category: "other"
  },
  {
    num: 5,
    arabic: "ٱلْقُدُّوس",
    transliteration: "Al-Quddūs",
    meaning: "The Absolutely Pure / Holy / Free from all imperfections",
    root: "ق د س",
    rootTrans: "Q-D-S",
    pattern: "Fu‘‘ūl (فُعُّول)",
    patternExpl: "Pattern of hyperbolic sanctity, indicating the absolute utmost extreme of clean purity.",
    category: "intensive"
  },
  {
    num: 6,
    arabic: "ٱلسَّلَٰم",
    transliteration: "As-Salām",
    meaning: "The Source of Peace / Perfection and Well-Being",
    root: "س ل م",
    rootTrans: "S-J-M",
    pattern: "Fa‘āl (فَعَال)",
    patternExpl: "Stands for the pure abstract source noun that emits peace, safety and perfection.",
    category: "other"
  },
  {
    num: 7,
    arabic: "ٱلْمُؤْمِن",
    transliteration: "Al-Mu'min",
    meaning: "The Giver of Security / Infuser of Faith / Granter of Amnesty",
    root: "أ م ن",
    rootTrans: "A-M-N",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Active Participle, which acts transitively as a Giver, Host, or Originator of security.",
    category: "form-iv"
  },
  {
    num: 8,
    arabic: "ٱلْمُهَيْمِن",
    transliteration: "Al-Muhaymin",
    meaning: "The Guardian / Overseer / Preserver and Witness of all",
    root: "ه ي م ن",
    rootTrans: "H-Y-M-N",
    pattern: "Mufay‘il (مُفَيْعِل)",
    patternExpl: "Quadrilateral (four-consonant) Form II active modifier representing supreme guardian overseeing.",
    category: "other"
  },
  {
    num: 9,
    arabic: "ٱلْعَزِيز",
    transliteration: "Al-Azīz",
    meaning: "The Almighty / Invincible / Honorable and All-Mighty",
    root: "ع ز ز",
    rootTrans: "A-Z-Z",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Indicates intrinsic, everlasting dignity, power, and high-impact honor.",
    category: "perpetual"
  },
  {
    num: 10,
    arabic: "ٱلْجَبَّار",
    transliteration: "Al-Jabbār",
    meaning: "The Compeller / Overpowering Restorer of damaged states",
    root: "ج ب ر",
    rootTrans: "J-B-R",
    pattern: "Fa‘‘āl (فَعَّال)",
    patternExpl: "Pattern of hyperbolic action, showing forceful restorative repair and relentless control.",
    category: "intensive"
  },
  {
    num: 11,
    arabic: "ٱلْمُتَكَبِّر",
    transliteration: "Al-Mutakabbir",
    meaning: "The Supreme / Inherently Majestic and Sublime",
    root: "ك ب ر",
    rootTrans: "K-B-R",
    pattern: "Mutafa‘‘il (مُتَفَعِّل)",
    patternExpl: "Form V Active Participle, representing self-directed realization of true grandness.",
    category: "intensive"
  },
  {
    num: 12,
    arabic: "ٱلْخَٰلِق",
    transliteration: "Al-Khāliq",
    meaning: "The Creator / He who plans and determines of nothing",
    root: "خ ل ق",
    rootTrans: "Kh-L-Q",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle representing the direct primary performer of creation.",
    category: "active"
  },
  {
    num: 13,
    arabic: "ٱلْبَارِئ",
    transliteration: "Al-Bāri'",
    meaning: "The Maker / Evolver from prior matter with absolute accuracy",
    root: "ب ر أ",
    rootTrans: "B-R-A",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle indicating the primary actor who initiates and detaches life.",
    category: "active"
  },
  {
    num: 14,
    arabic: "ٱلْمُصَوِّر",
    transliteration: "Al-Muṣawwir",
    meaning: "The Fashioner of Forms / Shaper of unique profiles",
    root: "ص و ر",
    rootTrans: "S-W-R",
    pattern: "Mufa‘‘il (مُفَعِّل)",
    patternExpl: "Form II Active Participle. Highlights thorough, custom refinement and multi-layered design of forms.",
    category: "form-ii"
  },
  {
    num: 15,
    arabic: "ٱلْغَفَّار",
    transliteration: "Al-Ghaffār",
    meaning: "The Repeatedly Forgiving / Veiler of Sins over and over",
    root: "غ ف ر",
    rootTrans: "Gh-F-R",
    pattern: "Fa‘‘āl (فَعَّال)",
    patternExpl: "Hyperbolic agent pattern. Indicates repetitive, continuous veiling of faults of creation.",
    category: "intensive"
  },
  {
    num: 16,
    arabic: "ٱلْقَهَّار",
    transliteration: "Al-Qahhār",
    meaning: "The Subduer / All-Conquering / Tamer of the proud",
    root: "ق ه ر",
    rootTrans: "Q-H-R",
    pattern: "Fa‘‘āl (فَعَّال)",
    patternExpl: "Hyperbolic pattern of absolute domination. Subduing everything and crushing injustice.",
    category: "intensive"
  },
  {
    num: 17,
    arabic: "ٱلْوَهَّاب",
    transliteration: "Al-Wahhāb",
    meaning: "The Supreme Bestower / Giver of gifts without expectations",
    root: "و ه ب",
    rootTrans: "W-H-B",
    pattern: "Fa‘‘āl (فَعَّال)",
    patternExpl: "The intensive giving pattern. Giving priceless favors repeatedly and abundantly.",
    category: "intensive"
  },
  {
    num: 18,
    arabic: "ٱلرَّزَّاق",
    transliteration: "Al-Razzāq",
    meaning: "The Universal Provider / Sustainer of all physical & spiritual needs",
    root: "ر ز ق",
    rootTrans: "R-Z-Q",
    pattern: "Fa‘‘āl (فَعَّال)",
    patternExpl: "Hyperbolic provider. Constantly creating resource, feeding, and sustaining.",
    category: "intensive"
  },
  {
    num: 19,
    arabic: "ٱلْفَتَّاح",
    transliteration: "Al-Fattāḥ",
    meaning: "The Supreme Opener of Closed Gates / Just Judge",
    root: "ف ت ح",
    rootTrans: "F-T-H",
    pattern: "Fa‘‘āl (فَعَّال)",
    patternExpl: "Extreme active opener. Resolving blockades, revealing truths, and judging with perfect clarity.",
    category: "intensive"
  },
  {
    num: 20,
    arabic: "ٱلْعَلِيم",
    transliteration: "Al-‘Alīm",
    meaning: "The All-Knowing / Omniscient of secrets",
    root: "ع ل م",
    rootTrans: "A-L-M",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Continuous attribute pattern. Knowledge that is constant, and fully independent of learning.",
    category: "perpetual"
  },
  {
    num: 21,
    arabic: "ٱلْقَابِض",
    transliteration: "Al-Qābid",
    meaning: "The Constrictor / Retracter of provision and spirits",
    root: "ق ب ض",
    rootTrans: "Q-B-D",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle, representing the primary action of withholding for higher wisdom.",
    category: "active"
  },
  {
    num: 22,
    arabic: "ٱلْبَاسِط",
    transliteration: "Al-Bāsiṭ",
    meaning: "The Expander / Munificent Bestower of life and provision",
    root: "ب س ط",
    rootTrans: "B-S-T",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle. Represents the primary divine engine of lavish expansion.",
    category: "active"
  },
  {
    num: 23,
    arabic: "ٱلْخَافِض",
    transliteration: "Al-Khāfid",
    meaning: "The Abaser / Humble-maker of proud sinners",
    root: "خ ف ض",
    rootTrans: "Kh-F-D",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle, reducing high status of abusers to dust.",
    category: "active"
  },
  {
    num: 24,
    arabic: "ٱلرَّافِع",
    transliteration: "Al-Rāfi‘",
    meaning: "The Exalter / Lifter of status and truthful souls",
    root: "ر ف ع",
    rootTrans: "R-F-A",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle. Shows the primary divine action of uplifting status.",
    category: "active"
  },
  {
    num: 25,
    arabic: "ٱلْمُعِزّ",
    transliteration: "Al-Mu‘izz",
    meaning: "The Giver of Honor, strength, and victory",
    root: "ع ز ز",
    rootTrans: "A-Z-Z",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Active Participle. Represents the direct causation of honor and authority.",
    category: "form-iv"
  },
  {
    num: 26,
    arabic: "ٱلْمُذِلّ",
    transliteration: "Al-Mudhill",
    meaning: "The Humiliator / Subduer of tyrants",
    root: "ذ ل ل",
    rootTrans: "D-L-L",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Transitive Active Participle, causing humblification to appear in rebellious forces.",
    category: "form-iv"
  },
  {
    num: 27,
    arabic: "ٱلسَّمِيع",
    transliteration: "As-Samī‘",
    meaning: "The All-Hearing/ Capturer of whispers and intention",
    root: "س م ع",
    rootTrans: "S-M-A",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Eternal attribute. Permanent capacity of hearing without ears or physical media.",
    category: "perpetual"
  },
  {
    num: 28,
    arabic: "ٱلْبَصِير",
    transliteration: "Al-Baṣīr",
    meaning: "The All-Seeing / Fully Acquainted with the deepest layers",
    root: "ب ص ر",
    rootTrans: "B-S-R",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Perpetual attribute. Seeing all occurrences, fine particles, and thoughts eternally.",
    category: "perpetual"
  },
  {
    num: 29,
    arabic: "ٱلْحَكَم",
    transliteration: "Al-Ḥakam",
    meaning: "The Immutable / Supreme Arbitrator / Ruler",
    root: "ح ك م",
    rootTrans: "H-K-M",
    pattern: "Fa‘al (فَعَل)",
    patternExpl: "Noun of quality serving as adjective, expressing that absolute justice is His primary trait.",
    category: "other"
  },
  {
    num: 30,
    arabic: "ٱلْعَدْل",
    transliteration: "Al-‘Adl",
    meaning: "The Utterly Just / Embodiment of Equity",
    root: "ع د ل",
    rootTrans: "A-D-L",
    pattern: "Fa‘l (فَعْل)",
    patternExpl: "Pure abstract verbal noun serving as supreme attribute representing perfect justice.",
    category: "other"
  },
  {
    num: 31,
    arabic: "ٱللَّطِيف",
    transliteration: "Al-Laṭīf",
    meaning: "The Subtly Kind / Gentle / Unfathomably Subtle",
    root: "ل ط ف",
    rootTrans: "L-T-F",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Steady attribute indicating complete gentleness, infinite tenderness and fine actions.",
    category: "perpetual"
  },
  {
    num: 32,
    arabic: "ٱلْخَبِير",
    transliteration: "Al-Khabīr",
    meaning: "The All-Aware / Fully Acquainted with hidden secrets",
    root: "خ ب ر",
    rootTrans: "Kh-B-R",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Continual attribute representing absolute, effortless knowledge of structural realities.",
    category: "perpetual"
  },
  {
    num: 33,
    arabic: "ٱلْحَلِيم",
    transliteration: "Al-Ḥalīm",
    meaning: "The Forbearing / Clement / Slow to anger",
    root: "ح ل م",
    rootTrans: "H-L-M",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Constant clement attitude. Free from haste, giving souls scope to seek pardon.",
    category: "perpetual"
  },
  {
    num: 34,
    arabic: "ٱلْعَظِيم",
    transliteration: "Al-‘Aẓīm",
    meaning: "The Magnificent / Incomparable Great Creator",
    root: "ع ظ م",
    rootTrans: "A-Z-M",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Magnificence that is intrinsic, eternal, and unbound by coordinate dimension.",
    category: "perpetual"
  },
  {
    num: 35,
    arabic: "ٱلْغَفُور",
    transliteration: "Al-Ghafūr",
    meaning: "The All-Forgiving / Multi-Shielding / Eraser of faults",
    root: "غ ف ر",
    rootTrans: "Gh-F-R",
    pattern: "Fa‘ūl (فَعُول)",
    patternExpl: "Intensive agent representing colossal, massive capacity of coverage and protection.",
    category: "intensive"
  },
  {
    num: 36,
    arabic: "ٱلشَّكُور",
    transliteration: "As-Shakūr",
    meaning: "The Most Appreciative / Supreme Rewarder of tiny deeds",
    root: "ش ك ر",
    rootTrans: "Sh-K-R",
    pattern: "Fa‘ūl (فَعُول)",
    patternExpl: "Intensive behavior pattern. Multiplying tiny efforts of believers into massive gardens of reward.",
    category: "intensive"
  },
  {
    num: 37,
    arabic: "ٱلْعَلِيّ",
    transliteration: "Al-‘Alī",
    meaning: "The Sublimely High / Surpassing everything",
    root: "ع ل و",
    rootTrans: "A-L-W",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Steady attribute denoting supreme, absolute height of status and authority.",
    category: "perpetual"
  },
  {
    num: 38,
    arabic: "ٱلْكَبِير",
    transliteration: "Al-Kabīr",
    meaning: "The Infinite Great / Grand beyond capture",
    root: "ك ب ر",
    rootTrans: "K-B-R",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Everlasting greatness. The absolute original from whom all grandeur descends.",
    category: "perpetual"
  },
  {
    num: 39,
    arabic: "ٱلْحَفِيظ",
    transliteration: "Al-Ḥafīẓ",
    meaning: "The Preserver / Dedicated Protector of details",
    root: "ح ف ظ",
    rootTrans: "H-F-Z",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Perpetual guardian. Saving, cataloging, protecting, and tracking cosmic structures.",
    category: "perpetual"
  },
  {
    num: 40,
    arabic: "ٱلْمُقِيت",
    transliteration: "Al-Muqīt",
    meaning: "The Nourisher / Sustainer / Supplier of specific aids",
    root: "ق و ت",
    rootTrans: "Q-W-T",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Active Participle, representing the direct dispatching of nutrition and energy.",
    category: "form-iv"
  },
  {
    num: 41,
    arabic: "ٱلْحَسِيب",
    transliteration: "Al-Ḥasīb",
    meaning: "The Sufficient Reckoner / Perfect Auditor",
    root: "ح س ب",
    rootTrans: "H-S-B",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Sufficient protector. Intrinsic keeper of balances, auditing accounts instantaneously.",
    category: "perpetual"
  },
  {
    num: 42,
    arabic: "ٱلْجَلِيل",
    transliteration: "Al-Jalīl",
    meaning: "The Majestic / Sovereign of Glory",
    root: "ج ل ل",
    rootTrans: "J-L-L",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Steady attribute denoting peerless majesty, weight, and beauty.",
    category: "perpetual"
  },
  {
    num: 43,
    arabic: "ٱلْكَرِيم",
    transliteration: "Al-Karīm",
    meaning: "The Generous Bestower / Honorable Lord",
    root: "ك ر م",
    rootTrans: "K-R-M",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Continuous grace. Generosity that flows without prompting, boundary, or logic of trade.",
    category: "perpetual"
  },
  {
    num: 44,
    arabic: "ٱلرَّقِيب",
    transliteration: "Al-Raqīb",
    meaning: "The Watchful Observer / Vigilant Auditor",
    root: "ر ق ب",
    rootTrans: "R-Q-B",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Permanent watchful state, keeping absolute visual record and cosmic guard.",
    category: "perpetual"
  },
  {
    num: 45,
    arabic: "ٱلْمُجِيب",
    transliteration: "Al-Mujīb",
    meaning: "The Responsive / Answerer of prayers",
    root: "ج و ب",
    rootTrans: "J-W-B",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Active Participle. Highlights active responding and answering requests.",
    category: "form-iv"
  },
  {
    num: 46,
    arabic: "ٱلْوَٰسِع",
    transliteration: "Al-Wāsi‘",
    meaning: "The Vast / All-Encompassing / Boundless",
    root: "و س ع",
    rootTrans: "W-S-A",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle representing massive breadth of capacity and embrace.",
    category: "active"
  },
  {
    num: 47,
    arabic: "ٱلْحَكِيم",
    transliteration: "Al-Ḥakīm",
    meaning: "The All-Wise / Author of perfect laws",
    root: "ح ك م",
    rootTrans: "H-K-M",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Intrinsically wise. Creating exact designs where nothing is out of place.",
    category: "perpetual"
  },
  {
    num: 48,
    arabic: "ٱلْوَدُود",
    transliteration: "Al-Wadūd",
    meaning: "The Loving One / Multi-Loving Source",
    root: "و د د",
    rootTrans: "W-D-D",
    pattern: "Fa‘ūl (فَعُول)",
    patternExpl: "Intensive affection model, showing immense capacity of loving the clean souls.",
    category: "intensive"
  },
  {
    num: 49,
    arabic: "ٱلْمَجِيد",
    transliteration: "Al-Majīd",
    meaning: "The Illustrious / Endlessly Glorified",
    root: "م ج د",
    rootTrans: "M-J-D",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Sustained glory indicating ultimate dignity and unshakeable grandeur.",
    category: "perpetual"
  },
  {
    num: 50,
    arabic: "ٱلْبَاعِث",
    transliteration: "Al-Bā'ith",
    meaning: "The Resurrector / Awakener of tomb dwellers",
    root: "ب ع ث",
    rootTrans: "B-E-T",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle. The primary divine actor dispatched to awake the dead.",
    category: "active"
  },
  {
    num: 51,
    arabic: "ٱلشَّهِيد",
    transliteration: "As-Shahīd",
    meaning: "The Absolute Witness / Present Observer",
    root: "ش ه د",
    rootTrans: "Sh-H-D",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Infinite witness, registering all atoms of existence simultaneously.",
    category: "perpetual"
  },
  {
    num: 52,
    arabic: "ٱلْحَقّ",
    transliteration: "Al-Haqq",
    meaning: "The Absolute Truth / Reality",
    root: "ح ق ق",
    rootTrans: "H-Q-H",
    pattern: "Fa‘l (فَعْل)",
    patternExpl: "Unshakeable reality, constant, stable, and completely immune to decay or falsity.",
    category: "other"
  },
  {
    num: 53,
    arabic: "ٱلْوَكِيل",
    transliteration: "Al-Wakīl",
    meaning: "The Ultimate Trustee / Discharger of affairs",
    root: "و ك ل",
    rootTrans: "W-K-L",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Continuous trustee, securing results for those who surrender details to His charge.",
    category: "perpetual"
  },
  {
    num: 54,
    arabic: "ٱلْقَوِيّ",
    transliteration: "Al-Qawī",
    meaning: "The All-Strong / All-Powerful",
    root: "ق و ي",
    rootTrans: "Q-W-Y",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Intrinsic strength, possessing boundless energy that never undergoes exhaustion.",
    category: "perpetual"
  },
  {
    num: 55,
    arabic: "ٱلْمَتِين",
    transliteration: "Al-Matīn",
    meaning: "The Firm / Steadfast/ Solid of Power",
    root: "م ت ن",
    rootTrans: "M-T-N",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Sustained firmness, reflecting infinite strength free from any structural decay.",
    category: "perpetual"
  },
  {
    num: 56,
    arabic: "ٱلْوَلِيّ",
    transliteration: "Al-Walī",
    meaning: "The Protecting Friend / Loving Guardian",
    root: "و ل ي",
    rootTrans: "W-L-Y",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Continuous loyalty and protective custody of the righteous.",
    category: "perpetual"
  },
  {
    num: 57,
    arabic: "ٱلْحَمِيد",
    transliteration: "Al-Ḥamīd",
    meaning: "The Praiseworthy / Praised inherently",
    root: "ح م د",
    rootTrans: "H-M-D",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Praiseworthy in His essence, independent of whoever utters his praise.",
    category: "perpetual"
  },
  {
    num: 58,
    arabic: "ٱلْمُحْصِي",
    transliteration: "Al-Muḥṣī",
    meaning: "The Counter of All / Absolute Cataloger",
    root: "ح ص ي",
    rootTrans: "H-S-Y",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Active Participle, isolating, pricing, and cataloging every drop and breath.",
    category: "form-iv"
  },
  {
    num: 59,
    arabic: "ٱلْمُبْدِئ",
    transliteration: "Al-Mubdi'",
    meaning: "The Originator / First Starter of Life",
    root: "ب د أ",
    rootTrans: "B-D-A",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Transitive agent initiating the cosmos out of absolute void.",
    category: "form-iv"
  },
  {
    num: 60,
    arabic: "ٱلْمُعِيد",
    transliteration: "Al-Mu‘īd",
    meaning: "The Restorer / Recreator of dead bones",
    root: "ع و د",
    rootTrans: "A-W-D",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Active Agent designed to recall back existing matters after annihilation.",
    category: "form-iv"
  },
  {
    num: 61,
    arabic: "ٱلْمُحْيِي",
    transliteration: "Al-Muḥyī",
    meaning: "The Infuser of Life / Lifegiver",
    root: "ح ي ي",
    rootTrans: "H-Y-Y",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Transitive modifier injecting life pulse, seeds, and cells.",
    category: "form-iv"
  },
  {
    num: 62,
    arabic: "ٱلْمُمِيت",
    transliteration: "Al-Mumīt",
    meaning: "The Giver of Death / Destroyer of form",
    root: "م و ت",
    rootTrans: "M-W-T",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Active modifier managing termination codes, decay, and exit.",
    category: "form-iv"
  },
  {
    num: 63,
    arabic: "ٱلْحَيّ",
    transliteration: "Al-Ḥayy",
    meaning: "The Ever-Living / Absolute Self-Aware",
    root: "ح ي ي",
    rootTrans: "H-Y-Y",
    pattern: "Fa‘yl (فَعِيل)",
    patternExpl: "The eternal, primary attribute of living. Subject to none of the decay of organic flesh.",
    category: "other"
  },
  {
    num: 64,
    arabic: "ٱلْقَيُّوم",
    transliteration: "Al-Qayyūm",
    meaning: "The Self-Sustaining / Guardian of All Space and Time",
    root: "ق و م",
    rootTrans: "Q-W-M",
    pattern: "Fayyūl (فَعُّول)",
    patternExpl: "Intense active sustainer. Managing coordinates of gravity, stars, and atoms tirelessly.",
    category: "intensive"
  },
  {
    num: 65,
    arabic: "ٱلْوَاجِد",
    transliteration: "Al-Wājid",
    meaning: "The Finder / He who never loses a thing",
    root: "و ج د",
    rootTrans: "W-J-D",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle, capturing the constant presence of provision and things.",
    category: "active"
  },
  {
    num: 66,
    arabic: "ٱلْمَاجِد",
    transliteration: "Al-Mājid",
    meaning: "The Magnificient / Source of Nobility",
    root: "م ج د",
    rootTrans: "M-J-D",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle denoting magnificent presence and generous stature.",
    category: "active"
  },
  {
    num: 67,
    arabic: "ٱلْوَٰحِد",
    transliteration: "Al-Wāḥid",
    meaning: "The Indivisible Singularity",
    root: "و ح د",
    rootTrans: "W-H-D",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle representing numerical singularity and pristine uniqueness.",
    category: "active"
  },
  {
    num: 68,
    arabic: "ٱلْأَحَد",
    transliteration: "Al-Aḥad",
    meaning: "The Absolute One / Incomparably Unique",
    root: "و ح د",
    rootTrans: "W-H-D",
    pattern: "Fa‘ad (فَعَد)",
    patternExpl: "Qualitative state of uniqueness, expressing absolute indivisibility and peerless essence.",
    category: "other"
  },
  {
    num: 69,
    arabic: "ٱلصَّمَد",
    transliteration: "Aṣ-Ṣamad",
    meaning: "The Besought / Solid Refuge of All / Completely Self-Sufficient",
    root: "ص م د",
    rootTrans: "C-M-D",
    pattern: "Fa‘al (فَعَل)",
    patternExpl: "Expresses a high-density, solid status of shelter whom everyone calls but needs none.",
    category: "other"
  },
  {
    num: 70,
    arabic: "ٱلْقَٰدِر",
    transliteration: "Al-Qādir",
    meaning: "The Capable / Determiner of measure",
    root: "ق د ر",
    rootTrans: "Q-D-R",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle. The primary divine source of measure, capability, and rule.",
    category: "active"
  },
  {
    num: 71,
    arabic: "ٱلْمُقْتَدِر",
    transliteration: "Al-Muqtadir",
    meaning: "The Omnipotent Determiner / Master Executor",
    root: "ق د ر",
    rootTrans: "Q-D-R",
    pattern: "Mufta‘il (مُفْتَعِل)",
    patternExpl: "Form VIII Active Participle, reflecting meticulous, overwhelming, and highly strategic execution of power.",
    category: "intensive"
  },
  {
    num: 72,
    arabic: "ٱلْمُقَدِّم",
    transliteration: "Al-Muqaddim",
    meaning: "The Advancer / Giver of Precedence",
    root: "ق د م",
    rootTrans: "Q-D-M",
    pattern: "Mufa‘‘il (مُفَعِّيل)",
    patternExpl: "Form II Active Participle. The active driver who pulls elements forward.",
    category: "form-ii"
  },
  {
    num: 73,
    arabic: "ٱلْمُؤَخِّر",
    transliteration: "Al-Mu'akhkhir",
    meaning: "The Delayer / Deferrer",
    root: "أ خ ر",
    rootTrans: "A-Kh-R",
    pattern: "Mufa‘‘il (مُفَعِّل)",
    patternExpl: "Form II Active Participle, pushing objects back for tactical cosmic development.",
    category: "form-ii"
  },
  {
    num: 74,
    arabic: "ٱلْأَوَّل",
    transliteration: "Al-Awwal",
    meaning: "The Absolute First, prior to any creation",
    root: "أ و ل",
    rootTrans: "A-W-L",
    pattern: "Af‘al (أَفْعَل)",
    patternExpl: "Superlative primary attribute representing infinite priority in time and causality.",
    category: "other"
  },
  {
    num: 75,
    arabic: "ٱلْءَاخِر",
    transliteration: "Al-Ākhir",
    meaning: "The Absolute Last, ultimate receiver",
    root: "أ خ ر",
    rootTrans: "A-Kh-R",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Sequential active participle, showing permanent survival after systemic collapse.",
    category: "active"
  },
  {
    num: 76,
    arabic: "ٱلظَّٰهِر",
    transliteration: "Aẓ-Ẓāhir",
    meaning: "The Outwardly Manifest / Supreme Champion",
    root: "ظ ه ر",
    rootTrans: "Z-H-R",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle, manifest everywhere through divine signs and dominance.",
    category: "active"
  },
  {
    num: 77,
    arabic: "ٱلْبَاطِن",
    transliteration: "Al-Bāṭin",
    meaning: "The Inwardly Hidden / Intimate of secrets",
    root: "ب ط ن",
    rootTrans: "B-T-N",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle, expressing deep, subtle proximity and complete latency.",
    category: "active"
  },
  {
    num: 78,
    arabic: "ٱلْوَالِي",
    transliteration: "Al-Wālī",
    meaning: "The Governing Governor / Caretaker ruler",
    root: "و ل ي",
    rootTrans: "W-L-Y",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle of administrative governance, handling state mechanics.",
    category: "active"
  },
  {
    num: 79,
    arabic: "ٱلْمُتَعَالِي",
    transliteration: "Al-Muta‘ālī",
    meaning: "The Supreme Exalted / Transcender of boundaries",
    root: "ع ل و",
    rootTrans: "A-L-W",
    pattern: "Mutafā‘il (مُتَفَاعِل)",
    patternExpl: "Form VI Active Participle, representing supreme, endless self-manifesting height.",
    category: "intensive"
  },
  {
    num: 80,
    arabic: "ٱلْبَرّ",
    transliteration: "Al-Barr",
    meaning: "The Perfect Benefactor / Source of pure goodness",
    root: "ب ر ر",
    rootTrans: "B-R-R",
    pattern: "Fa‘l (فَعْل)",
    patternExpl: "The abstract source noun of absolute righteousness, representing boundless warm kindness.",
    category: "other"
  },
  {
    num: 81,
    arabic: "ٱلتَّوَّاب",
    transliteration: "At-Tawwāb",
    meaning: "The Ever-Accepting Creator of repentance",
    root: "ت و ب",
    rootTrans: "T-W-B",
    pattern: "Fa‘‘āl (فَعَّال)",
    patternExpl: "Hyperbolic agent of return. Constantly inciting and accepting penitent returns of creations.",
    category: "intensive"
  },
  {
    num: 82,
    arabic: "ٱلْمُنْتَقِم",
    transliteration: "Al-Muntaqim",
    meaning: "The Retributor / Avenger of the oppressed",
    root: "ن ق م",
    rootTrans: "N-Q-M",
    pattern: "Mufta‘il (مُفْتَعِل)",
    patternExpl: "Form VIII Active Participle, enforcing calculated, deserved, and majestic retribution upon tyrants.",
    category: "intensive"
  },
  {
    num: 83,
    arabic: "ٱلْعَفُوّ",
    transliteration: "Al-‘Afūw",
    meaning: "The Supreme Pardoner / Complete Eraser of traces",
    root: "ع ف و",
    rootTrans: "A-F-W",
    pattern: "Fa‘ūw (فَعُول)",
    patternExpl: "Hyperbolic eraser, deleting the sin record completely as if it never existed.",
    category: "intensive"
  },
  {
    num: 84,
    arabic: "ٱلرَّؤُوف",
    transliteration: "Ar-Ra'ūf",
    meaning: "The Extremely Kind / Compassionate Lord",
    root: "ر أ ف",
    rootTrans: "R-A-F",
    pattern: "Fa‘ūl (فَعُول)",
    patternExpl: "Intensive compassionate status, providing safety shield before trials can land.",
    category: "intensive"
  },
  {
    num: 85,
    arabic: "مَالِكُ ٱلْمُلْك",
    transliteration: "Mālik-ul-Mulk",
    meaning: "The Sovereign Owner of All Dominions",
    root: "م ل ك",
    rootTrans: "M-L-K",
    pattern: "Possessive Compound (إِضَافَة)",
    patternExpl: "Construct clause representing absolute continuous ownership of all systems of matter and energy.",
    category: "other"
  },
  {
    num: 86,
    arabic: "ذُو ٱلْجَلَٰلِ وَٱلْإِكْرَام",
    transliteration: "Thul-Jalāli wal-Ikrām",
    meaning: "Possessor of Majesty and Supreme Generosity",
    root: "ج ل ل",
    rootTrans: "J-L-L",
    pattern: "Possessive Compound (إِضَافَة)",
    patternExpl: "Double possessive formula showing He holds majesty to be feared, and generosity to be sought.",
    category: "other"
  },
  {
    num: 87,
    arabic: "ٱلْمُقْسِط",
    transliteration: "Al-Muqsiṭ",
    meaning: "The Equitable Dealer / Fair Arbitrator",
    root: "ق س ط",
    rootTrans: "Q-S-T",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Active Participle, causing fair justice, balancing plates perfectly.",
    category: "form-iv"
  },
  {
    num: 88,
    arabic: "ٱلْجَامِع",
    transliteration: "Al-Jāmi‘",
    meaning: "The Gatherer of all scatterings / Uniter",
    root: "ج م ع",
    rootTrans: "J-M-A",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle. The main cosmic magnet pulling assemblies, souls, and files.",
    category: "active"
  },
  {
    num: 89,
    arabic: "ٱلْغَنِيّ",
    transliteration: "Al-Ghanī",
    meaning: "The Absolutely Rich / Fully Independent",
    root: "غ ن ي",
    rootTrans: "Gh-N-Y",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Sustained richness. Needing nothing from space, time, or creation to persist.",
    category: "perpetual"
  },
  {
    num: 90,
    arabic: "ٱلْمُغْنِيّ",
    transliteration: "Al-Mughnī",
    meaning: "The Absolute Enricher / Bestower of wealth",
    root: "غ ن ي",
    rootTrans: "Gh-N-Y",
    pattern: "Muf‘il (مُفْعِل)",
    patternExpl: "Form IV Transitive agent creating richness, ease, and sufficiency in creations.",
    category: "form-iv"
  },
  {
    num: 91,
    arabic: "ٱلْمَانِع",
    transliteration: "Al-Māni‘",
    meaning: "The Defending Preventer / Shield of hazard",
    root: "م ن ع",
    rootTrans: "M-N-A",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle, defending and blocking harm to protect chosen structures.",
    category: "active"
  },
  {
    num: 92,
    arabic: "ٱلضَّارّ",
    transliteration: "Ad-Dārr",
    meaning: "The Giver of Trial / Distributer of Harm",
    root: "ض ر ر",
    rootTrans: "D-R-R",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle. Releasing distress, constraint, and challenge to test souls.",
    category: "active"
  },
  {
    num: 93,
    arabic: "ٱلنَّافِع",
    transliteration: "An-Nāfi‘",
    meaning: "The Beneficent Bestower of Advantage & Gain",
    root: "ن ف ع",
    rootTrans: "N-F-A",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle, releasing profit, wellness, and structural enhancement.",
    category: "active"
  },
  {
    num: 94,
    arabic: "ٱلنُّور",
    transliteration: "An-Nūr",
    meaning: "The Illumining Light / Giver of Sight",
    root: "ن و ر",
    rootTrans: "N-W-R",
    pattern: "Fa‘l (فَعْل)",
    patternExpl: "Self-luminous abstract noun serving as attribute. Expelling shadows of void.",
    category: "other"
  },
  {
    num: 95,
    arabic: "ٱلْهَادِي",
    transliteration: "Al-Hādī",
    meaning: "The Supreme Guide / Compass to success",
    root: "ه د ي",
    rootTrans: "H-D-Y",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle representing the active pilot leading ships to safety.",
    category: "active"
  },
  {
    num: 96,
    arabic: "ٱلْبَدِيع",
    transliteration: "Al-Badī‘",
    meaning: "The Unique Creator without peer or template",
    root: "ب د ع",
    rootTrans: "B-D-A",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Steady attribute representing absolute qualitative uniqueness and design mastery.",
    category: "perpetual"
  },
  {
    num: 97,
    arabic: "ٱلْبَاقِي",
    transliteration: "Al-Bāqī",
    meaning: "The Everlasting / Indestructible Lord",
    root: "ب q ي",
    rootTrans: "B-Q-Y",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle, representing permanent continuation after all cosmic elements disappear.",
    category: "active"
  },
  {
    num: 98,
    arabic: "ٱلْوَٰرِث",
    transliteration: "Al-Wārith",
    meaning: "The Ultimate Inheritor of all assets",
    root: "و ر ث",
    rootTrans: "W-R-T",
    pattern: "Fā‘il (فَاعِل)",
    patternExpl: "Form I Active Participle, capturing back all holdings when creation's lease ends.",
    category: "active"
  },
  {
    num: 99,
    arabic: "ٱلرَّشِيد",
    transliteration: "Ar-Rashīd",
    meaning: "The Righteous Prudent / Best Director of affairs",
    root: "ر ش د",
    rootTrans: "R-S-D",
    pattern: "Fa‘īl (فَعِيل)",
    patternExpl: "Steady attribute denoting supreme, absolute wisdom, guidance, and patience.",
    category: "perpetual"
  },
  {
    num: 100,
    arabic: "ٱلصَّبُور",
    transliteration: "Aṣ-Ṣabūr",
    meaning: "The Ever Patient / Restrainer of retribution",
    root: "ص ب ر",
    rootTrans: "C-B-R",
    pattern: "Fa‘ūl (فَعُول)",
    patternExpl: "The pattern of immense capacity of patience, delaying punishments so creatures may return.",
    category: "intensive"
  }
];

export default function AsmaAlHusna({ theme, onSelectRoot, onSelectWord }: AsmaAlHusnaProps) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'perpetual' | 'intensive' | 'active' | 'form-ii' | 'form-iv' | 'other'>('all');
  const [selectedName, setSelectedName] = useState<DivineName | null>(ALLAH_NAMES[1]); // Default to Ar-Rahman

  // Filter items
  const filteredNames = ALLAH_NAMES.filter((name) => {
    const matchesSearch =
      name.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.rootTrans.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.pattern.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategoryFilter === 'all' || name.category === activeCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  // UI styling classes
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

  const inputStyleClass = isParchment
    ? 'bg-white border-[#ebdcc3] focus:border-[#8c6239] text-[#2c241e]'
    : isCosmic
      ? 'bg-[#0f0e26] border-indigo-950 text-indigo-200 focus:border-indigo-500'
      : 'bg-slate-950 border-slate-800 focus:border-emerald-500 text-white';

  const fontColorThemeText = isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400';
  const badgeThemeBg = isParchment ? 'bg-[#dfd3c3]/40 border-[#a68c6d]/30 text-[#5c3d2e]' : isCosmic ? 'bg-indigo-950/40 border-indigo-900/30 text-indigo-300' : 'bg-emerald-950/30 border-emerald-900/40 text-emerald-300';

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 ${cardBgClass} space-y-8 animate-fadeIn`}>
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-current/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Award className={`w-5 h-5 ${fontColorThemeText}`} />
            <h2 className="text-xl font-bold tracking-tight">Step 6: Divine Morphological Lexical Database (Asmā'ul-Ḥusnā)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Analyze exactly 100 Divine Names of Allah. Study their Arabic radical root consonants, precise English semantic meanings, and the classic morphological root-patterns used to yield specific attributes.
          </p>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-mono leading-none ${badgeThemeBg}`}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>100 TOTAL NAMES</span>
        </div>
      </div>

      {/* THREE THEME EXILE BOX FOR PATTERNS CONCEPT */}
      <div className={`p-4 rounded-xl border text-xs leading-relaxed opacity-95 ${innerCardBgClass} grid grid-cols-1 md:grid-cols-3 gap-6`}>
        <div className="space-y-1">
          <h4 className="font-bold flex items-center gap-1.5 text-amber-500">
            <Bookmark className="w-3.5 h-3.5" /> Perpetual Patterns (Fa‘īl)
          </h4>
          <p className="text-[11px] opacity-85">
            Suffix structure denoting stable, steady, permanent properties that have always existed and will exist for eternity (e.g. Al-‘Alīm, As-Samī‘, Al-Hafīẓ).
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold flex items-center gap-1.5 text-teal-400">
            <Bookmark className="w-3.5 h-3.5" /> Hyperbolic Abundance (Fa‘‘āl / Fa‘ūl)
          </h4>
          <p className="text-[11px] opacity-85">
            Extreme reinforcement represents continuous repetitive dynamic actions of overwhelming intensity towards the creation (e.g., Al-Ghaffār, Ar-Razzāq).
          </p>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold flex items-center gap-1.5 text-pink-400">
            <Bookmark className="w-3.5 h-3.5" /> Form IV Causation (Muf‘il)
          </h4>
          <p className="text-[11px] opacity-85">
            Form IV causative active participle. Translates the root action into dynamic dispatching agency onto others (e.g., Al-Mughnī, Al-Muḥyī).
          </p>
        </div>
      </div>

      {/* FILTER PANEL AND MAIN WORKSPACE AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIST AND FILTERS (SPAN 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Divine Name, root (e.g. r-h-m), pattern, or English meaning..."
              className={`w-full text-xs rounded-xl py-3 pl-10 pr-4 focus:outline-none transition-all border ${inputStyleClass}`}
              id="asma-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-[10px] uppercase font-bold opacity-60 hover:opacity-100"
              >
                Clear
              </button>
            )}
          </div>

          {/* PATTERN CATEGORY PILLS */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-mono tracking-wider opacity-60 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Patterns:
            </span>
            {[
              { id: 'all', label: 'All Patterns' },
              { id: 'perpetual', label: 'Fa‘īl (Perpetual)' },
              { id: 'intensive', label: 'Hyperbolic/Intensive' },
              { id: 'active', label: 'Form I Active' },
              { id: 'form-ii', label: 'Form II intensive' },
              { id: 'form-iv', label: 'Form IV Giver' },
              { id: 'other', label: 'Other/Compounds' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryFilter(cat.id as any)}
                className={`py-1 px-2.5 rounded-lg border text-[10.5px] font-semibold cursor-pointer transition-all ${
                  activeCategoryFilter === cat.id
                    ? (isParchment ? 'bg-[#8c6239] border-[#8c6239] text-white' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                    : 'bg-transparent border-current/10 hover:bg-current/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* LIST BOX */}
          <div className={`overflow-y-auto max-h-[500px] rounded-xl border border-current/10 divide-y divide-current/5 pr-1 scrollbar-thin`}>
            {filteredNames.length > 0 ? (
              filteredNames.map((name) => {
                const isSelected = selectedName?.num === name.num;
                return (
                  <div
                    key={name.num}
                    onClick={() => setSelectedName(name)}
                    className={`p-3 transition-all duration-200 cursor-pointer flex items-center justify-between text-left ${
                      isSelected
                        ? (isParchment ? 'bg-[#8c6239]/10 border-l-4 border-[#8c6239]' : isCosmic ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : 'bg-emerald-950/40 border-l-4 border-emerald-500')
                        : 'hover:bg-current/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-black/10 border border-current/5 flex items-center justify-center font-mono text-[10px] font-bold text-slate-400">
                        {name.num}
                      </div>
                      <div>
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>{name.transliteration}</span>
                          <span className="text-[10px] font-mono text-slate-400 font-normal">({name.pattern.split(' ')[0]})</span>
                        </div>
                        <p className="text-[10.5px] opacity-75 line-clamp-1">{name.meaning}</p>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div className="hidden sm:block">
                        <span className="text-[9px] font-mono opacity-50 block">Root</span>
                        <span className="text-xs font-serif font-semibold text-yellow-500">{name.root}</span>
                      </div>
                      <div className="text-xl font-serif font-black tracking-normal mr-1">{name.arabic}</div>
                      <ChevronRight className="w-4 h-4 opacity-40 shrink-0" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                <RotateCcw className="w-8 h-8 mx-auto mb-2 opacity-50 animate-spin" />
                No divine names found matching "{searchQuery}" under this pattern. Try clearing inputs or select "All Patterns".
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REVELATORY MORPHOLOGICAL PANEL (SPAN 5) */}
        <div className="lg:col-span-5 h-full">
          {selectedName ? (
            <div className={`p-6 rounded-2xl border ${innerCardBgClass} space-y-6 flex flex-col justify-between h-full`}>
              
              <div className="space-y-5">
                <div className="flex justify-between items-start border-b border-current/10 pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Divine Attribute Name #{selectedName.num}</span>
                    <h3 className="text-xl font-black tracking-tight">{selectedName.transliteration}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-serif font-black leading-tight text-amber-500">{selectedName.arabic}</div>
                  </div>
                </div>

                {/* SENSORY TRANSLATION INFO BOX */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block">Linguistic Translation:</span>
                  <p className="text-sm font-semibold leading-relaxed">
                    "{selectedName.meaning}"
                  </p>
                </div>

                {/* ROOT CONVERSATION CONTAINER */}
                <div className="bg-black/25 rounded-xl p-3.5 space-y-2 border border-current/5">
                  <span className="text-[9px] font-mono font-bold uppercase text-amber-500 tracking-wider block">Radical Root (المادة الأصلية):</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-serif font-black">{selectedName.root}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${badgeThemeBg}`}>
                        Root: {selectedName.rootTrans}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => onSelectRoot(selectedName.root)}
                      type="button"
                      className={`text-[10.5px] font-mono font-bold hover:underline cursor-pointer flex items-center gap-1 text-yellow-500`}
                    >
                      Explore Root Conjugation ➜
                    </button>
                  </div>
                  <p className="text-[10.5px] opacity-80 leading-relaxed text-slate-400">
                    Entering these 3 basic consonants into the morphological engine generates the tenses, dualisms and plural forms of the verb.
                  </p>
                </div>

                {/* MORPHOLOGICAL PATTERN MIZAN ANALYSIS */}
                <div className="space-y-2.5">
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block">Sarf Morphological Pattern (الميزان الصرفي):</span>
                  <div className="p-3 rounded-lg border border-current/10 bg-current/5">
                    <div className="font-bold text-xs text-emerald-400 font-serif mb-1 uppercase tracking-wide">
                      {selectedName.pattern}
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      {selectedName.patternExpl}
                    </p>
                  </div>
                  <p className="text-[10.5px] leading-relaxed italic opacity-85 text-slate-400">
                    💡 Classical Arabic uses the phonetic layout pattern (Mizān) to instantly embed the exact tone of action - differentiating constant traits from intensive dynamic bursts.
                  </p>
                </div>

              </div>

              {/* ACTION BUTTON TO INTERACTIVE SARF MAP */}
              <div className="pt-4 border-t border-current/10 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onSelectWord(selectedName.transliteration)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs text-center border cursor-pointer select-none transition-all ${
                    isParchment ? 'bg-[#8c6239] hover:bg-[#704d2b] hover:shadow text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                  }`}
                >
                  Generate Interactive Map for "{selectedName.transliteration}"
                </button>
                <div className="text-[9.5px] text-center text-slate-500">
                  Transfers the Divine Attribute word coordinates directly to the Interactive Sarf Map.
                </div>
              </div>

            </div>
          ) : (
            <div className="p-10 border border-dashed border-current/10 rounded-2xl text-center text-xs text-slate-400 flex flex-col items-center justify-center h-full min-h-[300px]">
              <Info className="w-8 h-8 mb-2 opacity-40" />
              <span>Select any Divine Attribute Name from the left database list to unpack its comprehensive morphological structure.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
