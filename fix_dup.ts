import fs from 'fs';
let t = fs.readFileSync('src/lib/translations.ts', 'utf8');

const lines = t.split('\n');
// We need to remove line 98 and 491 (0-indexed 97 and 490)
// Or better, just remove the specific exact lines using replace once.
t = t.replace(/\n\s*"profile_completion": "Profile Completion",/, '');
t = t.replace(/\n\s*"profile_completion": "প্রোফাইল সম্পূর্ণতা",/, '');

fs.writeFileSync('src/lib/translations.ts', t);
console.log('Fixed duplicates');
