const fs = require('fs');
let content = fs.readFileSync('src/pages/Register.tsx', 'utf8');

content = content.replace(/লগইন পেজে ফিরে যান/g, '{t("login_here")}');

fs.writeFileSync('src/pages/Register.tsx', content);
