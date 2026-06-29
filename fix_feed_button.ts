import fs from 'fs';

let feedStr = fs.readFileSync('src/pages/Feed.tsx', 'utf8');
feedStr = feedStr.replace(
  /disabled=\{isPosting \|\| !postContent\.trim\(\) \|\| showWarning\}/g,
  'disabled={isPosting || (!postContent.trim() && images.length === 0) || showWarning}'
);

fs.writeFileSync('src/pages/Feed.tsx', feedStr);
console.log('Fixed disabled state on feed post button');
