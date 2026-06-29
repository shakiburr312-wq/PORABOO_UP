import { useEffect, useState } from "react";
import { useLanguage } from "../hooks/useLanguage";

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(() => setIsVisible(false), 300); // 300ms fade transition
    }, 1200); // Wait 1.2s before fading out (total 1.5s)

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-300 ease-in-out`}
      style={{ opacity: opacity / 100 }}
    >
      <div className="flex flex-col items-center max-w-sm w-full px-6">
        <h1 className="logo-font text-4xl sm:text-5xl font-bold text-navy tracking-tight mb-4 text-center">
          PORA<span className="text-yellow">BOO</span>
        </h1>
        
        {/* Progress Bar Container */}
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
          {/* Animated gradient progress */}
          <div className="h-full bg-gradient-to-r from-navy to-yellow animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
        </div>
        
        <p className="bangla-font text-text-muted font-medium tracking-wide">
          স্মার্ট টিউশন প্ল্যাটফর্ম
        </p>
      </div>
    </div>
  );
}
