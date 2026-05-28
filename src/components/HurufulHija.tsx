import React, { useState } from 'react';
import { LayoutTheme } from '../types';
import { 
  Compass, 
  Sparkles, 
  Info, 
  HelpCircle, 
  Bookmark, 
  Volume2, 
  Check, 
  RotateCcw, 
  Award,
  Layers,
  ChevronRight,
  MapPin,
  ChevronDown
} from 'lucide-react';

interface HurufulHijaProps {
  theme: LayoutTheme;
}

interface LetterDetail {
  arabic: string;
  name: string;
  transliteration: string;
  makhrajGroup: 'throat' | 'tongue' | 'lips' | 'jauf' | 'khayshum';
  makhrajName: string;
  makhrajDetails: string;
  thickness: 'mufakhkham' | 'muraqqaq' | 'conditional';
  mufakhkhamDetails: string;
  qalqalah: boolean;
  qalqalahDetails: string;
  ghunnah: boolean;
  ghunnahDetails: string;
  otherAttributes: string[];
  exampleWord: string;
  exampleTrans: string;
  exampleMeaning: string;
}

const ALPHABET_DATA: LetterDetail[] = [
  {
    arabic: "أ",
    name: "Alif / Hamzah",
    transliteration: "Alif / Hamzah",
    makhrajGroup: "throat",
    makhrajName: "Aqsal-Halq (Deepest throat)",
    makhrajDetails: "Articulated from the bottom-most part of the throat, closest to the chest and vocal cords.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always pronounced flat and thin, except when Alif acts as elongation for a preceding heavy letter.",
    qalqalah: false,
    qalqalahDetails: "Does not possess the bouncing/echo trait. When sukoon is on it, it has a sharp vocal stop (Nabr).",
    ghunnah: false,
    ghunnahDetails: "No nasal sound.",
    otherAttributes: ["Jahr (vocalized)", "Shiddah (forceful blocking of sound)"],
    exampleWord: "أَلَمْ تَجَعَلْ",
    exampleTrans: "Alam taj'al",
    exampleMeaning: "Did He not make...?"
  },
  {
    arabic: "ب",
    name: "Ba",
    transliteration: "Bā’",
    makhrajGroup: "lips",
    makhrajName: "Ash-Shafatayn (Lips)",
    makhrajDetails: "Articulated by closing the wet inner portions of the upper and lower lips together firmly.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always thin and flat. Never make it full-mouthed.",
    qalqalah: true,
    qalqalahDetails: "Possesses a strong echoing rebound (Qalqalah) when it carries a Sukoon.",
    ghunnah: false,
    ghunnahDetails: "No nasalization, except if undergoing Iqlab (changing to Meem sound).",
    otherAttributes: ["Jahr (vocalized)", "Shiddah (strong pause of breath)"],
    exampleWord: "ٱلْحَمْدُ لِلَّهِ رَبِّ",
    exampleTrans: "Rabbi",
    exampleMeaning: "Lord (of the worlds)"
  },
  {
    arabic: "ت",
    name: "Ta",
    transliteration: "Tā’",
    makhrajGroup: "tongue",
    makhrajName: "Teeth Roots (Nata'iyyah)",
    makhrajDetails: "The tip of the tongue meets the roots (gums) of the top front two incisors.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always light. Take care not to inflate the cheeks when reciting 'Ta'.",
    qalqalah: false,
    qalqalahDetails: "No bouncing sound. Ensure proper release of breath instead.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Hams (slight whisper/release of breath on sukoon)"],
    exampleWord: "تَرْجِعُونَ",
    exampleTrans: "Tarji'ūn",
    exampleMeaning: "You shall return"
  },
  {
    arabic: "ث",
    name: "Tha",
    transliteration: "Thā’",
    makhrajGroup: "tongue",
    makhrajName: "Teeth Tips (Lathawiyyah)",
    makhrajDetails: "The tip of the tongue gently touches the edge/tips of the upper front two incisors. Soft lisp sound.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Pronounced light, thin, and flat.",
    qalqalah: false,
    qalqalahDetails: "No bouncing. Hold the soft flowing air.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Hams (whisper of breath)", "Rikhawah (continuous flow of sound)"],
    exampleWord: "ثَوَابَ ٱللَّهِ",
    exampleTrans: "Thawāba Allāh",
    exampleMeaning: "The reward of Allah"
  },
  {
    arabic: "ج",
    name: "Jeem",
    transliteration: "Jīm",
    makhrajGroup: "tongue",
    makhrajName: "Shajariyyah (Middle tongue)",
    makhrajDetails: "The middle of the tongue rises and presses against the center roof of the mouth.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always thin and flat. Do not give it a wet 'je' sound like English; it should be highly compressed.",
    qalqalah: true,
    qalqalahDetails: "Highly pronounced echo bouncing sound (Qalqalah) when carrying a Sukoon.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Jahr (voice-vocalized)", "Shiddah (stops the breath)"],
    exampleWord: "ٱلْفَجْرِ",
    exampleTrans: "Al-Fajr",
    exampleMeaning: "The Dawn"
  },
  {
    arabic: "ح",
    name: "Ha (Throat)",
    transliteration: "Ḥā’",
    makhrajGroup: "throat",
    makhrajName: "Wasat-al-Halq (Middle throat)",
    makhrajDetails: "Articulated from the center of the throat, matching the epiglottis area. Emits a clean, rasping high-friction breathy sigh.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always light. Must remain separate from the chest-based 'Haa' (هـ).",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasal sound.",
    otherAttributes: ["Hams (breath release)", "Rikhawah (flowing vocal sound)"],
    exampleWord: "ٱلرَّحْمَٰنِ",
    exampleTrans: "Ar-Raḥmān",
    exampleMeaning: "The Entirely Merciful"
  },
  {
    arabic: "خ",
    name: "Kha",
    transliteration: "Khā’",
    makhrajGroup: "throat",
    makhrajName: "Adnal-Halq (Closest throat)",
    makhrajDetails: "Top part of the throat, closest to the mouth cavity, right near the uvula. Creates a light snoring / rasping sound.",
    thickness: "mufakhkham",
    mufakhkhamDetails: "Always heavy and full-mouthed (one of the permanent Khussa Daghtin Qiz letters).",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Hams (breathy)", "Istila' (elevation of back tongue)"],
    exampleWord: "خَلَقَ ٱلْإِنسَٰنَ",
    exampleTrans: "Khalaqa",
    exampleMeaning: "He created"
  },
  {
    arabic: "د",
    name: "Dal",
    transliteration: "Dāl",
    makhrajGroup: "tongue",
    makhrajName: "Teeth Roots (Nata'iyyah)",
    makhrajDetails: "The tip of the tongue meets the top roots of the front two upper teeth.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always light, thin, and flat.",
    qalqalah: true,
    qalqalahDetails: "Echoes strongly (Qalqalah) when holding a Sukoon. High crispness.",
    ghunnah: false,
    ghunnahDetails: "No nasal sound.",
    otherAttributes: ["Jahr (voice-vocalized)", "Shiddah (strong pause)"],
    exampleWord: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
    exampleTrans: "Aḥad",
    exampleMeaning: "(He is Allah) One"
  },
  {
    arabic: "ذ",
    name: "Thal",
    transliteration: "Dhāl",
    makhrajGroup: "tongue",
    makhrajName: "Teeth Tips (Lathawiyyah)",
    makhrajDetails: "The tip of the tongue lightly connects with the tips of the upper two front teeth. Soft sound.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always light, thin, and soft.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Jahr (voice-vocalized)", "Rikhawah (vocal flow)"],
    exampleWord: "ٱلَّذِينَ ءَامَنُواْ",
    exampleTrans: "Alladhīna",
    exampleMeaning: "Those who (believed)"
  },
  {
    arabic: "ر",
    name: "Ra",
    transliteration: "Rā’",
    makhrajGroup: "tongue",
    makhrajName: "Dhalaqiyyah (Tip margin)",
    makhrajDetails: "Tip of the tongue and its outer back surface taps the gums behind the front incisors.",
    thickness: "conditional",
    mufakhkhamDetails: "Heavy when carrying a Fathah (ـَ) or Dammah (ـُ); light when carrying a Kasrah (ـِ). Highly active conditional state.",
    qalqalah: false,
    qalqalahDetails: "No bouncing. Must avoid excessive rolling vibration (Takreer).",
    ghunnah: false,
    ghunnahDetails: "No nasal sound.",
    otherAttributes: ["Inhiraf (drift of sound)", "Takreer (controlled trilling/repeat)"],
    exampleWord: "ٱلْقَادِرُ",
    exampleTrans: "Al-Qādiru (Heavy) / Miryam (Light)",
    exampleMeaning: "The Capable / Mary"
  },
  {
    arabic: "ز",
    name: "Zay",
    transliteration: "Zāy",
    makhrajGroup: "tongue",
    makhrajName: "Teeth Margins (Asaliyyah)",
    makhrajDetails: "Tip of the tongue aligned with the lower and upper front teeth, creating a strong buzzing whistle sound.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always thin and flat, with high acoustic velocity.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Safeer (Whistling quality)", "Jahr (voice-vocalized)"],
    exampleWord: "زَلْزَلَتِهَا",
    exampleTrans: "Zalzalatihā",
    exampleMeaning: "Its ultimate shaking"
  },
  {
    arabic: "س",
    name: "Seen",
    transliteration: "Sīn",
    makhrajGroup: "tongue",
    makhrajName: "Teeth Margins (Asaliyyah)",
    makhrajDetails: "Tip of the tongue aligned with the teeth margins, emitting a high-freq soft whistling hiss (Sss).",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always light. Must not be elevated to 'Saad' (ص).",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Safeer (Whistle)", "Hams (breathy and whispered)"],
    exampleWord: "بِسْمِ ٱللَّهِ",
    exampleTrans: "Bismi",
    exampleMeaning: "In the name (of Allah)"
  },
  {
    arabic: "ش",
    name: "Sheen",
    transliteration: "Shīn",
    makhrajGroup: "tongue",
    makhrajName: "Shajariyyah (Middle tongue)",
    makhrajDetails: "Middle portion of the tongue arches towards the center roof of the mouth, causing breath to diffuse outwards.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always thin and flat.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Tafash-shee (wide dispersal of blowing air in the mouth)"],
    exampleWord: "ٱلشَّيْطَٰنِ",
    exampleTrans: "Ash-Shayṭān",
    exampleMeaning: "Satan / The Devil"
  },
  {
    arabic: "ص",
    name: "Sad",
    transliteration: "Ṣād",
    makhrajGroup: "tongue",
    makhrajName: "Teeth Margins (Asaliyyah)",
    makhrajDetails: "Same makhraj tip as 'Seen' but the back of the tongue rises extensively and the middle depresses, creating extreme compression.",
    thickness: "mufakhkham",
    mufakhkhamDetails: "Always thick and heavy (permanent). Emits a heavy whistle sound.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Safeer (Whistle)", "Itbaq (closure of mouth cavity)", "Istila' (elevated tongue)"],
    exampleWord: "ٱلصَّرَٰطَ",
    exampleTrans: "Aṣ-Ṣirāṭa",
    exampleMeaning: "The Path"
  },
  {
    arabic: "ض",
    name: "Dad",
    transliteration: "Ḍād",
    makhrajGroup: "tongue",
    makhrajName: "Sides of Tongue (Janbiyyah)",
    makhrajDetails: "One or both sides (edges) of the tongue press firmly against the upper molars. One of the unique sounds of Arabic.",
    thickness: "mufakhkham",
    mufakhkhamDetails: "Always highly heavy and full-mouthed (permanent). Highly compressed.",
    qalqalah: false,
    qalqalahDetails: "No bouncing. Must glide sound instead.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Istitalah (prolonged acoustic glide while keeping contact with molars)"],
    exampleWord: "وَلَا ٱلضَّآلِّينَ",
    exampleTrans: "Walā Aḍ-Ḍāllīn",
    exampleMeaning: "Nor of those who go astray"
  },
  {
    arabic: "ط",
    name: "Ta (Heavy)",
    transliteration: "Ṭā’",
    makhrajGroup: "tongue",
    makhrajName: "Teeth Roots (Nata'iyyah)",
    makhrajDetails: "Tip of the tongue meets roots of the upper front incisors with extreme elevation of the back tongue.",
    thickness: "mufakhkham",
    mufakhkhamDetails: "Always heavy and very deep (strongest heavy letter in the entire alphabet).",
    qalqalah: true,
    qalqalahDetails: "Extremely strong echo bounce (Qalqalah) when carrying sukoon.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Itbaq (mouth closure)", "Istila' (elevated back tongue)", "Shiddah (breath stop)"],
    exampleWord: "قُلُوبِ طَبَعَ",
    exampleTrans: "Ṭaba'a",
    exampleMeaning: "He set a seal (on hearts)"
  },
  {
    arabic: "ظ",
    name: "Za (Heavy)",
    transliteration: "Ẓā’",
    makhrajGroup: "tongue",
    makhrajName: "Teeth Tips (Lathawiyyah)",
    makhrajDetails: "Tip of the tongue meets tips of the upper front incisors with elevated back tongue.",
    thickness: "mufakhkham",
    mufakhkhamDetails: "Always heavy, dark, and thick (permanent).",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Itbaq (closure)", "Istila' (elevation)"],
    exampleWord: "عَذَابٌ عَظِيمٌ",
    exampleTrans: "‘Aẓīm",
    exampleMeaning: "A supreme / colossal (punishment)"
  },
  {
    arabic: "ع",
    name: "Ain",
    transliteration: "‘Ayn",
    makhrajGroup: "throat",
    makhrajName: "Wasat-al-Halq (Middle throat)",
    makhrajDetails: "Articulated from the center of the throat. Highly distinct deep glottal sound by tightening the epiglottis slightly.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always light. Must keep it crisp; do not swallow it so much that it sounds heavy.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Tawassut (moderate timing - between force and flow)"],
    exampleWord: "نَعْبُدُ وَإِيَّاكَ",
    exampleTrans: "Na'budu",
    exampleMeaning: "We worship"
  },
  {
    arabic: "غ",
    name: "Ghain",
    transliteration: "Ghayn",
    makhrajGroup: "throat",
    makhrajName: "Adnal-Halq (Closest throat)",
    makhrajDetails: "Top of the throat, near the uvula. Smooth, bubbling sound similar to gargling.",
    thickness: "mufakhkham",
    mufakhkhamDetails: "Always thick, heavy, and full-mouthed (permanent).",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Istila' (elevation of back tongue)", "Jahr (vocalized)"],
    exampleWord: "غَيْرِ ٱلْمَغْضُوبِ",
    exampleTrans: "Ghayri Al-Maghḍūbi",
    exampleMeaning: "Not of those who earned wrath"
  },
  {
    arabic: "ف",
    name: "Fa",
    transliteration: "Fā’",
    makhrajGroup: "lips",
    makhrajName: "Ash-Shafatayn (Lips)",
    makhrajDetails: "Tips of the upper front incisors compress gently onto the wet inner surface of the lower lip.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always light, thin, and flowing with breath.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Hams (whispered)", "Fakhawah (flow of sound)"],
    exampleWord: "ٱلْفَلَقِ",
    exampleTrans: "Al-Falaqi",
    exampleMeaning: "The Daybreak"
  },
  {
    arabic: "ق",
    name: "Qaf",
    transliteration: "Qāf",
    makhrajGroup: "tongue",
    makhrajName: "Lahawiyyah (Uvular root)",
    makhrajDetails: "The backmost root of the tongue meets the soft palate (near the uvula) at the back of the mouth.",
    thickness: "mufakhkham",
    mufakhkhamDetails: "Always highly heavy and thick (permanent).",
    qalqalah: true,
    qalqalahDetails: "Extremely sharp, echoing bounce (Qalqalah) when carrying a Sukoon.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Istila' (elevation of back tongue)", "Shiddah (force shut)"],
    exampleWord: "قُلْ أَعُوذُ",
    exampleTrans: "Qul",
    exampleMeaning: "Say: (I seek refuge)"
  },
  {
    arabic: "ك",
    name: "Kaf",
    transliteration: "Kāf",
    makhrajGroup: "tongue",
    makhrajName: "Tongue base",
    makhrajDetails: "The back of the tongue meets the hard palate, slightly forward compared to 'Qāf'.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always thin and flat. Ensure you do not say it like Qaf.",
    qalqalah: false,
    qalqalahDetails: "No bouncing. Releases air instead.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Hams (release of air on sukoon)", "Shiddah (stops breath initially)"],
    exampleWord: "ٱلْكَوْثَرَ",
    exampleTrans: "Al-Kawthara",
    exampleMeaning: "The Abundant Good"
  },
  {
    arabic: "ل",
    name: "Lam",
    transliteration: "Lām",
    makhrajGroup: "tongue",
    makhrajName: "Dhalaqiyyah (Tongue margin)",
    makhrajDetails: "The side edges/tip of the tongue touch the gums of the upper front teeth and premolars.",
    thickness: "conditional",
    mufakhkhamDetails: "Always light and thin (Tarqeeq), EXCEPT in the word 'Allah' (ٱللَّه) when preceded by a Fathah or Dammah, where it becomes heavy.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Inhiraf (vocal sound drift)"],
    exampleWord: "لَكُمْ دِينُكُمْ",
    exampleTrans: "Lakum (Light) / Allāhu (Heavy)",
    exampleMeaning: "For you is your religion"
  },
  {
    arabic: "م",
    name: "Meem",
    transliteration: "Mīm",
    makhrajGroup: "lips",
    makhrajName: "Ash-Shafatayn (Lips)",
    makhrajDetails: "The dry outer margins of the upper and lower lips seal together softly. Generates nasal resonance.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always light, thin, and flat.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: true,
    ghunnahDetails: "Possesses an intrinsic, permanent Ghunnah (nasalization) flowing from the nose.",
    otherAttributes: ["Ghunnah (nasal resonance)", "Jahr (vocalized)"],
    exampleWord: "مِّن مَّاضٍ",
    exampleTrans: "Mim-Māḍin (with holding Ghunnah)",
    exampleMeaning: "From what is past"
  },
  {
    arabic: "ن",
    name: "Noon",
    transliteration: "Nūn",
    makhrajGroup: "tongue",
    makhrajName: "Dhalaqiyyah / Nasal",
    makhrajDetails: "The tip of the tongue touches the gums of the top front teeth, and sound is passed through the nasal cavity.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always light, thin, and flat.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: true,
    ghunnahDetails: "Inherent permanent nasal resonance (Ghunnah). Extremely high impact on Tajweed Ahkam.",
    otherAttributes: ["Ghunnah (nasal pass)", "Tawassut / moderate time"],
    exampleWord: "ٱلنَّاسِ",
    exampleTrans: "An-Nās (Hold 2 counts)",
    exampleMeaning: "Mankind / The People"
  },
  {
    arabic: "ه",
    name: "Ha (Chest/Light)",
    transliteration: "Hā’",
    makhrajGroup: "throat",
    makhrajName: "Aqsal-Halq (Bottom throat)",
    makhrajDetails: "Bottom-most throat near vocal chords. Flow of breath is completely relaxed.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always extremely light, delicate, and wispy.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasal sound.",
    otherAttributes: ["Hams (whispered)", "Rikhawah (sound flow)"],
    exampleWord: "ٱلَّذِي هُمَا",
    exampleTrans: "Humā",
    exampleMeaning: "They both"
  },
  {
    arabic: "و",
    name: "Waw",
    transliteration: "Wāw",
    makhrajGroup: "lips",
    makhrajName: "Ash-Shafatayn (Lips)",
    makhrajDetails: "Puckering and partial rounding of both lips, leaving a tiny center circular opening.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always thin and light. Must keep it soft.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Līn (ease of flow)", "Jahr (vocalized)"],
    exampleWord: "وَٱلْيَوْمِ",
    exampleTrans: "Wal-Yawmi",
    exampleMeaning: "And the Day"
  },
  {
    arabic: "ي",
    name: "Ya",
    transliteration: "Yā’",
    makhrajGroup: "tongue",
    makhrajName: "Shajariyyah (Middle tongue)",
    makhrajDetails: "Middle portion of the tongue arches towards the soft palate without fully blocking sound.",
    thickness: "muraqqaq",
    mufakhkhamDetails: "Always light, thin, and flat.",
    qalqalah: false,
    qalqalahDetails: "No bouncing.",
    ghunnah: false,
    ghunnahDetails: "No nasalization.",
    otherAttributes: ["Līn (ease / soft glide)", "Rikhawah (flowing)"],
    exampleWord: "إِيَّاكَ نَعْبُدُ",
    exampleTrans: "Iyyāka",
    exampleMeaning: "You alone"
  }
];

interface ArticulationPoint {
  x: number;
  y: number;
  name: string;
  group: 'throat' | 'tongue' | 'lips' | 'jauf' | 'khayshum';
}

const LETTER_COORDINATED_POINTS: Record<string, ArticulationPoint> = {
  "أ": { x: 92, y: 185, name: "Aqsal-Halq (Deepest throat)", group: "throat" },
  "ه": { x: 92, y: 185, name: "Aqsal-Halq (Deepest throat)", group: "throat" },
  "ع": { x: 90, y: 155, name: "Wasat-al-Halq (Middle throat)", group: "throat" },
  "ح": { x: 90, y: 155, name: "Wasat-al-Halq (Middle throat)", group: "throat" },
  "غ": { x: 88, y: 125, name: "Adnal-Halq (Closest throat)", group: "throat" },
  "خ": { x: 88, y: 125, name: "Adnal-Halq (Closest throat)", group: "throat" },

  "ق": { x: 82, y: 102, name: "Uvular Base (Qāf)", group: "tongue" },
  "ك": { x: 74, y: 101, name: "Soft Palate Base (Kāf)", group: "tongue" },
  "ج": { x: 65, y: 108, name: "Shajariyyah Middle Tongue (Jīm)", group: "tongue" },
  "ش": { x: 65, y: 108, name: "Shajariyyah Middle Tongue (Shīn)", group: "tongue" },
  "ي": { x: 65, y: 108, name: "Shajariyyah Middle Tongue (Yā’)", group: "tongue" },
  "ض": { x: 72, y: 114, name: "Tongue Edges (Ḍād)", group: "tongue" },
  "ت": { x: 45, y: 96, name: "Upper Teeth Roots (Tā’)", group: "tongue" },
  "د": { x: 45, y: 96, name: "Upper Teeth Roots (Dāl)", group: "tongue" },
  "ط": { x: 45, y: 96, name: "Upper Teeth Roots (Ṭā’)", group: "tongue" },
  "ل": { x: 51, y: 98, name: "Tongue Tip Margin (Lām)", group: "tongue" },
  "ن": { x: 51, y: 98, name: "Tongue Tip Margin (Nūn)", group: "tongue" },
  "ر": { x: 51, y: 98, name: "Tongue Tip Margin (Rā’)", group: "tongue" },
  "ث": { x: 39, y: 100, name: "Teeth Tips (Thā’)", group: "tongue" },
  "ذ": { x: 39, y: 100, name: "Teeth Tips (Dhāl)", group: "tongue" },
  "ظ": { x: 39, y: 100, name: "Teeth Tips (Ẓā’)", group: "tongue" },
  "ز": { x: 41, y: 105, name: "Teeth Margins (Zāy)", group: "tongue" },
  "س": { x: 41, y: 105, name: "Teeth Margins (Sīn)", group: "tongue" },
  "ص": { x: 41, y: 105, name: "Teeth Margins (Ṣād)", group: "tongue" },

  "ف": { x: 35, y: 106, name: "Teeth Tip on Wet Lower Lip (Fā’)", group: "lips" },
  "ب": { x: 28, y: 104, name: "Closed Outer Lips (Bā’)", group: "lips" },
  "م": { x: 28, y: 104, name: "Closed Outer Lips (Mīm)", group: "lips" },
  "و": { x: 27, y: 102, name: "Puckered Rounded Lips (Wāw)", group: "lips" }
};

const getPointForLetter = (letter: LetterDetail): ArticulationPoint => {
  if (LETTER_COORDINATED_POINTS[letter.arabic]) {
    return LETTER_COORDINATED_POINTS[letter.arabic];
  }
  switch (letter.makhrajGroup) {
    case 'throat': return { x: 90, y: 155, name: "Al-Ḥalq (Throat)", group: "throat" };
    case 'tongue': return { x: 65, y: 108, name: "Al-Lisān (Tongue)", group: "tongue" };
    case 'lips': return { x: 28, y: 104, name: "Ash-Shafatayn (Lips)", group: "lips" };
    case 'jauf': return { x: 64, y: 72, name: "Al-Jawf (Empty Space)", group: "jauf" };
    case 'khayshum': return { x: 65, y: 48, name: "Al-Khayshūm (Nose)", group: "khayshum" };
    default: return { x: 64, y: 72, name: "Articulation Spot", group: "jauf" };
  }
};

interface MakharijSvgDiagramProps {
  selectedLetter: LetterDetail;
  filterGroup: string;
  setFilterGroup: (group: any) => void;
  theme: LayoutTheme;
}

function MakharijSvgDiagram({ 
  selectedLetter, 
  filterGroup, 
  setFilterGroup, 
  theme 
}: MakharijSvgDiagramProps) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // State to track local hovered region
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Active group based on selected letter
  const activeGroup = selectedLetter.makhrajGroup;

  // Retrieve coordinate for active letter
  const point = getPointForLetter(selectedLetter);

  // Region names in Arabic/English
  const regions = [
    { id: 'khayshum', name: 'Al-Khayshūm (Nose)', arabic: 'الخَيْشُوم', color: 'text-violet-500', hoverColor: 'fill-violet-500/20 stroke-violet-500' },
    { id: 'jauf', name: 'Al-Jawf (Mouth Space)', arabic: 'الجَوْف', color: 'text-teal-500', hoverColor: 'fill-teal-500/20 stroke-teal-500' },
    { id: 'throat', name: 'Al-Ḥalq (Throat)', arabic: 'الحَلْق', color: 'text-amber-500', hoverColor: 'fill-amber-500/20 stroke-amber-500' },
    { id: 'tongue', name: 'Al-Lisān (Tongue)', arabic: 'اللِّسَان', color: 'text-sky-400', hoverColor: 'fill-sky-500/20 stroke-sky-500' },
    { id: 'lips', name: 'Ash-Shafatayn (Lips)', arabic: 'الشَّفَتَيْن', color: 'text-pink-400', hoverColor: 'fill-pink-500/20 stroke-pink-500' },
  ];

  const handleRegionClick = (regionId: string) => {
    if (filterGroup === regionId) {
      setFilterGroup('all');
    } else {
      setFilterGroup(regionId as any);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-black/10 border border-current/5 relative overflow-hidden h-full w-full">
      {/* Title / Description overlay */}
      <div className="absolute top-2 left-3 right-3 flex justify-between items-start pointer-events-none select-none z-10">
        <div className="text-[9px] font-mono opacity-50 tracking-wider">ANATOMICAL MAP</div>
        <div className="text-right">
          <div className="text-[9px] font-mono font-bold uppercase text-amber-500 leading-none">{selectedLetter.makhrajGroup}</div>
          <div className="text-[8px] opacity-40 leading-tight">Click region to filter</div>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg 
        viewBox="0 0 180 230" 
        className="w-full max-w-[210px] aspect-[5/6] cursor-pointer mt-4"
        style={{ filter: isCosmic ? 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.1))' : 'none' }}
      >
        <defs>
          <radialGradient id="glow-throat" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-tongue" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-lips" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-jauf" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-khayshum" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Al-Jawf (Cavity Back Glow) */}
        <path 
          d="M 50,110 C 65,100 85,100 92,115 C 92,130 86,155 86,185 C 86,185, 76,185, 76,155 C 76,135 62,125 50,110 Z" 
          fill={activeGroup === 'jauf' ? 'url(#glow-jauf)' : 'none'} 
          className="transition-all duration-300"
        />

        {/* Vocal Tract Base Face Contour (Side Profile) */}
        <path 
          d="M 68,20 C 105,15 145,35 155,75 C 162,110 152,145 144,195 M 68,20 L 53,25 Q 43,38 43,50 L 25,56 C 25,56, 38,62, 40,64 L 32,71 L 43,75 L 35,80 Q 40,88 37,93 L 40,101 Q 48,114 60,114 Q 68,135 68,175 Q 68,195 70,225" 
          fill="none" 
          stroke={isParchment ? '#8c6239' : '#64748b'} 
          strokeWidth="2.5" 
          strokeLinecap="round"
          className="opacity-20"
        />

        {/* Al-Khayshūm (Nasal Cavity Area) */}
        <path
          d="M 45,60 C 55,48 85,48 95,65 C 95,75 90,83 85,87 C 75,87 65,82 50,70 Z"
          fill={activeGroup === 'khayshum' ? 'rgba(139, 92, 246, 0.25)' : hoveredRegion === 'khayshum' || filterGroup === 'khayshum' ? 'rgba(139, 92, 246, 0.15)' : 'none'}
          stroke="#8b5cf6"
          strokeWidth={activeGroup === 'khayshum' ? 2 : 1}
          strokeDasharray={activeGroup === 'khayshum' ? 'none' : '3,3'}
          className="transition-all duration-300"
          onMouseEnter={() => setHoveredRegion('khayshum')}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => handleRegionClick('khayshum')}
        />

        {/* Al-Ḥalq (Throat Passage Area) */}
        <path
          d="M 84,115 C 80,115 80,210 80,210 L 92,210 C 92,210 92,115 92,115 Z"
          fill={activeGroup === 'throat' ? 'rgba(245, 158, 11, 0.25)' : hoveredRegion === 'throat' || filterGroup === 'throat' ? 'rgba(245, 158, 11, 0.15)' : 'none'}
          stroke="#f59e0b"
          strokeWidth={activeGroup === 'throat' ? 2 : 1}
          strokeDasharray={activeGroup === 'throat' ? 'none' : '3,3'}
          className="transition-all duration-300"
          onMouseEnter={() => setHoveredRegion('throat')}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => handleRegionClick('throat')}
        />

        {/* Al-Lisān (Tongue Area) */}
        <path
          d="M 52,113 C 55,102 65,100 78,102 C 88,106 91,118 88,128 C 83,134 73,134 62,130 C 55,126 51,120 52,113 Z"
          fill={activeGroup === 'tongue' ? 'rgba(56, 189, 248, 0.25)' : hoveredRegion === 'tongue' || filterGroup === 'tongue' ? 'rgba(56, 189, 248, 0.15)' : 'none'}
          stroke="#38bdf8"
          strokeWidth={activeGroup === 'tongue' ? 2 : 1}
          strokeDasharray={activeGroup === 'tongue' ? 'none' : '3,3'}
          className="transition-all duration-300"
          onMouseEnter={() => setHoveredRegion('tongue')}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => handleRegionClick('tongue')}
        />

        {/* Ash-Shafatayn (Lips Area Capsule) */}
        <ellipse
          cx="34"
          cy="92"
          rx="6"
          ry="13"
          fill={activeGroup === 'lips' ? 'rgba(244, 63, 94, 0.25)' : hoveredRegion === 'lips' || filterGroup === 'lips' ? 'rgba(244, 63, 94, 0.15)' : 'none'}
          stroke="#f43f5e"
          strokeWidth={activeGroup === 'lips' ? 2 : 1}
          strokeDasharray={activeGroup === 'lips' ? 'none' : '3,3'}
          className="transition-all duration-300"
          onMouseEnter={() => setHoveredRegion('lips')}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => handleRegionClick('lips')}
        />

        {/* Al-Jawf Outline (Hollow space) */}
        <path
          d="M 45,74 C 60,65 85,65 92,85 C 92,105 84,130 84,160 Z"
          fill={activeGroup === 'jauf' ? 'rgba(45, 212, 191, 0.15)' : hoveredRegion === 'jauf' || filterGroup === 'jauf' ? 'rgba(45, 212, 191, 0.1)' : 'none'}
          stroke="#2dd4bf"
          strokeWidth={activeGroup === 'jauf' ? 1.5 : 0.75}
          strokeDasharray="4,4"
          className="transition-all duration-300"
          onMouseEnter={() => setHoveredRegion('jauf')}
          onMouseLeave={() => setHoveredRegion(null)}
          onClick={() => handleRegionClick('jauf')}
        />

        {/* Teeth Lines */}
        <line x1="43" y1="84" x2="44" y2="92" stroke="currentColor" strokeWidth="2.5" className="opacity-40" />
        <line x1="41" y1="102" x2="43" y2="96" stroke="currentColor" strokeWidth="2.5" className="opacity-40" />

        {/* Real-time Dynamic Articulation Point Ping (Sound Origin) */}
        {point && (
          <g>
            <circle 
              cx={point.x} 
              cy={point.y} 
              r="6" 
              fill="none" 
              stroke={
                point.group === 'throat' ? '#f59e0b' : 
                point.group === 'tongue' ? '#38bdf8' : 
                point.group === 'lips' ? '#f43f5e' : 
                point.group === 'khayshum' ? '#8b5cf6' : '#2dd4bf'
              }
              strokeWidth="1.5"
              className="animate-ping"
              style={{ transformOrigin: `${point.x}px ${point.y}px`, animationDuration: '1.8s' }}
            />
            <circle 
              cx={point.x} 
              cy={point.y} 
              r="3.5" 
              fill={
                point.group === 'throat' ? '#f59e0b' : 
                point.group === 'tongue' ? '#38bdf8' : 
                point.group === 'lips' ? '#f43f5e' : 
                point.group === 'khayshum' ? '#8b5cf6' : '#2dd4bf'
              }
              className="animate-pulse shadow"
            />
          </g>
        )}

        {/* Labels */}
        <g className="text-[7px] font-mono fill-slate-400 opacity-50">
          <text x="105" y="60">Khayshūm</text>
          <text x="100" y="145">Ḥalq</text>
          <text x="75" y="125">Lisān</text>
          <text x="8" y="115">Shafatayn</text>
          <text x="82" y="75" className="text-[6px]">Jawf</text>
        </g>
      </svg>

      {/* Stats HUD */}
      <div className="mt-2.5 text-center space-y-0.5 w-full border-t border-current/5 pt-2 min-h-[46px] select-none">
        {hoveredRegion || ['throat', 'tongue', 'lips', 'jauf', 'khayshum'].includes(filterGroup) ? (
          (() => {
            const rId = hoveredRegion || (['throat', 'tongue', 'lips', 'jauf', 'khayshum'].includes(filterGroup) ? filterGroup : null);
            const rData = regions.find(r => r.id === rId);
            return rData ? (
              <div className="animate-fadeIn">
                <span className={`text-[10px] font-bold ${rData.color} flex items-center justify-center gap-1`}>
                  {rData.name} <span className="font-serif text-[10.5px]">({rData.arabic})</span>
                </span>
                <p className="text-[9px] text-slate-400">
                  {filterGroup === rData.id ? '🎯 Filter active (click to clear)' : '🖱️ Click to filter letters'}
                </p>
              </div>
            ) : null;
          })()
        ) : (
          <div className="animate-fadeIn text-slate-400">
            <span className="text-[10.5px] font-bold text-amber-500">{selectedLetter.arabic} ({selectedLetter.transliteration})</span>
            <p className="text-[9px] leading-tight">
              Location: <span className="font-semibold text-slate-300">{selectedLetter.makhrajName}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HurufulHija({ theme }: HurufulHijaProps) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // State management
  const [selectedLetter, setSelectedLetter] = useState<LetterDetail>(ALPHABET_DATA[0]);
  const [filterGroup, setFilterGroup] = useState<'all' | 'mufakhkham' | 'muraqqaq' | 'qalqalah' | 'ghunnah' | 'throat' | 'tongue' | 'lips' | 'jauf' | 'khayshum'>('all');
  const [activeTab, setActiveTab] = useState<'explorer' | 'makharij' | 'ahkam' | 'quiz'>('explorer');

  // Interactive Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  // Filter letters based on selected state
  const filteredLetters = ALPHABET_DATA.filter((letter) => {
    if (filterGroup === 'mufakhkham') return letter.thickness === 'mufakhkham';
    if (filterGroup === 'muraqqaq') return letter.thickness === 'muraqqaq';
    if (filterGroup === 'qalqalah') return letter.qalqalah;
    if (filterGroup === 'ghunnah') return letter.ghunnah;
    if (['throat', 'tongue', 'lips', 'jauf', 'khayshum'].includes(filterGroup)) {
      return letter.makhrajGroup === filterGroup;
    }
    return true;
  });

  // Safe selection reference mapping
  const displayedLetter = filteredLetters.some(l => l.arabic === selectedLetter.arabic) 
    ? selectedLetter 
    : (filteredLetters[0] || selectedLetter);

  const quizQuestions = [
    {
      id: 1,
      question: "Which of the following Arabic letters are permanently Mufakhkham (heavy/full-mouthed) in all states?",
      options: [
        { id: "a", text: "ب، ج، د، ط، ق" },
        { id: "b", text: "خ، ص، ض، غ، ط، ق، ظ (Khussa Daghtin Qiz)" },
        { id: "c", text: "ا، و، ي، ء" },
        { id: "d", text: "ن، م، ل، ر" }
      ],
      correct: "b",
      explanation: "The 7 letters of 'Khusṣa Ḍaghṭin Qiẓ' (خص ضغط قظ) are permanently elevated at the back of the tongue, giving them a thick sound."
    },
    {
      id: 2,
      question: "What is the makhraj (articulation point) of the throat-based letter 'Ḥā’ (ح)'?",
      options: [
        { id: "a", text: "Aqsal-Halq (Bottom of the throat near chest)" },
        { id: "b", text: "Adnal-Halq (Top of the throat near mouth)" },
        { id: "c", text: "Wasat-al-Halq (Middle of the throat near epiglottis)" },
        { id: "d", text: "Ash-Shafatayn (On the lips)" }
      ],
      correct: "c",
      explanation: "The letter Ḥā’ (ح) along with ‘Ayn (ع) originates precisely in the center of the throat (Wasat-al-Halq)."
    },
    {
      id: 3,
      question: "Which letters produce a Qalqalah (crisp bouncing/echoing sound) when carrying a Sukoon?",
      options: [
        { id: "a", text: "Letters of Qutb Jadin (ق، ط، ب، ج، د)" },
        { id: "b", text: "Only Noon and Meem" },
        { id: "c", text: "The heavy letters of Khussa Daghtin Qiz" },
        { id: "d", text: "All throat-based sounds" }
      ],
      correct: "a",
      explanation: "The letters of Qalqalah are grouped within the mnemonic 'Quṭb Jadin' (قطب جد). When stationary (Sukoon), they are vocalized with an audible echo."
    },
    {
      id: 4,
      question: "What is special about the letter Rā' (ر) concerning thickness (Tafkheem)?",
      options: [
        { id: "a", text: "It is always heavy (Mufakhkham)" },
        { id: "b", text: "It is light when it has a Fathah or Dammah, heavy with Kasrah" },
        { id: "c", text: "It is conditionally heavy when carrying a Fathah/Dammah, and light with Kasrah" },
        { id: "d", text: "It has no thickness properties" }
      ],
      correct: "c",
      explanation: "Rā' (ر) is one of the conditionally thick letters. It sounds thick with Fathah/Dammah and thin/flat with Kasrah."
    }
  ];

  const handleSelectQuiz = (qId: number, optId: string) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: optId }));
  };

  const getSocreCount = () => {
    let count = 0;
    quizQuestions.forEach(q => {
      if (quizAnswers[q.id] === q.correct) count++;
    });
    return count;
  };

  // Styling
  const wrapperClass = isParchment
    ? 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e]'
    : isCosmic
      ? 'bg-[#05060f] border-indigo-950/80 text-indigo-50'
      : 'bg-slate-900 border-slate-800 text-slate-100';

  const secondaryCardClass = isParchment
    ? 'bg-[#ebd8c3]/10 border-[#dfd2be]/60'
    : isCosmic
      ? 'bg-indigo-950/20 border-indigo-900/30'
      : 'bg-slate-950/40 border-slate-800/60';

  const activeBtnClass = isParchment
    ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm'
    : isCosmic
      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40 border-indigo-500'
      : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 border-emerald-500';

  const tabBtnClass = (isActive: boolean) => 
    `py-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
      isActive 
        ? activeBtnClass 
        : isParchment 
          ? 'text-[#705e52] border-transparent hover:bg-[#ebd8c3]/30' 
          : 'text-slate-400 border-transparent hover:text-white hover:bg-white/5'
    }`;

  const getMakhrajColor = (group: string) => {
    switch (group) {
      case 'throat': return 'text-amber-500';
      case 'tongue': return 'text-sky-400';
      case 'lips': return 'text-pink-400';
      case 'jauf': return 'text-teal-400';
      case 'khayshum': return 'text-violet-400';
      default: return 'text-current';
    }
  };

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 ${wrapperClass} space-y-6 animate-fadeIn`}>
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-current/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
            <h2 className="text-xl font-bold tracking-tight">Step 1: Hurūf-ul-Hijā, Makhārij & Ahkām (Tajweed Foundations)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Systematic training in pronunciation points (Makhārij), letter thickness/heaviness properties, echoing (Qalqalah), nasalization (Ghunnah), and Tajweed rulings.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-current/5 border border-current/10 px-3 py-1.5 rounded-xl text-[11px] font-mono">
          <Layers className="w-3.5 h-3.5 text-xs text-amber-500" />
          <span>28 ESSENTIAL SOUND PATTERNS</span>
        </div>
      </div>

      {/* VIEW TABS SWITCHER */}
      <div className="flex flex-wrap gap-2 border-b border-current/5 pb-3">
        <button onClick={() => setActiveTab('explorer')} className={tabBtnClass(activeTab === 'explorer')}>
          1. Letters Explorer
        </button>
        <button onClick={() => setActiveTab('makharij')} className={tabBtnClass(activeTab === 'makharij')}>
          2. The 5 Makhārij (Areas)
        </button>
        <button onClick={() => setActiveTab('ahkam')} className={tabBtnClass(activeTab === 'ahkam')}>
          3. Tajweed Rules (Ahkām)
        </button>
        <button onClick={() => setActiveTab('quiz')} className={tabBtnClass(activeTab === 'quiz')}>
          4. Makhārij Trainer / Quiz
        </button>
      </div>

      {/* RENDER ACTIVE TAB CODES */}
      {activeTab === 'explorer' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-amber-500" /> Letter-by-Letter Phonetic Analysis
              </h3>
              <p className="text-xs text-slate-400">
                Click on any letter to examine its anatomical articulation point, thickness setting, echo rebound, and nasalization values.
              </p>
            </div>

            {/* FILTER BUTTONS */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Letters' },
                { id: 'mufakhkham', label: 'Heavy Only' },
                { id: 'muraqqaq', label: 'Light Only' },
                { id: 'qalqalah', label: 'Qalqalah (Echo)' },
                { id: 'ghunnah', label: 'Ghunnah (Nasal)' }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setFilterGroup(btn.id as any)}
                  className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                    filterGroup === btn.id
                      ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-emerald-600 text-white border-emerald-500')
                      : 'bg-transparent border-current/10 hover:bg-current/5'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* COLUMN 1: THE LETTERS GRID (SPAN 4) */}
            <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
              <div 
                className={`p-4 rounded-xl border grid grid-cols-6 sm:grid-cols-7 lg:grid-cols-5 gap-2.5 max-h-[380px] overflow-y-auto h-full ${secondaryCardClass}`}
                style={{ direction: 'rtl' }}
              >
                {filteredLetters.map((letter) => {
                  const isSelected = displayedLetter.arabic === letter.arabic;
                  let cardBorderColor = '';
                  if (isSelected) {
                    cardBorderColor = isParchment ? 'border-[#8c6239] bg-[#8c6239]/10' : isCosmic ? 'border-indigo-500 bg-indigo-950/40' : 'border-emerald-500 bg-emerald-950/40';
                  } else {
                    cardBorderColor = 'border-current/10 bg-black/10 hover:border-current/30 hover:bg-black/20';
                  }

                  return (
                    <button
                      key={letter.arabic}
                      onClick={() => setSelectedLetter(letter)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none ${cardBorderColor}`}
                      type="button"
                    >
                      <span className="text-3xl font-serif font-black mb-1.5 text-current leading-none">{letter.arabic}</span>
                      <span className="text-[9px] font-semibold text-center opacity-60 leading-none whitespace-nowrap" style={{ direction: 'ltr' }}>{letter.transliteration}</span>
                    </button>
                  );
                })}
              </div>

              {/* QUICK LEGEND */}
              <div className="flex gap-4 items-center flex-wrap px-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Heavy (Mufakhkham)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span> Echo (Qalqalah)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500"></span> Nasal (Ghunnah)
                </span>
              </div>
            </div>

            {/* COLUMN 2: INTERACTIVE SVG MAP (SPAN 4) */}
            <div className="lg:col-span-4 min-h-[340px]">
              <MakharijSvgDiagram 
                selectedLetter={displayedLetter} 
                filterGroup={filterGroup} 
                setFilterGroup={setFilterGroup} 
                theme={theme} 
              />
            </div>

            {/* COLUMN 3: SELECTED LETTER DETAILS (SPAN 4) */}
            <div className="lg:col-span-4">
              <div className="border border-current/10 p-5 rounded-2xl bg-black/15 space-y-4 h-full flex flex-col justify-between">
                <div>
                  {/* Big Letter Card Info */}
                  <div className="flex justify-between items-start border-b border-current/10 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[9px] text-slate-400 uppercase">Selected Letter</span>
                        {displayedLetter.qalqalah && (
                          <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[8px] font-mono px-1 rounded uppercase font-bold leading-none">Qalqalah</span>
                        )}
                        {displayedLetter.ghunnah && (
                          <span className="bg-violet-500/10 border border-violet-500/30 text-violet-400 text-[8px] font-mono px-1 rounded uppercase font-bold leading-none">Ghunnah</span>
                        )}
                      </div>
                      <h4 className="text-base font-bold leading-tight">{displayedLetter.name}</h4>
                      <p className="text-xs opacity-60 font-mono">{displayedLetter.transliteration}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-4xl font-serif font-black text-amber-500 drop-shadow-sm leading-none block">{displayedLetter.arabic}</span>
                    </div>
                  </div>

                  {/* Detail list stack */}
                  <div className="space-y-3.5 py-3 text-xs">
                    {/* Makhraj */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500" /> Articulator point:
                      </span>
                      <span className={`text-[11px] font-bold ${getMakhrajColor(displayedLetter.makhrajGroup)}`}>
                        {displayedLetter.makhrajName}
                      </span>
                      <p className="text-[11px] opacity-80 leading-relaxed">
                        {displayedLetter.makhrajDetails}
                      </p>
                    </div>

                    {/* Thickness */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block tracking-wider">Thickness / Weight:</span>
                      <span className={`text-[11px] font-bold uppercase ${
                        displayedLetter.thickness === 'mufakhkham' ? 'text-red-400' : displayedLetter.thickness === 'muraqqaq' ? 'text-emerald-400' : 'text-yellow-400'
                      }`}>
                        {displayedLetter.thickness === 'mufakhkham' ? 'Mufakhkham (Heavy)' : displayedLetter.thickness === 'muraqqaq' ? 'Muraqqaq (Light)' : 'Conditional (Soft/Heavy)'}
                      </span>
                      <p className="text-[11px] opacity-80 leading-relaxed">
                        {displayedLetter.mufakhkhamDetails}
                      </p>
                    </div>

                    {/* Acoustic Properties details */}
                    <div className="space-y-1 bg-current/5 p-2 rounded-xl border border-current/5 text-[10px]">
                      <div>
                        <strong>Qalqalah Rebound:</strong> {displayedLetter.qalqalah ? 'Yes (Audible echo)' : 'No (Stop only)'}
                      </div>
                      <div>
                        <strong>Nasal sound:</strong> {displayedLetter.ghunnah ? 'Involved (Nose flow)' : 'Oral passage only'}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {displayedLetter.otherAttributes.map((attr, idx) => (
                          <span key={idx} className="bg-current/10 text-[8.5px] px-1 rounded opacity-80">{attr}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recitation word example */}
                <div className="bg-black/30 p-2 text-xs rounded-xl border border-current/5 text-right flex items-center justify-between" style={{ direction: 'rtl' }}>
                  <span className="text-lg font-serif font-black text-amber-500 leading-none">{displayedLetter.exampleWord}</span>
                  <div className="text-left font-sans text-[10px] space-y-0.5" style={{ direction: 'ltr' }}>
                    <div className="font-mono font-bold text-slate-300">{displayedLetter.exampleTrans}</div>
                    <div className="text-slate-400">"{displayedLetter.exampleMeaning}"</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* THE 5 MAKHARIJ TAB */}
      {activeTab === 'makharij' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#8c6239] dark:text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              Anatomical Articulation Areas (مخارج الحروف - Makhārij-ul-Hurūf)
            </h3>
            <p className="text-xs text-slate-400">
              Classical Arabic vocalization relies on five fundamental cavities or physical structures of the human speech system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* 1. Al-Halq */}
            <div className={`p-5 rounded-2xl border ${secondaryCardClass} space-y-3 hover:scale-[1.01] transition-all`}>
              <div className="flex items-center justify-between border-b border-current/10 pb-2">
                <span className="text-sm font-bold text-amber-400">1. Al-Ḥalq (Throat)</span>
                <span className="text-xs font-serif font-bold text-[#8c6239] dark:text-amber-500">الحَلْق</span>
              </div>
              <p className="text-[11.5px] opacity-90 leading-relaxed">
                Divided into 3 sub-points generating 6 distinct gutural letters:
              </p>
              <ul className="text-[11px] space-y-1.5 pl-4 list-disc opacity-80">
                <li><strong>Aqṣal-Ḥalq (Lowest Throat):</strong> ء ، هـ (Hamzah, Haa)</li>
                <li><strong>Wasaṭ-al-Ḥalq (Middle Throat):</strong> ع ، ح (‘Ayn, Ḥā’)</li>
                <li><strong>Adnal-Ḥalq (Highest Throat):</strong> غ ، خ (Ghayn, Khā’)</li>
              </ul>
            </div>

            {/* 2. Al-Lisan */}
            <div className={`p-5 rounded-2xl border ${secondaryCardClass} space-y-3 hover:scale-[1.01] transition-all`}>
              <div className="flex items-center justify-between border-b border-current/10 pb-2">
                <span className="text-sm font-bold text-sky-400">2. Al-Lisān (Tongue)</span>
                <span className="text-xs font-serif font-bold text-[#8c6239] dark:text-amber-500">اللِّسَان</span>
              </div>
              <p className="text-[11.5px] opacity-90 leading-relaxed">
                The massive engine of 10 sub-points, creating 18 separate letters:
              </p>
              <ul className="text-[11px] space-y-1.5 pl-4 list-disc opacity-80">
                <li><strong>Deep Base:</strong> ق (Qāf) on soft palate, then ك (Kāf) hard.</li>
                <li><strong>Middle Ridge:</strong> ج ، ش ، ي (Jeem, Sheen, Ya).</li>
                <li><strong>Sides/Edges:</strong> ض (Ḍād) against upper molars.</li>
                <li><strong>Tips & Roots:</strong> ت ، د ، ط (Ta, Dal, heavy Ta).</li>
                <li><strong>Tips & Gums:</strong> ل ، ن ، ر (Lam, Noon, Ra).</li>
              </ul>
            </div>

            {/* 3. Ash-Shafatayn */}
            <div className={`p-5 rounded-2xl border ${secondaryCardClass} space-y-3 hover:scale-[1.01] transition-all`}>
              <div className="flex items-center justify-between border-b border-current/10 pb-2">
                <span className="text-sm font-bold text-pink-400">3. Ash-Shafatayn (Lips)</span>
                <span className="text-xs font-serif font-bold text-[#8c6239] dark:text-amber-500">الشَّفَتَيْن</span>
              </div>
              <p className="text-[11.5px] opacity-90 leading-relaxed">
                Emits exactly 4 letters from the physical structures of wet or dry lip coordinates:
              </p>
              <ul className="text-[11px] space-y-1.5 pl-4 list-disc opacity-80">
                <li><strong>ف (Fā’):</strong> Edge of upper front teeth on bottom wet lip.</li>
                <li><strong>ب (Bā’):</strong> Inner wet lips pressed firmly.</li>
                <li><strong>م (Mīm):</strong> Outer dry lips rounded softly.</li>
                <li><strong>و (Wāw):</strong> Partial puckering, leaving a clean hollow circular core.</li>
              </ul>
            </div>

            {/* 4. Al-Jauf */}
            <div className={`p-5 rounded-2xl border ${secondaryCardClass} space-y-3 hover:scale-[1.01] transition-all`}>
              <div className="flex items-center justify-between border-b border-current/10 pb-2">
                <span className="text-sm font-bold text-teal-400">4. Al-Jawf (Empty Space)</span>
                <span className="text-xs font-serif font-bold text-[#8c6239] dark:text-amber-500">الجَوْف</span>
              </div>
              <p className="text-[11.5px] opacity-90 leading-relaxed">
                The massive empty hollow chamber of both throat and mouth combined.
              </p>
              <ul className="text-[11px] space-y-1.5 pl-4 list-disc opacity-80">
                <li>Provides air stream support for the 3 major long vocal extension (Madd) vowels: <strong>اَ ، وُ ، يِ</strong>.</li>
                <li>Does not have an ending friction point; vibrations simply glide into space.</li>
              </ul>
            </div>

            {/* 5. Al-Khayshum */}
            <div className={`p-5 rounded-2xl border ${secondaryCardClass} space-y-3 hover:scale-[1.01] transition-all`}>
              <div className="flex items-center justify-between border-b border-current/10 pb-2">
                <span className="text-sm font-bold text-violet-400">5. Al-Khayshūm (Nose)</span>
                <span className="text-xs font-serif font-bold text-[#8c6239] dark:text-amber-500">الخَيْشُوم</span>
              </div>
              <p className="text-[11.5px] opacity-90 leading-relaxed">
                The nasal passage cavity that operates behind the nasal bones.
              </p>
              <ul className="text-[11px] space-y-1.5 pl-4 list-disc opacity-80">
                <li>Allows the emission of the <strong>Ghunnah</strong> (Nasalization sound holding 2 beats of duration).</li>
                <li>Used exclusively when pronouncing Noon (ن) and Meem (م) under active Tajweed triggers.</li>
              </ul>
            </div>

            {/* Dynamic Interactive Mouth Diagram Svg Integration */}
            <div className="p-1 rounded-2xl border border-current/10 flex flex-col justify-center items-center">
              <MakharijSvgDiagram 
                selectedLetter={displayedLetter} 
                filterGroup={filterGroup} 
                setFilterGroup={setFilterGroup} 
                theme={theme} 
              />
            </div>

          </div>
        </div>
      )}

      {/* TAJWEED AHKAM RULES TAB */}
      {activeTab === 'ahkam' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400" /> Fundamental Recitation Rules (أحكام التجويد - Tajweed Ahkām)
            </h3>
            <p className="text-xs text-slate-400">
              When specific letters meet under sukoon (quiescence) or tanween (double vowel), they execute transformative operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Rule Group 1 - Noon Sakinah */}
            <div className={`p-5 rounded-2xl border ${secondaryCardClass} space-y-4`}>
              <div className="flex items-center justify-between border-b border-current/10 pb-2">
                <h4 className="font-bold text-sm text-[#10b981]">Ahkām of Nūn Sākinah & Tanween (نْ / ـٌ)</h4>
                <span className="text-[10px] font-mono opacity-60">NOON RULINGS</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                When a Noon carrying a Sukoon (نْ) or a word ends in a Tanween double-vowel (ـٌ)، it obeys one of four rules depending on the letter immediately following it:
              </p>

              <div className="space-y-3.5 pt-1 text-[11px]">
                
                {/* Izhar */}
                <div className="space-y-1 bg-black/15 p-2.5 rounded-xl border border-current/5">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-500 font-bold">1. Iẓhār (إِظْهَار) - Clear Pronunciation</strong>
                    <span className="font-mono text-[9px] opacity-70">6 Throat letters</span>
                  </div>
                  <p className="opacity-85">If followed by ء, هـ, ع, ح, غ, خ, pronounce the Nūn clearly with no extra nasal hold.</p>
                  <em className="text-slate-400 text-[10px] block font-serif">Example: مَنْ عَمِلَ (Man 'Amila)</em>
                </div>

                {/* Idgham */}
                <div className="space-y-1 bg-black/15 p-2.5 rounded-xl border border-current/5">
                  <div className="flex items-center justify-between">
                    <strong className="text-emerald-400 font-bold">2. Idghām (إِدْغَام) - Merging Sound</strong>
                    <span className="font-mono text-[9px] opacity-70">Yarmaloon (يَرْمَلُونَ)</span>
                  </div>
                  <p className="opacity-85">Merge the Noon into the next letter. Divided into:
                    <br />• <strong>With Ghunnah:</strong> ي-ن-م-و (holding nose).
                    <br />• <strong>Without Ghunnah:</strong> ل-ر (complete merge, no nose sound).
                  </p>
                  <em className="text-slate-400 text-[10px] block font-serif">Example: مَن يَقُولُ (May-yaqūlu) - with hold</em>
                </div>

                {/* Ikhfa */}
                <div className="space-y-1 bg-black/15 p-2.5 rounded-xl border border-current/5">
                  <div className="flex items-center justify-between">
                    <strong className="text-pink-400 font-bold">3. Ikhfā’ (إِخْفَاء) - Hiding the Sound</strong>
                    <span className="font-mono text-[9px] opacity-70">15 remaining letters</span>
                  </div>
                  <p className="opacity-85">Hide the Nūn in the nasal cavity with a prolonged Ghunnah sound of 2 beats value, preparing lips for the incoming letter.</p>
                  <em className="text-slate-400 text-[10px] block font-serif">Example: مِن دُونِ (Min-dūni)</em>
                </div>

                {/* Iqlab */}
                <div className="space-y-1 bg-black/15 p-2.5 rounded-xl border border-current/5">
                  <div className="flex items-center justify-between">
                    <strong className="text-violet-400 font-bold">4. Iqlāb (إِقْلَاب) - Transforming Sound</strong>
                    <span className="font-mono text-[9px] opacity-70">If letter is ب (Bā’)</span>
                  </div>
                  <p className="opacity-85">Convert the Nūn sound into a light, soft Meem (م) sound with a nasal holding and close the lips softly.</p>
                  <em className="text-slate-400 text-[10px] block font-serif">Example: مِن بَعْدِ (Mim-ba'di)</em>
                </div>

              </div>
            </div>

            {/* Rule Group 2 - Meem Sakinah & Others */}
            <div className={`p-5 rounded-2xl border ${secondaryCardClass} space-y-4`}>
              <div className="flex items-center justify-between border-b border-current/10 pb-2">
                <h4 className="font-bold text-sm text-[#10b981]">Ahkām of Mīm Sākinah & Qalqalah</h4>
                <span className="text-[10px] font-mono opacity-60">MEEM & IMPACT RULINGS</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                Similarly, a Meem containing Sukoon (مْ) obeys three essential rules of contact, while Qalqalah manages the sound release:
              </p>

              <div className="space-y-3.5 pt-1 text-[11px]">
                
                {/* Ikhfa Shafawi */}
                <div className="space-y-1 bg-black/15 p-2.5 rounded-xl border border-current/5">
                  <div className="flex items-center justify-between">
                    <strong className="text-pink-400 font-bold">1. Ikhfā’ Shafawi (Oral Hiding)</strong>
                    <span className="font-mono text-[9px] opacity-70">If followed by ب</span>
                  </div>
                  <p className="opacity-85">Hide the Meem sound on the lips with a holding Ghunnah nasalization.</p>
                  <em className="text-slate-400 text-[10px] block font-serif">Example: تَرْمِيهِم بِحِجَارَةٍ (Tarmeehim-bihijarah)</em>
                </div>

                {/* Idgham Shafawi */}
                <div className="space-y-1 bg-black/15 p-2.5 rounded-xl border border-current/5">
                  <div className="flex items-center justify-between">
                    <strong className="text-emerald-400 font-bold">2. Idghām Shafawi (Oral Merging)</strong>
                    <span className="font-mono text-[9px] opacity-70">If followed by م</span>
                  </div>
                  <p className="opacity-85">Merge the two Meems into a single Meem with a clear Shaddah and hold the Ghunnah for 2 counts.</p>
                  <em className="text-slate-400 text-[10px] block font-serif">Example: لَكُم مَّا (Lakum-mā)</em>
                </div>

                {/* Izhar Shafawi */}
                <div className="space-y-1 bg-black/15 p-2.5 rounded-xl border border-current/5">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-500 font-bold">3. Iẓhār Shafawi (Oral Pronunciation)</strong>
                    <span className="font-mono text-[9px] opacity-70">All other letters</span>
                  </div>
                  <p className="opacity-85">Pronounce the Meem completely clearly from the lips with no nasal hold (strict rules apply when meeting و or ف to avoid accidental hiding).</p>
                  <em className="text-slate-400 text-[10px] block font-serif">Example: أَمْ لَمْ تُنذِرْهُمْ (Am-lam)</em>
                </div>

                {/* Qalqalah Degrees */}
                <div className="space-y-1 bg-black/15 p-2.5 rounded-xl border border-current/5">
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan-400 font-bold">Degrees of Qalqalah (Echo Bounce)</strong>
                    <span className="font-mono text-[9px] opacity-70">QUTB JADIN</span>
                  </div>
                  <p className="opacity-85">
                    • <strong>Kubra (Major):</strong> Shaddah at stop (e.g. ٱلْحَقُّ).
                    <br />• <strong>Wusta (Medium):</strong> Letter at the end of word stop (e.g. خَلَقَ).
                    <br />• <strong>Sughra (Minor):</strong> Letter during active middle of word (e.g. يَقْتُلُونَ).
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* MAKHARIJ QUIZ TAB */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-current/5 pb-3">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-5 h-5 text-yellow-500" /> Hurūf & Tajweed Self-Evaluation
              </h3>
              <p className="text-xs text-slate-400">
                Assess your recollection of letter attributes, articulation points, and heavy vs. light categories.
              </p>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8c6239] dark:text-amber-500 font-bold">PRO LEVEL DEVISE</span>
          </div>

          <div className="space-y-6 pt-2">
            {quizQuestions.map((q) => (
              <div key={q.id} className="space-y-2.5">
                <div className="text-xs font-semibold flex items-start gap-2">
                  <span className="font-mono bg-current/10 px-1.5 rounded py-0.5 mt-0.5">{q.id}</span>
                  <span>{q.question}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                  {q.options.map((opt) => {
                    const isSelected = quizAnswers[q.id] === opt.id;
                    const isCorrect = opt.id === q.correct;

                    let optionBtnClass = `p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                      isParchment ? 'bg-white hover:bg-[#ebdcc3]/20 border-[#dfd2be]' : 'bg-black/20 hover:bg-white/5 border-current/10'
                    }`;

                    if (showQuizResults) {
                      if (isCorrect) {
                        optionBtnClass = 'p-2.5 rounded-xl border text-left text-xs bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold cursor-default';
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
                        onClick={() => !showQuizResults && handleSelectQuiz(q.id, opt.id)}
                        disabled={showQuizResults}
                        type="button"
                        className={optionBtnClass}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[10px] select-none uppercase opacity-60">[{opt.id}]</span>
                          <span>{opt.text}</span>
                        </span>
                        {isSelected && !showQuizResults && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>

                {showQuizResults && (
                  <div className="pl-6 pt-1 text-[11px] text-slate-400 flex items-start gap-1">
                    <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <p>
                      <strong className="text-[#8c6239] dark:text-amber-500">Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Footer for Exam */}
          <div className="flex items-center gap-3 pt-4 border-t border-current/10">
            {!showQuizResults ? (
              <button
                onClick={() => setShowQuizResults(true)}
                className={`px-4 py-2 font-semibold text-xs rounded-xl cursor-pointer ${
                  isParchment ? 'bg-[#8c6239] hover:bg-[#704d2b] text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                Submit Answers
              </button>
            ) : (
              <div className="flex items-center justify-between w-full flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Test Score: <strong className="text-amber-500 text-sm font-bold">{getSocreCount()}/{quizQuestions.length}</strong> correct responses!</span>
                </div>
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setShowQuizResults(false);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                    isParchment ? 'bg-[#ebd8c3]/40 border-[#dfd2be]' : 'bg-white/5 border-current/10 hover:bg-white/10'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Trainer</span>
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
