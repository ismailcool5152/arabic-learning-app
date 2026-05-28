/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface QuranicVerse {
  surah: string;
  verseNum: string;
  arabic: string;
  translation: string;
  explanation: string;
}

export interface RelatedWord {
  word: string;
  transliteration: string;
  meaning: string;
  morphology: string; // e.g., "Form II (Active Voice)", "Noun of Place (Maktab)"
  quranicExample?: string; // Optional verse excerpt or example
}

export interface WordAnalysis {
  word: string;
  wordArabic: string;
  wordTransliteration: string;
  meaning: string;
  root: string; // e.g., "ك - ت - ب"
  rootTransliteration: string; // e.g., "K-T-B"
  rootMeaning: string; // e.g., "To write, record, dictate"
  derivationExplanation: string; // e.g., "Derived via Form I active verb pattern by adding vowels..."
  morphologyForm: string; // e.g., "Form I Verb / Noun / Plural Noun"
  wordType: 'Fi\'l' | 'Ism' | 'Harf'; // The classic Arabic linguistic group: Fi'l (Verb), Ism (Noun), Harf (Particle)
  wazan?: string; // The Arabic pattern (Wazan) in Arabic script (e.g., فَاعِل, مَفْعُول, يَفْتَعِل)
  wazanTransliteration?: string; // The Sarf transliteration of the pattern (e.g., Fā'il, Maf'ūl, Yafta'ilu)
  wazanMeaning?: string; // The syntactic/semantic effect of the pattern (e.g., "Active Participle / One who performs the work")
  wazanEffect?: string; // Comprehensive description of what this pattern does to the core root's meaning
  quranicOccurrences: QuranicVerse[];
  relatedWords: RelatedWord[];
  isOfflineFallback?: boolean; // Indicates if the server loaded precompiled/dynamic fallback because of key or quota issues
}

export interface MindMapNode {
  id: string;
  label: string;
  arabicLabel?: string;
  type: 'root' | 'query' | 'family' | 'verse' | 'explanation' | 'category' | 'word';
  description: string;
  details?: string;
  children?: MindMapNode[];
}

export interface SavedWordMap {
  id: string;
  searchedWord: string;
  savedAt: string;
  analysis: WordAnalysis;
}

export interface RecentSearch {
  id: string;
  word: string;
  timestamp: string;
}

export type LayoutTheme = 'emerald' | 'cosmic' | 'parchment';
export type LayoutMode = 'vertical' | 'horizontal' | 'mix';


