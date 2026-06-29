import fs from 'fs';
const content = fs.readFileSync('src/lib/translations.ts', 'utf-8');
const lines = content.split('\n');
const fixed = [];
let insideObject = false;
let currentKeys = new Set();
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('en: {') || line.includes('bn: {')) { 
    insideObject = true; 
    currentKeys.clear(); 
  }
  if (insideObject && line.match(/^\s*\},?\s*$/)) { 
    insideObject = false; 
    currentKeys.clear(); 
  }
  
  if (insideObject) {
    const match = line.match(/^\s*"([^"]+)":/);
    if (match) {
      const key = match[1];
      if (currentKeys.has(key)) {
        console.log('Skipping duplicate key:', key);
        continue;
      }
      currentKeys.add(key);
    }
  }
  fixed.push(line);
}
fs.writeFileSync('src/lib/translations.ts', fixed.join('\n'));
console.log('Fixed duplicates in translations.ts');
