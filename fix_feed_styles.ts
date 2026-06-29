import fs from 'fs';

let feedStr = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

feedStr = feedStr.replace(
  /className="w-full h-32 object-cover rounded-lg"/g,
  'className="w-full aspect-square object-cover rounded-xl"'
);

feedStr = feedStr.replace(
  /className="w-full h-48 object-cover"/g,
  'className="w-full aspect-square object-cover"'
);

feedStr = feedStr.replace(
  /\{tutor\.name \? tutor\.name\.charAt\(0\) : "U"\}/g,
  `<img src={(tutor as any).avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(tutor.name || "U") + "&background=1a365d&color=fff"} className="w-full h-full object-cover" alt="" />`
);

feedStr = feedStr.replace(
  /<div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-lg shrink-0">\n\s*\{post\.author_name\.charAt\(0\)\}\n\s*<\/div>/g,
  `<div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-lg shrink-0 overflow-hidden">\n                            <img src={(post as any).author_avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(post.author_name) + "&background=1a365d&color=fff"} className="w-full h-full object-cover" alt="" />\n                          </div>`
);

feedStr = feedStr.replace(
  /<div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-lg shrink-0">\n\s*\{currentUser\.full_name\.charAt\(0\)\}\n\s*<\/div>/g,
  `<div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-lg shrink-0 overflow-hidden">\n                    <img src={(currentUser as any).avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.full_name) + "&background=1a365d&color=fff"} className="w-full h-full object-cover" alt="" />\n                  </div>`
);

fs.writeFileSync('src/pages/Feed.tsx', feedStr);
console.log('Feed.tsx styling updated');
