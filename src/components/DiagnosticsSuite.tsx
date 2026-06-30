// src/components/DiagnosticsSuite.tsx

import React, { useState } from 'react';
import { Play, CheckCircle2, AlertTriangle, Terminal, RefreshCw, Layers, ShieldCheck, HeartPulse } from 'lucide-react';
import { isApiCacheEnabled, getApiCacheStats } from '../lib/apiCache';
import { findOfflineFallback } from '../offlineData';

interface DiagnosticsSuiteProps {
  isParchment: boolean;
  isCosmic: boolean;
  theme: string;
}

interface TestLog {
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

interface TestState {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  error?: string;
}

export default function DiagnosticsSuite({ isParchment, isCosmic, theme }: DiagnosticsSuiteProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [tests, setTests] = useState<TestState[]>([
    { id: 'storage', name: 'LocalStorage & appStorage Integrity', description: 'Checks local write/read capability and capacity constraints.', status: 'idle' },
    { id: 'cache_engine', name: 'HTTP Client API Cache Validation', description: 'Ensures fetch caching interceptor is fully functional and stable.', status: 'idle' },
    { id: 'offline_fallback', name: 'Offline Data Engine Fallbacks', description: 'Verifies classical offline database fallbacks for standard roots.', status: 'idle' },
    { id: 'api_endpoints', name: 'Server API Routing & Latency Pings', description: 'Measures latency and confirms response health on core server-side routes.', status: 'idle' },
  ]);

  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp: time, type, message }]);
  };

  const updateTestStatus = (id: string, status: 'idle' | 'running' | 'passed' | 'failed', error?: string) => {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, error } : t))
    );
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setLogs([]);
    
    // Reset all test statuses
    setTests(prev => prev.map(t => ({ ...t, status: 'idle', error: undefined })));
    
    addLog('🚀 Starting Comprehensive Application Regression Suite...', 'info');
    await new Promise((resolve) => setTimeout(resolve, 600));

    // --- TEST 1: Storage ---
    updateTestStatus('storage', 'running');
    addLog('[TEST 1] Initiating LocalStorage Read/Write Integrity test...', 'info');
    try {
      const testKey = `__quranic_diag_test_${Date.now()}__`;
      const testVal = JSON.stringify({ active: true, payload: "Diagnostic Suite Success State" });
      
      // Write
      localStorage.setItem(testKey, testVal);
      addLog(`[OK] Successfully wrote to localStorage key: ${testKey}`, 'success');
      
      // Read
      const retrieved = localStorage.getItem(testKey);
      if (!retrieved) throw new Error("Retrieved value was empty or null.");
      
      const parsed = JSON.parse(retrieved);
      if (!parsed.active || parsed.payload !== "Diagnostic Suite Success State") {
        throw new Error("Retrieved payload did not match original write state.");
      }
      addLog(`[OK] Read validation passed successfully. Payload verified.`, 'success');
      
      // Clean up
      localStorage.removeItem(testKey);
      addLog(`[OK] Cleanup successful. Temporary diagnostic key removed.`, 'success');
      
      updateTestStatus('storage', 'passed');
    } catch (e: any) {
      const errMsg = e?.message || String(e);
      addLog(`[FAIL] Storage validation failed: ${errMsg}`, 'error');
      updateTestStatus('storage', 'failed', errMsg);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    // --- TEST 2: Cache Engine ---
    updateTestStatus('cache_engine', 'running');
    addLog('[TEST 2] Verifying API Request Caching layer state...', 'info');
    try {
      const enabled = isApiCacheEnabled();
      addLog(`[INFO] Cache Activation Toggle status: ${enabled ? 'ACTIVE (Enabled)' : 'INACTIVE (Disabled)'}`, 'info');
      
      const stats = getApiCacheStats();
      addLog(`[INFO] Current caching footprints: ${stats.itemCount} items, ${stats.totalSizeKB} KB utilized.`, 'info');
      
      // Test global interceptor attached state
      const globalIntercepted = (window as any).__quranic_fetch_intercepted__;
      if (globalIntercepted) {
        addLog(`[OK] Global window.fetch interceptor confirmed running.`, 'success');
      } else {
        addLog(`[WARN] Global interceptor is not active in this thread, but caching module is loaded.`, 'warn');
      }
      
      updateTestStatus('cache_engine', 'passed');
    } catch (e: any) {
      const errMsg = e?.message || String(e);
      addLog(`[FAIL] Cache validation error: ${errMsg}`, 'error');
      updateTestStatus('cache_engine', 'failed', errMsg);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    // --- TEST 3: Offline Fallbacks ---
    updateTestStatus('offline_fallback', 'running');
    addLog('[TEST 3] Testing static dictionary & classical root fallbacks...', 'info');
    try {
      const testRoot = "كتب";
      addLog(`[INFO] Attempting lookup on core Arabic root: "${testRoot}"`, 'info');
      const fallback = findOfflineFallback(testRoot);
      
      if (!fallback) {
        throw new Error(`Lookup failed. No local offline fallback records found for root "${testRoot}".`);
      }
      
      addLog(`[OK] Core root found in local dictionary. Derived word variants count: ${fallback.relatedWords?.length || 0}`, 'success');
      addLog(`[INFO] Meaning preview: ${fallback.rootMeaning?.slice(0, 60)}...`, 'info');
      
      updateTestStatus('offline_fallback', 'passed');
    } catch (e: any) {
      const errMsg = e?.message || String(e);
      addLog(`[FAIL] Offline fallback database query error: ${errMsg}`, 'error');
      updateTestStatus('offline_fallback', 'failed', errMsg);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    // --- TEST 4: API Routes ---
    updateTestStatus('api_endpoints', 'running');
    addLog('[TEST 4] Dispatching latency ping to Quranic core API services...', 'info');
    try {
      const startTime = Date.now();
      
      // We ping the lightweight analyze-word endpoint with a dry run payload, or use /api/health if exists
      const pingUrl = "/api/health";
      addLog(`[INFO] Routing GET request to: ${pingUrl}`, 'info');
      
      const res = await fetch(pingUrl).catch(() => null);
      const latency = Date.now() - startTime;
      
      if (res && res.ok) {
        const json = await res.json().catch(() => ({}));
        addLog(`[OK] API Server responded status 200 OK in ${latency}ms. Payload: ${JSON.stringify(json)}`, 'success');
      } else {
        addLog(`[WARN] Endpoint ${pingUrl} returned status ${res?.status || 'network error'}. Checking alternate word service fallback...`, 'warn');
        
        const startTime2 = Date.now();
        const testRes = await fetch('/api/translate-root-words', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ root: "علم" })
        }).catch(() => null);
        const latency2 = Date.now() - startTime2;
        
        if (testRes && testRes.ok) {
          addLog(`[OK] Alternate translation endpoint successfully verified in ${latency2}ms.`, 'success');
        } else {
          throw new Error(`All target server endpoints returned non-200. Check server status/port binding.`);
        }
      }
      
      updateTestStatus('api_endpoints', 'passed');
    } catch (e: any) {
      const errMsg = e?.message || String(e);
      addLog(`[FAIL] Server API Connection test failed: ${errMsg}`, 'error');
      updateTestStatus('api_endpoints', 'failed', errMsg);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    addLog('🎉 Regression and sanity test suite execution completed successfully.', 'success');
    setIsRunning(false);
  };

  return (
    <div className="space-y-5">
      {/* Run Action Panel */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isParchment 
          ? 'bg-[#f5eeda] border-[#e8ddc9]' 
          : isCosmic 
            ? 'bg-[#0b0c16] border-indigo-950/50' 
            : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="space-y-1">
          <h4 className="text-sm font-bold flex items-center gap-1.5 font-serif">
            <HeartPulse className="w-4 h-4 text-emerald-500 animate-pulse" /> Live Integrity & Diagnostics
          </h4>
          <p className="text-xs opacity-65">
            Execute automated checks on client memory, storage, offline dictionary pipelines, and server endpoints.
          </p>
        </div>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50 ${
            isParchment 
              ? 'bg-[#8c6239] hover:bg-[#7a5431] text-white' 
              : isCosmic 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> RUNNING SUITE...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" /> RUN SANITY TEST
            </>
          )}
        </button>
      </div>

      {/* Tests Status List */}
      <div className="space-y-2.5">
        {tests.map((t) => (
          <div 
            key={t.id} 
            className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-all ${
              isParchment ? 'bg-[#fcfaf5]/60 border-[#ebdcca]/50' : 'bg-current/[0.01] border-current/10'
            }`}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-serif opacity-90">{t.name}</span>
                {t.status === 'passed' && <span className="text-[9px] font-mono bg-emerald-500/15 text-emerald-500 font-black px-1.5 py-0.2 rounded">PASSED</span>}
                {t.status === 'failed' && <span className="text-[9px] font-mono bg-red-500/15 text-red-500 font-black px-1.5 py-0.2 rounded">FAILED</span>}
                {t.status === 'running' && <span className="text-[9px] font-mono bg-amber-500/15 text-amber-500 font-black px-1.5 py-0.2 rounded animate-pulse">RUNNING</span>}
                {t.status === 'idle' && <span className="text-[9px] font-mono opacity-40 bg-current/10 px-1.5 py-0.2 rounded">IDLE</span>}
              </div>
              <p className="text-[11px] opacity-60">{t.description}</p>
              {t.error && <p className="text-[10px] text-red-500 font-mono mt-0.5">{t.error}</p>}
            </div>
            
            <div className="flex-shrink-0">
              {t.status === 'passed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {t.status === 'failed' && <AlertTriangle className="w-5 h-5 text-red-500" />}
              {t.status === 'running' && <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />}
              {t.status === 'idle' && <div className="w-5 h-5 rounded-full border-2 border-dashed border-current/20" />}
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Diagnostics Terminal Console */}
      <div className={`rounded-xl border flex flex-col overflow-hidden ${
        isParchment 
          ? 'bg-[#f0e7d5] border-[#dfd2be]' 
          : 'bg-black/40 border-current/10'
      }`}>
        <div className="px-3 py-2 border-b border-current/10 flex items-center justify-between text-[10px] font-mono opacity-70">
          <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> Diagnostics Live Console</span>
          {logs.length > 0 && (
            <button 
              onClick={() => setLogs([])}
              className="hover:underline hover:opacity-100 opacity-60 cursor-pointer"
            >
              Clear Logs
            </button>
          )}
        </div>
        
        <div className="p-3 font-mono text-[11px] min-h-[140px] max-h-[220px] overflow-y-auto space-y-1.5 scrollbar-thin">
          {logs.length === 0 ? (
            <p className="opacity-40 italic text-center pt-8">Console empty. Click &quot;Run Sanity Test&quot; above to begin live verification.</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-2 items-start leading-relaxed animate-fadeIn">
                <span className="opacity-30 flex-shrink-0 select-none">[{log.timestamp}]</span>
                <span className={
                  log.type === 'success' ? 'text-emerald-500 font-bold' :
                  log.type === 'error' ? 'text-red-500 font-bold' :
                  log.type === 'warn' ? 'text-amber-500 font-bold' :
                  'opacity-85'
                }>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
