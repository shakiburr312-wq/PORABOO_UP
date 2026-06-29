import fs from 'fs';

let code = fs.readFileSync('src/pages/TutorOnboarding.tsx', 'utf8');

const regex = /const extractCVInfo = async \(cvText: string\) => \{[\s\S]*?const handleFileUpload = async \(e: ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?catch \(err: any\) \{[\s\S]*?\}\s*\n\s*\};\s*\n/m;

const replacement = `const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith('.pdf')) {
      setErrorMsg("Please upload a PDF file");
      return;
    }

    setFillMode("ai");
    setLoading(true);
    setUploadProgress(0);
    setErrorMsg(null);
    setSuccessMsg(null);
    setAutoFilledFields({});

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 400);

    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(file);
      });

      const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
      if (!API_KEY) throw new Error("No API Key");

      const prompt = \`Extract information from this CV.
Return ONLY a raw JSON object, no markdown, 
no backticks, no explanation. Just JSON:
{
  "full_name": "",
  "contact": "",
  "email": "",
  "permanent_address": "",
  "present_address": "",
  "education_qualification": "",
  "college_university": "",
  "experience": "",
  "subjects": [],
  "bio": ""
}\`;

      const response = await fetch(
        \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${API_KEY}\`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  inline_data: {
                    mime_type: 'application/pdf',
                    data: base64
                  }
                },
                {
                  text: prompt
                }
              ]
            }]
          })
        }
      );

      clearInterval(interval);
      setUploadProgress(100);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API failed');
      }

      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      const cleaned = rawText
        .replace(/\`\`\`json/gi, '')
        .replace(/\`\`\`/gi, '')
        .replace(/^\\s*[\\r\\n]/gm, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      const filled: Record<string, boolean> = {};
      if (parsed.full_name) filled.full_name = true;
      if (parsed.contact) filled.contact = true;
      if (parsed.permanent_address) filled.permanent_address = true;
      if (parsed.present_address) filled.present_address = true;
      if (parsed.education_qualification && EDUCATION_OPTIONS.includes(parsed.education_qualification)) filled.education_qualification = true;
      if (parsed.college_university) filled.college_university = true;
      if (parsed.experience && EXPERIENCE_OPTIONS.includes(parsed.experience)) filled.experience = true;
      if (Array.isArray(parsed.subjects) && parsed.subjects.length > 0) filled.subjects = true;
      if (parsed.bio) filled.bio = true;

      setForm(prev => ({
        ...prev,
        full_name: parsed.full_name || prev.full_name,
        contact: parsed.contact || prev.contact,
        permanent_address: parsed.permanent_address || prev.permanent_address,
        present_address: parsed.present_address || prev.present_address,
        education_qualification: (parsed.education_qualification && EDUCATION_OPTIONS.includes(parsed.education_qualification)) ? parsed.education_qualification : prev.education_qualification,
        college_university: parsed.college_university || prev.college_university,
        experience: (parsed.experience && EXPERIENCE_OPTIONS.includes(parsed.experience)) ? parsed.experience : prev.experience,
        subjects: (Array.isArray(parsed.subjects) && parsed.subjects.length > 0) ? parsed.subjects.filter((s: string) => SUBJECTS_OPTIONS.includes(s)) : prev.subjects,
        bio: parsed.bio || prev.bio
      }));

      setAutoFilledFields(filled);
      setLoading(false);
      setFillMode("manual");
      setSuccessMsg("CV থেকে তথ্য সফলভাবে পূরণ হয়েছে ✓");
      
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
      
      setTimeout(() => {
        if (formRef.current) {
          window.scrollTo({ top: formRef.current.offsetTop - 40, behavior: 'smooth' });
        }
      }, 300);

    } catch (err: any) {
      clearInterval(interval);
      console.error('CV Parse Error:', err);
      let errMsg = "CV parsing কনফিগার করা হয়নি। অনুগ্রহ করে manually পূরণ করুন।";
      
      if (err.message === "QUOTA_EXCEEDED" || err.message?.includes("429")) {
        errMsg = "সাময়িক সমস্যা। অনুগ্রহ করে manually পূরণ করুন।";
      } else if (err.message === "INVALID_KEY" || err.message === "No API Key" || err.message?.includes("API key not valid")) {
        errMsg = "API key সঠিক নয়। অনুগ্রহ করে manually পূরণ করুন।";
      } else if (err.message !== "EMPTY_CV" && err.message !== "UNSUPPORTED_TYPE") {
        errMsg = "CV parsing ব্যর্থ হয়েছে। manually পূরণ করুন।";
      }

      setErrorMsg(errMsg);
      
      setTimeout(() => {
        setLoading(false);
        setFillMode("manual");
        setErrorMsg(null);
        setTimeout(() => {
          if (formRef.current) {
            window.scrollTo({ top: formRef.current.offsetTop - 40, behavior: 'smooth' });
          }
        }, 100);
      }, 3000);
    }
  };
`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/pages/TutorOnboarding.tsx', code);
console.log('done');
