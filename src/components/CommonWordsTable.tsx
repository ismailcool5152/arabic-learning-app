import React, { useState, useMemo } from 'react';
import { COMMON_WORDS_500, QuranicCommonWord } from '../data/commonWords500';
import { Search, ChevronLeft, ChevronRight, Hash, Eye, Tag, Library, RefreshCw, ArrowUpDown } from 'lucide-react';
import { LayoutTheme } from '../types';

interface CommonWordsTableProps {
  theme: LayoutTheme;
  onSelectWord?: (word: string) => void;
}

export default function CommonWordsTable({ theme, onSelectWord }: CommonWordsTableProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Ism' | "Fi'l" | 'Harf'>('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Sorting state
  const [sortBy, setSortBy] = useState<'id' | 'word' | 'transliteration' | 'wordType' | 'frequency'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Aesthetic Themes matching main applet specs
  const colors = useMemo(() => {
    if (isParchment) {
      return {
        cardBg: 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e]',
        thBg: 'bg-[#ebd8c3]/60 text-[#5c4033]',
        accentText: 'text-[#8c6239]',
        hoverRow: 'hover:bg-[#ebd8c3]/20',
        inputBg: 'bg-white border-[#ebdcc3]',
        badgeIsm: 'bg-amber-100 text-amber-800 border-amber-200/50',
        badgeFil: 'bg-orange-100 text-orange-800 border-orange-200/50',
        badgeHarf: 'bg-stone-100 text-stone-800 border-stone-200/50',
        divider: 'border-[#dfd2be]/60',
      };
    }
    if (isCosmic) {
      return {
        cardBg: 'bg-[#05060f] border-indigo-950/80 text-indigo-50',
        thBg: 'bg-indigo-950/50 text-indigo-300',
        accentText: 'text-pink-400',
        hoverRow: 'hover:bg-indigo-950/30',
        inputBg: 'bg-black/50 border-indigo-900/40',
        badgeIsm: 'bg-pink-950/50 text-pink-300 border-pink-900/30',
        badgeFil: 'bg-violet-950/50 text-violet-300 border-violet-900/30',
        badgeHarf: 'bg-slate-900 text-slate-300 border-slate-800',
        divider: 'border-indigo-950/50',
      };
    }
    return {
      cardBg: 'bg-slate-900 border-slate-800 text-slate-100',
      thBg: 'bg-slate-800/60 text-slate-300',
      accentText: 'text-emerald-400',
      hoverRow: 'hover:bg-slate-800/40',
      inputBg: 'bg-black/50 border-slate-800',
      badgeIsm: 'bg-emerald-950/50 text-emerald-300 border-emerald-900/30',
      badgeFil: 'bg-teal-950/50 text-teal-300 border-teal-900/30',
      badgeHarf: 'bg-slate-800 text-slate-300 border-slate-700',
      divider: 'border-slate-800',
    };
  }, [isParchment, isCosmic]);

  // Filter word bank
  const filteredWords = useMemo(() => {
    return COMMON_WORDS_500.filter((w) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        w.word.includes(q) ||
        w.transliteration.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        w.root.toLowerCase().includes(q) ||
        w.pattern.toLowerCase().includes(q);

      const matchesType = typeFilter === 'All' || w.wordType === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  // Sort word bank dynamically
  const sortedWords = useMemo(() => {
    const list = [...filteredWords];
    list.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        // Numbers sorting (id / rank, and frequency / occurrences)
        return sortOrder === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
    });
    return list;
  }, [filteredWords, sortBy, sortOrder]);

  // Support sort-change resetting index to page 1
  React.useEffect(() => {
    setPage(1);
  }, [search, typeFilter, pageSize, sortBy, sortOrder]);

  const handleSort = (field: 'id' | 'word' | 'transliteration' | 'wordType' | 'frequency') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Pagination details
  const totalItems = sortedWords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPageWords = useMemo(() => {
    const startIdx = (page - 1) * pageSize;
    return sortedWords.slice(startIdx, startIdx + pageSize);
  }, [sortedWords, page, pageSize]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className={`border rounded-2xl p-6 transition-all duration-300 ${colors.cardBg} animate-fadeIn`}>
      {/* Table Header Section */}
      <div className={`flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b ${colors.divider} pb-5 mb-5`}>
        <div>
          <div className="flex items-center gap-2">
            <Library className={`w-5 h-5 ${colors.accentText}`} />
            <h2 className="text-xl font-bold tracking-tight">500 Most Common Words Codex</h2>
          </div>
          <p className="text-xs mt-1 opacity-70">
            A comprehensive, fully offline database representing the top 500 highest frequency structural vocabulary in Quranic Arabic. Click any word to trigger deep interactive analysis.
          </p>
        </div>

        {/* Controls Layout */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-50" />
            <input
              type="text"
              placeholder="Filter by word, meaning, pattern, root..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none border ${colors.inputBg}`}
            />
          </div>

          {/* Type dropdown buttons */}
          <div className="flex rounded-xl p-0.5 border border-current/10 bg-black/10">
            {(['All', 'Ism', "Fi'l", 'Harf'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  typeFilter === t
                    ? isParchment
                      ? 'bg-[#8c6239] text-white shadow-sm'
                      : isCosmic
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-emerald-600 text-white shadow-md'
                    : 'opacity-65 hover:opacity-100 text-current'
                }`}
              >
                {t === 'All' ? 'All POS' : t === 'Ism' ? 'Ism (Noun)' : t === "Fi'l" ? "Fi'l (Verb)" : 'Harf (Particle)'}
              </button>
            ))}
          </div>

          {/* Reset button */}
          <button
            onClick={() => {
              setSearch('');
              setTypeFilter('All');
              setPage(1);
            }}
            title="Reset Filters"
            className="p-2 rounded-xl border border-current/10 hover:bg-current/5 transition-all text-current opacity-80 hover:opacity-100"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Table view */}
      <div className="overflow-x-auto w-full rounded-xl border border-current/10">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className={`border-b ${colors.divider} ${colors.thBg} font-mono text-[11px] uppercase tracking-wider`}>
              <th 
                className="py-3 px-4 w-24 text-center select-none cursor-pointer hover:opacity-80 transition-all"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center justify-center gap-1">
                  Rank
                  <ArrowUpDown className={`w-3 h-3 ${sortBy === 'id' ? colors.accentText : 'opacity-40'}`} />
                </div>
              </th>
              <th 
                className="py-3 px-4 text-right select-none cursor-pointer hover:opacity-80 transition-all w-28" 
                dir="rtl"
                onClick={() => handleSort('word')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Arabic Term</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortBy === 'word' ? colors.accentText : 'opacity-40'}`} />
                </div>
              </th>
              <th 
                className="py-3 px-4 select-none cursor-pointer hover:opacity-80 transition-all"
                onClick={() => handleSort('transliteration')}
              >
                <div className="flex items-center gap-1">
                  Transliteration
                  <ArrowUpDown className={`w-3 h-3 ${sortBy === 'transliteration' ? colors.accentText : 'opacity-40'}`} />
                </div>
              </th>
              <th 
                className="py-3 px-4 select-none cursor-pointer hover:opacity-80 transition-all"
                onClick={() => handleSort('wordType')}
              >
                <div className="flex items-center gap-1">
                  Morphology Group
                  <ArrowUpDown className={`w-3 h-3 ${sortBy === 'wordType' ? colors.accentText : 'opacity-40'}`} />
                </div>
              </th>
              <th className="py-3 px-4">Root Segment</th>
              <th className="py-3 px-4">Sarf Pattern (Wazan)</th>
              <th className="py-3 px-4">Lexical Meaning</th>
              <th 
                className="py-3 px-4 text-center select-none cursor-pointer hover:opacity-80 transition-all"
                onClick={() => handleSort('frequency')}
              >
                <div className="flex items-center justify-center gap-1">
                  Occurrences
                  <ArrowUpDown className={`w-3 h-3 ${sortBy === 'frequency' ? colors.accentText : 'opacity-40'}`} />
                </div>
              </th>
              {onSelectWord && <th className="py-3 px-4 text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-current/5">
            {currentPageWords.map((word, idx) => {
              const badgeClass =
                word.wordType === 'Ism'
                  ? colors.badgeIsm
                  : word.wordType === "Fi'l"
                    ? colors.badgeFil
                    : colors.badgeHarf;

              return (
                <tr
                  key={word.id}
                  className={`transition-colors duration-150 ${colors.hoverRow}`}
                >
                  <td className="py-3.5 px-4 font-mono text-center text-current/40">{word.id}</td>
                  <td className="py-3.5 px-4 text-right" dir="rtl">
                    <span className="text-xl font-serif font-bold text-current">{word.word}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold tracking-wide">{word.transliteration}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeClass}`}>
                      {word.wordType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{word.root}</td>
                  <td className="py-3.5 px-4">
                    <span className="opacity-85 font-serif">{word.pattern.split(" (")[0]}</span>
                    {word.pattern.includes(" (") && (
                      <span className="text-[10px] font-mono opacity-50 block">
                        {word.pattern.substring(word.pattern.indexOf(" (") + 2, word.pattern.length - 1)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium opacity-90">{word.meaning}</td>
                  <td className="py-3.5 px-4 text-center font-mono opacity-80">{word.frequency}</td>
                  {onSelectWord && (
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSelectWord(word.word.replace(/[ًٌٌٍَُِّ]/g, ''))}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border border-current/10 bg-current/5 hover:bg-current/15 ${colors.accentText}`}
                      >
                        <Eye className="w-3 h-3" />
                        Analyze
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            
            {currentPageWords.length === 0 && (
              <tr>
                <td colSpan={onSelectWord ? 9 : 8} className="py-12 text-center opacity-60">
                  No matching words found in the 500 word offline database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Footer */}
      {totalPages > 1 && (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t ${colors.divider}`}>
          <div className="text-xs opacity-60 font-mono">
            Showing {Math.min(totalItems, (page - 1) * pageSize + 1)} -{' '}
            {Math.min(totalItems, page * pageSize)} of {totalItems} matching structural words
          </div>

          <div className="flex items-center gap-3">
            {/* Page size controller */}
            <div className="flex items-center gap-2 text-xs">
              <span className="opacity-60">Page Size:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className={`p-1 px-2 text-xs rounded-lg border bg-transparent focus:outline-none ${colors.inputBg}`}
              >
                {[10, 15, 25, 50, 100].map((size) => (
                  <option key={size} value={size} className={isParchment ? 'text-[#2c241e]' : 'text-slate-900'}>
                    {size} rows
                  </option>
                ))}
              </select>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={`p-1.5 rounded-lg border border-current/10 hover:bg-current/5 transition-all disabled:opacity-30`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-xs font-mono px-1">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`p-1.5 rounded-lg border border-current/10 hover:bg-current/5 transition-all disabled:opacity-30`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
