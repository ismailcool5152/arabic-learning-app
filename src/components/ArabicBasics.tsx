import React, { useState } from 'react';
import { appStorage } from '../lib/appStorage';
import { LayoutTheme } from '../types';
import { SURAH_DATABASE } from './surahData';
import { AudioPlayButton } from './AudioPlayButton';
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
  RotateCcw,
  Tag,
  Users
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

const ADJ_NOUNS_DB: Record<string, {
  label: string;
  type: 'masc_sing' | 'fem_sing' | 'non_human_plural' | 'human_masc_plural' | 'human_fem_plural';
  desc: string;
  forms: {
    indefinite: {
      nominative: { arabic: string; translit: string; literal: string };
      accusative: { arabic: string; translit: string; literal: string };
      genitive: { arabic: string; translit: string; literal: string };
    };
    definite: {
      nominative: { arabic: string; translit: string; literal: string };
      accusative: { arabic: string; translit: string; literal: string };
      genitive: { arabic: string; translit: string; literal: string };
    };
  };
}> = {
  book: {
    label: "Book (كِتَاب)",
    type: 'masc_sing',
    desc: "Masculine, Singular, Non-human",
    forms: {
      indefinite: {
        nominative: { arabic: "كِتَابٌ", translit: "Kitābun", literal: "a book" },
        accusative: { arabic: "كِتَاباً", translit: "Kitāban", literal: "a book" },
        genitive: { arabic: "كِتَابٍ", translit: "Kitābin", literal: "a book" }
      },
      definite: {
        nominative: { arabic: "الْكِتَابُ", translit: "Al-Kitābu", literal: "the book" },
        accusative: { arabic: "الْكِتَابَ", translit: "Al-Kitāba", literal: "the book" },
        genitive: { arabic: "الْكِتَابِ", translit: "Al-Kitābi", literal: "the book" }
      }
    }
  },
  car: {
    label: "Car (سَيَّارَة)",
    type: 'fem_sing',
    desc: "Feminine, Singular, Non-human (has Ta Marbutah ة)",
    forms: {
      indefinite: {
        nominative: { arabic: "سَيَّارَةٌ", translit: "Sayyāratun", literal: "a car" },
        accusative: { arabic: "سَيَّارَةً", translit: "Sayyāratan", literal: "a car" },
        genitive: { arabic: "سَيَّارَةٍ", translit: "Sayyāratin", literal: "a car" }
      },
      definite: {
        nominative: { arabic: "السَّيَّارَةُ", translit: "As-Sayyāratu", literal: "the car" },
        accusative: { arabic: "السَّيَّارَةَ", translit: "As-Sayyārata", literal: "the car" },
        genitive: { arabic: "السَّيَّارَةِ", translit: "As-Sayyārati", literal: "the car" }
      }
    }
  },
  books: {
    label: "Books (كُتُب - Plural)",
    type: 'non_human_plural',
    desc: "Broken Plural, Non-human -> Treated as FEMININE SINGULAR for adjectives!",
    forms: {
      indefinite: {
        nominative: { arabic: "كُتُبٌ", translit: "Kutubun", literal: "books" },
        accusative: { arabic: "كُتُباً", translit: "Kutuban", literal: "books" },
        genitive: { arabic: "كُتُبٍ", translit: "Kutubin", literal: "books" }
      },
      definite: {
        nominative: { arabic: "الْكُتُبُ", translit: "Al-Kutubu", literal: "the books" },
        accusative: { arabic: "الْكُتُبَ", translit: "Al-Kutuba", literal: "the books" },
        genitive: { arabic: "الْكُتُبِ", translit: "Al-Kutubi", literal: "the books" }
      }
    }
  },
  teachers_m: {
    label: "Teachers - Male (مُعَلِّمُونَ)",
    type: 'human_masc_plural',
    desc: "Sound Masculine Plural, Human (requires plural masculine adjective)",
    forms: {
      indefinite: {
        nominative: { arabic: "مُعَلِّمُونَ", translit: "Mu‘allimūna", literal: "teachers" },
        accusative: { arabic: "مُعَلِّمِينَ", translit: "Mu‘allimīna", literal: "teachers" },
        genitive: { arabic: "مُعَلِّمِينَ", translit: "Mu‘allimīna", literal: "teachers" }
      },
      definite: {
        nominative: { arabic: "الْمُعَلِّمُونَ", translit: "Al-Mu‘allimūna", literal: "the teachers" },
        accusative: { arabic: "الْمُعَلِّمِينَ", translit: "Al-Mu‘allimīna", literal: "the teachers" },
        genitive: { arabic: "الْمُعَلِّمِينَ", translit: "Al-Mu‘allimīna", literal: "the teachers" }
      }
    }
  },
  teachers_f: {
    label: "Teachers - Female (مُعَلِّمَات)",
    type: 'human_fem_plural',
    desc: "Sound Feminine Plural, Human (requires plural feminine adjective)",
    forms: {
      indefinite: {
        nominative: { arabic: "مُعَلِّمَاتٌ", translit: "Mu‘allimātun", literal: "female teachers" },
        accusative: { arabic: "مُعَلِّمَاتٍ", translit: "Mu‘allimātin", literal: "female teachers" },
        genitive: { arabic: "مُعَلِّمَاتٍ", translit: "Mu‘allimātin", literal: "female teachers" }
      },
      definite: {
        nominative: { arabic: "الْمُعَلِّمَاتُ", translit: "Al-Mu‘allimātu", literal: "the female teachers" },
        accusative: { arabic: "الْمُعَلِّمَاتِ", translit: "Al-Mu‘allimāti", literal: "the female teachers" },
        genitive: { arabic: "الْمُعَلِّمَاتِ", translit: "Al-Mu‘allimāti", literal: "the female teachers" }
      }
    }
  }
};

const ADJ_ADJECTIVES_DB: Record<string, {
  label: string;
  forms: Record<string, {
    indefinite: {
      nominative: { arabic: string; translit: string; literal: string };
      accusative: { arabic: string; translit: string; literal: string };
      genitive: { arabic: string; translit: string; literal: string };
    };
    definite: {
      nominative: { arabic: string; translit: string; literal: string };
      accusative: { arabic: string; translit: string; literal: string };
      genitive: { arabic: string; translit: string; literal: string };
    };
  }>;
}> = {
  beautiful: {
    label: "Beautiful (جَمِيل)",
    forms: {
      masc_sing: {
        indefinite: {
          nominative: { arabic: "جَمِيلٌ", translit: "Jamīlun", literal: "beautiful" },
          accusative: { arabic: "جَمِيلًا", translit: "Jamīlan", literal: "beautiful" },
          genitive: { arabic: "جَمِيلٍ", translit: "Jamīlin", literal: "beautiful" }
        },
        definite: {
          nominative: { arabic: "الْجَمِيلُ", translit: "Al-Jamīlu", literal: "beautiful" },
          accusative: { arabic: "الْجَمِيلَ", translit: "Al-Jamīla", literal: "beautiful" },
          genitive: { arabic: "الْجَمِيلِ", translit: "Al-Jamīli", literal: "beautiful" }
        }
      },
      fem_sing: {
        indefinite: {
          nominative: { arabic: "جَمِيلَةٌ", translit: "Jamīlatun", literal: "beautiful" },
          accusative: { arabic: "جَمِيلَةً", translit: "Jamīlatan", literal: "beautiful" },
          genitive: { arabic: "جَمِيلَةٍ", translit: "Jamīlatin", literal: "beautiful" }
        },
        definite: {
          nominative: { arabic: "الْجَمِيلَةُ", translit: "Al-Jamīlatu", literal: "beautiful" },
          accusative: { arabic: "الْجَمِيلَةَ", translit: "Al-Jamīlata", literal: "beautiful" },
          genitive: { arabic: "الْجَمِيلَةِ", translit: "Al-Jamīlati", literal: "beautiful" }
        }
      },
      human_masc_plural: {
        indefinite: {
          nominative: { arabic: "جَمِيلُونَ", translit: "Jamīlūna", literal: "beautiful" },
          accusative: { arabic: "جَمِيلِينَ", translit: "Jamīlīna", literal: "beautiful" },
          genitive: { arabic: "جَمِيلِينَ", translit: "Jamīlīna", literal: "beautiful" }
        },
        definite: {
          nominative: { arabic: "الْجَمِيلُونَ", translit: "Al-Jamīlūna", literal: "beautiful" },
          accusative: { arabic: "الْجَمِيلِينَ", translit: "Al-Jamīlīna", literal: "beautiful" },
          genitive: { arabic: "الْجَمِيلِينَ", translit: "Al-Jamīlīna", literal: "beautiful" }
        }
      },
      human_fem_plural: {
        indefinite: {
          nominative: { arabic: "جَمِيلَاتٌ", translit: "Jamīlātun", literal: "beautiful" },
          accusative: { arabic: "جَمِيلَاتٍ", translit: "Jamīlātin", literal: "beautiful" },
          genitive: { arabic: "جَمِيلَاتٍ", translit: "Jamīlātin", literal: "beautiful" }
        },
        definite: {
          nominative: { arabic: "الْجَمِيلَاتُ", translit: "Al-Jamīlātu", literal: "beautiful" },
          accusative: { arabic: "الْجَمِيلَاتِ", translit: "Al-Jamīlāti", literal: "beautiful" },
          genitive: { arabic: "الْجَمِيلَاتِ", translit: "Al-Jamīlāti", literal: "beautiful" }
        }
      }
    }
  },
  big: {
    label: "Big / Great (كَبِير)",
    forms: {
      masc_sing: {
        indefinite: {
          nominative: { arabic: "كَبِيرٌ", translit: "Kabīrun", literal: "big" },
          accusative: { arabic: "كَبِيرًا", translit: "Kabīran", literal: "big" },
          genitive: { arabic: "كَبِيرٍ", translit: "Kabīrin", literal: "big" }
        },
        definite: {
          nominative: { arabic: "الْكَبِيرُ", translit: "Al-Kabīru", literal: "big" },
          accusative: { arabic: "الْكَبِيرَ", translit: "Al-Kabīra", literal: "big" },
          genitive: { arabic: "الْكَبِيرِ", translit: "Al-Kabīri", literal: "big" }
        }
      },
      fem_sing: {
        indefinite: {
          nominative: { arabic: "كَبِيرَةٌ", translit: "Kabīratun", literal: "big" },
          accusative: { arabic: "كَبِيرَةً", translit: "Kabīratan", literal: "big" },
          genitive: { arabic: "كَبِيرَةٍ", translit: "Kabīratin", literal: "big" }
        },
        definite: {
          nominative: { arabic: "الْكَبِيرَةُ", translit: "Al-Kabīratu", literal: "big" },
          accusative: { arabic: "الْكَبِيرَةَ", translit: "Al-Kabīrata", literal: "big" },
          genitive: { arabic: "الْكَبِيرَةِ", translit: "Al-Kabīrati", literal: "big" }
        }
      },
      human_masc_plural: {
        indefinite: {
          nominative: { arabic: "كِبَارٌ", translit: "Kibārun", literal: "big" },
          accusative: { arabic: "كِبَاراً", translit: "Kibāran", literal: "big" },
          genitive: { arabic: "كِبَارٍ", translit: "Kibārin", literal: "big" }
        },
        definite: {
          nominative: { arabic: "الْكِبَارُ", translit: "Al-Kibāru", literal: "big" },
          accusative: { arabic: "الْكِبَارَ", translit: "Al-Kibāra", literal: "big" },
          genitive: { arabic: "الْكِبَارِ", translit: "Al-Kibāri", literal: "big" }
        }
      },
      human_fem_plural: {
        indefinite: {
          nominative: { arabic: "كَبِيرَاتٌ", translit: "Kabīrātun", literal: "big" },
          accusative: { arabic: "كَبِيرَاتٍ", translit: "Kabīrātin", literal: "big" },
          genitive: { arabic: "كَبِيرَاتٍ", translit: "Kabīrātin", literal: "big" }
        },
        definite: {
          nominative: { arabic: "الْكَبِيرَاتُ", translit: "Al-Kabīrātu", literal: "big" },
          accusative: { arabic: "الْكَبِيرَاتِ", translit: "Al-Kabīrāti", literal: "big" },
          genitive: { arabic: "الْكَبِيرَاتِ", translit: "Al-Kabīrāti", literal: "big" }
        }
      }
    }
  },
  new: {
    label: "New (جَدِيد)",
    forms: {
      masc_sing: {
        indefinite: {
          nominative: { arabic: "جَدِيدٌ", translit: "Jadīdun", literal: "new" },
          accusative: { arabic: "جَدِيداً", translit: "Jadīdan", literal: "new" },
          genitive: { arabic: "جَدِيدٍ", translit: "Jadīdin", literal: "new" }
        },
        definite: {
          nominative: { arabic: "الْجَدِيدُ", translit: "Al-Jadīdu", literal: "new" },
          accusative: { arabic: "الْجَدِيدَ", translit: "Al-Jadīda", literal: "new" },
          genitive: { arabic: "الْجَدِيدِ", translit: "Al-Jadīdi", literal: "new" }
        }
      },
      fem_sing: {
        indefinite: {
          nominative: { arabic: "جَدِيدَةٌ", translit: "Jadīdatun", literal: "new" },
          accusative: { arabic: "جَدِيدَةً", translit: "Jadīdatan", literal: "new" },
          genitive: { arabic: "جَدِيدَةٍ", translit: "Jadīdatin", literal: "new" }
        },
        definite: {
          nominative: { arabic: "الْجَدِيدَةُ", translit: "Al-Jadīdatu", literal: "new" },
          accusative: { arabic: "الْجَدِيدَةَ", translit: "Al-Jadīdata", literal: "new" },
          genitive: { arabic: "الْجَدِيدَةِ", translit: "Al-Jadīdati", literal: "new" }
        }
      },
      human_masc_plural: {
        indefinite: {
          nominative: { arabic: "جُدُدٌ", translit: "Jududun", literal: "new" },
          accusative: { arabic: "جُدُداً", translit: "Jududan", literal: "new" },
          genitive: { arabic: "جُدُدٍ", translit: "Jududin", literal: "new" }
        },
        definite: {
          nominative: { arabic: "الْجُدُدُ", translit: "Al-Jududu", literal: "new" },
          accusative: { arabic: "الْجُدُدَ", translit: "Al-Jududa", literal: "new" },
          genitive: { arabic: "الْجُدُدِ", translit: "Al-Jududi", literal: "new" }
        }
      },
      human_fem_plural: {
        indefinite: {
          nominative: { arabic: "جَدِيدَاتٌ", translit: "Jadīdatun", literal: "new" },
          accusative: { arabic: "جَدِيدَاتٍ", translit: "Jadīdātin", literal: "new" },
          genitive: { arabic: "جَدِيدَاتٍ", translit: "Jadīdātin", literal: "new" }
        },
        definite: {
          nominative: { arabic: "الْجَدِيدَاتُ", translit: "Al-Jadīdātu", literal: "new" },
          accusative: { arabic: "الْجَدِيدَاتِ", translit: "Al-Jadīdāti", literal: "new" },
          genitive: { arabic: "الْجَدِيدَاتِ", translit: "Al-Jadīdāti", literal: "new" }
        }
      }
    }
  }
};

const COMMON_ADJECTIVES_GLOSSARY = [
  { masc: "كَبِير", fem: "كَبِيرَة", translit: "Kabīr / Kabīrah", english: "Big / Large (also Old for humans)", antonym: "صَغِير", example: "بَيْتٌ كَبِيرٌ (A big house)", category: "size" },
  { masc: "صَغِير", fem: "صَغِيرَة", translit: "Ṣaghīr / Ṣaghīrah", english: "Small / Little (also Young)", antonym: "كَبِير", example: "وَلَدٌ صَغِيرٌ (A young boy)", category: "size" },
  { masc: "جَدِيد", fem: "جَدِيدَة", translit: "Jadīd / Jadīdah", english: "New", antonym: "قَدِيم", example: "كِتَابٌ جَدِيدٌ (A new book)", category: "state" },
  { masc: "قَدِيم", fem: "قَدِيمَة", translit: "Qadīm / Qadīmah", english: "Old / Ancient (for objects)", antonym: "جَدِيد", example: "مَدِينَةٌ قَدِيمَةٌ (An ancient city)", category: "state" },
  { masc: "جَمِيل", fem: "جَمِيلَة", translit: "Jamīl / Jamīlah", english: "Beautiful / Handsome", antonym: "قَبِيح", example: "حَدِيقَةٌ جَمِيلَةٌ (A beautiful garden)", category: "quality" },
  { masc: "قَبِيح", fem: "قَبِيحَة", translit: "Qabīḥ / Qabīḥah", english: "Ugly / Repulsive", antonym: "جَمِيل", example: "مَنْظَرٌ قَبِيحٌ (An ugly view)", category: "quality" },
  { masc: "سَهْل", fem: "سَهْلَة", translit: "Sahl / Sahlah", english: "Easy", antonym: "صَعْب", example: "اِمْتِحَانٌ سَهْلٌ (An easy exam)", category: "difficulty" },
  { masc: "صَعْب", fem: "صَعْبَة", translit: "Ṣa‘b / Ṣa‘bah", english: "Difficult / Hard", antonym: "سَهْل", example: "سُؤَالٌ صَعْبٌ (A difficult question)", category: "difficulty" },
  { masc: "قَرِيب", fem: "قَرِيبَة", translit: "Qarīb / Qarībah", english: "Near / Close", antonym: "بَعِيد", example: "الْمَسْجِدُ قَرِيبٌ (The mosque is near)", category: "distance" },
  { masc: "بَعِيد", fem: "بَعِيدَة", translit: "Ba‘īd / Ba‘īdah", english: "Far", antonym: "قَرِيب", example: "بَيْتٌ بَعِيدٌ (A far house)", category: "distance" },
  { masc: "طَوِيل", fem: "طَوِيلَة", translit: "Ṭawīl / Ṭawīlah", english: "Tall / Long", antonym: "قَصِير", example: "رَجُلٌ طَوِيلٌ (A tall man)", category: "size" },
  { masc: "قَصِير", fem: "قَصِيرَة", translit: "Qaṣīr / Qaṣīrah", english: "Short", antonym: "طَوِيل", example: "شَارِعٌ قَصِيرٌ (A short street)", category: "size" },
  { masc: "كَثِير", fem: "كَثِيرَة", translit: "Kathīr / Kathīrah", english: "Many / Much / Plentiful", antonym: "قَلِيل", example: "مَالٌ كَثِيرٌ (Much wealth)", category: "quantity" },
  { masc: "قَلِيل", fem: "قَلِيلَة", translit: "Qalīl / Qalīlah", english: "Few / Little / Scarce", antonym: "كَثِير", example: "مَاءٌ قَلِيلٌ (Little water)", category: "quantity" },
  { masc: "جَيِّد", fem: "جَيِّدَة", translit: "Jayyid / Jayyidah", english: "Good / Well-made", antonym: "سَيِّء", example: "عَمَلٌ جَيِّدٌ (Good work)", category: "quality" },
  { masc: "سَيِّء", fem: "سَيِّئَة", translit: "Sayyi' / Sayyi'ah", english: "Bad / Poor quality", antonym: "جَيِّد", example: "طَبْعٌ سَيِّءٌ (A bad character)", category: "quality" },
  { masc: "سَعِيد", fem: "سَعِيدَة", translit: "Sa‘īd / Sa‘īdah", english: "Happy", antonym: "حَزِين", example: "عَائِلَةٌ سَعِيدَةٌ (A happy family)", category: "emotion" },
  { masc: "حَزِين", fem: "حَزِينَة", translit: "Ḥazīn / Ḥazīnah", english: "Sad", antonym: "سَعِيد", example: "قَلْبٌ حَزِينٌ (A sad heart)", category: "emotion" },
  { masc: "غَنِيّ", fem: "غَنِيَّة", translit: "Ghaniyy / Ghaniyyah", english: "Rich / Wealthy", antonym: "فَقِير", example: "رَجُلٌ غَنِيٌّ (A rich man)", category: "state" },
  { masc: "فَقِير", fem: "فَقِيرَة", translit: "Faqīr / Faqīrah", english: "Poor / Needy", antonym: "غَنِيّ", example: "عَبْدٌ فَقِيرٌ (A poor servant)", category: "state" }
];

const COMP_SUBJECTS_NOMINATIVE: Record<string, { arabic: string; translit: string; label: string }> = {
  ahmad: { arabic: "أَحْمَدُ", translit: "Aḥmadu", label: "Ahmad" },
  fatimah: { arabic: "فَاطِمَةُ", translit: "Fāṭimatu", label: "Fatimah" },
  house: { arabic: "الْبَيْتُ", translit: "Al-Baytu", label: "The House" },
  car: { arabic: "السَّيَّارَةُ", translit: "As-Sayyāratu", label: "The Car" },
  books: { arabic: "الْكُتُبُ", translit: "Al-Kutubu", label: "The Books" },
  mosque: { arabic: "الْمَسْجِدُ", translit: "Al-Masjidu", label: "The Mosque" }
};

const COMP_OBJECTS_GENITIVE: Record<string, { arabic: string; translit: string; prefix: string; translation: string }> = {
  ahmad: { arabic: "أَحْمَدَ", translit: "Aḥmada", prefix: "مِنْ ", translation: "Ahmad" },
  fatimah: { arabic: "فَاطِمَةَ", translit: "Fāṭimata", prefix: "مِنْ ", translation: "Fatimah" },
  house: { arabic: "الْبَيْتِ", translit: "l-Bayti", prefix: "مِنَ ", translation: "the house" },
  car: { arabic: "السَّيَّارَةِ", translit: "s-Sayyārati", prefix: "مِنَ ", translation: "the car" },
  books: { arabic: "الْكُتُبِ", translit: "l-Kutubi", prefix: "مِنَ ", translation: "the books" },
  mosque: { arabic: "الْمَسْجِدِ", translit: "l-Masjidi", prefix: "مِنَ ", translation: "the mosque" }
};

const COMP_ADJECTIVES: Record<string, { label: string; root: string; compArabic: string; compTranslit: string; femSuperlative: string; meaning: string; isGeminate?: boolean }> = {
  big: { label: "Big / Great (كَبِير)", root: "ك - ب - ر", compArabic: "أَكْبَرُ", compTranslit: "Akbaru", femSuperlative: "الْكُبْرَى (Al-Kubrā)", meaning: "bigger / older / greatest" },
  small: { label: "Small / Young (صَغِير)", root: "ص - غ - ر", compArabic: "أَصْغَرُ", compTranslit: "Aṣgharu", femSuperlative: "الصُّغْرَى (Aṣ-Ṣughrā)", meaning: "smaller / younger / smallest" },
  beautiful: { label: "Beautiful (جَمِيل)", root: "ج - م - ل", compArabic: "أَجْمَلُ", compTranslit: "Ajmalu", femSuperlative: "الْجُمْلَى (Al-Jumlā)", meaning: "more beautiful / most beautiful" },
  easy: { label: "Easy (سَهْل)", root: "س - هـ - ل", compArabic: "أَسْهَلُ", compTranslit: "Ashalu", femSuperlative: "السُّهْلَى (As-Suhlā)", meaning: "easier / easiest" },
  difficult: { label: "Difficult (صَعْب)", root: "ص - ع - ب", compArabic: "أَصْعَبُ", compTranslit: "Aṣ‘abu", femSuperlative: "الصُّعْبَى (Aṣ-Ṣu‘bā)", meaning: "more difficult / most difficult" },
  near: { label: "Near (قَرِيب)", root: "ق - ر - ب", compArabic: "أَقْرَبُ", compTranslit: "Aqrabu", femSuperlative: "الْقُرْبَى (Al-Qurbā)", meaning: "nearer / nearest" },
  many: { label: "Many / Much (كَثِير)", root: "ك - ث - ر", compArabic: "أَكْثَرُ", compTranslit: "Aktharu", femSuperlative: "الْكُثْرَى (Al-Kuthrā)", meaning: "more / most" },
  few: { label: "Few / Little (قَلِيل)", root: "ق - ل - ل", compArabic: "أَقَلُّ", compTranslit: "Aqallu", femSuperlative: "الْقُلَّى (Al-Qullā)", meaning: "less / least", isGeminate: true }
};

const COMP_PRONOUNS: Record<string, { arabic: string; translit: string; meaning: string }> = {
  me: { arabic: "مِنِّي", translit: "minnī", meaning: "than me" },
  you_m: { arabic: "مِنْكَ", translit: "minka", meaning: "than you (masc.)" },
  you_f: { arabic: "مِنْكِ", translit: "minki", meaning: "than you (fem.)" },
  him: { arabic: "مِنْهُ", translit: "minhu", meaning: "than him / than it" },
  her: { arabic: "مِنْهَا", translit: "minhā", meaning: "than her / than it" },
  us: { arabic: "مِنَّا", translit: "minnā", meaning: "than us" },
  them: { arabic: "مِنْهُمْ", translit: "minhum", meaning: "than them" }
};

const ADV_VERBS: Record<string, { arabicMasc: string; arabicFem: string; translitMasc: string; translitFem: string; meaning: string; category: 'intransitive' | 'transitive' | 'location' }> = {
  jara: { arabicMasc: "جَرَى", arabicFem: "جَرَتْ", translitMasc: "jarā", translitFem: "jarat", meaning: "ran", category: 'intransitive' },
  kataba: { arabicMasc: "كَتَبَ", arabicFem: "كَتَبَتْ", translitMasc: "kataba", translitFem: "katabat", meaning: "wrote", category: 'transitive' },
  takallama: { arabicMasc: "تَكَلَّمَ", arabicFem: "تَكَلَّمَتْ", translitMasc: "takallama", translitFem: "takallamat", meaning: "spoke", category: 'intransitive' },
  zahaba: { arabicMasc: "ذَهَبَ", arabicFem: "ذَهَبَتْ", translitMasc: "zahaba", translitFem: "zahabat", meaning: "went", category: 'location' }
};

const ADV_SUBJECTS: Record<string, { arabic: string; translit: string; meaning: string; gender: 'masc' | 'fem' }> = {
  walad: { arabic: "الْوَلَدُ", translit: "al-waladu", meaning: "the boy", gender: 'masc' },
  bint: { arabic: "الْبِنْتُ", translit: "al-bintu", meaning: "the girl", gender: 'fem' },
  muallem: { arabic: "الْمُعَلِّمُ", translit: "al-mu‘allimu", meaning: "the teacher (m.)", gender: 'masc' },
  muallemah: { arabic: "الْمُعَلِّمَةُ", translit: "al-mu‘allimatu", meaning: "the teacher (f.)", gender: 'fem' }
};

const ADV_EXTENSIONS: Record<string, Record<string, { arabic: string; translit: string; meaning: string }>> = {
  jara: {
    none: { arabic: "", translit: "", meaning: "" },
    park: { arabic: "فِي الْحَدِيقَةِ", translit: "fī l-ḥadīqati", meaning: "in the garden" }
  },
  kataba: {
    dars: { arabic: "الدَّرْسَ", translit: "ad-darsa", meaning: "the lesson" },
    risalah: { arabic: "الرِّسَالَةَ", translit: "ar-risālata", meaning: "the letter" }
  },
  takallama: {
    lugah: { arabic: "الْعَرَبِيَّةَ", translit: "al-‘arabiyyata", meaning: "Arabic" },
    muallem: { arabic: "مَعَ الْمُعَلِّمِ", translit: "ma‘a l-mu‘allimi", meaning: "with the teacher" }
  },
  zahaba: {
    madrasah: { arabic: "إِلَى الْمَدْرَسَةِ", translit: "ilā l-madrasati", meaning: "to the school" },
    masjid: { arabic: "إِلَى الْمَسْجِدِ", translit: "ilā l-masjidi", meaning: "to the mosque" }
  }
};

interface AdverbDetail {
  id: string;
  arabic: string;
  translit: string;
  english: string;
  explanation: string;
  exampleArabic: string;
  exampleTranslit: string;
  exampleMeaning: string;
}

const ACCUSATIVE_ADVERBS: AdverbDetail[] = [
  { id: "saree'an", arabic: "سَرِيعاً", translit: "sarī‘an", english: "quickly", explanation: "Accusative form of سَرِيع (fast). Ends in tanween fath.", exampleArabic: "جَرَى الْوَلَدُ سَرِيعاً", exampleTranslit: "Jarā al-waladu sarī‘an", exampleMeaning: "The boy ran quickly" },
  { id: "batee'an", arabic: "بَطِيئاً", translit: "baṭī’an", english: "slowly", explanation: "Accusative form of بَطِيء (slow).", exampleArabic: "تَكَلَّمَ الرَّجُلُ بَطِيئاً", exampleTranslit: "Takallama ar-rajulu baṭī’an", exampleMeaning: "The man spoke slowly" },
  { id: "katheeran", arabic: "كَثِيراً", translit: "kathīran", english: "a lot / often", explanation: "Accusative form of كَثِير (much).", exampleArabic: "قَرَأَ الْوَلَدُ كَثِيراً", exampleTranslit: "Qara'a al-waladu kathīran", exampleMeaning: "The boy read a lot" },
  { id: "qaleelan", arabic: "قَلِيلاً", translit: "qalīlan", english: "a little / rarely", explanation: "Accusative form of قَلِيل (little).", exampleArabic: "نَامَ الطَّالِبُ قَلِيلاً", exampleTranslit: "Nāma aṭ-ṭālibu qalīlan", exampleMeaning: "The student slept a little" },
  { id: "jayyidan", arabic: "جَيِّداً", translit: "jayyidan", english: "well", explanation: "Accusative form of جَيِّد (good).", exampleArabic: "كَتَبَ الدَّرْسَ جَيِّداً", exampleTranslit: "Kataba ad-darsa jayyidan", exampleMeaning: "He wrote the lesson well" },
  { id: "da'iman", arabic: "دَائِماً", translit: "dā’iman", english: "always", explanation: "Temporal-manner adverb expressing continuous regularity.", exampleArabic: "يَذْهَبُ دَائِماً إِلَى الْمَسْجِدِ", exampleTranslit: "Yazhabu dā’iman ilā l-masjidi", exampleMeaning: "He always goes to the mosque" },
  { id: "ghaliban", arabic: "غَالِباً", translit: "ghāliban", english: "mostly / usually", explanation: "Active participle form used as an adverb of frequency.", exampleArabic: "يَكْتُبُ غَالِباً بِالْقَلَمِ", exampleTranslit: "Yaktubu ghāliban bi-l-qalami", exampleMeaning: "He mostly writes with the pen" },
  { id: "jiddan", arabic: "جِدّاً", translit: "jiddan", english: "very / extremely", explanation: "Always accusative; intensifies adjectives or other adverbs.", exampleArabic: "الْمَسْجِدُ كَبِيرٌ جِدّاً", exampleTranslit: "Al-masjidu kabīrun jiddan", exampleMeaning: "The mosque is very big" },
  { id: "fi'lan", arabic: "فِعْلاً", translit: "fi‘lan", english: "really / actually", explanation: "Derived from فِعْل (action) to assert reality.", exampleArabic: "هَذَا سَهْلٌ فِعْلاً", exampleTranslit: "Hāzā sahlun fi‘lan", exampleMeaning: "This is really easy" },
  { id: "taqreeban", arabic: "تَقْرِيباً", translit: "taqrīban", english: "approximately", explanation: "Derived from قَرِيب (near) to denote near certainty.", exampleArabic: "قَرَأَ الدَّرْسَ تَقْرِيباً", exampleTranslit: "Qara'a ad-darsa taqrīban", exampleMeaning: "He read approximately the lesson" }
];

const PREPOSITIONAL_ADVERBS: AdverbDetail[] = [
  { id: "bi-sur'ah", arabic: "بِسُرْعَةٍ", translit: "bi-sur‘atin", english: "quickly / with speed", explanation: "Preposition بِـ (with) + genitive noun سُرْعَة (speed).", exampleArabic: "جَرَى الْوَلَدُ بِسُرْعَةٍ", exampleTranslit: "Jarā al-waladu bi-sur‘atin", exampleMeaning: "The boy ran quickly (with speed)" },
  { id: "bi-but'", arabic: "بِبُطْءٍ", translit: "bi-buṭ’in", english: "slowly / with slowness", explanation: "Preposition بِـ (with) + genitive noun بُطْء (slowness).", exampleArabic: "مَشَى الرَّجُلُ بِبُطْءٍ", exampleTranslit: "Mashā ar-rajulu bi-buṭ’in", exampleMeaning: "The man walked slowly" },
  { id: "bi-suhulah", arabic: "بِسُهُولَةٍ", translit: "bi-suhūlatin", english: "easily / with ease", explanation: "Preposition بِـ (with) + genitive noun سُهُولَة (ease).", exampleArabic: "كَتَبَ الدَّرْسَ بِسُهُولَةٍ", exampleTranslit: "Kataba ad-darsa bi-suhūlatin", exampleMeaning: "He wrote the lesson easily" },
  { id: "bi-su'ubah", arabic: "بِصُعُوبَةٍ", translit: "bi-ṣu‘ūbatin", english: "with difficulty", explanation: "Preposition بِـ (with) + genitive noun صُعُوبَة (difficulty).", exampleArabic: "تَكَلَّمَ الرَّجُلُ بِصُعُوبَةٍ", exampleTranslit: "Takallama ar-rajulu bi-ṣu‘ūbatin", exampleMeaning: "The man spoke with difficulty" },
  { id: "bi-inayah", arabic: "بِعِنَايَةٍ", translit: "bi-‘ināyatin", english: "carefully / with care", explanation: "Preposition بِـ (with) + genitive noun عِنَايَة (care).", exampleArabic: "يَكْتُبُ الْوَلَدُ بِعِنَايَةٍ", exampleTranslit: "Yaktubu al-waladu bi-‘ināyatin", exampleMeaning: "The boy writes carefully" },
  { id: "bi-diqqah", arabic: "بِدِقَّةٍ", translit: "bi-diqqatin", english: "accurately / with precision", explanation: "Preposition بِـ (with) + genitive noun دِقَّة (precision).", exampleArabic: "قَرَأَ الْقُرْآنَ بِدِقَّةٍ", exampleTranslit: "Qara'a al-qur'āna bi-diqqatin", exampleMeaning: "He read the Quran accurately" },
  { id: "bi-shiddah", arabic: "بِشِدَّةٍ", translit: "bi-shiddatin", english: "strongly / intensely", explanation: "Preposition بِـ (with) + genitive noun شِدَّة (intensity).", exampleArabic: "هَبَّتِ الرِّيَاحُ بِشِدَّةٍ", exampleTranslit: "Habbati r-riyāḥu bi-shiddatin", exampleMeaning: "The winds blew strongly" }
];

const TIME_PLACE_ADVERBS: AdverbDetail[] = [
  { id: "al-yawm", arabic: "الْيَوْمَ", translit: "al-yawma", english: "today", explanation: "Temporal noun in the accusative case (Zarf Zaman).", exampleArabic: "ذَهَبَ الْيَوْمَ إِلَى الْبَيْتِ", exampleTranslit: "Zahaba al-yawma ilā l-bayti", exampleMeaning: "He went to the house today" },
  { id: "ghadan", arabic: "غَداً", translit: "ghadan", english: "tomorrow", explanation: "Temporal noun in the accusative case (Zarf Zaman).", exampleArabic: "سَأَكْتُبُ غَداً الدَّرْسَ", exampleTranslit: "Sa-aktubu ghadan ad-darsa", exampleMeaning: "I will write the lesson tomorrow" },
  { id: "amsi", arabic: "أَمْسِ", translit: "amsi", english: "yesterday", explanation: "An indeclinable temporal noun ending in Kasrah.", exampleArabic: "قَرَأَ أَمْسِ الرِّسَالَةَ", exampleTranslit: "Qara'a amsi ar-risālata", exampleMeaning: "He read the letter yesterday" },
  { id: "al-an", arabic: "الْآنَ", translit: "al-āna", english: "now", explanation: "An indeclinable adverb of time ending in Fathah.", exampleArabic: "نَحْنُ نَأْكُلُ الْآنَ", exampleTranslit: "Naḥnu na'kulu al-āna", exampleMeaning: "We are eating now" },
  { id: "qabla", arabic: "قَبْلَ", translit: "qabla", english: "before", explanation: "Relational adverb of time; acts as mudaf, forcing the next noun to genitive case.", exampleArabic: "ذَهَبَ قَبْلَ الظُّهْرِ", exampleTranslit: "Zahaba qabla ẓ-ẓuhri", exampleMeaning: "He went before noon" },
  { id: "ba'da", arabic: "بَعْدَ", translit: "ba'da", english: "after", explanation: "Relational adverb of time; acts as mudaf, forcing the next noun to genitive case.", exampleArabic: "نَامَ بَعْدَ الْعِشَاءِ", exampleTranslit: "Nāma ba‘da l-‘ishā’i", exampleMeaning: "He slept after Isha" },
  { id: "tahta", arabic: "تَحْتَ", translit: "taḥta", english: "under", explanation: "Adverb of place (Zarf Makan); acts as mudaf.", exampleArabic: "الْقِطُّ تَحْتَ السَّيَّارَةِ", exampleTranslit: "Al-qiṭṭu taḥta s-sayyārati", exampleMeaning: "The cat is under the car" },
  { id: "fawqa", arabic: "فَوْقَ", translit: "fawqa", english: "above / on top of", explanation: "Adverb of place (Zarf Makan); acts as mudaf.", exampleArabic: "الْكِتَابُ فَوْقَ الْمَكْتَبِ", exampleTranslit: "Al-kitābu fawqa l-maktabi", exampleMeaning: "The book is on top of the desk" },
  { id: "amama", arabic: "أَمَامَ", translit: "amāma", english: "in front of", explanation: "Adverb of place (Zarf Makan); acts as mudaf.", exampleArabic: "الْمَسْجِدُ أَمَامَ الْبَيْتِ", exampleTranslit: "Al-masjidu amāma l-bayti", exampleMeaning: "The mosque is in front of the house" },
  { id: "khalfa", arabic: "خَلْفَ", translit: "khalfa", english: "behind", explanation: "Adverb of place (Zarf Makan); acts as mudaf.", exampleArabic: "مَشَى خَلْفَ الْمُعَلِّمِ", exampleTranslit: "Mashā khalfa l-mu‘allimi", exampleMeaning: "He walked behind the teacher" }
];

interface PronounItem {
  id: string;
  arabic: string;
  translit: string;
  english: string;
  person: '1st' | '2nd' | '3rd';
  gender: 'masc' | 'fem' | 'common';
  number: 'singular' | 'dual' | 'plural';
  explanation: string;
}

const SUBJECT_PRONOUNS_DB: PronounItem[] = [
  { id: 'ana', arabic: 'أَنَا', translit: 'anā', english: 'I', person: '1st', gender: 'common', number: 'singular', explanation: 'Independent first-person singular pronoun. Used for both masculine and feminine.' },
  { id: 'anta', arabic: 'أَنْـتَ', translit: 'anta', english: 'you (masc. sing.)', person: '2nd', gender: 'masc', number: 'singular', explanation: 'Second-person masculine singular. Denotes "you" (one male).' },
  { id: 'anti', arabic: 'أَنْـتِ', translit: 'anti', english: 'you (fem. sing.)', person: '2nd', gender: 'fem', number: 'singular', explanation: 'Second-person feminine singular. Denotes "you" (one female). Notice the kasrah at the end instead of fat-hah.' },
  { id: 'huwa', arabic: 'هُوَ', translit: 'huwa', english: 'he / it', person: '3rd', gender: 'masc', number: 'singular', explanation: 'Third-person masculine singular. Refers to "he" or masculine objects.' },
  { id: 'hiya', arabic: 'هِيَ', translit: 'hiya', english: 'she / it', person: '3rd', gender: 'fem', number: 'singular', explanation: 'Third-person feminine singular. Refers to "she" or feminine objects.' },
  { id: 'antuma', arabic: 'أَنْتُمَا', translit: 'antumā', english: 'you two', person: '2nd', gender: 'common', number: 'dual', explanation: 'Second-person dual. Used for speaking to exactly two people, male or female.' },
  { id: 'huma', arabic: 'هُمَا', translit: 'humā', english: 'they two', person: '3rd', gender: 'common', number: 'dual', explanation: 'Third-person dual. Refers to exactly two people or things, male or female.' },
  { id: 'nahnu', arabic: 'نَحْنُ', translit: 'naḥnu', english: 'we', person: '1st', gender: 'common', number: 'plural', explanation: 'First-person plural. Used for "we" (two or more people).' },
  { id: 'antum', arabic: 'أَنْتُمْ', translit: 'antum', english: 'you all (masc.)', person: '2nd', gender: 'masc', number: 'plural', explanation: 'Second-person masculine plural. Speaking to a group of males, or a mixed group.' },
  { id: 'antunna', arabic: 'أَنْتُنَّ', translit: 'antunna', english: 'you all (fem.)', person: '2nd', gender: 'fem', number: 'plural', explanation: 'Second-person feminine plural. Speaking to a group of females only.' },
  { id: 'hum', arabic: 'هُمْ', translit: 'hum', english: 'they (masc.)', person: '3rd', gender: 'masc', number: 'plural', explanation: 'Third-person masculine plural. Referring to a group of males, or a mixed group.' },
  { id: 'hunna', arabic: 'هُنَّ', translit: 'hunna', english: 'they (fem.)', person: '3rd', gender: 'fem', number: 'plural', explanation: 'Third-person feminine plural. Referring to a group of females only.' }
];

interface SuffixPronounItem {
  id: string;
  english: string;
  suffixNoun: string;
  suffixVerb: string;
  suffixPrep: string;
  translitSuffix: string;
  explanation: string;
}

const SUFFIX_PRONOUNS_DB: SuffixPronounItem[] = [
  { id: 'me', english: 'me / my', suffixNoun: 'ـِي', suffixVerb: 'ـنِي', suffixPrep: 'ـي', translitSuffix: '-ī / -nī', explanation: 'First person singular. Nouns use -ī (my), verbs use -nī (me) to preserve pronunciation, prepositions use -y.' },
  { id: 'you_m', english: 'you / your (m.)', suffixNoun: 'ـكَ', suffixVerb: 'ـكَ', suffixPrep: 'ـكَ', translitSuffix: '-ka', explanation: 'Second person masculine singular.' },
  { id: 'you_f', english: 'you / your (f.)', suffixNoun: 'ـكِ', suffixVerb: 'ـكِ', suffixPrep: 'ـكِ', translitSuffix: '-ki', explanation: 'Second person feminine singular.' },
  { id: 'him', english: 'him / his', suffixNoun: 'ـهُ', suffixVerb: 'ـهُ', suffixPrep: 'ـهُ', translitSuffix: '-hu / -hi', explanation: 'Third person masculine singular. Becomes -hi when preceded by a kasrah or ya.' },
  { id: 'her', english: 'her', suffixNoun: 'ـهَا', suffixVerb: 'ـهَا', suffixPrep: 'ـهَا', translitSuffix: '-hā', explanation: 'Third person feminine singular.' },
  { id: 'us', english: 'us / our', suffixNoun: 'ـنَا', suffixVerb: 'ـنَا', suffixPrep: 'ـنَا', translitSuffix: '-nā', explanation: 'First person plural.' },
  { id: 'you_two', english: 'you two / your', suffixNoun: 'ـكُمَا', suffixVerb: 'ـكُمَا', suffixPrep: 'ـكُمَا', translitSuffix: '-kumā', explanation: 'Second person dual (masculine and feminine).' },
  { id: 'them_two', english: 'them two / their', suffixNoun: 'ـهُمَا', suffixVerb: 'ـهُمَا', suffixPrep: 'ـهُمَا', translitSuffix: '-humā / -himā', explanation: 'Third person dual (masculine and feminine). Becomes -himā after kasrah/ya.' },
  { id: 'you_all_m', english: 'you all / your (m.)', suffixNoun: 'ـكُمْ', suffixVerb: 'ـكُمْ', suffixPrep: 'ـكُمْ', translitSuffix: '-kum', explanation: 'Second person masculine plural.' },
  { id: 'you_all_f', english: 'you all / your (f.)', suffixNoun: 'ـكُنَّ', suffixVerb: 'ـكُنَّ', suffixPrep: 'ـكُنَّ', translitSuffix: '-kunna', explanation: 'Second person feminine plural.' },
  { id: 'them_m', english: 'them / their (m.)', suffixNoun: 'ـهُمْ', suffixVerb: 'ـهُمْ', suffixPrep: 'ـهُمْ', translitSuffix: '-hum / -him', explanation: 'Third person masculine plural. Becomes -him after kasrah/ya.' },
  { id: 'them_f', english: 'them / their (f.)', suffixNoun: 'ـهُنَّ', suffixVerb: 'ـهُنَّ', suffixPrep: 'ـهُنَّ', translitSuffix: '-hunna / -hinna', explanation: 'Third person feminine plural. Becomes -hinna after kasrah/ya.' }
];

interface DemonstrativeItem {
  id: string;
  arabic: string;
  translit: string;
  english: string;
  distance: 'near' | 'far';
  gender: 'masc' | 'fem' | 'common';
  number: 'singular' | 'dual' | 'plural';
  explanation: string;
}

const DEMONSTRATIVE_PRONOUNS_DB: DemonstrativeItem[] = [
  { id: 'haza', arabic: 'هَذَا', translit: 'hāðā', english: 'this (masc.)', distance: 'near', gender: 'masc', number: 'singular', explanation: 'Near demonstrative pronoun for masculine singular. "This [male/masculine object]"' },
  { id: 'hazihi', arabic: 'هَذِهِ', translit: 'hāðihī', english: 'this (fem.)', distance: 'near', gender: 'fem', number: 'singular', explanation: 'Near demonstrative pronoun for feminine singular. Note: also used for all non-human plurals regardless of gender!' },
  { id: 'hazani', arabic: 'هَذَانِ', translit: 'hāðāni', english: 'these two (masc.)', distance: 'near', gender: 'masc', number: 'dual', explanation: 'Near demonstrative pronoun for masculine dual (Nominative case).' },
  { id: 'hatani', arabic: 'هَاتَانِ', translit: 'hātāni', english: 'these two (fem.)', distance: 'near', gender: 'fem', number: 'dual', explanation: 'Near demonstrative pronoun for feminine dual (Nominative case).' },
  { id: 'haulai', arabic: 'هَؤُلَاءِ', translit: 'hā’ulā’i', english: 'these (plural)', distance: 'near', gender: 'common', number: 'plural', explanation: 'Near demonstrative pronoun for human plural (both masculine and feminine).' },
  { id: 'zalika', arabic: 'ذَلِكَ', translit: 'ðālika', english: 'that (masc.)', distance: 'far', gender: 'masc', number: 'singular', explanation: 'Far demonstrative pronoun for masculine singular. "That [male/masculine object]"' },
  { id: 'tilka', arabic: 'تِلْكَ', translit: 'tilka', english: 'that (fem.)', distance: 'far', gender: 'fem', number: 'singular', explanation: 'Far demonstrative pronoun for feminine singular. Also used for far non-human plurals.' },
  { id: 'ulaika', arabic: 'أُولَئِكَ', translit: 'ulā’ika', english: 'those (plural)', distance: 'far', gender: 'common', number: 'plural', explanation: 'Far demonstrative pronoun for human plural (both masculine and feminine).' }
];

interface RelativePronounItem {
  id: string;
  arabic: string;
  translit: string;
  english: string;
  gender: 'masc' | 'fem' | 'common';
  number: 'singular' | 'dual' | 'plural';
  explanation: string;
}

const RELATIVE_PRONOUNS_DB: RelativePronounItem[] = [
  { id: 'allazi', arabic: 'الَّذِي', translit: 'allaðī', english: 'who / which (masc. sing.)', gender: 'masc', number: 'singular', explanation: 'Relative pronoun for masculine singular nouns.' },
  { id: 'allati', arabic: 'الَّتِي', translit: 'allatī', english: 'who / which (fem. sing.)', gender: 'fem', number: 'singular', explanation: 'Relative pronoun for feminine singular nouns, and non-human plural nouns.' },
  { id: 'allazani', arabic: 'اللَّذَانِ', translit: 'allaðāni', english: 'who / which two (masc.)', gender: 'masc', number: 'dual', explanation: 'Relative pronoun for masculine dual nouns in the Nominative case.' },
  { id: 'allatani', arabic: 'اللَّتَانِ', translit: 'allatāni', english: 'who / which two (fem.)', gender: 'fem', number: 'dual', explanation: 'Relative pronoun for feminine dual nouns in the Nominative case.' },
  { id: 'allazina', arabic: 'الَّذِينَ', translit: 'allaðīna', english: 'who (masc. plural)', gender: 'masc', number: 'plural', explanation: 'Relative pronoun for masculine human plural nouns.' },
  { id: 'allati_pl', arabic: 'اللَّاتِي', translit: 'allātī', english: 'who (fem. plural)', gender: 'fem', number: 'plural', explanation: 'Relative pronoun for feminine human plural nouns (also: اللَّائِي).' }
];

export function getSuffixConjugation(category: 'noun' | 'verb' | 'preposition', itemId: string, suffixId: string) {
  if (category === 'noun') {
    const noun = itemId === 'bayt' 
      ? { arabic: 'بَيْت', translit: 'bayt', baseMean: 'house' } 
      : itemId === 'qalam' 
        ? { arabic: 'قَلَم', translit: 'qalam', baseMean: 'pen' } 
        : { arabic: 'كِتَاب', translit: 'kitāb', baseMean: 'book' };
    
    const suffixMapping: Record<string, { arabic: string; translit: string; meaning: string }> = {
      me: { arabic: 'ِي', translit: 'ī', meaning: 'my' },
      you_m: { arabic: 'ُكَ', translit: 'uka', meaning: 'your (m. sing.)' },
      you_f: { arabic: 'ُكِ', translit: 'uki', meaning: 'your (f. sing.)' },
      him: { arabic: 'ُهُ', translit: 'uhu', meaning: 'his' },
      her: { arabic: 'ُهَا', translit: 'uhā', meaning: 'her' },
      us: { arabic: 'ُنَا', translit: 'unā', meaning: 'our' },
      you_two: { arabic: 'ُكُمَا', translit: 'ukumā', meaning: 'your (dual)' },
      them_two: { arabic: 'ُهُمَا', translit: 'uhumā', meaning: 'their (dual)' },
      you_all_m: { arabic: 'ُكُمْ', translit: 'ukum', meaning: 'your (m. plur.)' },
      you_all_f: { arabic: 'ُكُنَّ', translit: 'ukunna', meaning: 'your (f. plur.)' },
      them_m: { arabic: 'ُهُمْ', translit: 'uhum', meaning: 'their (m. plur.)' },
      them_f: { arabic: 'ُهُنَّ', translit: 'uhunna', meaning: 'their (f. plur.)' }
    };
    
    const s = suffixMapping[suffixId] || suffixMapping['me'];
    return {
      arabic: `${noun.arabic}${s.arabic}`,
      translit: `${noun.translit}-${s.translit.replace('u', 'u-')}`,
      meaning: `${s.meaning} ${noun.baseMean}`
    };
  }
  
  if (category === 'verb') {
    const verb = itemId === 'saala' 
      ? { arabic: 'سَأَلَ', translit: 'sa’ala', baseMean: 'asked' } 
      : itemId === 'raaa' 
        ? { arabic: 'رَأَى', translit: 'ra’ā', baseMean: 'saw' } 
        : { arabic: 'نَصَرَ', translit: 'naṣara', baseMean: 'helped' };
    
    const suffixMapping: Record<string, { arabic: string; translit: string; meaning: string }> = {
      me: { arabic: 'َنِي', translit: 'anī', meaning: 'me' },
      you_m: { arabic: 'َكَ', translit: 'aka', meaning: 'you (m.)' },
      you_f: { arabic: 'َكِ', translit: 'aki', meaning: 'you (f.)' },
      him: { arabic: 'َهُ', translit: 'ahu', meaning: 'him' },
      her: { arabic: 'َهَا', translit: 'ahā', meaning: 'her' },
      us: { arabic: 'َنَا', translit: 'anā', meaning: 'us' },
      you_two: { arabic: 'َكُمَا', translit: 'akumā', meaning: 'you two' },
      them_two: { arabic: 'َهُمَا', translit: 'ahumā', meaning: 'them two' },
      you_all_m: { arabic: 'َكُمْ', translit: 'akum', meaning: 'you all (m.)' },
      you_all_f: { arabic: 'َكُنَّ', translit: 'akunna', meaning: 'you all (f.)' },
      them_m: { arabic: 'َهُمْ', translit: 'ahum', meaning: 'them (m.)' },
      them_f: { arabic: 'َهُنَّ', translit: 'ahunna', meaning: 'them (f.)' }
    };
    
    const s = suffixMapping[suffixId] || suffixMapping['me'];
    let arabicComb = '';
    let translitComb = '';
    
    if (itemId === 'raaa') {
      const mapper: Record<string, { arabic: string; translit: string }> = {
        me: { arabic: 'رَأَانِي', translit: 'ra’ā-nī' },
        you_m: { arabic: 'رَآكَ', translit: 'ra’ā-ka' },
        you_f: { arabic: 'رَآكِ', translit: 'ra’ā-ki' },
        him: { arabic: 'رَآهُ', translit: 'ra’ā-hu' },
        her: { arabic: 'رَآهَا', translit: 'ra’ā-hā' },
        us: { arabic: 'رَأَانَا', translit: 'ra’ā-nā' },
        you_two: { arabic: 'رَآكُمَا', translit: 'ra’ā-kumā' },
        them_two: { arabic: 'رَآهُمَا', translit: 'ra’ā-humā' },
        you_all_m: { arabic: 'رَآكُمْ', translit: 'ra’ā-kum' },
        you_all_f: { arabic: 'رَآكُنَّ', translit: 'ra’ā-kunna' },
        them_m: { arabic: 'رَآهُمْ', translit: 'ra’ā-hum' },
        them_f: { arabic: 'رَآهُنَّ', translit: 'ra’ā-hunna' }
      };
      const r = mapper[suffixId] || mapper['me'];
      arabicComb = r.arabic;
      translitComb = r.translit;
    } else if (itemId === 'saala') {
      arabicComb = `سَأَل` + s.arabic;
      translitComb = `sa’ala-${s.translit.slice(1)}`;
    } else {
      arabicComb = `نَصَر` + s.arabic;
      translitComb = `naṣara-${s.translit.slice(1)}`;
    }
    
    return {
      arabic: arabicComb,
      translit: translitComb,
      meaning: `He ${verb.baseMean} ${s.meaning}`
    };
  }
  
  if (category === 'preposition') {
    if (itemId === 'li') {
      const mapping: Record<string, { arabic: string; translit: string; meaning: string }> = {
        me: { arabic: 'لِي', translit: 'lī', meaning: 'for / to me' },
        you_m: { arabic: 'لَكَ', translit: 'laka', meaning: 'for / to you (m.)' },
        you_f: { arabic: 'لَكِ', translit: 'laki', meaning: 'for / to you (f.)' },
        him: { arabic: 'لَهُ', translit: 'lahu', meaning: 'for / to him' },
        her: { arabic: 'لَهَا', translit: 'lahā', meaning: 'for / to her' },
        us: { arabic: 'لَنَا', translit: 'lanā', meaning: 'for / to us' },
        you_two: { arabic: 'لَكُمَا', translit: 'lakumā', meaning: 'for / to you two' },
        them_two: { arabic: 'لَهُمَا', translit: 'lahumā', meaning: 'for / to them two' },
        you_all_m: { arabic: 'لَكُمْ', translit: 'lakum', meaning: 'for / to you all (m.)' },
        you_all_f: { arabic: 'لَكُنَّ', translit: 'lakunna', meaning: 'for / to you all (f.)' },
        them_m: { arabic: 'لَهُمْ', translit: 'lahum', meaning: 'for / to them (m.)' },
        them_f: { arabic: 'لَهُنَّ', translit: 'lahunna', meaning: 'for / to them (f.)' }
      };
      return mapping[suffixId] || mapping['me'];
    }
    
    if (itemId === 'ala') {
      const mapping: Record<string, { arabic: string; translit: string; meaning: string }> = {
        me: { arabic: 'عَلَيَّ', translit: '‘alayya', meaning: 'on / upon me' },
        you_m: { arabic: 'عَلَيْكَ', translit: '‘alayka', meaning: 'on / upon you (m.)' },
        you_f: { arabic: 'عَلَيْكِ', translit: '‘alayki', meaning: 'on / upon you (f.)' },
        him: { arabic: 'عَلَيْهِ', translit: '‘alayhi', meaning: 'on / upon him (note: ending changed to -hi)' },
        her: { arabic: 'عَلَيْهَا', translit: '‘alayhā', meaning: 'on / upon her' },
        us: { arabic: 'عَلَيْنَا', translit: '‘alaynā', meaning: 'on / upon us' },
        you_two: { arabic: 'عَلَيْكُمَا', translit: '‘alaykumā', meaning: 'on / upon you two' },
        them_two: { arabic: 'عَلَيْهِمَا', translit: '‘alayhimā', meaning: 'on / upon them two (note: ending changed to -himā)' },
        you_all_m: { arabic: 'عَلَيْكُمْ', translit: '‘alaykum', meaning: 'on / upon you all (m.)' },
        you_all_f: { arabic: 'عَلَيْكُنَّ', translit: '‘alaykunna', meaning: 'on / upon you all (f.)' },
        them_m: { arabic: 'عَلَيْهُمْ', translit: '‘alayhim', meaning: 'on / upon them (m. plur., note: ending changed to -him)' },
        them_f: { arabic: 'عَلَيْهِنَّ', translit: '‘alayhinna', meaning: 'on / upon them (f. plur., note: ending changed to -hinna)' }
      };
      return mapping[suffixId] || mapping['me'];
    }
    
    if (itemId === 'min') {
      const mapping: Record<string, { arabic: string; translit: string; meaning: string }> = {
        me: { arabic: 'مِنِّي', translit: 'minnī', meaning: 'from me (note double noon)' },
        you_m: { arabic: 'مِنْكَ', translit: 'minka', meaning: 'from you (m.)' },
        you_f: { arabic: 'مِنْكِ', translit: 'minki', meaning: 'from you (f.)' },
        him: { arabic: 'مِنْهُ', translit: 'minhu', meaning: 'from him' },
        her: { arabic: 'مِنْهَا', translit: 'minhā', meaning: 'from her' },
        us: { arabic: 'مِنَّا', translit: 'minnā', meaning: 'from us (note double noon)' },
        you_two: { arabic: 'مِنْكُمَا', translit: 'minkumā', meaning: 'from you two' },
        them_two: { arabic: 'مِنْهُمَا', translit: 'minhumā', meaning: 'from them two' },
        you_all_m: { arabic: 'مِنْكُمْ', translit: 'minkum', meaning: 'from you all (m.)' },
        you_all_f: { arabic: 'مِنْكُنَّ', translit: 'minkunna', meaning: 'from you all (f.)' },
        them_m: { arabic: 'مِنْهُمْ', translit: 'minkum', meaning: 'from them (m.)' },
        them_f: { arabic: 'مِنْهُنَّ', translit: 'minhunna', meaning: 'from them (f.)' }
      };
      return mapping[suffixId] || mapping['me'];
    }
  }
  
  return { arabic: '', translit: '', meaning: '' };
}

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

  // States for Surah Summary section
  const [selectedSurahId, setSelectedSurahId] = useState<string>('fatihah');
  const [selectedRootLetters, setSelectedRootLetters] = useState<string>('ح - م - د');
  const [visibleVersesCount, setVisibleVersesCount] = useState<number>(3);

  // States for Adjectives (Sifah) Section
  const [adjSelectedNounId, setAdjSelectedNounId] = useState<string>('book');
  const [adjIsDefinite, setAdjIsDefinite] = useState<boolean>(false);
  const [adjCase, setAdjCase] = useState<string>('nominative');
  const [adjSelectedAdjId, setAdjSelectedAdjId] = useState<string>('beautiful');
  const [adjSearchTerm, setAdjSearchTerm] = useState<string>('');

  // States for Comparatives (Ism ut-Tafdeel) Section
  const [compSubjectId, setCompSubjectId] = useState<string>('ahmad');
  const [compAdjId, setCompAdjId] = useState<string>('big');
  const [compCompareMode, setCompCompareMode] = useState<'noun' | 'pronoun'>('noun');
  const [compObjectId, setCompObjectId] = useState<string>('car');
  const [compPronounSuffix, setCompPronounSuffix] = useState<string>('him');

  // States for Adverbs Section
  const [advActiveTab, setAdvActiveTab] = useState<'accusative' | 'prepositional' | 'time_place'>('accusative');
  const [advSelectedVerbId, setAdvSelectedVerbId] = useState<string>('jara');
  const [advSelectedSubjectId, setAdvSelectedSubjectId] = useState<string>('walad');
  const [advSelectedAdverbId, setAdvSelectedAdverbId] = useState<string>('saree\'an');
  const [advExtensionId, setAdvExtensionId] = useState<string>('park');

  // States for Pronouns Section
  const [proActiveTab, setProActiveTab] = useState<'subject' | 'suffix' | 'demonstrative' | 'relative'>('subject');
  const [proSelectedCategory, setProSelectedCategory] = useState<'noun' | 'verb' | 'preposition'>('noun');
  const [proSelectedNounId, setProSelectedNounId] = useState<string>('kitab');
  const [proSelectedVerbId, setProSelectedVerbId] = useState<string>('nasara');
  const [proSelectedPrepId, setProSelectedPrepId] = useState<string>('li');
  const [proSelectedSuffixId, setProSelectedSuffixId] = useState<string>('me');

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
      return appStorage.getItem('quranic_arabic_basics_nav') || 'blocks';
    } catch {
      return 'blocks';
    }
  });

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    try {
      appStorage.setItem('quranic_arabic_basics_nav', sectionId);
    } catch (e) {
      // Ignore
    }
  };

  const navSections = [
    { id: 'blocks', label: 'Building Blocks', icon: Layers },
    { id: 'adjectives', label: 'Adjectives (Sifah)', icon: Tag },
    { id: 'adverbs', label: 'Adverbs (Zarf)', icon: Compass },
    { id: 'pronouns', label: 'Pronouns (Damā\'ir)', icon: Users },
    { id: 'sentences', label: 'Sentence Lab', icon: Sparkles },
    { id: 'cases', label: 'Grammar Cases', icon: BookOpen },
    { id: 'awzan', label: 'Verb Forms', icon: Layers },
    { id: 'surah', label: 'Surah Summary', icon: BookMarked },
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
                    <div key={idx} className="text-right p-1.5 rounded bg-black/10 border border-current/5 relative">
                      <div className="absolute top-1 left-1">
                        <AudioPlayButton text={ex.arabic} isParchment={isParchment} />
                      </div>
                      <div className="text-sm font-serif font-black text-amber-500 overflow-hidden text-ellipsis whitespace-nowrap pl-5 mt-3" dir="rtl">{ex.arabic}</div>
                      <div className="text-[9px] font-mono text-left block opacity-60 mt-0.5">{ex.transliteration}</div>
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

      {/* 2.5 ARABIC ADJECTIVES (SIFAH & MAWSOOF) SECTION */}
      {activeSection === 'adjectives' && (
      <div className="space-y-6 animate-fadeIn">
        {/* Intro Card */}
        <div className={`p-6 rounded-2xl border ${innerCardBgClass} space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/10 pb-3">
            <div className="flex items-center gap-2">
              <Tag className={`w-5 h-5 ${fontColorThemeText} animate-pulse`} />
              <h3 className="text-base font-bold uppercase tracking-wider">The Grammar of Arabic Adjectives (الصِّفَةُ وَالْمَوْصُوفُ)</h3>
            </div>
            <span className="text-[10px] font-mono opacity-60 uppercase tracking-wider font-extrabold bg-current/10 px-2 py-0.5 rounded">
              Pillar of Arabic Morphology
            </span>
          </div>
          
          <p className="text-xs leading-relaxed opacity-90 max-w-4xl">
            In classical Arabic, an adjective is called a <strong>صِفَة (Sifah)</strong> or <strong>نَعْت (Na't)</strong>, and the noun it modifies is called the <strong>مَوْصُوف (Mawsoof)</strong>. Unlike English where adjectives precede nouns, the Arabic adjective <strong>always follows the noun</strong> and mirrors its grammatical characteristics in <strong>four essential dimensions</strong>.
          </p>

          {/* The Fourfold Agreement Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-current/10 bg-current/5 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-amber-500">1. Gender (الْجِنْس)</span>
              <p className="text-[11px] leading-relaxed opacity-80">
                Adjectives must match the gender of the noun. Feminine nouns (often marked with <strong>Ta Marbutah ة</strong>) require feminine adjectives.
              </p>
              <div className="text-[11px] font-semibold font-serif text-right border-t border-current/5 pt-1 mt-1" dir="rtl">
                بِنْتٌ جَمِيلَةٌ <span className="text-[9px] font-sans font-normal opacity-60">(Feminine girl)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-current/10 bg-current/5 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-emerald-500">2. Definiteness (التَّعْرِيف)</span>
              <p className="text-[11px] leading-relaxed opacity-80">
                If the noun is Definite (has <strong>الْـ / Al-</strong>), the adjective must also accept <strong>Al-</strong>. If indefinite, both remain indefinite.
              </p>
              <div className="text-[11px] font-semibold font-serif text-right border-t border-current/5 pt-1 mt-1" dir="rtl">
                الْكِتَابُ الْجَدِيدُ <span className="text-[9px] font-sans font-normal opacity-60">(Definite book)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-current/10 bg-current/5 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-indigo-500">3. Case/I'rab (الإِعْرَاب)</span>
              <p className="text-[11px] leading-relaxed opacity-80">
                The adjective matches the final vowel case ending of the noun: Nominative (Dammah <strong>ـُ / ـٌ</strong>), Accusative (Fathah <strong>ـَ / ـً</strong>), or Genitive (Kasrah <strong>ـِ / ـٍ</strong>).
              </p>
              <div className="text-[11px] font-semibold font-serif text-right border-t border-current/5 pt-1 mt-1" dir="rtl">
                فِي بَيْتٍ كَبِيرٍ <span className="text-[9px] font-sans font-normal opacity-60">(Genitive: ...in ...in)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-current/10 bg-current/5 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-pink-500">4. Number (الْعَدَد)</span>
              <p className="text-[11px] leading-relaxed opacity-80">
                Singular & human plural nouns match adjectives. <strong>Crucial Rule:</strong> Non-human plural nouns (e.g. books, cars) always take <strong>feminine singular</strong> adjectives!
              </p>
              <div className="text-[11px] font-semibold font-serif text-right border-t border-current/5 pt-1 mt-1" dir="rtl">
                كُتُبٌ قَدِيمَةٌ <span className="text-[9px] font-sans font-normal text-pink-400 font-normal">(Non-human plural exception)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side: Attributive Phrase vs Predicative Sentence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-5 rounded-2xl border ${innerCardBgClass} space-y-3`}>
            <div className="flex items-center justify-between border-b border-current/10 pb-2">
              <h4 className="text-xs font-extrabold uppercase text-indigo-400">Attributive Phrase (صِفَة وَمَوْصُوف)</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-300">Phrase</span>
            </div>
            <p className="text-[11px] opacity-90 leading-relaxed">
              When both the noun and the adjective agree in definiteness, they form an incomplete description phrase. They "belong together".
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center bg-black/10 p-2.5 rounded-lg">
                <span className="text-[11px] font-medium text-slate-300">"A big house" (Indefinite phrase)</span>
                <span className="font-serif font-black text-amber-500" dir="rtl">بَيْتٌ كَبِيرٌ</span>
              </div>
              <div className="flex justify-between items-center bg-black/10 p-2.5 rounded-lg">
                <span className="text-[11px] font-medium text-slate-300">"The big house" (Definite phrase)</span>
                <span className="font-serif font-black text-amber-500" dir="rtl">الْبَيْتُ الْكَبِيرُ</span>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border ${innerCardBgClass} space-y-3`}>
            <div className="flex items-center justify-between border-b border-current/10 pb-2">
              <h4 className="text-xs font-extrabold uppercase text-emerald-400">Predicative Sentence (جُمْلَة اِسْمِيَّة)</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300">Complete Sentence</span>
            </div>
            <p className="text-[11px] opacity-90 leading-relaxed">
              When the noun is definite (Subject / Mubtada') but the adjective remains <strong>indefinite</strong> (Predicate / Khabar), they form a complete statement meaning "the noun <strong>is</strong> adjective".
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center bg-black/10 p-2.5 rounded-lg">
                <span className="text-[11px] font-medium text-slate-300">"The house is big" (Nominal sentence)</span>
                <span className="font-serif font-black text-emerald-500" dir="rtl">الْبَيْتُ كَبِيرٌ</span>
              </div>
              <div className="flex justify-between items-center bg-black/10 p-2.5 rounded-lg">
                <span className="text-[11px] font-medium text-slate-300">"The books are beautiful" (Exception plural)</span>
                <span className="font-serif font-black text-emerald-500" dir="rtl">الْكُتُبُ جَمِيلَةٌ</span>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE SIFAH-MAWSOOF BUILDER PLAYGROUND */}
        <div className={`p-6 rounded-2xl border ${innerCardBgClass} space-y-5`}>
          <div className="space-y-1">
            <h4 className="font-bold text-sm uppercase tracking-wider text-amber-500">Sifah-Mawsoof Agreement Playground</h4>
            <p className="text-xs text-slate-400">
              Customize a noun and watch how the adjective dynamically transforms to remain in perfect, strict classical agreement!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Controls (Left) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Noun Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">1. Select Noun (Mawsoof)</label>
                <select
                  value={adjSelectedNounId}
                  onChange={(e) => setAdjSelectedNounId(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border bg-black/30 text-slate-200 outline-none ${accentBorderTheme}`}
                >
                  {Object.entries(ADJ_NOUNS_DB).map(([id, n]) => (
                    <option key={id} value={id} className="bg-slate-900">{n.label} — {n.desc}</option>
                  ))}
                </select>
              </div>

              {/* Definiteness Toggle */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">2. Definiteness (Al- prefix)</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAdjIsDefinite(false)}
                    className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      !adjIsDefinite
                        ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                        : 'bg-black/20 border-current/10 text-slate-400'
                    }`}
                  >
                    Indefinite (كِتَابٌ)
                  </button>
                  <button
                    onClick={() => setAdjIsDefinite(true)}
                    className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      adjIsDefinite
                        ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                        : 'bg-black/20 border-current/10 text-slate-400'
                    }`}
                  >
                    Definite (الْكِتَابُ)
                  </button>
                </div>
              </div>

              {/* Grammatical Case Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">3. Grammatical Case (I'rab)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'nominative', label: 'Nominative (Raf‘)', ending: 'ـُ / ـٌ' },
                    { id: 'accusative', label: 'Accusative (Naṣb)', ending: 'ـَ / ـً' },
                    { id: 'genitive', label: 'Genitive (Jarr)', ending: 'ـِ / ـٍ' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setAdjCase(c.id)}
                      className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold text-center transition-all flex flex-col items-center ${
                        adjCase === c.id
                          ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                          : 'bg-black/20 border-current/10 text-slate-400'
                      }`}
                    >
                      <span>{c.label}</span>
                      <span className="text-[10px] opacity-75 font-serif mt-0.5">{c.ending}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Adjective Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">4. Choose Adjective (Sifah)</label>
                <select
                  value={adjSelectedAdjId}
                  onChange={(e) => setAdjSelectedAdjId(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border bg-black/30 text-slate-200 outline-none ${accentBorderTheme}`}
                >
                  {Object.entries(ADJ_ADJECTIVES_DB).map(([id, a]) => (
                    <option key={id} value={id} className="bg-slate-900">{a.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rendering Output (Right) */}
            <div className="lg:col-span-7 h-full flex flex-col justify-between space-y-4">
              {(() => {
                const nounData = ADJ_NOUNS_DB[adjSelectedNounId];
                const defKey = adjIsDefinite ? 'definite' : 'indefinite';
                const nounForm = nounData.forms[defKey][adjCase as 'nominative' | 'accusative' | 'genitive'];

                const adjData = ADJ_ADJECTIVES_DB[adjSelectedAdjId];
                let adjTypeKey: 'masc_sing' | 'fem_sing' | 'human_masc_plural' | 'human_fem_plural' = 'masc_sing';
                if (nounData.type === 'fem_sing' || nounData.type === 'non_human_plural') {
                  adjTypeKey = 'fem_sing';
                } else if (nounData.type === 'human_masc_plural') {
                  adjTypeKey = 'human_masc_plural';
                } else if (nounData.type === 'human_fem_plural') {
                  adjTypeKey = 'human_fem_plural';
                }
                const adjForm = adjData.forms[adjTypeKey][defKey][adjCase as 'nominative' | 'accusative' | 'genitive'];

                const isNonHumanPluralRule = nounData.type === 'non_human_plural';

                return (
                  <div className="p-6 rounded-2xl bg-black/30 border border-current/10 flex flex-col justify-between h-full min-h-[280px] space-y-4">
                    <div className="flex items-center justify-between border-b border-current/15 pb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">Live Rendered Phrase</span>
                      <AudioPlayButton text={`${nounForm.arabic} ${adjForm.arabic}`} isParchment={isParchment} />
                    </div>

                    {/* The Arabic Display */}
                    <div className="text-center py-4 space-y-2">
                      <div className="text-4xl font-serif font-extrabold text-amber-400 tracking-wide leading-relaxed" dir="rtl">
                        <span className="text-slate-100 hover:text-emerald-400 transition-colors cursor-help" title="Noun / Mawsoof">{nounForm.arabic}</span>
                        {" "}
                        <span className="text-amber-400 hover:text-amber-300 transition-colors cursor-help" title="Adjective / Sifah">{adjForm.arabic}</span>
                      </div>
                      <div className="text-sm font-mono text-slate-300 tracking-wider">
                        {nounForm.translit} {adjForm.translit}
                      </div>
                      <div className="text-base font-sans font-medium text-indigo-200 mt-2">
                        "{adjIsDefinite ? 'the' : 'a'} {adjForm.literal} {nounForm.literal}"
                      </div>
                    </div>

                    {/* Visual indicators of the agreement */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-current/10">
                      <div className="p-2 bg-current/5 rounded-xl text-center space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Gender</span>
                        <span className="text-[10px] font-bold text-emerald-400">
                          {nounData.type.includes('fem') || isNonHumanPluralRule ? 'Feminine (ة)' : 'Masculine'}
                        </span>
                      </div>

                      <div className="p-2 bg-current/5 rounded-xl text-center space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Definiteness</span>
                        <span className="text-[10px] font-bold text-indigo-400">
                          {adjIsDefinite ? 'Definite (الـ)' : 'Indefinite'}
                        </span>
                      </div>

                      <div className="p-2 bg-current/5 rounded-xl text-center space-y-1">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Case State</span>
                        <span className="text-[10px] font-bold text-amber-400 capitalize">
                          {adjCase}
                        </span>
                      </div>

                      <div className="p-2 bg-current/5 rounded-xl text-center space-y-1 relative group">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">Number</span>
                        <span className={`text-[10px] font-bold ${isNonHumanPluralRule ? 'text-pink-400 animate-pulse' : 'text-slate-300'}`}>
                          {isNonHumanPluralRule ? 'Fem. Sing. *' : nounData.type.includes('plural') ? 'Plural' : 'Singular'}
                        </span>
                      </div>
                    </div>

                    {isNonHumanPluralRule && (
                      <div className="bg-pink-500/10 border border-pink-500/25 p-2.5 rounded-xl text-[10px] leading-relaxed text-pink-300 animate-fadeIn">
                        ⚠️ <strong>Non-Human Plural Exception Active!</strong> The noun <strong>كُتُب (Books)</strong> is a non-human plural. Therefore, classical grammar dictates that its adjective must be in the <strong>feminine singular form (جَمِيلَة / كَبِيرَة)</strong>, matching in case and definiteness.
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE GLOSSARY OF 20 MOST COMMON ARABIC ADJECTIVES */}
        <div className={`p-6 rounded-2xl border ${innerCardBgClass} space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/10 pb-3">
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm uppercase tracking-wider text-emerald-400">Glossary of Common Adjectives</h4>
              <p className="text-[11px] text-slate-400">
                Explore the twenty most frequent adjectives in Classical Arabic literature with dual-gender listings and live pronunciation anchors.
              </p>
            </div>
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search adjectives by English or Arabic..."
              value={adjSearchTerm}
              onChange={(e) => setAdjSearchTerm(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-current/20 bg-black/30 text-xs outline-none focus:border-amber-500/50 w-full sm:w-64 text-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMON_ADJECTIVES_GLOSSARY.filter(item => {
              const cleanSearch = adjSearchTerm.toLowerCase().trim();
              return (
                item.english.toLowerCase().includes(cleanSearch) ||
                item.masc.includes(cleanSearch) ||
                item.fem.includes(cleanSearch) ||
                item.translit.toLowerCase().includes(cleanSearch)
              );
            }).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-current/10 bg-black/10 hover:border-current/20 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono font-bold bg-emerald-950/40 text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {item.category}
                    </span>
                    <AudioPlayButton text={item.masc} isParchment={isParchment} />
                  </div>
                  <div className="text-right pt-1" dir="rtl">
                    <span className="font-serif font-black text-xl text-slate-100">{item.masc}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="font-serif font-black text-xl text-amber-500" title="Feminine Form">{item.fem}</span>
                  </div>
                  <div className="text-[10.5px] font-mono text-slate-400 text-center">
                    {item.translit}
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-current/5">
                  <p className="text-xs font-semibold text-slate-200">{item.english}</p>
                  <p className="text-[10px] text-slate-400 leading-none">Antonym: <strong className="text-pink-400 font-medium font-serif" dir="rtl">{item.antonym}</strong></p>
                  <div className="bg-black/20 p-1.5 rounded text-[10px] font-serif text-right text-slate-300 mt-1" dir="rtl">
                    {item.example}
                  </div>
                </div>
              </div>
            ))}

            {COMMON_ADJECTIVES_GLOSSARY.filter(item => {
              const cleanSearch = adjSearchTerm.toLowerCase().trim();
              return (
                item.english.toLowerCase().includes(cleanSearch) ||
                item.masc.includes(cleanSearch) ||
                item.fem.includes(cleanSearch) ||
                item.translit.toLowerCase().includes(cleanSearch)
              );
            }).length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-8 text-slate-500 text-xs">
                No adjectives match your search criteria. Try searching for "big", "new", or specific Arabic roots.
              </div>
            )}
          </div>
        </div>

        {/* COMPARATIVE & SUPERLATIVE ADJECTIVES (ISM UT-TAFDEEL) */}
        <div className={`p-6 rounded-2xl border ${innerCardBgClass} space-y-6 animate-fadeIn`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Flame className={`w-5 h-5 ${fontColorThemeText} animate-pulse`} />
                <h3 className="text-base font-bold uppercase tracking-wider">Arabic Comparatives & Superlatives (اِسْمُ التَّفْضِيلِ)</h3>
              </div>
              <p className="text-xs text-slate-400">
                In Classical Arabic, comparatives ("bigger than") and superlatives ("the biggest") are synthesized on the majestic, singular pattern of <strong className="text-amber-400">أَفْعَل (Af‘al)</strong>.
              </p>
            </div>
            <span className="text-[10px] font-mono opacity-60 uppercase tracking-wider font-extrabold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded">
              Grammatical Formula: أَفْعَل (Af'al)
            </span>
          </div>

          {/* Grammar & Morphological Principles Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-current/10 bg-current/5 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-amber-500">The Invariable Comparative Rule</span>
              <p className="text-[11px] leading-relaxed opacity-90">
                When followed by the preposition <strong>مِنْ (min - than)</strong>, the comparative adjective remains strictly <strong>masculine singular</strong>. It ignores the gender and number of the nouns being compared!
              </p>
              <div className="bg-black/20 p-2 rounded text-[11px] font-serif space-y-1">
                <div className="flex justify-between" dir="rtl">
                  <span>أَحْمَدُ أَكْبَرُ مِنِّي</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">Ahmad is bigger than me</span>
                </div>
                <div className="flex justify-between border-t border-current/5 pt-1 mt-1" dir="rtl">
                  <span>فَاطِمَةُ أَكْبَرُ مِنْهُ</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">Fatimah is bigger than him</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-current/10 bg-current/5 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-emerald-500">Geminate/Doubled & Irregular Roots</span>
              <p className="text-[11px] leading-relaxed opacity-90">
                Roots ending in identical consonants merge into a <strong>Shaddah (ّ )</strong>, e.g. <strong dir="rtl">أَقَلّ</strong> (Aqall - less) from <em>Qaleel</em>. Additionally, <strong dir="rtl">خَيْرٌ</strong> (better) and <strong dir="rtl">شَرٌّ</strong> (worse) bypass the pattern completely!
              </p>
              <div className="bg-black/20 p-2 rounded text-[11px] font-serif space-y-1">
                <div className="flex justify-between" dir="rtl">
                  <span>عِلْمٌ خَيْرٌ مِنْ مَالٍ</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">Knowledge is better than wealth</span>
                </div>
                <div className="flex justify-between border-t border-current/5 pt-1 mt-1" dir="rtl">
                  <span>مَاءٌ أَقَلُّ مِنَ الْعَسَلِ</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">Water is less than honey</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-current/10 bg-current/5 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-indigo-500">The Superlative Dual Paths</span>
              <p className="text-[11px] leading-relaxed opacity-90">
                Superlatives ("the most...") are constructed either via **Iḍāfah (Genitive construction)** with singular indefinite/plural definite nouns, or via the definite form matching in gender with the **فُعْلَى (Fu‘lā)** pattern for feminine singular.
              </p>
              <div className="bg-black/20 p-2 rounded text-[11px] font-serif space-y-1">
                <div className="flex justify-between" dir="rtl">
                  <span>أَكْبَرُ بَيْتٍ</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">"The biggest house" (Indefinite)</span>
                </div>
                <div className="flex justify-between border-t border-current/5 pt-1 mt-1" dir="rtl">
                  <span>الدَّوْلَةُ الْعُظْمَى</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">"The greatest state" (Definite fem.)</span>
                </div>
              </div>
            </div>
          </div>

          {/* INTERACTIVE COMPARATIVE SENTENCE LAB */}
          <div className="p-5 rounded-xl border border-current/10 bg-black/20 space-y-4">
            <div className="space-y-1">
              <h4 className="font-bold text-sm uppercase tracking-wider text-amber-500">Interactive Ism ut-Tafdeel Sentence Constructor</h4>
              <p className="text-[11px] text-slate-400">
                Design comparative phrases dynamically. Notice how the comparative word remains beautifully unaffected by the subject's gender and plural status!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left side: Controls */}
              <div className="lg:col-span-5 space-y-4">
                {/* Mode Selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">1. Target Comparison Type</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCompCompareMode('noun')}
                      className={`flex-1 py-1.5 px-3 rounded-xl border text-[11px] font-bold transition-all ${
                        compCompareMode === 'noun'
                          ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                          : 'bg-black/20 border-current/10 text-slate-400'
                      }`}
                    >
                      Compare with Noun
                    </button>
                    <button
                      onClick={() => setCompCompareMode('pronoun')}
                      className={`flex-1 py-1.5 px-3 rounded-xl border text-[11px] font-bold transition-all ${
                        compCompareMode === 'pronoun'
                          ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                          : 'bg-black/20 border-current/10 text-slate-400'
                      }`}
                    >
                      Compare with Pronoun
                    </button>
                  </div>
                </div>

                {/* Subject Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">2. Select Subject Noun (A)</label>
                  <select
                    value={compSubjectId}
                    onChange={(e) => setCompSubjectId(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border bg-black/30 text-slate-200 outline-none ${accentBorderTheme}`}
                  >
                    {Object.entries(COMP_SUBJECTS_NOMINATIVE).map(([id, s]) => (
                      <option key={id} value={id} className="bg-slate-900">{s.label} ({s.arabic})</option>
                    ))}
                  </select>
                </div>

                {/* Adjective Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">3. Select Base Adjective</label>
                  <select
                    value={compAdjId}
                    onChange={(e) => setCompAdjId(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border bg-black/30 text-slate-200 outline-none ${accentBorderTheme}`}
                  >
                    {Object.entries(COMP_ADJECTIVES).map(([id, a]) => (
                      <option key={id} value={id} className="bg-slate-900">{a.label}</option>
                    ))}
                  </select>
                </div>

                {/* Target object or pronoun depending on mode */}
                {compCompareMode === 'noun' ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">4. Select Object Noun (B)</label>
                    <select
                      value={compObjectId}
                      onChange={(e) => setCompObjectId(e.target.value)}
                      className={`w-full text-xs px-3 py-2 rounded-xl border bg-black/30 text-slate-200 outline-none ${accentBorderTheme}`}
                    >
                      {Object.entries(COMP_OBJECTS_GENITIVE).map(([id, s]) => (
                        <option key={id} value={id} className="bg-slate-900" disabled={id === compSubjectId}>
                          {s.translation} ({s.arabic})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">4. Select Object Pronoun</label>
                    <select
                      value={compPronounSuffix}
                      onChange={(e) => setCompPronounSuffix(e.target.value)}
                      className={`w-full text-xs px-3 py-2 rounded-xl border bg-black/30 text-slate-200 outline-none ${accentBorderTheme}`}
                    >
                      {Object.entries(COMP_PRONOUNS).map(([id, p]) => (
                        <option key={id} value={id} className="bg-slate-900">{p.meaning} ({p.arabic})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Right side: Real-time rendered comparative card */}
              <div className="lg:col-span-7 h-full flex flex-col justify-between space-y-4">
                {(() => {
                  const subjectData = COMP_SUBJECTS_NOMINATIVE[compSubjectId] || COMP_SUBJECTS_NOMINATIVE['ahmad'];
                  const adjData = COMP_ADJECTIVES[compAdjId] || COMP_ADJECTIVES['big'];
                  
                  let renderedSentence = "";
                  let renderedTranslit = "";
                  let renderedMeaning = "";

                  if (compCompareMode === 'noun') {
                    const objectData = COMP_OBJECTS_GENITIVE[compObjectId] || COMP_OBJECTS_GENITIVE['car'];
                    renderedSentence = `${subjectData.arabic} ${adjData.compArabic} ${objectData.prefix}${objectData.arabic}`;
                    
                    const minWordTranslit = objectData.prefix.includes('مِنَ') ? 'mina' : 'min';
                    renderedTranslit = `${subjectData.translit} ${adjData.compTranslit} ${minWordTranslit} ${objectData.translit}`;
                    renderedMeaning = `"${subjectData.label} is ${adjData.meaning.split('/')[0].trim()} than ${objectData.translation}"`;
                  } else {
                    const pronounData = COMP_PRONOUNS[compPronounSuffix] || COMP_PRONOUNS['him'];
                    renderedSentence = `${subjectData.arabic} ${adjData.compArabic} ${pronounData.arabic}`;
                    renderedTranslit = `${subjectData.translit} ${adjData.compTranslit} ${pronounData.translit}`;
                    renderedMeaning = `"${subjectData.label} is ${adjData.meaning.split('/')[0].trim()} ${pronounData.meaning}"`;
                  }

                  return (
                    <div className="p-6 rounded-xl bg-black/30 border border-current/10 flex flex-col justify-between h-full min-h-[260px] space-y-4">
                      <div className="flex items-center justify-between border-b border-current/15 pb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">Live Constructed Comparative</span>
                        <AudioPlayButton text={renderedSentence} isParchment={isParchment} />
                      </div>

                      <div className="text-center py-4 space-y-2">
                        <div className="text-3xl sm:text-4xl font-serif font-extrabold text-amber-400 tracking-wide leading-relaxed" dir="rtl">
                          <span className="text-slate-100" title="Subject (Nominative)">{subjectData.arabic}</span>
                          {" "}
                          <span className="text-amber-400" title="Invariable Comparative Form">{adjData.compArabic}</span>
                          {" "}
                          <span className="text-emerald-400" title="Prepositional Object">
                            {compCompareMode === 'noun' 
                              ? `${COMP_OBJECTS_GENITIVE[compObjectId].prefix}${COMP_OBJECTS_GENITIVE[compObjectId].arabic}`
                              : COMP_PRONOUNS[compPronounSuffix].arabic}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-mono text-slate-300 tracking-wider">
                          {renderedTranslit}
                        </div>
                        <div className="text-sm sm:text-base font-sans font-medium text-indigo-200 mt-2">
                          {renderedMeaning}
                        </div>
                      </div>

                      {/* Interactive breakdown explanations */}
                      <div className="p-3 bg-current/5 rounded-xl space-y-1 text-[11px] leading-relaxed text-slate-300">
                        <div className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-extrabold">Morphology:</span>
                          <span>
                            The root <strong className="font-mono text-amber-300">{adjData.root}</strong> takes the template <strong className="font-mono text-amber-300">أَفْعَل (Af‘al)</strong> to create the comparative <strong className="font-serif text-slate-100">{adjData.compArabic}</strong> ({adjData.compTranslit}).
                          </span>
                        </div>
                        {adjData.isGeminate && (
                          <div className="flex items-start gap-1.5 text-pink-300 border-t border-current/5 pt-1 mt-1">
                            <span className="font-bold">⚠️ Doubled Root Rule:</span>
                            <span>
                              Since the second and third letters of <strong className="font-serif">قَلِيل</strong> are identical (ل and ل), they combine into a shaddah to form <strong className="font-serif text-slate-100">أَقَلُّ</strong> (Aqallu).
                            </span>
                          </div>
                        )}
                        <div className="flex items-start gap-1.5 border-t border-current/5 pt-1 mt-1">
                          <span className="text-emerald-400 font-extrabold">Agreement:</span>
                          <span>
                            Notice that <strong className="font-serif text-slate-100">{adjData.compArabic}</strong> did NOT change, even if you switched between masculine (Ahmad), feminine (Fatimah), or plural (The Books) subjects!
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* SUPERLATIVE FORMULARY WORKSHOP */}
          <div className="p-5 rounded-xl border border-current/10 bg-black/20 space-y-4">
            <div className="space-y-1">
              <h4 className="font-bold text-sm uppercase tracking-wider text-emerald-400">The Superlative Structural Modes</h4>
              <p className="text-[11px] text-slate-400">
                Explore the three different classical ways to formulate absolute superlatives in Arabic. Select an adjective to view its live structural patterns:
              </p>
            </div>

            {/* Live Superlative Synthesizer Row */}
            {(() => {
              const activeAdj = COMP_ADJECTIVES[compAdjId] || COMP_ADJECTIVES['big'];
              
              // Examples mapping
              const examples = {
                big: { nounSingIndef: "بَيْتٍ (house)", nounPlurDef: "الْبُيُوتِ (the houses)", nounDefFem: "الْبِنْتُ (the daughter)", output1: `${activeAdj.compArabic} بَيْتٍ`, translit1: `${activeAdj.compTranslit} baytin`, translation1: "The biggest house (literally: 'biggest of a house')", output2: `${activeAdj.compArabic} الْبُيُوتِ`, translit2: `${activeAdj.compTranslit} l-buyūti`, translation2: "The biggest of the houses", output3: `الْبِنْتُ ${activeAdj.femSuperlative.split(' ')[0]}`, translit3: `Al-Bintu l-kubrā`, translation3: "The eldest daughter (Strict classical matching)" },
                small: { nounSingIndef: "بِنْتٍ (girl)", nounPlurDef: "الْبَنَاتِ (the girls)", nounDefFem: "الْقَرْيَةُ (the village)", output1: `${activeAdj.compArabic} بِنْتٍ`, translit1: `${activeAdj.compTranslit} bintin`, translation1: "The smallest girl", output2: `${activeAdj.compArabic} الْبَنَاتِ`, translit2: `${activeAdj.compTranslit} l-banāti`, translation2: "The smallest of the girls", output3: `الْقَرْيَةُ ${activeAdj.femSuperlative.split(' ')[0]}`, translit3: `Al-Qaryatu ṣ-ṣughrā`, translation3: "The smallest village" },
                beautiful: { nounSingIndef: "وَرْدَةٍ (rose)", nounPlurDef: "الْوُرُودِ (the roses)", nounDefFem: "الْقَصِيدَةُ (the poem)", output1: `${activeAdj.compArabic} وَرْدَةٍ`, translit1: `${activeAdj.compTranslit} wardatin`, translation1: "The most beautiful rose", output2: `${activeAdj.compArabic} الْوُرُودِ`, translit2: `${activeAdj.compTranslit} l-wurūdi`, translation2: "The most beautiful of the roses", output3: `الْقَصِيدَةُ ${activeAdj.femSuperlative.split(' ')[0]}`, translit3: `Al-Qaṣīdatu l-jumlā`, translation3: "The most beautiful poem" },
                easy: { nounSingIndef: "سُؤَالٍ (question)", nounPlurDef: "الْأَسْئِلَةِ (the questions)", nounDefFem: "الطَّرِيقَةُ (the method)", output1: `${activeAdj.compArabic} سُؤَالٍ`, translit1: `${activeAdj.compTranslit} su'ālin`, translation1: "The easiest question", output2: `${activeAdj.compArabic} الْأَسْئِلَةِ`, translit2: `${activeAdj.compTranslit} l-as'ilati`, translation2: "The easiest of the questions", output3: `الطَّرِيقَةُ ${activeAdj.femSuperlative.split(' ')[0]}`, translit3: `Aṭ-Ṭarīqatu s-suhlā`, translation3: "The easiest method" },
                difficult: { nounSingIndef: "اِمْتِحَانٍ (exam)", nounPlurDef: "الْاِمْتِحَانَاتِ (the exams)", nounDefFem: "الْمَسْأَلَةُ (the problem)", output1: `${activeAdj.compArabic} اِمْتِحَانٍ`, translit1: `${activeAdj.compTranslit} imtiḥānin`, translation1: "The hardest exam", output2: `${activeAdj.compArabic} الْاِمْتِحَانَاتِ`, translit2: `${activeAdj.compTranslit} l-imtiḥānāti`, translation2: "The hardest of the exams", output3: `الْمَسْأَلَةُ ${activeAdj.femSuperlative.split(' ')[0]}`, translit3: `Al-Mas'alatu ṣ-ṣu‘bā`, translation3: "The most difficult problem" },
                near: { nounSingIndef: "طَرِيقٍ (path)", nounPlurDef: "الْمَسَاجِدِ (the mosques)", nounDefFem: "الْقُرْبَى (relationship)", output1: `${activeAdj.compArabic} طَرِيقٍ`, translit1: `${activeAdj.compTranslit} ṭarīqin`, translation1: "The nearest path", output2: `${activeAdj.compArabic} الْمَسَاجِدِ`, translit2: `${activeAdj.compTranslit} l-masājidi`, translation2: "The nearest of the mosques", output3: `الْأَقْرِبَاءُ ${activeAdj.femSuperlative.split(' ')[0]}`, translit3: `Al-Aqribā'u l-qurbā`, translation3: "The closest relatives" },
                many: { nounSingIndef: "رَجُلٍ (man)", nounPlurDef: "النَّاسِ (people)", nounDefFem: "الطَّائِفَةُ (the group)", output1: `${activeAdj.compArabic} رَجُلٍ`, translit1: `${activeAdj.compTranslit} rajulin`, translation1: "The most (plentiful) man", output2: `${activeAdj.compArabic} النَّاسِ`, translit2: `${activeAdj.compTranslit} n-nāsi`, translation2: "The most of the people", output3: `الْمَجْمُوعَةُ ${activeAdj.femSuperlative.split(' ')[0]}`, translit3: `Al-Majmū‘atu l-kuthrā`, translation3: "The majority group" },
                few: { nounSingIndef: "مَاءٍ (water)", nounPlurDef: "النَّاسِ (people)", nounDefFem: "الْفِئَةُ (the division)", output1: `${activeAdj.compArabic} مَاءٍ`, translit1: `${activeAdj.compTranslit} mā'in`, translation1: "The least water", output2: `${activeAdj.compArabic} النَّاسِ`, translit2: `${activeAdj.compTranslit} n-nāsi`, translation2: "The least of the people", output3: `الْفِئَةُ ${activeAdj.femSuperlative.split(' ')[0]}`, translit3: `Al-Fi'atu l-qullā`, translation3: "The smallest fraction" }
              };

              const activeExamples = examples[compAdjId as keyof typeof examples] || examples.big;

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Mode 1 */}
                  <div className="p-4 rounded-xl border border-current/10 bg-black/10 flex flex-col justify-between space-y-3">
                    <div className="border-b border-current/10 pb-1 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">1. Indefinite Singular</span>
                      <AudioPlayButton text={activeExamples.output1} isParchment={isParchment} />
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed">
                      Place the comparative word directly before a <strong>singular, indefinite noun</strong> in the genitive case.
                    </p>
                    <div className="text-center py-2 bg-black/20 rounded-lg">
                      <div className="text-xl font-serif font-bold text-amber-400" dir="rtl">
                        {activeExamples.output1}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">{activeExamples.translit1}</div>
                    </div>
                    <span className="text-xs font-medium text-center text-slate-300">"{activeExamples.translation1}"</span>
                  </div>

                  {/* Mode 2 */}
                  <div className="p-4 rounded-xl border border-current/10 bg-black/10 flex flex-col justify-between space-y-3">
                    <div className="border-b border-current/10 pb-1 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">2. Definite Plural</span>
                      <AudioPlayButton text={activeExamples.output2} isParchment={isParchment} />
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed">
                      Place the comparative word directly before a <strong>definite, plural noun</strong> in the genitive case.
                    </p>
                    <div className="text-center py-2 bg-black/20 rounded-lg">
                      <div className="text-xl font-serif font-bold text-emerald-400" dir="rtl">
                        {activeExamples.output2}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">{activeExamples.translit2}</div>
                    </div>
                    <span className="text-xs font-medium text-center text-slate-300">"{activeExamples.translation2}"</span>
                  </div>

                  {/* Mode 3 */}
                  <div className="p-4 rounded-xl border border-current/10 bg-black/10 flex flex-col justify-between space-y-3">
                    <div className="border-b border-current/10 pb-1 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">3. Classical Fem. Agreement</span>
                      <AudioPlayButton text={activeExamples.output3} isParchment={isParchment} />
                    </div>
                    <p className="text-[11px] opacity-80 leading-relaxed">
                      For feminine superlative nouns, classical grammar uses the definite <strong>فُعْلَى (Fu‘lā)</strong> pattern in strict adjective agreement.
                    </p>
                    <div className="text-center py-2 bg-black/20 rounded-lg">
                      <div className="text-xl font-serif font-bold text-indigo-400" dir="rtl">
                        {activeExamples.output3}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">{activeExamples.translit3}</div>
                    </div>
                    <span className="text-xs font-medium text-center text-indigo-200">"{activeExamples.translation3}"</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      )}
      {activeSection === 'adverbs' && (
      <div className="space-y-6 animate-fadeIn">
        {/* Adverbs Intro Card */}
        <div className={`p-6 rounded-2xl border ${innerCardBgClass} space-y-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Compass className={`w-5 h-5 ${fontColorThemeText} animate-pulse`} />
                <h3 className="text-base font-bold uppercase tracking-wider">Arabic Adverbs & Circumstantials (الظَّرْفُ وَالْحَالُ)</h3>
              </div>
              <p className="text-xs text-slate-400">
                Classical Arabic has no single dedicated adverb suffix (like English "-ly"). Instead, it crafts adverbs elegantly through accusative nouns of manner, prepositional phrases, or temporal/spatial nouns.
              </p>
            </div>
            <span className="text-[10px] font-mono opacity-60 uppercase tracking-wider font-extrabold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
              Linguistic Concept: Mansoub & Zarf
            </span>
          </div>

          {/* Grammar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-current/10 bg-current/5 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-amber-500">1. Accusative Manner (Al-Ḥāl)</span>
              <p className="text-[11px] leading-relaxed opacity-90">
                Adjectives are transformed into manner adverbs simply by taking the <strong>indefinite accusative case</strong> (Mansoub), marked with <strong>Tanween Fath (ـًا)</strong>.
              </p>
              <div className="bg-black/20 p-2 rounded text-[11px] font-serif space-y-1">
                <div className="flex justify-between" dir="rtl">
                  <span>سَرِيعٌ (Fast) <span className="text-amber-400">←</span> سَرِيعاً</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">"quickly"</span>
                </div>
                <div className="flex justify-between border-t border-current/5 pt-1 mt-1" dir="rtl">
                  <span>جَيِّدٌ (Good) <span className="text-amber-400">←</span> جَيِّداً</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">"well"</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-current/10 bg-current/5 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-emerald-500">2. Prepositional Manner (Bi-)</span>
              <p className="text-[11px] leading-relaxed opacity-90">
                You can prefix the preposition <strong>بِـ (bi- / with)</strong> to an abstract noun in the genitive case (Majroor), literally meaning "with [concept]".
              </p>
              <div className="bg-black/20 p-2 rounded text-[11px] font-serif space-y-1">
                <div className="flex justify-between" dir="rtl">
                  <span>بِـ + سُرْعَةٍ</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">"with speed" (quickly)</span>
                </div>
                <div className="flex justify-between border-t border-current/5 pt-1 mt-1" dir="rtl">
                  <span>بِـ + سُهُولَةٍ</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">"with ease" (easily)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-current/10 bg-current/5 space-y-2">
              <span className="text-[10px] font-mono font-extrabold uppercase text-indigo-500">3. Time & Place Adverbs (Al-Ẓarf)</span>
              <p className="text-[11px] leading-relaxed opacity-90">
                Special nouns denoting time (Zarf Zaman) or place (Zarf Makan) stay in the accusative case. They act as a <strong>Mudaf</strong>, putting the following noun in the genitive case!
              </p>
              <div className="bg-black/20 p-2 rounded text-[11px] font-serif space-y-1">
                <div className="flex justify-between" dir="rtl">
                  <span>فَوْقَ الْمَكْتَبِ</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">"above the desk" (Genitive)</span>
                </div>
                <div className="flex justify-between border-t border-current/5 pt-1 mt-1" dir="rtl">
                  <span>بَعْدَ الْعِشَاءِ</span>
                  <span className="text-[9px] font-sans opacity-60 text-slate-300">"after Isha" (Genitive)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE ADVERB EXPLORER */}
        <div className={`p-6 rounded-2xl border ${innerCardBgClass} space-y-6`}>
          <div className="space-y-1">
            <h4 className="font-bold text-sm uppercase tracking-wider text-indigo-300">Adverb Category Explorer</h4>
            <p className="text-xs text-slate-400">
              Browse classical Arabic adverbs categorized by structural formation. Click any entry to listen or review the grammar tip!
            </p>
          </div>

          {/* Adverb Category Tabs */}
          <div className="flex gap-2 border-b border-current/10 pb-3">
            {(['accusative', 'prepositional', 'time_place'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setAdvActiveTab(tab);
                  // Auto-set the first adverb in the tab as active for states
                  const list = tab === 'accusative' ? ACCUSATIVE_ADVERBS : tab === 'prepositional' ? PREPOSITIONAL_ADVERBS : TIME_PLACE_ADVERBS;
                  if (list.length > 0) {
                    setAdvSelectedAdverbId(list[0].id);
                  }
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  advActiveTab === tab
                    ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                    : 'bg-black/20 border-current/10 text-slate-400 hover:bg-black/30'
                }`}
              >
                {tab === 'accusative' ? '1. Accusative (-an)' : tab === 'prepositional' ? '2. Prepositional (bi-)' : '3. Time & Place (Zarf)'}
              </button>
            ))}
          </div>

          {/* Adverbs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(advActiveTab === 'accusative' ? ACCUSATIVE_ADVERBS : advActiveTab === 'prepositional' ? PREPOSITIONAL_ADVERBS : TIME_PLACE_ADVERBS).map((adv) => {
              const isSelected = advSelectedAdverbId === adv.id;
              return (
                <div
                  key={adv.id}
                  onClick={() => setAdvSelectedAdverbId(adv.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected 
                      ? (isParchment ? 'border-[#8c6239] bg-[#8c6239]/5' : isCosmic ? 'border-indigo-500 bg-indigo-500/5' : 'border-emerald-500 bg-emerald-500/5')
                      : 'border-current/10 bg-black/10 hover:bg-black/20'
                  }`}
                >
                  <div className="flex justify-between items-center border-b border-current/10 pb-1.5">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-bold text-indigo-400 capitalize">{adv.english}</span>
                      <span className="text-[9px] font-mono text-slate-400">{adv.translit}</span>
                    </div>
                    <AudioPlayButton text={adv.arabic} isParchment={isParchment} />
                  </div>

                  <div className="text-center py-2">
                    <span className="text-2xl font-serif font-extrabold text-amber-400">{adv.arabic}</span>
                  </div>

                  <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                    <p className="opacity-80"><strong className="text-indigo-200">Tip:</strong> {adv.explanation}</p>
                    <div className="bg-black/20 p-1.5 rounded text-[11px] font-serif space-y-0.5" dir="rtl">
                      <div className="flex justify-between text-slate-200">
                        <span>{adv.exampleArabic}</span>
                        <AudioPlayButton text={adv.exampleArabic} isParchment={isParchment} />
                      </div>
                      <div className="text-[9px] font-sans opacity-60 text-slate-400 tracking-wider text-left" dir="ltr">
                        {adv.exampleTranslit}
                      </div>
                      <div className="text-[10px] font-sans text-indigo-200 tracking-normal text-left" dir="ltr">
                        "{adv.exampleMeaning}"
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ADVERBIAL SENTENCE CONSTRUCTOR LAB */}
        <div className={`p-6 rounded-2xl border ${innerCardBgClass} space-y-6`}>
          <div className="space-y-1">
            <h4 className="font-bold text-sm uppercase tracking-wider text-amber-500">Interactive Adverb Sentence Builder</h4>
            <p className="text-xs text-slate-400">
              Select elements to synthesize a grammatically complete classical Arabic sentence. Notice how the verb conjugating gender adapts beautifully, and see where the adverb lands!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left side controls */}
            <div className="lg:col-span-5 space-y-4">
              {/* Subject Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">1. Select Subject (Fa'il)</label>
                <select
                  value={advSelectedSubjectId}
                  onChange={(e) => setAdvSelectedSubjectId(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border bg-black/30 text-slate-200 outline-none ${accentBorderTheme}`}
                >
                  {Object.entries(ADV_SUBJECTS).map(([id, s]) => (
                    <option key={id} value={id} className="bg-slate-900">{s.meaning} ({s.arabic}) - {s.gender === 'fem' ? 'Feminine' : 'Masculine'}</option>
                  ))}
                </select>
              </div>

              {/* Verb Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">2. Select Action Verb (Fi'l)</label>
                <select
                  value={advSelectedVerbId}
                  onChange={(e) => {
                    setAdvSelectedVerbId(e.target.value);
                    // Reset extension id to 'none' or first key of new verb to avoid state misalignment
                    const exts = ADV_EXTENSIONS[e.target.value] || {};
                    setAdvExtensionId(Object.keys(exts)[0] || 'none');
                  }}
                  className={`w-full text-xs px-3 py-2 rounded-xl border bg-black/30 text-slate-200 outline-none ${accentBorderTheme}`}
                >
                  {Object.entries(ADV_VERBS).map(([id, v]) => (
                    <option key={id} value={id} className="bg-slate-900">{v.meaning} ({v.arabicMasc})</option>
                  ))}
                </select>
              </div>

              {/* Extension Selector */}
              {(() => {
                const extensions = ADV_EXTENSIONS[advSelectedVerbId] || {};
                if (Object.keys(extensions).length === 0) return null;
                return (
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">3. Select Destination / Context</label>
                    <select
                      value={advExtensionId}
                      onChange={(e) => setAdvExtensionId(e.target.value)}
                      className={`w-full text-xs px-3 py-2 rounded-xl border bg-black/30 text-slate-200 outline-none ${accentBorderTheme}`}
                    >
                      {Object.entries(extensions).map(([id, ext]) => (
                        <option key={id} value={id} className="bg-slate-900">
                          {ext.meaning === "" ? "(No extra context)" : ext.meaning} {ext.arabic && `(${ext.arabic})`}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })()}

              {/* Adverb Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide block">4. Select Adverb</label>
                <select
                  value={advSelectedAdverbId}
                  onChange={(e) => setAdvSelectedAdverbId(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border bg-black/30 text-slate-200 outline-none ${accentBorderTheme}`}
                >
                  <optgroup label="1. Accusative Manner (Al-Hal)" className="bg-slate-900">
                    {ACCUSATIVE_ADVERBS.map((adv) => (
                      <option key={adv.id} value={adv.id} className="bg-slate-900">{adv.english} ({adv.arabic})</option>
                    ))}
                  </optgroup>
                  <optgroup label="2. Prepositional Phrases" className="bg-slate-900">
                    {PREPOSITIONAL_ADVERBS.map((adv) => (
                      <option key={adv.id} value={adv.id} className="bg-slate-900">{adv.english} ({adv.arabic})</option>
                    ))}
                  </optgroup>
                  <optgroup label="3. Time & Place (Zarf)" className="bg-slate-900">
                    {TIME_PLACE_ADVERBS.map((adv) => (
                      <option key={adv.id} value={adv.id} className="bg-slate-900">{adv.english} ({adv.arabic})</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Right side live rendering */}
            <div className="lg:col-span-7 h-full flex flex-col justify-between space-y-4">
              {(() => {
                const subject = ADV_SUBJECTS[advSelectedSubjectId] || ADV_SUBJECTS.walad;
                const verb = ADV_VERBS[advSelectedVerbId] || ADV_VERBS.jara;
                const extension = (ADV_EXTENSIONS[advSelectedVerbId] || {})[advExtensionId] || { arabic: "", translit: "", meaning: "" };
                
                // Find adverb in all lists
                const adverb = ACCUSATIVE_ADVERBS.find(a => a.id === advSelectedAdverbId)
                  || PREPOSITIONAL_ADVERBS.find(a => a.id === advSelectedAdverbId)
                  || TIME_PLACE_ADVERBS.find(a => a.id === advSelectedAdverbId)
                  || ACCUSATIVE_ADVERBS[0];

                // Determine verb gender agreement
                const verbArabic = subject.gender === 'fem' ? verb.arabicFem : verb.arabicMasc;
                const verbTranslit = subject.gender === 'fem' ? verb.translitFem : verb.translitMasc;

                // Build full sentence
                const parts = [verbArabic, subject.arabic];
                const translitParts = [verbTranslit, subject.translit];

                if (extension.arabic) {
                  parts.push(extension.arabic);
                  translitParts.push(extension.translit);
                }

                // Place the adverb at the end
                parts.push(adverb.arabic);
                translitParts.push(adverb.translit);

                const sentenceArabic = parts.join(" ");
                const sentenceTranslit = translitParts.join(" ");
                
                // Construct natural english translation
                let naturalTranslation = `The ${subject.meaning} ${verb.meaning} `;
                if (extension.meaning) {
                  naturalTranslation += `${extension.meaning} `;
                }
                naturalTranslation += adverb.english;

                return (
                  <div className="p-6 rounded-xl bg-black/30 border border-current/10 flex flex-col justify-between h-full min-h-[300px] space-y-4">
                    <div className="flex items-center justify-between border-b border-current/15 pb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500">Live Adverb Sentence Constructor</span>
                      <AudioPlayButton text={sentenceArabic} isParchment={isParchment} />
                    </div>

                    <div className="text-center py-4 space-y-2">
                      <div className="text-2xl sm:text-3xl font-serif font-extrabold text-amber-400 tracking-wide leading-relaxed" dir="rtl">
                        <span className="text-purple-300" title="Fi'l (Action Verb) with correct gender conjugation">{verbArabic}</span>
                        {" "}
                        <span className="text-blue-300" title="Fa'il (Subject / Doer in Nominative Case)">{subject.arabic}</span>
                        {" "}
                        {extension.arabic && (
                          <>
                            <span className="text-slate-300" title="Complement/Object">{extension.arabic}</span>
                            {" "}
                          </>
                        )}
                        <span className="text-emerald-300 border-b border-dashed border-emerald-400/50 pb-0.5" title="Adverb (Circumstantial / Zarf / Hal)">{adverb.arabic}</span>
                      </div>
                      <div className="text-xs sm:text-sm font-mono text-slate-300 tracking-wider">
                        {sentenceTranslit}
                      </div>
                      <div className="text-sm sm:text-base font-sans font-medium text-indigo-200 mt-2">
                        "{naturalTranslation}."
                      </div>
                    </div>

                    {/* Breakdown explanations */}
                    <div className="p-3 bg-current/5 rounded-xl space-y-2 text-[11px] leading-relaxed text-slate-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-purple-300 font-extrabold uppercase text-[9px] block">1. Gender Agreement</span>
                          <p className="text-[10px] opacity-90">
                            Since the subject is <strong className="text-blue-200">{subject.meaning} ({subject.gender})</strong>, the verb automatically conjugated to <strong className="text-purple-200">{verbArabic}</strong>.
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-emerald-300 font-extrabold uppercase text-[9px] block">2. Adverb Grammar</span>
                          <p className="text-[10px] opacity-90">
                            The adverb <strong className="text-emerald-200">{adverb.arabic}</strong> is formed via{" "}
                            {ACCUSATIVE_ADVERBS.some(a => a.id === adverb.id) ? (
                              <span>the <strong>Accusative case (Tanween Fath)</strong> to express manner.</span>
                            ) : PREPOSITIONAL_ADVERBS.some(a => a.id === adverb.id) ? (
                              <span>the <strong>Prepositional mode (bi- + Genitive Kasrah)</strong> to express manner.</span>
                            ) : (
                              <span>the <strong>Temporal/Spatial Zarf pattern (Accusative Fatha)</strong>.</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* PRONOUNS SECTION */}
      {activeSection === 'pronouns' && (
      <div className={`p-6 rounded-2xl border ${innerCardBgClass} space-y-6 animate-fadeIn`}>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Users className={`w-5 h-5 ${fontColorThemeText}`} />
            <h3 className="text-sm font-bold uppercase tracking-wider">Arabic Pronoun Guide (الضّمَائِر - Ad-Damā'ir)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Pronouns in Arabic are highly structured. They change based on person (1st, 2nd, 3rd), gender (masc / fem), and number (singular, dual, plural). Reference: <span className="font-mono text-indigo-400">arabic.desert-sky.net/g_pronouns.html</span>
          </p>
        </div>

        {/* Pronoun Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-current/10 pb-4">
          {[
            { id: 'subject', label: '1. Independent / Subject (مُنْفَصِلَة)' },
            { id: 'suffix', label: '2. Attached / Suffix (مُتَّصِلَة)' },
            { id: 'demonstrative', label: '3. Demonstrative (الإِشَارَة)' },
            { id: 'relative', label: '4. Relative (المَوْصُولَة)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProActiveTab(tab.id as any)}
              className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                proActiveTab === tab.id
                  ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                  : 'bg-black/20 border-current/10 text-slate-400 hover:bg-black/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: INDEPENDENT SUBJECT PRONOUNS */}
        {proActiveTab === 'subject' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-black/10 border border-current/5 text-xs text-slate-300 space-y-2">
              <strong className="text-sm block">What are Independent Subject Pronouns?</strong>
              <p>
                These stand completely alone and are typically used in the **Nominative case (Marfoo')** as subjects of nominal sentences.
                For example: <span className="font-bold text-amber-500 font-sans text-sm">هُوَ طَالِبٌ</span> (He is a student) or <span className="font-bold text-amber-500 font-sans text-sm">أَنَا بِلَالٌ</span> (I am Bilal).
              </p>
            </div>

            {/* Structured by Person */}
            {['3rd', '2nd', '1st'].map((personCode) => {
              const matching = SUBJECT_PRONOUNS_DB.filter(p => p.person === personCode);
              const label = personCode === '3rd' ? 'Third Person (Absent - الْغَائِب)' : personCode === '2nd' ? 'Second Person (Addressed - الْمُخَاطَب)' : 'First Person (Speaker - الْمُتَكَلِّم)';
              return (
                <div key={personCode} className="space-y-3">
                  <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">{label}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {matching.map((pro) => (
                      <div key={pro.id} className="p-4 rounded-xl border border-current/5 bg-black/15 flex flex-col justify-between hover:border-current/10 transition-all">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-black/20 text-slate-400 font-mono text-[10px]">
                              {pro.number} • {pro.gender}
                            </span>
                            <AudioPlayButton text={pro.arabic} isParchment={isParchment} />
                          </div>
                          <div className="text-center space-y-1 py-1">
                            <span className="text-3xl font-bold font-sans tracking-wide block">{pro.arabic}</span>
                            <span className="text-xs text-amber-500/90 font-mono block">{pro.translit}</span>
                            <span className="text-sm font-semibold text-slate-200 block">{pro.english}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 border-t border-current/5 mt-2 pt-2 leading-relaxed">
                          {pro.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: ATTACHED / SUFFIX PRONOUNS */}
        {proActiveTab === 'suffix' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-black/10 border border-current/5 text-xs text-slate-300 space-y-2">
              <strong className="text-sm block">What are Suffix Pronouns?</strong>
              <p>
                These cannot stand alone. Instead, they attach to the end of words and their grammar role depends on the type of word they attach to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Attached to Nouns (Possessive)</strong>: e.g. <span className="font-semibold text-amber-500">كِتَابِي</span> (my book). In grammar, this forms a genitive annexation (Idafah).</li>
                <li><strong>Attached to Verbs (Direct Object)</strong>: e.g. <span className="font-semibold text-amber-500">سَأَلَهُ</span> (he asked him). In grammar, this acts as the Mansoob object (Maf'ool Bihi).</li>
                <li><strong>Attached to Prepositions</strong>: e.g. <span className="font-semibold text-amber-500">عَلَيْهِ</span> (upon him) or <span className="font-semibold text-amber-500">لِي</span> (to/for me).</li>
              </ul>
            </div>

            {/* Suffix Conjugator Lab */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls Column */}
              <div className="lg:col-span-5 space-y-4 p-5 rounded-xl border border-current/5 bg-black/20">
                <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">Interactive Conjugation Sandbox</h4>
                
                {/* 1. Category Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">1. Select Base Class</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'noun', label: 'Noun (Possessive)' },
                      { id: 'verb', label: 'Verb (Direct Object)' },
                      { id: 'preposition', label: 'Preposition' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setProSelectedCategory(cat.id as any);
                          // Reset selection based on category
                          if (cat.id === 'noun') setProSelectedNounId('kitab');
                          if (cat.id === 'verb') setProSelectedVerbId('nasara');
                          if (cat.id === 'preposition') setProSelectedPrepId('li');
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-lg border text-[10px] font-bold transition-all ${
                          proSelectedCategory === cat.id
                            ? (isParchment ? 'bg-[#8c6239] border-[#8c6239] text-white' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                            : 'bg-black/10 border-current/10 text-slate-400 hover:bg-black/20'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Item Selector based on Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">2. Select Vocabulary Item</label>
                  {proSelectedCategory === 'noun' && (
                    <div className="flex gap-2">
                      {[
                        { id: 'kitab', arabic: 'كِتَابٌ', meaning: 'Book' },
                        { id: 'bayt', arabic: 'بَيْتٌ', meaning: 'House' },
                        { id: 'qalam', arabic: 'قَلَمٌ', meaning: 'Pen' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setProSelectedNounId(item.id)}
                          className={`flex-1 p-2 rounded-lg border text-center transition-all ${
                            proSelectedNounId === item.id
                              ? (isParchment ? 'bg-[#ebdcc3]/30 border-[#8c6239] text-[#8c6239]' : isCosmic ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200' : 'bg-emerald-950/30 border-emerald-500 text-emerald-200')
                              : 'bg-black/10 border-current/5 text-slate-300'
                          }`}
                        >
                          <span className="text-lg font-bold block">{item.arabic}</span>
                          <span className="text-[10px] text-slate-400 block">{item.meaning}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {proSelectedCategory === 'verb' && (
                    <div className="flex gap-2">
                      {[
                        { id: 'nasara', arabic: 'نَصَرَ', meaning: 'He helped' },
                        { id: 'saala', arabic: 'سَأَلَ', meaning: 'He asked' },
                        { id: 'raaa', arabic: 'رَأَى', meaning: 'He saw' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setProSelectedVerbId(item.id)}
                          className={`flex-1 p-2 rounded-lg border text-center transition-all ${
                            proSelectedVerbId === item.id
                              ? (isParchment ? 'bg-[#ebdcc3]/30 border-[#8c6239] text-[#8c6239]' : isCosmic ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200' : 'bg-emerald-950/30 border-emerald-500 text-emerald-200')
                              : 'bg-black/10 border-current/5 text-slate-300'
                          }`}
                        >
                          <span className="text-lg font-bold block">{item.arabic}</span>
                          <span className="text-[10px] text-slate-400 block">{item.meaning}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {proSelectedCategory === 'preposition' && (
                    <div className="flex gap-2">
                      {[
                        { id: 'li', arabic: 'لِـ', meaning: 'To / For' },
                        { id: 'ala', arabic: 'عَلَى', meaning: 'On / Upon' },
                        { id: 'min', arabic: 'مِنْ', meaning: 'From' }
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => setProSelectedPrepId(item.id)}
                          className={`flex-1 p-2 rounded-lg border text-center transition-all ${
                            proSelectedPrepId === item.id
                              ? (isParchment ? 'bg-[#ebdcc3]/30 border-[#8c6239] text-[#8c6239]' : isCosmic ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200' : 'bg-emerald-950/30 border-emerald-500 text-emerald-200')
                              : 'bg-black/10 border-current/5 text-slate-300'
                          }`}
                        >
                          <span className="text-lg font-bold block">{item.arabic}</span>
                          <span className="text-[10px] text-slate-400 block">{item.meaning}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Suffix Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider block">3. Select Pronoun Suffix</label>
                  <div className="grid grid-cols-3 gap-2">
                    {SUFFIX_PRONOUNS_DB.map((suffix) => (
                      <button
                        key={suffix.id}
                        onClick={() => setProSelectedSuffixId(suffix.id)}
                        className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                          proSelectedSuffixId === suffix.id
                            ? (isParchment ? 'bg-[#ebdcc3]/30 border-[#8c6239] text-[#8c6239] font-bold' : isCosmic ? 'bg-indigo-950/40 border-indigo-500 text-indigo-200 font-bold' : 'bg-emerald-950/30 border-emerald-500 text-emerald-200 font-bold')
                            : 'bg-black/10 border-current/5 text-slate-300 text-xs'
                        }`}
                      >
                        <span className="text-xs block">{suffix.english}</span>
                        <span className="text-sm font-bold font-sans text-amber-500 block">
                          {proSelectedCategory === 'noun' ? suffix.suffixNoun : proSelectedCategory === 'verb' ? suffix.suffixVerb : suffix.suffixPrep}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formula & Result Display Column */}
              <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-xl border border-current/5 bg-black/10">
                <div className="space-y-5">
                  <h4 className="text-xs font-bold uppercase tracking-wide text-slate-400">Synthesis Result</h4>
                  
                  {(() => {
                    const activeItemId = proSelectedCategory === 'noun' ? proSelectedNounId : proSelectedCategory === 'verb' ? proSelectedVerbId : proSelectedPrepId;
                    const res = getSuffixConjugation(proSelectedCategory, activeItemId, proSelectedSuffixId);
                    
                    const baseWordArabic = proSelectedCategory === 'noun' 
                      ? (proSelectedNounId === 'bayt' ? 'بَيْت' : proSelectedNounId === 'qalam' ? 'قَلَم' : 'كِتَاب')
                      : proSelectedCategory === 'verb'
                        ? (proSelectedVerbId === 'saala' ? 'سَأَلَ' : proSelectedVerbId === 'raaa' ? 'رَأَى' : 'نَصَرَ')
                        : (proSelectedPrepId === 'li' ? 'لِـ' : proSelectedPrepId === 'ala' ? 'عَلَى' : 'مِنْ');
                    
                    const suffixObj = SUFFIX_PRONOUNS_DB.find(s => s.id === proSelectedSuffixId) || SUFFIX_PRONOUNS_DB[0];
                    const rawSuffixArabic = proSelectedCategory === 'noun' ? suffixObj.suffixNoun : proSelectedCategory === 'verb' ? suffixObj.suffixVerb : suffixObj.suffixPrep;
                    
                    return (
                      <div className="space-y-6">
                        {/* Interactive Addition Formula */}
                        <div className="flex items-center justify-center gap-4 text-center py-4 bg-black/15 rounded-xl border border-current/5">
                          <div>
                            <span className="text-xl font-bold block">{baseWordArabic}</span>
                            <span className="text-[10px] text-slate-400 uppercase">Base</span>
                          </div>
                          <span className="text-xl font-mono text-slate-500">+</span>
                          <div>
                            <span className="text-xl font-bold text-amber-500 block">{rawSuffixArabic}</span>
                            <span className="text-[10px] text-slate-400 uppercase">Suffix</span>
                          </div>
                          <span className="text-xl font-mono text-slate-500">=</span>
                          <div className="px-3 py-1.5 bg-black/20 rounded-lg border border-amber-500/20">
                            <span className="text-2xl font-bold text-emerald-400">{res.arabic}</span>
                            <span className="text-[10px] text-slate-400 uppercase block">Combined</span>
                          </div>
                        </div>

                        {/* Large Outcome Card */}
                        <div className="p-5 rounded-xl bg-black/25 border border-current/5 relative space-y-4">
                          <div className="absolute top-4 right-4">
                            <AudioPlayButton text={res.arabic} isParchment={isParchment} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Meaning & Pronunciation</span>
                            <div className="text-3xl font-extrabold text-slate-100 font-sans tracking-wide">{res.arabic}</div>
                            <div className="text-sm font-mono text-amber-500">{res.translit}</div>
                            <div className="text-base font-semibold text-slate-300 capitalize">{res.meaning}</div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-current/5">
                            {suffixObj.explanation} 
                            {proSelectedCategory === 'preposition' && proSelectedPrepId === 'ala' && suffixObj.id === 'him' && (
                              <span className="text-amber-400 font-semibold block mt-1">
                                Notice that عَلَى is spelled with a regular 'Ya' (عَلَيْـ) instead of Alif Maqsura, and the suffix vowel shifts from 'uhu' to 'i' ('alayhi) for vocal harmony.
                              </span>
                            )}
                            {proSelectedCategory === 'preposition' && proSelectedPrepId === 'min' && (suffixObj.id === 'me' || suffixObj.id === 'us') && (
                              <span className="text-amber-400 font-semibold block mt-1">
                                Notice that مِنْ merges with the suffix, creating a shaddah: مِنِّي (from me) and مِنَّا (from us).
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEMONSTRATIVE PRONOUNS */}
        {proActiveTab === 'demonstrative' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-black/10 border border-current/5 text-xs text-slate-300 space-y-3">
              <strong className="text-sm block">What are Demonstrative Pronouns (أَسْمَاءُ الإِشَارَةِ)?</strong>
              <p>
                In Arabic, demonstratives point to things. They are divided into two distances: **Near (this / these)** and **Far (that / those)**.
              </p>
              <div className="p-3 bg-[#ea580c]/10 border border-[#ea580c]/30 rounded-lg text-amber-300 space-y-1">
                <strong className="text-xs block">⚠️ The Rule of Non-Human Plurals:</strong>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  In Classical Arabic grammar, **all non-human plurals are grammatically treated as singular feminine**.
                  Therefore, to point to non-human plurals like "books" (كُتُب), you **MUST** use the singular feminine demonstrative <span className="font-bold text-amber-400 font-sans">هَذِهِ</span> (this f.) rather than the human plural <span className="font-bold text-amber-400 font-sans">هَؤُلَاءِ</span> (these).
                </p>
                <div className="text-[11px] font-mono mt-1 text-emerald-400">
                  Example: هَذِهِ كُتُبٌ (These are books - Lit. "This is books") vs هَؤُلَاءِ طُلَّابٌ (These are students - human).
                </div>
              </div>
            </div>

            {/* Near and Far Grids */}
            {['near', 'far'].map((dist) => {
              const items = DEMONSTRATIVE_PRONOUNS_DB.filter(d => d.distance === dist);
              return (
                <div key={dist} className="space-y-3">
                  <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">{dist === 'near' ? 'Near Demonstratives (This / These)' : 'Far Demonstratives (That / Those)'}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border border-current/5 bg-black/15 space-y-3 hover:border-current/10 transition-all">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20 text-slate-400">
                            {item.number} • {item.gender}
                          </span>
                          <AudioPlayButton text={item.arabic} isParchment={isParchment} />
                        </div>
                        <div className="space-y-1 text-center py-1">
                          <span className="text-2xl font-bold font-sans block">{item.arabic}</span>
                          <span className="text-xs text-amber-500 font-mono block">{item.translit}</span>
                          <span className="text-sm font-semibold text-slate-200 block">{item.english}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed border-t border-current/5 pt-2">
                          {item.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: RELATIVE PRONOUNS */}
        {proActiveTab === 'relative' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 rounded-xl bg-black/10 border border-current/5 text-xs text-slate-300 space-y-2">
              <strong className="text-sm block">What are Relative Pronouns (الأَسْمَاءُ الْمَوْصُولَةُ)?</strong>
              <p>
                Relative pronouns translate as **"who"**, **"whom"**, **"which"**, or **"that"**. They are used to link two sentences together, starting a relative clause (Sila).
                Like other pronouns, they change to match the noun they refer to in gender and number.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RELATIVE_PRONOUNS_DB.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-current/5 bg-black/15 space-y-3 hover:border-current/10 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/20 text-slate-400">
                      {item.number} • {item.gender}
                    </span>
                    <AudioPlayButton text={item.arabic} isParchment={isParchment} />
                  </div>
                  <div className="space-y-1 text-center py-1">
                    <span className="text-2xl font-bold font-sans block">{item.arabic}</span>
                    <span className="text-xs text-amber-500 font-mono block">{item.translit}</span>
                    <span className="text-sm font-semibold text-slate-200 block">{item.english}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed border-t border-current/5 pt-2">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      )}

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
            <div className="text-[11px] space-y-1 pl-2 relative">
              <div className="absolute right-0 top-0">
                <AudioPlayButton text={interactiveSentences[activeSentenceId].words.map(w => w.arabic).join(' ')} isParchment={isParchment} />
              </div>
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
                    <div className="md:col-span-8 space-y-3 text-right relative" style={{ direction: 'rtl' }}>
                      <div className="absolute top-0 right-0 z-10" style={{ direction: 'ltr' }}>
                        <AudioPlayButton text={nounDetail.quranicExample.verse.split(' — ')[1]} isParchment={isParchment} />
                      </div>
                      <span className="text-2xl font-serif font-black text-current leading-relaxed block tracking-wide pr-10">
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
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${isParchment ? 'bg-white' : 'bg-black/25'} border-current/5 relative overflow-hidden`}>
                      <div className="space-y-0.5 mt-4">
                        <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest block font-bold">Past Tense (He ...)</span>
                        <span className="text-xs font-bold text-amber-500 block font-mono">{sandboxConjugation.pastTranslit}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-serif font-black tracking-wide text-current">
                          {sandboxConjugation.past}
                        </span>
                      </div>
                      <div className="absolute top-0 right-0 opacity-80 scale-90">
                        <AudioPlayButton text={sandboxConjugation.past} isParchment={isParchment} />
                      </div>
                    </div>

                    {/* PRESENT OUTPUT */}
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${isParchment ? 'bg-white' : 'bg-black/25'} border-current/5 relative overflow-hidden`}>
                      <div className="space-y-0.5 mt-4">
                        <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest block font-bold">Present Tense (He ...)</span>
                        <span className="text-xs font-bold text-amber-500 block font-mono">{sandboxConjugation.presentTranslit}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-serif font-black tracking-wide text-current">
                          {sandboxConjugation.present}
                        </span>
                      </div>
                      <div className="absolute top-0 right-0 opacity-80 scale-90">
                        <AudioPlayButton text={sandboxConjugation.present} isParchment={isParchment} />
                      </div>
                    </div>

                    {/* ACT_PART OUTPUT */}
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${isParchment ? 'bg-white' : 'bg-black/25'} border-current/5 relative overflow-hidden`}>
                      <div className="space-y-0.5 mt-4">
                        <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest block font-bold">Acting Agent (Ism Fa’il)</span>
                        <span className="text-xs font-bold text-emerald-500 block font-mono">{sandboxConjugation.participleTranslit}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-serif font-black tracking-wide text-amber-500">
                          {sandboxConjugation.participle}
                        </span>
                      </div>
                      <div className="absolute top-0 right-0 opacity-80 scale-90">
                        <AudioPlayButton text={sandboxConjugation.participle} isParchment={isParchment} />
                      </div>
                    </div>

                    {/* MASDAR OUTPUT */}
                    <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${isParchment ? 'bg-white' : 'bg-black/25'} border-current/5 relative overflow-hidden`}>
                      <div className="space-y-0.5 mt-4">
                        <span className="text-[8px] font-mono opacity-40 uppercase tracking-widest block font-bold">Verbal Noun (The Act of...)</span>
                        <span className="text-xs font-bold text-amber-500 block font-mono">{sandboxConjugation.masdarTranslit}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-serif font-black tracking-wide text-current">
                          {sandboxConjugation.masdar}
                        </span>
                      </div>
                      <div className="absolute top-0 right-0 opacity-80 scale-90">
                        <AudioPlayButton text={sandboxConjugation.masdar} isParchment={isParchment} />
                      </div>
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

      {/* 5. SURAH SUMMARY SECTION */}
      {activeSection === 'surah' && (() => {
        const currentSurah = SURAH_DATABASE.find(s => s.id === selectedSurahId) || SURAH_DATABASE[0];
        const hasRoot = currentSurah.roots.some(r => r.letters === selectedRootLetters);
        const activeRoot = hasRoot 
          ? currentSurah.roots.find(r => r.letters === selectedRootLetters)!
          : currentSurah.roots[0];

        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Title Block */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-current/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookMarked className={`w-5 h-5 ${fontColorThemeText}`} />
                  <h3 className="text-base font-bold uppercase tracking-wider">
                    Surah Linguistic & Theological Summary (تَحْلِيل السُّور)
                  </h3>
                </div>
                <p className="text-xs opacity-80 leading-relaxed max-w-2xl">
                  Analyze classical Quranic Surahs by tracing their root structures, tracking how their words are synthesized, discovering particles, and exploring theological themes.
                </p>
              </div>

              {/* Informative Badge */}
              <div className={`p-3 rounded-xl border max-w-xs text-[10px] leading-relaxed flex gap-2 items-start ${innerCardBgClass}`}>
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">Root Families (الاشتقاق)</span>
                  Almost all words in a Surah derive from a 3-letter root core. Tracking this reveals how different physical/abstract concepts interconnect.
                </div>
              </div>
            </div>

            {/* A. SURAH SELECTOR TAB-GRID */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest font-bold block pl-1">
                Select a Surah for Linguistic Deconstruction:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SURAH_DATABASE.map((surah) => {
                  const isSelected = selectedSurahId === surah.id;
                  return (
                    <button
                      key={surah.id}
                      onClick={() => {
                        setSelectedSurahId(surah.id);
                        setSelectedRootLetters(surah.roots[0].letters); // Auto-focus first root on switch!
                        setVisibleVersesCount(3); // Reset visible ayaat count
                      }}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? (isParchment ? 'bg-[#ebd8c3]/40 border-[#8c6239] ring-1 ring-[#8c6239]/30' : isCosmic ? 'bg-indigo-950/60 border-indigo-500 text-indigo-100 ring-1 ring-indigo-500/30' : 'bg-emerald-950/40 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500/30')
                          : 'bg-transparent border-current/15 hover:bg-current/5'
                      }`}
                    >
                      <div className="flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-mono opacity-50 uppercase font-bold">Surah #{surah.number}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase font-bold border ${badgeThemeBg}`}>
                          {surah.revelationType}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 pointer-events-none">
                        <div>
                          <h4 className="font-bold text-sm text-current">{surah.nameEnglish}</h4>
                          <p className="text-[11px] opacity-75">{surah.nameMeaning}</p>
                        </div>
                        <span className="text-2xl font-serif font-black text-[#8c6239] dark:text-amber-500">
                          {surah.nameArabic}
                        </span>
                      </div>
                      
                      <div className="mt-3 text-[10px] opacity-60 pointer-events-none flex items-center justify-between border-t border-current/5 pt-2">
                        <span>{surah.verseCount} verses</span>
                        <span>{surah.roots.length} distinct roots</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* B. BIRD-EYE THEMATIC VIEW MAPS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Theme Summary and Origin */}
              <div className="lg:col-span-7 space-y-4">
                <div className={`p-5 rounded-2xl border ${innerCardBgClass} space-y-4`}>
                  <div className="flex items-center gap-2 border-b border-current/5 pb-2">
                    <Compass className={`w-4 h-4 ${fontColorThemeText}`} />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-current">Theme & Analytical Summary</h4>
                  </div>
                  <p className="text-xs leading-relaxed opacity-95">
                    {currentSurah.birdsEyeView.themeSummary}
                  </p>
                  
                  <div className="pt-2">
                    <span className="text-[10px] font-mono text-amber-500 font-bold block uppercase tracking-widest mb-1">Historical Context:</span>
                    <p className="text-[11px] leading-relaxed opacity-85 italic">
                      {currentSurah.birdsEyeView.historicalContext}
                    </p>
                  </div>
                </div>
              </div>

              {/* Theological Cruxes */}
              <div className="lg:col-span-5">
                <div className={`p-5 rounded-2xl border ${innerCardBgClass} space-y-3 h-full`}>
                  <div className="flex items-center gap-2 border-b border-current/5 pb-2">
                    <Sparkles className={`w-4 h-4 ${fontColorThemeText}`} />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-current">Theological Significations & Cruxes</h4>
                  </div>
                  <ul className="space-y-3">
                    {currentSurah.birdsEyeView.theologicalSignificance.map((point, index) => (
                      <li key={index} className="flex gap-2.5 items-start">
                        <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-mono font-bold shrink-0 mt-0.5 ${badgeThemeBg}`}>
                          {index + 1}
                        </span>
                        <span className="text-[11px] leading-relaxed opacity-90">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* C. COMPLETE SURAH REFERENCE AND READOUT */}
            <div className={`p-5 rounded-2xl border ${innerCardBgClass} space-y-6`}>
              <div className="flex items-center justify-between border-b border-current/5 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className={`w-4 h-4 ${fontColorThemeText}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-current">Complete Surah Text & Translations</span>
                </div>
                <span className="text-[10px] font-mono opacity-50 uppercase">RTL Contextual Layout</span>
              </div>

              <div className="space-y-5 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                {currentSurah.verses.slice(0, visibleVersesCount).map((v) => (
                  <div key={v.number} className="pb-4 border-b border-current/5 last:border-0 last:pb-0 space-y-2">
                    {/* Arabic verse right aligned - big beautiful typography */}
                    <div className="flex flex-row-reverse items-start gap-4">
                      {/* Verse badge and Audio */}
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-current/10 text-amber-500 font-serif font-black text-sm text-center">
                          {v.number}
                        </div>
                        <AudioPlayButton text={v.arabic} isParchment={isParchment} />
                      </div>
                      
                      {/* Arabic text */}
                      <p className="text-2xl font-serif font-black text-current tracking-wide leading-loose select-all text-right w-full pt-1" style={{ direction: 'rtl' }}>
                        {v.arabic}
                      </p>
                    </div>
                    
                    {/* Transliteration and English left aligned */}
                    <div className="pl-12 space-y-1">
                      <p className="text-[10px] font-mono font-semibold text-amber-600/90 italic">
                        {v.transliteration}
                      </p>
                      <p className="text-xs opacity-90 leading-relaxed">
                        {v.translation}
                      </p>
                    </div>
                  </div>
                ))}

                {visibleVersesCount < currentSurah.verses.length && (
                  <div className="pt-2 flex justify-center pb-2">
                    <button
                      onClick={() => setVisibleVersesCount(prev => prev + 5)}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                        isParchment 
                          ? 'bg-[#ebd8c3]/40 border-[#8c6239] text-[#8c6239] hover:bg-[#ebd8c3]' 
                          : isCosmic
                            ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-300 hover:bg-indigo-900/60'
                            : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/50'
                      }`}
                    >
                      Load More Aayat
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* D. DISTINCT ROOTS & WORD FAMILY MATRIX */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#0ea5e9]">
                  Lexical Root Family Analysis (المفردات وجذورها)
                </h4>
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                Every derived noun and verb in the Quran has a 3-letter (triliteral) root family. Select a root below to trace how its raw meaning is augmented into the distinct words seen in this Surah!
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Hand: Roots selectors */}
                <div className="lg:col-span-4 space-y-2.5">
                  <span className="text-[10px] font-mono opacity-50 uppercase block font-bold pl-1">Roots Present in Surah:</span>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
                    {currentSurah.roots.map((r) => {
                      const isSel = r.letters === activeRoot.letters;
                      return (
                        <button
                          key={r.letters}
                          onClick={() => setSelectedRootLetters(r.letters)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            isSel
                              ? (isParchment ? 'bg-[#ebd8c3]/40 border-[#8c6239] shadow-inner' : isCosmic ? 'bg-indigo-950/65 border-indigo-500 text-indigo-300 shadow-inner' : 'bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-inner')
                              : 'bg-transparent border-current/10 hover:bg-current/5'
                          }`}
                        >
                          <div className="flex items-center justify-between pointer-events-none">
                            <span className="text-base font-serif font-black text-amber-500 mr-2 tracking-wider">
                              {r.letters}
                            </span>
                            <span className="text-[9px] font-mono opacity-50 font-bold">
                              {r.derivedWords.length} Form{r.derivedWords.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="text-[11px] font-medium opacity-85 truncate mt-1 pointer-events-none">
                            {r.meaning.split(',')[0]}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Hand: Root detail explanation and derived words table */}
                <div className="lg:col-span-8">
                  <div className={`p-5 rounded-2xl border ${innerCardBgClass} space-y-5 h-full flex flex-col justify-between`}>
                    <div className="space-y-4">
                      {/* Header with big root showcase */}
                      <div className="flex items-center justify-between border-b border-current/5 pb-3">
                        <div>
                          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 block mb-0.5">Selected Core Root:</span>
                          <div className="flex flex-wrap items-center gap-3">
                            <h5 className="text-2xl font-serif font-black text-[#8c6239] dark:text-amber-500 tracking-widest">
                              {activeRoot.letters}
                            </h5>
                            <span className="text-xs font-semibold opacity-90">
                              - {activeRoot.meaning}
                            </span>
                          </div>
                        </div>
                        
                        <span className="text-[10px] font-mono opacity-50 font-bold uppercase shrink-0">
                          Triliteral Arabic Root
                        </span>
                      </div>

                      {/* Derived Words List representing academic details */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-mono opacity-50 uppercase block font-bold pl-1">Derived Words present in this Surah:</span>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {activeRoot.derivedWords.map((word, idx) => (
                            <div 
                              key={idx} 
                              className={`p-4 rounded-xl border ${isParchment ? 'bg-white border-[#ebdcc3]' : 'bg-black/35 border-current/10'} space-y-3`}
                            >
                              <div className="flex items-center justify-between border-b border-current/5 pb-2">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-serif font-black text-emerald-500 tracking-wide">
                                      {word.arabic}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-amber-500 mt-1">
                                      / {word.transliteration} /
                                    </span>
                                  </div>
                                  <AudioPlayButton text={word.arabic} isParchment={isParchment} />
                                </div>

                                <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-bold border ${badgeThemeBg}`}>
                                  {word.verseIndex}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-0.5 text-[11px] leading-relaxed">
                                <div className="md:col-span-4">
                                  <span className="text-[9px] font-mono opacity-50 uppercase block">Contextual Meaning:</span>
                                  <strong className="text-current">{word.meaning}</strong>
                                </div>
                                <div className="md:col-span-8">
                                  <span className="text-[9px] font-mono opacity-50 uppercase block">Morphological Synthesis (Augmentation):</span>
                                  <p className="opacity-90">{word.morphologyBreakdown}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-current/5 text-[10px] italic opacity-60">
                      * Clicking a different root folder on the left dynamically computes the corresponding morphological augmentations and verse offsets.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* E. HURUF (PARTICLES) PANEL INDEX */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <h4 className="text-xs font-bold uppercase tracking-widest text-pink-500">
                  Particles & Connectors (الحُرُوف - Al-Ḥurūf) Index
                </h4>
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                Unlike nouns or verbs, a **Harf (Particle)** does not carry a standalone meaning unless coupled with other words. Yet, they govern the sentence structure, coordinate actions, and force cases (such as prepositions driving nouns to Genitive).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSurah.huruf.map((h) => (
                  <div 
                    key={h.arabic}
                    className={`p-4 rounded-xl border ${innerCardBgClass} flex flex-col justify-between space-y-4`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b border-current/5 pb-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-serif font-black text-pink-500">
                              {h.arabic}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-450 mt-1">
                              / {h.transliteration} /
                            </span>
                          </div>
                          <AudioPlayButton text={h.arabic} isParchment={isParchment} />
                        </div>
                        
                        <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-bold border ${badgeThemeBg}`}>
                          {h.classification}
                        </span>
                      </div>

                      <div className="text-[11px] leading-relaxed">
                        <span className="text-[9px] font-mono opacity-50 uppercase block">Functional Lexical Meaning:</span>
                        <strong className="text-current text-[11.5px]">{h.meaning}</strong>
                      </div>
                    </div>

                    {/* Examples in Surah Box */}
                    <div className="space-y-2 pt-2 border-t border-current/5">
                      <span className="text-[9px] font-mono opacity-50 uppercase block font-bold pl-1">Occurrence & Structural Impact:</span>
                      
                      {h.examples.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-black/15 border border-current/5 space-y-1.5 text-[10.5px]">
                          <div className="flex justify-between items-center flex-row-reverse" style={{ direction: 'rtl' }}>
                            <span className="font-serif font-black text-sm text-current">{item.arabicPhrase}</span>
                            <span className="font-sans text-[10px] opacity-85" style={{ direction: 'ltr' }}>"{item.translationPhrase}"</span>
                          </div>
                          
                          <p className="text-[10px] text-slate-400 italic leading-relaxed pt-1 border-t border-current/5">
                            <strong className="text-pink-400">Grammar Effect:</strong> {item.grammaticalEffect}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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