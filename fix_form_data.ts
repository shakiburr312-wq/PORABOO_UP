import fs from 'fs';
let code = fs.readFileSync('src/pages/TutorOnboarding.tsx', 'utf8');
code = code.replace(/\.\.\.formData/g, '...form');
code = code.replace(/formData\}/g, 'form}');
fs.writeFileSync('src/pages/TutorOnboarding.tsx', code);
console.log('Done refactoring');
