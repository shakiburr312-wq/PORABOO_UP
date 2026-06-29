import fs from 'fs';
let content = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

content = content.replace(
  /const files = Array\.from\(e\.target\.files \|\| \[\]\);/,
  'const files = Array.from(e.target.files || []) as File[];'
);

content = content.replace(
  /reader\.readAsDataURL\(file\);/,
  'reader.readAsDataURL(file as File);'
);

fs.writeFileSync('src/pages/Feed.tsx', content);
