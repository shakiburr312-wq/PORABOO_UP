import fs from 'fs';
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
  const parts = code.split(label);
  if (parts.length > 1) {
    // We expect the first occurrence after split to be the label in the form
    // find the next </label>
    for (let i = 1; i < parts.length; i++) {
      const idx = parts[i].indexOf('</label>');
      if (idx !== -1) {
        if (!parts[i].includes('AIBadge')) {
          parts[i] = parts[i].substring(0, idx) + ` {autoFilledFields.${key} && <AIBadge />}` + parts[i].substring(idx);
        }
      }
    }
    code = parts.join(label);
  }
}

fs.writeFileSync('src/pages/TutorOnboarding.tsx', code);
console.log('done');
