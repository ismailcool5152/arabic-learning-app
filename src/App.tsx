import { safeLower } from './lib/utils';
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
import CommonWordsTable from './components/CommonWordsTable';
import VerseBreakdown from './components/VerseBreakdown';
import SurahVocabularyMaps from './components/SurahVocabularyMaps';
import RootFlashcards from './components/RootFlashcards';
import SRSPractice from './components/SRSPractice';
import BalaghahTasters from './components/BalaghahTasters';
import MisunderstoodRoots from './components/MisunderstoodRoots';
import { useSRS } from './hooks/useSRS';
import WordOfTheDayWidget from './components/WordOfTheDayWidget';
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
  FileText,
  Settings,
  ArrowRight,
  Map,
  Mic
} from 'lucide-react';
import { QURANIC_SUGGESTIONS } from './components/SavedMapsSidebar';
import ProductDoc from './components/ProductDoc';
import DriveSettings from './components/DriveSettings';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showArabicKeyboard, setShowArabicKeyboard] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMainTab, setActiveMainTab] = useState<'hija' | 'basics' | 'huruf' | 'database' | 'root' | 'map' | 'names' | 'lexicon' | 'doc' | 'vocab' | 'verse' | 'flashcards' | 'srs'>('hija');
  const [activeTabGroup, setActiveTabGroup] = useState<'Home' | 'Learn' | 'Explore' | 'Practice'>('Home');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedRoot, setSelectedRoot] = useState<string>('');

  // SRS Spaced Repetition
  const { dueCountBadge, addWordToReview } = useSRS();

  const TAB_GROUPS: Record<string, Array<{id: string, title: string, icon: React.ReactNode, desc: string}>> = {
    Learn: [
      { id: 'hija', title: 'Hurūf-ul-Hijā (Makhārij)', icon: <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />, desc: "Master the origins and attributes of Arabic pronunciation." },
      { id: 'basics', title: 'Arabic Basics', icon: <Compass className="w-4 h-4 text-amber-500 animate-pulse" />, desc: "Interactive grammar breakdown of Nouns, Verbs, and Particles." },
      { id: 'huruf', title: 'Hurūf & Particles', icon: <BookOpen className="w-4 h-4" />, desc: "Explore grammatical functions of prepositions and conjunctions." },
      { id: 'balaghah', title: 'Balāghah Tasters', icon: <Mic className="w-4 h-4" />, desc: "Basic rhetorical devices mapping root meanings to morphology." }
    ],
    Explore: [
      { id: 'database', title: 'Patterns Codex & DB', icon: <Database className="w-4 h-4" />, desc: "Discover all Arabic verb forms (Wazans) and noun patterns." },
      { id: 'root', title: 'Root-to-Words Gen', icon: <GitBranch className="w-4 h-4" />, desc: "Dynamically generate words from 3-letter semantic roots." },
      { id: 'names', title: '100 Names of Allah', icon: <Award className="w-4 h-4 text-yellow-500 animate-pulse" />, desc: "Deep dive into Asma ul Husna morphological derivations." },
      { id: 'verse', title: 'Ayat Segmenter', icon: <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />, desc: "Word-by-word breakdown of selected Quranic verses." },
      { id: 'surahmaps', title: 'Surah Vocab Maps', icon: <Map className="w-4 h-4 text-indigo-500" />, desc: "Surah root inventories to unlock vocabulary before reading." },
      { id: 'misunderstood', title: 'Misunderstood Roots', icon: <AlertCircle className="w-4 h-4 text-rose-500" />, desc: "Frequently mistranslated or confused roots in English." },
      { id: 'lexicon', title: 'Lexicon Dictionary', icon: <BookOpen className="w-4 h-4" />, desc: "Search thousands of classical definitions in lane's style." }
    ],
    Practice: [
      { id: 'vocab', title: '500 Core Words Codex', icon: <Database className="w-4 h-4 text-amber-500" />, desc: "Master the most frequently used words in the entire Quran." },
      { id: 'flashcards', title: 'Root Flashcards', icon: <Award className="w-4 h-4 text-emerald-400 animate-pulse" />, desc: "Interactive vocabulary drills across diverse root groups." },
      { 
        id: 'srs', 
        title: 'Review SRS', 
        icon: (
          <div className="relative">
            <TrendingUp className="w-4 h-4 text-pink-500 animate-pulse" />
            {dueCountBadge > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold px-1.5 py-[1px] rounded-full shadow-sm animate-pulse">
                {dueCountBadge}
              </span>
            )}
          </div>
        ),
        desc: "Spaced Repetition System logic optimized for long-term retention."
      },
      { id: 'map', title: 'Word Search & Analysis', icon: <Search className="w-4 h-4" />, desc: "Visualize the entire morphological tree for any searched root." }
    ]
  };
  
  // Tour State
  const [showTour, setShowTour] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quranic_arabic_tour_completed') !== 'true';
    } catch {
      return true;
    }
  });
  const [tourStep, setTourStep] = useState(0);

  const completeTour = () => {
    setShowTour(false);
    try {
      localStorage.setItem('quranic_arabic_tour_completed', 'true');
    } catch (e) {}
  };
  
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

  const handleLayoutChange = (mode: LayoutMode) => {
    setLayoutMode(mode);
    try {
      localStorage.setItem('quranic_arabic_layout_mode', mode);
    } catch (e) {}
  };

  const handleLayoutModeChange = (newLayout: LayoutMode) => {
    setLayoutMode(newLayout);
    try {
      localStorage.setItem('quranic_arabic_layout_mode', newLayout);
    } catch (e) {
      console.error("Failed to persist layout mode:", e);
    }
  };

  // Load saved data and listen to cache import events
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const storedMaps = localStorage.getItem('quranic_arabic_saved_maps');
        if (storedMaps) {
          setSavedMaps(JSON.parse(storedMaps));
        }
        
        const storedSearches = localStorage.getItem('quranic_arabic_recent_searches');
        if (storedSearches) {
           setRecentSearches(JSON.parse(storedSearches));
        }
      } catch (e) {
        console.error("Failed to load saved data from local storage:", e);
      }
    };

    loadSavedData();

    window.addEventListener('quranic_arabic_data_imported', loadSavedData);
    return () => {
      window.removeEventListener('quranic_arabic_data_imported', loadSavedData);
    };
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
    ? savedMaps.some(map => (map.searchedWord && analysis.word && safeLower(map.searchedWord) === safeLower(analysis.word)) || map.analysis.root === analysis.root) 
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
      
      {/* Grouped Tabbed Interface */}
      <div className="w-full space-y-3 pb-1">
        
        {/* Top Level Groups */}
        <div className="flex gap-2 p-1.5 bg-current/5 border border-current/10 rounded-2xl w-max overflow-x-auto scrollbar-none">
          {[
            { id: 'Home', label: 'Home', icon: '🏠', count: 0 },
            { id: 'Learn', label: 'Learn', icon: '📖', count: 3 },
            { id: 'Explore', label: 'Explore', icon: '🔍', count: 5 },
            { id: 'Practice', label: 'Practice', icon: '✍️', count: 4 }
          ].map((group) => (
            <button
              key={group.id}
              onClick={() => {
                setActiveTabGroup(group.id as any);
                // Switch to the first tab in the group automatically
                if (group.id === 'Learn') setActiveMainTab('hija');
                if (group.id === 'Explore') setActiveMainTab('database');
                if (group.id === 'Practice') setActiveMainTab('vocab');
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTabGroup === group.id
                  ? (isParchment ? 'bg-[#8c6239] text-[#faf6ed] shadow-sm' : isCosmic ? 'bg-indigo-600 text-white shadow-md' : 'bg-emerald-600 text-white shadow-md')
                  : 'text-current/60 hover:bg-current/10'
              }`}
            >
              <span className="text-base">{group.icon}</span>
              <span>{group.label}</span>
              {group.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] bg-current/10 opacity-80 ${activeTabGroup === group.id && 'bg-white/20 text-white opacity-100'}`}>
                  {group.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sub Navigation Tabs */}
        {activeTabGroup !== 'Home' && (() => {
          return (
            <div className="w-full overflow-x-auto scrollbar-none">
              <div className="flex bg-current/5 border border-current/10 p-1.5 rounded-2xl w-max min-w-full gap-1 items-center">
                {TAB_GROUPS[activeTabGroup]?.filter((t: any) => !isOfflineMode || (t.id !== 'wotd' && t.id !== 'map')).map((tab: any, i: number, arr: any[]) => (
                  <React.Fragment key={tab.id}>
                    <button
                      onClick={() => setActiveMainTab(tab.id as any)}
                      type="button"
                      className={`shrink-0 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        activeMainTab === tab.id
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
                      {tab.icon}
                      <span className="flex items-center gap-1">
                        {tab.title}
                      </span>
                    </button>
                    {i < arr.length - 1 && (
                      <span className="text-slate-600 font-mono text-[11px] select-none shrink-0 px-0.5">➜</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Render activeMainTab panel */}
      <div style={{ zoom: uiScale }}>
      {activeTabGroup === 'Home' ? (
          <div className="w-full max-w-7xl mx-auto space-y-12 animate-fadeIn pb-12">
            {!isOfflineMode && (
              <div className="w-full">
                <WordOfTheDayWidget
                  theme={theme}
                  isOfflineMode={isOfflineMode}
                  onSelectWord={(word) => {
                    setSearchTerm(word);
                    setActiveTabGroup('Explore');
                    setActiveMainTab('map');
                    handleSearch(word);
                  }}
                  onWordSeen={(wordArabic, wordEnglish) => addWordToReview(wordArabic, wordArabic, wordEnglish)}
                  onStartQuiz={() => { setActiveTabGroup('Practice'); setActiveMainTab('srs'); }}
                />
              </div>
            )}
            <div className="text-center space-y-4 max-w-2xl mx-auto pb-4">
              <h2 className={`text-3xl font-bold font-serif opacity-90 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-500'}`}>Journey into Quranic Arabic</h2>
              <p className="text-sm opacity-70 leading-relaxed">
                Baseer Bayan organizes classical Arabic morphology into three logic steps: learning the foundational building blocks, exploring the derivations of 3-letter roots, and drilling vocabulary retention.
              </p>
            </div>

            <div className="space-y-10">
              {['Learn', 'Explore', 'Practice'].map(groupKey => (
                <div key={groupKey} className="space-y-4">
                  <h3 className="text-lg flex justify-between items-center pb-2 border-b border-current/10 opacity-90 font-bold">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {groupKey === 'Learn' ? '📖' : groupKey === 'Explore' ? '🔍' : '✍️'}
                      </span>
                      <span>Phase {groupKey === 'Learn' ? '1' : groupKey === 'Explore' ? '2' : '3'}: {groupKey}</span>
                    </div>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TAB_GROUPS[groupKey].map((tab: any) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTabGroup(groupKey as any);
                          setActiveMainTab(tab.id as any);
                        }}
                        className={`text-left p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                          isParchment 
                            ? 'bg-[#f4efe8] hover:bg-[#ebd8c3]/80 border-[#dccbae] hover:border-[#8c6239]/50 shadow-sm'
                            : isCosmic
                              ? 'bg-indigo-950/20 hover:bg-indigo-900/40 border-indigo-900/40 hover:border-indigo-500/50'
                              : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:border-emerald-500/50'
                        }`}
                      >
                        <div>
                          <div className={`p-2.5 w-max rounded-xl mb-3 shadow-sm ${isParchment ? 'bg-[#ebd8c3] text-[#8c6239] border border-[#dccbae]' : isCosmic ? 'bg-[#0f1225] border border-white/5 text-indigo-400' : 'bg-slate-50 border border-slate-100 text-emerald-600'}`}>
                            {tab.icon}
                          </div>
                          <h4 className="font-bold text-base mb-1.5 opacity-90 group-hover:text-amber-600 transition-colors">{tab.title}</h4>
                          <p className="text-xs opacity-65 leading-relaxed">{tab.desc}</p>
                        </div>
                        <div className={`mt-4 flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold transition-opacity ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-500'} opacity-0 group-hover:opacity-100`}>
                          Launch Module <ArrowRight className="w-3 h-3"/>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
      ) : activeMainTab === 'hija' ? (
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
      ) : activeMainTab === 'verse' ? (
        <div className="animate-fadeIn">
          <VerseBreakdown
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
      ) : activeMainTab === 'balaghah' ? (
        <div className="animate-fadeIn">
          <BalaghahTasters theme={theme} />
        </div>
      ) : activeMainTab === 'surahmaps' ? (
        <div className="animate-fadeIn">
          <SurahVocabularyMaps theme={theme} />
        </div>
      ) : activeMainTab === 'misunderstood' ? (
        <div className="animate-fadeIn">
          <MisunderstoodRoots theme={theme} />
        </div>
      ) : activeMainTab === 'vocab' ? (
        <div className="animate-fadeIn">
          <CommonWordsTable
            theme={theme}
            onSelectWord={(word) => {
              setSearchTerm(word);
              setActiveMainTab('map');
              handleSearch(word);
            }}
          />
        </div>
      ) : activeMainTab === 'flashcards' ? (
        <div className="animate-fadeIn">
          <RootFlashcards
            theme={theme}
            onSelectWord={(word) => {
              setSearchTerm(word);
              setActiveMainTab('map');
              handleSearch(word);
            }}
            onWordSeen={(root, meaning) => {
              addWordToReview(root, root, meaning);
            }}
          />
        </div>
      ) : activeMainTab === 'srs' ? (
        <div className="animate-fadeIn">
          <SRSPractice theme={theme} />
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
              <div className="flex flex-col">
                <h1 className={`text-base font-bold tracking-tight leading-tight ${isParchment ? 'text-[#2c241e]' : 'text-white'}`}>
                  Baseer <span className={isParchment ? 'text-[#8c6239] font-semibold' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'}>Bayan</span>
                </h1>
                <div className="flex items-center text-[10px] font-mono tracking-wider mt-0.5">
                   <button onClick={() => { setActiveTabGroup('Home'); setActiveMainTab('hija'); }} className="opacity-60 hover:opacity-100 hover:underline transition-opacity cursor-pointer select-none">Home</button>
                   {activeTabGroup !== 'Home' && (
                     <>
                       <span className="mx-1.5 opacity-40">/</span>
                       <span className="opacity-60">{activeTabGroup}</span>
                       <span className="mx-1.5 opacity-40">/</span>
                       <span className="capitalize opacity-80 font-semibold text-[11px]">{activeMainTab === 'hija' ? 'Huruf-ul-Hija' : activeMainTab}</span>
                     </>
                   )}
                </div>
              </div>
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
              <button
                onClick={() => setShowSettingsModal(true)}
                className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                  isParchment ? 'bg-[#ebd8c3]/35 border-[#dfd2be]/80 text-[#2c241e] hover:bg-[#ebd8c3]/60' : isCosmic ? 'bg-indigo-950/35 border-indigo-950/80 text-indigo-100 hover:bg-indigo-900/50' : 'bg-slate-900/60 border-slate-800/80 text-slate-100 hover:bg-slate-800/60'
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4 opacity-75" />
              </button>

              {/* Personal Study Circle widget connected to Drive Sync */}
              <DriveSettings theme={theme} />
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
        <main className={`flex-1 ${maxWidthClass} w-full mx-auto py-8 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn`}>
          {/* Left Hand Column: Personalized Sidebar (Size 3/12 on large screens) */}
          <aside className="lg:col-span-3 space-y-8 w-full h-full">
            {renderSidebar()}
          </aside>
          {/* Right Hand Column: Interactive Academic Workspace (Size 9/12 on large screens) */}
          <section className="lg:col-span-9 w-full space-y-8">
            {renderWorkspace()}
          </section>
        </main>
      ) : layoutMode === 'horizontal' ? (
        <main className={`flex-1 ${maxWidthClass} w-full mx-auto py-8 md:py-10 space-y-16 animate-fadeIn`}>
          {/* Active Workspace Centered focus at top fold */}
          <section className="w-full">
            {renderWorkspace()}
          </section>
          {/* Combined Horizontal Shelf at bottom fold */}
          <aside className="w-full border-t border-current/5 pt-12">
            {renderSidebar()}
          </aside>
        </main>
      ) : (
        /* Mix Workstation layout */
        <main className={`flex-1 ${maxWidthClass} w-full mx-auto py-8 md:py-10 space-y-12 animate-fadeIn`}>
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
        <div className="font-medium flex items-center justify-center gap-2">
          <span>Baseer Bayan Quranic Arabic Vocabulary System</span>
          <span className="font-mono opacity-80 text-[10px] bg-black/10 px-1.5 py-0.5 rounded">v1.1.0</span>
        </div>
        <div className={`text-[10px] font-mono ${isParchment ? 'text-[#a68c6d]' : isCosmic ? 'text-indigo-200/35' : 'text-slate-600'}`}>
          Powered by Gemini 2.5 Flash | Classical Arabic Morphology (Sarf) Analysis Engine
        </div>
      </footer>


      {/* Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" onClick={completeTour}>
          <div 
            className={`relative w-full max-w-md p-8 rounded-3xl border shadow-2xl space-y-6 flex flex-col items-center text-center ${isParchment ? 'bg-[#faf6ed] border-[#dfd2be]/80 text-[#2c241e]' : isCosmic ? 'bg-[#05060f] border-indigo-500/30 text-slate-100' : 'bg-slate-900 border-slate-700/80 text-slate-100'}`}
            onClick={e => e.stopPropagation()}
          >
            {tourStep === 0 && (
              <>
                <div className={`p-4 rounded-full mb-2 ${isParchment ? 'bg-[#ebd8c3]/40' : 'bg-current/10'}`}>
                  <Compass className={`w-10 h-10 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'}`} />
                </div>
                <h2 className="text-2xl font-bold font-serif">Welcome Scholar</h2>
                <p className={`text-sm leading-relaxed mb-4 ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
                  Baseer Bayan is a classical Arabic morphology engine. This brief walkthrough will show you how to study Quranic roots effectively.
                </p>
                <div className="flex w-full mt-4 gap-3">
                  <button onClick={completeTour} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${isParchment ? 'border-[#dfd2be] text-[#705e52] hover:bg-[#ebdcc3]/30' : 'border-current/20 hover:bg-current/10'}`}>Skip Tour</button>
                  <button onClick={() => setTourStep(1)} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold shadow-md transition-all ${isParchment ? 'bg-[#8c6239] text-[#faf6ed] hover:bg-[#7a5431]' : isCosmic ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>Begin</button>
                </div>
              </>
            )}
            
            {tourStep === 1 && (
              <>
                <div className={`p-4 rounded-full mb-2 ${isParchment ? 'bg-[#ebd8c3]/40' : 'bg-current/10'}`}>
                  <Database className={`w-10 h-10 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'}`} />
                </div>
                <h2 className="text-xl font-bold">Module Navigation</h2>
                <p className={`text-sm leading-relaxed mb-4 ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
                  Use the top "Learn", "Explore", and "Practice" tabs to switch between the 10+ academic study tools like the Root Dictionary, Verse Segmenter, and Mind Maps.
                </p>
                <div className="flex w-full mt-4 gap-3">
                  <button onClick={() => setTourStep(0)} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${isParchment ? 'border-[#dfd2be] text-[#705e52] hover:bg-[#ebdcc3]/30' : 'border-current/20 hover:bg-current/10'}`}>Back</button>
                  <button onClick={() => setTourStep(2)} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold shadow-md transition-all ${isParchment ? 'bg-[#8c6239] text-[#faf6ed] hover:bg-[#7a5431]' : isCosmic ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>Next</button>
                </div>
              </>
            )}

            {tourStep === 2 && (
              <>
                <div className={`p-4 rounded-full mb-2 ${isParchment ? 'bg-[#ebd8c3]/40' : 'bg-current/10'}`}>
                  <Search className={`w-10 h-10 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'}`} />
                </div>
                <h2 className="text-xl font-bold">Interactive Verses</h2>
                <p className={`text-sm leading-relaxed mb-4 ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
                  In the <strong>Ayat Segmenter</strong> module, select a Surah and click on any Arabic text. It will instantly reveal its root, translation, and grammatical states.
                </p>
                <div className="flex w-full mt-4 gap-3">
                  <button onClick={() => setTourStep(1)} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${isParchment ? 'border-[#dfd2be] text-[#705e52] hover:bg-[#ebdcc3]/30' : 'border-current/20 hover:bg-current/10'}`}>Back</button>
                  <button onClick={() => setTourStep(3)} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold shadow-md transition-all ${isParchment ? 'bg-[#8c6239] text-[#faf6ed] hover:bg-[#7a5431]' : isCosmic ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>Next</button>
                </div>
              </>
            )}

            {tourStep === 3 && (
              <>
                <div className={`p-4 rounded-full mb-2 ${isParchment ? 'bg-[#ebd8c3]/40' : 'bg-current/10'}`}>
                  <GitBranch className={`w-10 h-10 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'}`} />
                </div>
                <h2 className="text-xl font-bold">Mind Mapping</h2>
                <p className={`text-sm leading-relaxed mb-4 ${isParchment ? 'text-[#705e52]' : 'text-slate-400'}`}>
                  Search any word or select from Trending lists. The system will build a visual academic network graph of its derivatives and morphological roots.
                </p>
                <div className="flex w-full mt-4 gap-3">
                  <button onClick={() => setTourStep(2)} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${isParchment ? 'border-[#dfd2be] text-[#705e52] hover:bg-[#ebdcc3]/30' : 'border-current/20 hover:bg-current/10'}`}>Back</button>
                  <button onClick={completeTour} className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold shadow-md transition-all ${isParchment ? 'bg-[#8c6239] text-[#faf6ed] hover:bg-[#7a5431]' : isCosmic ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}>Finish</button>
                </div>
              </>
            )}

            {/* Pagination dots */}
            <div className="flex gap-2 mt-2 opacity-50 justify-center">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full ${tourStep === i ? (isParchment ? 'bg-[#8c6239]' : isCosmic ? 'bg-indigo-400' : 'bg-emerald-500') : 'bg-current/30'}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn" onClick={() => setShowSettingsModal(false)}>
          <div 
            className={`relative w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-6 ${isParchment ? 'bg-[#faf6ed] border-[#dfd2be]/80 text-[#2c241e]' : isCosmic ? 'bg-[#05060f] border-indigo-500/30 text-slate-100' : 'bg-slate-900 border-slate-700/80 text-slate-100'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3 border-current/10">
              <h2 className="text-lg font-bold flex items-center gap-2"><Settings className="w-5 h-5"/> Advanced Settings</h2>
              <button onClick={() => setShowSettingsModal(false)} className="opacity-50 hover:opacity-100"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1.5 block">Theme</label>
                <div className="flex gap-2">
                  {['emerald', 'cosmic', 'parchment'].map(t => (
                    <button key={t} onClick={() => handleThemeChange(t as 'emerald' | 'cosmic' | 'parchment')} className={`px-3 py-1.5 rounded-lg text-sm capitalize border ${theme === t ? (isParchment ? 'bg-[#dfdcce] border-[#a68c6d]/50' : 'bg-current/20 border-current/30') : 'border-transparent opacity-60 hover:opacity-100'}`}>{t}</button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1.5 block">Layout Flow</label>
                <div className="flex gap-2">
                  <button onClick={() => handleLayoutChange('vertical')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border ${layoutMode === 'vertical' ? (isParchment ? 'bg-[#dfdcce] border-[#a68c6d]/50' : 'bg-current/20 border-current/30') : 'border-transparent opacity-60 hover:opacity-100'} cursor-pointer`}><Columns className="w-4 h-4"/> Stacked</button>
                  <button onClick={() => handleLayoutChange('mix')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border ${layoutMode === 'mix' ? (isParchment ? 'bg-[#dfdcce] border-[#a68c6d]/50' : 'bg-current/20 border-current/30') : 'border-transparent opacity-60 hover:opacity-100'} cursor-pointer`}><Layout className="w-4 h-4"/> Flow</button>
                  <button onClick={() => handleLayoutChange('horizontal')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border ${layoutMode === 'horizontal' ? (isParchment ? 'bg-[#dfdcce] border-[#a68c6d]/50' : 'bg-current/20 border-current/30') : 'border-transparent opacity-60 hover:opacity-100'} cursor-pointer`}><Rows className="w-4 h-4"/> Full Spread</button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1.5 block">Engine Mode</label>
                <div className="flex gap-2">
                  <button onClick={() => handleModeChange(false)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border ${!isOfflineMode ? (isParchment ? 'bg-[#dfdcce] border-[#a68c6d]/50' : 'bg-current/20 border-current/30') : 'border-transparent opacity-60 hover:opacity-100'}`}><Wifi className="w-4 h-4"/> Online (Gemini AI)</button>
                  <button onClick={() => handleModeChange(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border ${isOfflineMode ? (isParchment ? 'bg-[#dfdcce] border-[#a68c6d]/50' : 'bg-current/20 border-current/30') : 'border-transparent opacity-60 hover:opacity-100'}`}><WifiOff className="w-4 h-4"/> Offline (Classical)</button>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1.5 block">UI Scale / Viewport Width</label>
                <div className="flex gap-2">
                  <select value={uiScale.toString()} onChange={e => handleUiScaleChange(parseFloat(e.target.value))} className="bg-current/5 border border-current/10 rounded-lg px-2 py-1.5 text-sm outline-none">
                    <option value="0.9">Small</option>
                    <option value="1">100%</option>
                    <option value="1.15">115%</option>
                    <option value="1.3">130%</option>
                    <option value="1.5">150%</option>
                  </select>
                  <select value={containerWidth} onChange={e => handleContainerWidthChange(e.target.value)} className="bg-current/5 border border-current/10 rounded-lg px-2 py-1.5 text-sm outline-none">
                    <option value="standard">Standard</option>
                    <option value="wide">Wide</option>
                    <option value="full">Full</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1.5 block">Custom API Key</label>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => handleCustomApiKeyChange(e.target.value)}
                  placeholder="Optional Gemini API Key"
                  className={`w-full text-sm font-mono bg-current/5 border border-current/10 rounded-lg px-3 py-2 outline-none focus:ring-1 ring-current/30 ${isParchment ? 'text-[#2c241e]' : 'text-slate-100'}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
