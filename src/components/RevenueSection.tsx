import { useState, useEffect, useRef } from "react";
import { CircleDollarSign, ShieldCheck, HelpCircle, ChevronDown, Check, ArrowRight } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

export default function RevenueSection() {
  const { t } = useLanguage();
  const [isIntersected, setIsIntersected] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      q: t("faq_1_q"),
      a: t("faq_1_a")
    },
    {
      q: t("faq_2_q"),
      a: t("faq_2_a")
    },
    {
      q: t("faq_3_q"),
      a: t("faq_3_a")
    }
  ];

  return (
    <section
      ref={sectionRef}
      id="revenue-model"
      className="relative bg-white py-20 sm:py-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="space-y-3 text-center mb-16">
          <span className="text-xs font-bold text-teal tracking-widest uppercase px-3 py-1 bg-teal/10 rounded-full">
            {t("rev_badge")}
          </span>
          <h2
            id="revenue-title"
            className="text-3xl sm:text-4xl font-bold text-navy"
          >
            {t("rev_title")}
          </h2>
          <div className="w-16 h-1 bg-yellow mx-auto rounded-full"></div>
          <p className="text-sm sm:text-base text-text-muted max-w-xl mx-auto pt-1">
            {t("rev_desc")}
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-5xl mx-auto">
          {/* Left Column: Premium Highlighted Pricing Card */}
          <div
            id="revenue-highlight-card"
            className={`lg:col-span-6 flex flex-col justify-between p-8 sm:p-10 rounded-3xl border border-navy/10 bg-white shadow-xl relative overflow-hidden transition-all duration-700 ${
              isIntersected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            }`}
          >
            {/* Golden Ribbon accent */}
            <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden">
              <div className="absolute top-4 -right-10 bg-yellow text-navy font-bold text-[10px] uppercase py-1.5 px-10 rotate-45 tracking-wider shadow-sm text-center">
                {t("rev_ribbon")}
              </div>
            </div>

            <div className="space-y-6">
              {/* Icon */}
              <div className="p-4 rounded-full bg-navy text-yellow inline-flex">
                <CircleDollarSign className="w-10 h-10" />
              </div>

              {/* Central text */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-navy leading-snug">
                  {t("rev_take")} <span className="text-yellow text-4xl font-black">{t("rev_40_percent")}</span> {t("rev_of_first_month")}
                </h3>
                <p className="text-sm font-semibold text-teal flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" /> {t("rev_only_when_success")}
                </p>
              </div>

              {/* Subtext */}
              <p className="text-sm text-text-muted leading-relaxed">
                {t("rev_assignment_confirm")}
              </p>

              {/* Bullet points of trust */}
              <ul className="space-y-2.5 pt-2">
                <li className="flex items-start gap-2.5 text-xs text-text-muted">
                  <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <span>{t("rev_no_advance")}</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-text-muted">
                  <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <span>{t("rev_tutor_change")}</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-text-muted">
                  <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                  <span>{t("rev_secure_deal")}</span>
                </li>
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-navy/10 flex items-center justify-between">
              <span className="text-xs font-bold text-navy">{t("rev_see_faq")}</span>
              <button
                onClick={() => {
                  document.getElementById("faq-list")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue hover:text-navy hover:underline transition-all"
              >
                <span>{t("rev_faqs")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: FAQ Block */}
          <div
            id="faq-list"
            className={`lg:col-span-6 space-y-4 transition-all duration-700 ${
              isIntersected ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-teal" />
              <h3 className="text-lg font-bold text-navy">{t("rev_faq_title")}</h3>
            </div>

            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-navy-bg border border-navy/5 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-navy hover:bg-navy/5 transition-colors gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-navy/60 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-yellow" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[180px] border-t border-navy/10" : "max-h-0"
                    }`}
                  >
                    <p className="p-5 text-xs sm:text-sm text-text-muted leading-relaxed bg-white">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="p-4 bg-teal/5 border border-teal/10 rounded-2xl text-center mt-4">
              <p className="text-xs font-medium text-teal">
                {t("rev_contact")}{" "}
                <strong className="underline text-navy">support@poraboo.com</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
