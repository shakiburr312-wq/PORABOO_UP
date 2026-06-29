import fs from 'fs';

let content = fs.readFileSync('src/pages/TutorOnboarding.tsx', 'utf8');

// Replace handleSave
content = content.replace(
  /const handleSave = async \(e: FormEvent\) => \{[\s\S]*?onComplete\(\);\n    setLoading\(false\);\n  \};/,
  `const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (progressPercent < 100) {
      console.error("Please fill all required fields");
      return;
    }
    
    setLoading(true);
    setLoadingMsg(t("saving_profile"));

    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('tutor_profiles')
        .upsert({
          id: user.id,
          full_name: form.full_name,
          permanent_address: form.permanent_address,
          present_address: form.present_address,
          contact: form.contact,
          education_qualification: form.education_qualification,
          experience: form.experience,
          student_id_url: studentIdImg || "",
          college_university: form.college_university,
          nid: form.nid,
          subjects: form.subjects,
          class_levels: form.class_levels,
          medium: form.medium,
          teaching_areas: form.teaching_areas,
          expected_salary: form.expected_salary ? parseInt(form.expected_salary) : null,
          bio: form.bio,
          demo_class_link: form.demo_link,
          profile_complete: true,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error("Save error:", error);
        alert('সংরক্ষণ ব্যর্থ হয়েছে: ' + error.message);
        setLoading(false);
        return;
      } else {
        alert('প্রোফাইল সংরক্ষিত হয়েছে ✓');
      }
    } else {
      await new Promise(r => setTimeout(r, 1000));
    }

    onComplete();
    setLoading(false);
  };`
);

// Add useEffect to fetch profile on load
const useEffectStr = `
  import { useEffect } from "react";
`;
if (!content.includes('useEffect')) {
  content = content.replace(/import \{ useState/, 'import { useState, useEffect');
}

const fetchProfileStr = `
  // On page load, fetch existing profile:
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isSupabaseConfigured || !supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('tutor_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setForm({
          full_name: data.full_name || currentUser.full_name || '',
          contact: data.contact || currentUser.phone || '',
          permanent_address: data.permanent_address || '',
          present_address: data.present_address || currentUser.present_address || '',
          education_qualification: data.education_qualification || '',
          college_university: data.college_university || '',
          experience: data.experience || '',
          nid: data.nid || currentUser.nid_number || '',
          subjects: data.subjects || [],
          class_levels: data.class_levels || [],
          medium: data.medium || '',
          teaching_areas: data.teaching_areas || {},
          expected_salary: data.expected_salary ? String(data.expected_salary) : '',
          bio: data.bio || '',
          demo_link: data.demo_class_link || ''
        });
      }
    };
    fetchProfile();
  }, [currentUser]);
`;

content = content.replace(
  /const \[thanaSearchQuery, setThanaSearchQuery\] = useState\(""\);/,
  fetchProfileStr + '\n  const [thanaSearchQuery, setThanaSearchQuery] = useState("");'
);

fs.writeFileSync('src/pages/TutorOnboarding.tsx', content);
console.log('TutorOnboarding fixed');
