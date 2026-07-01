const fs = require('fs');
let content = fs.readFileSync('src/pages/Register.tsx', 'utf8');

content = content.replace(/"আপনার ইমেইলে একটি যাচাই লিংক পাঠানো হয়েছে। ইমেইল চেক করুন এবং লিংকে ক্লিক করুন।"/g, 't("email_verify_sent")');
content = content.replace(/"আপনার ইমেইলে একটি যাচাই লিংক পাঠানো হয়েছে। ইমেইল চেক করুন এবং লিংকে ক্লিক করুন। \(Demo\)"/g, 't("email_verify_sent")');
content = content.replace(/>ইমেইল যাচাই করুন<\/h2>/g, '>{t("email_verify_check")}</h2>');
content = content.replace(/>লগইন পেজে ফিরে যান<\/button>/g, '>{t("login_here")}</button>');
content = content.replace(/>ফোন নম্বর<\/label>/g, '>{t("phone_label")}</label>');

fs.writeFileSync('src/pages/Register.tsx', content);
