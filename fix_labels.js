const fs = require('fs');
let code = fs.readFileSync('src/pages/TutorOnboarding.tsx', 'utf8');

const fields = [
  { key: 'fullName', label: 't("full_name")' },
  { key: 'contactNumber', label: 't("contact_number")' },
  { key: 'permanentAddress', label: 't("permanent_address")' },
  { key: 'presentAddress', label: 't("present_address")' },
  { key: 'education', label: 't("highest_qual")' },
  { key: 'college', label: 't("college_name")' },
  { key: 'experience', label: 't("teaching_exp")' },
  { key: 'subjects', label: 't("pref_subjects")' },
  { key: 'bio', label: 't("about_you")' }
];

for (const { key, label } of fields) {
  const regex = new RegExp(`({${label.replace(/[.*+?^$\/{}()|[\\]\\\\]/g, '\\\\$&')}}.*?)(</label>)`, 'g');
  code = code.replace(regex, (match, p1, p2) => {
    // avoid double adding
    if (match.includes('AIBadge')) return match;
    return `${p1}{autoFilledFields.${key} && <AIBadge />}${p2}`;
  });
}

fs.writeFileSync('src/pages/TutorOnboarding.tsx', code);
console.log('done');
