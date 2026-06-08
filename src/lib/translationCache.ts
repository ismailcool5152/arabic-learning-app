import { appStorage } from "./appStorage";

export interface CachedTranslation {
  rootMeaning: string;
  rootStory?: string;
  translations: Record<string, { meaning: string; exists: boolean }>;
  timestamp: number;
}

const CACHE_KEY = "quranic_ai_translations";

export const saveTranslationToCache = (root: string, rootMeaning: string, rootStory: string | undefined, translations: Record<string, { meaning: string; exists: boolean }>) => {
  try {
    const rawCache = appStorage.getItem(CACHE_KEY);
    const cache: Record<string, CachedTranslation> = rawCache ? JSON.parse(rawCache) : {};
    
    cache[root] = {
      rootMeaning,
      rootStory,
      translations,
      timestamp: Date.now()
    };
    
    appStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("Failed to save translation cache", e);
  }
};

export const getTranslationFromCache = (root: string): CachedTranslation | null => {
  try {
    const rawCache = appStorage.getItem(CACHE_KEY);
    if (!rawCache) return null;
    
    const cache: Record<string, CachedTranslation> = JSON.parse(rawCache);
    return cache[root] || null;
  } catch (e) {
    console.error("Failed to read translation cache", e);
    return null;
  }
};

export const exportCacheForBackup = (): string => {
  const data = {
    quranic_ai_translations: JSON.parse(appStorage.getItem(CACHE_KEY) || "{}"),
    offline_saved_verses: JSON.parse(appStorage.getItem('offline_saved_verses_v2') || "{}"),
    quranic_arabic_master_flashcards: JSON.parse(appStorage.getItem('quranic_arabic_master_flashcards') || "[]"),
    quranic_arabic_reviewed_flashcards: JSON.parse(appStorage.getItem('quranic_arabic_reviewed_flashcards') || "[]"),
    quranic_arabic_saved_maps: JSON.parse(appStorage.getItem('quranic_arabic_saved_maps') || "[]"),
    quranic_arabic_recent_searches: JSON.parse(appStorage.getItem('quranic_arabic_recent_searches') || "[]"),
    quranic_arabic_wotd_history: JSON.parse(appStorage.getItem('quranic_arabic_wotd_history') || "{}"),
  };
  return JSON.stringify(data);
};

export const importCacheFromBackup = (backupData: string) => {
  try {
    const parsed = JSON.parse(backupData);
    if (typeof parsed === "object" && parsed !== null) {
      // Check if it's the new multi-key format
      if (parsed.quranic_ai_translations || parsed.offline_saved_verses || parsed.quranic_arabic_master_flashcards || parsed.quranic_arabic_saved_maps || parsed.quranic_arabic_wotd_history) {
        
        // 1. Translations (additive dictionary)
        if (parsed.quranic_ai_translations) {
            const raw = appStorage.getItem(CACHE_KEY);
            const existing = raw ? JSON.parse(raw) : {};
            const merged = { ...existing, ...parsed.quranic_ai_translations };
            appStorage.setItem(CACHE_KEY, JSON.stringify(merged));
        }

        // 2. Offline Verses (additive dictionary)
        if (parsed.offline_saved_verses) {
            const raw = appStorage.getItem('offline_saved_verses_v2');
            const existing = raw ? JSON.parse(raw) : {};
            const merged = { ...existing, ...parsed.offline_saved_verses };
            appStorage.setItem('offline_saved_verses_v2', JSON.stringify(merged));
        }

        // 3. Master Flashcards (additive array of strings)
        if (parsed.quranic_arabic_master_flashcards && Array.isArray(parsed.quranic_arabic_master_flashcards)) {
            const raw = appStorage.getItem('quranic_arabic_master_flashcards');
            const existing = raw ? JSON.parse(raw) : [];
            const newSet = new Set([...existing, ...parsed.quranic_arabic_master_flashcards]);
            appStorage.setItem('quranic_arabic_master_flashcards', JSON.stringify(Array.from(newSet)));
        }

        // 4. Reviewed Flashcards (additive array of strings)
        if (parsed.quranic_arabic_reviewed_flashcards && Array.isArray(parsed.quranic_arabic_reviewed_flashcards)) {
            const raw = appStorage.getItem('quranic_arabic_reviewed_flashcards');
            const existing = raw ? JSON.parse(raw) : [];
            const newSet = new Set([...existing, ...parsed.quranic_arabic_reviewed_flashcards]);
            appStorage.setItem('quranic_arabic_reviewed_flashcards', JSON.stringify(Array.from(newSet)));
        }

        // 5. Saved Maps (additive array with id check)
        if (parsed.quranic_arabic_saved_maps && Array.isArray(parsed.quranic_arabic_saved_maps)) {
            const raw = appStorage.getItem('quranic_arabic_saved_maps');
            const existing = raw ? JSON.parse(raw) : [];
            const existingIds = new Set(existing.map((m: any) => m.id));
            const toAdd = parsed.quranic_arabic_saved_maps.filter((m: any) => m.id && !existingIds.has(m.id));
            const merged = [...existing, ...toAdd];
            appStorage.setItem('quranic_arabic_saved_maps', JSON.stringify(merged));
        }

        // 6. Recent Searches (additive array with id check)
        if (parsed.quranic_arabic_recent_searches && Array.isArray(parsed.quranic_arabic_recent_searches)) {
            const raw = appStorage.getItem('quranic_arabic_recent_searches');
            const existing = raw ? JSON.parse(raw) : [];
            const existingIds = new Set(existing.map((s: any) => s.id));
            const toAdd = parsed.quranic_arabic_recent_searches.filter((s: any) => s.id && !existingIds.has(s.id));
            const merged = [...existing, ...toAdd];
            appStorage.setItem('quranic_arabic_recent_searches', JSON.stringify(merged));
        }

        // 7. WOTD History (additive dictionary)
        if (parsed.quranic_arabic_wotd_history) {
            const raw = appStorage.getItem('quranic_arabic_wotd_history');
            const existing = raw ? JSON.parse(raw) : {};
            const merged = { ...existing, ...parsed.quranic_arabic_wotd_history };
            appStorage.setItem('quranic_arabic_wotd_history', JSON.stringify(merged));
        }

      } else {
        // Old format: parsed is just the translations dictionary
        const rawCache = appStorage.getItem(CACHE_KEY);
        const cache: Record<string, CachedTranslation> = rawCache ? JSON.parse(rawCache) : {};
        const newCache = { ...cache, ...parsed };
        appStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
      }
      
      // Dispatch an event to notify React components to reload data
      window.dispatchEvent(new Event('quranic_arabic_data_imported'));

      return true;
    }
  } catch (e) {
    console.error("Failed to import cache", e);
  }
  return false;
};
