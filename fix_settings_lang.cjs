const fs = require('fs');
let content = fs.readFileSync('src/pages/SettingsPage.tsx', 'utf8');

if (!content.includes('import { useLanguage }')) {
  content = content.replace(
    'import { useAuth } from "../lib/AuthContext";',
    'import { useAuth } from "../lib/AuthContext";\nimport { useLanguage } from "../hooks/useLanguage";'
  );
}

content = content.replace(
  'const { currentUser, logout: onLogout } = useAuth();',
  'const { currentUser, logout: onLogout } = useAuth();\n  const { t } = useLanguage();'
);

fs.writeFileSync('src/pages/SettingsPage.tsx', content);
