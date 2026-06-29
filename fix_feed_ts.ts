import fs from 'fs';
let content = fs.readFileSync('src/pages/Feed.tsx', 'utf8');
content = content.replace(
  /const newImages = files.map\(file => URL.createObjectURL\(file\)\);/,
  'const newImages = files.map(file => URL.createObjectURL(file as File));'
);
fs.writeFileSync('src/pages/Feed.tsx', content);
