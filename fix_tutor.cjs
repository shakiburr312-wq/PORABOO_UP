const fs = require('fs');
let content = fs.readFileSync('src/pages/TutorOnboarding.tsx', 'utf8');

content = content.replace(/>আপনার প্রোফাইল তথ্য পূরণ করুন<\/p>/g, '>{t("onboard_subtitle")}</p>');

fs.writeFileSync('src/pages/TutorOnboarding.tsx', content);
