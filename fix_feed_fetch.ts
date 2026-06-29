import fs from 'fs';

let feedStr = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

feedStr = feedStr.replace(
  /profiles:author_id \( full_name, role \)/,
  'profiles:author_id ( full_name, role, avatar_url )'
);

feedStr = feedStr.replace(
  /author_role: p\.profiles\?\.role \|\| "user",/,
  'author_role: p.profiles?.role || "user",\n            author_avatar: p.profiles?.avatar_url,'
);

fs.writeFileSync('src/pages/Feed.tsx', feedStr);
console.log('Feed.tsx avatar fetching updated');
