import fs from 'fs';

let content = fs.readFileSync('src/pages/JobBoard.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('src/pages/JobBoard.tsx', content);

let content2 = fs.readFileSync('src/pages/Register.tsx', 'utf8');
content2 = content2.replace(/\\`/g, '`');
content2 = content2.replace(/\\\$/g, '$');
fs.writeFileSync('src/pages/Register.tsx', content2);
