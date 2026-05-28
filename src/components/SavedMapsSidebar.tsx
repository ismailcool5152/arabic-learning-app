import React, { useState } from 'react';
import { SavedWordMap, RecentSearch, LayoutTheme, LayoutMode } from '../types';
import { 
  BookOpen, 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  User, 
  Edit2, 
  Check, 
  Clock, 
  X,
  History 
} from 'lucide-react';

interface SavedMapsSidebarProps {
  savedMaps: SavedWordMap[];
  selectedSavedId: string | null;
  onSelectMap: (map: SavedWordMap) => void;
  onDeleteMap: (id: string, e: React.MouseEvent) => void;
  onSuggestionClick: (word: string) => void;
  isSearching: boolean;
  theme: LayoutTheme;
  layoutMode?: LayoutMode;
  
  // New personalization and history props
  userName: string;
  onSaveUserName: (name: string) => void;
  recentSearches: RecentSearch[];
  onDeleteRecentSearch: (id: string, e: React.MouseEvent) => void;
  onClearRecentSearches: () => void;
}

// Curated high-impact Quranic Arabic keywords and roots for immediate studies based on frequency
export const QURANIC_SUGGESTIONS = [
  { word: "قَالَ", root: "ق - و - ل", concept: "To say/Speech", transliteration: "Qala", description: "Uttering, speaking, commanding", frequency: 1722 },
  { word: "كَانَ", root: "ك - و - ن", concept: "To be/Existence", transliteration: "Kana", description: "Existing, happening, being", frequency: 1390 },
  { word: "آمَنَ", root: "ء - م - ن", concept: "To believe/Safety", transliteration: "Amana", description: "Faith, safety, trusting", frequency: 879 },
  { word: "عَلِمَ", root: "ع - ل - م", concept: "To know/Knowledge", transliteration: "Alima", description: "Knowing, teaching, signs", frequency: 854 },
  { word: "رَبّ", root: "ر - ب - ب", concept: "Lord/Sustainer", transliteration: "Rabb", description: "Mastery, nurturing, sustaining", frequency: 975 },
  { word: "إِلَٰه", root: "ء - ل - ه", concept: "Deity/God", transliteration: "Ilah", description: "Worship, adoration", frequency: 2851 },
  { word: "آيَة", root: "ء - ي - ي", concept: "Sign/Verse", transliteration: "Ayah", description: "Miracles, messages, markers", frequency: 382 },
  { word: "كَفَرَ", root: "ك - ف - ر", concept: "To disbelieve", transliteration: "Kafara", description: "Concealing, denying truth", frequency: 525 },
  { word: "عَمِلَ", root: "ع - م - ل", concept: "To work/Deeds", transliteration: "Amila", description: "Doing, making, acting", frequency: 360 },
  { word: "كَتَبَ", root: "ك - ت - ب", concept: "To write/Decree", transliteration: "Kataba", description: "Writing, registering, decreeing", frequency: 319 },
  { word: "شَهِدَ", root: "ش - ه - د", concept: "To witness/Testify", transliteration: "Shahida", description: "Witnessing, verifying, testifying", frequency: 160 },
  { word: "سَجَدَ", root: "س - ج - د", concept: "To prostrate", transliteration: "Sajada", description: "Humility, submitting, bowing", frequency: 92 }
];

export default function SavedMapsSidebar({
  savedMaps,
  selectedSavedId,
  onSelectMap,
  onDeleteMap,
  onSuggestionClick,
  isSearching,
  theme,
  layoutMode = 'horizontal',
  userName,
  onSaveUserName,
  recentSearches,
  onDeleteRecentSearch,
  onClearRecentSearches
}: SavedMapsSidebarProps) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Toggle state inside notebook (Saved Maps vs Recent Searches)
  const [notebookTab, setNotebookTab] = useState<'saved' | 'recent'>('saved');
  // Edit name input active state
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUserName(nameInput.trim());
    setIsEditingName(false);
  };

  const handleStartEdit = () => {
    setNameInput(userName);
    setIsEditingName(true);
  };

  // Card themes
  const cardBgClass = isParchment 
    ? 'bg-[#f4ebe1] border-[#e2d5c3] text-[#2c241e] shadow-md' 
    : isCosmic 
      ? 'bg-slate-950/80 border-indigo-950 text-indigo-50 shadow-indigo-950/20' 
      : 'bg-slate-900 border-slate-800 text-slate-100 shadow-xl';

  const headingClass = isParchment ? 'text-[#5c3d2e]' : 'text-slate-100';
  const textMutedClass = isParchment ? 'text-[#705e52]' : 'text-slate-400';

  // Inner button items
  const suggestBtnClass = isParchment
    ? 'bg-[#fcfbf9] hover:bg-[#ebdcc3]/40 border-[#dfd2be] hover:border-[#8c6239] text-[#4d3a2a]'
    : isCosmic
      ? 'bg-slate-950/40 hover:bg-indigo-950/40 border-indigo-950/75 hover:border-indigo-800'
      : 'bg-slate-950/40 hover:bg-slate-950/85 border-slate-800 hover:border-slate-700';

  const badgeClass = isParchment
    ? 'text-[#8c6239] bg-[#ebd8c3]/40 border-[#dfd2be]'
    : isCosmic
      ? 'text-pink-400 bg-pink-950/60 border-pink-900/60'
      : 'text-emerald-400 bg-emerald-950/80 border-emerald-900/60';

  const containerClasses = layoutMode === 'vertical'
    ? "flex flex-col space-y-6 w-full"
    : "grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-stretch animate-fadeIn";

  return (
    <div className={containerClasses}>
      
      {/* Dynamic Profile Personalization Header Card */}
      <div className={`rounded-2xl p-4 border transition-all duration-300 ${cardBgClass}`}>
        {isEditingName ? (
          <form onSubmit={handleNameSave} className="space-y-3">
            <label className={`text-[10px] font-bold uppercase tracking-wider block ${textMutedClass}`}>
              What is your name?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name..."
                required
                maxLength={25}
                className={`flex-1 font-semibold rounded-xl py-1.5 px-3 text-xs focus:outline-none transition-all border ${
                  isParchment
                    ? 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e] focus:border-[#8c6239]'
                    : isCosmic
                      ? 'bg-black border-indigo-950 text-indigo-50 focus:border-indigo-500'
                      : 'bg-slate-950 border border-slate-800 text-slate-100 focus:border-emerald-500'
                }`}
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
                title="Save profile name"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className={`p-1.5 rounded-lg border border-current/10 hover:bg-current/5 transition-all cursor-pointer ${textMutedClass}`}
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-3.5 space-x-reverse justify-end md:justify-start">
              <div className={`p-2 rounded-xl bg-current/5 border border-current/10 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-pink-400' : 'text-emerald-400'}`}>
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className={`text-[10px] font-mono uppercase tracking-wider ${textMutedClass} leading-none`}>
                  Personal Study Circle
                </p>
                <h3 className="text-xs font-bold truncate mt-1 leading-tight">
                  {userName ? (
                    <span>
                      Ahlan wa Sahlan, <strong className={`${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-pink-400' : 'text-emerald-400'}`}>{userName}</strong>! 👋
                    </span>
                  ) : (
                    <span className="opacity-80">Guest Scholar Space</span>
                  )}
                </h3>
              </div>
            </div>

            <button
              onClick={handleStartEdit}
              type="button"
              className={`p-1.5 rounded-lg border border-current/10 hover:bg-current/5 transition-all text-current/60 hover:text-current cursor-pointer`}
              title="Personalize Profile Name"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Suggestions Section */}
      <div className={`rounded-2xl p-5 border transition-all duration-300 ${cardBgClass}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className={`w-5 h-5 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-amber-500'}`} />
          <h2 className={`text-sm font-semibold tracking-wide uppercase ${headingClass}`}>
            Trending Searches
          </h2>
        </div>
        <p className={`text-xs mb-4 leading-relaxed ${textMutedClass}`}>
          Select a high-frequency root below to reveal its complete morphological vocabulary network. 
          Use the Lexicon Tab for the full dictionary.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 max-h-[260px] overflow-y-auto pr-1">
          {QURANIC_SUGGESTIONS.map((sug) => {
            const rootBadgeClass = isParchment
              ? 'text-[#8c6239] bg-[#ebd8c3]/60 border-[#dfd2be]'
              : isCosmic
                ? 'text-indigo-400 bg-indigo-950/60 border-indigo-900/60'
                : 'text-emerald-400 bg-emerald-950/60 border-emerald-900/60';

            const activeTextClass = isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400';

            return (
              <button
                key={sug.word}
                disabled={isSearching}
                onClick={() => onSuggestionClick(sug.word)}
                className={`group flex items-start text-left p-3 rounded-xl border transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${suggestBtnClass}`}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-base font-bold font-sans tracking-wide ${isParchment ? 'text-[#2c241e]' : 'text-slate-200'}`}>
                      {sug.word}
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${rootBadgeClass}`}>
                      {sug.root}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 mt-0.5 text-xs font-medium">
                    <span className={activeTextClass}>{sug.transliteration}</span>
                    <span className={isParchment ? 'text-[#ebd8c3]' : 'text-slate-600'}>•</span>
                    <span className={isParchment ? 'text-[#4d3a2a]' : 'text-slate-300'}>{sug.concept}</span>
                  </div>
                  <div className={`mt-1 text-[10px] font-mono tracking-tight ${isParchment ? 'text-[#8a7566]' : 'text-slate-500'}`}>
                    Occurs ~{sug.frequency} times
                  </div>
                </div>
                <div className={`self-center p-1 rounded-lg ${
                  isParchment 
                    ? 'bg-[#fdfbf7] hover:bg-[#8c6239]/20 text-[#8c6239]' 
                    : isCosmic 
                      ? 'bg-indigo-950 text-indigo-400 hover:bg-indigo-900' 
                      : 'bg-slate-900 group-hover:bg-indigo-900/40 text-slate-500 group-hover:text-indigo-300'
                } transition-colors`}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Persistent Study Library: Tabs container for Saved Maps & Recent Searches */}
      <div className={`flex-1 rounded-2xl p-5 border flex flex-col min-h-[300px] transition-all duration-300 ${cardBgClass}`}>
        
        {/* Tab switch header list */}
        <div className="flex bg-current/5 p-1 rounded-xl gap-1 mb-4 border border-current/5">
          <button
            onClick={() => setNotebookTab('saved')}
            type="button"
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10.5px] font-bold tracking-tight uppercase flex items-center justify-center space-x-1.5 cursor-pointer transition-all duration-200 ${
              notebookTab === 'saved'
                ? (isParchment ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm' : isCosmic ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white')
                : 'text-current/60 hover:text-current hover:bg-current/5'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>Saved Maps ({savedMaps.length})</span>
          </button>
          <button
            onClick={() => setNotebookTab('recent')}
            type="button"
            className={`flex-1 py-1.5 px-1 rounded-lg text-[10.5px] font-bold tracking-tight uppercase flex items-center justify-center space-x-1.5 cursor-pointer transition-all duration-200 ${
              notebookTab === 'recent'
                ? (isParchment ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm' : isCosmic ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white')
                : 'text-current/60 hover:text-current hover:bg-current/5'
            }`}
          >
            <History className="w-3 h-3" />
            <span>Recents ({recentSearches.length})</span>
          </button>
        </div>

        {/* TAB 1: SAVED STUDY MAPS */}
        {notebookTab === 'saved' && (
          <div className="flex-1 flex flex-col">
            {savedMaps.length === 0 ? (
              <div className={`flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed rounded-xl ${
                isParchment 
                  ? 'border-[#dfd2be] bg-[#fdfbf7]/50' 
                  : 'border-slate-800 bg-slate-950/20'
              }`}>
                <Bookmark className={`w-7 h-7 mb-2 opacity-50 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-500'}`} />
                <h3 className={`text-xs font-semibold ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>No Saved Maps</h3>
                <p className="text-[10px] mt-1 max-w-[160px] mx-auto leading-relaxed text-slate-500">
                  Click 'Save to Notebook' to persist customized visual root networks here!
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto space-y-2 max-h-[300px] pr-1">
                {savedMaps.map((map) => {
                  const isSelected = selectedSavedId === map.id;
                  
                  let activeBorderClass = 'border-slate-800';
                  let activeBgClass = 'bg-slate-950/40 text-slate-300 hover:bg-slate-950/80 hover:border-slate-700';

                  if (isSelected) {
                    if (isParchment) {
                      activeBorderClass = 'border-[#8c6239]';
                      activeBgClass = 'bg-[#dfd3c3]/40 text-[#4c311c]';
                    } else if (isCosmic) {
                      activeBorderClass = 'border-indigo-500';
                      activeBgClass = 'bg-indigo-950/30 text-indigo-100';
                    } else {
                      activeBorderClass = 'border-emerald-800/85';
                      activeBgClass = 'bg-emerald-950/20 text-emerald-100';
                    }
                  } else {
                    if (isParchment) {
                      activeBorderClass = 'border-[#dfd2be]';
                      activeBgClass = 'bg-[#fcfbf9]/65 text-[#4d3a2a] hover:bg-white hover:border-[#8c6239]/80';
                    } else if (isCosmic) {
                      activeBorderClass = 'border-indigo-950/80';
                      activeBgClass = 'bg-slate-950/50 text-indigo-200/85 hover:bg-slate-950 hover:border-indigo-800';
                    }
                  }

                  return (
                    <div
                      key={map.id}
                      onClick={() => onSelectMap(map)}
                      className={`group relative flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${activeBorderClass} ${activeBgClass}`}
                    >
                      <div className="flex-1 min-w-0 pr-5">
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[10px] font-mono ${isParchment ? 'text-[#8a7566]' : 'text-slate-500'}`}>
                            Root:
                          </span>
                          <span className={`text-xs font-bold ${isParchment ? 'text-[#8c6239]' : 'text-emerald-400'}`}>
                            {map.analysis.root}
                          </span>
                        </div>

                        <div className="text-sm font-semibold tracking-wide mt-1 truncate">
                          {map.analysis.wordArabic}{' '}
                          <span className={`text-[11px] font-normal ${isParchment ? 'text-[#8a7566]' : 'text-slate-400'}`}>
                            ({map.searchedWord})
                          </span>
                        </div>

                        <div className={`text-[10.5px] truncate mt-0.5 ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
                          {map.analysis.meaning}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => onDeleteMap(map.id, e)}
                        className="p-1 rounded bg-black/5 hover:bg-red-950/20 hover:text-red-400 text-current/40 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 cursor-pointer"
                        title="Delete Saved Map"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECENT SEARCH LOGS */}
        {notebookTab === 'recent' && (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[9px] uppercase font-bold text-slate-500 font-mono flex items-center gap-1`}>
                <Clock className="w-3 h-3" /> Search Logs
              </span>
              {recentSearches.length > 0 && (
                <button
                  onClick={onClearRecentSearches}
                  type="button"
                  className={`text-[9.5px] font-bold text-red-400 hover:text-red-500 hover:underline cursor-pointer flex items-center space-x-1 uppercase`}
                >
                  <Trash2 className="w-3 h-3 inline mr-0.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {recentSearches.length === 0 ? (
              <div className={`flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed rounded-xl ${
                isParchment 
                  ? 'border-[#dfd2be] bg-[#fdfbf7]/50' 
                  : 'border-slate-800 bg-slate-950/20'
              }`}>
                <Clock className={`w-7 h-7 mb-2 opacity-50 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-500'}`} />
                <h3 className={`text-xs font-semibold ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>No Recents</h3>
                <p className="text-[10px] mt-1 max-w-[160px] mx-auto leading-relaxed text-slate-500">
                  Whenever you search for custom nouns, verbs, or roots, they populate in this section for fast reloading!
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto space-y-2 max-h-[300px] pr-1">
                {recentSearches.map((item) => {
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSuggestionClick(item.word)}
                      className={`group relative flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                        isParchment
                          ? 'border-[#ebdcc3] bg-[#fdfbf7] hover:border-[#8c6239] text-[#2c241e]'
                          : isCosmic
                            ? 'border-indigo-950/60 bg-black/40 hover:border-indigo-800'
                            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2 space-x-reverse justify-end md:justify-start min-w-0 flex-1 pr-6">
                        <span className="text-sm font-bold font-serif px-1 inline-block text-amber-500">
                          {item.word}
                        </span>
                        <span className={`text-[10.5px] font-mono opacity-70 truncate block`}>
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => onDeleteRecentSearch(item.id, e)}
                        className="p-1 rounded bg-black/5 hover:bg-red-950/20 hover:text-red-400 text-current/40 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 cursor-pointer"
                        title="Delete keyword logs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
