import { useState, useEffect, useRef } from "react";
import { UserPlus, Search, ShieldAlert, ChevronRight } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

export default function HowItWorksSection() {
  const { t, language } = useLanguage();
  const [isIntersected, setIsIntersected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const d = (en: string, bn: string) => language === 'en' ? en : bn;

  return (
    <section
      id="how-it-works"
      className="relative bg-navy-bg py-20 sm:py-24 border-t border-navy/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <div className="space-y-3 mb-16">
          <span className="text-xs font-bold text-teal tracking-widest uppercase px-3 py-1 bg-teal/10 rounded-full bangla-font">
            {t("hiw_subtitle")}
          </span>
          <h2
            id="how-it-works-title"
            className="text-3xl sm:text-4xl font-bold text-navy bangla-font"
          >
            {t("hiw_title")}
          </h2>
          <div className="w-16 h-1 bg-yellow mx-auto rounded-full"></div>
        </div>

        {/* Steps Grid */}
        <div
          ref={containerRef}
          id="steps-container"
          className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 max-w-5xl mx-auto items-stretch"
        >
          {/* Step 1 */}
          <div
            id="step-card-1"
            className={`flex flex-col items-center bg-white p-8 rounded-3xl border border-navy/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 text-center relative ${
              isIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {/* Step circle */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center font-bold text-sm bangla-font">
              {d("1", "১")}
            </div>
            {/* Step Icon */}
            <div className="p-4 rounded-2xl bg-teal/10 text-teal mb-6">
              <UserPlus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-3 bangla-font">{t("hiw_step1_title")}</h3>
            <p className="text-sm text-text-muted leading-relaxed bangla-font">
              {t("hiw_step1_desc")}
            </p>
          </div>

          {/* Desktop Arrow Connector 1 */}
          <div className="hidden md:flex absolute top-1/2 left-[31%] -translate-y-1/2 z-10 text-navy/30">
            <ChevronRight className="w-8 h-8 animate-pulse" />
          </div>

          {/* Step 2 */}
          <div
            id="step-card-2"
            className={`flex flex-col items-center bg-white p-8 rounded-3xl border border-navy/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 text-center relative ${
              isIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            {/* Step circle */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-yellow text-navy flex items-center justify-center font-bold text-sm bangla-font">
              {d("2", "২")}
            </div>
            {/* Step Icon */}
            <div className="p-4 rounded-2xl bg-yellow/15 text-yellow mb-6">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-3 bangla-font">{t("hiw_step2_title")}</h3>
            <p className="text-sm text-text-muted leading-relaxed bangla-font">
              {t("hiw_step2_desc")}
            </p>
          </div>

          {/* Desktop Arrow Connector 2 */}
          <div className="hidden md:flex absolute top-1/2 left-[64%] -translate-y-1/2 z-10 text-navy/30">
            <ChevronRight className="w-8 h-8 animate-pulse" />
          </div>

          {/* Step 3 */}
          <div
            id="step-card-3"
            className={`flex flex-col items-center bg-white p-8 rounded-3xl border border-navy/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 text-center relative ${
              isIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            {/* Step circle */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm bangla-font">
              {d("3", "৩")}
            </div>
            {/* Step Icon */}
            <div className="p-4 rounded-2xl bg-navy/10 text-navy mb-6">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-3 bangla-font">{t("hiw_step3_title")}</h3>
            <p className="text-sm text-text-muted leading-relaxed bangla-font">
              {t("hiw_step3_desc")}
            </p>
          </div>
        </div>

        {/* Safety Note */}
        <div className="mt-12 p-4 bg-navy/5 border border-navy/10 rounded-full inline-flex items-center gap-2 max-w-2xl text-xs sm:text-sm text-navy font-semibold px-6 shadow-sm bangla-font">
          <ShieldAlert className="w-4 h-4 text-yellow shrink-0" />
          <span>{t("hiw_safety")}</span>
        </div>
      </div>
    </section>
  );
}
