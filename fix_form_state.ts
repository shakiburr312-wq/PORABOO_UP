import fs from 'fs';

let code = fs.readFileSync('src/pages/TutorOnboarding.tsx', 'utf8');

// Replace formData with form, setFormData with setForm
code = code.replace(/const \[formData, setFormData\] = useState\(\{/g, 'const [form, setForm] = useState({');
code = code.replace(/setFormData\(/g, 'setForm(');
code = code.replace(/formData\./g, 'form.');

// Replace field names
const fieldMap = {
  'fullName': 'full_name',
  'permanentAddress': 'permanent_address',
  'presentAddress': 'present_address',
  'education': 'education_qualification',
  'college': 'college_university',
  'classLevels': 'class_levels',
  'teachingAreas': 'teaching_areas',
  'expectedSalary': 'expected_salary',
  'demoLink': 'demo_link'
};

for (const [oldKey, newKey] of Object.entries(fieldMap)) {
  code = code.replace(new RegExp(`\\b${oldKey}\\b`, 'g'), newKey);
}

// Now replace the CV parse updater
const oldCVUpdater = /setForm\(\s*prev => \{\s*const updated = \{ \.\.\.prev \};\s*if \(data\.full_name\)[^]*?return updated;\s*\}\);/m;

const newCVUpdater = `const filled: Record<string, boolean> = {};
        if (data.full_name) filled.full_name = true;
        if (data.contact) filled.contact = true;
        if (data.permanent_address) filled.permanent_address = true;
        if (data.present_address) filled.present_address = true;
        if (data.education_qualification && EDUCATION_OPTIONS.includes(data.education_qualification)) filled.education_qualification = true;
        if (data.college_university) filled.college_university = true;
        if (data.experience && EXPERIENCE_OPTIONS.includes(data.experience)) filled.experience = true;
        if (Array.isArray(data.subjects) && data.subjects.length > 0) filled.subjects = true;
        if (data.bio) filled.bio = true;

        setForm(prev => ({
          ...prev,
          full_name: data.full_name || prev.full_name,
          contact: data.contact || prev.contact,
          permanent_address: data.permanent_address || prev.permanent_address,
          present_address: data.present_address || prev.present_address,
          education_qualification: (data.education_qualification && EDUCATION_OPTIONS.includes(data.education_qualification)) ? data.education_qualification : prev.education_qualification,
          college_university: data.college_university || prev.college_university,
          experience: (data.experience && EXPERIENCE_OPTIONS.includes(data.experience)) ? data.experience : prev.experience,
          subjects: (Array.isArray(data.subjects) && data.subjects.length > 0) ? data.subjects.filter((s: string) => SUBJECTS_OPTIONS.includes(s)) : prev.subjects,
          bio: data.bio || prev.bio
        }));`;

code = code.replace(oldCVUpdater, newCVUpdater);

// Fix the badges
code = code.replace(/autoFilledFields\.contactNumber/g, 'autoFilledFields.contact');
code = code.replace(/autoFilledFields\.education/g, 'autoFilledFields.education_qualification');
code = code.replace(/autoFilledFields\.college/g, 'autoFilledFields.college_university');

fs.writeFileSync('src/pages/TutorOnboarding.tsx', code);
console.log('Done refactoring');
