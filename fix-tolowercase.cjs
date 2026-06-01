const fs = require('fs');
const path = require('path');

function replaceStr(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes("safeLower")) {
      // add import at top
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
          const depth = filePath.split('/').length - 2; // src/components/File.tsx -> depth 1
          const relativePath = depth === 0 ? './lib/utils' : depth === 1 ? '../lib/utils' : '../../lib/utils';
          // only add if it's not utils.ts itself
          if (!filePath.endsWith('src/lib/utils.ts')) {
              content = `import { safeLower } from '${relativePath}';\n` + content;
          }
      }
  }

  // replace  .toLowerCase() with safeLower() using regex
  // This is a bit tricky, but simple things like `x.toLowerCase()` -> `safeLower(x)`
  // `x.toLowerCase` -> `safeLower(x)`
  // Actually, replacing `foo.toLowerCase()` with `safeLower(foo)` requires AST or tricky regex.
  // A safer regex for `foo.toLowerCase()` where foo doesn't contain parenthesis:
  // `([a-zA-Z0-9_\.\(\)\[\]\?\']+)\.toLowerCase\(\)` -> `safeLower($1)`
  // Let's do a more robust approach. Instead of complex regex, we can just change `.toLowerCase()` to `?.toLowerCase() ?? ""` 
  // Wait, user explicitly asked for `safeLower(str)` used everywhere.
  
  content = content.replace(/([a-zA-Z0-9_\.]+(\(\))?(\[.*?\])?)\.toLowerCase\(\)/g, 'safeLower($1)');
  
  // Also handle (x || '').toLowerCase()
  content = content.replace(/\(([^)]+)\)\.toLowerCase\(\)/g, "safeLower($1)");

  // Let's see if there are any remaining `.toLowerCase()`
  content = content.replace(/\.toLowerCase\(\)/g, "??.toLowerCase()"); // safety fallback

  fs.writeFileSync(filePath, content);
}

const files = [
  'src/components/AsmaAlHusna.tsx',
  'src/components/QuranicLexicon.tsx',
  'src/components/RootToWords.tsx',
  'src/components/HurufLibrary.tsx',
  'src/components/VerseBreakdown.tsx',
  'src/components/CommonWordsTable.tsx',
  'src/components/PatternDatabase.tsx',
  'src/components/AudioPlayButton.tsx',
  'src/data/commonWords500.ts',
  'src/offlineData.ts',
  'src/App.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
      console.log('fixing ' + f);
      replaceStr(f);
  }
});
