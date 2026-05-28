import React from 'react';
import { LayoutTheme } from '../types';
import { Keyboard, Delete, Trash2, X } from 'lucide-react';

interface ArabicVirtualKeyboardProps {
  onKeyPress: (char: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onClose: () => void;
  theme: LayoutTheme;
}

const ARABIC_ROW1 = ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "د"];
const ARABIC_ROW2 = ["ش", "س", "ي", "ب", "ل", "ا", "ت", "ن", "م", "ك", "ط", "ذ"];
const ARABIC_ROW3 = ["ئ", "ء", "ؤ", "ر", "لا", "ى", "ة", "و", "ز", "ظ", "أ", "إ"];

const DIACRITICS = [
  { display: "◌َ", char: "َ", name: "Fathah (a)" },
  { display: "◌ِ", char: "ِ", name: "Kasrah (i)" },
  { display: "◌ُ", char: "ُ", name: "Dammah (u)" },
  { display: "◌ْ", char: "ْ", name: "Sukun (silent)" },
  { display: "◌ّ", char: "ّ", name: "Shaddah (double)" },
  { display: "◌ً", char: "ً", name: "Fathatayn" },
  { display: "◌ٍ", char: "ٍ", name: "Kasratayn" },
  { display: "◌ٌ", char: "ٌ", name: "Dammatayn" },
  { display: "◌ٰ", char: "ٰ", name: "Dagger Alif" },
  { display: "آ", char: "آ", name: "Alif Maddah" }
];

export default function ArabicVirtualKeyboard({
  onKeyPress,
  onClear,
  onBackspace,
  onClose,
  theme
}: ArabicVirtualKeyboardProps) {
  const isParchment = theme === 'parchment';
  const isCosmic = theme === 'cosmic';

  // Modal themed container styles
  const containerClass = isParchment
    ? 'bg-[#faf6ed] border-[#ebdcc3] shadow-lg text-[#2c241e]'
    : isCosmic
      ? 'bg-[#05060f] border-indigo-950 shadow-[#05060f]/60 text-indigo-50'
      : 'bg-slate-950 border-slate-800 shadow-slate-950/50 text-slate-100';

  // Individual normal key style
  const keyClass = isParchment
    ? 'bg-[#fdfbf7] border-[#dfd2be] hover:bg-[#ebd8c3]/40 active:bg-[#ebd8c3]/80 text-[#2c241e] font-sans antialiased text-sm shadow-xs'
    : isCosmic
      ? 'bg-[#0b0c1b] border-indigo-950/60 hover:bg-slate-950 hover:border-indigo-500/40 text-indigo-100 font-sans text-sm shadow-inner'
      : 'bg-slate-900 border-slate-800/80 hover:bg-slate-850 hover:border-emerald-500/30 text-slate-100 font-sans text-sm shadow-sm';

  // Diacritic distinct key style
  const diacriticKeyClass = isParchment
    ? 'bg-[#ebd8c3]/30 border-[#dfd2be]/60 text-[#8c6239] hover:bg-[#ebd8c3]/60 active:bg-[#dfd3c3] font-sans text-xs'
    : isCosmic
      ? 'bg-indigo-950/30 border-indigo-950/40 text-[#c084fc] hover:bg-indigo-950/70 hover:border-indigo-500/50 text-xs'
      : 'bg-emerald-950/20 border-emerald-950/40 text-emerald-400 hover:bg-emerald-950/55 hover:border-emerald-500/40 text-xs';

  // Control keys style (Space, Backs, Delete)
  const controlKeyClass = isParchment
    ? 'bg-[#dfd3c3] border-[#a68c6d]/50 hover:bg-[#ebd8c3] text-[#5c3d2e] font-semibold text-xs transition-colors'
    : isCosmic
      ? 'bg-pink-950/40 border-pink-900/40 hover:bg-pink-950/70 text-pink-300 font-medium text-xs transition-colors'
      : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors';

  return (
    <div className={`rounded-xl border p-4 w-full max-w-lg mx-auto ${containerClass} animate-slideDown z-50`} dir="rtl">
      
      {/* Header Info Bar */}
      <div className="flex items-center justify-between mb-3 border-b pb-1.5 border-current/10">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Keyboard className={`w-3.5 h-3.5 ${isParchment ? 'text-[#8c6239]' : isCosmic ? 'text-indigo-400' : 'text-emerald-400'}`} />
          <h4 className="text-xs font-bold tracking-wide uppercase select-none">Arabic Root Vowel Keyboard</h4>
          <span className={`text-[10px] scale-95 font-mono px-1.5 py-0.5 rounded border leading-none ${
            isParchment ? 'bg-[#dfd3c3]/40 border-[#dfd2be]' : 'bg-current/5 border-current/10'
          }`}>
            Sarf Assist
          </span>
        </div>
        <button 
          onClick={onClose}
          type="button"
          className={`p-1 rounded-full hover:bg-current/10 transition-colors ${isParchment ? 'text-[#826e5a]' : 'text-slate-400 hover:text-white'}`}
          title="Minimize Keyboard"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. Harakat / Vowel Row */}
      <div className="grid grid-cols-10 gap-1.5 mb-2.5" dir="rtl">
        {DIACRITICS.map((v) => (
          <button
            key={v.name}
            type="button"
            onClick={() => onKeyPress(v.char)}
            className={`h-9 font-medium rounded-lg border flex flex-col items-center justify-center transition-all duration-150 transform active:scale-95 cursor-pointer ${diacriticKeyClass}`}
            title={v.name}
          >
            <span className="text-sm leading-none">{v.display}</span>
            <span className="text-[7.5px] scale-90 opacity-60 leading-none mt-0.5 font-sans truncate">{v.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Letter Keys Grid Rows */}
      <div className="space-y-1.5 mb-3" dir="rtl">
        {/* Row 1 */}
        <div className="grid grid-cols-12 gap-1">
          {ARABIC_ROW1.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => onKeyPress(letter)}
              className={`h-9 rounded-lg border font-semibold flex items-center justify-center transition-all duration-150 transform active:scale-95 cursor-pointer ${keyClass}`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-12 gap-1">
          {ARABIC_ROW2.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => onKeyPress(letter)}
              className={`h-9 rounded-lg border font-semibold flex items-center justify-center transition-all duration-150 transform active:scale-95 cursor-pointer ${keyClass}`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-12 gap-1">
          {ARABIC_ROW3.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => onKeyPress(letter)}
              className={`h-9 rounded-lg border font-semibold flex items-center justify-center transition-all duration-150 transform active:scale-95 cursor-pointer ${keyClass}`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Control Actions Row (Space, Backspace, Remove words) */}
      <div className="grid grid-cols-12 gap-1.5" dir="rtl">
        {/* Clear Key */}
        <button
          type="button"
          onClick={onClear}
          className={`col-span-3 h-9 rounded-lg border flex items-center justify-center space-x-1 space-x-reverse cursor-pointer ${controlKeyClass}`}
          title="Clear everything in search"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="font-sans">Clear</span>
        </button>

        {/* Spacebar */}
        <button
          type="button"
          onClick={() => onKeyPress(" ")}
          className={`col-span-6 h-9 rounded-lg border font-sans tracking-wide font-medium flex items-center justify-center hover:bg-current/5 active:scale-98 cursor-pointer ${
            isParchment ? 'bg-[#fdfbf7] border-[#dfd2be]' : isCosmic ? 'bg-[#0b0c1b] border-indigo-950/60' : 'bg-slate-900 border-slate-800'
          }`}
        >
          Space ␣
        </button>

        {/* Backspace Key */}
        <button
          type="button"
          onClick={onBackspace}
          className={`col-span-3 h-9 rounded-lg border flex items-center justify-center space-x-1 space-x-reverse cursor-pointer ${controlKeyClass}`}
          title="Remove last character"
        >
          <Delete className="w-3.5 h-3.5" />
          <span className="font-sans">Delete</span>
        </button>
      </div>

    </div>
  );
}
