import { useState, useEffect } from "react";
import { ArrowDown, CheckCircle2, ShieldCheck, Award } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

interface HeroSectionProps {
  onJoinAsTutor: () => void;
  onSearchTutor: () => void;
}

export default function HeroSection({ onJoinAsTutor, onSearchTutor }: HeroSectionProps) {
  const { t } = useLanguage();
  
  const words = [t("easily"), t("securely"), t("reliably")];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 75 : 150;

    if (!isDeleting && displayedText === currentFullWord) {
      // Pause at full word
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    } else {
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? currentFullWord.substring(0, displayedText.length - 1)
          : currentFullWord.substring(0, displayedText.length + 1);
        setDisplayedText(nextText);
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentWordIndex, words]);

  const handleScrollDown = () => {
    document.getElementById("stats-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero-section"
      className="relative min-height-screen min-h-screen bg-white flex flex-col justify-center pt-24 pb-16 overflow-hidden select-none"
    >
      {/* Animated Floating Shapes (Rule 9) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft Yellow circle */}
        <div className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-yellow/10 blur-xl animate-float-1"></div>
        {/* Navy circle */}
        <div className="absolute bottom-1/4 right-20 w-36 h-36 rounded-full bg-navy/5 blur-2xl animate-float-2"></div>
        {/* Tiny teal accent dots */}
        <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-teal/20 animate-pulse-soft"></div>
        <div className="absolute bottom-1/3 left-1/5 w-6 h-6 rounded-full bg-yellow/15 animate-float-1"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Content */}
        <div id="hero-left-content" className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
          {/* Badge */}
          <div
            id="hero-badge"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy/5 border border-navy/10 text-xs sm:text-sm font-semibold text-navy shadow-sm animate-pulse-soft"
          >
            <span role="img" aria-label="Bangladesh Flag">🇧🇩</span>
            <span>{t("hero_badge")}</span>
          </div>

          {/* Heading with Typewriter */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-navy leading-tight sm:leading-none bangla-font"
          >
            {t("hero_heading")}, <br className="sm:hidden" />
            <span className="inline-block min-w-[150px] text-yellow border-r-3 border-yellow/80 pr-1 animate-pulse">
              {displayedText}
            </span>
          </h1>

          {/* Description */}
          <p id="hero-description" className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed bangla-font">
            {t("hero_desc")}
          </p>

          {/* CTA Buttons */}
          <div id="hero-ctas" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
            <button
              id="hero-btn-tutor"
              onClick={onJoinAsTutor}
              className="px-8 py-4 bg-yellow text-navy font-bold rounded-full text-base shadow-md hover:shadow-xl hover:bg-yellow/90 hover:scale-[1.03] active:scale-95 transition-all duration-300 text-center bangla-font"
            >
              {t("join_as_tutor")}
            </button>
            <button
              id="hero-btn-find"
              onClick={onSearchTutor}
              className="px-8 py-4 border-2 border-navy text-navy font-bold rounded-full text-base hover:bg-navy hover:text-white hover:scale-[1.03] active:scale-95 transition-all duration-300 text-center bangla-font"
            >
              {t("find_tutor_btn")}
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted font-medium pt-4 bangla-font">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-teal" /> {t("trust_1")}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-teal" /> {t("trust_2")}
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-teal" /> {t("trust_3")}
            </span>
          </div>
        </div>

        {/* Right Side SVG Connection Illustration */}
        <div id="hero-right-illustration" className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
            {/* Background glowing disk */}
            <div className="absolute inset-4 rounded-full bg-navy-bg/60 border border-navy/5 animate-pulse-soft"></div>
            
            {/* SVG Vector Drawing */}
            <svg
              className="w-full h-full drop-shadow-xl select-none"
              viewBox="0 0 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Central connection paths with animated dasharrays */}
              <path
                d="M120 380 C 200 350, 300 150, 380 120"
                stroke="#1B2F6E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="10, 10"
                className="opacity-40"
              />
              <path
                d="M120 380 C 150 250, 350 250, 380 120"
                stroke="#F5A623"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="8, 8"
                className="opacity-50"
              />

              {/* Secure Platform Shield (Center) */}
              <g className="float-1">
                {/* Outer Shield Backing */}
                <path
                  d="M250 170 L310 200 V270 C310 320, 250 350, 250 350 C250 350, 190 320, 190 270 V200 L250 170 Z"
                  fill="#1B2F6E"
                  className="drop-shadow-md"
                />
                {/* Inner Shield Overlay */}
                <path
                  d="M250 185 L295 210 V265 C295 305, 250 330, 250 330 C250 330, 205 305, 205 265 V210 L250 185 Z"
                  fill="#F5A623"
                />
                {/* Shield Checkmark Icon */}
                <path
                  d="M235 255 L247 267 L272 238"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Tutor Avatar Circle (Top Right) */}
              <g className="float-2">
                <circle cx="380" cy="120" r="55" fill="white" stroke="#1B2F6E" strokeWidth="4" />
                <circle cx="380" cy="120" r="48" fill="#F8F9FF" />
                {/* Tutor icon: Graduation Cap inside avatar */}
                <path
                  d="M380 95 L415 110 L380 125 L345 110 Z"
                  fill="#1B2F6E"
                />
                <path
                  d="M360 118 V135 C360 142, 380 145, 380 145 C380 145, 400 142, 400 135 V118"
                  fill="#1B2F6E"
                />
                <path
                  d="M403 113 V132"
                  stroke="#F5A623"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="403" cy="132" r="3" fill="#F5A623" />
                
                {/* Micro Verified badge */}
                <circle cx="415" cy="155" r="14" fill="#0F7B6C" />
                <path d="M410 155 L413 158 L420 151" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Student/Guardian Avatar Circle (Bottom Left) */}
              <g className="float-3">
                <circle cx="120" cy="380" r="55" fill="white" stroke="#1B2F6E" strokeWidth="4" />
                <circle cx="120" cy="380" r="48" fill="#F8F9FF" />
                {/* Guardian icon: House or Family */}
                <path
                  d="M120 355 L145 375 H135 V405 H105 V375 H95 Z"
                  fill="#1B2F6E"
                />
                {/* Heart in house representing caring guardian */}
                <path
                  d="M120 382 C120 382, 116 378, 116 376 C116 374.5, 117.5 373, 119 373 C119.6 373, 120 373.5, 120 373.5 C120 373.5, 120.4 373, 121 373 C122.5 373, 124 374.5, 124 376 C124 378, 120 382, 120 382 Z"
                  fill="#F5A623"
                />

                {/* Micro verified badge */}
                <circle cx="155" cy="345" r="14" fill="#F5A623" />
                <path d="M150 345 L153 348 L160 341" stroke="#1B2F6E" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Small accent items connected to center */}
              <g className="opacity-30">
                <circle cx="200" cy="120" r="8" fill="#1B2F6E" />
                <line x1="200" y1="120" x2="230" y2="150" stroke="#1B2F6E" strokeWidth="2" />
                <circle cx="320" cy="360" r="10" fill="#0F7B6C" />
                <line x1="320" y1="360" x2="290" y2="330" stroke="#0F7B6C" strokeWidth="2" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        id="hero-scroll-indicator"
        onClick={handleScrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-10 hover:opacity-85"
      >
        <span className="text-[10px] font-semibold text-text-muted tracking-wider uppercase bangla-font">{t("scroll_down")}</span>
        <div className="p-2 rounded-full bg-navy/5 text-navy border border-navy/10 animate-bounce">
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}
