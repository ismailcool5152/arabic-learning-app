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

interface QuranicVerbFormExample {
  word: string;
  translit: string;
  meaning: string;
  verse: string;
  desc: string;
}

interface VerbFormDetail {
  num: number;
  roman: string;
  arabic: string;
  title: string;
  summary: string;
  concept: string;
  pastTemplate: string;
  presentTemplate: string;
  masdarTemplate: string;
  participleTemplate: string;
  examples: QuranicVerbFormExample[];
}

const VERB_FORMS_DATABASE: VerbFormDetail[] = [
  {
    num: 1,
    roman: "I",
    arabic: "فَعَلَ",
    title: "The Base Ground Form (Al-Mujarrad)",
    summary: "Natively carries the raw un-augmented concept of the root.",
    concept: "Represents the foundational starting point. All modifications in Forms II through X are adjustments of this base block. The stem has simple vowels and contains the pure etymological core meaning.",
    pastTemplate: "فَعَلَ / فَعِلَ / فَعُلَ",
    presentTemplate: "يَفْعُلُ / يَفْعِلُ / يَفْعَلُ",
    masdarTemplate: "فَعْلٌ / فُعُولٌ / فِعَالَةٌ",
    participleTemplate: "فَاعِلٌ (Active) / مَفْعُولٌ (Passive)",
    examples: [
      {
        word: "خَلَقَ",
        translit: "Khalaqa",
        meaning: "He created",
        verse: "Al-’Alaq 96:1 — 'Who created mankind from a clinging clot.'",
        desc: "The absolute basic action of producing a coordinated physical structure from absolute nothingness."
      },
      {
        word: "عَلِمَ",
        translit: "‘Alima",
        meaning: "He knew / perceived",
        verse: "Al-Baqarah 2:255 — 'He knows what is before them and what will be after them.'",
        desc: "Indicates having direct cognitive possession of true static reality."
      }
    ]
  },
  {
    num: 2,
    roman: "II",
    arabic: "فَعَّلَ",
    title: "Causative & Intensive Gradualness (Taf’īl)",
    summary: "Doubles the second letter to create intense, repetitive, or step-by-step action.",
    concept: "Converts an intransitive verb to transitive (causative), or intensely flags that the action is done repeatedly, with supreme effort, or piecemeal over a long timeline rather than all at once.",
    pastTemplate: "فَعَّلَ",
    presentTemplate: "يُفَعِّلُ",
    masdarTemplate: "تَفْعِيلٌ",
    participleTemplate: "مُفَعِّلٌ",
    examples: [
      {
        word: "نَزَّلَ",
        translit: "Nazzala",
        meaning: "Sent down gradually over time (revelation cycle)",
        verse: "Al-Furqan 25:32 — 'And those who disbelieve say, Why was the Qur'an not sent down to him all at once? Thus [it is] that We may strengthen thereby your heart. And We have spaced it (nazzalnāhu) in gradual recitation.'",
        desc: "The doubling of the middle root letter 'z' (نَزَّلَ) denotes that the Quran was dispatched piece-by-piece over 23 years, tailored to live human events."
      },
      {
        word: "عَلَّمَ",
        translit: "‘Allama",
        meaning: "He taught methodically / step-by-step",
        verse: "Al-’Alaq 96:4 — 'Who taught by the pen.'",
        desc: "Causative of ‘Alima (He knew). Doubling represents structured, progressive, and gradual instruction of knowledge blocks to humans."
      }
    ]
  },
  {
    num: 3,
    roman: "III",
    arabic: "فَاعَلَ",
    title: "Conative & Reciprocal Interaction (Mufā’alah)",
    summary: "Lengthens the first vowel to involve an opponent or interactive recipient.",
    concept: "Signifies active conative effort to carry out a verb against active resistance, or represents reciprocal action done with/against another equal entity.",
    pastTemplate: "فَاعَلَ",
    presentTemplate: "يُفَاعِلُ",
    masdarTemplate: "مُفَاعَلَةٌ / فِعَالٌ",
    participleTemplate: "مُفَاعِلٌ",
    examples: [
      {
        word: "جَاهَدَ",
        translit: "Jāhada",
        meaning: "Strived / struggled vigorously against resistance",
        verse: "Al-Ankabut 29:6 — 'And whoever strives only strives for [the benefit of] himself.'",
        desc: "Derived from J-H-D (effort). The long Alif (فَاعَلَ) highlights carrying out continuous spiritual or physical exertion against active, opposing negative forces."
      },
      {
        word: "قَاتَلَ",
        translit: "Qātala",
        meaning: "Engaged in interactive warfare / fought back",
        verse: "Al-Baqarah 2:190 — 'Fight in the way of Allah those who fight you.'",
        desc: "Unlike Form I Qatala (He killed, which is one-way), Form III Qātala represents a mutual, reciprocal exchange of battle between combatants."
      }
    ]
  },
  {
    num: 4,
    roman: "IV",
    arabic: "أَفْعَلَ",
    title: "Causative & Instantaneous Transmission (If’āl)",
    summary: "Adds prefix Alif to transition a verb into a single, complete, or sudden event.",
    concept: "Typically transitions a non-transitive root to transitive (making someone end up in that state). Contrasting with Form II, Form IV characterizes the output as a sudden, complete, or comprehensive single-stroke event.",
    pastTemplate: "أَفْعَلَ",
    presentTemplate: "يُفْعِلُ",
    masdarTemplate: "إِفْعَالٌ",
    participleTemplate: "مُفْعِلٌ",
    examples: [
      {
        word: "أَنزَلَ",
        translit: "Anzala",
        meaning: "Sent down in its entirety all at once",
        verse: "Al-Qadr 97:1 — 'Indeed, We sent it down (Anzalnāhu) during the Night of Decree.'",
        desc: "Unlike Form II Nazzala (gradual), Form IV Anzala indicates sending the entire Quran at once from the highest preserved celestial realm to the lowest heaven on a single momentous night."
      },
      {
        word: "أَسْلَمَ",
        translit: "Aslama",
        meaning: "Surrendered decisively / entered peace absolute",
        verse: "Al-Baqarah 2:131 — 'When his Lord said to him: Submit (Aslim)! He said: I submit (Aslamtu) to the Lord of the worlds.'",
        desc: "Transitioning oneself into a state of total, instantaneous, and unified spiritual surrender (Islam)."
      }
    ]
  },
  {
    num: 5,
    roman: "V",
    arabic: "تَفَعَّلَ",
    title: "Reflexive Gradual Acquisition (Tafa’’ul)",
    summary: "Combines prefix Ta- with Form II to show active personal absorption of a state.",
    concept: "Reflexive counterpart of Form II. It describes a subject actively working on themselves over a timeline to slowly absorb, acquire, or conform to the root quality.",
    pastTemplate: "تَفَعَّلَ",
    presentTemplate: "يَتَفَعَّلُ",
    masdarTemplate: "تَفَعُّلٌ",
    participleTemplate: "مُتَفَعِّلٌ",
    examples: [
      {
        word: "تَذَكَّرَ",
        translit: "Tadhakkara",
        meaning: "Conscientiously took reminders / reflected deeply",
        verse: "An-Nazi'at 79:35 — 'The Day when man will remember (Yatadhakkaru) what he strove for.'",
        desc: "Derived from Dhikr (remembering). Form V means actively and gradually pushing oneself to absorb lessons, taking reminders through deliberate self-rectification."
      },
      {
        word: "تَوَكَّلَ",
        translit: "Tawakkala",
        meaning: "Actively placed direct reliance for oneself",
        verse: "Hud 11:123 — 'So worship Him and rely (twakkal) upon Him.'",
        desc: "Represents the personal psychological act of anchoring one's security step-by-step onto the Divine shield."
      }
    ]
  },
  {
    num: 6,
    roman: "VI",
    arabic: "تَفَاعَلَ",
    title: "Mutual Reciprocity & Simulation (Tafā’ul)",
    summary: "Combines prefix Ta- with Form III to indicate group reciprocity.",
    concept: "Expresses absolute reciprocal cooperation or joint participation of multiple entities where everyone is both agent and patient. Can also signify a simulated state (e.g. pretending to be...).",
    pastTemplate: "تَفَاعَلَ",
    presentTemplate: "يَتَفَاعَلُ",
    masdarTemplate: "تَفَاعُلٌ",
    participleTemplate: "مُتَفَاعِلٌ",
    examples: [
      {
        word: "تَسَاءَلَ",
        translit: "Tasā'ala",
        meaning: "They inquired / questioned one another",
        verse: "An-Naba 78:1 — 'About what are they asking one another (Yatasā'alūn)?'",
        desc: "Demonstrates a collective web of conversation where individuals are mutually questioning each other back and forth."
      },
      {
        word: "تَعَاوَنُوا",
        translit: "Ta‘āwanū",
        meaning: "Cooperate mutually with each other",
        verse: "Al-Ma'idah 5:2 — 'And cooperate in righteousness and piety.'",
        desc: "A collective command requiring continuous mutual networking and reciprocal reinforcement of righteous activities."
      }
    ]
  },
  {
    num: 7,
    roman: "VII",
    arabic: "اِنْفَعَلَ",
    title: "Passive Yielding & Natural Consequence (Infi’āl)",
    summary: "Adds prefix In- to represent non-volitional yielding to a force.",
    concept: "Represents absolute passive obedience. The subject yields fully to an external physical force. Because of this, Form VII is strictly intransitive (requires no direct object).",
    pastTemplate: "اِنْفَعَلَ",
    presentTemplate: "يَنْفَعِلُ",
    masdarTemplate: "اِنْفِعَالٌ",
    participleTemplate: "مُنْفَعِلٌ",
    examples: [
      {
        word: "ٱنفَلَقَ",
        translit: "Anfalaqa",
        meaning: "It parted / split open passively",
        verse: "Ash-Shu'ara 26:63 — 'Strike the sea with your staff. And it split apart (Fanfalaqa).'",
        desc: "The sea split passively, as an immediate, effortless physical yielding to the divine pressure applied by Moses' staff."
      },
      {
        word: "ٱنثَجَسَتْ",
        translit: "Anbajasat",
        meaning: "It gushed forth passively from rock",
        verse: "Al-A'raf 7:160 — 'And there gushed forth (Fanbajasat) from it twelve springs.'",
        desc: "The passive bursting of water yielding directly to hydrostatic relief inside the struck stone."
      }
    ]
  },
  {
    num: 8,
    roman: "VIII",
    arabic: "اِفْتَعَلَ",
    title: "Reflexive Earnest Acquisition (Ifti’āl)",
    summary: "Adds infix -ta- to indicate personal striving and custom gains.",
    concept: "Represents performing the action of the root for oneself, engaging personal focus, specialization, or hard active labor to acquire or appropriate the state for one's own storage.",
    pastTemplate: "اِفْتَعَلَ",
    presentTemplate: "يَفْتَعِلُ",
    masdarTemplate: "اِفْتِعَالٌ",
    participleTemplate: "مُفْتَعِلٌ",
    examples: [
      {
        word: "ٱكْتَسَبَ",
        translit: "Iktasaba",
        meaning: "Earned with concentrated personal effort",
        verse: "Al-Baqarah 2:286 — 'It gets what it has earned (Kasabat - Form I), and against it is what it has earned with effort (Iktasabat - Form VIII).'",
        desc: "Classic verse contrast: Form I Kasabat is used for simple passive/reflex actions, whereas Form VIII Iktasabat is used for deliberate, calculated, intensive earning of outcomes requiring heavy individual culpability."
      },
      {
        word: "ٱتَّبَعَ",
        translit: "Ittaba‘a",
        meaning: "Earnestly conformed to and followed",
        verse: "Yunus 10:109 — 'And follow (wattabi‘) what is revealed to you.'",
        desc: "Implies a highly disciplined, deliberate, and proactive alignment of one's entire life with the revelation."
      }
    ]
  },
  {
    num: 9,
    roman: "IX",
    arabic: "اِفْعَلَّ",
    title: "Somatic Transformations & Colors (If’ilāl)",
    summary: "Rare form used solely for intense colors and physical traits/defects.",
    concept: "Represents dramatic, qualitative, or permanent bodily shifts in color or somatic status. Syntactically very rare but possesses concentrated, picturesque semantic focus.",
    pastTemplate: "اِفْعَلَّ",
    presentTemplate: "يَفْعَلُّ",
    masdarTemplate: "اِفْعِلَالٌ",
    participleTemplate: "مُفْعَلٌّ",
    examples: [
      {
        word: "ٱبْيَضَّتْ",
        translit: "Ibyaddat",
        meaning: "It turned radiant white / brightened completely",
        verse: "Al-Imran 3:106 — 'On the Day some faces will turn white (Tabyaddu)...'",
        desc: "Describes the supernatural physical brightening of positive human faces echoing absolute righteous purity in the hereafter, or Jacob's eyes whitening from blinding grief."
      },
      {
        word: "ٱسْوَدَّتْ",
        translit: "Iswaddat",
        meaning: "It turned shades of dark / blackened",
        verse: "Al-Imran 3:106 — '...and some faces will turn black (Taswaddu).'",
        desc: "Refers to the somatic shade of sorrow and failure appearing on specific faces during deep cosmic reckoning."
      }
    ]
  },
  {
    num: 10,
    roman: "X",
    arabic: "اِسْتَفْعَلَ",
    title: "Supplicating, Seeking & Deeming (Istif’āl)",
    summary: "Adds prefix Ista- to request, beg for, or deem the root's quality.",
    concept: "Adds the letters 's-t' (س-t), indicating actively seeking, requesting, or asking for the base action to occur. It can also signify deeming or considering something to possess the root's quality (e.g. considering great = arrogant).",
    pastTemplate: "اِسْتَفْعَلَ",
    presentTemplate: "يَسْتَفْعِلُ",
    masdarTemplate: "اِسْتِفْعَالٌ",
    participleTemplate: "مُسْتَفْعِلٌ",
    examples: [
      {
        word: "ٱسْتَغْفَرَ",
        translit: "Istaghfara",
        meaning: "Begged and negotiated for protective cover / forgiveness",
        verse: "An-Nisa 4:106 — 'And seek forgiveness (Wastaghfiri) of Allah. Indeed, Allah is ever Forgiving and Merciful.'",
        desc: "Derived from Ghafr (protective armor/coverage). Form X 'Ista' turns this into an active, pleading request to obtain that protective coverage against the fire."
      },
      {
        word: "ٱسْتَكْبَرَ",
        translit: "Istakbara",
        meaning: "Deemed himself immense / puffed up with arrogance",
        verse: "Al-Baqarah 2:34 — 'He refused and deemed himself great (Wastakbara) and was of the disbelievers.'",
        desc: "Derived from K-B-R (grandeur/greatness). Represents a subjective delusion where the subject considers or deems himself massive, grand, and above accountability."
      }
    ]
  }
];

interface ConjugationResult {
  past: string;
  pastTranslit: string;
  present: string;
  presentTranslit: string;
  participle: string;
  participleTranslit: string;
  masdar: string;
  masdarTranslit: string;
}

function conjugateRootForForm(c1: string, c2: string, c3: string, formNum: number): ConjugationResult {
  const rootStr = `${c1}${c2}${c3}`;

  if (formNum === 1) {
    if (rootStr === 'علم') {
      return {
        past: "عَلِمَ", pastTranslit: "‘Alima",
        present: "يَعْلَمُ", presentTranslit: "Ya‘lamu",
        participle: "عَالِمٌ", participleTranslit: "‘Ālimun",
        masdar: "عِلْمٌ", masdarTranslit: "‘Ilmun"
      };
    }
    if (rootStr === 'نزل') {
      return {
        past: "نَزَلَ", pastTranslit: "Nazala",
        present: "يَنْزِلُ", presentTranslit: "Yanzilu",
        participle: "نَازِلٌ", participleTranslit: "Nāzilun",
        masdar: "نُزُولٌ", masdarTranslit: "Nuzūlun"
      };
    }
    if (rootStr === 'سلم') {
      return {
        past: "سَلِمَ", pastTranslit: "Salima",
        present: "يَسْلَمُ", presentTranslit: "Yaslamu",
        participle: "سَالِمٌ", participleTranslit: "Sālimun",
        masdar: "سَلَامَةٌ", masdarTranslit: "Salāmatun"
      };
    }
    return {
      past: `${c1}َ${c2}َ${c3}َ`, pastTranslit: `${c1}a${c2}a${c3}a`,
      present: `يَ${c1}ْ${c2}ُ${c3}ُ`, presentTranslit: `ya${c1}${c2}u${c3}u`,
      participle: `${c1}َامِ${c3}ٌ`, participleTranslit: `${c1}ā${c2}i${c3}un`,
      masdar: `${c1}َ${c2}ْ${c3}ٌ`, masdarTranslit: `${c1}a${c2}${c3}un`
    };
  }

  if (formNum === 2) {
    return {
      past: `${c1}َ${c2}َّ${c3}َ`,
      pastTranslit: `${c1}a${c2}ba${c3}a`.replace('b', c2),
      present: `يُ${c1}َ${c2}ِّ${c3}ُ`,
      presentTranslit: `yu${c1}a${c2}bi${c3}u`.replace('b', c2),
      participle: `مُ${c1}َ${c2}ِّ${c3}ٌ`,
      participleTranslit: `mu${c1}a${c2}bi${c3}un`.replace('b', c2),
      masdar: `تَ${c1}ْ${c2}ِ${c3}ٌ`,
      masdarTranslit: `ta${c1}${c2}ī${c3}un`
    };
  }

  if (formNum === 3) {
    return {
      past: `${c1}َا${c2}َ${c3}َ`,
      pastTranslit: `${c1}ā${c2}a${c3}a`,
      present: `يُ${c1}َا${c2}ِّ${c3}ُ`,
      presentTranslit: `yu${c1}ā${c2}i${c3}u`,
      participle: `مُ${c1}َا${c2}ِّ${c3}ٌ`,
      participleTranslit: `mu${c1}ā${c2}i${c3}un`,
      masdar: `مُ${c1}َا${c2}َ${c3}َةٌ`,
      masdarTranslit: `mu${c1}ā${c2}a${c3}atun`
    };
  }

  if (formNum === 4) {
    return {
      past: `أَ${c1}ْ${c2}َ${c3}َ`,
      pastTranslit: `a${c1}${c2}a${c3}a`,
      present: `يُ${c1}ْ${c2}ِ${c3}ُ`,
      presentTranslit: `yu${c1}${c2}i${c3}u`,
      participle: `مُ${c1}ْ${c2}ِ${c3}ٌ`,
      participleTranslit: `mu${c1}${c2}i${c3}un`,
      masdar: `إِ${c1}ْ${c2}َاءٌ`.replace('ء', c3),
      masdarTranslit: `i${c1}${c2}ā${c3}un`
    };
  }

  if (formNum === 5) {
    return {
      past: `تَ${c1}َ${c2}َّ${c3}َ`,
      pastTranslit: `ta${c1}a${c2}ba${c3}a`.replace('b', c2),
      present: `يَتَ${c1}َ${c2}َّ${c3}ُ`,
      presentTranslit: `yata${c1}a${c2}ba${c3}u`.replace('b', c2),
      participle: `مُتَ${c1}َ${c2}ِّ${c3}ٌ`,
      participleTranslit: `muta${c1}a${c2}bi${c3}un`.replace('b', c2),
      masdar: `تَ${c1}َ${c2}ُّ${c3}ٌ`,
      masdarTranslit: `ta${c1}a${c2}bu${c3}un`.replace('b', c2)
    };
  }

  if (formNum === 6) {
    return {
      past: `تَ${c1}َا${c2}َ${c3}َ`,
      pastTranslit: `ta${c1}ā${c2}a${c3}a`,
      present: `يَتَ${c1}َا${c2}َ${c3}ُ`,
      presentTranslit: `yata${c1}ā${c2}a${c3}u`,
      participle: `مُتَ${c1}َا${c2}ِّ${c3}ٌ`,
      participleTranslit: `muta${c1}ā${c2}i${c3}un`,
      masdar: `تَ${c1}َا${c2}ُ${c3}ٌ`,
      masdarTranslit: `ta${c1}ā${c2}u${c3}un`
    };
  }

  if (formNum === 7) {
    return {
      past: `اِنْ${c1}َ${c2}َ${c3}َ`,
      pastTranslit: `in${c1}a${c2}a${c3}a`,
      present: `يَنْ${c1}َ${c2}ِ${c3}ُ`,
      presentTranslit: `yan${c1}a${c2}i${c3}u`,
      participle: `مُنْ${c1}َ${c2}ِ${c3}ٌ`,
      participleTranslit: `mun${c1}a${c2}i${c3}un`,
      masdar: `اِنْ${c1}ِ${c2}َاءٌ`.replace('ء', c3),
      masdarTranslit: `in${c1}${c2}ā${c3}un`
    };
  }

  if (formNum === 8) {
    return {
      past: `اِ${c1}ْتَ${c2}َ${c3}َ`,
      pastTranslit: `i${c1}ta${c2}a${c3}a`,
      present: `يَ${c1}ْتَ${c2}ِ${c3}ُ`,
      presentTranslit: `ya${c1}ta${c2}i${c3}u`,
      participle: `مُ${c1}ْتَ${c2}ِ${c3}ٌ`,
      participleTranslit: `mu${c1}ta${c2}i${c3}un`,
      masdar: `اِ${c1}ْتِ${c2}َاءٌ`.replace('ء', c3),
      masdarTranslit: `i${c1}ti${c2}ā${c3}un`
    };
  }

  if (formNum === 9) {
    return {
      past: `اِ${c1}ْ${c2}َ${c3}َّ`,
      pastTranslit: `i${c1}${c2}a${c3}a`,
      present: `يَ${c1}ْ${c2}َ${c3}َّ`,
      presentTranslit: `ya${c1}${c2}a${c3}a`,
      participle: `مُ${c1}ْ${c2}َ${c3}ٌّ`,
      participleTranslit: `mu${c1}${c2}a${c3}un`,
      masdar: `اِ${c1}ْ${c2}ِ${c3}َارٌّ`,
      masdarTranslit: `i${c1}${c2}i${c3}ārun`
    };
  }

  if (formNum === 10) {
    return {
      past: `اِسْتَ${c1}ْ${c2}َ${c3}َ`,
      pastTranslit: `ista${c1}${c2}a${c3}a`,
      present: `يَسْتَ${c1}ْ${c2}ِ${c3}ُ`,
      presentTranslit: `yasta${c1}${c2}i${c3}u`,
      participle: `مُسْتَ${c1}ْ${c2}ِ${c3}ٌ`,
      participleTranslit: `musta${c1}${c2}i${c3}un`,
      masdar: `اِسْتِ${c1}ْ${c2}َاءٌ`.replace('ء', c3),
      masdarTranslit: `isti${c1}${c2}ā${c3}un`
    };
  }

  return {
    past: "...", pastTranslit: "...",
    present: "...", presentTranslit: "...",
    participle: "...", participleTranslit: "...",
    masdar: "...", masdarTranslit: "..."
  };
}

interface IrabNounDetail {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  description: string;
  rafForm: string;
  rafTranslit: string;
  rafSign: string;
  nasbForm: string;
  nasbTranslit: string;
  nasbSign: string;
  jarrForm: string;
  jarrTranslit: string;
  jarrSign: string;
  quranicExample: {
    verse: string;
    text: string;
    translation: string;
    explanation: string;
  };
}

const IRAB_NOUN_TYPES_DATABASE: IrabNounDetail[] = [
  {
    id: "singular",
    nameArabic: "الاِسْمُ الْمُفْرَدُ",
    nameEnglish: "Singular Noun",
    description: "Standard single entity nouns. They represent the foundational declension standard in Arabic, utilizing short vowel updates at the very final character of the word stem.",
    rafForm: "كِتَابٌ",
    rafTranslit: "Kitābun (A Book)",
    rafSign: "Standard Dammah (ـٌ)",
    nasbForm: "كِتَابًا",
    nasbTranslit: "Kitāban (A Book)",
    nasbSign: "Standard Fathah (ـً)",
    jarrForm: "كِتَابٍ",
    jarrTranslit: "Kitābin (A Book)",
    jarrSign: "Standard Kasrah (ـٍ)",
    quranicExample: {
      verse: "Al-Baqarah 2:2 — ذَلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ",
      text: "ذَٰلِكَ ٱلْكِتَٰبُ",
      translation: "That is the Book...",
      explanation: "The word الْكِتَابُ (Al-Kitābu) ends with a clear Dammah (ـُ) indicating the Nominative state (Raf') because it acts as the primary subject of the nominal sentence (Mubtada' / Khabar)."
    }
  },
  {
    id: "dual",
    nameArabic: "الْمُثَنَّى",
    nameEnglish: "Dual Noun (Exactly Two)",
    description: "Represents exactly two entities. Instead of using short ending vowels, it utilizes letter swaps (Alif vs. Ya) before the terminal particle.",
    rafForm: "كِتَابَانِ",
    rafTranslit: "Kitābāni (Two Books)",
    rafSign: "Letter Alif (ـانِ)",
    nasbForm: "كِتَابَيْنِ",
    nasbTranslit: "Kitābayni (Two Books)",
    nasbSign: "Letter Ya (ـَيْنِ)",
    jarrForm: "كِتَابَيْنِ",
    jarrTranslit: "Kitābayni (Two Books)",
    jarrSign: "Letter Ya (ـَيْنِ)",
    quranicExample: {
      verse: "Ar-Rahman 55:46 — وَلِمَنْ خَافَ مَقَامَ رَبِّهِ جَنَّتَانِ",
      text: "جَنَّتَانِ",
      translation: "...are two gardens.",
      explanation: "The word جَنَّتَانِ (Jannatāni) represents dual gardens. It ends with an Alif-Noon (ـَانِ) indicating the Nominative state (Raf') acting as the deferred subject of the verse."
    }
  },
  {
    id: "mascPlural",
    nameArabic: "جَمْعُ الْمُذَكَّرِ السَّالِمُ",
    nameEnglish: "Sound Masculine Plural",
    description: "Represents three or more masculine or mixed-group entities. Declension is marked by swapping Waw (Raf') for Ya (Nasb and Jarr).",
    rafForm: "مُسْلِمُونَ",
    rafTranslit: "Muslimūna (Muslims)",
    rafSign: "Letter Waw (ـُونَ)",
    nasbForm: "مُسْلِمِينَ",
    nasbTranslit: "Muslimīna (Muslims)",
    nasbSign: "Letter Ya (ـِينَ)",
    jarrForm: "مُسْلِمِينَ",
    jarrTranslit: "Muslimīna (Muslims)",
    jarrSign: "Letter Ya (ـِينَ)",
    quranicExample: {
      verse: "Al-Mu'minun 23:1 — قَدْ أَفْلَحَ الْمُؤْمِنُونَ",
      text: "ٱلْمُؤْمِنُونَ",
      translation: "Successful indeed are the Believers.",
      explanation: "The word الْمُؤْمِنُونَ (Al-Mu'minūna) carries a Waw-Noon (ـُونَ) suffix, declaring the Nominative state (Raf') because it acts as the active executor (Fā'il) of the verb 'Aflaha' (He succeeded)."
    }
  },
  {
    id: "femPlural",
    nameArabic: "جَمْعُ الْمُؤَنَّثِ السَّالِمُ",
    nameEnglish: "Sound Feminine Plural",
    description: "Represents three or more feminine entities. Note the CRITICAL rule: It does NOT permit Fathah! Kasrah replaces Fathah in the Accusative (Nasb) state.",
    rafForm: "مُسْلِمَاتٌ",
    rafTranslit: "Muslimātun (Muslim Women)",
    rafSign: "Standard Dammah (ـَاتٌ)",
    nasbForm: "مُسْلِمَاتٍ",
    nasbTranslit: "Muslimātin (Muslim Women)",
    nasbSign: "Kasrah instead of Fathah! (ـَاتٍ)",
    jarrForm: "مُسْلِمَاتٍ",
    jarrTranslit: "Muslimātin (Muslim Women)",
    jarrSign: "Standard Kasrah (ـَاتٍ)",
    quranicExample: {
      verse: "Al-Jathiyah 45:22 — وَخَلَقَ اللَّهُ السَّمَاوَاتِ وَالْأَرْضَ بِالْحَقِّ",
      text: "ٱلسَّمَٰوَٰتِ",
      translation: "And Allah created the heavens...",
      explanation: "The word السَّمَاوَاتِ (Al-Samāwāti) is in the Accusative state (Nasb) as the direct object of 'Khalaqa' (He created). Yet, because it is a Sound Feminine Plural, it takes a Kasrah (ـِ) instead of a Fathah!"
    }
  },
  {
    id: "asmaKhamsah",
    nameArabic: "الأَسْمَاءُ الْخَمْسَةُ",
    nameEnglish: "The Five Nouns",
    description: "Five special classical words (Ab: Father, Akh: Brother, Ham: Father-in-law, Fu: Mouth, Dhu: Possessor) that express their cases by changing long vowels (Waw, Alif, Ya) when coupled with a possessive pronoun.",
    rafForm: "أَبُوكَ",
    rafTranslit: "Abūka (Your Father)",
    rafSign: "Long Vowel Waw (و)",
    nasbForm: "أَبَاكَ",
    nasbTranslit: "Abāka (Your Father)",
    nasbSign: "Long Vowel Alif (ا)",
    jarrForm: "أَبِيكَ",
    jarrTranslit: "Abīka (Your Father)",
    jarrSign: "Long Vowel Ya (ي)",
    quranicExample: {
      verse: "Yusuf 12:63 — يَا أَبَانَا مُنِعَ مِنَّا الْكَيْلُ",
      text: "أَبَانَا",
      translation: "O our Father, measure has been denied to us...",
      explanation: "أَبَانَا (Abānā) uses the long vowel Alif (ا) representing the Accusative state (Nasb) because it is the object of vocative calling (Munada)."
    }
  }
];

interface IrabSentenceDetail {
  id: string;
  governorName: string;
  governorArabic: string;
  renderedSentence: string;
  translation: string;
  description: string;
  notes: string;
  words: Array<{
    arabic: string;
    role: string;
    caseState: string;
    vowel: string;
    explanation: string;
    colorClass: string;
  }>;
}

const IRAB_SENTENCE_LAB: IrabSentenceDetail[] = [
  {
    id: "default",
    governorName: "Baseline Nominal Sentence",
    governorArabic: "الْجُمْلَةُ الاِسْمِيَّةُ الْأَصْلِيَّةُ",
    renderedSentence: "ٱلْأَمْرُ قَرِيبٌ",
    translation: "The matter is near.",
    description: "The baseline nominal sentence consists of a Subject (Mubtada') and Predicate (Khabar). With no external modifying particles, both elements default to the Nominative (Raf') state.",
    notes: "Both words balance each other in Raf' with Dammah endings.",
    words: [
      {
        arabic: "ٱلْأَمْرُ",
        role: "Mubtada' (Subject)",
        caseState: "Raf' (Nominative)",
        vowel: "Dammah (ـُ)",
        explanation: "The subject starting the sentence. By default, it takes the Nominative state (Raf') with a standard Dammah.",
        colorClass: "text-amber-500"
      },
      {
        arabic: "قَرِيبٌ",
        role: "Khabar (Predicate)",
        caseState: "Raf' (Nominative)",
        vowel: "Tanween Dammah (ـٌ)",
        explanation: "Provides information about the subject, completing the sentence. Takes the Nominative state (Raf') with double dammahs.",
        colorClass: "text-[#d97706]"
      }
    ]
  },
  {
    id: "inna",
    governorName: "Indeed (إِنَّ)",
    governorArabic: "إِنَّ وَأَخَوَاتُهَا (Accusative Particle)",
    renderedSentence: "إِنَّ ٱلْأَمْرَ قَرِيبٌ",
    translation: "Indeed, the matter is near.",
    description: "When the strengthening particle إِنَّ (Inna) enters a nominal sentence, it acts as a Governor. It actively attacks the Subject, dragging it down to the Accusative (Nasb) state. The Predicate remains raised in the Nominative (Raf') state.",
    notes: "Subject undergoes an active chemical vowel shift (ُ to َ) from Raf' to Nasb.",
    words: [
      {
        arabic: "إِنَّ",
        role: "Harf Nasb (Accusative Particle)",
        caseState: "Mabni (Fixed)",
        vowel: "Fathah (ـَ)",
        explanation: "The governor. It is a particle of emphasis that acts upon the sentence.",
        colorClass: "text-red-400 font-bold"
      },
      {
        arabic: "ٱلْأَمْرَ",
        role: "Ism Inna (Subject of Inna)",
        caseState: "Nasb (Accusative)",
        vowel: "Fathah (ـَ)",
        explanation: "Formerly the Mubtada'. Because of Inna, its case has flipped to Accusative (Nasb), accepting a clear Fathah.",
        colorClass: "text-emerald-500 font-extrabold"
      },
      {
        arabic: "قَرِيبٌ",
        role: "Khabar Inna (Predicate of Inna)",
        caseState: "Raf' (Nominative)",
        vowel: "Tanween Dammah (ـٌ)",
        explanation: "Remains in the Nominative state (Raf') under the protection of Inna as its predicate.",
        colorClass: "text-amber-500"
      }
    ]
  },
  {
    id: "kana",
    governorName: "Was / Is (كَانَ)",
    governorArabic: "كَانَ وَأَخَوَاتُهَا (Ablative/Deficient Verb)",
    renderedSentence: "كَانَ ٱلْأَمْرُ قَرِيبًا",
    translation: "The matter was near.",
    description: "The auxiliary verb كَانَ (Kāna) does the exact opposite of إِنَّ. It leaves the Subject alone in the raised Nominative (Raf') state, but attacks the Predicate, hammering it down to the Accusative (Nasb) state.",
    notes: "Predicate undergoes a dramatic vowel shift (ٌ to ًا), adding the supporting Alif of Tanween Fathah.",
    words: [
      {
        arabic: "كَانَ",
        role: "Fi'l Naqis (Deficient Verb)",
        caseState: "Mabni (Fixed Past)",
        vowel: "Fathah (ـَ)",
        explanation: "The governor. A past-tense verb that lacks a standard subject/object, requiring a complete clause.",
        colorClass: "text-purple-400 font-bold"
      },
      {
        arabic: "ٱلْأَمْرُ",
        role: "Ism Kāna (Subject of Kāna)",
        caseState: "Raf' (Nominative)",
        vowel: "Dammah (ـُ)",
        explanation: "Kept in the raised Nominative (Raf') state as the active topic of the state of being.",
        colorClass: "text-amber-500"
      },
      {
        arabic: "قَرِيبًا",
        role: "Khabar Kāna (Predicate of Kāna)",
        caseState: "Nasb (Accusative)",
        vowel: "Tanween Fathah + Alif (ـًا)",
        explanation: "Slammed into the Accusative (Nasb) state. Must display the double Fathah supported by a helper letter Alif.",
        colorClass: "text-emerald-500 font-extrabold"
      }
    ]
  },
  {
    id: "preposition",
    governorName: "Preposition (فِي)",
    governorArabic: "حُرُوفُ الْجَرِّ (Prepositional Governor)",
    renderedSentence: "فِي ٱلْأَمْرِ قُرْبٌ",
    translation: "In the matter is nearness.",
    description: "Prepositions (like فِي, مِنْ, عَلَى, لِـ) are extremely localized governors. They only affect the word directly succeeding them, compelling it into the Genitive (Jarr) state, taking a Kasrah ending.",
    notes: "Direct prepositional governance forces the noun into deep genitive casing.",
    words: [
      {
        arabic: "فِي",
        role: "Harf Jarr (Preposition)",
        caseState: "Mabni (Fixed)",
        vowel: "Sukun (ـْ)",
        explanation: "The governor preposition meaning 'in'. Drives the adjacent noun to Genitive.",
        colorClass: "text-pink-400 font-bold"
      },
      {
        arabic: "ٱلْأَمْرِ",
        role: "Ism Majrur (Prepositional Object)",
        caseState: "Jarr (Genitive)",
        vowel: "Kasrah (ـِ)",
        explanation: "Compelled into the Genitive state (Jarr) because of the preposition 'Fī'. Proudly exposes a Kasrah under its final letter.",
        colorClass: "text-pink-500 font-extrabold"
      },
      {
        arabic: "قُرْبٌ",
        role: "Mubtada' Mu'akhkhar (Delayed Subject)",
        caseState: "Raf' (Nominative)",
        vowel: "Tanween Dammah (ـٌ)",
        explanation: "The delayed subject of the sentence. Still Nominative because it is the fundamental noun of expression.",
        colorClass: "text-amber-500"
      }
    ]
  }
];

export default function ArabicBasics({ theme }: ArabicBasicsProps) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // State for interactive sentence explorer
  const [activeSentenceId, setActiveSentenceId] = useState<number>(0);
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);

  // States for Al-I'rab Explorer
  const [selectedIrabNounType, setSelectedIrabNounType] = useState<string>('singular');
  const [selectedIrabGovernor, setSelectedIrabGovernor] = useState<string>('default');

  // State for interactive mini-quiz
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  // States for Verb Forms Section
  const [selectedFormNum, setSelectedFormNum] = useState<number>(2); // Default to Form II because it's beautiful
  const [sandboxRootIdx, setSandboxRootIdx] = useState<number>(0);

  const sandboxRoots = [
    { label: "ك - ت - ب (Prescribing / Writing)", letters: ['ك', 'ت', 'ب'], mean: "to write / prescribe" },
    { label: "ع - ل - م (Knowledge / Instruction)", letters: ['ع', 'ل', 'م'], mean: "to know / teach" },
    { label: "ن - ز - ل (Revelation / Descent)", letters: ['ن', 'ز', 'ل'], mean: "to descend / send down" },
    { label: "خ - ل - ق (Proportioning / Creating)", letters: ['خ', 'ل', 'ق'], mean: "to create / structure" },
    { label: "س - ل - م (Completeness & surrender)", letters: ['س', 'ل', 'م'], mean: "to be safe / submit" }
  ];

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
      {activeSection === 'cases' && (() => {
        const nounDetail = IRAB_NOUN_TYPES_DATABASE.find(n => n.id === selectedIrabNounType) || IRAB_NOUN_TYPES_DATABASE[0];
        const sentenceDetail = IRAB_SENTENCE_LAB.find(s => s.id === selectedIrabGovernor) || IRAB_SENTENCE_LAB[0];

        return (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Block with Concept explanation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-current/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className={`w-5 h-5 ${fontColorThemeText}`} />
                  <h3 className="text-base font-bold uppercase tracking-wider">
                    Linguistic Case Declension & Casing (الإعراب - Al-I‘rāb)
                  </h3>
                </div>
                <p className="text-xs opacity-80 leading-relaxed max-w-2xl">
                  Classical Arabic is a structural masterpiece. The ending vowel or letters of a noun change dynamically based on its role (Subject, Object, Prepositional). This changes the actual meaning of the verse.
                </p>
              </div>

              {/* Informative Help Badge */}
              <div className={`p-3 rounded-xl border max-w-xs text-[10px] leading-relaxed flex gap-2 items-start ${innerCardBgClass}`}>
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">The Opposite: Al-Binā’ (البِنَاء)</span>
                  Some words are <span className="font-semibold text-purple-400">Mabnī (Built)</span>. Their endings are completely permanent and never change regardless of case governors (e.g. pronouns like هُوَ, هِيَ).
                </div>
              </div>
            </div>

            {/* TWO SUB-SECTIONS */}
            <div className="space-y-8">
              
              {/* SECTION A: THE NOUN CASE ENDINGS REFERENCE LAB */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-455-500">
                    A: Master Case-Ending Declension Explorer
                  </h4>
                </div>
                
                {/* Visual selector buttons */}
                <div className="flex flex-wrap gap-2">
                  {IRAB_NOUN_TYPES_DATABASE.map((nounSpec) => (
                    <button
                      key={nounSpec.id}
                      onClick={() => setSelectedIrabNounType(nounSpec.id)}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                        selectedIrabNounType === nounSpec.id
                          ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/10' : 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-500/10')
                          : 'bg-transparent border-current/10 hover:bg-current/5'
                      }`}
                    >
                      <span className="font-serif text-sm font-black text-amber-500/90">{nounSpec.nameArabic}</span>
                      <span className="font-sans text-[10px] opacity-75">/ {nounSpec.nameEnglish}</span>
                    </button>
                  ))}
                </div>

                {/* Grid comparing the three states + Case study details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  
                  {/* Left Explanation of the Category */}
                  <div className="lg:col-span-4">
                    <div className={`p-5 rounded-2xl border ${innerCardBgClass} h-full flex flex-col justify-between`}>
                      <div className="space-y-2">
                        <span className="text-[9.5px] font-mono text-amber-500 uppercase font-bold tracking-widest block">
                          Noun Class Dynamics:
                        </span>
                        <h4 className="text-sm font-extrabold">{nounDetail.nameEnglish}</h4>
                        <p className="text-[11.5px] leading-relaxed opacity-90 font-sans">
                          {nounDetail.description}
                        </p>
                      </div>
                      
                      <div className="pt-3 border-t border-current/5 text-[9.5px] italic text-slate-400 mt-4">
                        * Note how duals, plurals, and standard nouns declare case differences through distinct mechanics.
                      </div>
                    </div>
                  </div>

                  {/* Right: Comparative State Cards */}
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* nominative state */}
                    <div className={`p-4 rounded-2xl border flex flex-col justify-between ${isParchment ? 'bg-white border-[#ebdcc3]' : 'bg-black/35 border-current/10'}`}>
                      <div className="space-y-1.5 pb-2 border-b border-current/5">
                        <span className="text-[9px] font-mono text-cyan-400 font-bold block uppercase tracking-wider">Subjective State</span>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-serif font-black text-[#8c6239] dark:text-amber-500">الرَّفْع (Al-Raf‘)</span>
                          <span className="text-[10px] font-mono opacity-60">Nominative</span>
                        </div>
                      </div>
                      
                      {/* Form Showcase */}
                      <div className="py-4 text-center space-y-1">
                        <span className="text-3xl font-serif font-black block tracking-wide text-current">
                          {nounDetail.rafForm}
                        </span>
                        <span className="text-[10.5px] font-mono font-bold text-amber-500 block">
                          / {nounDetail.rafTranslit} /
                        </span>
                      </div>

                      <div className={`p-2.5 rounded-lg text-[10px] text-center border border-current/5 ${innerCardBgClass}`}>
                        <span className="font-mono text-slate-400 block mb-0.5">DECLENSION SIGN</span>
                        <strong className="text-cyan-400 font-sans">{nounDetail.rafSign}</strong>
                      </div>
                    </div>

                    {/* accusative state */}
                    <div className={`p-4 rounded-2xl border flex flex-col justify-between ${isParchment ? 'bg-white border-[#ebdcc3]' : 'bg-black/35 border-current/10'}`}>
                      <div className="space-y-1.5 pb-2 border-b border-current/5">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold block uppercase tracking-wider">Objective State</span>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-serif font-black text-[#10b981]">النَّصْب (Al-Naṣb)</span>
                          <span className="text-[10px] font-mono opacity-60">Accusative</span>
                        </div>
                      </div>
                      
                      {/* Form Showcase */}
                      <div className="py-4 text-center space-y-1">
                        <span className="text-3xl font-serif font-black block tracking-wide text-emerald-500">
                          {nounDetail.nasbForm}
                        </span>
                        <span className="text-[10.5px] font-mono font-bold text-emerald-500 block">
                          / {nounDetail.nasbTranslit} /
                        </span>
                      </div>

                      <div className={`p-2.5 rounded-lg text-[10px] text-center border border-current/5 ${innerCardBgClass}`}>
                        <span className="font-mono text-slate-400 block mb-0.5">DECLENSION SIGN</span>
                        <strong className="text-emerald-400 font-sans">{nounDetail.nasbSign}</strong>
                      </div>
                    </div>

                    {/* genitive state */}
                    <div className={`p-4 rounded-2xl border flex flex-col justify-between ${isParchment ? 'bg-white border-[#ebdcc3]' : 'bg-black/35 border-current/10'}`}>
                      <div className="space-y-1.5 pb-2 border-b border-current/5">
                        <span className="text-[9px] font-mono text-pink-400 font-bold block uppercase tracking-wider">Prepositional State</span>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-serif font-black text-pink-500">الجَرّ (Al-Jarr)</span>
                          <span className="text-[10px] font-mono opacity-60">Genitive</span>
                        </div>
                      </div>
                      
                      {/* Form Showcase */}
                      <div className="py-4 text-center space-y-1">
                        <span className="text-3xl font-serif font-black block tracking-wide text-current">
                          {nounDetail.jarrForm}
                        </span>
                        <span className="text-[10.5px] font-mono font-bold text-pink-500 block">
                          / {nounDetail.jarrTranslit} /
                        </span>
                      </div>

                      <div className={`p-2.5 rounded-lg text-[10px] text-center border border-current/5 ${innerCardBgClass}`}>
                        <span className="font-mono text-slate-400 block mb-0.5">DECLENSION SIGN</span>
                        <strong className="text-pink-400 font-sans">{nounDetail.jarrSign}</strong>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Selected Noun's Quranic Proof Case Study */}
                <div className={`p-5 rounded-2xl border ${isParchment ? 'bg-[#f6ebd7]/30 border-amber-200/55' : 'bg-slate-950/40 border-current/10'} space-y-4`}>
                  <div className="flex items-center gap-2 border-b border-current/5 pb-2">
                    <BookMarked className="w-4 h-4 text-amber-500" />
                    <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-current">
                      Divine Verse Case Study (Quranic Proof)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Verse Quote */}
                    <div className="md:col-span-8 space-y-3 text-right" style={{ direction: 'rtl' }}>
                      <span className="text-2xl font-serif font-black text-current leading-relaxed block tracking-wide">
                        {nounDetail.quranicExample.verse.split(' — ')[1]}
                      </span>
                      <div className="text-left font-mono text-[9px] text-slate-400 uppercase tracking-widest leading-relaxed mt-1" style={{ direction: 'ltr' }}>
                        Source: {nounDetail.quranicExample.verse.split(' — ')[0]}
                      </div>
                      <div className="text-left font-sans text-xs italic opacity-90 leading-relaxed pl-1" style={{ direction: 'ltr' }}>
                        "{nounDetail.quranicExample.translation}"
                      </div>
                    </div>

                    {/* Voweling analysis */}
                    <div className="md:col-span-4 h-full">
                      <div className={`p-4 rounded-xl border h-full flex flex-col justify-center border-current/10 ${isParchment ? 'bg-white' : 'bg-black/30'}`}>
                        <div className="flex items-center gap-2 pb-2 border-b border-current/5 mb-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
                          <span className="text-[10px] font-mono font-bold uppercase text-emerald-500">Grammar Resolution:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-95">
                          {nounDetail.quranicExample.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION B: INTUITIVE SENTENCE GOVERNOR LAB (عوامل الإعراب) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#0ea5e9]">
                    B: Interactive Casing Governor Laboratory (عوامل الإعراب)
                  </h4>
                </div>
                <p className="text-xs opacity-90 leading-relaxed max-w-3xl">
                  Nouns are not isolated; their cases are actively changed by surrounding keywords called **Governors (العوامل - Al-A‘wāmil)**. Force-apply distinct operators onto our nominal sentence to witness their chemical action live!
                </p>

                {/* Governor Selectors */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {IRAB_SENTENCE_LAB.map((gov) => {
                    const isSelected = selectedIrabGovernor === gov.id;
                    return (
                      <button
                        key={gov.id}
                        onClick={() => setSelectedIrabGovernor(gov.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? (isParchment ? 'bg-[#ebd8c3]/40 border-[#8c6239]' : isCosmic ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 shadow-inner' : 'bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-inner')
                            : 'bg-transparent border-current/10 hover:bg-current/5'
                        }`}
                      >
                        <div className="text-[9px] font-mono opacity-50 uppercase tracking-widest mb-1">Governor Option</div>
                        <span className="text-xs font-bold block">{gov.governorName}</span>
                        <span className="text-[10px] italic opacity-60 line-clamp-1">{gov.notes}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sentences Interactive Display Board */}
                <div className={`p-6 rounded-2xl border ${isParchment ? 'bg-white border-[#ebdcc3]' : 'bg-black/30 border-current/10'} space-y-6`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-current/5 pb-3.5 gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-[10px] font-mono font-bold uppercase text-current">
                        Grammar Sandbox Active View:
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono ${badgeThemeBg}`}>
                        {sentenceDetail.governorArabic}
                      </span>
                    </div>

                    <p className="text-xs italic text-slate-450">
                      Meaning: <strong>"{sentenceDetail.translation}"</strong>
                    </p>
                  </div>

                  {/* Gigantic Arabic Sentence Rendering */}
                  <div className="flex flex-col items-center justify-center space-y-4 py-3">
                    <div 
                      className="flex flex-row-reverse justify-center items-center gap-6 md:gap-14 select-none" 
                      style={{ direction: 'rtl' }}
                    >
                      {sentenceDetail.words.map((w, index) => (
                        <div 
                          key={index}
                          className="text-center group"
                        >
                          <div className={`text-4xl md:text-5xl font-serif font-black tracking-wide antialiased transition-all duration-300 hover:scale-105 select-all ${w.colorClass}`}>
                            {w.arabic}
                          </div>
                          
                          {/* Suffix/Role Metadata pill */}
                          <div className="mt-3 inline-block px-2.5 py-1 rounded-full bg-current/5 text-[9.5px] font-mono opacity-75 tracking-tight font-semibold" style={{ direction: 'ltr' }}>
                            {w.role.split(' (')[0]}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-center max-w-2xl leading-relaxed font-sans opacity-95 pt-3">
                      <strong>Linguistic Effect:</strong> {sentenceDetail.description}
                    </p>
                  </div>

                  {/* Structural Breakdown Grid */}
                  <div>
                    <h5 className="text-[10px] font-mono opacity-50 uppercase tracking-widest pl-1 mb-2 font-bold select-none">
                      Absolute Word-by-Word Grammatical Analysis (I‘rab)
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {sentenceDetail.words.map((w, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-xl border ${innerCardBgClass} flex flex-col justify-between space-y-3`}
                        >
                          <div className="flex items-start justify-between border-b border-current/5 pb-2">
                            <span className="text-xl font-serif font-black text-amber-500">{w.arabic}</span>
                            <div className="text-right">
                              <span className="text-[9.5px] font-mono opacity-50 uppercase block">Word #{index + 1} Role</span>
                              <span className="text-xs font-bold block">{w.role}</span>
                            </div>
                          </div>

                          <div className="space-y-1 text-[11px] leading-relaxed">
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-mono text-[10px] uppercase">State Casing:</span>
                              <span className="font-semibold text-current">{w.caseState}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Ending Sign:</span>
                              <span className="font-semibold text-yellow-500">{w.vowel}</span>
                            </div>
                            <p className="text-slate-400 italic mt-2 text-[10.5px] leading-relaxed border-t border-current/5 pt-2">
                              {w.explanation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* 5. ARABIC VERB FORMS (AWZAN) */}
      {activeSection === 'awzan' && (() => {
        const activeForm = VERB_FORMS_DATABASE.find(f => f.num === selectedFormNum) || VERB_FORMS_DATABASE[0];
        const activeRoot = sandboxRoots[sandboxRootIdx];
        const sandboxConjugation = conjugateRootForForm(activeRoot.letters[0], activeRoot.letters[1], activeRoot.letters[2], activeForm.num);

        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-current/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Layers className={`w-5 h-5 ${fontColorThemeText}`} />
                  <h3 className="text-base font-bold uppercase tracking-wider">
                    Derived Verb Forms (الأوزان - Al-Awzān)
                  </h3>
                </div>
                <p className="text-xs opacity-80 leading-relaxed max-w-2xl">
                  Classical Arabic is a modular language. By overlaying a three-letter root onto fixed structural templates, you mathematically transform its semantic vector. Learn the ten major forms (Roman I to X) below.
                </p>
              </div>

              {/* Quick Jump Badges */}
              <div className="flex flex-wrap gap-1.5 max-w-sm">
                {VERB_FORMS_DATABASE.map(f => (
                  <button
                    key={f.num}
                    onClick={() => setSelectedFormNum(f.num)}
                    className={`px-2 py-1 text-[10px] font-mono font-bold rounded-md border cursor-pointer transition-all ${
                      selectedFormNum === f.num
                        ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-emerald-600 text-white border-emerald-400')
                        : 'bg-transparent border-current/10 hover:bg-current/5'
                    }`}
                  >
                    {f.roman}
                  </button>
                ))}
              </div>
            </div>

            {/* TWO COLUMN MASTER WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT SIDEBAR: THE SELECTOR STRIP */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                <div className="text-[10px] font-mono opacity-50 uppercase tracking-widest pl-2 mb-2 font-bold font-semibold">
                  Select Grammatical Form:
                </div>
                {VERB_FORMS_DATABASE.map(formSpec => {
                  const isActive = selectedFormNum === formSpec.num;
                  const activeItemClass = isActive
                    ? (isParchment ? 'border-[#8c6239] bg-[#ebd8c3]/30 text-[#2c241e]' : isCosmic ? 'border-indigo-500 bg-indigo-950/40 text-indigo-100' : 'border-emerald-500 bg-emerald-950/30 text-emerald-100')
                    : 'border-current/10 hover:bg-current/5';

                  return (
                    <button
                      key={formSpec.num}
                      onClick={() => setSelectedFormNum(formSpec.num)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${activeItemClass}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] opacity-60">Form {formSpec.roman}</span>
                          <span className="font-serif text-sm font-black text-amber-500">{formSpec.arabic}</span>
                        </div>
                        <h4 className="text-xs font-bold font-sans line-clamp-1">{formSpec.title.split(' (')[0]}</h4>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1 opacity-100' : 'opacity-35'}`} />
                    </button>
                  );
                })}
              </div>

              {/* RIGHT STAGE: DETAILED MASTERY ENVIRONMENT */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                
                {/* 1. Header Card */}
                <div className={`p-4 md:p-6 rounded-2xl border ${isParchment ? 'bg-[#fcf8f0] border-[#ebdcc3]' : 'bg-black/30 border-current/10'} space-y-4`}>
                  <div className="flex items-center justify-between border-b border-current/10 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full font-bold">
                        Form {activeForm.roman} Template
                      </span>
                      <h3 className="text-lg font-extrabold tracking-tight font-sans mt-1">
                        {activeForm.title}
                      </h3>
                    </div>
                    <span className="text-4xl md:text-5xl font-serif font-black text-amber-500 mr-2 select-none">
                      {activeForm.arabic}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed opacity-95">
                    <strong>Linguistic Nuance:</strong> {activeForm.concept}
                  </p>
                </div>

                {/* 2. Parallel Core Templates Grid */}
                <div>
                  <h4 className="text-[10px] font-mono opacity-50 uppercase tracking-widest mb-2 px-1 font-bold">
                    Morphological Yardstick Blueprint (Wazan Standard)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* PAST */}
                    <div className={`p-3 rounded-xl border text-center ${innerCardBgClass}`}>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase mb-1">Past (Maadi)</span>
                      <span className="text-lg md:text-xl font-serif font-black text-current block">{activeForm.pastTemplate}</span>
                    </div>
                    {/* PRESENT */}
                    <div className={`p-3 rounded-xl border text-center ${innerCardBgClass}`}>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase mb-1">Present (Mudari)</span>
                      <span className="text-lg md:text-xl font-serif font-black text-current block">{activeForm.presentTemplate}</span>
                    </div>
                    {/* PART_OF_SPEECH */}
                    <div className={`p-3 rounded-xl border text-center ${innerCardBgClass}`}>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase mb-1">Act. Participle</span>
                      <span className="text-lg md:text-xl font-serif font-black text-amber-500 block">{activeForm.participleTemplate}</span>
                    </div>
                    {/* MASDAR */}
                    <div className={`p-3 rounded-xl border text-center ${innerCardBgClass}`}>
                      <span className="text-[9px] font-mono text-slate-400 block uppercase mb-1">Verbal Noun (Masdar)</span>
                      <span className="text-lg md:text-xl font-serif font-black text-current block">{activeForm.masdarTemplate}</span>
                    </div>
                  </div>
                </div>

                {/* 3. LIVE INTERACTIVE CONJUGATOR SANDBOX */}
                <div className={`p-5 rounded-2xl border ${isParchment ? 'bg-amber-100/20 border-amber-200/50' : 'bg-slate-950/40 border-current/10'} space-y-4`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-current/5 pb-2.5 gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse animate-duration-1000" />
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-current">
                        Interactive Conjugation Engine (Sarf Sandbox)
                      </span>
                    </div>
                    <span className="text-[9.5px] font-mono opacity-50 uppercase tracking-widest italic">
                      Conjugating in real-time
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-semibold">
                      Step 1: Choose a 3-Letter Classical Root:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sandboxRoots.map((root, rtIdx) => (
                        <button
                          key={rtIdx}
                          onClick={() => setSandboxRootIdx(rtIdx)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            sandboxRootIdx === rtIdx
                              ? (isParchment ? 'bg-[#ebd8c3] border-[#a68c6d] text-[#2c241e]' : isCosmic ? 'bg-indigo-950 border-indigo-500 text-indigo-300 shadow-inner shadow-indigo-500/10' : 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-inner')
                              : 'bg-transparent border-current/10 hover:bg-current/5'
                          }`}
                        >
                          {root.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] italic text-slate-400 mt-1.5 pl-1 leading-relaxed">
                      💡 Applying Form {activeForm.roman} onto root letters <strong>[{activeRoot.letters.join(' - ')}]</strong> ({activeRoot.mean}).
                    </p>
                  </div>

                  {/* Conjugation outputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {/* PAST OUTPUT */}
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${isParchment ? 'bg-white' : 'bg-black/25'} border-current/5`}>
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest block font-bold">Past Tense (He ...)</span>
                        <span className="text-xs font-bold text-amber-500 block font-mono">{sandboxConjugation.pastTranslit}</span>
                      </div>
                      <span className="text-2xl font-serif font-black tracking-wide text-current">
                        {sandboxConjugation.past}
                      </span>
                    </div>

                    {/* PRESENT OUTPUT */}
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${isParchment ? 'bg-white' : 'bg-black/25'} border-current/5`}>
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest block font-bold">Present Tense (He ...)</span>
                        <span className="text-xs font-bold text-amber-500 block font-mono">{sandboxConjugation.presentTranslit}</span>
                      </div>
                      <span className="text-2xl font-serif font-black tracking-wide text-current">
                        {sandboxConjugation.present}
                      </span>
                    </div>

                    {/* ACT_PART OUTPUT */}
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${isParchment ? 'bg-white' : 'bg-black/25'} border-current/5`}>
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest block font-bold">Acting Agent (Ism Fa’il)</span>
                        <span className="text-xs font-bold text-emerald-500 block font-mono">{sandboxConjugation.participleTranslit}</span>
                      </div>
                      <span className="text-2xl font-serif font-black tracking-wide text-amber-500">
                        {sandboxConjugation.participle}
                      </span>
                    </div>

                    {/* MASDAR OUTPUT */}
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${isParchment ? 'bg-white' : 'bg-black/25'} border-current/5`}>
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest block font-bold">Verbal Noun (The Act of...)</span>
                        <span className="text-xs font-bold text-amber-500 block font-mono">{sandboxConjugation.masdarTranslit}</span>
                      </div>
                      <span className="text-2xl font-serif font-black tracking-wide text-current">
                        {sandboxConjugation.masdar}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. QURANIC CASE STUDIES */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono opacity-50 uppercase tracking-widest px-1 font-bold">
                    Divine Lexicon Case Studies (Quranic Footprints)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeForm.examples.map((ex, exIdx) => (
                      <div
                        key={exIdx}
                        className={`p-4 rounded-xl border ${
                          isParchment ? 'bg-[#faf6ed]' : 'bg-[#0a0d18]/45 border-current/15'
                        } flex flex-col justify-between space-y-4`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b border-current/5 pb-2">
                            <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider">Example #{exIdx + 1}</span>
                            <span className="text-[9px] font-mono opacity-40">{ex.verse.split(' — ')[0]}</span>
                          </div>
                          
                          <div className="flex items-center justify-between flex-row-reverse">
                            <span className="text-3xl font-serif font-black text-current">{ex.word}</span>
                            <div className="space-y-0.5">
                              <span className="text-xs font-semibold opacity-90 block text-right">/ {ex.translit} /</span>
                              <span className="text-xs font-medium text-emerald-500 block text-right">{ex.meaning}</span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <span className="block text-[8px] font-mono opacity-55 uppercase mb-0.5">Direct Context</span>
                            <p className="text-[11px] leading-relaxed italic opacity-90 font-sans">
                              {ex.verse.split(' — ')[1] || ex.verse}
                            </p>
                          </div>
                        </div>

                        <div className={`p-2.5 rounded-lg text-[10.5px] leading-relaxed shadow-inner border border-current/5 ${innerCardBgClass}`}>
                          <strong className="text-amber-500">Grammar Nuance:</strong> {ex.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

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