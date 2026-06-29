import fs from 'fs';

let content = fs.readFileSync('src/pages/Feed.tsx', 'utf8');

// Replace strings
content = content.replace(/Profile Completion/g, '{t("profile_completion")}');
content = content.replace(/> আমার প্রোফাইল</g, '> {t("feed_profile")}<');
content = content.replace(/> প্রোফাইল</g, '> {t("feed_profile")}<');
content = content.replace(/> Settings</g, '> {t("feed_settings")}<');
content = content.replace(/placeholder="আপনার অভিজ্ঞতা বা প্রশ্ন শেয়ার করুন..."/g, 'placeholder={t("feed_placeholder")}');
content = content.replace(/>ফোন, ইমেইল বা ঠিকানা শেয়ার করবেন না। এটি কমিউনিটি গাইডলাইনের পরিপন্থী।</g, '>{t("feed_warning")}<');
content = content.replace(/>Public</g, '>{t("feed_visibility_public")}<');
content = content.replace(/>Tutors Only</g, '>{t("feed_visibility_tutors")}<');
content = content.replace(/>Guardians Only</g, '>{t("feed_visibility_guardians")}<');
content = content.replace(/>পোস্ট হচ্ছে...</g, '>{t("wait")}<');
content = content.replace(/>পোস্ট করুন</g, '>{t("feed_post_btn")}<');
content = content.replace(/>কোনো পোস্ট পাওয়া যায়নি</g, '>{t("no_posts")}<');
content = content.replace(/2 ঘন্টা আগে/g, '2 hours ago'); // The prompt doesn't specify translations for time ago except for job board ones, but let's just let it be or use existing translation if there is any.
content = content.replace(/>অনুরোধ পাঠানো হয়েছে/g, '>{t("feed_pending")}');
content = content.replace(/>সংযুক্ত ✓</g, '>{t("feed_connected")}<');
content = content.replace(/> সংযুক্ত হন</g, '> {t("feed_connect")}<');
content = content.replace(/>মন্তব্য করুন...</g, '>{t("feed_comment")}...<');
content = content.replace(/placeholder="মন্তব্য করুন..."/g, 'placeholder={t("feed_comment") + "..."}');
content = content.replace(/>পাঠান</g, '>{t("feed_post_btn")}<');
content = content.replace(/>সাম্প্রতিক জব</g, '>{t("feed_recent_jobs")}<');
content = content.replace(/>আরও দেখুন</g, '>{t("feed_see_more")}<');
content = content.replace(/>টিউশন পার্টনার</g, '>{t("feed_partners")}<');

// Write back
fs.writeFileSync('src/pages/Feed.tsx', content);
console.log('Strings updated');
