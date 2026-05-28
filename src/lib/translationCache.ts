export interface CachedTranslation {
  rootMeaning: string;
  translations: Record<string, { meaning: string; exists: boolean }>;
  timestamp: number;
}

const CACHE_KEY = "quranic_ai_translations";

export const saveTranslationToCache = (root: string, rootMeaning: string, translations: Record<string, { meaning: string; exists: boolean }>) => {
  try {
    const rawCache = localStorage.getItem(CACHE_KEY);
    const cache: Record<string, CachedTranslation> = rawCache ? JSON.parse(rawCache) : {};
    
    cache[root] = {
      rootMeaning,
      translations,
      timestamp: Date.now()
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error("Failed to save translation cache", e);
  }
};

export const getTranslationFromCache = (root: string): CachedTranslation | null => {
  try {
    const rawCache = localStorage.getItem(CACHE_KEY);
    if (!rawCache) return null;
    
    const cache: Record<string, CachedTranslation> = JSON.parse(rawCache);
    return cache[root] || null;
  } catch (e) {
    console.error("Failed to read translation cache", e);
    return null;
  }
};

export const exportCacheForBackup = (): string => {
  return localStorage.getItem(CACHE_KEY) || "{}";
};

export const importCacheFromBackup = (backupData: string) => {
  try {
    const parsed = JSON.parse(backupData);
    if (typeof parsed === "object" && parsed !== null) {
      // Merge with existing
      const rawCache = localStorage.getItem(CACHE_KEY);
      const cache: Record<string, CachedTranslation> = rawCache ? JSON.parse(rawCache) : {};
      
      const newCache = { ...cache, ...parsed };
      localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));
      return true;
    }
  } catch (e) {
    console.error("Failed to import cache", e);
  }
  return false;
};
