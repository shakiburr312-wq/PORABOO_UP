const fs = require('fs');
let content = fs.readFileSync('src/pages/Login.tsx', 'utf8');

content = content.replace(/{t\("login_portal"\)}/g, "{t(\"login_subtitle\")}");
content = content.replace(/{t\("email"\)}/g, "{t(\"email_label\")}");
content = content.replace(/placeholder="your@email\.com"/g, "placeholder={t(\"email_placeholder\")}");
content = content.replace(/{t\("password"\)}/g, "{t(\"password_label\")}");
content = content.replace(/placeholder="••••••••"/g, "placeholder={t(\"password_placeholder\")}");
content = content.replace(/"ইমেইল বা পাসওয়ার্ড সঠিক নয়"/g, "t(\"login_error_invalid\")");
content = content.replace(/"আপনার ইমেইল যাচাই করুন। ইনবক্স চেক করুন।"/g, "t(\"login_error_unverified\")");
content = content.replace(/"লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"/g, "t(\"login_error_general\")");
content = content.replace(/t\("nav_login"\)/g, "t(\"login_btn\")");

// Also replace the PORABOO block with a login_title
content = content.replace(
  /<span className="logo-font text-3xl tracking-wider text-navy block mb-1">\s*PORABOO\s*<\/span>/,
  '<h1 className="text-3xl font-bold text-navy block mb-1">{t("login_title")}</h1>'
);

fs.writeFileSync('src/pages/Login.tsx', content);
