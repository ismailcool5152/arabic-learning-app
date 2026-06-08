// src/data/featureManifest.ts

export interface AppFeature {
  id: string;
  name: string;
  category: "Core" | "Learning" | "Exploration" | "Practice";
  description: string;
  version: string;
  tested: boolean;
  notes?: string;
}

export const CURRENT_APP_VERSION = "v1.2.2";

export const FEATURE_MANIFEST: AppFeature[] = [
  // Core Platform features
  {
    id: "app_state_persistence",
    name: "Centralized App State Persistence Engine",
    category: "Core",
    description: "Multi-device unified state synchronization using client-side appStorage fallbacks and server APIs with deferred updates.",
    version: "v1.2.0",
    tested: true,
    notes: "Part of the v1.2.0 migration to replace raw localStorage with structured persistence."
  },
  {
    id: "gcs_cloud_sync",
    name: "GCS Bidirectional Storage Sync",
    category: "Core",
    description: "Startup remote bucket download & deferred local sync to Google Cloud Storage with permission handling.",
    version: "v1.2.0",
    tested: true,
    notes: "Includes auto-disable failsafes when credentials are restricted or read-only."
  },
  {
    id: "translation_caching",
    name: "Gemini Translation & AI Cache Registry",
    category: "Core",
    description: "Persistent cache layer to save and read AI-translated verse breakdowns and root derivations, avoiding redundant API calls.",
    version: "v1.2.0",
    tested: true
  },
  {
    id: "dynamic_theming",
    name: "Elegant Dynamic Themes",
    category: "Core",
    description: "Full viewport multi-theme rendering of UI components supporting Emerald, cosmic-midnight, and tactile Parchment color schemes.",
    version: "v1.1.0",
    tested: true
  },
  
  // Learning modules
  {
    id: "hija_pronunciation",
    name: "Hurūf-ul-Hijā Phonology (Makhārij)",
    category: "Learning",
    description: "Interactive chart of Arabic letters with illustrated makhraj details, phonetic parameters, and standard vocal audio playbacks.",
    version: "v1.0.0",
    tested: true
  },
  {
    id: "tajweed_drills",
    name: "Tajweed Interactive Rules of Sākinah",
    category: "Learning",
    description: "Phonological rules drills covering Nun/Meem Sakinah, Mudood (elongation), and Qalqalah vibration with micro-level audio playbacks.",
    version: "v1.1.0",
    tested: true
  },
  {
    id: "basics_grammar",
    name: "Grammar Basics Segmenter",
    category: "Learning",
    description: "Explores the three divisions of classical Arabic words: Noun (Ism), Verb (Fi'l), and Particle (Harf) with structural color maps.",
    version: "v1.0.0",
    tested: true
  },
  {
    id: "balaghah_dev",
    name: "Balāghah Rhetorical Tasters",
    category: "Learning",
    description: "Interactive dashboard introducing rhetorical devices, style shifts, emphasis markers, and visual figurative structures.",
    version: "v1.1.0",
    tested: true
  },

  // Exploration modules
  {
    id: "root_decoder",
    name: "Root-to-Words Semantic Generator",
    category: "Exploration",
    description: "Asynchronous root dictionary with context generator lookup, powered by robust offline fallbacks and live Gemini connections.",
    version: "v1.1.0",
    tested: true
  },
  {
    id: "ayat_segmenter",
    name: "Word-by-word Ayat Segmenter",
    category: "Exploration",
    description: "Displays complete word parsing, grammatical categorization, and morphological patterns for landmark Quranic verses.",
    version: "v1.2.0",
    tested: true,
    notes: "Upgraded for local translation pre-seed caches in v1.2.0."
  },
  {
    id: "surah_vocabulary_maps",
    name: "Surah Roots Vocabulary Maps",
    category: "Exploration",
    description: "Pre-reading root word distribution matrices, letting students conquer lexical hurdles on a surah-by-surah basis.",
    version: "v1.1.0",
    tested: true
  },
  {
    id: "misunderstood_roots",
    name: "Misunderstood Roots Lexicons",
    category: "Exploration",
    description: "Detailed analysis of theological roots often obscured or mistranslated in standard translations.",
    version: "v1.2.0",
    tested: true,
    notes: "Provides warning indicators on semantic translation drift."
  },

  // Practice modules
  {
    id: "spaced_repetition",
    name: "SRS Spaced Repetition Engine",
    category: "Practice",
    description: "Custom SuperMemo-like algorithm tracking flashcards across learning slots, queues, and retention stages.",
    version: "v1.2.0",
    tested: true,
    notes: "Connected to appStorage unified sync."
  },
  {
    id: "core_vocab_codex",
    name: "500 Core Words Codex",
    category: "Practice",
    description: "A comprehensive lookup table of the most frequently occurring Arabic terms, complete with occurrence counts.",
    version: "v1.0.0",
    tested: true
  }
];
