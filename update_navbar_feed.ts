import fs from 'fs';

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
content = content.replace(
  />\s*ফিড\s*<\/button>/g,
  '>{t("nav_feed")}</button>'
);
fs.writeFileSync('src/components/Navbar.tsx', content);

let translations = fs.readFileSync('src/lib/translations.ts', 'utf8');
translations = translations.replace(
  /"nav_home": "Home",/,
  '"nav_home": "Home",\n    "nav_feed": "Feed",'
);
translations = translations.replace(
  /"nav_home": "মূল পাতা",/,
  '"nav_home": "মূল পাতা",\n    "nav_feed": "ফিড",'
);
fs.writeFileSync('src/lib/translations.ts', translations);
