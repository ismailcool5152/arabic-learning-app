// src/lib/appStorage.ts

type StorageListener = () => void;

function safeStringify(obj: any): string {
  const seen = new WeakSet();
  const circularReplacer = (k: string, v: any) => {
    if (typeof v === "object" && v !== null) {
      if (seen.has(v)) {
        return "[Circular]";
      }
      seen.add(v);
      if (typeof HTMLElement !== "undefined" && v instanceof HTMLElement) {
        return `[HTMLObject: ${v.constructor.name || 'HTMLElement'}]`;
      }
      if (v.constructor && v.constructor.name && v.constructor.name.includes('HTML')) {
        return `[HTMLObject: ${v.constructor.name}]`;
      }
    }
    return v;
  };
  return JSON.stringify(obj, circularReplacer);
}

class AppStorage {
  private cache: Record<string, string> = {};
  private initialized: boolean = false;
  private saveTimeout: any = null;
  private listeners: Set<StorageListener> = new Set();

  constructor() {
    this.preload();
  }

  private preload() {
    try {
      // Pre-seed with local storage as a quick offline/client-side fallback if available
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('quranic_') || key === 'offline_saved_verses_v2')) {
          const val = localStorage.getItem(key);
          if (val) this.cache[key] = val;
        }
      }
    } catch (e) {
      // Safely ignore if browser blocks localStorage
    }
  }

  public async initFromServer(): Promise<void> {
    try {
      const res = await fetch("/api/app-state");
      if (res.ok) {
        const serverData = await res.json();
        if (serverData && typeof serverData === "object" && !Array.isArray(serverData)) {
          
          // Check if local cache has a newer timestamp than the server
          const localTimestamp = parseInt(this.cache['quranic_arabic_last_modified'] || '0');
          const serverTimestamp = parseInt(serverData['quranic_arabic_last_modified'] || '0');

          if (localTimestamp > serverTimestamp) {
            console.log("[appStorage] Local data is newer than server. Skipping server merge and queued sync.");
            this.syncToServer();
            return;
          }

          // Merge server data into in-memory cache
          for (const [key, value] of Object.entries(serverData)) {
            if (value === null || value === undefined) continue;
            if (typeof value === "string") {
              this.cache[key] = value;
            } else {
              this.cache[key] = JSON.stringify(value);
            }
          }
          this.initialized = true;
          this.notifyListeners();
          
          // Replicate to local storage for quick offline warming
          try {
            for (const [k, v] of Object.entries(this.cache)) {
              localStorage.setItem(k, v);
            }
          } catch {}
        }
      }
    } catch (err) {
      console.warn("[appStorage] Notice: Server state fetch skipped during startup sync (using local storage fallback):", err);
    }
  }

  public getItem(key: string): string | null {
    return this.cache[key] !== undefined ? this.cache[key] : null;
  }

  public setItem(key: string, value: string): void {
    let sanitizedValue = value;
    if (typeof sanitizedValue !== 'string') {
      console.warn(`[appStorage] Warning: setItem called with non-string value for key "${key}". Converting to string.`);
      try {
        sanitizedValue = safeStringify(sanitizedValue);
      } catch (e) {
        sanitizedValue = String(sanitizedValue);
      }
    }

    if (key !== 'quranic_arabic_last_modified') {
      const now = Date.now().toString();
      this.cache['quranic_arabic_last_modified'] = now;
      try { localStorage.setItem('quranic_arabic_last_modified', now); } catch {}
    }
    this.cache[key] = sanitizedValue;
    this.notifyListeners();
    this.queueSave();

    // Secondary replication
    try {
      localStorage.setItem(key, sanitizedValue);
    } catch {}
  }

  public removeItem(key: string): void {
    if (key !== 'quranic_arabic_last_modified') {
      const now = Date.now().toString();
      this.cache['quranic_arabic_last_modified'] = now;
      try { localStorage.setItem('quranic_arabic_last_modified', now); } catch {}
    }
    delete this.cache[key];
    this.notifyListeners();
    this.queueSave();

    // Secondary replication
    try {
      localStorage.removeItem(key);
    } catch {}
  }

  public subscribe(listener: StorageListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => {
      try { l(); } catch {}
    });
    // Fire event for component synchronization
    window.dispatchEvent(new Event('quranic_arabic_data_imported'));
  }

  private queueSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => {
      this.syncToServer();
    }, 1200); // 1.2s debounce for bulk updates
  }

  private async syncToServer() {
    try {
      const stateObject: Record<string, any> = {};
      for (const [key, val] of Object.entries(this.cache)) {
        try {
          stateObject[key] = JSON.parse(val);
        } catch {
          stateObject[key] = val;
        }
      }

      await fetch("/api/app-state", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: safeStringify(stateObject),
      });
    } catch (err) {
      console.warn("[appStorage] Notice: Could not sync state to server (operating in offline fallback mode):", err);
    }
  }
}

export const appStorage = new AppStorage();
