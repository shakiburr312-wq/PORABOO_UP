import fs from 'fs';

let content = fs.readFileSync('src/lib/translations.ts', 'utf8');

const enTranslations = `
    // Feed
    "feed_placeholder": "Share your experience or ask a question...",
    "feed_post_btn": "Post",
    "feed_connect": "Connect",
    "feed_connected": "Connected ✓",
    "feed_pending": "Request Sent",
    "feed_like": "Like",
    "feed_comment": "Comment",
    "feed_share": "Share",
    "feed_recent_jobs": "Recent Jobs",
    "feed_see_more": "See More",
    "feed_partners": "Tuition Partners",
    "feed_visibility_public": "Public",
    "feed_visibility_tutors": "Tutors Only",
    "feed_visibility_guardians": "Guardians Only",
    "feed_warning": "Do not share phone/email",
    "feed_profile": "Profile",
    "feed_settings": "Settings",
`;

const bnTranslations = `
    // Feed
    "feed_placeholder": "আপনার অভিজ্ঞতা বা প্রশ্ন শেয়ার করুন...",
    "feed_post_btn": "পোস্ট করুন",
    "feed_connect": "সংযুক্ত হন",
    "feed_connected": "সংযুক্ত ✓",
    "feed_pending": "অনুরোধ পাঠানো হয়েছে",
    "feed_like": "লাইক",
    "feed_comment": "মন্তব্য",
    "feed_share": "শেয়ার",
    "feed_recent_jobs": "সাম্প্রতিক জব",
    "feed_see_more": "আরও দেখুন",
    "feed_partners": "টিউশন পাটনার",
    "feed_visibility_public": "সবাই",
    "feed_visibility_tutors": "শুধু টিউটর",
    "feed_visibility_guardians": "শুধু Guardian",
    "feed_warning": "ফোন/ইমেইল শেয়ার করবেন না",
    "feed_profile": "প্রোফাইল",
    "feed_settings": "সেটিংস",
`;

content = content.replace(/(\s*\/\/ Guardian Dashboard\s*"dashboard": "Dashboard",)/, enTranslations + '$1');
content = content.replace(/(\s*\/\/ Guardian Dashboard\s*"dashboard": "ড্যাশবোর্ড",)/, bnTranslations + '$1');

fs.writeFileSync('src/lib/translations.ts', content);
console.log('Translations updated');
