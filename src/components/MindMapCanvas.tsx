import React, { useState, useMemo } from 'react';
import { WordAnalysis, RelatedWord, QuranicVerse, LayoutTheme } from '../types';
import { BookOpen, Sparkles, HelpCircle, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

interface MindMapCanvasProps {
  analysis: WordAnalysis;
  onNodeClick: (node: { type: string; data: any }) => void;
  selectedNode: { type: string; id: string } | null;
  onExploreWord: (word: string) => void;
  theme: LayoutTheme;
}

export default function MindMapCanvas({
  analysis,
  onNodeClick,
  selectedNode,
  onExploreWord,
  theme
}: MindMapCanvasProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Constants for coordinate-space viewport sizing
  const width = 800;
  const height = 550;
  const cx = width / 2;
  const cy = height / 2;

  // Build the nodes list with calculated coordinates
  const nodes = useMemo(() => {
    const list: any[] = [];
    
    // Node styling variables based on theme
    let rootColor = 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/20';
    let rootTextColor = 'text-emerald-100';
    
    let queryColor = 'bg-amber-600 border-amber-400 text-white shadow-amber-500/20';
    let queryTextColor = 'text-amber-100';

    let explanationColor = 'bg-teal-700 border-teal-500 text-white shadow-teal-500/10';
    let explanationTextColor = 'text-teal-100';

    let wordColor = 'bg-slate-800 border-slate-700 hover:border-indigo-400 text-slate-100 shadow-slate-900/40';
    let wordTextColor = 'text-slate-400';

    let verseColor = 'bg-indigo-950 border-indigo-800 hover:border-indigo-400 text-indigo-100 shadow-indigo-950/20';
    let verseTextColor = 'text-indigo-300';

    if (isParchment) {
      rootColor = 'bg-[#8c6239] border-[#5c3d2e] text-[#fdfbf7] shadow-[#8c6239]/15';
      rootTextColor = 'text-[#e9d2bc]';
      queryColor = 'bg-[#4f3824] border-[#362517] text-[#fdfbf7] shadow-md';
      queryTextColor = 'text-amber-100';
      explanationColor = 'bg-[#a68c6d] border-[#8a7256] text-[#faf5ec] shadow-sm';
      explanationTextColor = 'text-orange-50';
      wordColor = 'bg-[#ebd8c3]/85 border-[#dfd2be] hover:border-[#8c6239] text-[#2c241e]';
      wordTextColor = 'text-[#705e52]';
      verseColor = 'bg-[#dfd3c3]/70 border-[#d2bfa4] hover:border-[#8c6239] text-[#342417]';
      verseTextColor = 'text-[#85654d]';
    } else if (isCosmic) {
      rootColor = 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/20';
      rootTextColor = 'text-indigo-100';
      queryColor = 'bg-pink-600 border-pink-400 text-white shadow-pink-500/20';
      queryTextColor = 'text-pink-100';
      explanationColor = 'bg-violet-800 border-violet-600 text-white shadow-violet-500/10';
      explanationTextColor = 'text-violet-100';
      wordColor = 'bg-[#0d0f1a] border-slate-800 hover:border-cyan-400 text-slate-100 shadow-indigo-950/20';
      wordTextColor = 'text-indigo-200/50';
      verseColor = 'bg-cyan-950/60 border-cyan-800 hover:border-cyan-400 text-cyan-100 shadow-cyan-950/40';
      verseTextColor = 'text-cyan-300';
    }

    // 1. Central Root Node
    list.push({
      id: 'root',
      type: 'root',
      label: analysis.root,
      subLabel: analysis.rootTransliteration,
      concept: 'ROOT CONCEPT',
      description: analysis.rootMeaning,
      x: cx,
      y: cy,
      color: rootColor,
      textColor: rootTextColor,
      radius: 65,
      data: analysis
    });

    // 2. Core searched word node
    const searchedWordNode = {
      id: 'search-word',
      type: 'query',
      label: analysis.wordArabic,
      subLabel: analysis.wordTransliteration,
      concept: analysis.meaning,
      description: analysis.morphologyForm,
      x: cx + 150 * Math.cos(-Math.PI / 3),
      y: cy + 150 * Math.sin(-Math.PI / 3),
      color: queryColor,
      textColor: queryTextColor,
      radius: 54,
      data: analysis
    };
    list.push(searchedWordNode);

    // 3. Root meaning explanation node
    const explanationNode = {
      id: 'root-meaning-concept',
      type: 'explanation',
      label: 'Root Meaning',
      subLabel: 'General Concept',
      concept: analysis.rootMeaning,
      description: 'The semantic core shared by all derivations of ' + analysis.rootTransliteration,
      x: cx + 140 * Math.cos(2 * Math.PI / 3),
      y: cy + 140 * Math.sin(2 * Math.PI / 3),
      color: explanationColor,
      textColor: explanationTextColor,
      radius: 46,
      data: analysis
    };
    list.push(explanationNode);

    // 4. Dynamic placement of Related Words on outer ring
    const totalRelated = analysis.relatedWords.length;
    const outerRadius = 245;

    analysis.relatedWords.forEach((word, index) => {
      const arcStart = Math.PI - 1.2; 
      const arcEnd = Math.PI + 1.2;   
      const angle = arcStart + (index / (totalRelated - 1 || 1)) * (arcEnd - arcStart);
      
      list.push({
        id: `related-${index}`,
        type: 'word',
        label: word.word,
        subLabel: word.transliteration,
        concept: word.meaning,
        description: word.morphology,
        x: cx + outerRadius * Math.cos(angle),
        y: cy + outerRadius * Math.sin(angle),
        color: wordColor,
        textColor: wordTextColor,
        radius: 44,
        data: word
      });
    });

    // 5. Dynamic placement of Occurrences Data
    const totalOccurrencesCount = analysis.totalOccurrences || analysis.quranicOccurrences.length;
    
    // Instead of mapping each surah, just show total times occurred
    const occurrencesAngle = Math.PI / 8; // placed slightly on the top right
    list.push({
      id: `verse-summary`,
      type: 'verse',
      label: 'Quranic Frequency',
      subLabel: `${totalOccurrencesCount} Times`,
      concept: 'Total Occurrences',
      description: `This root or word appears ${totalOccurrencesCount} times across the Quran.`,
      x: cx + outerRadius * Math.cos(occurrencesAngle),
      y: cy + outerRadius * Math.sin(occurrencesAngle),
      color: verseColor,
      textColor: verseTextColor,
      radius: 50,
      data: { total: totalOccurrencesCount }
    });

    return list;
  }, [analysis, cx, cy, isParchment, isCosmic]);

  // Overall BG styling configuration
  const overallBgClass = isParchment
    ? 'bg-[#faf6ed] border-[#ebdcc3] shadow-lg'
    : isCosmic
      ? 'bg-[#05060f] border-indigo-950/80'
      : 'bg-slate-950 border-slate-800';

  const gridClass = isParchment
    ? 'bg-[linear-gradient(to_right,#f2e5d5_1px,transparent_1px),linear-gradient(to_bottom,#f2e5d5_1px,transparent_1px)] opacity-50'
    : isCosmic
      ? 'bg-[linear-gradient(to_right,#13113c_1px,transparent_1px),linear-gradient(to_bottom,#13113c_1px,transparent_1px)] opacity-60'
      : 'bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] opacity-40';

  const ringStroke = isParchment ? '#eae1d2' : isCosmic ? '#17144e' : '#1e293b';

  const wrapperClass = isFullscreen
    ? `fixed inset-0 z-[100] w-screen h-screen rounded-none border-none flex flex-col transition-all duration-300 ${overallBgClass}`
    : `w-full relative h-[550px] min-h-[550px] rounded-2xl overflow-hidden border flex flex-col transition-all duration-300 ${overallBgClass}`;

  const controlBtnClass = isParchment
    ? 'p-2.5 bg-[#fdfbf7] hover:bg-[#ebd8c3]/60 border-[#ebdcc3] text-[#4d3a2a] rounded-xl transition-all border active:scale-95 flex items-center justify-center cursor-pointer shadow-sm'
    : isCosmic
      ? 'p-2.5 bg-[#05060f]/90 hover:bg-indigo-950/80 border-indigo-900/60 text-indigo-200 rounded-xl transition-all border active:scale-95 flex items-center justify-center cursor-pointer shadow-sm'
      : 'p-2.5 bg-slate-900/95 hover:bg-slate-800 border-slate-700 text-slate-100 rounded-xl transition-all border active:scale-95 flex items-center justify-center cursor-pointer shadow-sm';

  return (
    <div className={wrapperClass}>
      {/* Floating Canvas Controls (Zoom & Fullscreen) */}
      <div className="absolute top-4 right-4 z-[110] flex items-center space-x-2 pointer-events-auto">
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
          className={controlBtnClass}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={() => setZoom(1.0)}
          className={`${controlBtnClass} text-[10px] font-mono font-bold min-w-[50px] text-center`}
          title="Reset Zoom"
        >
          {Math.round(zoom * 100)}%
        </button>

        <button
          onClick={() => setZoom(prev => Math.min(2.0, prev + 0.1))}
          className={controlBtnClass}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsFullscreen(prev => !prev)}
          className={controlBtnClass}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 relative overflow-auto touch-pan-x touch-pan-y hide-scrollbar flex items-center justify-center">
        <div 
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          className="relative w-[800px] h-[550px] flex-shrink-0 group select-none transition-transform duration-200"
        >
          {/* Decorative grid backdrop */}
          <div className={`absolute inset-0 pointer-events-none rounded-2xl ${gridClass}`} />
          
          {/* SVG Connections Drawing Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <radialGradient id="root-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={isParchment ? "#8c6239" : isCosmic ? "#4f46e5" : "#10b981"} stopOpacity="0.15" />
            <stop offset="100%" stopColor={isParchment ? "#ebd8c3" : isCosmic ? "#03001e" : "#059669"} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isParchment ? "#fcf8f2" : isCosmic ? "#03001e" : "#312e81"} stopOpacity="0.35" />
            <stop offset="100%" stopColor={isParchment ? "#f4ebe1" : isCosmic ? "#05060f" : "#0f172a"} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient background aura */}
        <circle cx={cx} cy={cy} r="280" fill="url(#glow-grad)" />
        <circle cx={cx} cy={cy} r="100" fill="url(#root-glow)" />

        {/* Anatomical Map Component / Ref Rings */}
        <circle cx={cx} cy={cy} r="90" fill="none" stroke={ringStroke} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
        <circle cx={cx} cy={cy} r="145" fill="none" stroke={ringStroke} strokeWidth="1" strokeDasharray="3 9" />
        <circle cx={cx} cy={cy} r="195" fill="none" stroke={ringStroke} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5"/>
        <circle cx={cx} cy={cy} r="245" fill="none" stroke={ringStroke} strokeWidth="1" strokeDasharray="1 6" />
        <circle cx={cx} cy={cy} r="285" fill="none" stroke={ringStroke} strokeWidth="0.5" strokeDasharray="10 10" opacity="0.4"/>
        <circle cx={cx} cy={cy} r="295" fill="none" stroke={ringStroke} strokeWidth="0.25" opacity="0.3"/>

        {/* Anatomical Crosshairs & Axis */}
        <path d={`M ${cx} ${cy-320} L ${cx} ${cy+320}`} stroke={ringStroke} strokeWidth="1" opacity="0.3" strokeDasharray="5 5" />
        <path d={`M ${cx-420} ${cy} L ${cx+420} ${cy}`} stroke={ringStroke} strokeWidth="1" opacity="0.3" strokeDasharray="5 5" />
        
        {/* Inner Hub detailed gear/ticks */}
        {[...Array(24)].map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          return (
            <line 
              key={`hub-tick-${i}`} 
              x1={cx + 80 * Math.cos(angle)} y1={cy + 80 * Math.sin(angle)}
              x2={cx + 85 * Math.cos(angle)} y2={cy + 85 * Math.sin(angle)}
              stroke={ringStroke} strokeWidth="1" opacity="0.5"
            />
          );
        })}

        {/* Degree Markings on Outer Ring */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => {
          const rad = (deg * Math.PI) / 180;
          const x1 = cx + 245 * Math.cos(rad);
          const y1 = cy + 245 * Math.sin(rad);
          const x2 = cx + 252 * Math.cos(rad);
          const y2 = cy + 252 * Math.sin(rad);
          const textRot = deg > 90 && deg < 270 ? deg + 180 : deg;
          return (
             <g key={`deg-${deg}`}>
               <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={ringStroke} strokeWidth="1.5" opacity="0.7"/>
               <text 
                 x={cx + 262 * Math.cos(rad)} 
                 y={cy + 262 * Math.sin(rad) + 3} 
                 fontSize="9" 
                 fontFamily="monospace"
                 fill={ringStroke} 
                 opacity="0.9" 
                 textAnchor="middle" 
                 transform={`rotate(${textRot}, ${cx + 262 * Math.cos(rad)}, ${cy + 262 * Math.sin(rad)})`}
               >
                 {deg}°
               </text>
             </g>
          );
        })}

        {/* Dynamic Curved & Geometric Connection Lines */}
        {nodes.map((node) => {
          if (node.id === 'root') return null;

          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNodeId === node.id || hoveredNodeId === 'root';
          
          let strokeColor = isParchment ? '#d5c3aa' : isCosmic ? '#221e5f' : '#334155';
          let strokeWidth = '1.5';
          let strokeDash = 'none';

          if (node.type === 'query') {
            strokeColor = isParchment ? '#4f3824' : isCosmic ? '#ec4899' : '#d97706'; 
            strokeWidth = '2';
          } else if (node.type === 'explanation') {
            strokeColor = isParchment ? '#8a7256' : isCosmic ? '#a855f7' : '#0d9488'; 
            strokeWidth = '1.5';
          } else if (node.type === 'verse') {
            strokeColor = isParchment ? '#85654d' : isCosmic ? '#06b6d4' : '#4f46e5'; 
          }

          if (isHovered || isSelected) {
            strokeColor = node.type === 'query' 
              ? (isParchment ? '#2c190a' : isCosmic ? '#f43f5e' : '#f59e0b') 
              : node.type === 'verse' 
                ? (isParchment ? '#8c6239' : isCosmic ? '#22d3ee' : '#818cf8') 
                : node.type === 'explanation' 
                  ? (isParchment ? '#4f3824' : isCosmic ? '#c084fc' : '#14b8a6') 
                  : (isParchment ? '#8c6239' : '#818cf8');
            strokeWidth = '3';
          }

          const midX = (cx + node.x) / 2;
          const midY = (cy + node.y) / 2;
          const curvature = node.type === 'word' ? -15 : node.type === 'verse' ? 15 : 0;
          
          const dx = node.x - cx;
          const dy = node.y - cy;
          const len = Math.sqrt(dx * dx + dy * dy);
          const px = (-dy / len) * curvature;
          const py = (dx / len) * curvature;

          const controlX = midX + px;
          const controlY = midY + py;

          // Geometric/schematic ghost lines
          const orthoX = dx > dy ? node.x : cx;
          const orthoY = dx > dy ? cy : node.y;

          return (
            <g key={`path-${node.id}`}>
              {/* Schematic angular shadow connecting path */}
              <path
                d={`M ${cx} ${cy} L ${orthoX} ${orthoY} L ${node.x} ${node.y}`}
                fill="none"
                stroke={ringStroke}
                strokeWidth="1"
                strokeDasharray="3 3"
                className="opacity-30 transition-all duration-300"
              />
              
              {/* Primary sweeping organic path */}
              <path
                d={`M ${cx} ${cy} Q ${controlX} ${controlY} ${node.x} ${node.y}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDash}
                className="transition-all duration-300"
              />
              {(isSelected || hoveredNodeId === node.id) && (
                <circle r="4" fill={isParchment ? "#8c6239" : isCosmic ? "#06b6d4" : "#38bdf8"} className="animate-ping">
                  <animateMotion
                    dur="2.5s"
                    repeatCount="indefinite"
                    path={`M ${cx} ${cy} Q ${controlX} ${controlY} ${node.x} ${node.y}`}
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* HTML absolute nodes rendering */}
      <div className="absolute inset-0 w-full h-full z-20">
        {nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id;
          const isHovered = hoveredNodeId === node.id;
          const isRoot = node.type === 'root';

          const leftOffset = node.x - node.radius;
          const topOffset = node.y - node.radius;

          const activeBorderConfig = isSelected
            ? (isParchment ? 'scale-110 !border-[#5c3d2e] ring-4 ring-[#8c6239]/40' : isCosmic ? 'scale-110 !border-white ring-4 ring-cyan-500/50' : 'scale-110 !border-white ring-4 ring-sky-500/50')
            : 'hover:scale-105 shadow-md';

          const labelColorStr = isRoot 
            ? (isParchment ? 'text-[#fdfbf7]' : isCosmic ? 'text-indigo-50' : 'text-emerald-50')
            : node.type === 'query' 
              ? (isParchment ? 'text-orange-50' : isCosmic ? 'text-pink-50' : 'text-amber-50')
              : (isParchment ? 'text-[#342417]' : 'text-inherit');

          return (
            <div
              key={node.id}
              style={{
                left: `${leftOffset}px`,
                top: `${topOffset}px`,
                width: `${node.radius * 2}px`,
                height: `${node.radius * 2}px`,
              }}
              draggable={false}
              className={`absolute rounded-full border flex flex-col justify-center items-center text-center cursor-pointer p-2 transition-all duration-300 ease-out z-20
                ${node.color}
                ${activeBorderConfig}
              `}
              onMouseEnter={() => setHoveredNodeId(node.id)}
              onMouseLeave={() => setHoveredNodeId(null)}
              onClick={() => onNodeClick({ type: node.type, data: node.data })}
            >
              <div className="flex flex-col items-center justify-center h-full w-full max-w-full overflow-hidden">
                {isRoot && <Sparkles className={`w-4 h-4 mb-0.5 animate-pulse ${isParchment ? 'text-orange-200' : isCosmic ? 'text-indigo-200' : 'text-emerald-300'}`} />}
                {node.type === 'verse' && <BookOpen className={`w-3.5 h-3.5 mb-0.5 ${isParchment ? 'text-[#8c6239]' : 'text-indigo-300'}`} />}

                {/* Main Text */}
                <span className={`font-semibold tracking-wide block truncate w-full ${labelColorStr} ${
                  isRoot ? 'text-2xl font-bold' : 
                  node.type === 'query' ? 'text-xl font-bold' : 'text-sm'
                }`}>
                  {node.label}
                </span>

                {/* Sub text / Transliteration */}
                <span className={`block truncate w-full ${node.textColor} ${
                  isRoot ? 'text-xs font-mono font-medium mt-0.5 uppercase' : 
                  node.type === 'query' ? 'text-[10px] font-mono tracking-wider' : 'text-[10px] mt-0.5 font-sans font-medium'
                }`}>
                  {node.subLabel}
                </span>

                {/* Meaning preview on central/searched orbital */}
                {(isRoot || node.type === 'query' || isHovered) && (
                  <span className={`text-[9px] mt-1 font-sans block max-w-[90%] truncate text-center leading-none ${isParchment ? 'text-[#5c4939]' : 'text-slate-300'}`}>
                    {node.concept}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
        </div>
      </div>

      {/* Floating Instructions Legend Banner */}
      <div className={`absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between border rounded-xl px-4 py-2.5 z-30 select-none backdrop-blur-sm shadow-xl pointer-events-auto transition-all ${
        isParchment 
          ? 'bg-[#f4ebe1]/95 border-[#dfd2be]/85 text-[#4d3a2a]' 
          : isCosmic 
            ? 'bg-[#000]/95 border-indigo-950/80 text-indigo-100/90' 
            : 'bg-slate-900/95 border-slate-800/80 text-slate-300'
      }`}>
        <div className="flex items-center space-x-2">
          <HelpCircle className={`w-4 h-4 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'}`} />
          <span className="text-xs font-sans">
            Click nodes to inspect meaning. Explore families of matching Quranic verbs and nouns.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 mt-2 sm:mt-0 text-[10px] sm:text-[11px] font-mono opacity-85">
          <span className="flex items-center">
            <span className={`w-2.5 h-2.5 rounded-full mr-1 ${isParchment ? 'bg-[#8c6239]' : isCosmic ? 'bg-indigo-500' : 'bg-emerald-500'}`} /> Root
          </span>
          <span className="flex items-center">
            <span className={`w-2.5 h-2.5 rounded-full mr-1 ${isParchment ? 'bg-[#4f3824]' : isCosmic ? 'bg-pink-500' : 'bg-amber-500'}`} /> Search Word
          </span>
          <span className="flex items-center">
            <span className={`w-2.5 h-2.5 rounded-full mr-1 ${isParchment ? 'bg-[#ebd8c3] border border-[#dfd2be]' : isCosmic ? 'bg-[#0d0f1a] border border-cyan-800' : 'bg-slate-800 border border-slate-700'}`} /> Related Words
          </span>
          <span className="flex items-center">
            <span className={`w-2.5 h-2.5 rounded-full mr-1 ${isParchment ? 'bg-[#dfd3c3] border border-[#8c6239]' : isCosmic ? 'bg-cyan-950/80 border border-cyan-500' : 'bg-indigo-950 border border-indigo-500'}`} /> Verse
          </span>
        </div>
      </div>
    </div>
  );
}
