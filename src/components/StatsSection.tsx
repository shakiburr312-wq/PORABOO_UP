import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../hooks/useLanguage";

// Helper to convert English digits to Bangla numerals
function toBanglaNumber(num: number | string): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(num).replace(/[0-9]/g, (digit) => banglaDigits[parseInt(digit, 10)]);
}

export default function StatsSection() {
  const { language, t } = useLanguage();
  const [tutorCount, setTutorCount] = useState(0);
  const [hireCount, setHireCount] = useState(0);
  const [districtCount, setDistrictCount] = useState(0);
  const [feePercent, setFeePercent] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const duration = 1500; // 1.5 seconds animation
    const steps = 30;
    const stepTime = duration / steps;
    
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      
      setTutorCount(Math.min(Math.round((500 / steps) * currentStep), 500));
      setHireCount(Math.min(Math.round((200 / steps) * currentStep), 200));
      setDistrictCount(Math.min(Math.round((64 / steps) * currentStep), 64));
      setFeePercent(Math.min(Math.round((40 / steps) * currentStep), 40));

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [hasAnimated]);

  const displayNum = (num: number) => language === 'bn' ? toBanglaNumber(num) : num.toString();

  return (
    <div
      ref={sectionRef}
      id="stats-section"
      className="relative bg-navy py-16 sm:py-20 text-white overflow-hidden"
    >
      {/* Background soft grids */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Card 1: Registered Tutors */}
          <div
            id="stat-card-tutors"
            className="flex flex-col items-center text-center space-y-2 group p-4 rounded-2xl hover:bg-white/5 transition-all duration-300"
          >
            <div className="relative flex items-baseline">
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white select-none bangla-font">
                {displayNum(tutorCount)}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-yellow ml-0.5">+</span>
            </div>
            <div className="w-12 h-1 bg-yellow rounded-full transition-all duration-300 group-hover:w-20"></div>
            <p className="text-sm sm:text-base font-medium text-white/80 pt-1 bangla-font">{t("stat_tutors")}</p>
          </div>

          {/* Card 2: Successful Hires */}
          <div
            id="stat-card-hires"
            className="flex flex-col items-center text-center space-y-2 group p-4 rounded-2xl hover:bg-white/5 transition-all duration-300"
          >
            <div className="relative flex items-baseline">
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white select-none bangla-font">
                {displayNum(hireCount)}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-yellow ml-0.5">+</span>
            </div>
            <div className="w-12 h-1 bg-yellow rounded-full transition-all duration-300 group-hover:w-20"></div>
            <p className="text-sm sm:text-base font-medium text-white/80 pt-1 bangla-font">{t("stat_hires")}</p>
          </div>

          {/* Card 3: District coverage */}
          <div
            id="stat-card-districts"
            className="flex flex-col items-center text-center space-y-2 group p-4 rounded-2xl hover:bg-white/5 transition-all duration-300"
          >
            <div className="relative flex items-baseline">
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white select-none bangla-font">
                {displayNum(districtCount)}
              </span>
            </div>
            <div className="w-12 h-1 bg-yellow rounded-full transition-all duration-300 group-hover:w-20"></div>
            <p className="text-sm sm:text-base font-medium text-white/80 pt-1 bangla-font">{t("stat_districts")}</p>
          </div>

          {/* Card 4: Platform Fee */}
          <div
            id="stat-card-fees"
            className="flex flex-col items-center text-center space-y-2 group p-4 rounded-2xl hover:bg-white/5 transition-all duration-300"
          >
            <div className="relative flex items-baseline">
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white select-none bangla-font">
                {displayNum(feePercent)}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-yellow ml-0.5">%</span>
            </div>
            <div className="w-12 h-1 bg-yellow rounded-full transition-all duration-300 group-hover:w-20"></div>
            <p className="text-sm sm:text-base font-medium text-white/80 pt-1 bangla-font">{t("stat_fee")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
