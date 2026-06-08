import React, { useState, useMemo } from 'react';
import { LayoutTheme } from '../types';
import { 
  FileText, Cpu, BookOpen, GitBranch, Share2, Server, Database, 
  Shield, Zap, Layers, Network, User, Search, Copy, Check, 
  ChevronRight, ArrowRight, HelpCircle, AlertTriangle, List, Compass
} from 'lucide-react';
import { functionalDocumentation, technicalDocumentation } from '../data/documentationMarkdown';

interface ProductDocProps {
  theme: LayoutTheme;
}

interface MarkdownSection {
  id: string;
  type: 'h1' | 'h2' | 'h3' | 'paragraph' | 'list' | 'code' | 'quote' | 'divider';
  text: string;
  codeLanguage?: string;
  listItems?: string[];
}

export default function ProductDoc({ theme }: ProductDocProps) {
  const [activeSegment, setActiveSegment] = useState<'functional' | 'technical'>('functional');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Determine current documentation string
  const currentRawMarkdown = activeSegment === 'functional' ? functionalDocumentation : technicalDocumentation;

  // Theme-specific styles
  const fontColorClass = isParchment ? 'text-[#2c241e]' : 'text-slate-100';
  const mutedTextClass = isParchment ? 'text-[#705e52]' : 'text-slate-400';
  const cardBgClass = isParchment ? 'bg-[#fdfbf7] border-[#ebdcc3]' : 'bg-slate-900/50 border-white/10';
  const innerCardBgClass = isParchment ? 'bg-[#ebd8c3]/15 border-[#ebdcc3]' : 'bg-slate-950/40 border-white/5';
  const highlightClass = isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-pink-400' : 'text-emerald-400';
  const borderHighlightClass = isParchment ? 'border-[#8c6239]' : isCosmic ? 'border-pink-500' : 'border-emerald-500';
  const badgeClass = isParchment ? 'bg-[#ebd8c3]/40 text-[#8c6239]' : isCosmic ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300';
  const inputBgClass = isParchment ? 'bg-white border-[#ebdcc3] text-[#2c241e]' : 'bg-slate-950/60 border-white/10 text-white';

  // Helper: Robust Markdown Parser
  const parsedSections = useMemo(() => {
    const lines = currentRawMarkdown.split('\n');
    const sections: MarkdownSection[] = [];
    let state: 'normal' | 'code' = 'normal';
    let currentCodeText = '';
    let currentCodeLang = '';
    let sectionCounter = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code Block Toggles
      if (line.trim().startsWith('```')) {
        if (state === 'normal') {
          state = 'code';
          currentCodeLang = line.replace('```', '').trim() || 'javascript';
          currentCodeText = '';
        } else {
          state = 'normal';
          sections.push({
            id: `sec-${sectionCounter++}`,
            type: 'code',
            text: currentCodeText,
            codeLanguage: currentCodeLang
          });
        }
        continue;
      }

      if (state === 'code') {
        currentCodeText += (currentCodeText ? '\n' : '') + line;
        continue;
      }

      const trimmedLine = line.trim();

      // Divider
      if (trimmedLine === '---') {
        sections.push({ id: `sec-${sectionCounter++}`, type: 'divider', text: '' });
        continue;
      }

      // Empty Lines
      if (!trimmedLine) continue;

      // Headers
      if (trimmedLine.startsWith('# ')) {
        sections.push({ id: `sec-${sectionCounter++}`, type: 'h1', text: trimmedLine.substring(2) });
      } else if (trimmedLine.startsWith('## ')) {
        sections.push({ id: `sec-${sectionCounter++}`, type: 'h2', text: trimmedLine.substring(3) });
      } else if (trimmedLine.startsWith('### ')) {
        sections.push({ id: `sec-${sectionCounter++}`, type: 'h3', text: trimmedLine.substring(4) });
      } else if (trimmedLine.startsWith('> ')) {
        // Blockquotes
        sections.push({ id: `sec-${sectionCounter++}`, type: 'quote', text: trimmedLine.substring(2) });
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        // Lists
        const itemText = trimmedLine.substring(2);
        // If previous section was a list, append to it, else create new
        const prevSec = sections[sections.length - 1];
        if (prevSec && prevSec.type === 'list') {
          prevSec.listItems?.push(itemText);
        } else {
          sections.push({
            id: `sec-${sectionCounter++}`,
            type: 'list',
            text: '',
            listItems: [itemText]
          });
        }
      } else {
        // Double-check if we can merge standard text with the previous paragraph if appropriate, or keep it separate
        sections.push({ id: `sec-${sectionCounter++}`, type: 'paragraph', text: trimmedLine });
      }
    }

    return sections;
  }, [currentRawMarkdown]);

  // Generate Table of Contents dynamically from H2 headers
  const tableOfContents = useMemo(() => {
    return parsedSections
      .filter(sec => sec.type === 'h2')
      .map(sec => ({
        id: sec.text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase(),
        title: sec.text,
        originalSectionId: sec.id
      }));
  }, [parsedSections]);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return parsedSections;
    const lowerQuery = searchQuery.toLowerCase();

    return parsedSections.filter(sec => {
      // Always include titles/H1 for context, or filter matching blocks
      if (sec.type === 'h1') return true;
      if (sec.text.toLowerCase().includes(lowerQuery)) return true;
      if (sec.listItems && sec.listItems.some(item => item.toLowerCase().includes(lowerQuery))) return true;
      return false;
    });
  }, [parsedSections, searchQuery]);

  // Handle Copy Clipboard
  const handleCopyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Helper to parse bold, backticks inline styling safely in JSX
  const formatInlineStyles = (text: string) => {
    // 1. Double stars for bold: **text**
    // 2. Backticks for code: `code`
    const parts: React.ReactNode[] = [];
    let remainingString = text;
    let keyIdx = 0;

    // Direct substitution regex split
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const matchParts = remainingString.split(regex);

    return matchParts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className={`font-semibold ${fontColorClass}`}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className={`px-1.5 py-0.5 text-xs font-mono rounded bg-current/5 border border-current/10 ${highlightClass}`}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  // Smooth scroll to element
  const scrollToHeader = (secId: string) => {
    const el = document.getElementById(secId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`space-y-8 p-4 md:p-8 rounded-2xl border ${cardBgClass} max-w-7xl mx-auto shadow-sm animate-fadeIn`}>
      
      {/* HEADER HERO BANNER */}
      <div className="relative text-center space-y-4 pb-8 border-b border-current/10">
        <div className="absolute top-0 right-0 opacity-15">
          <BookOpen className="w-32 h-32 text-current" />
        </div>

        <div className="inline-flex p-3.5 rounded-2xl bg-current/5 mb-2">
          <FileText className={`w-8 h-8 ${highlightClass}`} />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">System & Feature Architecture</h1>
        <p className={`text-lg max-w-2xl mx-auto ${mutedTextClass}`}>
          A holistic, deep technical outline & interactive documentation of the modern Quranic Arabic morphological exploration platform.
        </p>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6">
          <div className={`p-3 rounded-xl border ${innerCardBgClass} text-center`}>
            <span className={`block text-xl font-mono font-bold ${highlightClass}`}>12+</span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${mutedTextClass}`}>Integrated Tools</span>
          </div>
          <div className={`p-3 rounded-xl border ${innerCardBgClass} text-center`}>
            <span className={`block text-xl font-mono font-bold ${highlightClass}`}>9</span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${mutedTextClass}`}>REST API Endpoints</span>
          </div>
          <div className={`p-3 rounded-xl border ${innerCardBgClass} text-center`}>
            <span className={`block text-xl font-mono font-bold ${highlightClass}`}>Dual Model</span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${mutedTextClass}`}>Gemini 2.5 Orchestration</span>
          </div>
          <div className={`p-3 rounded-xl border ${innerCardBgClass} text-center`}>
            <span className={`block text-xl font-mono font-bold ${highlightClass}`}>100%</span>
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${mutedTextClass}`}>Offline Lexicon Failover</span>
          </div>
        </div>

        {/* SEGMENTED TOGGLE SELECTOR */}
        <div className="flex justify-center pt-6">
          <div className="inline-flex p-1 rounded-xl bg-current/5 border border-current/10">
            <button
              onClick={() => { setActiveSegment('functional'); setSearchQuery(''); }}
              className={`px-5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeSegment === 'functional'
                  ? 'bg-current/10 text-current shadow-sm border border-current/10'
                  : 'opacity-60 hover:opacity-100 text-current'
              }`}
            >
              <Compass className="w-4 h-4" />
              📖 User Manual & Functional Doc
            </button>
            <button
              onClick={() => { setActiveSegment('technical'); setSearchQuery(''); }}
              className={`px-5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeSegment === 'technical'
                  ? 'bg-current/10 text-current shadow-sm border border-current/10'
                  : 'opacity-60 hover:opacity-100 text-current'
              }`}
            >
              <Cpu className="w-4 h-4" />
              ⚙️ Technical & API Schema Doc
            </button>
          </div>
        </div>
      </div>

      {/* DOCUMENTATION PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR: Table of Contents & Interactive Filters */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* SEARCH BAR */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase font-mono tracking-wider opacity-70">Search Documentation</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 opacity-50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keywords..."
                className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none focus:ring-1 focus:ring-current ${inputBgClass}`}
              />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-[10px] underline tracking-tight opacity-60 hover:opacity-100"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* TABLE OF CONTENTS */}
          {tableOfContents.length > 0 && (
            <div className={`p-4 rounded-xl border ${innerCardBgClass} space-y-4`}>
              <h3 className="font-bold text-xs uppercase font-mono tracking-wide flex items-center gap-2 border-b border-current/10 pb-2">
                <List className="w-3.5 h-3.5" />
                Table of Contents
              </h3>
              <nav className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                {tableOfContents.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToHeader(item.originalSectionId)}
                    className={`w-full text-left text-xs py-1 px-1.5 rounded transition-all flex items-center gap-1 hover:bg-current/5 ${mutedTextClass} group`}
                  >
                    <ChevronRight className="w-3 h-3 opacity-40 group-hover:opacity-100 text-current flex-shrink-0" />
                    <span className="truncate group-hover:text-current font-medium">{item.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* QUICK LINKS */}
          <div className={`p-4 rounded-xl border border-dashed border-current/20 space-y-3 text-xs ${mutedTextClass}`}>
            <h4 className="font-bold flex items-center gap-1.5 text-current"><HelpCircle className="w-4 h-4" /> Documentation Support</h4>
            <p className="leading-relaxed">This dynamically compiled workbook aligns perfectly with classical Tafsir, Lisan al-Arab parameters, and modern React runtime standards.</p>
          </div>
        </div>

        {/* MAIN DOCUMENT TEXT */}
        <div className="lg:col-span-3 space-y-6">
          
          {filteredSections.length === 0 ? (
            <div className={`text-center py-20 border rounded-2xl border-dashed border-current/10 ${innerCardBgClass}`}>
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3 opacity-60" />
              <p className="font-bold">No documentation parts match your filter</p>
              <p className={`text-xs ${mutedTextClass} mt-1`}>Try reducing search query constraints or resetting filters.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-current/10 hover:bg-current/20 rounded-xl text-xs font-semibold transition"
              >
                Reset Search Filter
              </button>
            </div>
          ) : (
            <div className="space-y-6 select-text">
              {filteredSections.map((sec, idx) => {
                const uniqueSecId = sec.type === 'h2' ? sec.text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() : sec.id;

                switch (sec.type) {
                  case 'h1':
                    return (
                      <div id={uniqueSecId} key={idx} className="pb-4 border-b border-current/10 space-y-2">
                        <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight font-sans">
                          {sec.text}
                        </h2>
                      </div>
                    );

                  case 'h2':
                    return (
                      <div 
                        id={uniqueSecId} 
                        key={idx} 
                        className={`pt-6 pb-2 first:pt-2 border-l-4 ${borderHighlightClass} pl-4 space-y-1`}
                      >
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                          {sec.text}
                        </h3>
                      </div>
                    );

                  case 'h3':
                    return (
                      <h4 id={uniqueSecId} key={idx} className="text-base md:text-lg font-bold pt-4 text-current">
                        {sec.text}
                      </h4>
                    );

                  case 'quote':
                    return (
                      <div 
                        key={idx} 
                        className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-yellow-800 dark:text-yellow-300 space-y-1.5 flex gap-3 text-xs leading-relaxed"
                      >
                        <AlertTriangle className="w-4 shadow-sm h-4 flex-shrink-0 mt-0.5 text-yellow-500" />
                        <div>{formatInlineStyles(sec.text)}</div>
                      </div>
                    );

                  case 'list':
                    return (
                      <ul key={idx} className="space-y-2 pl-4 list-none my-2 text-sm leading-relaxed">
                        {sec.listItems?.map((item, lIdx) => (
                          <li key={lIdx} className="flex items-start gap-2.5">
                            <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-current opacity-40`} />
                            <span>{formatInlineStyles(item)}</span>
                          </li>
                        ))}
                      </ul>
                    );

                  case 'code':
                    return (
                      <div key={idx} className="my-4 rounded-xl border bg-slate-950 text-slate-200 border-white/10 overflow-hidden font-mono text-xs shadow-md">
                        {/* Title bar */}
                        <div className="bg-slate-900 border-b border-white/5 px-4 py-2.5 flex justify-between items-center text-[10px] text-slate-400">
                          <span className="uppercase font-semibold tracking-wider flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-yellow-500" />
                            {sec.codeLanguage || 'JSON Source'}
                          </span>
                          <button
                            onClick={() => handleCopyCode(sec.text, idx)}
                            className="p-1 hover:bg-white/10 rounded transition flex items-center gap-1 text-slate-300"
                            title="Copy code to clipboard"
                          >
                            {copiedCodeIndex === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        {/* Code box */}
                        <pre className="p-4 overflow-x-auto max-h-[350px] leading-relaxed select-all">
                          <code>{sec.text}</code>
                        </pre>
                      </div>
                    );

                  case 'divider':
                    return <div key={idx} className="my-8 border-t border-current/10" />;

                  case 'paragraph':
                  default:
                    return (
                      <p key={idx} className={`text-sm md:text-[15px] leading-relaxed ${mutedTextClass}`}>
                        {formatInlineStyles(sec.text)}
                      </p>
                    );
                }
              })}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
