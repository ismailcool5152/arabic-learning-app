export interface DerivedWord {
  arabic: string;
  transliteration: string;
  meaning: string;
  verseIndex: string;
  morphologyBreakdown: string;
}

export interface SurahRoot {
  letters: string; // e.g. "ح - م - د"
  meaning: string; // e.g. "To praise, commend, thank"
  derivedWords: DerivedWord[];
}

export interface SurahHarf {
  arabic: string; // e.g. "بِـ"
  transliteration: string; // e.g. "Bi-"
  classification: string; // e.g. "Preposition (Harf Jarr)"
  meaning: string; // e.g. "With, in, by"
  examples: Array<{
    arabicPhrase: string;
    translationPhrase: string;
    grammaticalEffect: string;
  }>;
}

export interface QuranVerse {
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface SurahDetail {
  id: string;
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameMeaning: string;
  revelationType: "Meccan" | "Medinan";
  verseCount: number;
  birdsEyeView: {
    themeSummary: string;
    historicalContext: string;
    theologicalSignificance: string[];
  };
  verses: QuranVerse[];
  roots: SurahRoot[];
  huruf: SurahHarf[];
}

export const SURAH_DATABASE: SurahDetail[] = [
  {
    id: "fatihah",
    number: 1,
    nameArabic: "الفَاتِحَة",
    nameEnglish: "Al-Fatihah",
    nameMeaning: "The Opening",
    revelationType: "Meccan",
    verseCount: 7,
    birdsEyeView: {
      themeSummary: "Known as 'Umm al-Kitab' (The Mother of the Book), Al-Fatiha constitutes the spiritual nucleus of the entire Quran. It functions as both a declaration of faith and a perfect petition, outlining relations between human dependency and divine sovereignty.",
      historicalContext: "Revealed early in the Prophet's mission in Mecca, it is the first complete Surah revealed at once. It was designed to be recited in every single unit (Rak'ah) of prayer, linking continuous worship with conscious gratitude and petition.",
      theologicalSignificance: [
        "Establishes the foundational concept of Al-Hamd (absolute, continuous praise as a baseline of consciousness).",
        "Formulates the dualism of divine traits: Majesty (Rabb/Sovereign) balanced directly with absolute tenderness and Mercy (Rahman/Rahim).",
        "Sets the human-divine covenant: we restrict our ultimate submission to Him alone (Iyyaka Na'budu) and restrict our seeking of ultimate help to Him alone (Iyyaka Nasta'in).",
        "Defines human destiny as a journey along a 'Straight Path', warning against anger-inducing behavior and lost straying."
      ]
    },
    verses: [
      {
        number: 1,
        arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        transliteration: "Bismi l-lāhi r-raḥmāni r-raḥīm",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
      },
      {
        number: 2,
        arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
        transliteration: "Al-ḥamdu li-lāhi rabbi l-ʿālamīn",
        translation: "[All] praise is [due] to Allah, Lord of the worlds -"
      },
      {
        number: 3,
        arabic: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
        transliteration: "Ar-raḥmāni r-raḥīm",
        translation: "The Entirely Merciful, the Especially Merciful,"
      },
      {
        number: 4,
        arabic: "مَٰلِكِ يَوْمِ ٱلدِّينِ",
        transliteration: "Māliki yawmi d-dīn",
        translation: "Sovereign of the Day of Recompense."
      },
      {
        number: 5,
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        transliteration: "Iyyāka naʿbudu wa-iyyāka nastaʿīn",
        translation: "It is You we worship and You we ask for help."
      },
      {
        number: 6,
        arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
        transliteration: "Ihdinā ṣ-ṣirāṭa l-mustaqīm",
        translation: "Guide us to the straight path -"
      },
      {
        number: 7,
        arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
        transliteration: "Ṣirāṭa l-laḏīna anʿamtaʿalayhim ġayri l-maġḍūbi ʿalayhim wala ḍ-ḍāllīn",
        translation: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray."
      }
    ],
    roots: [
      {
        letters: "ح - م - د",
        meaning: "To praise, thank, commend, show gratitude",
        derivedWords: [
          {
            arabic: "ٱلْحَمْدُ",
            transliteration: "Al-Ḥamdu",
            meaning: "The complete, absolute praise",
            verseIndex: "Verse 2",
            morphologyBreakdown: "Definite noun formed with prefix 'Al-' (ال) and root letters (ح-م-د). It defaults to the Nominative case (Raf') with a standard ending Dammah, asserting permanent, timeless truth."
          }
        ]
      },
      {
        letters: "ر - ب - ب",
        meaning: "Lord, master, owner, sustainer, the one who fosters, develops, and nurtures objects to complete maturity.",
        derivedWords: [
          {
            arabic: "رَبِّ",
            transliteration: "Rabbi",
            meaning: "Lord / Nurturer (of)",
            verseIndex: "Verse 2",
            morphologyBreakdown: "The root (ر-ب-ب) undergoes doubling (Shaddah). Formed in Genitive case (Jarr) as a possessive modifier (Mudaf), showing a Kasrah under the double Ba."
          }
        ]
      },
      {
        letters: "ر - ح - م",
        meaning: "Mercy, deep compassion, tenderness, loving benevolence (lexically connected to 'Ar-Rahim', the womb, symbolizing absolute nourishment, warmth, and protection).",
        derivedWords: [
          {
            arabic: "ٱلرَّحْمَٰنِ",
            transliteration: "Ar-Raḥmāni",
            meaning: "The Entirely Merciful / Infinitely Compassionate",
            verseIndex: "Verses 1 & 3",
            morphologyBreakdown: "Intensive noun form on the weight 'Fa'lān' (فَعْلَان) indicating overwhelming fullness, magnitude, and universality of mercy. Augmented with prefix 'Al-' (ٱل) and suffix 'an' (ـان) which drops its Alif orthographically in typical transcription."
          },
          {
            arabic: "ٱلرَّحِيمِ",
            transliteration: "Ar-Raḥīmi",
            meaning: "The Especially Merciful / Unceasingly Nurturing",
            verseIndex: "Verses 1 & 3",
            morphologyBreakdown: "Adjectival noun form on the weight 'Fa'īl' (فَعِيل) indicating constant, intimate, targeted, and everlasting application of mercy. Augmented with prefix 'Al-' (ٱل) and insert Ya (ي)."
          }
        ]
      },
      {
        letters: "ع - ل - م",
        meaning: "To know, perceive, distinct sign, world/creation (since the universe is a sign pointing to its Creator)",
        derivedWords: [
          {
            arabic: "ٱلْعَٰلَمِينَ",
            transliteration: "Al-ʿĀlamīna",
            meaning: "The worlds, planets, creation, universes, or categories of beings",
            verseIndex: "Verse 2",
            morphologyBreakdown: "Pluralized noun based on 'Al-ʿĀlam' (ٱلْعَالَم). Affixed with masculine sound plural ending 'īna' (ـِينَ) declaring the Genitive state (Jarr) because it acts as the possessive partner (Mudaf Ilayh) to 'Rabbi'."
          }
        ]
      },
      {
        letters: "م - ل - ك",
        meaning: "To own, possess ultimate kingly authority, control, rule, govern.",
        derivedWords: [
          {
            arabic: "مَٰلِكِ",
            transliteration: "Māliki",
            meaning: "Master / Owner / Sovereign",
            verseIndex: "Verse 4",
            morphologyBreakdown: "Active participle (Ism Fa'il) on the pattern 'Fā'il' (فَاعِل). Extends the root letter Meem with an Alif. Set in Genitive state (Jarr) as a modifier."
          }
        ]
      },
      {
        letters: "ع - ب - د",
        meaning: "Worship, serve, yield to, submit, act as a loving bondservant.",
        derivedWords: [
          {
            arabic: "نَعْبُدُ",
            transliteration: "Naʿbudu",
            meaning: "We worship / submit to",
            verseIndex: "Verse 5",
            morphologyBreakdown: "Active present verb (Mudari') for the first-person plural. Augmented with the prefix 'Nun' (نَـ) representing 'We', and ending with Dammah declaring typical indicative voice."
          }
        ]
      },
      {
        letters: "ع - و - n (ع - و - ن)",
        meaning: "To help, aid, support, offer strength.",
        derivedWords: [
          {
            arabic: "نَسْتَعِينُ",
            transliteration: "Nastaʿīnu",
            meaning: "We seek assistance / cry for help",
            verseIndex: "Verse 5",
            morphologyBreakdown: "Verbal Form X (Isteef'al) indicating requesting or seeking something. Augmented with prefix 'Nun' (نَـ) meaning 'We', insertion 'sta' (ـسْتَـ) meaning 'ask/seek', and long vowel 'Ya' (ي) indicating present tense transformation."
          }
        ]
      },
      {
        letters: "ه - د - ي",
        meaning: "To guide, show the way, direct to the destination, bestow light.",
        derivedWords: [
          {
            arabic: "ٱهْدِنَا",
            transliteration: "Ihdinā",
            meaning: "Guide us / Direct us",
            verseIndex: "Verse 6",
            morphologyBreakdown: "Imperative verb (Amr) addressed to the Divine. Built by dropping the weak final root letter Ya (ي) as a sign of imperative construction, adding helper prefix Alif (ٱ), and attaching personal pronoun object suffix 'Nā' (نَا) representing 'us'."
          }
        ]
      },
      {
        letters: "ق - و - م",
        meaning: "To stand, rise up, stay upright, keep straight.",
        derivedWords: [
          {
            arabic: "ٱلْمُسْتَقِيمَ",
            transliteration: "Al-Mustaqīma",
            meaning: "The straight / upright / perfect",
            verseIndex: "Verse 6",
            morphologyBreakdown: "Active participle of verbal Form X (Istaf'ala). Augmented with prefix 'Mu' (مُـ) representing the agent, 'sta' (ـسْتَـ) for seeking, and root modification converting the central weak vowel Waw to Ya. Settles in Accusative (Nasb) as an adjective/attribute."
          }
        ]
      },
      {
        letters: "ن - ع - م",
        meaning: "Blessing, favor, soft ease, delight, comfort.",
        derivedWords: [
          {
            arabic: "أَنْعَمْتَ",
            transliteration: "Anʿamta",
            meaning: "You bestowed favor / blessed",
            verseIndex: "Verse 7",
            morphologyBreakdown: "Form IV active past verb. Augmented with prefix Alif with Hamzah (أَ) indicating causative action, and personal pronoun suffix 'Ta' (تَ) denoting 'You (singular masculine)' as the direct executor of the blessing."
          }
        ]
      },
      {
        letters: "غ - ض - ب",
        meaning: "Anger, fury, indignation, wrath.",
        derivedWords: [
          {
            arabic: "ٱلْمَغْضُوبِ",
            transliteration: "Al-Maġḍūbi",
            meaning: "Those who have received anger/wrath",
            verseIndex: "Verse 7",
            morphologyBreakdown: "Passive participle noun (Ism Maf'ul) on the pattern 'Ma卯'奴l' (مَفْعُول). Constructed with prefix 'Ma' (مَـ), first root letter Ghayn, second root letter Dad, followed by a helper letter Waw (و), and ending with Ba in Genitive case."
          }
        ]
      },
      {
        letters: "ض - ل - ل",
        meaning: "To stray, wander off, lose direction, wander aimlessly.",
        derivedWords: [
          {
            arabic: "ٱلضَّآلِّينَ",
            transliteration: "Aḍ-Ḍāllīna",
            meaning: "Those who are astray / lost",
            verseIndex: "Verse 7",
            morphologyBreakdown: "Pluralized active participle (Ism Fa'il) on the pattern 'Fā'il' (فَاعِل) utilizing doubling where the second and third root letters (Lam) merge with a Shaddah. Augmented with prefix 'Al-' (ٱل), lengthening Alif, and masculine sound plural suffix 'īna' (ـِينَ) in the Genitive state."
          }
        ]
      }
    ],
    huruf: [
      {
        arabic: "بِـ",
        transliteration: "Bi",
        classification: "Preposition (Harf Jarr)",
        meaning: "With, in, by, utilizing",
        examples: [
          {
            arabicPhrase: "بِسْمِ ٱللَّهِ",
            translationPhrase: "In the name of Allah",
            grammaticalEffect: "The preposition 'Bi' directly attacks the noun 'Ism' driving its vowel down to a Genitive Kasrah (بِـ + اِسْم => بِسْمِ)."
          }
        ]
      },
      {
        arabic: "لِـ",
        transliteration: "Li",
        classification: "Preposition (Harf Jarr)",
        meaning: "To, for, belonging to",
        examples: [
          {
            arabicPhrase: "ٱلْحَمْدُ لِلَّهِ",
            translationPhrase: "Praise is for Allah",
            grammaticalEffect: "The particle 'Li' denotes ultimate ownership of praise. It couples with 'Allah' to create 'Lillahi', pulling it into the Genitive state with a Kasrah marker."
          }
        ]
      },
      {
        arabic: "إِيَّا",
        transliteration: "Iyyā",
        classification: "Direct Object Bearer / Protective Particle",
        meaning: "Exclusive emphasis marker (used to house independent object pronouns directly to emphasize exclusivity)",
        examples: [
          {
            arabicPhrase: "إِيَّاكَ نَعْبُدُ",
            translationPhrase: "You alone we worship",
            grammaticalEffect: "Normally, verbs precede objects. By pulling 'Iyyāka' (object pronoun) to the absolute start before the verb, it forms an exclusive restriction: 'Only You, and none else, do we worship.'"
          }
        ]
      },
      {
        arabic: "وَ",
        transliteration: "Wa",
        classification: "Conjunction Particle (Harf 'Atf)",
        meaning: "And, joiner",
        examples: [
          {
            arabicPhrase: "وَإِيَّاكَ نَسْتَعِينُ",
            translationPhrase: "And You alone we ask for help",
            grammaticalEffect: "Binds the second phrase to the first. Grammatically neutral, carrying over the verbal clause structural balance."
          }
        ]
      },
      {
        arabic: "لَا",
        transliteration: "Lā",
        classification: "Negative Particle (Harf Nafy)",
        meaning: "Not, nor",
        examples: [
          {
            arabicPhrase: "وَلَا ٱلضَّآلِّينَ",
            translationPhrase: "And nor of those who go astray",
            grammaticalEffect: "Supplements the negative force of 'Ghayri' to ensure the negation extends fully and clearly to both the wrath-earners and the strayers."
          }
        ]
      }
    ]
  },
  {
    id: "ikhlas",
    number: 112,
    nameArabic: "الإِخْلَاص",
    nameEnglish: "Al-Ikhlas",
    nameMeaning: "Sincerity / Absolute Monotheism",
    revelationType: "Meccan",
    verseCount: 4,
    birdsEyeView: {
      themeSummary: "A theological masterpiece comprising just 15 words. Al-Ikhlas is recounted in Hadith as being equivalent to one-third of the entire Quran, for it isolates and defines the ultimate nature of Divine Monotheism (Tawhid) in absolute, uncompromised clarity.",
      historicalContext: "Revealed when the polytheists of Mecca approached the Prophet demanding: 'Describe your Lord's lineage to us. Is He made of gold, silver, or light?' This Surah was descended as an absolute and cosmic rebuttal.",
      theologicalSignificance: [
        "Establishes 'Ahad' (absolute, eternal, indivisible, singular Oneness of essence, unlike any numeric oneness).",
        "Declares 'As-Samad' (One who is absolute, un-caused, eternal refuge, self-sufficient, while all created elements are completely dependent on Him).",
        "Eradicates anthropomorphism by stating 'He begets not, nor is He begotten'—removing all temporal, biological, or evolutionary bonds.",
        "Proclaims absolute peerlessness: nothing in existence can ever parallel, match, or approximate His scale (Walam yakun lahu kufuwan ahad)."
      ]
    },
    verses: [
      {
        number: 1,
        arabic: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
        transliteration: "Qul huwa l-lāhu aḥad",
        translation: "Say, 'He is Allah, [who is] One,"
      },
      {
        number: 2,
        arabic: "ٱللَّهُ ٱلصَّمَدُ",
        transliteration: "Allāhu ṣ-ṣamad",
        translation: "Allah, the Eternal Refuge."
      },
      {
        number: 3,
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        transliteration: "Lam yalid wa-lam yūlad",
        translation: "He neither begets nor is born,"
      },
      {
        number: 4,
        arabic: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
        transliteration: "Wa-lam yakun lahū kufuwan aḥad",
        translation: "And there is none co-equal or comparable to Him.'"
      }
    ],
    roots: [
      {
        letters: "ق - و - ل",
        meaning: "To speak, say, declare, state, direct command.",
        derivedWords: [
          {
            arabic: "قُلْ",
            transliteration: "Qul",
            meaning: "Say! / Proclaim!",
            verseIndex: "Verse 1",
            morphologyBreakdown: "Second person singular masculine imperative verb (Amr). Constructed by dropping the weak central root letter Waw (و) to prevent the collision of two silent letters (Sukun), creating a highly intense, sharp phonetic command."
          }
        ]
      },
      {
        letters: "و - ح - د / أ - ح - د",
        meaning: "Absolute oneness, uniqueness, single, indivisible identity.",
        derivedWords: [
          {
            arabic: "أَحَدٌ",
            transliteration: "Aḥadun",
            meaning: "One / The Unique / Indivisible One",
            verseIndex: "Verses 1 & 4",
            morphologyBreakdown: "Proper noun representing absolute, flawless oneness, on the pattern 'Fa'al' (فَعَل). It differs from 'Wahid' (which means first or standard one in a sequence). 'Ahad' can never have a second, third, or fourth. Standard Nominative case (Raf') with tanween dammah."
          }
        ]
      },
      {
        letters: "ص - م - د",
        meaning: "The targeted ultimate destination, the Lord sought for all crucial needs, one who is eternal, solid, and self-sufficient.",
        derivedWords: [
          {
            arabic: "ٱلصَّمَدُ",
            transliteration: "Aṣ-Ṣamadu",
            meaning: "The Self-Sufficient, Sustainer and Eternal Refuge",
            verseIndex: "Verse 2",
            morphologyBreakdown: "Noun augmented with definite prefix 'Al-' (ال) which assimilates phonologically with Sad (Sun-letter). Retains Nominative (Raf') vowel suffix Dammah. Lexically implies a sovereign who lacks any hollow organs—completely full, eternal, immutable."
          }
        ]
      },
      {
        letters: "و - ل - د",
        meaning: "To give birth, generate offspring, output descendants, parents and lineage.",
        derivedWords: [
          {
            arabic: "يَلِدْ",
            transliteration: "Yalid",
            meaning: "He begets / produces child",
            verseIndex: "Verse 3",
            morphologyBreakdown: "Active present verb (Mudari') in the Jussive state (Majzum) forced by the negative particle 'Lam'. The Jussive state demands a terminal Sukun. The first root letter Waw is dropped as is standard when transforming past tense 'Walada' into present."
          },
          {
            arabic: "يُولَدْ",
            transliteration: "Yūlad",
            meaning: "He was begotten / born",
            verseIndex: "Verse 3",
            morphologyBreakdown: "Passive present verb (Mudari' Majhul) in the Jussive state (Majzum) with terminal Sukun due to 'Lam'. The vowel markers shift to Dammah on the prefix and Fathah over the middle letter, and the dropped root letter Waw returns as a long vowel support."
          }
        ]
      },
      {
        letters: "ك - ف - و",
        meaning: "To be equal, compatible, a companion, equal partner, match, peer.",
        derivedWords: [
          {
            arabic: "كُفُوًا",
            transliteration: "Kufuwan",
            meaning: "An equal / a matching peer",
            verseIndex: "Verse 4",
            morphologyBreakdown: "Noun representing compatibility or likeness. Elevated into the Accusative state (Nasb) taking Tanween Fathah (ـًا) because it serves as the predicate of the negative/deficient verb 'Yakun'."
          }
        ]
      }
    ],
    huruf: [
      {
        arabic: "لَمْ",
        transliteration: "Lam",
        classification: "Jussive Negative Particle (Harf Jazm wa Nafy)",
        meaning: "Absolute past tense negation",
        examples: [
          {
            arabicPhrase: "لَمْ يَلِدْ",
            translationPhrase: "He neither begets",
            grammaticalEffect: "Forces the present verb 'Yalid' into the Jussive state (Majzum), which turns its ending vowel from a standard Dammah into an active terminal Sukun."
          },
          {
            arabicPhrase: "وَلَمْ يَكُن",
            translationPhrase: "And there is not",
            grammaticalEffect: "Directly causes the verb 'Yakuun' to drop its final vowel and weak letter, shortening it cleanly to 'Yakun'."
          }
        ]
      },
      {
        arabic: "وَ",
        transliteration: "Wa",
        classification: "Conjunction Particle (Harf 'Atf)",
        meaning: "And, coupling",
        examples: [
          {
            arabicPhrase: "وَلَمْ يُولَدْ",
            translationPhrase: "nor is He born",
            grammaticalEffect: "Tethers the second negation clause directly onto the first with absolute syntactic and structural flow parity."
          }
        ]
      },
      {
        arabic: "لِـ",
        transliteration: "Li",
        classification: "Preposition of Relationship / Custody",
        meaning: "For, to, belonging to",
        examples: [
          {
            arabicPhrase: "لَهُۥ",
            translationPhrase: "For Him / To Him",
            grammaticalEffect: "Preposition particle combined with the third-person masculine singular pronoun 'Hu' (He), pulling the pronoun into the genitive state of reference."
          }
        ]
      }
    ]
  },
  {
    id: "asr",
    number: 103,
    nameArabic: "العَصْر",
    nameEnglish: "Al-Asr",
    nameMeaning: "The Declining Day / Time",
    revelationType: "Meccan",
    verseCount: 3,
    birdsEyeView: {
      themeSummary: "Imam Ash-Shafi’i famously said of Al-Asr: 'If people did but ponder this surah, it would suffice them.' In three brief verses, it provides an absolute compass for human survival, mapping out the architecture of spiritual and social salvation.",
      historicalContext: "Revealed in Mecca, this Surah addresses the tragic hustle and waste of human lives. In pre-Islamic Arabia, people blamed 'time' or 'the afternoon' for their distress and failing fortunes. This Surah reoriented them: Time passes quickly; loss is inevitable unless you actively invest it.",
      theologicalSignificance: [
        "Utilizes 'Waw al-Qasam' (Oath by Time) to make the fleeting progression of hours a witness against human complacency.",
        "Declares that standard human material existence, without spiritual orientation, is a downward spiral towards 'Khusr' (complete spiritual bankruptcy).",
        "Declares four synchronous, non-negotiable clauses for escape from loss: Internal Faith (Iman), External Productivity (Salih), Communal Truth counseling (Haqq), and Communal Perseverance guidance (Sabr)."
      ]
    },
    verses: [
      {
        number: 1,
        arabic: "وَٱلْعَصْرِ",
        transliteration: "Wa-l-ʿaṣr",
        translation: "By time,"
      },
      {
        number: 2,
        arabic: "إِنَّ ٱلْإِنسَٰنَ لَفِي خُسْرٍ",
        transliteration: "Inna l-insāna la-fī ḫusr",
        translation: "Indeed, mankind is in loss,"
      },
      {
        number: 3,
        arabic: "إِلَّا ٱلَّذِينَ ءَامَنُواْ وَعَمِلُواْ ٱلصَّٰلِحَٰتِ وَتَوَاصَوْاْ بِٱلْحَقِّ وَتَوَاصَوْاْ بِٱلصَّبْرِ",
        transliteration: "Illā l-laḏīna āmanū wa-ʿamilū ṣ-ṣāliḥāti wa-tawāṣaw bi-l-ḥaqqi wa-tawāṣaw bi-ṣ-ṣabr",
        translation: "Except those who have believed and done righteous deeds and advised each other to truth and advised each other to patience."
      }
    ],
    roots: [
      {
        letters: "ع - ص - r (ع - ص - ر)",
        meaning: "To squeeze, press out, express, the passage of late afternoon, the pressure of declining hours.",
        derivedWords: [
          {
            arabic: "ٱلْعَصْرِ",
            transliteration: "Al-ʿAṣri",
            meaning: "The Declining Day / fleeting time",
            verseIndex: "Verse 1",
            morphologyBreakdown: "Noun prefixed with definite article 'Al-' (ال). Declared in the Genitive state (Jarr) with a Kasrah because it follows the Oath particle 'Wa' which functions as a prepositional governor."
          }
        ]
      },
      {
        letters: "أ - ن - س",
        meaning: "To be close, friendly, domestic, intimate, social being, to forget (also lexically connected to forgetfulness).",
        derivedWords: [
          {
            arabic: "ٱلْإِنسَٰنَ",
            transliteration: "Al-Insāna",
            meaning: "Mankind / The singular human",
            verseIndex: "Verse 2",
            morphologyBreakdown: "Singular collective noun with definite prefix 'Al-' (ال). Settles in the Accusative state (Nasb) with a clear Fathah (َ) because it is the Subject (Ism) of the powerful emphasis particle 'Inna'."
          }
        ]
      },
      {
        letters: "خ - س - ر",
        meaning: "To suffer loss, go bankrupt, deteriorate, fail, waste.",
        derivedWords: [
          {
            arabic: "خُسْرٍ",
            transliteration: "Khusrin",
            meaning: "Loss / Complete bankruptcy",
            verseIndex: "Verse 2",
            morphologyBreakdown: "Noun representing an abstract condition. Compelled into the Genitive state (Jarr) because of the preposition 'Fī', displaying terminal double Kasrahs."
          }
        ]
      },
      {
        letters: "أ - م - ن",
        meaning: "To be secure, safe, trust, believe, harbor faithful conviction.",
        derivedWords: [
          {
            arabic: "ءَامَنُواْ",
            transliteration: "Āmanū",
            meaning: "They believed",
            verseIndex: "Verse 3",
            morphologyBreakdown: "Form IV active past verb in the plural voice. Augmented with the initial lengthening Alif (Aaa) representing the shift of causative action, and suffixed with Waw of plural agency and supporting silent Alif (ـواْ)."
          }
        ]
      },
      {
        letters: "ع - م - ل",
        meaning: "To do, act, fabricate, construct, produce through physical effort.",
        derivedWords: [
          {
            arabic: "عَمِلُواْ",
            transliteration: "ʿAmilū",
            meaning: "They did / performed",
            verseIndex: "Verse 3",
            morphologyBreakdown: "Active past verb in the plural masculine voice. The root letters are appended with the masculine plural pronoun suffix 'Waw' backed by the standard silent helper Alif (ـواْ)."
          }
        ]
      },
      {
        letters: "ص - ل - ح",
        meaning: "To be righteous, wholesome, sound, repaired, optimized, good.",
        derivedWords: [
          {
            arabic: "ٱلصَّٰلِحَٰتِ",
            transliteration: "Al-Ṣāliḥāti",
            meaning: "The wholesome/righteous actions",
            verseIndex: "Verse 3",
            morphologyBreakdown: "Sound Feminine Plural noun. Prefixed with definite 'Al-' (ال). Set in the Accusative state (Nasb) as the direct object of 'ʿAmilū'. Because it is a secure feminine plural, its ending marker is a Kasrah (ـِ) instead of a Fathah!"
          }
        ]
      },
      {
        letters: "و - ص - ي",
        meaning: "To enjoin, bequeath a legacy, recommend with passion, counsel, urge.",
        derivedWords: [
          {
            arabic: "تَوَاصَوْاْ",
            transliteration: "Tawāṣaw",
            meaning: "Ordered / mutually urged each other",
            verseIndex: "Verse 3 (twice)",
            morphologyBreakdown: "Form VI reciprocal past verb in the plural voice indicating mutual counselor interactions. Augmented with reciprocal prefix 'Ta' (تَـ) and secondary lengthening Alif (ـاـ). Ends with plural Waw."
          }
        ]
      },
      {
        letters: "ح - ق - ق",
        meaning: "Truth, reality, justice, duty, absolute fact.",
        derivedWords: [
          {
            arabic: "بِٱلْحَقِّ",
            transliteration: "Bi-l-Ḥaqqi",
            meaning: "With the Truth",
            verseIndex: "Verse 3",
            morphologyBreakdown: "Noun with definite prefix 'Al-' (ال) and prepositional prefix 'Bi' (بِـ). Driven to Genitive state (Jarr) due to the preposition, displaying a Kasrah under its merged double Qaf (Shaddah)."
          }
        ]
      },
      {
        letters: "ص - ب - ر",
        meaning: "To be patient, capture/restrain one's soul, endure with persistence, run a long-range course.",
        derivedWords: [
          {
            arabic: "بِٱلصَّبْرِ",
            transliteration: "Bi-ṣ-Ṣabri",
            meaning: "With patient perseverance",
            verseIndex: "Verse 3",
            morphologyBreakdown: "Noun representing patience, prefixed with preposition 'Bi' (بِـ) and definite 'Al-' (ال) where the Lam is silent (assimilated to Sad). Forced into Genitive (Jarr), ending with a clear Kasrah."
          }
        ]
      }
    ],
    huruf: [
      {
        arabic: "وَ",
        transliteration: "Wa",
        classification: "Particle of Oath (Waw al-Qasam) & Conjunction Particle ('Atf)",
        meaning: "By... (taking oath) / and",
        examples: [
          {
            arabicPhrase: "وَٱلْعَصْرِ",
            translationPhrase: "By the declining time!",
            grammaticalEffect: "In Verse 1, it is used as an Oath device (Qasam) which functions exactly like a prepositional governor, forcing 'Al-ʿAsri' into Genitive."
          },
          {
            arabicPhrase: "وَعَمِلُواْ",
            translationPhrase: "and they did",
            grammaticalEffect: "In Verse 3, it acts as a simple conjunction, linking successive predicates in flawless grammatical parity."
          }
        ]
      },
      {
        arabic: "إِنَّ",
        transliteration: "Inna",
        classification: "Particle of Absolute Emphasis (Harf Tawkeed)",
        meaning: "Indeed, certainly, verily",
        examples: [
          {
            arabicPhrase: "إِنَّ ٱلْإِنسَٰنَ",
            translationPhrase: "Indeed mankind",
            grammaticalEffect: "Acts upon a nominal sentence, dragging the subject 'Al-Insān' down into the Accusative state (Nasb) with a clear Fathah ending."
          }
        ]
      },
      {
        arabic: "لَـ",
        transliteration: "La",
        classification: "Prefix of Corroboration / Combined emphasis (Lam al-Muzahlaqah)",
        meaning: "Surely, definitely, surely is...",
        examples: [
          {
            arabicPhrase: "لَفِي خُسْرٍ",
            translationPhrase: "is surely in loss",
            grammaticalEffect: "A non-governing prefix that hooks onto the predicate of 'Inna' to double and triple the theological emphasis of the statement."
          }
        ]
      },
      {
        arabic: "فِي",
        transliteration: "Fī",
        classification: "Preposition (Harf Jarr)",
        meaning: "In, inside, surrounded by",
        examples: [
          {
            arabicPhrase: "فِي خُسْرٍ",
            translationPhrase: "in loss",
            grammaticalEffect: "Pulls the noun 'Khusrin' into the Genitive state (Jarr), manifesting as terminal double Kasrahs. Visualizes human immersion inside loss."
          }
        ]
      },
      {
        arabic: "إِلَّا",
        transliteration: "Illā",
        classification: "Particle of Exception (Harf Istithnā')",
        meaning: "Unless, except, save",
        examples: [
          {
            arabicPhrase: "إِلَّا ٱلَّذِينَ ءَامَنُواْ",
            translationPhrase: "Except those who believed",
            grammaticalEffect: "Acts as a structural gatekeeper. Excludes the subsequent group from the general ruling of ultimate loss declared previously."
          }
        ]
      }
    ]
  }
];
