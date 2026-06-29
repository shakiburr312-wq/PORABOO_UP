import { useLanguage } from "../hooks/useLanguage";

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-24 right-6 z-50 bg-[#1B2F6E] text-[#F5A623] font-sans font-semibold text-sm px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
    >
      {language === 'bn' ? 'English' : 'বাংলা'}
    </button>
  );
}
