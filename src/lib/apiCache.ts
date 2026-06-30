// src/lib/apiCache.ts

import { appStorage } from "./appStorage";

const CACHE_PREFIX = "quranic_apicache_";
const CACHE_ENABLED_KEY = "quranic_apicache_enabled";

// Endpoints that are safe and recommended to cache
const CACHEABLE_ENDPOINTS = [
  "/api/analyze-word",
  "/api/surah-vocab-map",
  "/api/breakdown-verse",
  "/api/analyze-balaghah",
  "/api/example-verse",
  "/api/translate-root-words",
  "/api/analyze-misunderstood",
  "/api/word-irab-shifts",
  "/api/ocr-root"
];

// Helper to check if a URL is cacheable
function isCacheableUrl(url: string): boolean {
  return CACHEABLE_ENDPOINTS.some(endpoint => url.includes(endpoint));
}

// Generate a deterministic cache key from URL and request configuration
async function generateCacheKey(url: string, init?: RequestInit): Promise<string> {
  const method = (init?.method || "GET").toUpperCase();
  let bodyPart = "";

  if (method === "POST" && init?.body) {
    if (typeof init.body === "string") {
      bodyPart = init.body;
    } else if (init.body instanceof Blob) {
      bodyPart = await init.body.text();
    } else if (init.body instanceof URLSearchParams) {
      bodyPart = init.body.toString();
    } else if (init.body instanceof FormData) {
      const parts: string[] = [];
      init.body.forEach((value, key) => {
        parts.push(`${key}=${value.toString()}`);
      });
      bodyPart = parts.join("&");
    }
  }

  // Canonicalize JSON bodies to prevent ordering variations from creating separate keys
  try {
    if (bodyPart.trim().startsWith("{") || bodyPart.trim().startsWith("[")) {
      const parsed = JSON.parse(bodyPart);
      bodyPart = JSON.stringify(sortObjectKeys(parsed));
    }
  } catch (e) {
    // Fall back to original bodyPart string if JSON parsing fails
  }

  return `${CACHE_PREFIX}${method}_${url}_${bodyPart}`;
}

// Recursively sort object keys for deterministic serialization
function sortObjectKeys(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: Record<string, any> = {};
  sortedKeys.forEach(key => {
    sortedObj[key] = sortObjectKeys(obj[key]);
  });
  return sortedObj;
}

// Check if request is forcing a bypass or refresh
function isForceRefresh(init?: RequestInit): boolean {
  // Check headers
  if (init?.headers) {
    const headers = new Headers(init.headers);
    if (headers.get("X-Bypass-Cache") === "true" || headers.get("Cache-Control") === "no-cache") {
      return true;
    }
  }

  // Check in POST request body
  if (init?.body && typeof init.body === "string") {
    try {
      const parsed = JSON.parse(init.body);
      if (parsed.forceRefresh === true || parsed.force === true) {
        return true;
      }
    } catch {}
  }

  return false;
}

// Clean up oldest 30% of cache entries if localStorage quota is exceeded
function pruneOldCacheEntries() {
  try {
    const entries: { key: string; timestamp: number; size: number }[] = [];
    let totalSize = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        const val = localStorage.getItem(key);
        if (val) {
          try {
            const parsed = JSON.parse(val);
            entries.push({
              key,
              timestamp: parsed.timestamp || 0,
              size: val.length
            });
            totalSize += val.length;
          } catch {
            // Delete corrupt entries immediately
            localStorage.removeItem(key);
          }
        }
      }
    }

    // Sort by timestamp ascending (oldest first)
    entries.sort((a, b) => a.timestamp - b.timestamp);

    // Evict oldest entries until we prune at least 30% of the total size or items
    const targetPruneSize = totalSize * 0.3;
    let prunedSize = 0;
    const itemsToPruneCount = Math.max(1, Math.floor(entries.length * 0.3));

    for (let i = 0; i < entries.length; i++) {
      if (i < itemsToPruneCount || prunedSize < targetPruneSize) {
        localStorage.removeItem(entries[i].key);
        prunedSize += entries[i].size;
        console.log(`[APICache] Evicted stale cache entry: ${entries[i].key}`);
      } else {
        break;
      }
    }
  } catch (e) {
    console.error("[APICache] Failed during LRU pruning of storage cache:", e);
  }
}

// Invalidate specific Surah Vocabulary Map cache entries
export function invalidateSurahVocabCache(surahNum: number | string) {
  try {
    const surahStr = String(surahNum);
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX) && key.includes("/api/surah-vocab-map")) {
        // If the cache key contains surahNum
        if (key.includes(`"surahNum":${surahStr}`) || key.includes(`"surahNum":"${surahStr}"`)) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`[APICache] Invalidated cached vocab map: ${key}`);
    });
  } catch (e) {
    console.error("[APICache] Error invalidating surah cache:", e);
  }
}

// Invalidate word analysis cache
export function invalidateWordAnalysisCache(word: string) {
  try {
    const cleanWord = word.trim();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX) && key.includes("/api/analyze-word")) {
        if (key.includes(`"word":"${cleanWord}"`)) {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`[APICache] Invalidated cached word analysis: ${key}`);
    });
  } catch (e) {
    console.error("[APICache] Error invalidating word analysis cache:", e);
  }
}

// Expose programmatic Cache Stats
export interface CacheStats {
  itemCount: number;
  totalSizeKB: number;
  endpoints: Record<string, number>;
}

export function getApiCacheStats(): CacheStats {
  const stats: CacheStats = {
    itemCount: 0,
    totalSizeKB: 0,
    endpoints: {}
  };

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        const val = localStorage.getItem(key);
        if (val) {
          stats.itemCount += 1;
          stats.totalSizeKB += val.length / 1024;

          // Deduce endpoint from key
          const match = CACHEABLE_ENDPOINTS.find(ep => key.includes(ep));
          if (match) {
            stats.endpoints[match] = (stats.endpoints[match] || 0) + 1;
          } else {
            stats.endpoints["other"] = (stats.endpoints["other"] || 0) + 1;
          }
        }
      }
    }
  } catch (e) {}

  stats.totalSizeKB = Math.round(stats.totalSizeKB * 100) / 100;
  return stats;
}

// Clear all API cache responses
export function clearApiCache() {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`[APICache] Cleared all cached API responses (${keysToRemove.length} items).`);
    window.dispatchEvent(new Event("quranic_apicache_changed"));
  } catch (e) {
    console.error("[APICache] Failed to clear cache:", e);
  }
}

// Check cache activation status
export function isApiCacheEnabled(): boolean {
  try {
    return localStorage.getItem(CACHE_ENABLED_KEY) !== "false";
  } catch {
    return true;
  }
}

// Toggle cache state
export function setApiCacheEnabled(enabled: boolean) {
  try {
    localStorage.setItem(CACHE_ENABLED_KEY, String(enabled));
    window.dispatchEvent(new Event("quranic_apicache_changed"));
    console.log(`[APICache] Cache is now ${enabled ? "ENABLED" : "DISABLED"}`);
  } catch (e) {
    console.error("[APICache] Failed to save cache toggle state:", e);
  }
}

// Safe backup of the original window.fetch to avoid infinite recursion
const originalFetch = typeof window !== "undefined" ? window.fetch.bind(window) : null;

function safeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (originalFetch) {
    return originalFetch(input, init);
  }
  return fetch(input, init);
}

// Set up the main global window.fetch Interceptor safely
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const urlStr = typeof input === "string" ? input : (input instanceof URL ? input.toString() : input.url);

  // Bypass caching if it's not a cacheable API or caching is disabled
  if (!isCacheableUrl(urlStr) || !isApiCacheEnabled()) {
    // Monitor compile-surah-vocab-ai to invalidate caches dynamically on compilation
    if (urlStr.includes("/api/compile-surah-vocab-ai")) {
      try {
        const res = await safeFetch(input, init);
        if (res.ok) {
          const bodyText = typeof init?.body === "string" ? init.body : "";
          if (bodyText) {
            const parsedBody = JSON.parse(bodyText);
            const surahNum = parsedBody.surahNum;
            if (surahNum) {
              invalidateSurahVocabCache(surahNum);
            }
          }
        }
        return res;
      } catch (e) {
        return safeFetch(input, init);
      }
    }
    return safeFetch(input, init);
  }

  const forceBypass = isForceRefresh(init);

  // Create Cache Key
  let cacheKey = "";
  try {
    cacheKey = await generateCacheKey(urlStr, init);
  } catch (e) {
    console.warn("[APICache] Failed generating deterministic cache key:", e);
    return safeFetch(input, init);
  }

  // Try reading from Cache
  if (!forceBypass) {
    try {
      const cachedItem = localStorage.getItem(cacheKey);
      if (cachedItem) {
        const parsed = JSON.parse(cachedItem);
        
        // Verify we have body and headers structure
        if (parsed && typeof parsed.body === "string") {
          console.log(`%c[APICache] HIT: ${urlStr}`, "color: #10b981; font-weight: bold;", {
            url: urlStr,
            timestamp: new Date(parsed.timestamp).toLocaleTimeString()
          });

          // Construct ResponseInit options
          const responseInit: ResponseInit = {
            status: parsed.status || 200,
            statusText: parsed.statusText || "OK",
            headers: new Headers(parsed.headers || { "Content-Type": "application/json" })
          };

          // Return reconstructed Response
          return new Response(parsed.body, responseInit);
        }
      }
    } catch (err) {
      console.warn("[APICache] Failed parsing cached item:", err);
    }
  } else {
    console.log(`%c[APICache] BYPASS: Forcing fresh sync for ${urlStr}`, "color: #f59e0b; font-weight: bold;");
  }

  // Perform live fetch as fallback or due to cache miss/bypass
  try {
    const liveResponse = await safeFetch(input, init);
    
    // Cache the response if it succeeded
    if (liveResponse.ok && liveResponse.status === 200) {
      try {
        // Clone the response so we don't block the caller from consuming it
        const clonedRes = liveResponse.clone();
        const responseBody = await clonedRes.text();
        
        // Capture response headers
        const headersRecord: Record<string, string> = {};
        clonedRes.headers.forEach((val, key) => {
          headersRecord[key] = val;
        });

        const cachePayload = {
          body: responseBody,
          headers: headersRecord,
          status: clonedRes.status,
          statusText: clonedRes.statusText,
          timestamp: Date.now()
        };

        // Try saving to localStorage
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
          window.dispatchEvent(new Event("quranic_apicache_changed"));
        } catch (quotaError: any) {
          // Out of space! Run LRU prune and try one more time
          if (quotaError.name === "QuotaExceededError" || quotaError.code === 22) {
            console.warn("[APICache] LocalStorage quota exceeded. Running cache cleanup...");
            pruneOldCacheEntries();
            try {
              localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
              window.dispatchEvent(new Event("quranic_apicache_changed"));
            } catch (e) {
              console.error("[APICache] Double write failure after LRU pruning:", e);
            }
          } else {
            throw quotaError;
          }
        }
      } catch (cloneErr) {
        console.warn("[APICache] Failed cloning and caching live response:", cloneErr);
      }
    }

    return liveResponse;
  } catch (fetchErr) {
    console.error("[APICache] Network failure on cache-miss/bypass:", fetchErr);
    throw fetchErr;
  }
}

export function setupApiCacheInterceptor() {
  if (typeof window === "undefined" || (window as any).__quranic_fetch_intercepted__) {
    return;
  }

  try {
    // Try simple assignment first, wrapped safely
    (window as any).fetch = apiFetch;
    (window as any).__quranic_fetch_intercepted__ = true;
    console.log("%c[APICache] Robust app-level fetch caching active via global assignment.", "color: #3b82f6; font-weight: bold;");
  } catch (e) {
    console.warn("[APICache] Direct assignment failed, trying defineProperty:", e);
    try {
      Object.defineProperty(window, "fetch", {
        value: apiFetch,
        writable: true,
        configurable: true,
        enumerable: true
      });
      (window as any).__quranic_fetch_intercepted__ = true;
      console.log("%c[APICache] Interceptor attached via defineProperty.", "color: #3b82f6; font-weight: bold;");
    } catch (err2) {
      console.warn("[APICache] Could not override window.fetch globally due to environment constraints. Local modules will use apiFetch wrapper directly.", err2);
    }
  }
}
