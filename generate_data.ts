import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs/promises";
import path from "path";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

interface SurahConfig {
  number: number;
  name: string;
  totalVerses: number;
}

const SURAHS: SurahConfig[] = [
  { number: 114, name: "An-Nas", totalVerses: 6 },
  { number: 113, name: "Al-Falaq", totalVerses: 5 },
  { number: 112, name: "Al-Ikhlas", totalVerses: 4 },
  { number: 111, name: "Al-Masad", totalVerses: 5 },
  { number: 110, name: "An-Nasr", totalVerses: 3 },
  { number: 109, name: "Al-Kafirun", totalVerses: 6 },
  { number: 108, name: "Al-Kawthar", totalVerses: 3 },
  { number: 107, name: "Al-Ma'un", totalVerses: 7 },
  { number: 106, name: "Quraysh", totalVerses: 4 },
  { number: 105, name: "Al-Fil", totalVerses: 5 },
  { number: 104, name: "Al-Humazah", totalVerses: 9 },
  { number: 103, name: "Al-Asr", totalVerses: 3 },
  { number: 102, name: "At-Takathur", totalVerses: 8 },
  { number: 101, name: "Al-Qari'ah", totalVerses: 11 },
  { number: 100, name: "Al-Adiyat", totalVerses: 11 }
];

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateSurahWithModel(surah: SurahConfig, modelToUse: string): Promise<boolean> {
  console.log(`[REQUEST] Using model: ${modelToUse} for Surah ${surah.number} (${surah.name})`);

  const queryPrompt = `
Generate a complete, extremely high-scholarship academic word-by-word morphological and syntactic analysis of the entire Surah: "${surah.name}" (Surah Number ${surah.number}), which has exactly ${surah.totalVerses} verses from start to end (all of them).

Analyze every single verse from verse 1 to verse ${surah.totalVerses} sequentially. Put them as items inside the "verses" array in their exact reading order.

For each verse in the array:
1. Provide "verseNumber" as a string (e.g., "1").
2. Provide "fullVerseArabic" with complete, classical Uthmani diacritics/harakat.
3. Provide "fullVerseTranslation" with a clear, accurate, traditional academic English translation.
4. Provide "words" as a sequential array of word tokens in the exact order of reading.

For each word token:
1. "word": The word in Arabic with complete classical harakat/diacritics (e.g. "ٱلْحَمْدُ", "أَعُوذُ", "قُلْ" or attention/vocatives like "يَـٰٓأَيُّهَا").
2. "transliteration": Standard phonetic English transliteration with macrons/accents representing classic phonetics (e.g. "Ar-Raḥmān", "al-falaq", "qul", "yaayyuhā").
3. "isIsmFail": Set to true if it matches a Form I active participle pattern (Fā'il) or derived form active participle (e.g. starting with Mu- and ending with kasrah on second-to-last root letter, like Al-Muṣallīn). Set to false otherwise.
4. "isHarf": Set to true if it is a grammatical particle/preposition/conjunction/vocative/emphasis particle (e.g., "bi" of بِرَبِّ, "wa", "lam", etc.). Otherwise set to false.
5. "wordType": Categorized as "Ism", "Fi'l", or "Harf" (MUST capitalize first letter).
6. "root": The classical 3-letter or 4-letter root of the word in Arabic with spaces (e.g., "ق و ل" or "ع و ذ" or "ر ب ب"). If the word is a particle, pronoun, conjunction, focus/attention word, or relative word without a lexical root, write "None".
7. "meaning": The context-specific English meaning of this specific word token.
8. "explanation": A deep, scholarship-level grammatical parsed explanation of the word's morphology and syntactic role within the verse (I'rab, tense, gender, state, form/pattern/wazn). NEVER write brief, lazy, or empty explanations.

Ensure the output is valid, structured JSON representing the specified schema.
`;

  const response = await ai.models.generateContent({
    model: modelToUse,
    contents: queryPrompt,
    config: {
      systemInstruction: "You are an elite, world-class professor in classical Quranic Linguistics, Sarf (morphology), Balaghah (eloquence), and Arabic grammar (I'rab/parsing). You provide extremely deep, high-fidelity, and sequential word-by-word morphological segmentations and scholastic analyses of Quranic verses into JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          surahName: { type: Type.STRING },
          surahNumber: { type: Type.INTEGER },
          verses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                verseNumber: { type: Type.STRING },
                fullVerseArabic: { type: Type.STRING },
                fullVerseTranslation: { type: Type.STRING },
                words: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      word: { type: Type.STRING },
                      transliteration: { type: Type.STRING },
                      isIsmFail: { type: Type.BOOLEAN },
                      isHarf: { type: Type.BOOLEAN },
                      wordType: { type: Type.STRING, description: "Categorized as 'Ism', 'Fi'l', or 'Harf'" },
                      root: { type: Type.STRING, description: "3 or 4 letter Arabic root (e.g. 'س - ج - د') or 'None'" },
                      meaning: { type: Type.STRING, description: "English context meaning" },
                      explanation: { type: Type.STRING, description: "Detailed, academic morphological and syntactic explanation of the word's form, grammatical role in the clause/verse, and I'rab inflection state." }
                    },
                    required: ["word", "transliteration", "isIsmFail", "isHarf", "wordType", "root", "meaning", "explanation"]
                  }
                }
              },
              required: ["verseNumber", "fullVerseArabic", "fullVerseTranslation", "words"]
            }
          }
        },
        required: ["surahName", "surahNumber", "verses"]
      }
    }
  });

  const jsonText = response.text;
  if (!jsonText) {
    throw new Error(`Empty response returned from Gemini for Surah ${surah.number}`);
  }

  const parsed = JSON.parse(jsonText);
  if (!parsed.verses || !Array.isArray(parsed.verses) || parsed.verses.length === 0) {
    throw new Error(`Parsed JSON does not contain valid verses array for Surah ${surah.number}`);
  }

  // Convert verses array to the key-value dictionary expected by the server
  const versesMap: Record<string, any> = {};
  for (const v of parsed.verses) {
    if (v && v.verseNumber) {
      versesMap[v.verseNumber.toString()] = {
        verseNumber: v.verseNumber.toString(),
        fullVerseArabic: v.fullVerseArabic,
        fullVerseTranslation: v.fullVerseTranslation,
        words: v.words
      };
    }
  }

  const outputObject = {
    surahName: parsed.surahName || surah.name,
    surahNumber: parsed.surahNumber || surah.number,
    verses: versesMap
  };

  const outputDir = path.join(process.cwd(), "src", "data", "quran");
  await fs.mkdir(outputDir, { recursive: true });
  
  const outputPath = path.join(outputDir, `surah_${surah.number}.json`);
  await fs.writeFile(outputPath, JSON.stringify(outputObject, null, 2), "utf-8");
  
  console.log(`[SUCCESS] Wrote Surah ${surah.number} (${surah.name}) to ${outputPath} with ${Object.keys(versesMap).length} verses.`);
  return true;
}

async function generateSurah(surah: SurahConfig) {
  console.log(`\n==================================================`);
  console.log(`[START] Generating Chapter ${surah.number}: Surah ${surah.name} (${surah.totalVerses} Verses)`);
  console.log(`==================================================`);

  const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const modelToUse of models) {
    let attempt = 1;
    const maxAttempts = 2;
    while (attempt <= maxAttempts) {
      try {
        const success = await generateSurahWithModel(surah, modelToUse);
        if (success) return true;
      } catch (err: any) {
        lastError = err;
        console.warn(`[WARN] Model ${modelToUse} at attempt ${attempt} failed: ${err.message}`);
        attempt++;
        if (attempt <= maxAttempts) {
          const waitSec = attempt * 6;
          console.log(`Waiting ${waitSec} seconds before retrying...`);
          await sleep(waitSec * 1000);
        }
      }
    }
  }

  throw lastError || new Error(`All attempts and models failed for Surah ${surah.number}`);
}

async function run() {
  console.log("Starting bulk offline database generation (robust edition)...");
  let successCount = 0;
  let lastStop: number | null = null;

  // Read range arguments if specified
  const args = process.argv.slice(2);
  const startSurah = args[0] ? parseInt(args[0]) : null;
  const endSurah = args[1] ? parseInt(args[1]) : null;

  let surahsToProcess = SURAHS;
  if (startSurah !== null && endSurah !== null) {
    surahsToProcess = SURAHS.filter(s => s.number <= startSurah && s.number >= endSurah);
    console.log(`Filtering surahs to range ${startSurah} down to ${endSurah}. Total to process: ${surahsToProcess.length}`);
  } else if (startSurah !== null) {
    surahsToProcess = SURAHS.filter(s => s.number === startSurah);
    console.log(`Filtering to single surah ${startSurah}.`);
  }

  for (const surah of surahsToProcess) {
    try {
      await generateSurah(surah);
      successCount++;
      // Standard delay to be a good API citizen
      await sleep(1500);
    } catch (err: any) {
      lastStop = surah.number;
      console.error(`\n[FATAL ERROR] Giving up on Surah ${surah.number} due to consecutive failures across all models. Error: ${err.message}`);
      break;
    }
  }

  console.log(`\n==================================================`);
  console.log(`Bulk generation completed! Successfully generated ${successCount} surahs.`);
  if (lastStop !== null) {
    console.log(`Execution was stopped at Surah number: ${lastStop}`);
  } else {
    console.log(`All configured chapters completed successfully!`);
  }
  console.log(`==================================================`);
}

run();
