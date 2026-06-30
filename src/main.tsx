import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import { setupApiCacheInterceptor } from './lib/apiCache';

// Initialize transparent client-side HTTP cache
setupApiCacheInterceptor();

// Patch JSON.stringify globally to prevent "Converting circular structure to JSON" crashes
const originalStringify = JSON.stringify;
(JSON as any).stringify = function (value: any, replacer?: any, space?: any): string {
  try {
    return originalStringify(value, replacer, space);
  } catch (err: any) {
    try {
      const seen = new WeakSet();
      const safeReplacer = function (this: any, key: string, val: any) {
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) {
            return '[Circular]';
          }
          seen.add(val);
          if (typeof HTMLElement !== 'undefined' && val instanceof HTMLElement) {
            return `[HTMLObject: ${val.constructor?.name || 'HTMLElement'}]`;
          }
          if (val.constructor && typeof val.constructor.name === 'string' && val.constructor.name.includes('HTML')) {
            return `[HTMLObject: ${val.constructor.name}]`;
          }
          if (val.constructor && typeof val.constructor.name === 'string' && val.constructor.name.includes('Fiber')) {
            return `[ReactFiber]`;
          }
        }
        if (typeof replacer === 'function') {
          try {
            return replacer.call(this, key, val);
          } catch (replacerErr) {
            return '[ReplacerError]';
          }
        }
        if (Array.isArray(replacer)) {
          if (key !== "" && !replacer.includes(key)) {
            return undefined;
          }
        }
        return val;
      };
      return originalStringify(value, safeReplacer, space);
    } catch (secondErr: any) {
      try {
        return originalStringify({
          __unserializable: true,
          error: String(err?.message || err),
          secondError: String(secondErr?.message || secondErr)
        });
      } catch (finalErr) {
        return '{"error":"[Unserializable]"}';
      }
    }
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

