import fs from 'fs';

let content = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

content = content.replace(
  /<User className="w-5 h-5 text-slate-400" \/> প্রোফাইল/g,
  '<User className="w-5 h-5 text-slate-400" /> {t("feed_profile")}'
);

content = content.replace(
  /\{isPosting \? 'পোস্ট হচ্ছে...' : 'পোস্ট করুন'\}/g,
  '{isPosting ? t("wait") : t("feed_post_btn")}'
);

content = content.replace(
  />\s*পাঠান\s*</g,
  '> {t("feed_post_btn")} <'
);

content = content.replace(
  /৳ \{job\.budget\}/g,
  'BDT {job.budget}'
);

content = content.replace(
  />\s*আরও দেখুন\s*</g,
  '> {t("feed_see_more")} <'
);

// Mobile navbar has 'ফিড' hardcoded or similar? Wait, the user didn't mention navbar, but we should check.
content = content.replace(
  /<span>ফিড<\/span>/g,
  '<span>{t("feed_profile")}</span>'
);

fs.writeFileSync('src/pages/Feed.tsx', content);
console.log('Fixed more bangla text');
