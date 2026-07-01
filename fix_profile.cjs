const fs = require('fs');
let content = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');

content = content.replace(/>প্রোফাইল সম্পাদনা করুন<\/h2>/g, '>{t("profile_edit")}</h2>');
content = content.replace(/>শিক্ষাগত যোগ্যতা<\/label>/g, '>{t("profile_education")}</label>');
content = content.replace(/>অভিজ্ঞতা<\/label>/g, '>{t("profile_experience")}</label>');
content = content.replace(/>এলাকা \(থানা\/শহর\)<\/label>/g, '>{t("profile_area")}</label>');
content = content.replace(/>বিষয়সমূহ \(কমা দিয়ে আলাদা করুন\)<\/label>/g, '>{t("profile_subjects")}</label>');
content = content.replace(/>সংরক্ষণ করুন/g, '>{t("profile_save")}');
content = content.replace(/বাতিল/g, '{t("profile_cancel")}');

fs.writeFileSync('src/pages/ProfilePage.tsx', content);
