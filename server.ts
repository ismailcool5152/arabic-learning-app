/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { findOfflineFallback, generateDynamicOfflineFallback } from "./src/offlineData";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI SDK server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint to analyze an Arabic word
app.post("/api/analyze-word", async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { word } = req.body;
    if (!word || typeof word !== "string" || word.trim() === "") {
      return res.status(400).json({ error: "Word parameter is required and must be a non-empty string." });
    }

    const trimmedWord = word.trim();

    if (!apiKey) {
      const offlineMatch = findOfflineFallback(trimmedWord);
      if (offlineMatch) {
        console.log(`[Offline Initial] Serving profile for "${trimmedWord}" without API key.`);
        return res.json({ ...offlineMatch, isOfflineFallback: true });
      }
      return res.status(500).json({ 
        error: "GEMINI_API_KEY is not configured on the server. Please add it to your settings or secrets panel." 
      });
    }

    // Prepare system instructions for root analysis
    const queryPrompt = `
Analyze the Quranic Arabic word "${trimmedWord}".
The user might provided the word in absolute Arabic script (e.g., يَكْتُبُ, ٱلْحَمْدُ, مُسْلِمُونَ) or in popular English transliteration (e.g., 'yaktub', 'al-hamdu', 'muslim', 'qala', 'sajada').

Perform a thorough lexicographical and Quranic morphology (Sarf / Wave morphology) analysis:
1. Identify the search word in Arabic script with complete and elegant harakat (marks) and compile its English transliteration.
2. Determine the three-letter (triliteral) or four-letter (quadriliteral) arabic Root letters (e.g., ك - ت - ب) and their exact capitals transliteration (e.g., K-T-B).
3. Provide the root's core semantic/general meaning in English.
4. Elaborate on the specific morphology Form/Type of the searched word (e.g. "Form I Active Present Verb", "Sound Plural Masculine Noun").
5. Determine the classical Arabic parts-of-speech category. It MUST be classified of these three types: 'Fi'l' (for verbs), 'Ism' (for nouns, pronouns, adjectives, verbal nouns, participles), or 'Harf' (for particles, prepositions, conjunctions, connectors).
6. State the exact template pattern (Wazan) in Arabic script (e.g. فَاعِل, مَفْعُول, اِسْتَفْعَلَ) and its conventional transliteration (e.g. Fā'il, Maf'ūl, Istaf'ala).
7. Detail what the pattern actually does to the root (e.g., transforming an action into a doer, seeking/requesting, passive receiver, interactive reciprocity).
8. Write a detailed, clear, and highly educative derivation explanation showing how the root transformed into this search word via vowelling patterns, vowel adjustments, prefixes, infixes, or standard Arabic morpho-templates (called Wazan).
9. Find 2 or 3 highly famous occurrences in the Holy Quran where this word or a closely related word appears. Provide the Surah name (e.g., Al-Baqarah), the exact Verse coordinate (e.g., 2:256), the beautifully formatted Arabic script with full harakat, an accurate English translation, and a small context-teaching snippet explaining why it was used there.
10. Compile a list of 5 to 6 related words derived from this same root. For each, give the correct Arabic spelling, transliteration, English meaning, and its morphology type (e.g., Form II Verb or Noun of Place/Time).

Provide the output in a strict JSON format matching the schema instructions.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: queryPrompt,
      config: {
        systemInstruction: "You are an expert scholar of Quranic Arabic, Semitic linguistics, and classical Arabic morphology (Sarf). You help users understand roots, conjugations, morpho-derivations, and semantic word connections in the Holy Quran.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { 
              type: Type.STRING,
              description: "The original searched word normalized."
            },
            wordArabic: { 
              type: Type.STRING,
              description: "The correct Arabic rendering with full harakat/vocalization. (e.g., يَكْتُبُ)"
            },
            wordTransliteration: { 
              type: Type.STRING,
              description: "The transliteration of the Arabic word. (e.g., yaktubu)"
            },
            meaning: { 
              type: Type.STRING,
              description: "Precise English meaning of the searched word."
            },
            root: { 
              type: Type.STRING,
              description: "The Arabic Root letters separated by spaces. (e.g., ك - ت - ب)"
            },
            rootTransliteration: { 
              type: Type.STRING,
              description: "The Transliteration of Root letters. (e.g., K-T-B)"
            },
            rootMeaning: { 
              type: Type.STRING,
              description: "The central concept or general meaning of the root letters."
            },
            derivationExplanation: { 
              type: Type.STRING,
              description: "An educational step-by-step description of how the search word stems from the root (infixes, prefixes, patterns, triggers)."
            },
            morphologyForm: { 
              type: Type.STRING,
              description: "The grammatical pattern/category of the word (e.g., Active Participle, Form VIII Verb, Noun of Instrument)."
            },
            wordType: {
              type: Type.STRING,
              description: "The classical Arabic parts-of-speech category. It MUST be strictly one of: 'Fi'l', 'Ism', or 'Harf'."
            },
            wazan: {
              type: Type.STRING,
              description: "The template pattern (Wazan) templated using f-'-l (ف-ع-ل) representing this word shape (e.g., فَاعِل, مَفْعُول, يَفْتَعِل, اِسْتَفْعَلَ)."
            },
            wazanTransliteration: {
              type: Type.STRING,
              description: "The standard transliteration of the pattern template (e.g., Fā'il, Maf'ūl, Istaf'ala, Yafta'ilu)."
            },
            wazanMeaning: {
              type: Type.STRING,
              description: "The high-level linguistic effect/meaning category of the pattern (e.g., 'Active Participle / True Doer', 'Noun of Place', 'Form X: Seeking/Requesting')."
            },
            wazanEffect: {
              type: Type.STRING,
              description: "Detail of what applying this pattern actually does to the root's base meaning (e.g. converting action to active agent, intensifies the action, turns a verb into a location/noun of place)."
            },
            quranicOccurrences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  surah: { type: Type.STRING, description: "Surah Name (e.g., Al-Fatihah)" },
                  verseNum: { type: Type.STRING, description: "Verse ID (e.g., 1:2)" },
                  arabic: { type: Type.STRING, description: "Full Arabic verse text containing the word." },
                  translation: { type: Type.STRING, description: "Accurate English translation of the verse." },
                  explanation: { type: Type.STRING, description: "How the word manifests in this verse and its memorization trick." }
                },
                required: ["surah", "verseNum", "arabic", "translation", "explanation"]
              }
            },
            relatedWords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING, description: "Derived Arabic word with harakat." },
                  transliteration: { type: Type.STRING, description: "Transliteration." },
                  meaning: { type: Type.STRING, description: "English meaning." },
                  morphology: { type: Type.STRING, description: "Pattern/Form category with exact arabic Wazan if applicable (e.g., Form II Command Verb, Active Noun فَاعِل)." },
                  quranicExample: { type: Type.STRING, description: "Optional brief example of where it appears or a short note." }
                },
                required: ["word", "transliteration", "meaning", "morphology"]
              }
            }
          },
          required: [
            "word",
            "wordArabic",
            "wordTransliteration",
            "meaning",
            "root",
            "rootTransliteration",
            "rootMeaning",
            "derivationExplanation",
            "morphologyForm",
            "wordType",
            "wazan",
            "wazanTransliteration",
            "wazanMeaning",
            "wazanEffect",
            "quranicOccurrences",
            "relatedWords"
          ]
        }
      }
    });

    const textContent = response.text || "{}";
    const analysisResult = JSON.parse(textContent);

    res.json(analysisResult);
  } catch (error: any) {
    const trimmedWord = (req.body && typeof req.body.word === "string") ? req.body.word.trim() : "";
    
    // Check if it's a rate limit error to avoid scaring the user with big stack traces
    if (error?.status === 429 || error?.message?.includes("exceeded your current quota") || error?.status === "RESOURCE_EXHAUSTED") {
        console.log(`[Offline Mode] Gemini API rate limit reached. Activating resident offline backups for "${trimmedWord}".`);
    } else {
        console.warn(`[Offline Mode] API unavailable, activating resident offline backups for "${trimmedWord}". Reason:`, error.message || "Unknown error");
    }
    
    try {
      // Find suitable precompiled root analysis profiles
      const offlineMatch = findOfflineFallback(trimmedWord);
      if (offlineMatch) {
        console.log(`[Offline Fallback] Serving profile for "${trimmedWord}" from precompiled backups.`);
        return res.json({ ...offlineMatch, isOfflineFallback: true });
      }
      
      // Synthesize dynamic estimation schema
      console.log(`[Offline Dynamic] Generating morphological shape estimation for "${trimmedWord}".`);
      const dynamicFallback = generateDynamicOfflineFallback(trimmedWord);
      return res.json({ ...dynamicFallback, isOfflineFallback: true });
    } catch (fallbackError) {
      console.error("Critical double-fault in local backup system:", fallbackError);
      res.status(500).json({ 
        error: "Failed to analyze the word due to an internal server or API error.",
        details: error.message || error 
      });
    }
  }
});

// Setup Vite Dev server or Serve Static files based on NODE_ENV environment variable
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
