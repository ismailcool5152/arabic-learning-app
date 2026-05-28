import React, { useState, useEffect } from 'react';
import { WordAnalysis, SavedWordMap, RecentSearch, LayoutTheme, LayoutMode } from './types';
import MindMapCanvas from './components/MindMapCanvas';
import SavedMapsSidebar from './components/SavedMapsSidebar';
import WordDetailCards from './components/WordDetailCards';
import ArabicVirtualKeyboard from './components/ArabicVirtualKeyboard';
import PatternDatabase from './components/PatternDatabase';
import RootFormsTable from './components/RootFormsTable';
import HurufLibrary from './components/HurufLibrary';
import QuranicLexicon from './components/QuranicLexicon';
import RootToWords from './components/RootToWords';
import ArabicBasics from './components/ArabicBasics';
import AsmaAlHusna from './components/AsmaAlHusna';
import HurufulHija from './components/HurufulHija';
import { findOfflineFallback, generateDynamicOfflineFallback } from './offlineData';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Loader2, 
  AlertCircle, 
  HelpCircle,
  TrendingUp,
  RotateCcw,
  BookMarked,
  Keyboard,
  Database,
  Milestone,
  Calendar,
  Columns,
  Rows,
  Layout,
  Wifi,
  WifiOff,
  GitBranch,
  Compass,
  Award,
  User,
  Edit2,
  Check,
  X,
  FileText
} from 'lucide-react';
import { QURANIC_SUGGESTIONS } from './components/SavedMapsSidebar';
import ProductDoc from './components/ProductDoc';
import DriveSettings from './components/DriveSettings';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showArabicKeyboard, setShowArabicKeyboard] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<'hija' | 'basics' | 'huruf' | 'database' | 'root' | 'map' | 'names' | 'lexicon' | 'doc'>('hija');
  const [selectedRoot, setSelectedRoot] = useState<string>('');
  
  // Layout Arrangement Mode selection
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    try {
      const saved = localStorage.getItem('quranic_arabic_layout_mode');
      if (saved === 'vertical' || saved === 'horizontal' || saved === 'mix') {
        return saved;
      }
    } catch (e) {
      console.error("Failed to load layout mode:", e);
    }
    return 'horizontal';
  });

  // UI Scale
  const [uiScale, setUiScale] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('quranic_arabic_ui_scale');
      if (saved) return parseFloat(saved);
      return 1;
    } catch {
      return 1;
    }
  });

  const handleUiScaleChange = (scale: number) => {
    setUiScale(scale);
    try {
      localStorage.setItem('quranic_arabic_ui_scale', scale.toString());
    } catch (e) {
      // Ignored
    }
  };

  useEffect(() => {
    // Reset to default just in case. We apply uiScale via CSS zoom on the specific sections.
    document.documentElement.style.fontSize = '16px';
  }, []);

  // Container Width
  const [containerWidth, setContainerWidth] = useState<'standard' | 'wide' | 'full'>(() => {
    try {
      const saved = localStorage.getItem('quranic_arabic_container_width');
      if (saved === 'standard' || saved === 'wide' || saved === 'full') return saved;
      return 'standard';
    } catch {
      return 'standard';
    }
  });

  const handleContainerWidthChange = (width: 'standard' | 'wide' | 'full') => {
    setContainerWidth(width);
    try {
      localStorage.setItem('quranic_arabic_container_width', width);
    } catch (e) {
      // Ignored
    }
  };

  const maxWidthClass = containerWidth === 'full' ? 'max-w-full px-2 md:px-8' : containerWidth === 'wide' ? 'max-w-[1600px] px-4 md:px-6' : 'max-w-7xl px-4 md:px-6';

  // Naming & Search History local persistence states
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem('quranic_arabic_username') || '';
    } catch {
      return '';
    }
  });

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    try {
      const stored = localStorage.getItem('quranic_arabic_recent_searches');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Loaded analysis result
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  
  // Selected detail node in the mind map
  const [selectedNode, setSelectedNode] = useState<{ type: string; id: string; data: any } | null>(null);
  
  // Saved mind maps persisted in localStorage
  const [savedMaps, setSavedMaps] = useState<SavedWordMap[]>([]);

  // Premium design theme choice
  const [theme, setTheme] = useState<LayoutTheme>(() => {
    try {
      const saved = localStorage.getItem('quranic_arabic_app_theme');
      if (saved === 'emerald' || saved === 'cosmic' || saved === 'parchment') {
        return saved;
      }
    } catch (e) {
      console.error("Failed to load theme:", e);
    }
    return 'emerald';
  });

  // Offline Study Mode Toggle state
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quranic_arabic_offline_mode') === 'true';
    } catch {
      return false;
    }
  });

  const handleModeChange = (offlineValue: boolean) => {
    setIsOfflineMode(offlineValue);
    try {
      localStorage.setItem('quranic_arabic_offline_mode', String(offlineValue));
    } catch (e) {
      console.error("Failed to persist offline mode:", e);
    }
  };

  // Custom User API Key (Optional)
  const [customApiKey, setCustomApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('quranic_arabic_custom_api_key') || '';
    } catch {
      return '';
    }
  });

  const handleCustomApiKeyChange = (key: string) => {
    setCustomApiKey(key);
    try {
      localStorage.setItem('quranic_arabic_custom_api_key', key);
    } catch (e) {
      console.error("Failed to persist custom API key:", e);
    }
  };

  const handleSaveUserName = (name: string) => {
    setUserName(name);
    try {
      localStorage.setItem('quranic_arabic_username', name);
    } catch (e) {
      console.error("Failed to save username:", e);
    }
  };

  const handleAddRecentSearch = (word: string) => {
    if (!word || !word.trim()) return;
    const cleanWord = word.trim();

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.word !== cleanWord);
      const newSearch: RecentSearch = {
        id: Math.random().toString(36).substring(2, 9),
        word: cleanWord,
        timestamp: new Date().toISOString()
      };
      const updated = [newSearch, ...filtered].slice(0, 15); // limit to 15 searches
      try {
        localStorage.setItem('quranic_arabic_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recent searches:", e);
      }
      return updated;
    });
  };

  const handleDeleteRecentSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('quranic_arabic_recent_searches', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to delete search from list:", e);
      }
      return updated;
    });
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.setItem('quranic_arabic_recent_searches', JSON.stringify([]));
    } catch (e) {
      console.error("Failed to clear search list:", e);
    }
  };

  const handleThemeChange = (newTheme: LayoutTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('quranic_arabic_app_theme', newTheme);
    } catch (e) {
      console.error("Failed to persist theme:", e);
    }
  };

  const handleLayoutModeChange = (newLayout: LayoutMode) => {
    setLayoutMode(newLayout);
    try {
      localStorage.setItem('quranic_arabic_layout_mode', newLayout);
    } catch (e) {
      console.error("Failed to persist layout mode:", e);
    }
  };

  // Load saved mind maps on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('quranic_arabic_saved_maps');
      if (stored) {
        setSavedMaps(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved maps from local storage:", e);
    }
  }, []);

  // Save map state whenever it changes
  const persistSavedMaps = (updated: SavedWordMap[]) => {
    setSavedMaps(updated);
    try {
      localStorage.setItem('quranic_arabic_saved_maps', JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist saved maps to local storage:", e);
    }
  };

  // Trigger search API call
  const handleSearch = async (wordToSearch: string) => {
    if (!wordToSearch.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setSelectedNode(null);

    // If offline mode is activated, process immediately client-side
    if (isOfflineMode) {
      setTimeout(() => {
        try {
          const offlineMatch = findOfflineFallback(wordToSearch);
          let result: WordAnalysis;
          if (offlineMatch) {
            result = { ...offlineMatch, isOfflineFallback: true } as any;
          } else {
            result = { ...generateDynamicOfflineFallback(wordToSearch), isOfflineFallback: true } as any;
          }
          setAnalysis(result);
          handleAddRecentSearch(wordToSearch);
        } catch (err: any) {
          console.error("Local Search Error:", err);
          setError(err.message || 'An unexpected error occurred during offline academic parsing.');
        } finally {
          setIsSearching(false);
        }
      }, 350); // Premium visual transition delay
      return;
    }

    try {
      const response = await fetch('/api/analyze-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: wordToSearch, customApiKey }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server returned an error analyzing the Arabic word.');
      }

      const result: WordAnalysis = await response.json();
      setAnalysis(result);
      
      // Successfully parsed, record in search logs
      handleAddRecentSearch(wordToSearch);
    } catch (err: any) {
      console.error("Search API Error:", err);
      // Fallback locally even if API fails and user is in Online Mode
      try {
        const offlineMatch = findOfflineFallback(wordToSearch);
        const result = (offlineMatch 
          ? { ...offlineMatch, isOfflineFallback: true }
          : { ...generateDynamicOfflineFallback(wordToSearch), isOfflineFallback: true }) as any;
        setAnalysis(result);
        handleAddRecentSearch(wordToSearch);
      } catch (fallbackErr) {
        setError(err.message || 'An unexpected connection error occurred. Please verify GEMINI_API_KEY is configured.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  // Node selection triggers from the Mind Map canvas
  const handleNodeClick = (node: { type: string; data: any }) => {
    // Generate simple ID based on matching types
    let id = 'search-word';
    if (node.type === 'root') id = 'root';
    else if (node.type === 'explanation') id = 'root-meaning-concept';
    
    setSelectedNode({
      type: node.type,
      id: id,
      data: node.data
    });
  };

  // Toggle saving current mind map to user notebook
  const isCurrentMapSaved = analysis 
    ? savedMaps.some(map => map.searchedWord.toLowerCase() === analysis.word.toLowerCase() || map.analysis.root === analysis.root) 
    : false;

  const handleSaveCurrentMap = () => {
    if (!analysis) return;
    
    if (isCurrentMapSaved) {
      // Unsaves/Removes
      const updated = savedMaps.filter(map => map.analysis.root !== analysis.root);
      persistSavedMaps(updated);
    } else {
      // Saves
      const newSaved: SavedWordMap = {
        id: Math.random().toString(36).substring(2, 9),
        searchedWord: analysis.word,
        savedAt: new Date().toISOString(),
        analysis: analysis
      };
      persistSavedMaps([...savedMaps, newSaved]);
    }
  };

  const handleDeleteSavedMap = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedMaps.filter(map => map.id !== id);
    persistSavedMaps(updated);
  };

  const handleSelectSavedMap = (map: SavedWordMap) => {
    setAnalysis(map.analysis);
    setSelectedNode(null);
  };

  // Determine Word of the Day
  const wordOfTheDay = React.useMemo(() => {
    // A simple daily stable index
    const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const index = daysSinceEpoch % QURANIC_SUGGESTIONS.length;
    return QURANIC_SUGGESTIONS[index].word;
  }, []);

  // Load a demonstration root so the page doesn't look empty at startup
  useEffect(() => {
    handleSearch(wordOfTheDay);
  }, [wordOfTheDay]);

  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Body and theme states mapper
  const parentContainerClass = isParchment
    ? 'min-h-screen bg-[#faf5ec] text-[#2c241e] flex flex-col font-sans selection:bg-[#dfd3c3] selection:text-[#5c3d2e]'
    : isCosmic
      ? 'min-h-screen bg-[#05060f] text-indigo-50 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-100'
      : 'min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-100';

  const headerBorderBgClass = isParchment
    ? 'border-[#ebdcc3] bg-[#fbf9f4]/85 text-[#2c241e]'
    : isCosmic
      ? 'border-indigo-950 bg-[#05060f]/80 text-slate-50'
      : 'border-slate-900 bg-slate-950/80 text-slate-100';

  const logoIconBgClass = isParchment
    ? 'bg-[#ebd8c3]/40 border-[#8c6239]/30 text-[#8c6239]'
    : isCosmic
      ? 'bg-indigo-950 border border-indigo-500/40 text-indigo-400'
      : 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/35 text-emerald-400';

  const badgeClass = isParchment
    ? 'text-[#8c6239] bg-[#ebd8c3]/40 border-[#dfd2be]'
    : isCosmic
      ? 'text-pink-400 bg-pink-950/60 border-pink-900/60'
      : 'text-emerald-400 bg-emerald-950/80 border-emerald-900/60';

  const renderSidebar = () => (
    <SavedMapsSidebar
      savedMaps={savedMaps}
      selectedSavedId={analysis ? savedMaps.find(m => m.analysis.root === analysis.root)?.id || null : null}
      onSelectMap={handleSelectSavedMap}
      onDeleteMap={handleDeleteSavedMap}
      onSuggestionClick={(word) => {
        setSearchTerm(word);
        handleSearch(word);
      }}
      isSearching={isSearching}
      theme={theme}
      layoutMode={layoutMode}
      recentSearches={recentSearches}
      onDeleteRecentSearch={handleDeleteRecentSearch}
      onClearRecentSearches={handleClearRecentSearches}
    />
  );

  const renderWorkspace = () => (
    <div className="space-y-6 flex-1 w-full">
      {/* Main Visualizer vs Pattern Codex Tab Switcher */}
      <div className="w-full overflow-x-auto pb-1 scrollbar-none">
        <div className="flex bg-current/5 border border-current/10 p-1.5 rounded-2xl w-max min-w-full gap-1 items-center">
          
          {/* STEP 1: Hurūf-ul-Hijā */}
          <button
            onClick={() => setActiveMainTab('hija')}
            type="button"
            className={`shrink-0 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeMainTab === 'hija'
                ? (isParchment
                    ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm'
                    : isCosmic
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40')
                : (isParchment
                    ? 'text-[#705e52] hover:bg-[#ebd8c3]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5')
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="flex items-center gap-1">
              <span className="opacity-50 font-mono text-[10px]">1.</span> Hurūf-ul-Hijā (Makhārij)
            </span>
          </button>

          <span className="text-slate-600 font-mono text-[11px] select-none shrink-0 px-0.5">➜</span>

          {/* STEP 2: Arabic Basics */}
          <button
            onClick={() => setActiveMainTab('basics')}
            type="button"
            className={`shrink-0 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeMainTab === 'basics'
                ? (isParchment
                    ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm'
                    : isCosmic
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40')
                : (isParchment
                    ? 'text-[#705e52] hover:bg-[#ebd8c3]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5')
            }`}
          >
            <Compass className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="flex items-center gap-1">
              <span className="opacity-50 font-mono text-[10px]">2.</span> Arabic Basics
            </span>
          </button>

          <span className="text-slate-600 font-mono text-[11px] select-none shrink-0 px-0.5">➜</span>

          {/* STEP 3: Hurūf Library */}
          <button
            onClick={() => setActiveMainTab('huruf')}
            type="button"
            className={`shrink-0 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeMainTab === 'huruf'
                ? (isParchment
                    ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm'
                    : isCosmic
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40')
                : (isParchment
                    ? 'text-[#705e52] hover:bg-[#ebd8c3]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5')
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="flex items-center gap-1">
              <span className="opacity-50 font-mono text-[10px]">3.</span> Hurūf & Particles
            </span>
          </button>

          <span className="text-slate-600 font-mono text-[11px] select-none shrink-0 px-0.5">➜</span>

          {/* STEP 4: Pattern DB */}
          <button
            onClick={() => setActiveMainTab('database')}
            type="button"
            className={`shrink-0 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeMainTab === 'database'
                ? (isParchment
                    ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm'
                    : isCosmic
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40')
                : (isParchment
                    ? 'text-[#705e52] hover:bg-[#ebd8c3]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5')
            }`}
          >
            <Database className="w-4 h-4" />
            <span className="flex items-center gap-1">
              <span className="opacity-50 font-mono text-[10px]">4.</span> Patterns Codex & DB
            </span>
          </button>

          <span className="text-slate-600 font-mono text-[11px] select-none shrink-0 px-0.5">➜</span>

          {/* STEP 5: Root Synthesizer */}
          <button
            onClick={() => setActiveMainTab('root')}
            type="button"
            className={`shrink-0 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeMainTab === 'root'
                ? (isParchment
                    ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm'
                    : isCosmic
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40')
                : (isParchment
                    ? 'text-[#705e52] hover:bg-[#ebd8c3]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5')
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span className="flex items-center gap-1">
              <span className="opacity-50 font-mono text-[10px]">5.</span> Root-to-Words Gen
            </span>
          </button>

          <span className="text-slate-600 font-mono text-[11px] select-none shrink-0 px-0.5">➜</span>

          {/* STEP 6: Names of Allah */}
          <button
            onClick={() => setActiveMainTab('names')}
            type="button"
            className={`shrink-0 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeMainTab === 'names'
                ? (isParchment
                    ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm'
                    : isCosmic
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40')
                : (isParchment
                    ? 'text-[#705e52] hover:bg-[#ebd8c3]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5')
            }`}
          >
            <Award className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="flex items-center gap-1">
              <span className="opacity-50 font-mono text-[10px]">6.</span> 100 Names of Allah
            </span>
          </button>

          <span className="text-slate-600 font-mono text-[11px] select-none shrink-0 px-0.5">➜</span>

          {/* STEP 7: Offline Lexicon */}
          <button
            onClick={() => setActiveMainTab('lexicon')}
            type="button"
            className={`shrink-0 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeMainTab === 'lexicon'
                ? (isParchment
                    ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm'
                    : isCosmic
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40')
                : (isParchment
                    ? 'text-[#705e52] hover:bg-[#ebd8c3]/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5')
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="flex items-center gap-1">
              <span className="opacity-50 font-mono text-[10px]">7.</span> Lexicon Dictionary
            </span>
          </button>

          {!isOfflineMode && (
            <>
              <span className="text-slate-600 font-mono text-[11px] select-none shrink-0 px-0.5">➜</span>

              {/* STEP 8: Word Search & Analysis */}
              <button
                onClick={() => setActiveMainTab('map')}
                type="button"
                className={`shrink-0 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeMainTab === 'map'
                    ? (isParchment
                        ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm'
                        : isCosmic
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                          : 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40')
                    : (isParchment
                        ? 'text-[#705e52] hover:bg-[#ebd8c3]/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5')
                }`}
              >
                <Search className="w-4 h-4" />
                <span className="flex items-center gap-1">
                  <span className="opacity-50 font-mono text-[10px]">8.</span> Word Search & Analysis
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Render activeMainTab panel */}
      <div style={{ zoom: uiScale }}>
      {activeMainTab === 'hija' ? (
        <div className="animate-fadeIn">
          <HurufulHija theme={theme} />
        </div>
      ) : activeMainTab === 'basics' ? (
        <div className="animate-fadeIn">
          <ArabicBasics theme={theme} />
        </div>
      ) : activeMainTab === 'database' ? (
        <div className="animate-fadeIn">
          <PatternDatabase
            currentAnalysis={analysis}
            savedMaps={savedMaps}
            theme={theme}
            onSelectPatternExample={(word) => {
              setSearchTerm(word);
              setActiveMainTab('map');
              handleSearch(word);
            }}
          />
        </div>
      ) : activeMainTab === 'root' ? (
        <div className="animate-fadeIn">
          <RootToWords
            theme={theme}
            initialRoot={selectedRoot}
            isOfflineMode={isOfflineMode}
            onSelectWord={(word) => {
              setSearchTerm(word);
              setActiveMainTab('map');
              handleSearch(word);
            }}
          />
        </div>
      ) : activeMainTab === 'names' ? (
        <div className="animate-fadeIn">
          <AsmaAlHusna
            theme={theme}
            onSelectRoot={(root) => {
              setSelectedRoot(root);
              setActiveMainTab('root');
            }}
            onSelectWord={(word) => {
              setSearchTerm(word);
              setActiveMainTab('map');
              handleSearch(word);
            }}
          />
        </div>
      ) : activeMainTab === 'huruf' ? (
        <div className="animate-fadeIn">
          <HurufLibrary theme={theme} />
        </div>
      ) : activeMainTab === 'lexicon' ? (
        <div className="animate-fadeIn">
          <QuranicLexicon 
            theme={theme} 
            onSearch={(word) => {
              setSearchTerm(word);
              setActiveMainTab('map');
              handleSearch(word);
            }} 
          />
        </div>
      ) : activeMainTab === 'doc' ? (
        <div className="animate-fadeIn">
          <ProductDoc theme={theme} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Search Bar (Moved from Header) */}
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full max-w-3xl mx-auto flex items-center relative">
            <div className="relative flex-1 min-w-[240px]">
              <Search className={`absolute left-4 top-3.5 h-5 w-5 ${isParchment ? 'text-[#8c6239]/80' : 'text-slate-500'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search (e.g. سَجَدَ, كَتَابَ, عَلِمَ) to generate Sarf Map..."
                className={`w-full font-medium rounded-2xl py-3.5 pl-12 pr-24 text-base focus:outline-none transition-all border shadow-sm ${
                  isParchment
                    ? 'bg-[#fdfbf7] border-[#ebdcc3] text-[#2c241e] placeholder-[#a68c6d] focus:border-[#8c6239] focus:ring-2 focus:ring-[#8c6239]/20'
                    : isCosmic
                      ? 'bg-black border-indigo-950 text-indigo-50 placeholder-indigo-200/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30'
                }`}
                disabled={isSearching}
              />
              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowArabicKeyboard(!showArabicKeyboard)}
                  className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                    showArabicKeyboard
                      ? (isParchment ? 'bg-[#ebd8c3]/80 text-[#8c6239]' : isCosmic ? 'bg-[#1b1e36] text-pink-400' : 'bg-[#0f2d1e] text-emerald-400')
                      : (isParchment ? 'hover:bg-[#ebd8c3]/40 text-[#a68c6d]' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200')
                  }`}
                  title="Arabic Keyboard Toggle"
                >
                  <Keyboard className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={isSearching || !searchTerm.trim()}
                  className={`p-2 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:pointer-events-none ${
                    isParchment
                      ? 'bg-[#8c6239] text-[#faf6ed] hover:bg-[#a67c52]'
                      : isCosmic
                        ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-950/50'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-950/40'
                  }`}
                  title="Search & Analyze"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Top Banner Status Bar */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 ${
            isParchment 
              ? 'bg-[#f4ebe1] border-[#ebdcc3] text-[#2c241e]' 
              : isCosmic 
                ? 'bg-slate-950/80 border-indigo-950 text-indigo-50' 
                : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div>
              <h2 className={`text-xs font-semibold tracking-wide uppercase flex items-center ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
                {analysis && wordOfTheDay === analysis.wordArabic ? (
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full ${isParchment ? 'bg-[#ebd8c3] text-[#8c6239]' : isCosmic ? 'bg-indigo-950 text-indigo-400' : 'bg-emerald-950 text-emerald-400'}`}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Word of the Day</span>
                  </span>
                ) : (
                  <>
                    <TrendingUp className={`w-4 h-4 mr-2 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'}`} /> Current Active Exploration
                  </>
                )}
              </h2>
              {analysis ? (
                <div className="text-base mt-2 flex flex-wrap items-center gap-2">
                  <span className={`font-bold text-xl ${isParchment ? 'text-[#2c241e]' : isCosmic ? 'text-pink-400' : 'text-emerald-400'}`}>{analysis.wordArabic}</span>
                  <span className={isParchment ? 'text-[#ebdcc3] font-serif' : 'text-slate-600 font-serif'}>/</span>
                  <span className={`font-mono text-sm font-medium ${isParchment ? 'text-[#4d3a2a]' : 'text-slate-300'}`}>{analysis.wordTransliteration}</span>
                  <span className={isParchment ? 'text-[#ebdcc3]' : 'text-slate-700'}>•</span>
                  <span className={`text-xs font-sans tracking-wide ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
                    Root: 
                    <span className={`font-mono px-2 py-0.5 rounded border ml-1 ${
                      isParchment 
                        ? 'text-[#8c6239] bg-[#fdfbf7] border-[#dfd2be]' 
                        : isCosmic 
                          ? 'text-cyan-300 bg-[#05060f] border-indigo-900/60' 
                          : 'text-emerald-300 bg-slate-950 border-slate-800'
                    }`}>
                      {analysis.root}
                    </span>
                  </span>
                  {analysis.isOfflineFallback ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border ml-2 bg-[#1e1305] border-amber-900/40 text-amber-500 font-semibold" title="Local system backups active">
                      Offline Mode
                    </span>
                  ) : (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ml-2 font-semibold ${
                      isParchment 
                        ? 'bg-[#ebd8c3]/40 text-[#8c6239] border-[#dfd2be]' 
                        : isCosmic 
                          ? 'bg-indigo-950/60 text-indigo-400 border-indigo-900/60' 
                          : 'bg-emerald-950/60 text-emerald-400 border-emerald-900/60'
                    }`} title="Active API model">
                      AI Active
                    </span>
                  )}
                </div>
              ) : (
                <p className={`text-sm mt-1.5 ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>Search or choose a Quranic word suggestion to begin map generation.</p>
              )}
            </div>

            {/* Quick Action Saved State Buttons */}
            {analysis && (
              <button
                onClick={handleSaveCurrentMap}
                className={`flex items-center space-x-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all border
                  ${isCurrentMapSaved 
                    ? (isParchment 
                        ? 'bg-[#ebd8c3] hover:bg-[#dfd3c3] border-[#8c6239] text-[#5c3d2e]' 
                        : isCosmic 
                          ? 'bg-indigo-950/60 border-cyan-800 text-cyan-300 hover:bg-indigo-900/40' 
                          : 'bg-emerald-950/40 hover:bg-emerald-950/70 border-emerald-800 text-emerald-300')
                    : (isParchment 
                        ? 'bg-transparent border-[#ebdcc3] text-[#705e52] hover:bg-[#ede3d5] hover:text-[#2c241e]' 
                        : isCosmic 
                          ? 'bg-[#05060f] hover:bg-indigo-950/40 border-indigo-950 text-indigo-300' 
                          : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300')
                  }
                `}
              >
                {isCurrentMapSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Saved in Notebook</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save to Notebook</span>
                  </>
                )}
              </button>
            )}
          </div>

          {analysis && (isOfflineMode || analysis.isOfflineFallback) && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 transition-all duration-300 animate-fadeIn ${
              isParchment 
                ? 'bg-[#faf6ed] border-amber-300 text-[#5c3d2e]' 
                : isCosmic 
                  ? 'bg-slate-950/90 border-amber-900/60 text-amber-100 shadow-indigo-950/15' 
                  : 'bg-[#1e1305] border-amber-900/40 text-amber-200'
            }`}>
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold uppercase tracking-wider text-[10px] text-amber-500">
                  {isOfflineMode ? "Offline Mode Reader Active" : "Offline Study Engine Active"}
                </p>
                <p className="opacity-95 leading-relaxed font-sans">
                  {isOfflineMode 
                    ? "Searching in the precompiled local Quranic lexicon! All root derivations and patterns are analyzed instantly in-browser without sending network requests." 
                    : "The online Gemini rate limit was reached (20 daily requests limit). We have activated our localized academic lexicon and morphological shape estimator to keep your study circles fully active and uninterrupted!"}
                </p>
              </div>
            </div>
          )}

          {/* Canvas Display Port or Empty State Handle */}
          {isSearching ? (
            <div className={`w-full aspect-[800/550] rounded-2xl flex flex-col items-center justify-center space-y-4 p-8 relative overflow-hidden transition-all duration-300 border ${
              isParchment
                ? 'bg-[#faf6ed] border-[#ebdcc3] text-[#2c241e] shadow-md'
                : isCosmic
                  ? 'bg-[#05060f] border-indigo-950/80 text-indigo-50 shadow-indigo-950/15'
                  : 'bg-slate-950 border-slate-800 text-slate-100 shadow-xl'
            }`}>
              <div className={`absolute inset-0 pointer-events-none ${
                isParchment
                  ? 'bg-[linear-gradient(to_right,#eedecc_1px,transparent_1px),linear-gradient(to_bottom,#eedecc_1px,transparent_1px)] opacity-50'
                  : isCosmic
                    ? 'bg-[linear-gradient(to_right,#13113c_1px,transparent_1px),linear-gradient(to_bottom,#13113c_1px,transparent_1px)] opacity-60'
                    : 'bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] opacity-40'
              }`} />
              
              {/* Spinner loader circles */}
              <div className="relative flex items-center justify-center">
                <Loader2 className={`w-12 h-12 animate-spin ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-500'}`} />
                <BookOpen className={`w-5 h-5 absolute ${isParchment ? 'text-[#a68c6d]' : 'text-emerald-300'}`} />
              </div>
              <div className="text-center max-w-sm space-y-1 z-10">
                <h3 className={`text-sm font-semibold ${isParchment ? 'text-[#2c241e]' : 'text-slate-200'}`}>Deconstructing Arabic Roots...</h3>
                <p className={`text-xs leading-relaxed font-sans ${isParchment ? 'text-[#705e52]' : 'text-slate-500'}`}>
                  Our Quranic morphology engine is locating the classical Triliteral Root, parsing vowel inflections, and searching relevant verses.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full p-8 bg-red-950/20 border border-red-900/60 rounded-2xl flex items-start space-x-3.5 shadow-xl">
              <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-red-200">Analysis Fetch Failed</h4>
                <p className="text-xs text-red-300/80 leading-relaxed">
                  {error}
                </p>
                <div className="pt-2 text-[10.5px] text-slate-500">
                  Tip: Verify your <code className="font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">GEMINI_API_KEY</code> is correctly in place. Try typing standard words like <strong>سَجَدَ</strong> or <strong>عَلِمَ</strong>.
                </div>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Conditional grid/stacked block depending on whether layoutMode is 'mix' */}
              {layoutMode === 'mix' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Interactive Mind Map takes larger width */}
                  <div className="lg:col-span-7 xl:col-span-8 w-full">
                    <MindMapCanvas
                      analysis={analysis}
                      onNodeClick={handleNodeClick}
                      selectedNode={selectedNode}
                      onExploreWord={(word) => {
                        setSearchTerm(word);
                        handleSearch(word);
                      }}
                      theme={theme}
                    />
                  </div>

                  {/* Right: Word details panel context on identical plane! */}
                  <div className="lg:col-span-5 xl:col-span-4 w-full">
                    <WordDetailCards
                      analysis={analysis}
                      selectedNode={selectedNode}
                      onExploreWord={(word) => {
                        setSearchTerm(word);
                        handleSearch(word);
                      }}
                      theme={theme}
                    />
                  </div>

                </div>
              ) : (
                <>
                  {/* Full-width interactive classical mind map canvas */}
                  <div className="w-full">
                    <MindMapCanvas
                      analysis={analysis}
                      onNodeClick={handleNodeClick}
                      selectedNode={selectedNode}
                      onExploreWord={(word) => {
                        setSearchTerm(word);
                        handleSearch(word);
                      }}
                      theme={theme}
                    />
                  </div>

                  {/* Dynamic Searched Word Analysis detailed panel pushed below the map */}
                  <div className="w-full">
                    <WordDetailCards
                      analysis={analysis}
                      selectedNode={selectedNode}
                      onExploreWord={(word) => {
                        setSearchTerm(word);
                        handleSearch(word);
                      }}
                      theme={theme}
                    />
                  </div>
                </>
              )}

              {/* Comprehensive Root Derivatives & Patterns Table */}
              <RootFormsTable
                analysis={analysis}
                theme={theme}
                onExploreWord={(word) => {
                  setSearchTerm(word);
                  setActiveMainTab('map');
                  handleSearch(word);
                }}
              />
            </div>
          ) : (
            <div className={`w-full h-[550px] rounded-2xl border flex flex-col items-center justify-center p-8 relative overflow-hidden text-center transition-all duration-300 ${
              isParchment
                ? 'bg-[#faf6ed] border-[#ebdcc3] text-[#2c241e] shadow-md'
                : isCosmic
                  ? 'bg-[#05060f] border-indigo-950/80 text-indigo-50 shadow-indigo-950/15'
                  : 'bg-slate-950 border-slate-800 text-slate-100 shadow-xl'
            }`}>
              <div className={`absolute inset-0 pointer-events-none ${
                isParchment
                  ? 'bg-[linear-gradient(to_right,#eedecc_1px,transparent_1px),linear-gradient(to_bottom,#eedecc_1px,transparent_1px)] opacity-50'
                  : isCosmic
                    ? 'bg-[linear-gradient(to_right,#13113c_1px,transparent_1px),linear-gradient(to_bottom,#13113c_1px,transparent_1px)] opacity-60'
                    : 'bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] opacity-40'
              }`} />
              <BookMarked className={`w-12 h-12 mb-3 ${isParchment ? 'text-[#ebd8c3]' : 'text-slate-700'}`} />
              <h3 className={`text-sm font-bold ${isParchment ? 'text-[#2c241e]' : 'text-slate-400'}`}>Quranic Root Mind Map</h3>
              <p className={`text-xs max-w-sm mt-1 leading-relaxed ${isParchment ? 'text-[#705e52]' : 'text-slate-500'}`}>
                Type an Arabic word into the analyzer above, or open the Lexicon Tab to browse over 100 classical roots and visualize their morphology.
              </p>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );

  return (
    <div className={`${parentContainerClass} relative min-h-screen overflow-x-hidden`}>
      {/* Immersive Scholar Motif Underlay */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-700 select-none ${
        isParchment
          ? 'bg-[radial-gradient(#8c6239_1.2px,transparent_1.2px)] [background-size:28px_28px] opacity-[0.04]'
          : isCosmic
            ? 'bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05]'
            : 'bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035]'
      }`} />
      
      {/* Decorative Aura Accent Gradients */}
      <div className={`absolute -top-48 left-1/4 w-96 h-96 rounded-full filter blur-[100px] pointer-events-none transition-all duration-700 select-none ${
        isParchment
          ? 'bg-[#ebd8c3]/15'
          : isCosmic
            ? 'bg-purple-900/10'
            : 'bg-emerald-900/10'
      }`} />
      <div className={`absolute -bottom-48 right-1/4 w-96 h-96 rounded-full filter blur-[120px] pointer-events-none transition-all duration-700 select-none ${
        isParchment
          ? 'bg-[#8c6239]/5'
          : isCosmic
            ? 'bg-indigo-900/10'
            : 'bg-teal-900/5'
      }`} />
      
      {/* Premium Quranic Header Navigation */}
      <header className={`border-b backdrop-blur-md sticky top-0 z-50 px-6 py-4 transition-all duration-300 ${headerBorderBgClass}`}>
        <div className={`${maxWidthClass} mx-auto flex flex-col gap-4`}>
          
          {/* Row 1: Logo (Left) and Top-Right Utilities (Study Circle & Search Form on Right) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            
            {/* Logo Brand Details */}
            <div className="flex items-center space-x-3 self-start md:self-auto">
              <div className={`p-2.5 rounded-xl border transition-all duration-300 ${logoIconBgClass}`}>
                <BookOpen className="w-6 h-6" />
              </div>
              <h1 className={`text-base font-bold tracking-tight ${isParchment ? 'text-[#2c241e]' : 'text-white'}`}>
                Baseer <span className={isParchment ? 'text-[#8c6239] font-semibold' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'}>Bayan</span>
              </h1>
            </div>

            {/* Top-Right Corner Utilities */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 select-none">
              
              <button
                onClick={() => setActiveMainTab('doc')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer ${
                  activeMainTab === 'doc'
                    ? (isParchment ? 'bg-[#8c6239] text-white border-[#8c6239]' : isCosmic ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-emerald-600 border-emerald-500 text-white')
                    : (isParchment ? 'bg-[#ebd8c3]/35 border-[#dfd2be]/80 text-[#2c241e] hover:bg-[#ebd8c3]/60' : isCosmic ? 'bg-indigo-950/35 border-indigo-950/80 text-indigo-100 hover:bg-indigo-900/50' : 'bg-slate-900/60 border-slate-800/80 text-slate-100 hover:bg-slate-800/60')
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Architecture Doc</span>
              </button>

              {/* Personal Study Circle widget connected to Drive Sync */}
              <DriveSettings theme={theme} />
            </div>
          </div>

          {/* Row 2: Allign these things into one horizontal line Theme, Layout, engine and AI Model */}
          <div className={`flex flex-col md:flex-row md:items-center justify-between gap-3 w-full border-t pt-3 rounded-xl ${
            isParchment ? 'border-[#dfd2be]/40' : (isCosmic ? 'border-indigo-950/80' : 'border-slate-800/40')
          }`}>
            
            {/* Left aligned widgets: Theme & Layout */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Theme Selector Widget */}
              <div className={`flex items-center space-x-1.5 p-1 rounded-xl border transition-all duration-300 ${
                isParchment 
                  ? 'bg-[#ebd8c3]/30 border-[#dfd2be]/80' 
                  : isCosmic 
                    ? 'bg-indigo-950/30 border-indigo-950/80' 
                    : 'bg-slate-900/60 border-slate-800/80'
              }`}>
                <span className={`text-[9px] font-mono font-bold uppercase px-1.5 select-none ${isParchment ? 'text-[#8c6239]' : 'text-slate-500'}`}>
                  Theme:
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => handleThemeChange('emerald')}
                    type="button"
                    className={`text-[11px] px-2 py-1 rounded-lg font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                      theme === 'emerald'
                        ? 'bg-emerald-600/35 border border-emerald-500/50 text-emerald-300 shadow-sm'
                        : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                    title="Emerald Sanctuary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Emerald</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange('cosmic')}
                    type="button"
                    className={`text-[11px] px-2 py-1 rounded-lg font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                      theme === 'cosmic'
                        ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 shadow-sm'
                        : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300'
                    }`}
                    title="Cosmic Midnight"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>Cosmic</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange('parchment')}
                    type="button"
                    className={`text-[11px] px-2 py-1 rounded-lg font-semibold transition-all flex items-center space-x-1 cursor-pointer ${
                      theme === 'parchment'
                        ? 'bg-[#dfdcce] border border-[#a68c6d]/50 text-[#5c3d2e] shadow-xs'
                        : 'bg-transparent border border-transparent text-[#705e52] hover:text-[#2c241e]'
                    }`}
                    title="Sandalwood Parchment"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8c6239]" />
                    <span>Parchment</span>
                  </button>
                </div>
              </div>

              {/* Layout Selector Widget */}
              <div className={`flex items-center space-x-1.5 p-1 rounded-xl border transition-all duration-300 ${
                isParchment 
                  ? 'bg-[#ebd8c3]/30 border-[#dfd2be]/80' 
                  : isCosmic 
                    ? 'bg-indigo-950/30 border-indigo-950/80' 
                    : 'bg-slate-900/60 border-slate-800/80'
              }`}>
                <span className={`text-[9px] font-mono font-bold uppercase px-1.5 select-none ${isParchment ? 'text-[#8c6239]' : 'text-slate-500'}`}>
                  Layout:
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => handleLayoutModeChange('vertical')}
                    type="button"
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                      layoutMode === 'vertical'
                        ? (isParchment ? 'bg-[#dfdcce] border border-[#a68c6d]/50 text-[#5c3d2e] shadow-xs' : isCosmic ? 'bg-[#1a1c36] border border-indigo-500/50 text-indigo-300' : 'bg-emerald-600/35 border border-emerald-500/50 text-emerald-300')
                        : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300 hover:bg-current/5'
                    }`}
                    title="Vertical Split"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Vertical</span>
                  </button>
                  <button
                    onClick={() => handleLayoutModeChange('horizontal')}
                    type="button"
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                      layoutMode === 'horizontal'
                        ? (isParchment ? 'bg-[#dfdcce] border border-[#a68c6d]/50 text-[#5c3d2e] shadow-xs' : isCosmic ? 'bg-[#1a1c36] border border-indigo-500/50 text-indigo-300' : 'bg-emerald-600/35 border border-emerald-500/50 text-emerald-300')
                        : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300 hover:bg-current/5'
                    }`}
                    title="Horizontal Layout"
                  >
                    <Rows className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Horizontal</span>
                  </button>
                  <button
                    onClick={() => handleLayoutModeChange('mix')}
                    type="button"
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                      layoutMode === 'mix'
                        ? (isParchment ? 'bg-[#dfdcce] border border-[#a68c6d]/50 text-[#5c3d2e] shadow-xs' : isCosmic ? 'bg-[#1a1c36] border border-indigo-500/50 text-indigo-300' : 'bg-emerald-600/35 border border-emerald-500/50 text-emerald-300')
                        : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300 hover:bg-current/5'
                    }`}
                    title="Mix Grid"
                  >
                    <Layout className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mix Grid</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right aligned widgets: Engine & AI Model */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Engine Selector Widget */}
              <div className={`flex items-center space-x-1.5 p-1 rounded-xl border transition-all duration-300 ${
                isParchment 
                  ? 'bg-[#ebd8c3]/30 border-[#dfd2be]/80' 
                  : isCosmic 
                    ? 'bg-indigo-950/30 border-indigo-950/80' 
                    : 'bg-slate-900/60 border-slate-800/80'
              }`}>
                <span className={`text-[9px] font-mono font-bold uppercase px-1.5 select-none ${isParchment ? 'text-[#8c6239]' : 'text-slate-500'}`}>
                  Engine:
                </span>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => handleModeChange(false)}
                    type="button"
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                      !isOfflineMode
                        ? (isParchment 
                            ? 'bg-[#ebd8c3] border border-[#a68c6d]/50 text-[#8c6239] shadow-sm font-semibold' 
                            : isCosmic 
                              ? 'bg-[#1a1c36] border border-indigo-500/50 text-cyan-300 font-semibold' 
                              : 'bg-emerald-600/35 border border-emerald-500/50 text-emerald-300 font-semibold')
                        : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300 hover:bg-current/5'
                    }`}
                    title="Online Mode: Live Gemini AI API calls"
                  >
                    <Wifi className="w-3.5 h-3.5 text-current" />
                    <span>Online</span>
                  </button>
                  <button
                    onClick={() => handleModeChange(true)}
                    type="button"
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                      isOfflineMode
                        ? (isParchment 
                            ? 'bg-[#ebd8c3] border border-[#a68c6d]/50 text-[#8c6239] shadow-sm font-semibold' 
                            : isCosmic 
                              ? 'bg-[#1a1c36] border border-indigo-500/50 text-indigo-300 font-semibold' 
                              : 'bg-amber-600/25 border border-amber-500/40 text-amber-300 font-semibold')
                        : 'bg-transparent border border-transparent text-slate-500 hover:text-slate-300 hover:bg-current/5'
                    }`}
                    title="Offline Mode: Precompiled classical data"
                  >
                    <WifiOff className="w-3.5 h-3.5 text-current" />
                    <span>Offline</span>
                  </button>
                </div>
              </div>

              {/* Custom API Key Widget */}
              <div className={`flex items-center space-x-1.5 p-1 rounded-xl border transition-all duration-300 ${
                isParchment 
                  ? 'bg-[#ebd8c3]/30 border-[#dfd2be]/80' 
                  : isCosmic 
                    ? 'bg-indigo-950/30 border-indigo-950/80' 
                    : 'bg-slate-900/60 border-slate-800/80'
              }`}>
                <span className={`text-[9px] font-mono font-bold uppercase px-1.5 select-none ${isParchment ? 'text-[#8c6239]' : 'text-slate-500'}`}>
                  API Key:
                </span>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => handleCustomApiKeyChange(e.target.value)}
                  placeholder="Optional Gemini Key"
                  className={`text-[11px] font-semibold bg-transparent border-0 focus:ring-0 outline-none w-30 placeholder-current/30 px-1 py-0.5 ${
                    isParchment ? 'text-[#2c241e]' : isCosmic ? 'text-indigo-200' : 'text-emerald-300'
                  }`}
                />
              </div>

              {/* View Settings Widget: Width & Zoom */}
              <div className={`flex items-center space-x-1.5 p-1 rounded-xl border transition-all duration-300 ${
                isParchment 
                  ? 'bg-[#ebd8c3]/30 border-[#dfd2be]/80' 
                  : isCosmic 
                    ? 'bg-indigo-950/30 border-indigo-950/80' 
                    : 'bg-slate-900/60 border-slate-800/80'
              }`}>
                <span className={`text-[9px] font-mono font-bold uppercase px-1.5 select-none ${isParchment ? 'text-[#8c6239]' : 'text-slate-500'}`}>
                  View:
                </span>
                <div className="flex items-center gap-1">
                  <select
                    value={containerWidth}
                    onChange={(e) => handleContainerWidthChange(e.target.value as any)}
                    className={`text-[11px] font-semibold bg-transparent border-0 focus:ring-0 cursor-pointer outline-none transition-all pr-1 py-0.5 ${
                      isParchment ? 'text-[#2c241e]' : isCosmic ? 'text-indigo-200' : 'text-emerald-300'
                    }`}
                    style={{ colorScheme: isParchment ? 'light' : 'dark' }}
                  >
                    <option value="standard" className={isParchment ? 'bg-[#faf6ed] text-[#2c241e]' : 'bg-slate-950 text-slate-100'}>Standard</option>
                    <option value="wide" className={isParchment ? 'bg-[#faf6ed] text-[#2c241e]' : 'bg-slate-950 text-slate-100'}>Wide</option>
                    <option value="full" className={isParchment ? 'bg-[#faf6ed] text-[#2c241e]' : 'bg-slate-950 text-slate-100'}>Full</option>
                  </select>
                  <span className="opacity-30">|</span>
                  <select
                    value={uiScale.toString()}
                    onChange={(e) => handleUiScaleChange(parseFloat(e.target.value))}
                    className={`text-[11px] font-semibold bg-transparent border-0 focus:ring-0 cursor-pointer outline-none transition-all pr-1 py-0.5 ${
                      isParchment ? 'text-[#2c241e]' : isCosmic ? 'text-indigo-200' : 'text-emerald-300'
                    }`}
                    style={{ colorScheme: isParchment ? 'light' : 'dark' }}
                  >
                    <option value="0.9" className={isParchment ? 'bg-[#faf6ed] text-[#2c241e]' : 'bg-slate-950 text-slate-100'}>Small</option>
                    <option value="1" className={isParchment ? 'bg-[#faf6ed] text-[#2c241e]' : 'bg-slate-950 text-slate-100'}>100%</option>
                    <option value="1.15" className={isParchment ? 'bg-[#faf6ed] text-[#2c241e]' : 'bg-slate-950 text-slate-100'}>115%</option>
                    <option value="1.3" className={isParchment ? 'bg-[#faf6ed] text-[#2c241e]' : 'bg-slate-950 text-slate-100'}>130%</option>
                    <option value="1.5" className={isParchment ? 'bg-[#faf6ed] text-[#2c241e]' : 'bg-slate-950 text-slate-100'}>150%</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Collapsible Arabic Keyboard Panel inside Sticky Header */}
        {showArabicKeyboard && (
          <div className="mt-4 pt-4 border-t border-current/10 w-full flex justify-center md:justify-end animate-fadeIn">
            <ArabicVirtualKeyboard
              onKeyPress={(char) => setSearchTerm(prev => prev + char)}
              onClear={() => setSearchTerm('')}
              onBackspace={() => setSearchTerm(prev => prev.slice(0, -1))}
              onClose={() => setShowArabicKeyboard(false)}
              theme={theme}
            />
          </div>
        )}
      </header>

      {/* Main Container Layout - Customizable Arranged Layout Flows */}
      {layoutMode === 'vertical' ? (
        <main className={`flex-1 ${maxWidthClass} w-full mx-auto py-4 md:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn`}>
          {/* Left Hand Column: Personalized Sidebar (Size 3/12 on large screens) */}
          <aside className="lg:col-span-3 space-y-6 w-full h-full">
            {renderSidebar()}
          </aside>
          {/* Right Hand Column: Interactive Academic Workspace (Size 9/12 on large screens) */}
          <section className="lg:col-span-9 w-full space-y-6">
            {renderWorkspace()}
          </section>
        </main>
      ) : layoutMode === 'horizontal' ? (
        <main className={`flex-1 ${maxWidthClass} w-full mx-auto py-4 md:py-6 space-y-12 animate-fadeIn`}>
          {/* Active Workspace Centered focus at top fold */}
          <section className="w-full">
            {renderWorkspace()}
          </section>
          {/* Combined Horizontal Shelf at bottom fold */}
          <aside className="w-full border-t border-current/5 pt-8">
            {renderSidebar()}
          </aside>
        </main>
      ) : (
        /* Mix Workstation layout */
        <main className={`flex-1 ${maxWidthClass} w-full mx-auto py-4 md:py-6 space-y-10 animate-fadeIn`}>
          {/* Top shelf of parameters */}
          <section className="w-full">
            {renderSidebar()}
          </section>
          {/* Interactive center workstation (split Map/Details) */}
          <section className="w-full">
            {renderWorkspace()}
          </section>
        </main>
      )}

      {/* Decorative footer label */}
      <footer className={`border-t mt-12 py-6 text-center text-xs flex flex-col items-center space-y-1 transition-all duration-300 ${
        isParchment 
          ? 'border-[#ebdcca] bg-[#f4ebe1]/40 text-[#705e52]' 
          : isCosmic 
            ? 'border-indigo-950 text-indigo-300/40' 
            : 'border-slate-900 text-slate-500'
      }`}>
        <div className="font-medium">Baseer Bayan Quranic Arabic Vocabulary System</div>
        <div className={`text-[10px] font-mono ${isParchment ? 'text-[#a68c6d]' : isCosmic ? 'text-indigo-200/35' : 'text-slate-600'}`}>
          Powered by Gemini 2.5 Flash | Classical Arabic Morphology (Sarf) Analysis Engine
        </div>
      </footer>

    </div>
  );
}
