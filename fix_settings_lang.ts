import fs from 'fs';

let content = fs.readFileSync('src/pages/SettingsPage.tsx', 'utf8');

// Add import
if (!content.includes('useLanguage')) {
  content = content.replace(
    /import \{ Profile \}/,
    'import { Profile } from "../lib/supabase";\nimport { useLanguage } from "../hooks/useLanguage";\n//'
  );
}

// Add hook
if (!content.includes('const { language, toggleLanguage } = useLanguage()')) {
  content = content.replace(
    /const \[activeTab, setActiveTab\] = useState\("account"\);/,
    'const [activeTab, setActiveTab] = useState("account");\n  const { language, toggleLanguage } = useLanguage();'
  );
}

// Replace buttons
const oldLangHtml = \`              <div className="max-w-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">ভাষা পছন্দ (Language)</h3>
                <div className="flex gap-4">
                  <button className="flex-1 py-3 border-2 border-[#1B2F6E] bg-navy/5 text-[#1B2F6E] font-bold rounded-md">বাংলা</button>
                  <button className="flex-1 py-3 border-2 border-gray-200 text-gray-500 font-semibold rounded-md hover:bg-gray-50">English</button>
                </div>
              </div>\`;
              
const newLangHtml = \`              <div className="max-w-md">
                <h3 className="text-xl font-bold text-gray-900 mb-6">ভাষা পছন্দ (Language)</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={() => language !== 'bn' && toggleLanguage()}
                    className={\`flex-1 py-3 border-2 font-bold rounded-md transition-colors \${language === 'bn' ? 'border-[#1B2F6E] bg-navy/5 text-[#1B2F6E]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}\`}
                  >
                    বাংলা
                  </button>
                  <button 
                    onClick={() => language !== 'en' && toggleLanguage()}
                    className={\`flex-1 py-3 border-2 font-bold rounded-md transition-colors \${language === 'en' ? 'border-[#1B2F6E] bg-navy/5 text-[#1B2F6E]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}\`}
                  >
                    English
                  </button>
                </div>
              </div>\`;

content = content.replace(oldLangHtml, newLangHtml);

fs.writeFileSync('src/pages/SettingsPage.tsx', content);
