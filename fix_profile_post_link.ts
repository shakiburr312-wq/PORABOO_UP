import fs from 'fs';

let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');
content = content.replace(
  /onClick=\{.*?document\.getElementById\("post-input"\)\?.focus\(\).*?\}/g,
  `onClick={() => window.location.hash = "#/feed"}`
);
content = content.replace(
  /<button className="flex-1 flex justify-center items-center gap-2 text-gray-600 hover:bg-gray-100 py-2 rounded-md font-semibold text-\[15px\]">/g,
  `<button onClick={() => window.location.hash = "#/feed"} className="flex-1 flex justify-center items-center gap-2 text-gray-600 hover:bg-gray-100 py-2 rounded-md font-semibold text-[15px]">`
);

fs.writeFileSync('src/pages/ProfilePage.tsx', content);
console.log("Fixed Post creator links");
