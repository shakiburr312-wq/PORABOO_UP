const fs = require('fs');
const execSync = require('child_process').execSync;

const translationsCode = fs.readFileSync('src/lib/translations.ts', 'utf8');
const definedKeys = [...translationsCode.matchAll(/"([a-zA-Z0-9_]+)":/g)].map(m => m[1]);
const definedSet = new Set(definedKeys);

const grepOutput = execSync('grep -rho "\\bt(\\"[^\\"]*\\")" src || true').toString();
const usedKeys = [...grepOutput.matchAll(/\bt\("([^"]+)"\)/g)].map(m => m[1]);
const usedSet = new Set(usedKeys);

const missing = [...usedSet].filter(k => !definedSet.has(k));
console.log("Missing keys:");
console.log(missing);
