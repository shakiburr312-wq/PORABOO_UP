const fs = require('fs');
let content = fs.readFileSync('src/pages/SettingsPage.tsx', 'utf8');

content = content.replace(/"অ্যাকাউন্ট"/g, 't("settings_account")');
content = content.replace(/"নিরাপত্তা"/g, 't("settings_security")');
content = content.replace(/"নোটিফিকেশন"/g, 't("settings_notifications")');
content = content.replace(/"গোপনীয়তা"/g, 't("settings_privacy")');
content = content.replace(/"ভাষা"/g, 't("settings_language")');

content = content.replace(/>সেটিংস<\/h2>/g, '>{t("settings_title")}</h2>');
content = content.replace(/>অ্যাকাউন্ট সেটিংস<\/h3>/g, '>{t("settings_account")}</h3>');
content = content.replace(/>সম্পূর্ণ নাম<\/label>/g, '>{t("full_name_label")}</label>');
content = content.replace(/>ইমেইল ঠিকানা<\/label>/g, '>{t("email_label")}</label>');
content = content.replace(/>ফোন নম্বর<\/label>/g, '>{t("phone_label")}</label>');

content = content.replace(/>সংরক্ষণ করুন<\/button>/g, '>{t("settings_save")}</button>');

content = content.replace(/>নিরাপত্তা ও লগইন<\/h3>/g, '>{t("settings_security")}</h3>');
content = content.replace(/>বর্তমান পাসওয়ার্ড<\/label>/g, '>{t("settings_current_pass")}</label>');
content = content.replace(/>নতুন পাসওয়ার্ড<\/label>/g, '>{t("settings_new_pass")}</label>');
content = content.replace(/>নতুন পাসওয়ার্ড নিশ্চিত করুন<\/label>/g, '>{t("settings_confirm_pass")}</label>');
content = content.replace(/>পাসওয়ার্ড পরিবর্তন করুন<\/button>/g, '>{t("settings_change_pass")}</button>');
content = content.replace(/>অ্যাকাউন্ট ডিলিট করুন<\/h4>/g, '>{t("settings_delete_acc")}</h4>');

content = content.replace(/>নোটিফিকেশন পছন্দ<\/h3>/g, '>{t("settings_notifications")}</h3>');
content = content.replace(/>ভাষা পছন্দ \(Language\)<\/h3>/g, '>{t("settings_language")}</h3>');

fs.writeFileSync('src/pages/SettingsPage.tsx', content);
