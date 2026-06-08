export const functionalDocumentation = `
# Quranic Arabic Engine — Functional Documentation

Welcome to the **Functional Specification & User Manual** of the Quranic Arabic Engine. This workbook contains a detailed, comprehensive guide to all functional aspects of the application, designed to guide students from raw Arabic literacy to advanced morphological (Sarf) and rhetorical (Balāghah) expertise.

---

## 1. Executive Product Vision
The **Quranic Arabic Engine** is a specialized, multi-module educational workstation designed to help researchers, students, and linguists unlock the structural elegance of classical Quranic Arabic. 

Classically, Arabic is not learned through linear vocabulary lists but through a non-linear, multi-dimensional **root and pattern system**. By understanding the consonant roots (usually three consonants/letters, and occasionally four) and standard morphosemantic templates (*Awzān*), students can instantly deduce the meaning of thousands of derived nouns, verbs, active participle agents, passive participle entities, place nouns, and intensive descriptors. This application builds a bridge between classical scholastic methods and visual interactive interfaces.

---

## 2. Core Functional Modules & User Interfaces

The platform is divided into three thematic learning divisions, containing ten integrated modules:

### A. Foundational Literacy (Learn Division)
1. **Alphabet Mastery (Huruful Hija):**
   - **Functional Spec:** A graphical table mapping the 28 core Arabic characters, displaying their independent, initial, medial, and final structural variations.
   - **Articulatory Points (Makhārij):** Details the anatomical physical space of pronunciation (oral cavity, throat, tongue, lips, nasal cavity) with phonetic labels.
   - **Acoustic Trait Profiles (Sifāt):** Highlights phonetic qualities like *Hams* (whispering), *Jahr* (vocal volume), *Shiddah* (strength), and *Qalqalah* (echoing bounce) for precise recital.

2. **Grammar Foundation (Arabic Basics):**
   - **Functional Spec:** Interactive cheat sheets detailing the three fundamental words divisions taught by traditional grammarians (*Ism* - nouns, pronouns, adjective; *Fi'l* - verbs; *Harf* - particles).
   - **Case Inflections (I'rab Intro):** Visual guides explaining the nominative (*Raf'*), accusative (*Nasb*), and genitive (*Jarr*) states, complete with common examples.

3. **Particle Library (Huruf Codex):**
   - **Functional Spec:** Explains non-consonant grammatical structures (Harf) such as prepositions (*Huruf al-Jarr*), emphasizing particles (*Inna* and sisters), vocatives, relative pronouns, and conjunctives that act as structural cement inside Quranic sentences.

---

### B. Morphological Exploration (Explore Division)

4. **Patterns Codex & Morphological Database (Awzān):**
   - **Functional Spec:** Displays the ten classical verb scales (Form I to Form X).
   - **Vocalic Grids:** Visualizes the vowel transformations across past tense (*Māḍī*), present tense (*Muḍāri'*), active participles (*Ism al-Fā'il*), and verbal nouns (*Maṣdar*).
   - **Pattern Search:** Demonstrates how semantic intent shifts; for example, going from Form I (Raw Action) to Form II (Intensification) or Form X (Seeking/Requesting).

5. **Root Dictionary & Lexicon (Quranic Lexicon):**
   - **Functional Spec:** The primary search dashboard. Users can type an Arabic root or word either using their physical keyboard or a custom **On-Screen Arabic Keyboard**.
   - **Dynamic Root Extraction:** Translates the search phrase into its morphological root-consonants and fetches detailed structural details, occurrences in the Quran, and derivational histories.

6. **Interactive Sarf Mind Map (Mind Map Canvas):**
   - **Functional Spec:** A 2D canvas displaying the morphological tree of a given Arabic root.
   - **Kinematic Visualization:** Draws the root as the central core node, branch-linking to morphological families (e.g. verbs, participles, nouns). Clicking on nodes reveals their grammatical properties, literary translation, and specific structural pattern (Wazan).

7. **500 High-Frequency Words Codex:**
   - **Functional Spec:** A curated database compiling the words that represent over 80% of the Quranic text. Filterable by frequency, alphabetical sorting, or parts of speech.

8. **Surah-by-Surah Vocabulary Maps:**
   - **Functional Spec:** Compiles interactive vocabulary profiles for any chapter in the Quran. It automatically lists every unique word in that Surah, calculates its exact recurrence frequency, and provides deep grammatical inflection analysis for each term.

---

### C. Advanced Scholastic Applications (Practice & Advanced Division)

9. **Deconstructive Verse breakdown:**
   - **Functional Spec:** Users can enter any Surah and Verse number (e.g., 2:153 or 96:1-5) and click \"Deconstruct\".
   - **Color-Coded Morphology:** Breaks up the verse into individual word tokens. It color-codes them (Ism = Blue/Indigo, Fi'l = Green, Harf = Red/Orange) and parses the root, morphology Form, transliteration, and linguistic definition.

10. **Misunderstood Roots Clinic:**
    - **Functional Spec:** Explores controversial, heavily scrutinized classical Arabic roots that are frequently oversimplified or mistranslated in modern English textbooks.
    - **Philosophical Comparison:** Contrasts literal modern translations with classical lexicons like *Lisān al-\`Arab* and *Tāj al-\`Arūs*, shedding light on semantic depth.

11. **Spaced Repetition System (SRS) Quiz:**
    - **Functional Spec:** A memory mastery engine using flashcards. Users categorize words based on recall ease, automatically scheduling the next quiz encounter to build permanent memory pathways.

12. **Asma Al-Husna Visualizer:**
    - **Functional Spec:** Focuses on the linguistic roots of the 99 Beautiful Names of Allah, tracking their grammatical scales and showing how God's attributes derive from classical physical desert root-metaphors.

---

## 3. Active Offline Fallback Capabilities

To resolve server outages, credential omissions, or rate limit blocks (such as the Gemini API 429 quota exhaustion), the application incorporates a **Resident Morpheme Database**. 

Whenever an API request fails, the application automatically pivots to offline fallback caching. The UI features a distinct yellow notification badge detailing **\"Resident Lexicon Mode Active\"** with high-quality pre-packaged morphological breakdowns for famous roots (e.g., *K-T-B*, *'A-L-M*, *S-J-D*, *R-H-M*), making the application extremely reliable and functional under strict networks or offline environments.
`;

export const technicalDocumentation = `
# Quranic Arabic Engine — Technical Documentation

This guide provides a comprehensive breakdown of the under-the-hood technical engine, systems architecture, state management patterns, and REST endpoints.

---

## 1. Full-Stack Systems Architecture

The application is deployed as a single containerized system in Cloud Run, powered by a full-stack Node/Express backend proxying to a React Single Page Application (SPA).

\`\`\`
                                  [ USER BROWSER ]
                                         │  (React 18 SPA client-side router)
                                         ▼
                            [ NGINX REVERSE PROXY:3000 ]
                                         │  (Port 3000 ingress)
                                         ▼
                             [ EXPRESS NODE SERVER ]
                      ┌──────────────────┴──────────────────┐
                      ▼                                     ▼
         [ Gemini Pro/Flash API ]                 [ Local JSON Caches ]
       (AI-powered Morphological Gen)              (Offline Fallback Data)
\`\`\`

### A. Front-End Architecture (Vite + React)
- **Framework:** React 18 running on Vite, utilising ES modules (ESM). Standard Hot Module Replacement (HMR) is bypassed in AI Studio using \`DISABLE_HMR=true\` to optimize sequential file compilation stability.
- **Styling:** Fully declared utilizing utility classes of **Tailwind CSS**. Theme modifications are bound to the stateful \`LayoutTheme\` ('emerald', 'cosmic', 'parchment').
- **Vector Assets:** Completely driven by pure-SVG vector drawings from \`lucide-react\` to avoid heavy asset loads and page flickering.

### B. Back-End Server (Express + esbuild)
- **TypeScript Runner:** Direct execution in local development via \`tsx server.ts\`.
- **Production Bundler:** To prevent ES Module resolution issues, the production deployment script compiles \`server.ts\` and all relative imports into a single, bundled CommonJS output file at \`dist/server.cjs\` using esbuild.
- **Static Assets:** Serves compiled Vite assets from \`dist/\` using \`express.static\` and fallback redirection for SPA routing.

---

## 2. API Schema & Endpoints Dictionary

The backend server exposes strict, stateless REST endpoints designed to return pure, validateable JSON payloads. Below are the core API definitions:

### 1. Word Analysis Endpoint
- **URL:** \`/api/analyze-word\`
- **Method:** \`POST\`
- **Request Body:**
\`\`\`json
{
  "word": "كِتَاب",
  "customApiKey": "AIzaSy..." // Optional user-override key
}
\`\`\`
- **Successful Response (Schema matching \`WordAnalysis\`):**
\`\`\`json
{
  "word": "kitab",
  "wordArabic": "كِتَاب",
  "wordTransliteration": "kitāb",
  "meaning": "Book, letter, or written document",
  "root": "ك - ت - ب",
  "rootTransliteration": "K-T-B",
  "rootMeaning": "To write, record, dictate, prescribe",
  "derivationExplanation": "A singular noun derived from Form I active root via added vowel extensions",
  "morphologyForm": "Noun / Singular / Masculine",
  "wordType": "Ism",
  "wazan": "فِعَال",
  "wazanTransliteration": "Fi'āl",
  "wazanMeaning": "Syntactic container denoting physical instrument or active structural compilation",
  "totalOccurrences": 261,
  "quranicOccurrences": [],
  "relatedWords": []
}
\`\`\`

---

### 2. Multi-Word Translation Endpoint
- **URL:** \`/api/translate-root-words\`
- **Method:** \`POST\`
- **Request Body:**
\`\`\`json
{
  "root": "ك كتب",
  "words": ["كتاب", "كاتب", "مكتوب"]
}
\`\`\`
- **Response:** Translates related words derived from the specified root into semantic meaning maps.

---

### 3. Verse Breakdown & Morphology Endpoint
- **URL:** \`/api/breakdown-verse\`
- **Method:** \`POST\`
- **Request Body:**
\`\`\`json
{
  "surah": "96",
  "verse": "1"
}
\`\`\`
- **Response:** Generates sequential list of tokens detailing word morphology, part of speech color boundaries, and transliterations.

---

### 4. Surah Vocab Compiler Endpoint
- **URL:** \`/api/compile-surah-vocab-ai\`
- **Method:** \`POST\`
- **Request Body:**
\`\`sn
{
  "surahNum": "112",
  "surahName": "Al-Ikhlas",
  "totalVerses": "4"
}
\`\`\`
- **Response:** Analyzes each verse, extracts all unique vocal, calculates frequency, compiles explanations.

---

## 3. Gemini Orchestration & Dual-Model Configuration

To address the Gemini API free-tier limit of 15 requests per minute, the server utilizes a **dual-model priority system**:

1. **Default Model:** \`gemini-2.5-flash\` is used for all heavy, computational, structural and high-volume operations (e.g. batch vocabulary analysis, verse breakdowns, rhetorical studies). This model features excellent performance and high token throughput.
2. **Grammar Case Fallback:** Custom short lexical tasks use a lightweight system configured with \`gemini-2.5-flash\`.
3. **Structured Responses:** Every model invocation is wrapped with a strict \`responseMimeType: \"application/json\"\` and utilizes a specific **Structured Schema** detailing the strict types expected. This removes parsing instability.

---

## 4. On-Device State & Local Caching Strategy

To ensure absolute robustness, the front-end features multiple localized client cache layers:

- **Saved Maps Repository:** Extends on-device \`localStorage\` to store saved mind maps by root key. This allows students to load their custom canvas nodes even with zero backend connectivity.
- **SRS Interval Calculator:** Implements standard SuperMemo SM-2 algorithms to evaluate review intervals. High intervals are calculated using simple state properties:
\`\`\`typescript
const calculateInterval = (repetition: number, easiness: number) => {
  if (repetition === 0) return 1;
  if (repetition === 1) return 6;
  return Math.round((repetition - 1) * easiness);
};
\`\`\`
- **Resident Lexicons:** A static compilation inside \`src/data/\` serves pre-parsed vocab models, so any user without an API key or running into 429 quota blockages still receives instantaneous, realistic academic results.

---

## 5. Visual Rendering Architecture (SVG Canvas)

The interactive Mind Map uses a **custom geometric SVG renderer** rather than basic canvas libraries. This ensures complete responsive scaling, sharp crisp rendering on high-DPI screens, and native CSS click-handlers:

- **Mathematical Plotting:** Positions derived word groups into balanced **polar vectors** originating from the core root node:
\`\`\`typescript
const x = centerX + radius * Math.cos(angleInRadians);
const y = centerY + radius * Math.sin(angleInRadians);
\`\`\`
- **Layout Adapters:** Tracks canvas resizing in the window using standard React refs and a debounced window event listener, preventing stretched visual coordinate mismatches.
- **Connection Links:** Renders connecting links as beautiful Bezier curves (\`<path d=\"M ... C ...\" />\`) which are responsive and lightweight.
`;
