import React from 'react';
import { LayoutTheme } from '../types';
import { FileText, Cpu, BookOpen, GitBranch, Share2, Server, Database, Shield, Zap, Layers, Network, User } from 'lucide-react';

interface ProductDocProps {
  theme: LayoutTheme;
}

export default function ProductDoc({ theme }: ProductDocProps) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  const fontColorClass = isParchment ? 'text-[#2c241e]' : 'text-slate-100';
  const mutedTextClass = isParchment ? 'text-[#705e52]' : 'text-slate-400';
  const cardBgClass = isParchment ? 'bg-[#fdfbf7] border-[#ebdcc3]' : 'bg-slate-900/50 border-white/10';
  const innerCardBgClass = isParchment ? 'bg-[#ebd8c3]/20 border-[#ebdcc3]' : 'bg-slate-950/40 border-white/5';
  const highlightClass = isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-pink-400' : 'text-emerald-400';
  const badgeClass = isParchment ? 'bg-[#ebd8c3]/40 text-[#8c6239]' : isCosmic ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300';

  return (
    <div className={`space-y-8 p-4 md:p-8 rounded-2xl border ${cardBgClass} max-w-5xl mx-auto shadow-sm animate-fadeIn`}>
      
      {/* HEADER */}
      <div className="text-center space-y-4 pb-8 border-b border-current/10">
        <div className="inline-flex p-3 rounded-2xl bg-current/5 mb-2">
          <FileText className={`w-8 h-8 ${highlightClass}`} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Quranic Arabic Engine</h1>
        <p className={`text-lg max-w-2xl mx-auto ${mutedTextClass}`}>
          Technical & Functional Product Documentation
        </p>
        <div className="flex justify-center flex-wrap gap-2 pt-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>Version 2.4.0</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>Full-Stack SPA</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>Offline-First</span>
        </div>
      </div>

      {/* 1. PRODUCT VISION & FUNCTIONAL OVERVIEW */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className={`w-6 h-6 ${highlightClass}`} />
          <h2 className="text-2xl font-bold">1. Functional Overview</h2>
        </div>
        <div className={`p-6 rounded-xl border ${innerCardBgClass} space-y-4 text-[15px] leading-relaxed`}>
          <p className={mutedTextClass}>
            The Quranic Arabic Engine is a comprehensive, offline-first educational platform designed to map, deconstruct, and illustrate the morphological roots of the Quranic Arabic language. It operates primarily as a Single Page Application (SPA), integrating deep linguistic databases and morphological engines to serve real-time structural analysis of Arabic words.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className={`p-4 rounded-xl border ${cardBgClass}`}>
              <h3 className="font-bold flex items-center gap-2 mb-2"><GitBranch className="w-4 h-4" /> Root Synthesis</h3>
              <p className={`text-sm ${mutedTextClass}`}>Translates trilateral and quadrilateral Arabic roots into complex derived noun and verb forms natively.</p>
            </div>
            <div className={`p-4 rounded-xl border ${cardBgClass}`}>
              <h3 className="font-bold flex items-center gap-2 mb-2"><Network className="w-4 h-4" /> Interactive Sarf Map</h3>
              <p className={`text-sm ${mutedTextClass}`}>Visually graphs word structures, breaking down prefixes, roots, patterns (wazn), and suffixes on an interactive 2D canvas.</p>
            </div>
            <div className={`p-4 rounded-xl border ${cardBgClass}`}>
              <h3 className="font-bold flex items-center gap-2 mb-2"><Database className="w-4 h-4" /> Comprehensive Lexicon</h3>
              <p className={`text-sm ${mutedTextClass}`}>Provides a built-in pre-compiled dictionary and rulesets spanning Haruf-ul-Hija, Arabic grammar basics, and classical particles.</p>
            </div>
            <div className={`p-4 rounded-xl border ${cardBgClass}`}>
              <h3 className="font-bold flex items-center gap-2 mb-2"><Layers className="w-4 h-4" /> Morphological DB</h3>
              <p className={`text-sm ${mutedTextClass}`}>Categorizes structural paradigms (Awzan) and demonstrates morphological shifting rules (Sarf).</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SYSTEM ARCHITECTURE & TECHNICAL STACK */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Cpu className={`w-6 h-6 ${highlightClass}`} />
          <h2 className="text-2xl font-bold">2. System Architecture</h2>
        </div>
        
        <div className={`p-6 rounded-xl border ${innerCardBgClass} space-y-6`}>
          <div className="space-y-4 text-[15px] leading-relaxed">
            <h3 className="text-lg font-bold">Client-Side Architecture (SPA)</h3>
            <p className={mutedTextClass}>
              The application leverages a modern React 18+ framework running on Vite, utilizing a client-heavy architecture. Heavy computational tasks regarding Arabic morphology, root deduction, and layout graph calculation are primarily resolved locally on the client layer to provide zero-latency responses for the end user.
            </p>
          </div>

          {/* Flow Diagram for Architecture */}
          <div className={`rounded-xl border ${cardBgClass} bg-black/5 p-6 overflow-x-auto`}>
            <div className="min-w-[600px] font-sans flex flex-col items-center gap-4 text-xs font-semibold">
              <div className={`px-6 py-3 rounded-xl border ${cardBgClass} flex items-center gap-2 shadow-sm`}>
                <User className="w-4 h-4 text-blue-500" />
                User Device (Browser)
              </div>
              
              <div className="w-0.5 h-6 bg-current opacity-20"></div>
              
              <div className={`px-6 py-4 rounded-xl border ${cardBgClass} flex flex-col items-center gap-3 shadow-md w-full max-w-sm`}>
                <div className="flex items-center gap-2">
                  <Layers className={`w-5 h-5 ${highlightClass}`} />
                  <span className="text-sm">React 18 SPA (Vite)</span>
                </div>
                <div className="w-full flex justify-between gap-2">
                  <div className={`flex-1 p-2 text-center rounded border ${innerCardBgClass} ${mutedTextClass}`}>Local Maps</div>
                  <div className={`flex-1 p-2 text-center rounded border ${innerCardBgClass} ${mutedTextClass}`}>Canvas Logic</div>
                  <div className={`flex-1 p-2 text-center rounded border ${innerCardBgClass} ${mutedTextClass}`}>UI State</div>
                </div>
              </div>

              <div className="flex gap-16 w-full max-w-sm justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-current opacity-20"></div>
                  <span className={`text-[10px] ${mutedTextClass} uppercase tracking-wider mb-2`}>API Request</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-current opacity-20"></div>
                  <span className={`text-[10px] ${mutedTextClass} uppercase tracking-wider mb-2`}>Local Storage</span>
                </div>
              </div>

              <div className="flex gap-8 w-full max-w-lg justify-center">
                
                <div className={`px-6 py-4 rounded-xl border ${cardBgClass} flex flex-col items-center gap-2 shadow-md w-48`}>
                  <Server className="w-5 h-5 text-purple-500" />
                  <span>Express Node Server</span>
                  <div className={`mt-2 p-1.5 w-full text-center rounded border ${innerCardBgClass} ${mutedTextClass} text-[10px]`}>REST Endpoint</div>
                  
                  <div className="w-0.5 h-6 bg-current opacity-20 my-1"></div>
                  
                  <div className={`p-2 w-full text-center rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`}>
                    <div className="flex items-center justify-center gap-1 mb-1"><Zap className="w-3 h-3" /> Gemini LLM</div>
                    <span className="text-[10px]">Cloud AI Generative Morph</span>
                  </div>
                </div>

                <div className={`px-6 py-4 rounded-xl border ${cardBgClass} flex flex-col items-center gap-2 shadow-md w-48`}>
                  <Database className="w-5 h-5 text-amber-500" />
                  <span>Local Indexed Data</span>
                  <div className={`mt-2 p-1.5 w-full text-center rounded border ${innerCardBgClass} ${mutedTextClass} text-[10px]`}>Root Patterns</div>
                  <div className={`p-1.5 w-full text-center rounded border ${innerCardBgClass} ${mutedTextClass} text-[10px]`}>Saved Maps Repo</div>
                </div>

              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Layers className={`w-4 h-4 ${highlightClass}`} /> Core Framework
              </div>
              <ul className={`text-sm space-y-1.5 ${mutedTextClass}`}>
                <li>• React 18 (Functional/Hooks)</li>
                <li>• TypeScript (Strict Mode)</li>
                <li>• Vite Bundler (ESM)</li>
                <li>• Tailwind CSS (Styling)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Database className={`w-4 h-4 ${highlightClass}`} /> State & Storage
              </div>
              <ul className={`text-sm space-y-1.5 ${mutedTextClass}`}>
                <li>• Ephemeral React Context/State</li>
                <li>• Offline/On-device LocalStorage</li>
                <li>• Precompiled JSON Lexicons</li>
                <li>• Index-based Caching</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Zap className={`w-4 h-4 ${highlightClass}`} /> APIs & Networking
              </div>
              <ul className={`text-sm space-y-1.5 ${mutedTextClass}`}>
                <li>• Cloud AI Gemini Pipeline</li>
                <li>• RESTful Express Backend Route</li>
                <li>• Graceful Offline Fallbacks</li>
                <li>• Hybrid Data Resolution</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MORPHOLOGICAL ENGINE ARCHITECTURE */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Share2 className={`w-6 h-6 ${highlightClass}`} />
          <h2 className="text-2xl font-bold">3. Morphological Engine Pipeline</h2>
        </div>
        <div className={`p-6 rounded-xl border ${innerCardBgClass} space-y-4`}>
          <p className={`text-sm ${mutedTextClass} mb-4`}>
            When a user searches for an Arabic word, the system executes a multi-tiered resolution pipeline.
          </p>

          <div className="relative border-l-2 border-current/20 pl-6 pb-2 space-y-6 ml-2 text-sm">
            
            <div className="relative">
              <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-current/20 ${cardBgClass}`}></div>
              <h4 className="font-bold text-base mb-1">Tier 1: On-Device Dictionary Match</h4>
              <p className={mutedTextClass}>Checks incoming query against a localized pre-compiled array of prevalent Quranic words (e.g., Haruf, foundational verbs). Response Time: ~1ms.</p>
            </div>

            <div className="relative">
              <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-current/20 ${cardBgClass}`}></div>
              <h4 className="font-bold text-base mb-1">Tier 2: Algorithmic Root Deduction (Local)</h4>
              <p className={mutedTextClass}>In offline mode, a pure deterministic mathematical pattern matcher strips known prefixes (e.g. Alif-Lam, Wa) and suffixes to uncover the trilateral root.</p>
            </div>

            <div className="relative">
              <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500/20 border-2 border-emerald-500 mb-2`}></div>
              <h4 className="font-bold text-base mb-1">Tier 3: Cloud AI Generative Analysis</h4>
              <p className={mutedTextClass}>If connected, the backend server contacts the Gemini LLM with strict unstructured-to-JSON parsing directives, requesting semantic context, Quranic verses, and deep declension structures.</p>
            </div>

          </div>

          <div className="mt-8 pt-4 border-t border-current/10">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2"><Network className={`w-4 h-4 ${highlightClass}`} /> Pipeline Execution Path</h4>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-current/10 overflow-x-auto text-[10px] sm:text-xs">
              <div className={`p-3 rounded-lg border ${cardBgClass} flex flex-col items-center shadow min-w-[120px]`}>
                <span className="font-bold">Input Query</span>
                <span className={`${mutedTextClass} mt-1`}>عَلِمَ</span>
              </div>
              <div className={`hidden sm:block flex-1 h-0.5 bg-gradient-to-r from-transparent via-current/20 to-transparent`}></div>
              <div className={`p-3 rounded-lg border ${cardBgClass} flex flex-col items-center shadow min-w-[140px]`}>
                <span className="font-bold">Tier 1 Cache</span>
                <span className={`${mutedTextClass} mt-1`}>Local Lexicon</span>
              </div>
              <div className={`hidden sm:block flex-1 h-0.5 bg-gradient-to-r from-transparent via-current/20 to-transparent`}></div>
              <div className={`p-3 rounded-lg border ${cardBgClass} flex flex-col items-center shadow min-w-[160px]`}>
                <span className="font-bold">Tier 2 Sarf Rules</span>
                <span className={`${mutedTextClass} mt-1`}>Regex / Stripping</span>
              </div>
              <div className={`hidden sm:block flex-1 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent`}></div>
              <div className={`p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex flex-col items-center shadow min-w-[150px]`}>
                <span className="font-bold">Tier 3 Gen AI</span>
                <span className="opacity-80 mt-1">Structured JSON</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECURITY & DEPLOYMENT */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className={`w-6 h-6 ${highlightClass}`} />
          <h2 className="text-2xl font-bold">4. Security & Deployment</h2>
        </div>
        <div className={`p-6 rounded-xl border ${innerCardBgClass} grid md:grid-cols-2 gap-6`}>
          
          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2"><Server className="w-4 h-4" /> Express Runtime</h3>
            <p className={`text-sm leading-relaxed ${mutedTextClass}`}>
              Running in a containerized Cloud Run environment, the Next.js/Vite output is served through an Express.js production server. The backend exposes exactly one main route (`/api/analyze`) to proxy the generative requests payload.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> API Key Obfuscation</h3>
            <p className={`text-sm leading-relaxed ${mutedTextClass}`}>
              Third-party tokens, like the `GEMINI_API_KEY`, operate entirely server-side. The SPA exclusively communicates via standard REST calls containing zero credentials, maintaining strict browser payload safety protocols.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
