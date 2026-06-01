const fs = require('fs');

let content = fs.readFileSync('src/components/VerseBreakdown.tsx', 'utf8');

// 1. Surah selector vs Trending
const headerSectionOld = `<div className={\`border rounded-2xl p-5 \${colors.cardBg} transition-all duration-300 shadow-sm animate-fadeIn\`}>
        <div className="flex flex-col xl:flex-row items-stretch xl:items-start justify-between gap-6">
          
          {/* Preset Select Controls and Cache */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xs font-bold opacity-85 flex items-center gap-1.5 mb-2 font-mono uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Shipped Offline Presets:
              </h3>`;

const headerSectionNew = `<div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
        
        {/* Preset Select Controls and Cache */}
        <div className={\`border rounded-2xl p-6 \${colors.cardBg} transition-all duration-300 shadow-sm flex flex-col h-full\`}>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xs font-bold opacity-85 flex items-center gap-1.5 mb-2 font-mono uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Shipped Offline Presets:
              </h3>`;

content = content.replace(headerSectionOld, headerSectionNew);

const formDividerOld = `</div>
            )}
          </div>

          <div className="h-px xl:h-28 w-full xl:w-px bg-current opacity-10 shrink-0"></div>

          {/* Custom Search Form with real-time Lookups */}
          <form onSubmit={handleLiveQuery} className="flex-1 flex flex-col gap-4">`;

const formDividerNew = `</div>
            )}
          </div>
        </div>

        {/* Custom Search Form with real-time Lookups */}
        <div className={\`border rounded-2xl p-6 \${colors.cardBg} transition-all duration-300 shadow-sm flex flex-col h-full\`}>
          <form onSubmit={handleLiveQuery} className="flex-1 flex flex-col gap-5 justify-between">`;

content = content.replace(formDividerOld, formDividerNew);

const closeSearchCardOld = `</button>
          </form>
        </div>`;

const closeSearchCardNew = `</button>
          </form>
        </div>
      </div>`;

content = content.replace(closeSearchCardOld, closeSearchCardNew);

// 2. Arabic Verse Display vs Translation
const verseCardOld = `  {/* Main Structural Display Panel */}
      {activeVerseData && (
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* The Verse display card */}
          <div className={\`border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all \${colors.cardBg} shadow-sm\`}>
            <div className="w-full flex items-center justify-between border-b border-current/10 pb-3 mb-5">`;

const verseCardNew = `  {/* Main Structural Display Panel */}
      {activeVerseData && (
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* The Verse display card */}
          <div className={\`border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center transition-all \${colors.cardBg} shadow-sm\`}>
            <div className="w-full flex items-center justify-between border-b border-current/10 pb-3 mb-5">`;

content = content.replace(verseCardOld, verseCardNew);

const translationOld = `{/* English Translation */}
            <div className="mt-2 border-t border-current/5 pt-4 w-full">
              <p className="text-[10px] font-mono opacity-40 uppercase tracking-wider mb-1.5">
                Universal English Translation
              </p>
              <p className="text-sm italic opacity-85 leading-relaxed font-serif text-current/90">
                "{activeVerseData.fullVerseTranslation}"
              </p>
            </div>
          </div>`;

const translationNew = `          </div>

          {/* English Translation Card */}
          <div className={\`border rounded-2xl p-6 text-center transition-all \${colors.cardBg} shadow-sm\`}>
            <p className="text-[10px] font-mono opacity-40 uppercase tracking-wider mb-2 font-bold">
              Universal English Translation
            </p>
            <p className="text-[15px] md:text-base italic opacity-95 leading-relaxed font-serif text-current">
              "{activeVerseData.fullVerseTranslation}"
            </p>
          </div>`;

content = content.replace(translationOld, translationNew);

fs.writeFileSync('src/components/VerseBreakdown.tsx', content);
console.log("VerseBreakdown ui separated");

